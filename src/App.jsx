import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
import CustomCursor from './components/CustomCursor'
import Slide from './components/Slide'
import TouchFallback from './components/TouchFallback'
import TitleScreen from './components/TitleScreen'
import BackgroundImage from './components/BackgroundImage'
import AudioControl from './components/AudioControl'
import DraggableImageStack from './components/DraggableImageStack'
import Highlight from './components/Highlight'
import AudioPlayerOverlay from './components/AudioPlayerOverlay'
import ChapterFABMobile from './components/ChapterFABMobile'
import ChapterSheetMobile from './components/ChapterSheetMobile'
import ChapterRailDesktop from './components/ChapterRailDesktop'
import './styles.css'

// Background images for each slide
const backgrounds = [
  "/bg/slide1.png",
  "/bg/slide2.png",
  "/bg/slide3.png"
]

// Chapters data structure
const CHAPTERS = [
  {
    id: 1,
    title: "Fortythree",
    slug: "fortythree",
  },
  {
    id: 2,
    title: "Ik blijf bij deze groep als jullie nederlands praten",
    shortTitle: "Ik blijf bij deze groep",
    slug: "ik-blijf-bij-deze-groep",
  },
  {
    id: 3,
    title: "Love language",
    slug: "love-language",
  },
  {
    id: 4,
    title: "Law of two feet",
    slug: "law-of-two-feet",
  },
  {
    id: 5,
    title: "All Ideas are good ideas",
    slug: "all-ideas-are-good-ideas",
  },
  {
    id: 6,
    title: "How can we talk about waiting",
    shortTitle: "About waiting",
    slug: "how-can-we-talk-about-waiting",
  },
  {
    id: 7,
    title: "Everyone can travel",
    slug: "everyone-can-travel",
  },
  {
    id: 8,
    title: "Somehow I adapted",
    slug: "somehow-i-adapted",
  },
]

