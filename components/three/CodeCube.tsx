'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { makeRng } from '@/lib/rng'

const SIZE = 8
const SPACING = 0.34
const CUBE_SCALE = 0.2

/**
 * Weighted, not rainbow. Most of the cube is the same graphite as the page,
 * so the few amber and cyan pieces read as accents rather than as confetti —
 * and the headline stays the brightest thing on the screen.
 */
const PALETTE: readonly [string, number][] = [
  ['#232b39', 0.62],
  ['#f5a742', 0.2],
  ['#4fd1e0', 0.09],
  ['#b48cff', 0.05],
  ['#6aa9f5', 0.04],
]

function pickColor(rand: () => number): string {
  let r = rand()
  for (const [hex, weight] of PALETTE) {
    r -= weight
    if (r <= 0) return hex
  }
  return PALETTE[0][0]
}

interface Voxel {
  readonly target: THREE.Vector3
  readonly start: THREE.Vector3
  readonly delay: number
  readonly color: THREE.Color
}

/**
 * Scattered lines of code that gather into a voxel cube — the shape Enigma
 * Cube is built from, so the one piece of pure decoration on the site still
 * points at something Alban actually made.
 */
function Voxels({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const group = useRef<THREE.Group>(null)
  const { viewport } = useThree()
  const clock = useRef(0)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const voxels = useMemo<Voxel[]>(() => {
    const rand = makeRng(0xa1ba9)
    const out: Voxel[] = []
    const half = (SIZE - 1) / 2
    // A hollow shell: the interior would never be seen and costs draw time.
    for (let x = 0; x < SIZE; x++) {
      for (let y = 0; y < SIZE; y++) {
        for (let z = 0; z < SIZE; z++) {
          const onShell =
            x === 0 || y === 0 || z === 0 || x === SIZE - 1 || y === SIZE - 1 || z === SIZE - 1
          if (!onShell) continue
          if (rand() > 0.72) continue // gaps keep it reading as code, not as a solid block

          const target = new THREE.Vector3((x - half) * SPACING, (y - half) * SPACING, (z - half) * SPACING)
          // Start life strung out along horizontal lines, like text.
          const start = new THREE.Vector3(
            (rand() - 0.5) * 14,
            (y - half) * SPACING * 2.4 + (rand() - 0.5) * 0.3,
            (rand() - 0.5) * 6 - 2,
          )
          out.push({
            target,
            start,
            delay: (y / SIZE) * 0.5 + rand() * 0.5,
            color: new THREE.Color(pickColor(rand)),
          })
        }
      }
    }
    return out
  }, [])

  useEffect(() => {
    const m = mesh.current
    if (!m) return
    voxels.forEach((v, i) => m.setColorAt(i, v.color))
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [voxels])

  useFrame((_, delta) => {
    const m = mesh.current
    if (!m) return
    clock.current += delta

    voxels.forEach((v, i) => {
      const t = THREE.MathUtils.clamp((clock.current - v.delay) / 2.1, 0, 1)
      // Ease-out-back: the pieces arrive and settle rather than slide to a stop.
      const e = 1 - Math.pow(1 - t, 3)
      dummy.position.lerpVectors(v.start, v.target, e)
      const s = CUBE_SCALE * (0.4 + 0.6 * e)
      dummy.scale.setScalar(s)
      dummy.rotation.set((1 - e) * 3, (1 - e) * 2, 0)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    })
    m.instanceMatrix.needsUpdate = true

    if (group.current) {
      const p = pointer.current ?? { x: 0, y: 0 }
      // Grow with the canvas so a wide desktop gets a wide field rather than
      // a small object marooned in the middle of it.
      const fit = THREE.MathUtils.clamp(viewport.width / 7, 0.85, 2.4)
      group.current.scale.setScalar(fit)
      group.current.position.x = viewport.width * 0.16
      group.current.rotation.y += delta * 0.085
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, p.y * 0.25, 0.05)
      group.current.position.x += THREE.MathUtils.lerp(0, p.x * 0.3, 0.05)
    }
  })

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, voxels.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.55} metalness={0.05} />
      </instancedMesh>
    </group>
  )
}

function Rig() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 0.1, 7.2)
    camera.lookAt(0, 0, 0)
  }, [camera])
  return null
}

export default function CodeCube() {
  const pointer = useRef({ x: 0, y: 0 })

  return (
    <div
      className="absolute inset-0"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        pointer.current = {
          x: ((e.clientX - r.left) / r.width) * 2 - 1,
          y: ((e.clientY - r.top) / r.height) * 2 - 1,
        }
      }}
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ fov: 34, near: 0.1, far: 60 }}
      >
        <Rig />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={1.15} />
        <directionalLight position={[-4, -2, -3]} intensity={0.4} color="#4fd1e0" />
        <Voxels pointer={pointer} />
      </Canvas>
    </div>
  )
}
