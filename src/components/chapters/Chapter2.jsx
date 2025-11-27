import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import DraggableImageStack from '../DraggableImageStack'

// Chapter 2 Component
function Chapter2({ onBowlingAudioClick }) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const phoneRef = useRef(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Phone buzz animation - buzzes every 4 seconds like receiving a notification
  useEffect(() => {
    if (!phoneRef.current || reducedMotion) return

    const element = phoneRef.current
    
    const createBuzzAnimation = () => {
      // Subtle rotation-based buzz (like vibration)
      const buzz = gsap.timeline()
      buzz.to(element, {
        rotation: 1.5,
        duration: 0.08,
        ease: 'power2.out'
      })
      .to(element, {
        rotation: -1.5,
        duration: 0.08,
        ease: 'power2.out'
      })
      .to(element, {
        rotation: 1,
        duration: 0.08,
        ease: 'power2.out'
      })
      .to(element, {
        rotation: -1,
        duration: 0.08,
        ease: 'power2.out'
      })
      .to(element, {
        rotation: 0,
        duration: 0.12,
        ease: 'power2.out'
      })
    }

    // Buzz every 4 seconds
    const interval = setInterval(() => {
      createBuzzAnimation()
    }, 4000)

    // Initial buzz after a short delay
    setTimeout(() => {
      createBuzzAnimation()
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [reducedMotion])

  // Images for the draggable stack (2.1.A to 2.1.G)
  // More organic, natural stacking with varied rotations and offsets
  // Using percentage units for true container-relative responsive scaling
  const stackImages = [
    {
      src: "/images/2.1.A_Radioworkshop_SAWA_IMG_3337-resized-to-medium.jpeg",
      alt: "Radioworkshop SAWA",
      rotation: -3,
      left: "0%",
      top: "0%",
      width: "clamp(10rem, 30%, 13.75rem)",
      height: "auto",
      key: "2.1.A"
    },
    {
      src: "/images/2.1.AA_250910_VK_zwarte_koffie_3_5-resized-to-medium.jpeg",
      alt: "Zwarte koffie Voorkamer",
      rotation: 4,
      left: "25%",
      top: "25%",
      width: "clamp(10rem, 30%, 13.75rem)",
      height: "auto",
      key: "2.1.AA"
    },
    {
      src: "/images/2.1.B_Taalcafeboost-resized-to-medium.jpeg",
      alt: "Taalcafé",
      rotation: -2,
      left: "0%",
      top: "50%",
      width: "clamp(10rem, 30%, 13.75rem)",
      height: "auto",
      key: "2.1.B"
    },
    {
      src: "/images/2.1.E_Sjoelen-resized-to-medium.jpeg",
      alt: "Sjoelen",
      rotation: 3,
      left: "50%",
      top: "0%",
      width: "clamp(10rem, 30%, 13.75rem)",
      height: "auto",
      key: "2.1.E"
    },
    {
      src: "/images/2.1.G_Radioworkshop_SAWA_IMG_3352-resized-to-medium.jpeg",
      alt: "Radioworkshop SAWA 2",
      rotation: -4,
      left: "50%",
      top: "45%",
      width: "clamp(10rem, 30%, 13.75rem)",
      height: "auto",
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
      <div className="grid-item grid-item-spacing bowling-image-wrapper">
        <div className="bowling-image-frame">
          <div className="bowling-image-container">
            <button 
              className="audio-button audio-button-overlay"
              aria-label="Play bowling audio"
              onClick={onBowlingAudioClick}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            ref={phoneRef}
            src="/tekeningen/Kantlijn/2.1_APPJE_hafid-tekeningen-v6 (1).svg"
            alt="Kantlijn tekening"
            className="phone-image"
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

export default Chapter2

