import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Props para configuración fácil
const GoogleParticleSphere = ({ count = 5000, radius = 2 }) => {
  const pointsRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  // 1. Generar posiciones y colores de partículas (solo una vez)
  const { positions, colors, originalPositions } = useMemo(() => {
    const pos = new Float32Array(count * 3); // 3 valores (x, y, z) por partícula
    const col = new Float32Array(count * 3); // 3 valores (r, g, b) por partícula
    const origPos = new Float32Array(count * 3); // Copia para la animación

    const colorA = new THREE.Color("#ff00ff"); // Rosa/Magenta
    const colorB = new THREE.Color("#00ffff"); // Cyan/Azul
    const tempColor = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Usamos coordenadas esféricas para distribuir puntos en una esfera
      // Esto crea una superficie esférica hueca
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u; // Longitud
      const phi = Math.acos(2 * v - 1); // Latitud

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;

      // Guardamos la posición original
      origPos[i3] = x;
      origPos[i3 + 1] = y;
      origPos[i3 + 2] = z;

      // 2. Asignar color basado en la posición (ej. por altura 'y')
      const lerpFactor = (y + radius) / (2 * radius); // Normaliza 'y' de 0 a 1
      tempColor.lerpColors(colorA, colorB, lerpFactor);

      col[i3] = tempColor.r;
      col[i3 + 1] = tempColor.g;
      col[i3 + 2] = tempColor.b;
    }

    return {
      positions: pos,
      colors: col,
      originalPositions: origPos,
    };
  }, [count, radius]);

  // 3. Animación en cada frame
  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const t = state.clock.elapsedTime;

    // --- Efecto 1: Rotación Lenta (default) ---
    if (!isHovered) {
      pointsRef.current.rotation.y += delta * 0.1;
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(
        pointsRef.current.rotation.x,
        0,
        0.05
      ); // Vuelve al centro
    }

    // --- Efecto 2: Pulso (Respiración) ---
    const pulse = 1 + Math.sin(t * 0.5) * 0.05; // Pulsa un 5%
    pointsRef.current.scale.set(pulse, pulse, pulse);

    // --- Efecto 3: Movimiento Aleatorio de Partículas ---
    // --- Efecto 4: Dinamismo en Hover ---
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position.array;

    // El factor de "ruido" es más rápido si está en hover
    const noiseFactor = isHovered ? 1.5 : 0.5;
    const movementRange = isHovered ? 0.1 : 0.05; // Se mueven más en hover

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Aplicamos un "ruido" basado en seno/coseno a la posición original
      posAttr[i3] =
        originalPositions[i3] + Math.sin(t * noiseFactor + i) * movementRange;
      posAttr[i3 + 1] =
        originalPositions[i3 + 1] +
        Math.cos(t * noiseFactor + i * 1.2) * movementRange;
      posAttr[i3 + 2] =
        originalPositions[i3 + 2] +
        Math.sin(t * noiseFactor + i * 1.5) * movementRange;
    }
    // ¡Importante! Notificar a Three.js que actualice los vértices
    geo.attributes.position.needsUpdate = true;

    // --- Efecto 4 (continuación): Rotar hacia el cursor en hover ---
    if (isHovered) {
      const targetRotationY = state.mouse.x * Math.PI * 0.25; // Rota con el mouse en X
      const targetRotationX = -state.mouse.y * Math.PI * 0.25; // Rota con el mouse en Y

      // Lerp (interpolación lineal) para una rotación suave
      pointsRef.current.rotation.y = THREE.MathUtils.lerp(
        pointsRef.current.rotation.y,
        targetRotationY,
        0.05
      );
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(
        pointsRef.current.rotation.x,
        targetRotationX,
        0.05
      );
    }
  });

  return (
    <points
      ref={pointsRef}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <bufferGeometry>
        {/* Asignamos los arrays creados a los atributos del buffer */}
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors={true} // ¡Clave para usar los colores que definimos!
        sizeAttenuation={true} // Partículas más lejanas se ven más pequeñas
        transparent={true} // Para un look más "suave"
        opacity={0.8}
        blending={THREE.AdditiveBlending} // Opcional: hace que los colores se sumen
      />
    </points>
  );
};

export default function GoogleSphereCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <GoogleParticleSphere />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.1}
        />
      </Canvas>
    </div>
  );
}
