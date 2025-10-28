import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function NetworkSphere() {
  const pointsRef = useRef()
  const linesRef = useRef()
  const time = useRef(0)
  const mousePos = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  // Generar partículas en forma de esfera
  const { particles, originalPositions } = useMemo(() => {
    const positions = []
    const originals = []
    const particleCount = 300

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 2.5 + Math.random() * 0.5

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
  const lines = useMemo(() => {
    const linePositions = []
    const maxDistance = 1.2

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
        }
      }
    }

    return new Float32Array(linePositions)
  }, [particles])

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
      pointsRef.current.rotation.y = time.current * 0.3
      pointsRef.current.rotation.x = Math.sin(time.current * 0.2) * 0.2

      // Efecto de respiración
      const breathe = 1 + Math.sin(time.current * 2) * 0.05
      pointsRef.current.scale.set(breathe, breathe, breathe)

      // Interacción con el mouse - partículas se alejan del cursor
      const positions = pointsRef.current.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        const dx = positions[i] - mousePos.current.x * 3
        const dy = positions[i + 1] - mousePos.current.y * 3
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 2) {
          const force = (2 - distance) * 0.3
          positions[i] = originalPositions[i] + (dx / distance) * force
          positions[i + 1] = originalPositions[i + 1] + (dy / distance) * force
        } else {
          // Volver a la posición original suavemente
          positions[i] += (originalPositions[i] - positions[i]) * 0.1
          positions[i + 1] += (originalPositions[i + 1] - positions[i + 1]) * 0.1
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (linesRef.current) {
      linesRef.current.rotation.y = time.current * 0.3
      linesRef.current.rotation.x = Math.sin(time.current * 0.2) * 0.2
      
      const breathe = 1 + Math.sin(time.current * 2) * 0.05
      linesRef.current.scale.set(breathe, breathe, breathe)
    }
  })

  return (
    <group onPointerMove={handlePointerMove}>
      {/* Partículas */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#14b8a6"
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Líneas conectando partículas */}
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
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Partículas flotantes alrededor */}
      <FloatingParticles mousePos={mousePos} />
    </group>
  )
}

function FloatingParticles({ mousePos }) {
  const particlesRef = useRef()

  const { floatingParticles, originalFloating } = useMemo(() => {
    const positions = []
    const originals = []
    const count = 100

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10
      const y = (Math.random() - 0.5) * 10
      const z = (Math.random() - 0.5) * 10
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
      particlesRef.current.rotation.y += 0.001
      
      const positions = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        // Animación vertical sutil
        positions[i + 1] = originalFloating[i + 1] + Math.sin(state.clock.elapsedTime + i) * 0.05
        
        // Reacción al mouse (más sutil que las partículas principales)
        const dx = positions[i] - mousePos.current.x * 3
        const dy = positions[i + 1] - mousePos.current.y * 3
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 3) {
          const force = (3 - distance) * 0.05
          positions[i] += (dx / distance) * force
          positions[i + 1] += (dy / distance) * force
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={floatingParticles.length / 3}
          array={floatingParticles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#14b8a6"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function NetworkSphereCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <NetworkSphere />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}