import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'

const AudioControl = ({ audioRef, isVisible = true }) => {
  const [isMuted, setIsMuted] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const buttonRef = useRef(null)

  // Handle mute/unmute
  const toggleMute = async () => {
    if (!audioRef?.current) return

    const audio = audioRef.current
    
    // Toggle mute state (works even if audio is paused)
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    audio.muted = newMutedState

    // If unmuting and audio is paused, try to start playing (if audio is set up)
    if (!newMutedState && audio.paused && audio.src) {
      setHasInteracted(true)
      try {
        // Wait for audio to be ready if needed
        if (audio.readyState < 2) {
          await new Promise((resolve) => {
            const handleCanPlay = () => {
              audio.removeEventListener('canplay', handleCanPlay)
              resolve()
            }
            audio.addEventListener('canplay', handleCanPlay)
            setTimeout(() => {
              audio.removeEventListener('canplay', handleCanPlay)
              resolve()
            }, 1000)
          })
        }
        await audio.play()
      } catch (err) {
        // Silently handle - audio might not be ready or autoplay blocked
        // Mute state is still toggled, so user can control it
      }
    }

    // Pulse animation on click
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.9,
        duration: 0.1,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1
      })
    }
  }

  // Auto-play audio on first user interaction (when audio should play)
  // Note: Audio only plays during slides, not on title screen
  useEffect(() => {
    if (!isVisible || !audioRef?.current || hasInteracted) return

    const audio = audioRef.current
    let interactionHandled = false

    const handleUserInteraction = async () => {
      if (interactionHandled || !audio) return
      
      // Only auto-play if we're past the title screen (slides section)
      // We check if audio has a src and is set up for slides
      if (audio.paused && audio.src && audio.loop) {
        interactionHandled = true
        setHasInteracted(true)

        try {
          // Wait for audio to be ready if needed
          if (audio.readyState < 2) {
            await new Promise((resolve) => {
              const handleCanPlay = () => {
                audio.removeEventListener('canplay', handleCanPlay)
                resolve()
              }
              audio.addEventListener('canplay', handleCanPlay)
              // Timeout after 2 seconds
              setTimeout(() => {
                audio.removeEventListener('canplay', handleCanPlay)
                resolve()
              }, 2000)
            })
          }
          await audio.play()
        } catch (err) {
          // Silently handle - audio might not be ready yet or autoplay blocked
        }
      }
    }

    // Small delay to ensure audio element is ready
    const timeoutId = setTimeout(() => {
      // Listen for user interactions
      const options = { passive: true, once: true }
      document.addEventListener('click', handleUserInteraction, options)
      document.addEventListener('keydown', handleUserInteraction, options)
      document.addEventListener('touchstart', handleUserInteraction, options)
      document.addEventListener('mousedown', handleUserInteraction, options)
    }, 200)

    return () => {
      clearTimeout(timeoutId)
      // Cleanup is handled by 'once: true' option
    }
  }, [isVisible, hasInteracted])

  if (!isVisible) return null

  return (
    <button
      ref={buttonRef}
      onClick={toggleMute}
      aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#1C1C1C',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1001,
        transition: 'transform 0.2s ease, opacity 0.2s ease',
        opacity: 0.9,
        padding: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
      }}
      onMouseEnter={(e) => {
        e.target.style.opacity = '1'
        e.target.style.transform = 'scale(1.05)'
      }}
      onMouseLeave={(e) => {
        e.target.style.opacity = '0.9'
        e.target.style.transform = 'scale(1)'
      }}
      onFocus={(e) => {
        e.target.style.outline = '2px solid #F7D14C'
        e.target.style.outlineOffset = '4px'
      }}
      onBlur={(e) => {
        e.target.style.outline = 'none'
      }}
    >
      {/* Speaker Icon SVG */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transition: 'opacity 0.2s ease'
        }}
      >
        {isMuted ? (
          // Muted icon (speaker with slash)
          <>
            <path
              d="M11 5L6 9H2V15H6L11 19V5Z"
              fill="#FFFFFA"
              stroke="#FFFFFA"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="23"
              y1="9"
              x2="17"
              y2="15"
              stroke="#FFFFFA"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="17"
              y1="9"
              x2="23"
              y2="15"
              stroke="#FFFFFA"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </>
        ) : (
          // Unmuted icon (speaker)
          <>
            <path
              d="M11 5L6 9H2V15H6L11 19V5Z"
              fill="#FFFFFA"
              stroke="#FFFFFA"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.07 4.93C20.9447 6.80759 21.9979 9.34823 21.9979 12C21.9979 14.6518 20.9447 17.1924 19.07 19.07"
              stroke="#FFFFFA"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 12C17.0039 13.3308 16.4774 14.6024 15.54 15.54"
              stroke="#FFFFFA"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
      </svg>
    </button>
  )
}

export default AudioControl

