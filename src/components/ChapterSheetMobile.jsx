import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const ChapterSheetMobile = ({ chapters, currentChapterIndex, isOpen, onClose, onNavigate }) => {
  const sheetRef = useRef(null)
  const overlayRef = useRef(null)

  // Debug: Log component props
  useEffect(() => {
    console.log('🟢 ChapterSheetMobile props:', {
      chaptersCount: chapters?.length,
      currentChapterIndex,
      isOpen,
      chapters: chapters?.map((ch, i) => ({
        index: i,
        id: ch.id,
        title: ch.title,
        shortTitle: ch.shortTitle,
        isActive: i === currentChapterIndex
      }))
    })
  }, [chapters, currentChapterIndex, isOpen])

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      console.log('🟢 ChapterSheetMobile: Opening sheet')
      document.body.style.overflow = 'hidden'
    } else {
      console.log('🟢 ChapterSheetMobile: Closing sheet')
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Animate sheet
  useEffect(() => {
    if (!sheetRef.current || !overlayRef.current) return

    if (isOpen) {
      gsap.fromTo(overlayRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 0.25 }
      )
      gsap.fromTo(sheetRef.current,
        { y: '100%' },
        { y: 0, duration: 0.3, ease: 'power2.out' }
      )
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2
      })
      gsap.to(sheetRef.current, {
        y: '100%',
        duration: 0.25,
        ease: 'power2.in'
      })
    }
  }, [isOpen])

  const handleChapterClick = (index) => {
    console.log('🟢 ChapterSheetMobile: Chapter clicked', {
      clickedIndex: index,
      chapterTitle: chapters[index]?.title,
      previousIndex: currentChapterIndex,
      previousTitle: chapters[currentChapterIndex]?.title
    })
    onNavigate(index)
    onClose()
  }

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div 
        ref={overlayRef}
        className="chapter-sheet-overlay"
        onClick={handleOverlayClick}
      />
      <div ref={sheetRef} className="chapter-sheet">
        <div className="chapter-sheet-header">
          <h2 className="chapter-sheet-title">Chapters</h2>
          <button
            className="chapter-sheet-close"
            onClick={onClose}
            aria-label="Close chapter navigation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="chapter-sheet-content">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              className={`chapter-sheet-item ${index === currentChapterIndex ? 'active' : ''}`}
              onClick={() => handleChapterClick(index)}
            >
              <span className="chapter-sheet-item-number">{index + 1}</span>
              <div className="chapter-sheet-item-content">
                <span className="chapter-sheet-item-title">{chapter.shortTitle || chapter.title}</span>
                {chapter.subtitle && (
                  <span className="chapter-sheet-item-subtitle">{chapter.subtitle}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

export default ChapterSheetMobile

