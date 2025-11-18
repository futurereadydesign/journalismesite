import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

const TouchFallback = ({ label = 'Continue', onAdvance, reducedMotion = false }) => {
  const buttonRef = useRef(null)

  const handleTap = () => {
    if (!buttonRef.current) return

    // Tap pulse animation
    const tl = gsap.timeline()
    tl.to(buttonRef.current, {
      scale: 1.05,
      duration: 0.15,
      ease: 'power2.out'
    })
    .to(buttonRef.current, {
      scale: 1.0,
      duration: 0.5,
      ease: 'power2.out'
    })

    if (onAdvance) {
      onAdvance()
    }
  }

  useEffect(() => {
    if (!buttonRef.current) return

    // Fade in on mount
    gsap.from(buttonRef.current, {
      opacity: 0,
      y: 20,
      duration: reducedMotion ? 0.3 : 0.6,
      ease: 'power2.out',
      delay: 0.3
    })
  }, [reducedMotion])

  return (
    <button
      ref={buttonRef}
      className="touch-fallback-button"
      onClick={handleTap}
      onTouchEnd={(e) => {
        e.preventDefault()
        handleTap()
      }}
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '200px',
        height: '72px',
        borderRadius: '50px',
        backgroundColor: '#F7D14C',
        color: '#1C1C1C',
        border: 'none',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        zIndex: 1000,
        willChange: 'transform',
        transition: reducedMotion ? 'opacity 0.3s ease' : 'none',
        outline: 'none',
        boxShadow: '0 2px 8px rgba(28, 28, 28, 0.2)'
      }}
      onFocus={(e) => {
        e.target.style.outline = '2px solid #7EB2DE'
        e.target.style.outlineOffset = '4px'
      }}
      onBlur={(e) => {
        e.target.style.outline = 'none'
      }}
      aria-label={`${label} to next slide`}
    >
      {label}
    </button>
  )
}

export default TouchFallback

