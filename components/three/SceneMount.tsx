'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const CodeCube = dynamic(() => import('./CodeCube'), { ssr: false })

/**
 * The canvas is never part of the first paint.
 *
 * The largest element on the hero is its text, and it renders before any of
 * this loads. The scene downloads only once the browser is idle, only when it
 * is on screen, and never when motion is reduced or the device is small.
 */
export function SceneMount({ className = '' }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.innerWidth < 768) return

    const el = host.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200))
        idle(() => setShow(true))
      },
      { rootMargin: '128px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={host} className={className} aria-hidden>
      {show ? <CodeCube /> : null}
    </div>
  )
}
