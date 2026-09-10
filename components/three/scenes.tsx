'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { makeRng } from '@/lib/rng'
import type { SceneKey } from '@/content/types'

/**
 * One scene per mission.
 *
 * Each is a diagram that moves, not an ornament: it shows the actual shape of
 * the work — three codebases becoming one, an alert propagating, screens
 * migrating without downtime. A visitor who cannot read code can still read
 * these, which is the point.
 *
 * They share the single canvas supplied by `ScenePanel`, so only one WebGL
 * context ever exists and it is created the first time somebody asks for it.
 */

const AMBER = '#f5a742'
const CYAN = '#4fd1e0'
const VIOLET = '#b48cff'
const GREEN = '#7ec699'
const SLATE = '#3a4657'

const tmp = new THREE.Object3D()

/* ── TF1 · three systems, one codebase ───────────────────────────────────── */

function Convergence() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const count = 120
  const particles = useMemo(() => {
    const rand = makeRng(0x7f1)
    return Array.from({ length: count }, (_, i) => ({
      lane: i % 3,
      offset: rand(),
      speed: 0.16 + rand() * 0.1,
      // A tenth of the stream is an ad marker being swapped in flight.
      ad: rand() < 0.1,
    }))
  }, [])

  useFrame(({ clock }) => {
    const m = mesh.current
    if (!m) return
    const time = clock.getElapsedTime()

    particles.forEach((p, i) => {
      const t = (p.offset + time * p.speed) % 1
      const laneY = (p.lane - 1) * 1.15
      // Two straight runs joined at the waist: separate, then merged.
      const pos =
        t < 0.5
          ? new THREE.Vector3(-4 + t * 2 * 4, laneY, 0)
          : new THREE.Vector3((t - 0.5) * 2 * 4, laneY * (1 - (t - 0.5) * 2) + laneY * (t - 0.5) * 2, 0)
      if (t >= 0.5) {
        const k = (t - 0.5) * 2
        pos.set(k * 4, laneY * k, 0)
      }
      tmp.position.copy(pos)
      tmp.scale.setScalar(p.ad ? 0.15 : 0.09)
      tmp.updateMatrix()
      m.setMatrixAt(i, tmp.matrix)
      m.setColorAt(i, new THREE.Color(p.ad ? AMBER : SLATE))
    })
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.4} />
      </instancedMesh>

      {/* The three targets: Android TV, WebOS, WPE. */}
      {[-1, 0, 1].map((lane) => (
        <mesh key={lane} position={[4.3, lane * 1.15, 0]}>
          <boxGeometry args={[1.5, 0.95, 0.08]} />
          <meshStandardMaterial color={CYAN} transparent opacity={0.22} />
        </mesh>
      ))}

      {/* The waist — where three become one. */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

/* ── GoSecure · an alert propagating ─────────────────────────────────────── */

function AlertNetwork() {
  const nodes = useMemo(() => {
    const rand = makeRng(0x6053)
    return Array.from({ length: 44 }, () => ({
      pos: new THREE.Vector3((rand() - 0.5) * 8, 0, (rand() - 0.5) * 5),
    }))
  }, [])
  const source = useMemo(() => new THREE.Vector3(-1.4, 0, 0.6), [])
  const mesh = useRef<THREE.InstancedMesh>(null)
  const ring = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const cycle = clock.getElapsedTime() % 4
    const wave = cycle / 4

    if (ring.current) {
      const r = wave * 7
      ring.current.scale.setScalar(Math.max(r, 0.001))
      const material = ring.current.material as THREE.MeshBasicMaterial
      material.opacity = Math.max(0, 0.7 * (1 - wave))
    }

    const m = mesh.current
    if (!m) return
    nodes.forEach((node, i) => {
      const distance = node.pos.distanceTo(source)
      // A node lights up as the wave reaches it, then settles as acknowledged.
      const reached = wave * 7 > distance
      const heat = reached ? Math.max(0, 1 - (wave * 7 - distance) / 2.2) : 0
      tmp.position.copy(node.pos)
      tmp.scale.setScalar(0.09 + heat * 0.11)
      tmp.updateMatrix()
      m.setMatrixAt(i, tmp.matrix)
      m.setColorAt(i, new THREE.Color(SLATE).lerp(new THREE.Color(GREEN), heat))
    })
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  })

  return (
    <group rotation={[0.95, 0, 0]}>
      <gridHelper args={[10, 20, '#1d2530', '#161c25']} />
      <instancedMesh ref={mesh} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial roughness={0.5} />
      </instancedMesh>
      <mesh ref={ring} position={source.toArray()} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.988, 1, 96]} />
        <meshBasicMaterial color={AMBER} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={source.toArray()}>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}

