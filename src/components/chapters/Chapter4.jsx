import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DraggableImageStack from '../DraggableImageStack'

gsap.registerPlugin(ScrollTrigger)

// Chapter 4 Component
function Chapter4() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const regiotaxiRef = useRef(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Animate regiotaxi from left to right on scroll - overshoot beyond text boundaries
  useEffect(() => {
    if (!regiotaxiRef.current || reducedMotion) return

    const element = regiotaxiRef.current
    let trigger = null
    
    const setupAnimation = () => {
      // Kill existing trigger if any
      if (trigger) {
        trigger.kill()
      }
      
      const viewportWidth = window.innerWidth
      // Use percentage but cap at reasonable max for large screens
      const offGridAmount = Math.min(viewportWidth * 0.5, 800) // Max 800px overshoot on very large screens
      
      // Set initial position off-grid to the left
      gsap.set(element, { x: `-${offGridAmount}px` })
      
      trigger = ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
        animation: gsap.to(element, {
          x: `${offGridAmount}px`,
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

  // Images for the draggable stack (4.1 to 4.5)
  // Tighter, more aesthetic stacking with smaller offsets
  // Using percentage units for true container-relative responsive scaling
  const stackImages = [
    {
      src: "/tekeningen/groot-beeld/4.1_What would you like to learn_KF11.png",
      alt: "What would you like to learn",
      rotation: -3,
      left: "0%",
      top: "0%",
      width: "clamp(10rem, 30%, 13.75rem)",
      height: "auto",
      key: "4.1"
    },
    {
      src: "/tekeningen/groot-beeld/4.2_Deelnemers_Black Room_KF07.png",
      alt: "Deelnemers Black Room",
      rotation: -4,
      left: "25%",
      top: "25%",
      width: "clamp(10rem, 30%, 13.75rem)",
      height: "auto",
      key: "4.2"
    },
    {
      src: "/tekeningen/groot-beeld/4.3_Deelnemers White Van_KF08.png",
      alt: "Deelnemers White Van",
      rotation: 4,
      left: "0%",
      top: "50%",
      width: "clamp(10rem, 30%, 13.75rem)",
      height: "auto",
      key: "4.3"
    },
    {
      src: "/tekeningen/groot-beeld/4.4_ Deelnemers_Ter Apel_KF09.png",
      alt: "Deelnemers Ter Apel",
      rotation: 3,
      left: "50%",
      top: "0%",
      width: "clamp(10rem, 30%, 13.75rem)",
      height: "auto",
      key: "4.4"
    },
    {
      src: "/tekeningen/groot-beeld/4.5_Deelnemers_Vliegtuig_KF10.png",
      alt: "Deelnemers Vliegtuig",
      rotation: -6,
      left: "50%",
      top: "45%",
      width: "clamp(10rem, 30%, 13.75rem)",
      height: "auto",
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
          <p className="paragraph-base"><strong>Qali:</strong></p>
          <p className="paragraph-base">What to write?</p>
          <p className="paragraph-base">What's important?</p>
          <p className="paragraph-base">What's entertaining?</p>
          <p className="paragraph-base">Should it even be?</p>
          <p className="paragraph-base p-mb-2">This morning I had a writersblock.</p>
          <p className="paragraph-base">Writing didn't seem so free.</p>
          <p className="paragraph-base p-mb-2">Sometimes I need the pressure to write.</p>
          <p className="paragraph-base">A deadline, a promise to someone else.</p>
          <p className="paragraph-base">But at the same time, that pressure takes the freedom out of writing – unfree writing.</p>
        </div>
      </div>

      {/* Text about Freewriting */}
      <p className="grid-item paragraph-base p-mb-3">
        Daarnaast organiseren we een workshop Freewriting. Een manier om ieders stem te horen, om te luisteren zonder elkaar te onderbreken. Qali heeft, in eerste instantie, geen idee wat ze gaat doen. Uiteindelijk schrijft ze: het was interessant om te zien hoe verschillend we allemaal denken, en ook hetzelfde.
      </p>

      {/* Hasan Section */}
      <div className="grid-item grid-item-spacing-xl">
        <p className="paragraph-base p-mb-2">
          Ook Hasan is positief verrast. Hij schrijft: bedankt dat jullie mij dit aanbieden. In het Turks kan hij zich goed uitdrukken, maar in het Engels vindt hij dit lastiger. Hij droomt ervan een blog te starten waarin zijn grote passies samenkomen. Van antropologie tot sociale psychologie, van religie tot moraal en van kunst en ethiek tot AI. Deze vorm van live schrijven en voorlezen herinnert hem hieraan, brengt de mogelijkheid een stukje dichterbij.
        </p>
        <img 
          src="/tekeningen/Portretten/kantlijn-hasan.svg" 
          alt="Hasan portret"
          className="kantlijn-image"
        />
      </div>

      {/* I Drew My Room All Black Section */}
      <div className="grid-item grid-item-spacing-xl">
        <h3 className="section-heading-small">
          I drew my room all black
        </h3>
        <p className="paragraph-base p-mb-3">
          We benaderen illustratoren Conform Cox en Katja Fred om zich bij ons aan te sluiten. Zonder dat ze exact weten waar wij naartoe willen. We nemen grote vellen papier en tekenmaterialen mee, omdat we vermoedden dat het ons zal helpen te denken in beeld, we spreken tenslotte niet allemaal dezelfde taal.
        </p>
        <p className="paragraph-base p-mb-3">
          Tijdens onze tweede bijeenkomst met SAWA tekent Katja soms wat ze ziet en soms neemt ze details over uit de tekeningen van de groep. Zo ontstaan er verschillende lagen in haar illustraties.
        </p>
      </div>

      {/* Afke Section */}
      <div className="grid-item grid-item-spacing-xl">
        <p className="paragraph-base p-mb-2">
          Er zijn ook momenten dat we twijfelen of we zelf mee moeten doen. Het kan voelen als zonde van de tijd om ruimte in te nemen. Dat soort bescheidenheid staat gelijkwaardigheid in de weg.
        </p>
        <p className="paragraph-base p-mb-2">
          Afke tekent het huis van haar ouders, ze vertelt dat ze voor haar gevoel steeds afscheid aan het nemen is van deze plek, terwijl hij nog bestaat. Het voelt kwetsbaar. En het breekt iets open: we hebben misschien niet dezelfde achtergrond, maar delen wel dezelfde gevoelens. De verhalen over ieders gevoel van thuis hebben haar geïnspireerd.
        </p>
        <img 
          src="/tekeningen/Portretten/kantlijn-afke.svg" 
          alt="Afke portret"
          className="kantlijn-image"
        />
      </div>

      {/* The Law of Two Feet Section */}
      <div className="grid-item grid-item-spacing-xl">
        <h3 className="section-heading-small">
          The Law of Two Feet
        </h3>
        <div className="anna-section">
          <div className="anna-quote">
            <p className="paragraph-base">
              <strong>Anna:</strong> "We lezen over the law of two feet. De manier waarop deze methode is opgeschreven is enorm Amerikaans. Ik moet er een beetje om lachen. Toch zal ik er tijdens onze zoektocht vaak aan denken: laat mensen betrokken zijn op hun eigen voorwaarden. Vertrouw erop dat iemand aansluit op manier die past. Op het juiste moment, met de juiste energie. Oordeel er niet over."
            </p>
          </div>
        </div>
      </div>

      {/* Open Space Technology Text */}
      <p className="grid-item paragraph-base p-mb-3">
        Naast tekenen en schrijven maken we ook gebruik van tools die we vinden op internet. Open Space Technology bijvoorbeeld, een brainstormmethode waarover we lazen in het rapport van Shirish Kulkarni.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        Het duurt even voordat we ons deze methode eigen hebben gemaakt, niemand weet precies wat we aan het doen zijn. Maar uiteindelijk werkt het: de tafels aan de kant, de grote vellen en dikke stiften. De lege ruimte vult zich langzaam met ideeën. Onderwerpen die ons aan het hart gaan.
      </p>

      {/* Costas Section */}
      <div className="grid-item grid-item-spacing-xl">
        <p className="paragraph-base p-mb-2">
          Costas, uit de Voorkamer-groep zal later aangeven dat dit voor hem een fijne manier was om in elkaars hoofd te mogen kijken. En dat valt niet altijd mee, als een deel van de groep alleen Nederlands en ander deel alleen Engels spreekt.
        </p>
        <img 
          src="/tekeningen/Portretten/kantlijn-costas.svg" 
          alt="Costas portret"
          className="kantlijn-image"
        />
      </div>

      {/* Hafid in Regiotaxi Image */}
      <div className="grid-item grid-item-spacing">
        <img 
          ref={regiotaxiRef}
          src="/tekeningen/groot-beeld/4.6_Tekening Hafid in de Regiotaxi.svg"
          alt="Hafid in de Regiotaxi"
          className="chapter-image regiotaxi-animated"
        />
      </div>

      {/* Final Paragraph */}
      <p className="grid-item paragraph-base p-mb-3">
        Hafid, net als Hasan en Costas onderdeel van de Voorkamer-groep, wordt eerder opgehaald. Hij is afhankelijk van de regiotaxi. Wij hebben, op dit moment, nog geen idee wat dat betekent.
      </p>
    </section>
  )
}

export default Chapter4

