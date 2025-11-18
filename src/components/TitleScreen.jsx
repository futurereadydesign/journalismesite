import { useEffect, useRef, forwardRef } from 'react'
import { gsap } from 'gsap'

const TitleScreen = forwardRef(({ reducedMotion = false }, ref) => {
  const titleRef = useRef(null)
  const containerRef = useRef(null)

  // Expose container ref
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(containerRef.current)
      } else {
        ref.current = containerRef.current
      }
    }
  }, [ref])

  useEffect(() => {
    if (!titleRef.current) return

    if (reducedMotion) {
      // Simple fade for reduced motion - very fast
      gsap.set(titleRef.current, {
        opacity: 0,
        y: 10
      })
      gsap.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.2,
        ease: 'power2.out'
      })
    } else {
      // Snappy animation - much faster than before
      gsap.set(titleRef.current, {
        opacity: 0,
        y: 20,
        filter: 'blur(4px)'
      })
      gsap.to(titleRef.current, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.5,
        ease: 'power3.out'
      })
    }
  }, [reducedMotion])

  return (
    <div
      ref={containerRef}
      className="title-screen"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backgroundColor: '#FFFFFA',
        cursor: 'none'
      }}
    >
      <h1
        ref={titleRef}
        style={{
          fontSize: 'var(--step-4)',
          lineHeight: 'var(--lh-h1)',
          color: 'var(--color-black)',
          textAlign: 'center',
          maxWidth: '900px',
          padding: '0 2rem'
        }}
      >
        Co-creatie in de journalistiek
      </h1>
    </div>
  )
})

TitleScreen.displayName = 'TitleScreen'

export default TitleScreen

