import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const Slide = ({ children, isActive, reducedMotion = false, previousActive = false }) => {
  const slideRef = useRef(null)
  const contentRef = useRef(null)
  const wasActiveRef = useRef(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!slideRef.current || !contentRef.current) return

    // Handle slide becoming inactive (outgoing animation)
    if (wasActiveRef.current && !isActive) {
      setIsAnimating(true)
      if (reducedMotion) {
        // Simple fade out for reduced motion
        gsap.to(contentRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.4,
          ease: 'power2.out',
          onComplete: () => {
            // Reset after animation
            gsap.set(contentRef.current, {
              opacity: 0,
              y: 20
            })
            const resetHighlights = contentRef.current.querySelectorAll('.highlight-me')
            resetHighlights.forEach(highlight => {
              highlight.style.setProperty('--highlight-scale', '0')
            })
            setIsAnimating(false)
          }
        })
      } else {
        // Full outgoing animation: scroll up, fade out, blur
        gsap.to(contentRef.current, {
          y: -60,
          opacity: 0,
          filter: 'blur(8px)',
          duration: 1.0,
          ease: 'power3.out',
          onComplete: () => {
            // Reset after animation completes
            gsap.set(contentRef.current, {
              opacity: 0,
              y: 40,
              filter: 'blur(10px)'
            })
            const resetHighlights = contentRef.current.querySelectorAll('.highlight-me')
            resetHighlights.forEach(highlight => {
              highlight.style.setProperty('--highlight-scale', '0')
            })
            setIsAnimating(false)
          }
        })
      }
    }

    // Handle slide becoming active (incoming animation)
    if (isActive && !wasActiveRef.current) {
      setIsAnimating(true)

      // Get all highlight elements
      const highlights = contentRef.current.querySelectorAll('.highlight-me')
      
      // Animate in
      if (reducedMotion) {
        // Simple fade for reduced motion
        gsap.set(contentRef.current, { opacity: 0, y: 20 })
        highlights.forEach(highlight => {
          highlight.style.setProperty('--highlight-scale', '0')
        })
        gsap.to(contentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => {
            // Animate highlights after fade-in
            highlights.forEach((highlight, index) => {
              gsap.to(highlight, {
                '--highlight-scale': 1,
                duration: 0.4,
                ease: 'power2.out',
                delay: index * 0.1
              })
            })
            setIsAnimating(false)
          }
        })
      } else {
        // Set initial state for incoming animation
        gsap.set(contentRef.current, {
          opacity: 0,
          y: 40,
          filter: 'blur(10px)'
        })
        // Set highlights to scaleX(0) via CSS custom property
        highlights.forEach(highlight => {
          highlight.style.setProperty('--highlight-scale', '0')
        })
        
        // If there was a previous active slide, add a pause before animating in
        // Outgoing animation takes 1.0s, so we wait 1.0s + pause (0.3s) = 1.3s total
        // Otherwise animate in immediately (first slide)
        const pauseDuration = previousActive ? 1.3 : 0
        
        // Animate text in after pause
        gsap.to(contentRef.current, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.4,
          ease: 'expo.out',
          delay: pauseDuration,
          onComplete: () => {
            // Start highlight animation after text animation completes
            highlights.forEach((highlight, index) => {
              gsap.to(highlight, {
                '--highlight-scale': 1,
                duration: 0.8,
                ease: 'power2.out',
                delay: index * 0.15
              })
            })
            setIsAnimating(false)
          }
        })
      }
    } else if (!wasActiveRef.current && !isActive) {
      // Initial reset for slides that haven't been active yet
      gsap.set(contentRef.current, {
        opacity: 0,
        y: reducedMotion ? 20 : 40,
        filter: reducedMotion ? 'none' : 'blur(10px)'
      })
      const resetHighlights = contentRef.current.querySelectorAll('.highlight-me')
      resetHighlights.forEach(highlight => {
        highlight.style.setProperty('--highlight-scale', '0')
      })
    }

    // Update wasActiveRef for next render
    wasActiveRef.current = isActive
  }, [isActive, reducedMotion, previousActive])

  return (
    <div
      ref={slideRef}
      className="slide"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Keep slide visible during transitions (opacity controlled by GSAP)
        opacity: 1,
        pointerEvents: isActive ? 'auto' : 'none',
        // Only hide when completely inactive and animation is done
        visibility: isActive || isAnimating ? 'visible' : 'hidden',
        zIndex: isActive ? 2 : (isAnimating ? 1 : 0)
      }}
    >
      <div
        ref={contentRef}
        className="slide-content"
      >
        {children}
      </div>
    </div>
  )
}

export default Slide

