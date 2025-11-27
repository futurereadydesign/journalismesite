import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Chapter 8 Component
function Chapter8({ onNotIntentionalAudioClick, onHafeeznotjumaAudioClick }) {
  const regiotaxiRef8 = useRef(null)
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

  // Animate regiotaxi from right to left on scroll - overshoot beyond text boundaries
  useEffect(() => {
    if (!regiotaxiRef8.current || reducedMotion) return

    const element = regiotaxiRef8.current
    let trigger = null
    
    const setupAnimation = () => {
      // Kill existing trigger if any
      if (trigger) {
        trigger.kill()
      }
      
      const viewportWidth = window.innerWidth
      // Use percentage but cap at reasonable max for large screens
      const offGridAmount = Math.min(viewportWidth * 0.5, 800) // Max 800px overshoot on very large screens
      
      // Set initial position off-grid to the right
      gsap.set(element, { x: `${offGridAmount}px` })
      
      trigger = ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
        animation: gsap.to(element, {
          x: `-${offGridAmount}px`,
          ease: 'none'
        })
      })

      // Refresh ScrollTrigger to ensure it calculates positions correctly
      ScrollTrigger.refresh()
    }

    // Small delay to ensure element is fully rendered
    const timeoutId = setTimeout(() => {
      setupAnimation()
    }, 100)
    
    // Handle resize to recalculate animation
    const handleResize = () => {
      setupAnimation()
    }
    
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
      if (trigger) {
        trigger.kill()
      }
    }
  }, [reducedMotion])

  return (
    <section 
      id="chapter-8"
      className="fortythree-section chapter" 
      data-chapter="8" 
      data-chapter-title="Somehow I adapted"
    >
      {/* Title */}
      <div className="grid-item section-title-wrapper">
        <span className="chapter-label">Hoofdstuk 8</span>
        <h1 className="section-title">
          Somehow I adapted
        </h1>
      </div>

      {/* Text Paragraph */}
      <p className="grid-item paragraph-base p-mb-3">
        Woensdagavond, Utrecht. Zoals elke week de afgelopen periode, treffen we elkaar in Landhuis in de Stad. We zijn nog niet compleet, maar eten met wie er is. Hafid vertelt ons het verhaal van zijn ongeluk.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        Hij was 24 en stak een straat over die hij twee keer per dag overstak. Hij keek niet uit en werd aangereden. Heeft zes weken in coma gelegen. Toen hij steeds maar niet wakker werd hebben ze zijn buik opengesneden. En zijn schedel, die hebben ze in de koelkast gezet. De doktoren zeiden tegen zijn vader: "De kans dat hij dit overleeft is 2%. Als hij wakker wordt is hij blind of gek." Hafid is geen van beide. Zijn revalidatie duurde zeven maanden en hij is blij dat hij hier nu zit.
      </p>

      {/* Hafid in gesprek Image */}
      <div className="grid-item grid-item-spacing">
        <img 
          src="/tekeningen/groot-beeld/Cocreatie2-meeting-conform_cox.png"
          alt="Hafid in gesprek"
          className="chapter-image"
        />
      </div>

      {/* Text about tasks */}
      <p className="grid-item paragraph-base p-mb-3">
        In de periode die volgt verdelen we de taken. Afke werkt aan de productie van een artikel met de voorkamer en Qali stort zich op het maken van de podcast in Amsterdam.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        Samen met Hafid maakt Afke gebruik van de regiotaxi. We willen weten: hoe komt het nou dat het wachten vaak zo lang duurt en de ritjes soms ook? We praten met de taxichauffeur. Als we onderweg een andere deelnemer afzetten raakt het automatische systeem de weg kwijt, het ritje van 10 minuten duurt plotseling drie kwartier. Zijn wij daar verantwoordelijk voor?
      </p>

      {/* Hafid in Regiotaxi Image - Reverse text version */}
      <div className="grid-item grid-item-spacing">
        <img 
          ref={regiotaxiRef8}
          src="/tekeningen/groot-beeld/4.6_Tekening Hafid in de Regiotaxi-reverse-text.svg"
          alt="Hafid in de Regiotaxi"
          className="chapter-image regiotaxi-animated"
        />
      </div>

      {/* Text about journalistic principles */}
      <p className="grid-item paragraph-base p-mb-3">
        Een week later, terug in de Voorkamer, maken we ons zorgen over de journalistieke principes. Het verhaal kán niet over Hafid gaan want hij is mede-onderzoeker. Welke rol heeft Hafid? Is hij de hoofdpersoon of de journalist? Dit project duurt nog maar twee weken. We willen graag publiceren. Maar lukt dat nog?
      </p>

      {/* Oma Ietje Section */}
      <div className="grid-item grid-item-spacing-xl">
        <p className="paragraph-base p-mb-3">
          Ondertussen in Amsterdam, bij Oma Ietje naast station Bullewijk, kijkt Yahia ons verrast aan. Uit de audioinstallatie komt een nummer van Fairuz. Het doet hem denken aan thuis, alsof hij in Syrië in een café zit. Hij zegt: "Dit is mijn favoriete meeting." Ook Juma is opgewekt. "Het is vandaag vrijdag," zegt hij. "Juma," lacht Yahia. "Mijn naam betekent vrijdag," legt Juma uit.
        </p>
      </div>

      {/* Quote */}
      <div className="grid-item grid-item-spacing">
        <p className="large-quote">
          <strong>Juma:</strong> They can't pronounce my name.
        </p>
        <button 
          className="audio-button"
          aria-label="Play not intentional audio"
          onClick={onNotIntentionalAudioClick}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </button>
      </div>

      {/* Text about weekly meetings */}
      <p className="grid-item paragraph-base p-mb-3">
        De wekelijkse bijeenkomsten sluiten niet meer aan. Een onderwerp van meerdere kanten belichten, mensen bellen, je steeds dieper in de materie ingraven. Het vraagt een speciale concentratie, binnen een bepaalde tijd: een eindsprint. Op dit moment voelt het voor ons alsof we elke week opnieuw beginnen. We maken Drive folders aan. Verdelen de taken.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        We werken al bijna zes weken samen. Maar pas vandaag komen we er achter hoe Juma werkelijk heet. Zijn opa was een vluchteling in 1923. De geschiedenis herhaalt zich.
      </p>

      {/* Quote */}
      <div className="grid-item grid-item-spacing">
        <p className="large-quote">
          Juma was the first refugee in our lineage.
        </p>
        <button 
          className="audio-button"
          aria-label="Play Hafeez not Juma audio"
          onClick={onHafeeznotjumaAudioClick}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </button>
      </div>
    </section>
  )
}

export default Chapter8