function App() {
  const [showTitleScreen, setShowTitleScreen] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(-1) // -1 means title screen, 0-2 are slides
  const [previousSlide, setPreviousSlide] = useState(-1) // Track previous slide for transitions
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [introComplete, setIntroComplete] = useState(false)
  const [showAudioOverlay, setShowAudioOverlay] = useState(false)
  const [showBowlingAudioOverlay, setShowBowlingAudioOverlay] = useState(false)
  const [showSpokenwordAudioOverlay, setShowSpokenwordAudioOverlay] = useState(false)
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [isChapterSheetOpen, setIsChapterSheetOpen] = useState(false)
  const cursorRef = useRef(null)
  const containerRef = useRef(null)
  const liveRegionRef = useRef(null)
  const introRef = useRef(null)
  const titleScreenRef = useRef(null)
  const audioRef = useRef(null)
  const contentSectionRef = useRef(null)

  // Audio management - play during slides, stop on Begin
  useEffect(() => {
    if (!audioRef.current) return

    const audio = audioRef.current
    audio.volume = 0.7
    audio.loop = true
    audio.preload = 'auto'
  }, [])

  // Skip intro function (for skip link)
  const handleSkipIntro = useCallback(() => {
    // Stop audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.volume = 0.7
    }
    
    // Immediately mark intro as complete
    setIntroComplete(true)
    
    // Small delay to ensure DOM updates
    setTimeout(() => {
      // Scroll to top (content is now at top since marginTop becomes 0)
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }, 100)
  }, [reducedMotion])

  // Stop audio when Begin button is pressed
  const handleScrollToContent = useCallback(() => {
    // Stop and fade out audio
    if (audioRef.current) {
      const audio = audioRef.current
      if (!audio.paused) {
        const fadeDuration = 0.5
        const fadeSteps = 20
        const fadeInterval = (fadeDuration * 1000) / fadeSteps
        const initialVolume = audio.volume
        const volumeStep = initialVolume / fadeSteps
        let currentStep = 0

        const fadeOut = setInterval(() => {
          currentStep++
          audio.volume = Math.max(0, audio.volume - volumeStep)
          
          if (currentStep >= fadeSteps || audio.volume <= 0) {
            clearInterval(fadeOut)
            audio.pause()
            audio.currentTime = 0
            audio.volume = 0.7 // Reset volume
          }
        }, fadeInterval)
      } else {
        // If already paused, just reset
        audio.currentTime = 0
        audio.volume = 0.7
      }
    }

    // Fade out intro first
    if (introRef.current) {
      gsap.to(introRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          // Mark intro as complete to show content and allow scrolling
          setIntroComplete(true)
          
          // Small delay to ensure DOM updates
          setTimeout(() => {
            // Scroll to top (content is now at top since marginTop becomes 0)
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            })
          }, 150)
        }
      })
    }
  }, [reducedMotion])

  // Prevent scrolling during intro
  useEffect(() => {
    if (introComplete) {
      document.body.classList.remove('intro-active')
      return
    }

    // Add class to body to prevent scrolling
    document.body.classList.add('intro-active')

    const preventScroll = (e) => {
      // Prevent wheel scroll
      if (e.type === 'wheel') {
        e.preventDefault()
      }
      // Prevent touch scroll
      if (e.type === 'touchmove') {
        e.preventDefault()
      }
      // Prevent keyboard scroll (arrow keys, space, page down)
      if (e.type === 'keydown' && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(e.key)) {
        if (showTitleScreen || currentSlide >= 0) {
          e.preventDefault()
        }
      }
    }

    // Prevent scroll during intro
    window.addEventListener('wheel', preventScroll, { passive: false })
    window.addEventListener('touchmove', preventScroll, { passive: false })
    window.addEventListener('keydown', preventScroll)

    return () => {
      document.body.classList.remove('intro-active')
      window.removeEventListener('wheel', preventScroll)
      window.removeEventListener('touchmove', preventScroll)
      window.removeEventListener('keydown', preventScroll)
    }
  }, [introComplete, showTitleScreen, currentSlide])

  // Track mouse position for parallax
  useEffect(() => {
    if (isTouchDevice || reducedMotion) return

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isTouchDevice, reducedMotion])

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Detect touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      )
    }

    checkTouch()
    window.addEventListener('resize', checkTouch)
    return () => window.removeEventListener('resize', checkTouch)
  }, [])

  // Handle title screen enter
  const handleTitleEnter = useCallback(() => {
    if (titleScreenRef.current) {
      // Quick fade out animation
      gsap.to(titleScreenRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          setShowTitleScreen(false)
          setPreviousSlide(-1)
          setCurrentSlide(0)
          // Announce slide change
          if (liveRegionRef.current) {
            liveRegionRef.current.textContent = `Slide 1 of 3`
          }
          // Audio will start on next user interaction via AudioControl
          // The click that triggered handleTitleEnter counts as the interaction
          setTimeout(() => {
            if (audioRef.current && audioRef.current.paused) {
              audioRef.current.play().catch(err => {
                // Will play on next user interaction via AudioControl
              })
            }
          }, 100)
        }
      })
    } else {
      // Fallback if ref not available
      setShowTitleScreen(false)
      setPreviousSlide(-1)
      setCurrentSlide(0)
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = `Slide 1 of 3`
      }
      // Audio will start on next user interaction via AudioControl
      setTimeout(() => {
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current.play().catch(err => {
            // Will play on next user interaction via AudioControl
          })
        }
      }, 100)
    }
  }, [])

  // Handle slide advance
  const handleAdvance = useCallback(() => {
    if (currentSlide < 2) {
      setCurrentSlide((prev) => {
        setPreviousSlide(prev)
        const next = prev + 1
        // Announce slide change
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = `Slide ${next + 1} of 3`
        }
        return next
      })
    }
  }, [currentSlide])

  // Create slides - using useMemo to memoize and ensure handler access
  const SLIDES = useMemo(() => [
    {
      id: 1,
      content: (
        <div>
          <p className="slide-text">
            Deze website is een <span className="highlight-me">persoonlijk verslag</span> van twee journalisten en een schrijver die wilden weten: hoe doe je dat nou, verhalen maken met niet-journalisten?
          </p>
        </div>
      )
    },
    {
      id: 2,
      content: (
        <div>
          <p className="slide-text">
            Omdat het er niet alleen toe doet welke verhalen we vertellen, maar ook <span className="highlight-me">wie ze vertelt</span>. Wij hoorden te vaak dezelfde analyses vanuit hetzelfde perspectief en verlangden ernaar om op een andere manier te werken.
          </p>
        </div>
      )
    },
    {
      id: 3,
      content: (
        <div>
          <p className="slide-text p-mb-2">
            Daarom kozen we ervoor om te experimenteren met <span className="highlight-me">co-creatie</span> in de journalistiek. Hoe doe je dat, je eigen denkkaders openbreken en samenwerken aan een verhaal? En hoe niet?
          </p>
          <button 
            className="enter-button begin-button" 
            onClick={(e) => {
              e.stopPropagation()
              handleScrollToContent()
            }}
          >
            VOLG ONZE REIS
          </button>
        </div>
      )
    }
  ], [handleScrollToContent])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showTitleScreen) {
        // Title screen - any key to enter
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          if (cursorRef.current && cursorRef.current.advance && !isTouchDevice) {
            cursorRef.current.advance()
          } else {
            handleTitleEnter()
          }
        }
        return
      }

      // Slide navigation
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        if (currentSlide === 2) {
          handleScrollToContent()
        } else {
          if (cursorRef.current && cursorRef.current.advance && !isTouchDevice) {
            cursorRef.current.advance()
          } else {
            handleAdvance()
          }
        }
      } else if (e.key === 'ArrowRight' && currentSlide < 2) {
        e.preventDefault()
        if (cursorRef.current && cursorRef.current.advance && !isTouchDevice) {
          cursorRef.current.advance()
        } else {
          handleAdvance()
        }
      } else if (e.key === 'ArrowLeft' && currentSlide > 0) {
        e.preventDefault()
        setCurrentSlide((prev) => {
          setPreviousSlide(prev)
          const next = prev - 1
          if (liveRegionRef.current) {
            liveRegionRef.current.textContent = `Slide ${next + 1} of 3`
          }
          return next
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide, handleAdvance, handleTitleEnter, isTouchDevice, showTitleScreen, handleScrollToContent])

  // Pulse cursor on slide change
  useEffect(() => {
    if (isTouchDevice || currentSlide < 0 || showTitleScreen) return
    
    const timer = setTimeout(() => {
      if (cursorRef.current && cursorRef.current.pulse) {
        cursorRef.current.pulse()
      }
    }, 800)
    
    return () => clearTimeout(timer)
  }, [currentSlide, isTouchDevice, showTitleScreen])

  // Click anywhere to advance (desktop with cursor - works on title screen and slides)
  useEffect(() => {
    if (isTouchDevice || currentSlide === 2) return

    const handleClick = (e) => {
      // Don't advance if clicking on interactive elements
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
        return
      }
      
      // Trigger cursor click animation first
      if (cursorRef.current && cursorRef.current.advance) {
        cursorRef.current.advance()
      } else {
        if (showTitleScreen) {
          handleTitleEnter()
        } else {
          handleAdvance()
        }
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('click', handleClick)
      return () => container.removeEventListener('click', handleClick)
    }
  }, [isTouchDevice, handleAdvance, handleTitleEnter, showTitleScreen, currentSlide])

  // Scroll-driven animations for content area text
  useEffect(() => {
    if (!contentSectionRef.current || !introComplete || reducedMotion) return

    // Target all text elements: headings, paragraphs, and text containers
    // Include all paragraphs and headings within fortythree-section, including nested ones
    const textElements = contentSectionRef.current.querySelectorAll(
      '.fortythree-section h1, .fortythree-section h2, .fortythree-section p, .fortythree-section .section-title'
    )
    
    // Filter out elements that shouldn't be animated (like images, buttons, etc.)
    const filteredElements = Array.from(textElements).filter((el) => {
      // Exclude if it's an image, button, or inside a draggable stack
      if (el.tagName === 'IMG' || el.tagName === 'BUTTON' || el.closest('.draggable-image-stack')) {
        return false
      }
      // Only include if it has text content
      return el.textContent && el.textContent.trim().length > 0
    })

    if (filteredElements.length === 0) return

    // Use filtered elements
    const textElementsArray = filteredElements

    // Helper function to check if element is already in viewport
    const isElementInViewport = (el) => {
      const rect = el.getBoundingClientRect()
      const windowHeight = window.innerHeight
      // Element is considered in viewport if its top is above 70% of viewport
      return rect.top < windowHeight * 0.7
    }

    // Set initial state for all text elements
    textElementsArray.forEach((el) => {
      const isVisible = isElementInViewport(el)
      
      if (isVisible) {
        // If already visible, set to final state immediately
        gsap.set(el, {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0
        })
      } else {
        // Otherwise set to initial hidden state
        gsap.set(el, {
          opacity: 0,
          filter: 'blur(10px)',
          y: 40
        })
      }
    })

    // Animate each element as it enters viewport with smooth scrubbing
    const triggers = textElementsArray.map((el) => {
      return ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'top 70%',
        scrub: 1, // Smooth scrubbing (1 second lag for smooth feel)
        animation: gsap.fromTo(el, 
          {
            opacity: 0,
            filter: 'blur(10px)',
            y: 40
          },
          {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            ease: 'power2.out'
          }
        )
      })
    })

    // Refresh ScrollTrigger to recalculate positions
    ScrollTrigger.refresh()

    // Refresh again after content is fully loaded
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 300)
    
    // Also check on resize and refresh ScrollTrigger
    const resizeHandler = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', resizeHandler, { passive: true })

    return () => {
      // Cleanup ScrollTriggers on unmount
      triggers.forEach((trigger) => trigger && trigger.kill())
      window.removeEventListener('resize', resizeHandler)
    }
  }, [introComplete, reducedMotion])

  // Update current chapter index based on scroll position (for highlighting active chapter)
  useEffect(() => {
    if (!introComplete) return

    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      
      ticking = true
      requestAnimationFrame(() => {
        // Find which chapter is currently most visible in viewport
        let mostVisibleChapter = 0
        let maxVisibility = 0

        CHAPTERS.forEach((chapter, index) => {
          const chapterElement = document.getElementById(`chapter-${index + 1}`)
          if (!chapterElement) return

          const rect = chapterElement.getBoundingClientRect()
          const windowHeight = window.innerHeight
          
          // Calculate how much of the chapter is visible
          const visibleTop = Math.max(0, -rect.top)
          const visibleBottom = Math.max(0, windowHeight - rect.bottom)
          const visibleHeight = Math.min(rect.height, windowHeight) - visibleTop - visibleBottom
          const visibility = Math.max(0, visibleHeight) / Math.min(rect.height, windowHeight)

          if (visibility > maxVisibility) {
            maxVisibility = visibility
            mostVisibleChapter = index
          }
        })

        // Update current chapter index if a different chapter is most visible
        if (mostVisibleChapter !== currentChapterIndex && maxVisibility > 0.3) {
          setCurrentChapterIndex(mostVisibleChapter)
        }

        ticking = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [introComplete, currentChapterIndex])

  // Note: We don't unmount intro, just fade it out and disable pointer events
  // This allows the scroll to work properly

  return (
    <>
      {/* Skip Intro Link */}
      {!introComplete && (
        <a
          href="#content"
          onClick={(e) => {
            e.preventDefault()
            handleSkipIntro()
          }}
          className="skip-intro-link"
        >
          Skip Intro
        </a>
      )}

      <div
        ref={introRef}
        className={`intro-sequence ${introComplete ? 'complete' : ''}`}
      >
        <div
          ref={containerRef}
          className={`app-container ${isTouchDevice ? '' : 'no-cursor'}`}
        >
          {/* ARIA live region for screen readers */}
          <div
            ref={liveRegionRef}
            aria-live="polite"
            aria-atomic="true"
            className="aria-live-region"
          >
            {showTitleScreen ? 'Title screen' : `Slide ${currentSlide + 1} of 3`}
          </div>

          {/* Title Screen */}
          {showTitleScreen && (
            <TitleScreen
              ref={titleScreenRef}
              reducedMotion={reducedMotion}
            />
          )}

          {/* Background Images */}
          {!showTitleScreen && backgrounds.map((bg, index) => (
            <BackgroundImage
              key={index}
              src={bg}
              isActive={index === currentSlide}
              reducedMotion={reducedMotion}
              mouseX={mousePosition.x}
              mouseY={mousePosition.y}
            />
          ))}

          {/* Custom Cursor (desktop only - visible on title screen and slides) */}
          {!isTouchDevice && (
            <CustomCursor
              ref={cursorRef}
              delayMs={180}
              label={showTitleScreen ? "Enter" : "Continue"}
              onAdvance={showTitleScreen ? handleTitleEnter : (currentSlide === 2 ? handleScrollToContent : handleAdvance)}
              reducedMotion={reducedMotion}
              isTouchDevice={isTouchDevice}
              size={96}
            />
          )}

          {/* Slides */}
          {!showTitleScreen && (
            <div className="slides-container">
              {SLIDES.map((slide, index) => (
                <Slide
                  key={slide.id}
                  isActive={index === currentSlide}
                  previousActive={index === previousSlide}
                  reducedMotion={reducedMotion}
                >
                  {slide.content}
                </Slide>
              ))}
            </div>
          )}

          {/* Touch Fallback Button */}
          {isTouchDevice && !showTitleScreen && (
            <TouchFallback
              label="Continue"
              onAdvance={currentSlide === 2 ? handleScrollToContent : handleAdvance}
              reducedMotion={reducedMotion}
            />
          )}

          {/* Audio Control - Always visible */}
          <AudioControl audioRef={audioRef} isVisible={true} />

          {/* Audio Element */}
          <audio
            ref={audioRef}
            src="/audio/title-screen.mp3"
            loop={true}
            preload="auto"
            className="audio-hidden"
            onError={(e) => {
              console.warn('Audio file could not be loaded: /audio/title-screen.mp3')
            }}
          />

          {/* Slide Indicator */}
          {!showTitleScreen && (
            <div className="slide-indicator">
              {SLIDES.map((_, index) => (
                <div
                  key={index}
                  className={`slide-indicator-dot ${index === currentSlide ? 'active' : ''} ${isTouchDevice ? '' : 'no-cursor'}`}
                  onClick={() => {
                    if (isTouchDevice) {
                      setPreviousSlide(currentSlide)
                      setCurrentSlide(index)
                      if (liveRegionRef.current) {
                        liveRegionRef.current.textContent = `Slide ${index + 1} of 3`
                      }
                    }
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                  role="button"
                  tabIndex={isTouchDevice ? 0 : -1}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content (below intro) */}
      {introComplete && (
        <div 
          id="content" 
          ref={contentSectionRef} 
          className="content-wrapper"
        >
        <div className="content-container">
          
          {/* Chapter Navigation - Desktop Rail */}
          <ChapterRailDesktop
            chapters={CHAPTERS}
            currentChapterIndex={currentChapterIndex}
            onNavigate={(index) => {
              setCurrentChapterIndex(index)
              // Smooth scroll to chapter
              const chapterElement = document.getElementById(`chapter-${index + 1}`)
              if (chapterElement) {
                chapterElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            }}
          />
          
          {/* Chapter Content - Render all chapters stacked */}
          <Chapter1 onAudioClick={() => setShowAudioOverlay(true)} />
          <Chapter2 onBowlingAudioClick={() => setShowBowlingAudioOverlay(true)} />
          <Chapter3 />
          <Chapter4 />
          <Chapter5 onSpokenwordAudioClick={() => setShowSpokenwordAudioOverlay(true)} />
          {/* Add more chapters as needed */}
        </div>
      </div>
      )}

      {/* Audio Player Overlay */}
      <AudioPlayerOverlay
        audioSrc="/audio/HF1_Nr43_Juma.mp3"
        isVisible={showAudioOverlay}
        onClose={() => setShowAudioOverlay(false)}
        autoPlay={true}
        title="Fortythree"
      />

      {/* Bowling Audio Player Overlay */}
      <AudioPlayerOverlay
        audioSrc="/audio/bowling-ball.wav"
        isVisible={showBowlingAudioOverlay}
        onClose={() => setShowBowlingAudioOverlay(false)}
        autoPlay={true}
        title="Bowlen"
      />

      {/* Spokenword SAWA Audio Player Overlay */}
      <AudioPlayerOverlay
        audioSrc="/audio/LVAllideasaregoodideas1.mp3"
        isVisible={showSpokenwordAudioOverlay}
        onClose={() => setShowSpokenwordAudioOverlay(false)}
        autoPlay={true}
        title="Spokenword SAWA"
      />

      {/* Chapter Navigation - Mobile FAB */}
      {introComplete && (
        <ChapterFABMobile
          onClick={() => setIsChapterSheetOpen(true)}
        />
      )}

      {/* Chapter Navigation - Mobile Bottom Sheet */}
      <ChapterSheetMobile
        chapters={CHAPTERS}
        currentChapterIndex={currentChapterIndex}
        isOpen={isChapterSheetOpen}
        onClose={() => setIsChapterSheetOpen(false)}
        onNavigate={(index) => {
          setCurrentChapterIndex(index)
          // Smooth scroll to chapter
          const chapterElement = document.getElementById(`chapter-${index + 1}`)
          if (chapterElement) {
            chapterElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }}
      />
    </>
  )
}

// Chapter 1 Component
function Chapter1({ onAudioClick }) {
  return (
    <section 
      id="chapter-1"
      className="fortythree-section chapter" 
      data-chapter="1" 
      data-chapter-title="Fortythree"
    >
            {/* Title */}
            <div className="grid-item section-title-wrapper">
              <span className="chapter-label">Hoofdstuk 1</span>
              <h1 className="section-title section-title-with-audio">
                <span>Fortythree</span>
                <button 
                  className="audio-button"
                  aria-label="Play audio"
                  onClick={onAudioClick}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                </button>
              </h1>
            </div>

            {/* First English Paragraph */}
            <p className="grid-item paragraph-base p-mb-2">
              I was in <Highlight>Italian prison for 15 days</Highlight>. "Nr. 43, come and get
              your food." If you travel from Romenia to Bulgaria to
              Austria, it takes six months. What if someone tries to
              call? What if it doesn't work? How will you ever find
              them?
            </p>

            {/* Quote Section with highlight and audio */}
            <div className="grid-item grid-item-spacing">
              <p className="large-quote">
                "Someone tried to call me."
              </p>
              <p className="large-quote">
                <Highlight>"I was in jail."</Highlight>
                <span className="inline-mr">OK.</span>
              </p>
            </div>

            {/* Second English Paragraph */}
            <p className="grid-item paragraph-base p-mb-3">
              They gave me a number, not a name. All my life I will never forget this I
              could have died. They just threw me out in the highway. "Who is this nr.
              43?"
            </p>

            {/* Image and Quote Section */}
            <div className="grid-item image-quote-section">
              {/* Card Image - spans columns 1-5 */}
              <div className="card-image-container">
                <div className="card-image-wrapper">
                  <img 
                    src="/images/1.1_nummer 43-resized-to-medium.jpeg"
                    alt="Card with number 43"
                    className="card-image"
                  />
                </div>
              </div>

              {/* Large Quote - spans columns 7-12 */}
              <div className="large-quote-container">
                <p className="large-quote">
                  "Juma has
                  dissapeared"
                </p>
              </div>
            </div>

            {/* Dutch Paragraph - Narrator */}
            <p className="grid-item narrator-text grid-item-spacing-large">
              Deze reis begint in maart 2025. Het zal een paar maanden duren voordat we
              richting hebben gekozen en weten met wie we gaan werken. Twee
              communities, of één? Is het erg dat de communities waar we de beste
              ingang hebben zich in grote progressieve steden bevinden, in de Randstad?
              En wat betekent het dat we verschillende achtergronden hebben:
              journalist, filmmaker, podcastmaker, architect, theatermaker, literair
              auteur. Vullen we elkaar daarmee aan, of wordt het lastig elkaar te
              begrijpen?
            </p>
          </section>
  )
}

// Chapter 2 Component
function Chapter2({ onBowlingAudioClick }) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Images for the draggable stack (2.1.A to 2.1.G)
  // More organic, natural stacking with varied rotations and offsets
  const stackImages = [
    {
      src: "/images/2.1.A_Radioworkshop_SAWA_IMG_3337-resized-to-medium.jpeg",
      alt: "Radioworkshop SAWA",
      rotation: -3,
      left: "0px",
      top: "0px",
      width: 300,
      height: 400,
      key: "2.1.A"
    },
    {
      src: "/images/2.1.AA_250910_VK_zwarte_koffie_3_5-resized-to-medium.jpeg",
      alt: "Zwarte koffie Voorkamer",
      rotation: 4,
      left: "35px",
      top: "28px",
      width: 300,
      height: 400,
      key: "2.1.AA"
    },
    {
      src: "/images/2.1.B_Taalcafeboost-resized-to-medium.jpeg",
      alt: "Taalcafé",
      rotation: -2,
      left: "70px",
      top: "56px",
      width: 300,
      height: 400,
      key: "2.1.B"
    },
    {
      src: "/images/2.1.E_Sjoelen-resized-to-medium.jpeg",
      alt: "Sjoelen",
      rotation: 3,
      left: "105px",
      top: "84px",
      width: 300,
      height: 400,
      key: "2.1.E"
    },
    {
      src: "/images/2.1.G_Radioworkshop_SAWA_IMG_3352-resized-to-medium.jpeg",
      alt: "Radioworkshop SAWA 2",
      rotation: -4,
      left: "140px",
      top: "112px",
      width: 300,
      height: 400,
      key: "2.1.G"
    }
  ]

  return (
    <section 
      id="chapter-2"
      className="fortythree-section chapter" 
      data-chapter="2" 
      data-chapter-title="Ik blijf bij deze groep als jullie nederlands praten"
    >
      {/* Title */}
      <div className="grid-item section-title-wrapper">
        <span className="chapter-label">Hoofdstuk 2</span>
        <h1 className="section-title">
          Ik blijf bij deze groep als jullie nederlands praten
        </h1>
      </div>

      {/* Image Stack */}
      <div className="grid-item grid-item-spacing">
        <DraggableImageStack 
          images={stackImages} 
          reducedMotion={reducedMotion}
        />
      </div>

      {/* First Paragraph */}
      <p className="grid-item paragraph-base p-mb-3">
        Het kost tijd om een band op te bouwen. Voor je je aandacht kan richten op een journalistiek product moet je agendaloos onderzoeken welke relaties je al hebt, welke je kan opbouwen.
      </p>

      {/* Activities Paragraph */}
      <p className="grid-item paragraph-base p-mb-3">
        We nemen deel aan de aanschuiftafel van een buurthuis in Den Haag. Schrijven brieven aan onze buren in Utrecht. We organiseren een taalcafé in Amsterdam. Drinken sterke koffie met de Eritrese gemeenschap in de Voorkamer. Sjoelen met Jannie, Joseph, Yasser en Melik. Spelen Jenga met Mohammed en Abdulnaser. We zingen Guus Meeuwis en Gerard van Maasakkers tijdens het meezingconcert Zing met me! in OBA. Kijken mee bij het maken van een radioworkshop met SAWA (samen in het Arabisch) in het AZC Bullewijk en bezoeken een theatervoorstelling van diezelfde groep jongvolwassenen tijdens zomerfestival De Parade.
      </p>

      {/* Section: Sterke Koffie */}
      <div className="grid-item grid-item-spacing-xl">
        <h2 className="section-heading">
          Sterke koffie
        </h2>
        <div className="anna-section">
          <div className="anna-quote">
            <p className="paragraph-base">
              <strong>Anna:</strong> "Het is ongemakkelijk. Ik ben gewend meer te delen over mijzelf, meer leiding te nemen in een gesprek. Ik spreek geen Arabisch, weet niet hoe het is om geen verblijfsvergunning te hebben, hoor afkortingen die ik niet kan plaatsen. Toch kies ik ervoor niet in te breken. Dit gesprek gaat niet over mij. Het heeft niet als doel om mij iets te leren."
            </p>
          </div>
          <div className="anna-image">
            <img 
              src="/tekeningen/Portretten/anna.svg" 
              alt="Anna portret"
              className="anna-drawing"
            />
          </div>
        </div>
      </div>

      {/* Bowling Image with Audio */}
      <div className="grid-item grid-item-spacing">
        <div className="bowling-image-container">
          <button 
            className="audio-button audio-button-overlay"
            aria-label="Play bowling audio"
            onClick={onBowlingAudioClick}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          </button>
          <img 
            src="/images/2.2_Bowlen-resized-to-medium.jpeg"
            alt="Bowlen"
            className="bowling-image"
          />
        </div>
      </div>

      {/* Section: Bowlen */}
      <div className="grid-item grid-item-spacing-xl">
        <h2 className="section-heading">
          Bowlen
        </h2>
        <div className="grid-item grid-item-spacing">
          <p className="paragraph-base">
            <strong>Anna:</strong> "We zijn aan het bowlen en Juma staat erop dat ik lopend leer gooien. Ik wil niet lopend gooien, niet bewegen in het algemeen – het is warm en ik kan me niet voorstellen dat dit uitje het beste begin is van onze mogelijke samenwerking. Toch geniet ik ervan dat onze rollen omdraaien. Op dit moment ben ik niet de host, de facilitator, degene die iets komt brengen of halen. Op dit moment zijn Juma en ik gelijkwaardig en we hebben plezier."
          </p>
        </div>
      </div>

      {/* Paragraph about adapting */}
      <p className="grid-item paragraph-base p-mb-3">
        We leren al snel dat contact maken en elkaar ontmoeten betekent dat we ons aanpassen. Qali kent zowel Marie en Anouk, de oprichters van SAWA in Amsterdam, als Yetunde, de community builder van de Voorkamer. Ze heeft al eerder hun evenementen bijgewoond en begrijpt waarom de deelnemers daarbij aansluiten.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        Als we voor deze communities kiezen en er iets willen komen brengen, als we zelf een evenement organiseren, zijn we nog steeds te gast. Daarom praten we in deze aanloopfase niet of nauwelijks over journalistiek, ook al willen we uiteindelijk onderzoeken of we samen een journalistiek product kunnen maken.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        We twijfelen over het nut van zo beginnen. We eten, bowlen, organiseren een workshop, maar uiteindelijk, aan het einde van deze periode ontvangen we namen en telefoonnummers, maken we appgroepen en stemmen data af.
      </p>

      {/* Quote with Kantlijn image */}
      <div className="grid-item grid-item-spacing">
        <div className="quote-kantlijn-row">
          <p className="quote-small">
            Ik blijf bij deze groep als jullie nederlands praten
          </p>
          <img 
            src="/tekeningen/Kantlijn/2.1_APPJE_hafid-tekeningen-v6 (1).svg"
            alt="Kantlijn tekening"
            className="kantlijn-image"
          />
        </div>
      </div>

      {/* Final Paragraph */}
      <p className="grid-item paragraph-base p-mb-3">
        Meteen dient zich de eerste uitdaging aan, de verschillende talen waarin we de deelnemers aan kunnen spreken. Zal dit ongemak de rest van de tijd blijven bestaan?
      </p>
    </section>
  )
}

// Chapter 3 Component
function Chapter3() {
  return (
    <section 
      id="chapter-3"
      className="fortythree-section chapter" 
      data-chapter="3" 
      data-chapter-title="Love language"
    >
      {/* Title */}
      <div className="grid-item section-title-wrapper">
        <span className="chapter-label">Hoofdstuk 3</span>
        <h1 className="section-title">
          Love language
        </h1>
      </div>

      {/* Image 3.1 */}
      <div className="grid-item grid-item-spacing">
        <img 
          src="/tekeningen/groot-beeld/3.1_Diner_KF13.png"
          alt="Diner"
          className="chapter-image"
        />
      </div>

      {/* Quote with Qali portrait */}
      <div className="grid-item grid-item-spacing">
        <div className="qali-quote-section">
          <p className="quote-base">
            "One of my love languages is to introduce people to new things, a new dish or a new film."
          </p>
          <div className="qali-portrait">
            <img 
              src="/tekeningen/Portretten/Kantlijn-Qali.svg" 
              alt="Qali portret"
              className="portrait-drawing"
            />
          </div>
        </div>
      </div>

      {/* First Paragraph */}
      <p className="grid-item paragraph-base p-mb-3">
        Je kan niks organiseren zonder eten, horen we Anouk zeggen, tijdens een van de events voor SAWA. Ze heeft kaasstengels bij zich, chocolade-karamel koeken, druiven, deelt pakjes appelsap uit. "Dit smaakt zoals de appelsap in Ter Apel," zegt een van de jongens.
      </p>

      {/* Second Paragraph with margin image */}
      <div className="grid-item grid-item-spacing-xl">
        <div className="shirish-section">
          <div className="shirish-text">
            <p className="paragraph-base">
              Niet veel later ontmoeten we Shirish Kulkarni, een van onze grote voorbeelden. Met zijn rapport News for All zette hij co-creatie in de journalistiek op de kaart. We lezen in dit rapport hoe we verschillende ontmoetingen kunnen hosten – alsof de mensen met wie we werken bij ons thuiskomen.
            </p>
            <p className="paragraph-base">
              Ook Shirish benadrukt het belang van samen eten. "Het moet lekker zijn en veel," zegt hij, "liefst te veel, zodat iedereen na afloop nog iets kan meenemen."
            </p>
          </div>
          <div className="shirish-image">
            <img 
              src="/tekeningen/Kantlijn/3.1-eten-en-thee.svg" 
              alt="Eten en thee"
              className="margin-drawing"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// Chapter 4 Component
function Chapter4() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const hafidTaxiRef = useRef(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Scroll-driven animation for Hafid taxi
  useEffect(() => {
    if (!hafidTaxiRef.current || reducedMotion) return

    const image = hafidTaxiRef.current
    
    // Wait for image to load to get accurate dimensions
    const setupAnimation = () => {
      const imageRect = image.getBoundingClientRect()
      
      // Calculate the distance to move based on arrow length
      // The arrow spans from the back of the car to the front
      // Moving the car by approximately its width should match the arrow length
      const moveDistance = imageRect.width * 0.4 // Adjust based on actual arrow length in SVG

      // Set initial position (back of car at arrow start)
      gsap.set(image, {
        x: -moveDistance / 2
      })

      // Create scroll trigger animation
      const trigger = ScrollTrigger.create({
        trigger: image,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        animation: gsap.to(image, {
          x: moveDistance / 2, // Front of car at arrow tip
          ease: 'none'
        })
      })

      return trigger
    }

    let trigger = null

    if (image.complete) {
      // Image already loaded
      trigger = setupAnimation()
    } else {
      // Wait for image to load
      image.addEventListener('load', () => {
        trigger = setupAnimation()
      }, { once: true })
    }

    return () => {
      if (trigger) {
        trigger.kill()
      }
    }
  }, [reducedMotion])

  // Images for the draggable stack (4.1 to 4.5)
  // Tighter, more aesthetic stacking with smaller offsets
  const stackImages = [
    {
      src: "/tekeningen/groot-beeld/4.1_What would you like to learn_KF11.png",
      alt: "What would you like to learn",
      rotation: -3,
      left: "0px",
      top: "0px",
      width: 300,
      height: 400,
      key: "4.1"
    },
    {
      src: "/tekeningen/groot-beeld/4.2_Deelnemers_Black Room_KF07.png",
      alt: "Deelnemers Black Room",
      rotation: 4,
      left: "20px",
      top: "16px",
      width: 300,
      height: 400,
      key: "4.2"
    },
    {
      src: "/tekeningen/groot-beeld/4.3_Deelnemers White Van_KF08.png",
      alt: "Deelnemers White Van",
      rotation: -2,
      left: "40px",
      top: "32px",
      width: 300,
      height: 400,
      key: "4.3"
    },
    {
      src: "/tekeningen/groot-beeld/4.4_ Deelnemers_Ter Apel_KF09.png",
      alt: "Deelnemers Ter Apel",
      rotation: 3,
      left: "60px",
      top: "48px",
      width: 300,
      height: 400,
      key: "4.4"
    },
    {
      src: "/tekeningen/groot-beeld/4.5_Deelnemers_Vliegtuig_KF10.png",
      alt: "Deelnemers Vliegtuig",
      rotation: -4,
      left: "80px",
      top: "64px",
      width: 300,
      height: 400,
      key: "4.5"
    }
  ]

  return (
    <section 
      id="chapter-4"
      className="fortythree-section chapter" 
      data-chapter="4" 
      data-chapter-title="Law of two feet"
    >
      {/* Title */}
      <div className="grid-item section-title-wrapper">
        <span className="chapter-label">Hoofdstuk 4</span>
        <h1 className="section-title">
          Law of two feet
        </h1>
      </div>

      {/* First Paragraph */}
      <p className="grid-item paragraph-base p-mb-3">
        Ons team is creatief. Daarom zijn we enthousiast over de inzet van tekenaars en schrijvers in de methode Common Ground Dialogues van Petra Ardai. Door live te schrijven of tekenen kun je een groep maken. Deelnemers horen of zien hun eigen bijdrage terug als onderdeel van een groter geheel. Ardai omschrijft dit als een cadeau voor iedereen en dat is precies hoe wij het ervaren.
      </p>

      {/* Image Stack 4.1 to 4.5 */}
      <div className="grid-item grid-item-spacing">
        <DraggableImageStack 
          images={stackImages} 
          reducedMotion={reducedMotion}
        />
      </div>

      {/* Small Heading: Unfree writing */}
      <div className="grid-item">
        <h3 className="section-heading-small">
          Unfree writing
        </h3>
      </div>

      {/* Unfree writing text */}
      <div className="grid-item grid-item-spacing">
        <div className="unfree-writing-text">
          <p className="paragraph-base">What to write?</p>
          <p className="paragraph-base">What's important?</p>
          <p className="paragraph-base">What's entertaining?</p>
          <p className="paragraph-base">Should it even be?</p>
          <p className="paragraph-base p-mb-3">This morning I had a writersblock.</p>
          <p className="paragraph-base">Writing didn't seem so free.</p>
          <p className="paragraph-base p-mb-3">Sometimes I need the pressure to write.</p>
          <p className="paragraph-base">A deadline, a promise to someone else.</p>
          <p className="paragraph-base">But at the same time, that pressure takes the freedom out of writing – unfree writing.</p>
        </div>
      </div>

      {/* Paragraph about Freewriting */}
      <p className="grid-item paragraph-base p-mb-3">
        Daarnaast organiseren we een workshop Freewriting. Een manier om ieders stem te horen, om te luisteren zonder elkaar te onderbreken. Qali heeft, in eerste instantie, geen idee wat ze gaat doen. Uiteindelijk schrijft ze: het was interessant om te zien hoe verschillend we allemaal denken, en ook hetzelfde.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        Ook Hasan is positief verrast. Hij schrijft: bedankt dat jullie mij dit aanbieden. In het Turks kan hij zich goed uitdrukken, maar in het Engels vindt hij dit lastiger. Hij droomt ervan een blog te starten waarin zijn grote passies samenkomen. Van antropologie tot sociale psychologie, van religie tot moraal en van kunst en ethiek tot AI. Deze vorm van live schrijven en voorlezen herinnert hem hieraan, brengt de mogelijkheid een stukje dichterbij.
      </p>

      {/* Image kantlijn Hasan */}
      <div className="grid-item grid-item-spacing">
        <img 
          src="/tekeningen/Portretten/kantlijn-hasan.svg"
          alt="Hasan kantlijn"
          className="kantlijn-image"
        />
      </div>

      {/* Small Heading: I drew my room all black */}
      <div className="grid-item">
        <h3 className="section-heading-small">
          I drew my room all black
        </h3>
      </div>

      {/* Paragraph about illustrators */}
      <p className="grid-item paragraph-base p-mb-3">
        We benaderen illustratoren Conform Cox en Katja Fred om zich bij ons aan te sluiten. Zonder dat ze exact weten waar wij naartoe willen. We nemen grote vellen papier en tekenmaterialen mee, omdat we vermoedden dat het ons zal helpen te denken in beeld, we spreken tenslotte niet allemaal dezelfde taal.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        Tijdens onze tweede bijeenkomst met SAWA tekent Katja soms wat ze ziet en soms neemt ze details over uit de tekeningen van de groep. Zo ontstaan er verschillende lagen in haar illustraties.
      </p>


      {/* Paragraph with margin image (Afke) */}
      <div className="grid-item grid-item-spacing-xl">
        <div className="afke-section">
          <div className="afke-text">
            <p className="paragraph-base">
              Er zijn ook momenten dat we twijfelen of we zelf mee moeten doen. Het kan voelen als zonde van de tijd om ruimte in te nemen. Dat soort bescheidenheid staat gelijkwaardigheid in de weg.
            </p>
            <p className="paragraph-base">
              Afke tekent het huis van haar ouders, ze vertelt dat ze voor haar gevoel steeds afscheid aan het nemen is van deze plek, terwijl hij nog bestaat. Het voelt kwetsbaar. En het breekt iets open: we hebben misschien niet dezelfde achtergrond, maar delen wel dezelfde gevoelens. De verhalen over ieders gevoel van thuis hebben haar geïnspireerd.
            </p>
          </div>
          <div className="afke-image">
            <img 
              src="/tekeningen/Portretten/kantlijn-afke.svg" 
              alt="Afke kantlijn"
              className="margin-drawing"
            />
          </div>
        </div>
      </div>

      {/* Small Heading: The law of two feet */}
      <div className="grid-item">
        <h3 className="section-heading-small">
          The law of two feet
        </h3>
      </div>

      {/* Anna quote */}
      <div className="grid-item grid-item-spacing">
        <p className="paragraph-base">
          <strong className="quote-author">Anna:</strong> "We lezen over the law of two feet. De manier waarop deze methode is opgeschreven is enorm Amerikaans. Ik moet er een beetje om lachen. Toch zal ik er tijdens onze zoektocht vaak aan denken: laat mensen betrokken zijn op hun eigen voorwaarden. Vertrouw erop dat iemand aansluit op manier die past. Op het juiste moment, met de juiste energie. Oordeel er niet over."
        </p>
      </div>

      {/* Paragraph with margin image (Costas) */}
      <div className="grid-item grid-item-spacing-xl">
        <div className="costas-section">
          <div className="costas-text">
            <p className="paragraph-base">
              Naast tekenen en schrijven maken we ook gebruik van tools die we vinden op internet. Open Space Technology bijvoorbeeld, een brainstormmethode waarover we lazen in het rapport van Shirish Kulkarni.
            </p>
            <p className="paragraph-base">
              Het duurt even voordat we ons deze methode eigen hebben gemaakt, niemand weet precies wat we aan het doen zijn. Maar uiteindelijk werkt het: de tafels aan de kant, de grote vellen en dikke stiften. De lege ruimte vult zich langzaam met ideeën. Onderwerpen die ons aan het hart gaan.
            </p>
            <p className="paragraph-base">
              Costas, uit de Voorkamer-groep zal later aangeven dat dit voor hem een fijne manier was om in elkaars hoofd te mogen kijken. En dat valt niet altijd mee, als een deel van de groep alleen Nederlands en ander deel alleen Engels spreekt.
            </p>
          </div>
          <div className="costas-image">
            <img 
              src="/tekeningen/Portretten/kantlijn-costas.svg" 
              alt="Costas kantlijn"
              className="margin-drawing"
            />
          </div>
        </div>
      </div>

      {/* Full image 4.6 */}
      <div className="grid-item grid-item-spacing">
        <div className="hafid-taxi-container">
          <img 
            ref={hafidTaxiRef}
            src="/tekeningen/groot-beeld/4.6_Tekening Hafid in de Regiotaxi.svg"
            alt="Hafid in de regiotaxi"
            className="chapter-image hafid-taxi"
          />
        </div>
      </div>

      {/* Final Paragraph */}
      <p className="grid-item paragraph-base p-mb-3">
        Hafid, net als Hasan en Costas onderdeel van de Voorkamer-groep, wordt eerder opgehaald. Hij is afhankelijk van de regiotaxi. Wij hebben, op dit moment, nog geen idee wat dat betekent.
      </p>
    </section>
  )
}

// Chapter 5 Component
function Chapter5({ onSpokenwordAudioClick }) {
  return (
    <section 
      id="chapter-5"
      className="fortythree-section chapter" 
      data-chapter="5" 
      data-chapter-title="All Ideas are good ideas"
    >
      {/* Title */}
      <div className="grid-item section-title-wrapper">
        <span className="chapter-label">Hoofdstuk 5</span>
        <h1 className="section-title">
          All Ideas are good ideas
        </h1>
      </div>

      {/* Big quote with image - row on desktop, column on mobile */}
      <div className="grid-item grid-item-spacing">
        <div className="hafid-quote-section">
          <div className="hafid-quote">
            <p className="large-quote">
              "De stok is mijn vriend"
            </p>
            <p className="quote-author-name">Hafid</p>
          </div>
          <div className="hafid-stok-image">
            <img 
              src="/tekeningen/Kantlijn/5.1_STOK_hafid-tekeningen-v8.svg"
              alt="Hafid stok"
              className="kantlijn-image"
            />
          </div>
        </div>
      </div>

      {/* Paragraph about Hafid */}
      <p className="grid-item paragraph-base p-mb-3">
        Het is half acht 's avonds, in Utrecht, we zijn net klaar met eten. We hebben een puntje quiche en een kopje pompoensoep bewaard. Hafid schuift aan. We weten inmiddels dat er bij de regiotaxi veel variabelen zijn, vertraging, extra passagiers, dat hij ervan afhankelijk is en dat het went.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        Hafid is vijfenveertig. Hij woont al meer dan twintig jaar in Nederland. Tijdens onze brainstorm draagt hij onderwerpen aan als inflatie, zorgverzekering en te veel hulpvragers die te lang op wachtlijsten staan.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        Cox hoort en ziet iedereen. En langzaam tovert zij ons stuk voor stuk tevoorschijn op haar Ipad.
      </p>

      {/* Image 5.2 Cocreatie */}
      <div className="grid-item grid-item-spacing">
        <img 
          src="/tekeningen/groot-beeld/5.2_Cocreatie.jpg"
          alt="Cocreatie"
          className="chapter-image"
        />
      </div>

      {/* Paragraph about choosing themes */}
      <p className="grid-item paragraph-base p-mb-3">
        Aan het einde van deze bijeenkomst kiezen we drie thema's: het zomervakantie-gat, armoede en angstzaaierij/polarisatie. Keuzes maken in een groep is pittig. De communities waarmee wij werken zijn niet homogeen. We willen niet hetzelfde, denken niet hetzelfde. Door onderwerpen af te strepen, invalshoeken te bespreken en grote thema's kleiner te maken, verliezen we ook iets: meerstemmigheid. Verhalen die naast elkaar mogen bestaan.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        Al onze persoonlijke notities worden input voor een groter verhaal dat we allemaal dragen en waaraan we samen zullen werken.
      </p>

      {/* Small title with audio button */}
      <div className="grid-item">
        <h3 className="section-heading-small section-heading-with-audio">
          <span>Spokenword SAWA</span>
          <button 
            className="audio-button"
            aria-label="Play spokenword audio"
            onClick={onSpokenwordAudioClick}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          </button>
        </h3>
      </div>

      {/* Paragraph with quotes */}
      <div className="grid-item grid-item-spacing">
        <div className="spokenword-text">
          <p className="paragraph-base">
            One of you says:
          </p>
          <p className="paragraph-base p-mb-3">
            I've been warned, not to talk too much. I've tried to talk less.
          </p>
          <p className="paragraph-base p-mb-3">
            This is beautiful.
          </p>
          <p className="paragraph-base p-mb-3">
            These are big topics. But we will be good enough to carry any of them.
          </p>
          <p className="paragraph-base p-mb-3">
            We are SAWA.
          </p>
          <p className="paragraph-base p-mb-3">
            We can make it together.
          </p>
          <p className="paragraph-base p-mb-3">
            No one should take any pressure.
          </p>
          <p className="paragraph-base p-mb-3">
            We can do it like this.
          </p>
          <p className="paragraph-base p-mb-3">
            It's part of everyone, all of our backgrounds, everyones experience.
          </p>
          <p className="paragraph-base p-mb-3">
            One of you says:
          </p>
          <p className="paragraph-base p-mb-3">
            This was the hardest meeting of all. It's hard to choose. Serious.
          </p>
          <p className="paragraph-base p-mb-3">
            Six hours later…
          </p>
        </div>
      </div>

      {/* Image 5.1 Juma whatsapp */}
      <div className="grid-item grid-item-spacing">
        <img 
          src="/images/5_JUMA-whatsapp-resized-to-medium.jpeg"
          alt="Juma whatsapp"
          className="chapter-image"
        />
      </div>

      {/* Paragraph about working in groups */}
      <p className="grid-item paragraph-base p-mb-3">
        We werken onderwerpen uit in groepjes. Bedenken onderzoeksvragen. Inventariseren wie welke rol zou willen innemen tijdens het maken: research, interview, montage. Het lucht op, bij de deelnemers van SAWA, na alle persoonlijke onderwerpen die we hebben aangeraakt, om te kunnen schakelen naar een praktische modus en om ons voor te bereiden op een volgende fase.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        In Utrecht is het ondertussen kwart over negen 's avonds. Iedereen vertrekt. Behalve Hafid. Hij wacht nog op de regiotaxi.
      </p>

      {/* Image 5.3 Hafid kantlijn */}
      <div className="grid-item grid-item-spacing">
        <img 
          src="/tekeningen/Kantlijn/5.3_WACHTEN_hafid-tekeningen-v7 (1).svg"
          alt="Hafid wachten"
          className="kantlijn-image"
        />
      </div>
    </section>
  )
}

export default App
