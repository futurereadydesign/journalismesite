import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Chapter 5 Component
function Chapter5({ onSpokenwordAudioClick }) {
  const stokRef = useRef(null)
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

  // Stabbing/walking animation for STOK image (cane) - stabs the ground like walking
  useEffect(() => {
    if (!stokRef.current || reducedMotion) return

    const element = stokRef.current
    // Create a smooth timeline for walking/stabbing motion
    const animation = gsap.timeline({ repeat: -1, ease: 'none' })
    
    // Stab down (cane moves down and forward, like hitting the ground)
    animation.to(element, {
      y: 12, // Move down (stabbing ground)
      x: 6,  // Move forward slightly
      rotation: 3, // Slight rotation forward
      duration: 0.5,
      ease: 'power2.out'
    })
    // Lift up (cane lifts up and back)
    .to(element, {
      y: -8, // Lift up
      x: -4, // Move back slightly
      rotation: -2, // Rotate back
      duration: 0.7,
      ease: 'power2.inOut'
    })
    // Return to neutral position smoothly
    .to(element, {
      y: 0,
      x: 0,
      rotation: 0,
      duration: 0.5,
      ease: 'power1.inOut'
    })

    return () => {
      animation.kill()
    }
  }, [reducedMotion])

  return (
    <section 
      id="chapter-5"
      className="fortythree-section chapter" 
      data-chapter="5" 
      data-chapter-title="All ideas are good ideas"
    >
      {/* Title */}
      <div className="grid-item section-title-wrapper">
        <span className="chapter-label">Hoofdstuk 5</span>
        <h1 className="section-title">
          All ideas are good ideas
        </h1>
      </div>

      {/* Hafid Quote */}
      <div className="grid-item grid-item-spacing">
        <div className="hafid-quote-row">
          <p className="large-quote">
            <strong>Hafid:</strong> De stok is mijn vriend
          </p>
          <img 
            ref={stokRef}
            src="/tekeningen/Kantlijn/5.1_STOK_hafid-tekeningen-v8.svg"
            alt="Stok Hafid"
            className="stok-image"
          />
        </div>
      </div>

      {/* Text Paragraph */}
      <p className="grid-item paragraph-base p-mb-3">
        Het is half acht 's avonds, in Utrecht, we zijn net klaar met eten. We hebben een puntje quiche en een kopje pompoensoep bewaard. Hafid schuift aan. We weten inmiddels dat er bij de regiotaxi veel variabelen zijn, vertraging, extra passagiers, dat hij ervan afhankelijk is en dat het went.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        Hafid is vijfenveertig. Hij woont al meer dan twintig jaar in Nederland. Tijdens onze brainstorm draagt hij onderwerpen aan als inflatie, zorgverzekering en te veel hulpvragers die te lang op wachtlijsten staan.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        Cox hoort en ziet iedereen. En langzaam tovert zij ons stuk voor stuk tevoorschijn op haar Ipad.
      </p>

      {/* Cocreatie Image */}
      <div className="grid-item grid-item-spacing">
        <img 
          src="/tekeningen/groot-beeld/5.2_Cocreatie.jpg"
          alt="Cocreatie hele groep"
          className="chapter-image"
        />
      </div>

      {/* Text about choosing themes */}
      <p className="grid-item paragraph-base p-mb-3">
        Aan het einde van deze bijeenkomst kiezen we drie thema's: het zomervakantie-gat, armoede en angstzaaierij/polarisatie. Keuzes maken in een groep is pittig. De communities waarmee wij werken zijn niet homogeen. We willen niet hetzelfde, denken niet hetzelfde. Door onderwerpen af te strepen, invalshoeken te bespreken en grote thema's kleiner te maken, verliezen we ook iets: meerstemmigheid. Verhalen die naast elkaar mogen bestaan.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        Al onze persoonlijke notities worden input voor een groter verhaal dat we allemaal dragen en waaraan we samen zullen werken.
      </p>

      {/* Spoken Word SAWA Section */}
      <div className="grid-item grid-item-spacing-xl">
        <h3 className="section-heading-small">
          Spoken Word SAWA
        </h3>
        <div className="grid-item grid-item-spacing">
          <button 
            className="audio-button"
            aria-label="Play spoken word audio"
            onClick={onSpokenwordAudioClick}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          </button>
          <div className="unfree-writing-text">
            <p className="paragraph-base">One of you says:</p>
            <p className="paragraph-base p-mb-2">I've been warned, not to talk too much. I've tried to talk less.</p>
            <p className="paragraph-base">This is beautiful.</p>
            <p className="paragraph-base p-mb-2">These are big topics. But we will be good enough to carry any of them.</p>
            <p className="paragraph-base">We are SAWA.</p>
            <p className="paragraph-base">We can make it together.</p>
            <p className="paragraph-base">No one should take any pressure.</p>
            <p className="paragraph-base">We can do it like this.</p>
            <p className="paragraph-base p-mb-2">It's part of everyone, all of our backgrounds, everyones experience.</p>
            <p className="paragraph-base p-mb-2">One of you says:</p>
            <p className="paragraph-base">This was the hardest meeting of all. It's hard to choose. Serious.</p>
            <p className="paragraph-base p-mb-2">Six hours later…</p>
          </div>
        </div>
      </div>

      {/* Juma WhatsApp Image */}
      <div className="grid-item grid-item-spacing">
        <img 
          src="/images/5_JUMA-whatsapp-resized-to-medium.jpeg"
          alt="Juma WhatsApp"
          className="chapter-image"
        />
      </div>

      {/* Final Paragraphs */}
      <p className="grid-item paragraph-base p-mb-3">
        We werken onderwerpen uit in groepjes. Bedenken onderzoeksvragen. Inventariseren wie welke rol zou willen innemen tijdens het maken: research, interview, montage. Het lucht op, bij de deelnemers van SAWA, na alle persoonlijke onderwerpen die we hebben aangeraakt, om te kunnen schakelen naar een praktische modus en om ons voor te bereiden op een volgende fase.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        In Utrecht is het ondertussen kwart over negen 's avonds. Iedereen vertrekt. Behalve Hafid. Hij wacht nog op de regiotaxi.
      </p>
    </section>
  )
}

export default Chapter5