/* ── TF1 Edito · migrating screen by screen ──────────────────────────────── */

function Migration() {
  const cols = 9
  const rows = 5
  const mesh = useRef<THREE.InstancedMesh>(null)
  const thresholds = useMemo(() => {
    const rand = makeRng(0xed17)
    return Array.from({ length: cols * rows }, (_, i) => (i % cols) / cols + rand() * 0.12)
  }, [])

  useFrame(({ clock }) => {
    const m = mesh.current
    if (!m) return
    const progress = (clock.getElapsedTime() % 7) / 7

    thresholds.forEach((threshold, i) => {
      const x = (i % cols) - (cols - 1) / 2
      const y = Math.floor(i / cols) - (rows - 1) / 2
      const migrated = THREE.MathUtils.clamp((progress - threshold) * 8, 0, 1)
      tmp.position.set(x * 0.72, y * 0.72 + 0.5, migrated * 0.25)
      tmp.scale.set(0.6, 0.6, 0.06)
      tmp.updateMatrix()
      m.setMatrixAt(i, tmp.matrix)
      m.setColorAt(i, new THREE.Color(VIOLET).lerp(new THREE.Color(CYAN), migrated))
    })
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh ref={mesh} args={[undefined, undefined, cols * rows]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.45} />
      </instancedMesh>
      {/* Service availability. It never moves — that is the whole claim. */}
      <mesh position={[0, -2.15, 0]}>
        <boxGeometry args={[6.5, 0.1, 0.1]} />
        <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

/* ── AI Desktop Studio · 310 actions, 26 families ────────────────────────── */

function McpConstellation() {
  const count = 310
  const mesh = useRef<THREE.InstancedMesh>(null)
  const group = useRef<THREE.Group>(null)
  const agent = useRef<THREE.Mesh>(null)

  const points = useMemo(() => {
    const golden = Math.PI * (3 - Math.sqrt(5))
    return Array.from({ length: count }, (_, i) => {
      const y = 1 - (i / (count - 1)) * 2
      const radius = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = golden * i
      return {
        pos: new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius).multiplyScalar(2.4),
        family: Math.floor(i / 12), // 26 families across 310 actions
      }
    })
  }, [])

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    if (group.current) group.current.rotation.y = time * 0.16

    const m = mesh.current
    if (!m) return
    // The agent walks a deterministic path; nodes flare as it passes.
    const step = Math.floor(time * 1.6) % count
    const target = points[step]
    if (agent.current) agent.current.position.lerp(target.pos, 0.12)

    points.forEach((p, i) => {
      const near = agent.current ? 1 - THREE.MathUtils.clamp(agent.current.position.distanceTo(p.pos) / 1.3, 0, 1) : 0
      tmp.position.copy(p.pos)
      tmp.scale.setScalar(0.035 + near * 0.075)
      tmp.updateMatrix()
      m.setMatrixAt(i, tmp.matrix)
      m.setColorAt(i, new THREE.Color(p.family % 2 ? SLATE : '#46536a').lerp(new THREE.Color(CYAN), near))
    })
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  })

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial roughness={0.5} />
      </instancedMesh>
      <mesh ref={agent}>
        <sphereGeometry args={[0.11, 20, 20]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={1} />
      </mesh>
    </group>
  )
}

/* ── panels · the chassis comes apart ────────────────────────────────────── */

const CHASSIS = [
  { size: [0.45, 3.4, 0.12], home: [-2.6, 0, 0], out: [-3.6, 0, 0], color: AMBER },
  { size: [1.5, 3.4, 0.12], home: [-1.45, 0, 0], out: [-2.1, 0, 0.9], color: SLATE },
  { size: [2.6, 2.4, 0.12], home: [0.7, 0.5, 0], out: [0.7, 0.9, 1.4], color: CYAN },
  { size: [2.6, 0.8, 0.12], home: [0.7, -1.3, 0], out: [0.7, -2.1, 0.7], color: SLATE },
  { size: [0.45, 3.4, 0.12], home: [2.6, 0, 0], out: [3.6, 0, 0], color: AMBER },
] as const

