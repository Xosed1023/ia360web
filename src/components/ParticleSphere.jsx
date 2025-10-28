import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function ParticleSphere() {
  const pointsRef = useRef()
  const linesRef = useRef()
  const time = useRef(0)
  const mousePos = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  // <-- CAMBIO: Variable de control para mostrar/ocultar líneas
  // Cambia esto a 'false' para ocultar las líneas
  const showLines = true;

  // Generar partículas densas en forma de esfera
  const { particles, originalPositions } = useMemo(() => {
    const positions = []
    const originals = []
    const particleCount = 5000

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 2.5 

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      positions.push(x, y, z)
      originals.push(x, y, z)
    }

    return {
      particles: new Float32Array(positions),
      originalPositions: originals
    }
  }, [])

  // Generar líneas conectando partículas cercanas
  const { lines, lineIndices } = useMemo(() => {
    // <-- CAMBIO: Si showLines es false, no calcules las líneas
    if (!showLines) {
      return { lines: new Float32Array(), lineIndices: [] };
    }
    
    const linePositions = []
    const indices = []
    const maxDistance = 0.1

    for (let i = 0; i < particles.length; i += 3) {
      for (let j = i + 3; j < particles.length; j += 3) {
        const dx = particles[i] - particles[j]
        const dy = particles[i + 1] - particles[j + 1]
        const dz = particles[i + 2] - particles[j + 2]
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (distance < maxDistance) {
          linePositions.push(
            particles[i], particles[i + 1], particles[i + 2],
            particles[j], particles[j + 1], particles[j + 2]
          )
          indices.push({ i1: i, i2: j })
        }
      }
    }

    return {
      lines: new Float32Array(linePositions),
      lineIndices: indices
    }
  // <-- CAMBIO: 'showLines' ahora es una dependencia
  }, [particles, showLines])

  // Capturar posición del mouse
  const handlePointerMove = (event) => {
    mousePos.current = {
      x: (event.point.x / viewport.width) * 2,
      y: (event.point.y / viewport.height) * 2
    }
  }

  // Animación
  useFrame(() => {
    time.current += 0.01

    if (pointsRef.current) {
      // Rotación suave
      pointsRef.current.rotation.y = time.current * 0.25
      pointsRef.current.rotation.x = Math.sin(time.current * 0.18) * 0.25

      // Efecto de respiración más sutil
      const breathe = 1 + Math.sin(time.current * 1.5) * 0.02

      const positions = pointsRef.current.geometry.attributes.position.array
      const colors = pointsRef.current.geometry.attributes.color.array

      for (let i = 0; i < positions.length; i += 3) {
        // Movimiento ondulante
        const wave = Math.sin(time.current * 2 + originalPositions[i] * 0.3) * 0.08

        // Transición de color entre teal y púrpura
        const colorShift = Math.sin(time.current * 0.5 + i * 0.01) * 0.5 + 0.5
        const color = new THREE.Color()
        color.lerpColors(
          new THREE.Color('red'), // Teal
          new THREE.Color('blue'), // Púrpura
          colorShift
        )
        
        colors[i] = color.r
        colors[i + 1] = color.g
        colors[i + 2] = color.b

        // Interacción con el mouse - explosión suave (Efecto de distorsión)
        const dx = positions[i] - mousePos.current.x * 4
        const dy = positions[i + 1] - mousePos.current.y * 4
        const dz = positions[i + 2]
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
        
        let targetX = originalPositions[i] * breathe + wave
        let targetY = originalPositions[i + 1] * breathe + wave
        let targetZ = originalPositions[i + 2] * breathe

        if (distance < 2.5) {
          // Explosión hacia afuera
          const force = (2.5 - distance) * 0.7
          targetX += (dx / distance) * force
          targetY += (dy / distance) * force
          targetZ += (dz / distance) * force * 0.3
        }

        // Interpolación suave
        positions[i] += (targetX - positions[i]) * 0.1
        positions[i + 1] += (targetY - positions[i + 1]) * 0.1
        positions[i + 2] += (targetZ - positions[i + 2]) * 0.1
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
      pointsRef.current.geometry.attributes.color.needsUpdate = true
    }

    // <-- CAMBIO: Solo actualiza las líneas si showLines es true y el ref existe
    if (showLines && linesRef.current) {
      linesRef.current.rotation.y = time.current * 0.25
      linesRef.current.rotation.x = Math.sin(time.current * 0.18) * 0.25
      
      const breathe = 1 + Math.sin(time.current * 1.5) * 0.02
      linesRef.current.scale.set(breathe, breathe, breathe)

      // Actualizar posiciones de líneas basado en las partículas
      const linePositions = linesRef.current.geometry.attributes.position.array
      const particlePositions = pointsRef.current.geometry.attributes.position.array
      
      let lineIndex = 0
      for (let i = 0; i < lineIndices.length; i++) {
        const idx1 = lineIndices[i].i1
        const idx2 = lineIndices[i].i2
        
        linePositions[lineIndex] = particlePositions[idx1]
        linePositions[lineIndex + 1] = particlePositions[idx1 + 1]
        linePositions[lineIndex + 2] = particlePositions[idx1 + 2]
        linePositions[lineIndex + 3] = particlePositions[idx2]
        linePositions[lineIndex + 4] = particlePositions[idx2 + 1]
        linePositions[lineIndex + 5] = particlePositions[idx2 + 2]
        
        lineIndex += 6
      }
      
      linesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  // Inicializar colores
  const initialColors = useMemo(() => {
    const colors = []
    for (let i = 0; i < particles.length / 3; i++) {
      colors.push(0.078, 0.722, 0.651) // Color teal inicial
    }
    return new Float32Array(colors)
  }, [particles])

  return (
    <group onPointerMove={handlePointerMove}>
      {/* Partículas con colores dinámicos */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={initialColors.length / 3}
            array={initialColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* <-- CAMBIO: Renderizado condicional de las líneas */}
      {showLines && (
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={lines.length / 3}
              array={lines}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#14b8a6"
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      )}

      {/* Partículas flotantes ambientales */}
      <FloatingParticles mousePos={mousePos} timeRef={time} />
    </group>
  )
}

function FloatingParticles({ mousePos, timeRef }) {
  const particlesRef = useRef()

  const { floatingParticles, originalFloating } = useMemo(() => {
    const positions = []
    const originals = []
    const count = 150

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 12
      const y = (Math.random() - 0.5) * 12
      const z = (Math.random() - 0.5) * 12
      positions.push(x, y, z)
      originals.push(x, y, z)
    }

    return {
      floatingParticles: new Float32Array(positions),
      originalFloating: originals
    }
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0008
      
      const positions = particlesRef.current.geometry.attributes.position.array
      const colors = particlesRef.current.geometry.attributes.color.array

      for (let i = 0; i < positions.length; i += 3) {
        // Movimiento vertical sutil
        positions[i + 1] = originalFloating[i + 1] + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.1
        
        // Cambio de color
        const colorShift = Math.sin(timeRef.current * 0.4 + i * 0.02) * 0.5 + 0.5
        const color = new THREE.Color()
        color.lerpColors(
          new THREE.Color('#14b8a6'),
          new THREE.Color('#06b6d4'),
          colorShift
        )
        colors[i] = color.r
        colors[i + 1] = color.g
        colors[i + 2] = color.b

        // Reacción al mouse
        const dx = positions[i] - mousePos.current.x * 4
        const dy = positions[i + 1] - mousePos.current.y * 4
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 4) {
          const force = (4 - distance) * 0.03
          positions[i] += (dx / distance) * force
          positions[i + 1] += (dy / distance) * force
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
      particlesRef.current.geometry.attributes.color.needsUpdate = true
    }
  })

  const initialColors = useMemo(() => {
    const colors = []
    for (let i = 0; i < floatingParticles.length / 3; i++) {
      colors.push(0.078, 0.722, 0.651)
    }
    return new Float32Array(colors)
  }, [floatingParticles])

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={floatingParticles.length / 3}
          array={floatingParticles}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={initialColors.length / 3}
          array={initialColors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function ParticleSphereCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <ParticleSphere />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.1}
        />
      </Canvas>
    </div>
  )
}