'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

/**
 * Le lapin blanc.
 *
 * « Suis le lapin blanc » sans lapin, ce n'est qu'une citation. Il traverse
 * donc l'écran pour de bon, en volume, par-dessus la pluie verte.
 *
 * Il est assemblé à partir de primitives — aucun fichier de modèle à charger,
 * donc rien à télécharger avant de le voir. La silhouette tient à trois choses :
 * les oreilles, le saut, et la queue qui suit avec un temps de retard.
 */

const WHITE = '#eef2f7'
const PINK = '#d7a8b4'

const HOP_SPEED = 4.6
const DURATION = 7

function Rabbit() {
  const group = useRef<THREE.Group>(null)
  // La course et la taille se déduisent de ce que la caméra voit réellement.
  // En unités fixes, le lapin était énorme en portrait et minuscule en large.
  const { viewport } = useThree()
  const travel = viewport.width + 4
  const scale = Math.min(viewport.height * 0.13, 0.62)
  const hopHeight = viewport.height * 0.1
  // Des groupes, pas des maillages : une oreille tourne depuis sa base, comme
  // sur un vrai lapin. En faisant pivoter la capsule elle-même, la rotation se
  // faisait autour de son milieu et l'oreille semblait décrochée de la tête.
  const earLeft = useRef<THREE.Group>(null)
  const earRight = useRef<THREE.Group>(null)
  const tail = useRef<THREE.Mesh>(null)
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    elapsed.current += delta
    const t = elapsed.current

    // Une avance régulière, et une hauteur en valeur absolue d'un sinus :
    // le lapin touche le sol à chaque creux au lieu d'onduler.
    const progress = Math.min(t / DURATION, 1)
    g.position.x = -travel / 2 + progress * travel
    const phase = t * HOP_SPEED
    const hop = Math.abs(Math.sin(phase))
    g.position.y = -viewport.height * 0.3 + hop * hopHeight

    // Le corps pique du nez en montant et se redresse en retombant — c'est la
    // vitesse verticale qui donne l'inclinaison, pas une valeur inventée.
    const vertical = Math.cos(phase) * Math.sign(Math.sin(phase) || 1)
    g.rotation.z = -vertical * 0.22
    // L'écrasement à l'atterrissage : large et bas au contact, étiré en l'air.
    const squash = 1 + (1 - hop) * 0.14
    g.scale.set(scale * squash, scale * (2 - squash), scale)

    // Les oreilles et la queue suivent avec un retard : sans ce décalage, tout
    // bouge d'un bloc et l'ensemble paraît rigide.
    const lag = Math.sin(phase - 0.9) * 0.26
    if (earLeft.current) earLeft.current.rotation.z = 0.2 + lag
    if (earRight.current) earRight.current.rotation.z = -0.2 + lag
    if (tail.current) tail.current.position.y = 0.16 + Math.sin(phase - 1.4) * 0.05
  })

  return (
    <group ref={group} rotation={[0, 0.18, 0]}>
      <mesh scale={[1.35, 0.82, 0.88]}>
        <sphereGeometry args={[0.5, 24, 20]} />
        <meshStandardMaterial color={WHITE} roughness={0.65} />
      </mesh>

      <mesh position={[0.58, 0.32, 0]} scale={[1.08, 0.94, 0.94]}>
        <sphereGeometry args={[0.3, 24, 20]} />
        <meshStandardMaterial color={WHITE} roughness={0.65} />
      </mesh>

      {/* Le museau : sans lui, la tête reste une sphère. */}
      <mesh position={[0.83, 0.24, 0]} scale={[1.1, 0.8, 0.8]}>
        <sphereGeometry args={[0.15, 16, 14]} />
        <meshStandardMaterial color={WHITE} roughness={0.7} />
      </mesh>

      {/* Chaque oreille est un groupe ancré à la base du crâne : la capsule
          est décalée vers le haut, si bien que la rotation du groupe la fait
          basculer depuis son attache. L'intérieur rosé voyage avec elle. */}
      <group ref={earLeft} position={[0.48, 0.52, 0.11]} rotation={[0, 0, 0.2]}>
        <mesh position={[0, 0.42, 0]}>
          <capsuleGeometry args={[0.075, 0.62, 6, 12]} />
          <meshStandardMaterial color={WHITE} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.44, 0.045]} scale={[0.55, 0.86, 0.4]}>
          <capsuleGeometry args={[0.075, 0.62, 5, 10]} />
          <meshStandardMaterial color={PINK} roughness={0.85} />
        </mesh>
      </group>
      <group ref={earRight} position={[0.48, 0.52, -0.11]} rotation={[0, 0, -0.2]}>
        <mesh position={[0, 0.42, 0]}>
          <capsuleGeometry args={[0.075, 0.62, 6, 12]} />
          <meshStandardMaterial color={WHITE} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.44, -0.045]} scale={[0.55, 0.86, 0.4]}>
          <capsuleGeometry args={[0.075, 0.62, 5, 10]} />
          <meshStandardMaterial color={PINK} roughness={0.85} />
        </mesh>
      </group>

      <mesh ref={tail} position={[-0.62, 0.16, 0]}>
        <sphereGeometry args={[0.15, 16, 14]} />
        <meshStandardMaterial color={WHITE} roughness={0.9} />
      </mesh>

      {/* Un œil visible suffit de profil ; deux donneraient un regard de face. */}
      <mesh position={[0.72, 0.4, 0.2]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#101318" roughness={0.3} />
      </mesh>
      <mesh position={[0.95, 0.24, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color={PINK} roughness={0.5} />
      </mesh>

      {/* Les pattes arrière, qui se détendent au décollage. */}
      <mesh position={[-0.3, -0.36, 0.22]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.11, 0.2, 5, 10]} />
        <meshStandardMaterial color={WHITE} roughness={0.7} />
      </mesh>
      <mesh position={[-0.3, -0.36, -0.22]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.11, 0.2, 5, 10]} />
        <meshStandardMaterial color={WHITE} roughness={0.7} />
      </mesh>
    </group>
  )
}

export default function WhiteRabbit() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 9], fov: 42 }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} />
      {/* Une lumière verte rasante : le lapin appartient à la pluie qu'il traverse. */}
      <directionalLight position={[-4, -2, 2]} intensity={0.7} color="#7ec699" />
      <Rabbit />
    </Canvas>
  )
}
