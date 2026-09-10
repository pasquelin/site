'use client'

import { Canvas } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import type { SceneKey } from '@/content/types'

const SceneById = dynamic(() => import('./scenes'), { ssr: false })

/**
 * The mission's scene, running inside its own source file.
 *
 * It shares the code block's surface — no box, no panel — but it is confined
 * to the margin the wrapped prose leaves free on the right, and fades in from
 * nothing. Shapes never pass under a letter: text on top of moving geometry
 * is unreadable at any opacity, so the answer is to keep them apart rather
 * than to dim one of them.
 *
 * Below 1280 px that free margin does not exist, so nothing renders at all.
 */
export function CodeAmbience({ scene, active }: { scene: SceneKey; active: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Narrower than this, the prose fills the block and there is no margin.
    if (window.innerWidth < 1280) return

    const el = host.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setMounted(entry.isIntersecting),
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={host}
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 w-[46%] overflow-hidden rounded-r-panel [mask-image:linear-gradient(to_right,transparent,black_38%,black)]"
    >
      {mounted ? (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: active ? 0.7 : 0.28 }}
        >
            <Canvas
              dpr={[1, 1.5]}
              gl={{ antialias: true, powerPreference: 'low-power' }}
              camera={{ position: [0, 1.2, 8.5], fov: 42 }}
            >
              <ambientLight intensity={0.7} />
              <directionalLight position={[4, 6, 5]} intensity={1.1} />
              <directionalLight position={[-5, -2, -4]} intensity={0.35} color="#4fd1e0" />
            <SceneById id={scene} />
          </Canvas>
        </div>
      ) : null}
    </div>
  )
}
