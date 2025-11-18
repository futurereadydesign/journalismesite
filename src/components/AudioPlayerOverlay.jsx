import { useState, useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'

const AudioPlayerOverlay = ({ audioSrc, isVisible, onClose, autoPlay = false, title }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const audioRef = useRef(null)
  const progressBarRef = useRef(null)
  const overlayRef = useRef(null)

  // Initialize audio
  useEffect(() => {
    if (!audioRef.current || !audioSrc) return

    const audio = audioRef.current
    
    // Reset audio state
    audio.pause()
    audio.currentTime = 0
    
    // Clear previous source
    audio.removeAttribute('src')
    audio.load()
    
    // Set new source and load
    audio.src = audioSrc
    audio.preload = 'auto'
    
    // Force load when visible
    if (isVisible) {
      audio.load()
    }

    const handleLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration)
      }
    }

    const handleTimeUpdate = () => {
      if (!isDragging && audio.currentTime !== undefined) {
        setCurrentTime(audio.currentTime)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      // Auto-close overlay when audio ends
      setTimeout(() => {
        onClose()
      }, 500)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    const handleError = (e) => {
      console.error('Audio loading error:', e)
      console.error('Audio error details:', {
        code: audio.error?.code,
        message: audio.error?.message,
        src: audioSrc
      })
    }

    const handleCanPlay = () => {
      // Audio is ready to play
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration)
      }
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('error', handleError)
    }
  }, [audioSrc, isDragging, isVisible])

  // Animate overlay in/out and auto-play
  useEffect(() => {
    if (!overlayRef.current) return

    if (isVisible) {
      gsap.fromTo(overlayRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      )
      
      // Auto-play when overlay becomes visible
      if (autoPlay && audioRef.current) {
        const playAudio = async () => {
          try {
            await audioRef.current.play()
            setIsPlaying(true)
          } catch (error) {
            console.error('Error auto-playing audio:', error)
          }
        }
        // Small delay to ensure audio is loaded
        setTimeout(playAudio, 100)
      }
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
          }
          setCurrentTime(0)
          setIsPlaying(false)
        }
      })
    }
  }, [isVisible, autoPlay])

  const togglePlayPause = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        await audioRef.current.play()
      }
    } catch (error) {
      console.error('Error playing audio:', error)
    }
  }

  const handleProgressClick = (e) => {
    if (!audioRef.current || !progressBarRef.current) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * duration

    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleProgressMouseDown = (e) => {
    setIsDragging(true)
    handleProgressClick(e)
  }

  const handleProgressMouseMove = useCallback((e) => {
    if (!isDragging || !audioRef.current || !progressBarRef.current) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, mouseX / rect.width))
    const newTime = percentage * duration

    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }, [isDragging, duration])

  const handleProgressMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleProgressMouseMove)
      document.addEventListener('mouseup', handleProgressMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleProgressMouseMove)
        document.removeEventListener('mouseup', handleProgressMouseUp)
      }
    }
  }, [isDragging, handleProgressMouseMove, handleProgressMouseUp])

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  if (!isVisible && !isPlaying) return null

  return (
    <div className="audio-player-overlay" ref={overlayRef}>
      <div className="audio-player-content">
        {title && (
          <div className="audio-player-title">
            {title}
          </div>
        )}
        <div className="audio-player-controls">
          <button
            className="audio-player-play-pause"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>

          <div className="audio-player-progress-container">
            <div
              ref={progressBarRef}
              className="audio-player-progress-bar"
              onClick={handleProgressClick}
              onMouseDown={handleProgressMouseDown}
            >
              <div
                className="audio-player-progress-filled"
                style={{ width: `${progressPercentage}%` }}
              />
              <div
                className="audio-player-progress-handle"
                style={{ left: `${progressPercentage}%` }}
              />
            </div>
            <div className="audio-player-time">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <button
            className="audio-player-close"
            onClick={onClose}
            aria-label="Close audio player"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      <audio ref={audioRef} preload="auto">
        <source src={audioSrc} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}

export default AudioPlayerOverlay

