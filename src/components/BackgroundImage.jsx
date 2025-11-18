import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const BackgroundImage = ({ 
  src, 
  isActive, 
  reducedMotion = false,
  mouseX = 0,
  mouseY = 0
}) => {
  const bgRef = useRef(null)
  const parallaxRef = useRef(null)

  useEffect(() => {
    if (!parallaxRef.current || !isActive) return

    if (reducedMotion) {
      // Simple fade for reduced motion
      gsap.set(bgRef.current, {
        opacity: 0
      })
      gsap.set(parallaxRef.current, {
        scale: 1.05
      })
      gsap.to(bgRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
      })
      gsap.to(parallaxRef.current, {
        scale: 1,
        duration: 0.6,
        ease: 'power2.out'
      })
    } else {
      // Full animation with scale and blur on the image layer
      gsap.set(bgRef.current, {
        opacity: 0
      })
      gsap.set(parallaxRef.current, {
        scale: 1.08,
        filter: 'blur(6px)'
      })
      gsap.to(bgRef.current, {
        opacity: 1,
        duration: 1.8,
        ease: 'expo.out'
      })
      gsap.to(parallaxRef.current, {
        scale: 1,
        filter: 'blur(2px)',
        duration: 2.0,
        ease: 'expo.out'
      })
    }
  }, [isActive, reducedMotion])

  // Initialize quickTo for parallax (only once)
  useEffect(() => {
    if (!parallaxRef.current || reducedMotion) return

    if (!parallaxRef.current._xQuick) {
      parallaxRef.current._xQuick = gsap.quickTo(parallaxRef.current, "x", {
        duration: 1.5,
        ease: "power2.out"
      })
      parallaxRef.current._yQuick = gsap.quickTo(parallaxRef.current, "y", {
        duration: 1.5,
        ease: "power2.out"
      })
    }
  }, [reducedMotion])

  // Parallax effect (only if not reduced motion)
  useEffect(() => {
    if (reducedMotion || !parallaxRef.current || !isActive || !parallaxRef.current._xQuick) return

    // Calculate parallax movement based on mouse position
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const deltaX = (mouseX - centerX) / centerX
    const deltaY = (mouseY - centerY) / centerY

    // Far layer: 4-7px movement (using 6px for smooth effect)
    const targetX = deltaX * 6
    const targetY = deltaY * 6

    // Use quickTo for smooth parallax
    parallaxRef.current._xQuick(targetX)
    parallaxRef.current._yQuick(targetY)
  }, [mouseX, mouseY, isActive, reducedMotion])

  if (!src) return null

  return (
    <div
      ref={bgRef}
      className="background-image"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: isActive ? 1 : 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}
    >
      <div
        ref={parallaxRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '180%',
          height: '180%',
          transform: 'translate(-50%, -50%)',
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          willChange: 'transform'
        }}
      />
    </div>
  )
}

export default BackgroundImage

