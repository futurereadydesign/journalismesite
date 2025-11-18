const ChapterRailDesktop = ({ chapters, currentChapterIndex, onNavigate }) => {
  const handleChapterClick = (index) => {
    onNavigate(index)
  }

  return (
    <nav className="chapter-rail-desktop" aria-label="Chapter navigation">
      {chapters.map((chapter, index) => (
        <button
          key={chapter.id}
          className={`chapter-rail-item ${index === currentChapterIndex ? 'active' : ''}`}
          onClick={() => handleChapterClick(index)}
          aria-label={`Go to chapter ${index + 1}: ${chapter.title}`}
        >
          <span className="chapter-rail-dot" />
          <span className="chapter-rail-label">{chapter.shortTitle || chapter.title}</span>
        </button>
      ))}
    </nav>
  )
}

export default ChapterRailDesktop

