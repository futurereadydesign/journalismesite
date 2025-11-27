// Chapter 3 Component
function Chapter3() {
  return (
    <section 
      id="chapter-3"
      className="fortythree-section chapter" 
      data-chapter="3" 
      data-chapter-title="Love Language"
    >
      {/* Title */}
      <div className="grid-item section-title-wrapper">
        <span className="chapter-label">Hoofdstuk 3</span>
        <h1 className="section-title">
          Love Language
        </h1>
      </div>

      {/* Diner Image */}
      <div className="grid-item grid-item-spacing">
        <img 
          src="/tekeningen/groot-beeld/3.1_Diner_KF13.png"
          alt="Diner"
          className="chapter-image"
        />
      </div>

      {/* Qali Quote Section */}
      <div className="grid-item grid-item-spacing-xl">
        <div className="anna-section">
          <div className="anna-quote">
            <h3 className="section-heading-small">To introduce people</h3>
            <p className="paragraph-base">
              <strong>Qali:</strong> "One of my love languages is to introduce people to new things, a new dish or a new film."
            </p>
          </div>
          <div className="anna-image">
            <img 
              src="/tekeningen/Portretten/Kantlijn-Qali.svg" 
              alt="Qali portret"
              className="anna-drawing"
            />
          </div>
        </div>
      </div>

      {/* Eten Tekening Kantlijn - Decorative Margin Image */}
      <div className="grid-item grid-item-spacing eten-thee-margin-image">
        <img 
          src="/tekeningen/Kantlijn/3.1-eten-en-thee.svg"
          alt="Eten en thee"
          className="eten-thee-decorative"
        />
      </div>

      {/* Text Paragraph */}
      <p className="grid-item paragraph-base p-mb-3">
        Je kan niks organiseren zonder eten, horen we Anouk zeggen, tijdens een van de events voor SAWA. Ze heeft kaasstengels bij zich, chocolade-karamel koeken, druiven, deelt pakjes appelsap uit. "Dit smaakt zoals de appelsap in Ter Apel," zegt een van de jongens.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        Niet veel later ontmoeten we Shirish Kulkarni, een van onze grote voorbeelden. Met zijn rapport News for All zette hij co-creatie in de journalistiek op de kaart. We lezen in dit rapport hoe we verschillende ontmoetingen kunnen hosten – alsof de mensen met wie we werken bij ons thuiskomen.
      </p>

      <p className="grid-item paragraph-base p-mb-3">
        Ook Shirish benadrukt het belang van samen eten. "Het moet lekker zijn en veel," zegt hij, "liefst te veel, zodat iedereen na afloop nog iets kan meenemen."
      </p>
    </section>
  )
}

export default Chapter3

