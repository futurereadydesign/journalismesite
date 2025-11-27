import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Highlight from '../Highlight'

gsap.registerPlugin(ScrollTrigger)

// Chapter 1 Component
function Chapter1({ onAudioClick }) {
  const jumaDisappearedRef = useRef(null)
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

  // Fade out "juma has disappeared" text on scroll with smooth fade
  useEffect(() => {
    if (!jumaDisappearedRef.current || reducedMotion) return

    const element = jumaDisappearedRef.current
    
    // Ensure initial state is fully visible
    gsap.set(element, {
      opacity: 1,
      filter: 'blur(0px)'
    })
    
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      end: 'top 20%',
      scrub: true,
      animation: gsap.to(element, {
        opacity: 0,
        filter: 'blur(8px)', // Add subtle blur as it fades
        duration: 1.5, // Longer duration for smoother fade
        ease: 'power2.inOut' // Smoother easing
      })
    })

    return () => {
      trigger.kill()
    }
  }, [reducedMotion])

  return (
    <section 
      id="chapter-1"
      className="fortythree-section chapter" 
      data-chapter="1" 
      data-chapter-title="Fourtythree"
    >
      {/* Title */}
      <div className="grid-item section-title-wrapper">
        <span className="chapter-label">Hoofdstuk 1</span>
        <h1 className="section-title section-title-with-audio">
          <span>Fourthythree</span>
          <button 
            className="audio-button"
            aria-label="Play audio"
            onClick={onAudioClick}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <p ref={jumaDisappearedRef} className="large-quote juma-disappeared-text">
            "Juma has
            disappeared"
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

export default Chapter1