function PanelChassis() {
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return
    const t = (Math.sin(clock.getElapsedTime() * 0.55) + 1) / 2
    g.children.forEach((child, i) => {
      const spec = CHASSIS[i]
      child.position.set(
        THREE.MathUtils.lerp(spec.home[0], spec.out[0], t),
        THREE.MathUtils.lerp(spec.home[1], spec.out[1], t),
        THREE.MathUtils.lerp(spec.home[2], spec.out[2], t),
      )
    })
    g.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.3
  })

  return (
    <group ref={group}>
      {CHASSIS.map((spec, i) => (
        <mesh key={i} position={spec.home as unknown as [number, number, number]}>
          <boxGeometry args={spec.size as unknown as [number, number, number]} />
          <meshStandardMaterial color={spec.color} transparent opacity={0.55} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

/* ── media-studio · tracks composing ─────────────────────────────────────── */

const TRACKS = [CYAN, VIOLET, AMBER, GREEN, SLATE] as const

function TimelineDepth() {
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return
    // Spread apart, then flatten — that flattening is the export.
    const t = (Math.sin(clock.getElapsedTime() * 0.5) + 1) / 2
    g.children.forEach((child, i) => {
      child.position.z = (i - 2) * 0.65 * t
      child.position.y = (i - 2) * 0.42 * t
    })
    g.rotation.y = 0.55 + Math.sin(clock.getElapsedTime() * 0.25) * 0.18
    g.rotation.x = -0.25
  })

  return (
    <group ref={group}>
      {TRACKS.map((color) => (
        <mesh key={color} position={[0, 0, 0]}>
          <boxGeometry args={[5, 0.9, 0.05]} />
          <meshStandardMaterial color={color} transparent opacity={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

/* ── Enigma Cube · the world's own geometry ──────────────────────────────── */

function VoxelWorld() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const size = 6
  const cells = useMemo(() => {
    const rand = makeRng(0xc0be)
    const out: { home: THREE.Vector3; scatter: THREE.Vector3; color: string }[] = []
    const half = (size - 1) / 2
    for (let x = 0; x < size; x++)
      for (let y = 0; y < size; y++)
        for (let z = 0; z < size; z++) {
          const shell = x === 0 || y === 0 || z === 0 || x === size - 1 || y === size - 1 || z === size - 1
          if (!shell || rand() > 0.6) continue
          out.push({
            home: new THREE.Vector3((x - half) * 0.5, (y - half) * 0.5, (z - half) * 0.5),
            scatter: new THREE.Vector3((rand() - 0.5) * 8, (rand() - 0.5) * 6, (rand() - 0.5) * 8),
            color: rand() < 0.2 ? AMBER : SLATE,
          })
        }
    return out
  }, [])

  useFrame(({ clock }) => {
    const m = mesh.current
    if (!m) return
    const t = (Math.sin(clock.getElapsedTime() * 0.4) + 1) / 2
    cells.forEach((cell, i) => {
      tmp.position.lerpVectors(cell.home, cell.scatter, t * t)
      tmp.rotation.set(t * 2, t * 3, 0)
      tmp.scale.setScalar(0.38)
      tmp.updateMatrix()
      m.setMatrixAt(i, tmp.matrix)
      m.setColorAt(i, new THREE.Color(cell.color))
    })
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
    m.rotation.y = clock.getElapsedTime() * 0.14
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, cells.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.45} />
    </instancedMesh>
  )
}

const SCENE_COMPONENTS: Record<SceneKey, () => React.ReactElement> = {
  convergence: Convergence,
  alertNetwork: AlertNetwork,
  migration: Migration,
  mcpConstellation: McpConstellation,
  panelChassis: PanelChassis,
  timelineDepth: TimelineDepth,
  codeCube: VoxelWorld,
}

export default function SceneById({ id }: { id: SceneKey }) {
  const Component = SCENE_COMPONENTS[id]
  return <Component />
}
