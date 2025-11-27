// Chapter 10 Component
function Chapter10() {
  return (
    <section 
      id="chapter-10"
      className="fortythree-section chapter" 
      data-chapter="10" 
      data-chapter-title="Roadmap"
    >
      {/* Title */}
      <div className="grid-item section-title-wrapper roadmap-title">
        <span className="chapter-label">Hoofdstuk 10</span>
        <h1 className="section-title roadmap-title-text">
          Roadmap
        </h1>
      </div>

      {/* Roadmap Image */}
      <div className="grid-item grid-item-spacing">
        <img 
          src="/tekeningen/groot-beeld/10_informatiepagina_KF12.png"
          alt="Roadmap"
          className="chapter-image"
        />
      </div>

      {/* Team Section */}
      <div className="grid-item grid-item-spacing roadmap-section">
        <h3 className="roadmap-heading">
          Het team
        </h3>
        <p className="paragraph-base p-mb-3">
          Het team achter Iedereenkanreizen.com bestaat uit drie deelnemers van de SVDJ Incubator 2025: Qali Nur, Anna van der Kruis en Afke Laarakker. Zij werkten met twee bestaande gemeenschappen: SAWA Collective en bezoekers van De Voorkamer.
        </p>
        <p className="paragraph-base p-mb-3">
          Qali Nur is journalist, podcastmaker en documentairemaker. Anna van der Kruis is schrijver met een theaterachtergrond. Afke Laarakker is journalist met een architectuur achtergrond.
        </p>
      </div>

      {/* Deelnemers Section */}
      <div className="grid-item grid-item-spacing roadmap-section">
        <h3 className="roadmap-heading">
          Deelnemers De Voorkamer
        </h3>
        <p className="paragraph-base">
          Hafid, Hasan, Costas, Ahmed en Anas
        </p>
      </div>

      <div className="grid-item grid-item-spacing roadmap-section">
        <h3 className="roadmap-heading">
          Deelnemers SAWA Collective
        </h3>
        <p className="paragraph-base">
          Juma, Yahia, Hadir, Haroon en Emirhan
        </p>
      </div>

      {/* Portretten Image */}
      <div className="grid-item grid-item-spacing">
        <img 
          src="/tekeningen/groot-beeld/Cocreatie-portret1.svg"
          alt="Alle portretten van de deelnemers"
          className="chapter-image"
        />
      </div>

      {/* Illustraties Section */}
      <div className="grid-item grid-item-spacing roadmap-section">
        <h3 className="roadmap-heading">
          Illustraties
        </h3>
        <p className="paragraph-base">
          Conform Cox, Katja Fred maakten de illustraties op deze website en maakten live tekeningen tijdens onze bijeenkomsten.
        </p>
      </div>

      {/* Incubator Section */}
      <div className="grid-item grid-item-spacing roadmap-section">
        <h3 className="roadmap-heading">
          Incubator
        </h3>
        <p className="paragraph-base p-mb-3">
          Dit programma wordt jaarlijks georganiseerd door het Stimuleringsfonds voor de Journalistiek, met als doel de journalistiek te innoveren. Dit jaar was de centrale vraag: "Hoe betrekken we het publiek bij de journalistiek?" Naast ons namen er nog zeven andere teams deel die allemaal hun eigen antwoorden zochten op deze vraag.
        </p>
      </div>

      {/* Bronnen Section */}
      <div className="grid-item grid-item-spacing roadmap-section">
        <h3 className="roadmap-heading">
          Bronnen
        </h3>
        <p className="paragraph-base">
          We maakten in ons project gebruik van rapporten, methodieken en tools die werden bedacht door anderen. Ben je benieuwd welke bronnen we raadpleegden, download dan deze PDF.
        </p>
      </div>

      {/* Spoken Word Section */}
      <div className="grid-item grid-item-spacing roadmap-section">
        <h3 className="roadmap-heading">
          Spoken Word
        </h3>
        <p className="paragraph-base">
          Op deze website zijn een aantal fragmenten te horen en te lezen van teksten die Anna ter plekke schreef en voorlas tijdens de bijeenkomsten die we organiseerden. Wil je deze teksten lezen? Download dan de PDF.
        </p>
      </div>

      {/* Dank aan Section */}
      <div className="grid-item grid-item-spacing roadmap-section">
        <h3 className="roadmap-heading">
          Dank aan
        </h3>
        <p className="paragraph-base p-mb-3">
          Marie-José van Schaik, Anouk Tijnagel en Yetunde Oludare, onze onmisbare contactpersonen binnen de twee gemeenschappen.
        </p>
        <p className="paragraph-base p-mb-3">
          Teamcoaches Ruud Bisseling en Tessa Zwaving. Mentoren Robin Keeris en last but not least Jan-Willem Franken, die ons hielp stevig op de rails te blijven tijdens de spannende laatste maanden.
        </p>
      </div>

      {/* Contact Section */}
      <div className="grid-item grid-item-spacing roadmap-section">
        <h3 className="roadmap-heading">
          Contact
        </h3>
        <p className="paragraph-base">
          mail info@iedereenkanreizen.com
        </p>
      </div>

      {/* Webdesign Section */}
      <div className="grid-item grid-item-spacing roadmap-section">
        <h3 className="roadmap-heading">
          Webdesign en development
        </h3>
        <p className="paragraph-base">
          Future Ready Design, Robbin Jansen en Stijn Zwaard.
        </p>
      </div>
    </section>
  )
}

export default Chapter10

