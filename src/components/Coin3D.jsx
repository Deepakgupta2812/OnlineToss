import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function CoinMesh({ phase, result }) {
  const groupRef = useRef()
  const anim = useRef({ spinSpeed: 0, startTime: 0, settled: false })

  useEffect(() => {
    if (phase === 'tossing') {
      anim.current.spinSpeed = 25
      anim.current.startTime = performance.now() / 1000
      anim.current.settled = false
    }
    if (phase === 'idle' || phase === 'countdown') {
      anim.current.spinSpeed = 0
      anim.current.settled = false
    }
    if (phase === 'result') {
      anim.current.settled = false
    }
  }, [phase])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const a = anim.current

    if (phase === 'idle') {
      groupRef.current.rotation.y += delta * 0.7
      groupRef.current.position.y = Math.sin(t * 0.9) * 0.1
      // Mouse tilt
      groupRef.current.rotation.x += (state.mouse.y * 0.25 - groupRef.current.rotation.x) * delta * 4
    } else if (phase === 'countdown') {
      groupRef.current.rotation.y += delta * 2
      groupRef.current.position.y = Math.sin(t * 2) * 0.06
    } else if (phase === 'tossing') {
      // Decelerate spin
      a.spinSpeed = Math.max(a.spinSpeed - delta * 10, 2)
      groupRef.current.rotation.y += delta * a.spinSpeed

      // Arc based on spin speed: launch up, come down as it slows
      const progress = 1 - (a.spinSpeed - 2) / 23 // 0→1 as it decelerates
      groupRef.current.position.y = Math.sin(progress * Math.PI) * 1.6
      groupRef.current.rotation.x = 0
    } else if (phase === 'result') {
      // Snap to show correct face
      const target = result === 'heads'
        ? Math.round(groupRef.current.rotation.y / (Math.PI * 2)) * Math.PI * 2
        : Math.round(groupRef.current.rotation.y / (Math.PI * 2)) * Math.PI * 2 + Math.PI

      groupRef.current.rotation.y += (target - groupRef.current.rotation.y) * Math.min(delta * 4, 1)
      groupRef.current.position.y += (0 - groupRef.current.position.y) * Math.min(delta * 6, 1)
      groupRef.current.rotation.x += (0 - groupRef.current.rotation.x) * Math.min(delta * 6, 1)

      // Landing bounce (damped)
      if (!a.settled) {
        const bounce = Math.sin(t * 14) * Math.exp(-t * 3) * 0.08
        groupRef.current.position.y += bounce
        if (Math.abs(bounce) < 0.001) a.settled = true
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Coin body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 0.13, 72]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#8B6000"
          emissiveIntensity={0.2}
          metalness={0.97}
          roughness={0.08}
          envMapIntensity={2}
        />
      </mesh>

      {/* Glowing rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.0, 0.07, 16, 72]} />
        <meshStandardMaterial
          color="#FFE566"
          emissive="#FFD700"
          emissiveIntensity={0.8}
          metalness={1}
          roughness={0.05}
        />
      </mesh>

      {/* Heads face — crown emboss */}
      <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.88, 64]} />
        <meshStandardMaterial color="#FFC200" metalness={0.99} roughness={0.06} emissive="#AA7700" emissiveIntensity={0.12} />
      </mesh>
      {/* Inner ring heads */}
      <mesh position={[0, 0.072, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 0.78, 64]} />
        <meshStandardMaterial color="#CC9900" metalness={1} roughness={0.05} emissive="#CC9900" emissiveIntensity={0.3} />
      </mesh>

      {/* Tails face — star emboss */}
      <mesh position={[0, -0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.88, 64]} />
        <meshStandardMaterial color="#E8A800" metalness={0.99} roughness={0.1} emissive="#996600" emissiveIntensity={0.1} />
      </mesh>
      {/* Inner ring tails */}
      <mesh position={[0, -0.072, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.72, 64]} />
        <meshStandardMaterial color="#BB8800" metalness={1} roughness={0.06} emissive="#BB8800" emissiveIntensity={0.25} />
      </mesh>
    </group>
  )
}

function Lights({ phase }) {
  const movingLight = useRef()
  useFrame(({ clock }) => {
    if (!movingLight.current) return
    const t = clock.elapsedTime
    movingLight.current.position.x = Math.sin(t * 0.6) * 3.5
    movingLight.current.position.z = Math.cos(t * 0.6) * 3.5
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight ref={movingLight} position={[3, 5, 3]} intensity={2.5} color="#FFE8B0" castShadow />
      <pointLight position={[-3, 2, 2]} intensity={2} color="#38BDF8" />
      <pointLight position={[3, -1, -2]} intensity={1} color="#FFD700" />
      {phase === 'tossing' && (
        <pointLight position={[0, 4, 0]} intensity={6} color="#FFD700" distance={8} decay={2} />
      )}
      {phase === 'result' && (
        <pointLight position={[0, 2, 2]} intensity={3} color="#FFD700" distance={5} decay={2} />
      )}
    </>
  )
}

export default function Coin3D({ phase, result }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.5, 3.8], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <Lights phase={phase} />
      <CoinMesh phase={phase} result={result} />
      <ContactShadows position={[0, -1.2, 0]} opacity={0.6} scale={5} blur={2.5} color="#FFD700" />
      <Environment preset="city" />
    </Canvas>
  )
}
