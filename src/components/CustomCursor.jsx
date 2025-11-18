import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { gsap } from 'gsap'

const CustomCursor = forwardRef(({
  delayMs = 100,
  label = 'Continue',
  onAdvance,
  reducedMotion = false,
  isTouchDevice = false,
  size = 64
}, ref) => {
  const cursorRef = useRef(null)
  const xQuickRef = useRef(null)
  const yQuickRef = useRef(null)
  const timelineRef = useRef(null)
  const isVisibleRef = useRef(true)
  const isPausedRef = useRef(false)
  const blurHandlerRef = useRef(null)

  // Expose advance method via ref
  useImperativeHandle(ref, () => ({
    advance: () => {
      handleClick()
    },
    pulse: () => {
      handleSlideStart()
    },
    pause: () => {
      isPausedRef.current = true
    },
    resume: () => {
      isPausedRef.current = false
    }
  }))

  // Initialize cursor position and visibility
  useEffect(() => {
    if (isTouchDevice || !cursorRef.current) return

    const cursor = cursorRef.current
    
    // Initialize GSAP quickTo for smooth follow with ~180ms delay
    // Duration controls the follow speed (lower = snappier)
    xQuickRef.current = gsap.quickTo(cursor, "x", {
      duration: 1.0,
      ease: "power2.out"
    })
    yQuickRef.current = gsap.quickTo(cursor, "y", {
      duration: 1.0,
      ease: "power2.out"
    })
    
    // Set initial state - center of viewport
    const initialX = window.innerWidth / 2
    const initialY = window.innerHeight / 2
    gsap.set(cursor, {
      x: initialX,
      y: initialY,
      xPercent: -50,
      yPercent: -50,
      scale: reducedMotion ? 1 : 0,
      opacity: reducedMotion ? 0.75 : 0
    })

    // Fade in on mount
    if (!reducedMotion) {
      gsap.to(cursor, {
        scale: 1,
        opacity: 0.75,
        duration: 0.35,
        ease: 'power2.out'
      })
    } else {
      gsap.set(cursor, { opacity: 0.75 })
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [reducedMotion, isTouchDevice])

  // Mouse tracking with smooth follow using GSAP quickTo
  useEffect(() => {
    if (isTouchDevice || !cursorRef.current) return

    const handleMouseMove = (e) => {
      if (isPausedRef.current || !isVisibleRef.current || !cursorRef.current) return

      if (reducedMotion) {
        // In reduced motion, follow directly without inertia
        gsap.set(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          xPercent: -50,
          yPercent: -50
        })
      } else {
        // Use quickTo for smooth, inertial follow
        // The delay is built into the duration/ease of quickTo
        if (xQuickRef.current && yQuickRef.current) {
          xQuickRef.current(e.clientX)
          yQuickRef.current(e.clientY)
        }
      }
    }

    const handleMouseEnter = () => {
      isVisibleRef.current = true
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          opacity: 0.75,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
    }

    const handleMouseLeave = (e) => {
      // Hide cursor when mouse leaves the document
      if (e.clientY <= 0 || e.clientX <= 0 || 
          e.clientX >= window.innerWidth || 
          e.clientY >= window.innerHeight) {
        isVisibleRef.current = false
        if (cursorRef.current) {
          gsap.to(cursorRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
          })
        }
      }
    }

    // Handle mouse leaving the window entirely
    const handleMouseOut = (e) => {
      if (!e.relatedTarget && !e.toElement) {
        isVisibleRef.current = false
        if (cursorRef.current) {
          gsap.to(cursorRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
          })
        }
      }
    }

    // Handle window blur (when user switches tabs/apps)
    blurHandlerRef.current = () => {
      isVisibleRef.current = false
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.out'
        })
      }
    }

    // Throttle mousemove for performance
    // GSAP quickTo already handles smooth interpolation, but we throttle the event
    let rafId = null
    const throttledMouseMove = (e) => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        handleMouseMove(e)
        rafId = null
      })
    }

    document.addEventListener('mousemove', throttledMouseMove, { passive: true })
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    document.addEventListener('mouseout', handleMouseOut, { passive: true })
    window.addEventListener('blur', blurHandlerRef.current)

    return () => {
      document.removeEventListener('mousemove', throttledMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseout', handleMouseOut)
      if (blurHandlerRef.current) {
        window.removeEventListener('blur', blurHandlerRef.current)
      }
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [reducedMotion, isTouchDevice])

  const handleClick = () => {
    if (!cursorRef.current) return

    // Click pulse animation
    const tl = gsap.timeline()
    tl.to(cursorRef.current, {
      scale: 1.08,
      duration: 0.15,
      ease: 'power2.out'
    })
    .to(cursorRef.current, {
      scale: 1.0,
      duration: 0.6,
      ease: 'power2.out'
    })

    if (onAdvance) {
      onAdvance()
    }
  }

  const handleSlideStart = () => {
    if (!cursorRef.current || reducedMotion) return

    // Gentle scale pulse on slide change (micro-interaction)
    // Scale up then settle back
    if (timelineRef.current) {
      timelineRef.current.kill()
    }
    timelineRef.current = gsap.timeline()
    timelineRef.current
      .to(cursorRef.current, {
        scale: 1.05,
        duration: 0.25,
        ease: 'power2.out'
      })
      .to(cursorRef.current, {
        scale: 1.0,
        duration: 0.6,
        ease: 'power2.out'
      })
  }

  // Don't render cursor on touch devices
  if (isTouchDevice) {
    return null
  }

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: `${size}px`,
        height: `${size}px`,
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform',
        mixBlendMode: 'normal'
      }}
    >
      <div
        className="cursor-circle"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: '#F7D14C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          boxSizing: 'border-box',
          opacity: 0.75
        }}
      >
        <span
          className="cursor-label"
          style={{
            color: '#1C1C1C',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.05em',
            textTransform: 'none',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        >
          {label}
        </span>
      </div>
    </div>
  )
})

CustomCursor.displayName = 'CustomCursor'

export default CustomCursor

