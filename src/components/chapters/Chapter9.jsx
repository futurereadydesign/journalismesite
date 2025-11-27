// Chapter 9 Component
function Chapter9({ onPropermealAudioClick, onNewschannelsAudioClick, onVerblijfsvergunningAudioClick }) {
  return (
    <section 
      id="chapter-9"
      className="fortythree-section chapter" 
      data-chapter="9" 
      data-chapter-title="(Co)create and publish?"
    >
      {/* Title */}
      <div className="grid-item section-title-wrapper">
        <span className="chapter-label">Hoofdstuk 9</span>
        <h1 className="section-title">
          (Co)create and publish?
        </h1>
      </div>

      {/* Text Paragraph */}
      <p className="grid-item paragraph-base p-mb-3">
        We blijven vragen stellen, aan onszelf en aan de twee communities. Aannames testen. Willen jullie door? Willen jullie een dragende rol of willen jullie alleen aanwezig zijn? Willen jullie dit nog steeds?
      </p>

      {/* Quote Section */}
      <div className="grid-item grid-item-spacing-xl">
        <h3 className="section-heading-small">
          Elke keer anders
        </h3>
        <p className="large-quote">
          Co-creatie is persoonlijk, afhankelijk van de community en van de journalist en elke keer anders.
        </p>
      </div>

      {/* Text about Hasan and Costas */}
      <p className="grid-item paragraph-base p-mb-3">
        We proberen zo min mogelijk in te vullen voor de deelnemers. Hasan, uit de Voorkamer-groep, genoot van de bijeenkomsten, maar had liever meegewerkt aan een project waarvan het onderwerp vooraf was bepaald. Hij had behoefte aan meer sturing, meer structuur en meer focus op het einddoel. "Wat ze probeerden te creëren was een open proces," zegt Costas. Voor hem werkte dat.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        Het kost tijd om uit te vinden wie wat graag wil doen. Dat vraagt ook van ons andere kwaliteiten. We sturen twee teams aan en zijn voor iedereen op zoek naar een passende rol. In de Voorkamer-groep zijn sommigen goed in documenten vinden, anderen in verhalen vertellen. Bij SAWA wil niemand leren editen.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        Hoe verder we komen in het proces hoe meer we terugvallen op onze journalistieke expertise en hoe meer we weer zelf uitvoeren. De communities hebben kennis over het onderwerp, wij over het journalistieke proces. We hakken daarom steeds meer knopen door.
      </p>

      {/* Hafid alleen de klok niet Image */}
      <div className="grid-item grid-item-spacing">
        <img 
          src="/tekeningen/groot-beeld/8_KF03.png"
          alt="Alleen de klok niet Hafid"
          className="chapter-image"
        />
      </div>

      {/* Text about experiment */}
      <p className="grid-item paragraph-base p-mb-3">
        "Het is een experiment, het draait om het proces en we weten niet of het lukt om ook daadwerkelijk iets af te maken, laat staan te publiceren." Wij blijven het herhalen. Tot de tijd door onze handen begint te glippen. En dat voelt wrang want hoe verder we komen, hoe liever we willen dat het lukt. Een vorm vinden voor de verhalen die we hebben gehoord, ze deelbaar te maken.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        We lazen het in elk rapport: tijd, tijd, tijd. Ook ons zette het als faciliterend team af en toe onder spanning. Het vloog ons aan, viel tegen.
      </p>

      {/* Eten Image */}
      <div className="grid-item grid-item-spacing">
        <img 
          src="/tekeningen/Kantlijn/KF15.png"
          alt="Eten"
          className="kantlijn-image"
        />
      </div>

      {/* Proper Meal Section */}
      <div className="grid-item grid-item-spacing-xl">
        <h3 className="section-heading-small">
          Proper Meal
        </h3>
        <p className="large-quote">
          <strong>Juma:</strong> We are not cooking fast food, we are making a proper meal.
        </p>
        <button 
          className="audio-button"
          aria-label="Play proper meal audio"
          onClick={onPropermealAudioClick}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </button>
      </div>

      {/* Text about ending */}
      <p className="grid-item paragraph-base p-mb-3">
        We besloten met elkaar dat onze tijd binnen dit programma te krap was om de verhalen die we maakten te voorzien van wederhoor of te pitchen aan derden en sloten af zoals we begonnen: persoonlijk, in klein gezelschap.
      </p>

      {/* Text about ending */}
      <p className="grid-item paragraph-base p-mb-3">
        Deze reis eindigt in november 2025. Wat we leren is geen rocket science: wie vertrouwen geeft, kan het ook ontvangen. Het proces van co-creatie kan ongrijpbaar en grillig, maar ook leuk en waardevol. Het kan verhalen opleveren die geworteld zijn en verdiepend. Het verandert niet meteen alles, maar het zet de deur open. In elk geval voor Juma.
      </p>

      {/* Het Begin van Verandering Section */}
      <div className="grid-item grid-item-spacing-xl">
        <h3 className="section-heading-small">
          Het begin van verandering
        </h3>
        <p className="large-quote">
          <strong>Juma:</strong> I never watched any news chanels, I never wanted to.
        </p>
        <button 
          className="audio-button"
          aria-label="Play news channels audio"
          onClick={onNewschannelsAudioClick}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </button>
      </div>

      {/* Final Paragraphs */}
      <p className="grid-item paragraph-base p-mb-3">
        Yahia zegt dat zijn wantrouwen naar de journalistiek het resultaat is van een lang en diep denkproces. Dat verander je niet in een paar weken. Hafid zegt: "Ik had nog nooit een journalist ontmoet." Hij zegt ook dat het werk dat hij ons heeft zien doen makkelijk is: "Ik weet niet wat jullie thuis nog doen, misschien werken jullie daar heel hard?" Ahmed geeft terug dat hij nog beter mee had kunnen praten als we meer tussendoor hadden vertaald. Onze gesprekken in het Engels duurden voor hem soms erg lang, dat was vermoeiend.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        Voor Costas stopt het hier niet. Het uiteindelijke onderwerp, de Regiotaxi, staat ver van hem af. Maar hij wil zich als vervolg graag inschrijven voor een cursus journalistiek. En Hafeez? Die kan eindelijk landen, zijn eerste reis in Nederland eindigt na vier jaar, samen met die van ons.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        Of beter gezegd: begint.
      </p>

      {/* Verblijfsvergunning Audio */}
      <div className="grid-item grid-item-spacing">
        <button 
          className="audio-button"
          aria-label="Play verblijfsvergunning audio"
          onClick={onVerblijfsvergunningAudioClick}
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

export default Chapter9

