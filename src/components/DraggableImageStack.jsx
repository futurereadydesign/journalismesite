// src/components/DraggableImageStack.jsx
import { useLayoutEffect, useRef, memo } from 'react'
import { gsap } from 'gsap'
import { Draggable, InertiaPlugin } from 'gsap/all'

gsap.registerPlugin(Draggable, InertiaPlugin)

const DraggableImageStack = ({ images, reducedMotion = false, boundsPadding = 0 }) => {
  const containerRef = useRef(null)
  const draggablesRef = useRef([])
  const topZIndexRef = useRef(images.length)
  const cardZIndexesRef = useRef({}) // Store z-index for each card
  const observersRef = useRef([]) // Store MutationObservers

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const nodes = Array.from(container.querySelectorAll('.draggable-image'))

    // Store current positions before cleanup
    const currentPositions = draggablesRef.current.map((drag, index) => {
      if (drag && drag.target) {
        const x = gsap.getProperty(drag.target, 'x') || 0
        const y = gsap.getProperty(drag.target, 'y') || 0
        const zIndex = cardZIndexesRef.current[index] || 
                      parseInt(window.getComputedStyle(drag.target).zIndex) || 
                      (images.length - index)
        return { x, y, zIndex }
      }
      const zIndex = cardZIndexesRef.current[index] || (images.length - index)
      return { x: 0, y: 0, zIndex }
    })
    
    // Update topZIndexRef
    const maxZIndex = Math.max(...currentPositions.map(p => p.zIndex), images.length)
    if (maxZIndex > topZIndexRef.current) {
      topZIndexRef.current = maxZIndex
    }

    // Clean up observers
    observersRef.current.forEach(observer => observer.disconnect())
    observersRef.current = []
    
    // Clean up draggables
    draggablesRef.current.forEach(d => d && d.kill())
    draggablesRef.current = []

    // Calculate bounds - allow more freedom for dragging
    const containerRect = container.getBoundingClientRect()
    // Allow cards to be dragged further outside the container
    const maxDragDistance = Math.max(containerRect.width, containerRect.height) * 0.8
    const bounds = {
      minX: -maxDragDistance,
      maxX: maxDragDistance,
      minY: -maxDragDistance,
      maxY: maxDragDistance
    }

    nodes.forEach((node, index) => {
      const initialRotation = images[index]?.rotation || 0
      
      // Restore previous position or use initial offset
      const savedPos = currentPositions[index] || { x: 0, y: 0, zIndex: images.length - index }
      const initialX = savedPos.x !== 0 ? savedPos.x : 0
      const initialY = savedPos.y !== 0 ? savedPos.y : 0
      const initialZIndex = savedPos.zIndex || (images.length - index)
      
      // Store z-index in ref
      cardZIndexesRef.current[index] = initialZIndex

      // Set initial rotation (NOT z-index via GSAP)
      gsap.set(node, {
        rotation: initialRotation,
        transformOrigin: 'center center',
        willChange: 'transform'
      })
      
      // Set dynamic positioning via CSS custom properties
      // Create more organic, natural stacking with better visibility
      const imgData = images[index]
      const baseOffset = 35 // Increased offset to show more of each card
      
      // Calculate organic offsets - more variation, less uniform
      const leftOffset = imgData?.left || `${index * baseOffset}px`
      const topOffset = imgData?.top || `${index * baseOffset * 0.8}px`
      
      node.style.setProperty('--card-width', `${imgData?.width || 300}px`)
      node.style.setProperty('--card-height', `${imgData?.height || 400}px`)
      node.style.setProperty('--card-left', leftOffset)
      node.style.setProperty('--card-top', topOffset)
      
      // Set z-index directly on style - never via GSAP
      node.style.zIndex = initialZIndex.toString()
      
      // Add reduced motion class if needed
      if (reducedMotion) {
        node.classList.add('reduced-motion')
      }
      
      // Create MutationObserver to watch for z-index changes and restore it
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const currentZIndex = cardZIndexesRef.current[index]
            const computedZIndex = parseInt(window.getComputedStyle(node).zIndex)
            
            // If z-index was changed and it's not our stored value, restore it
            if (computedZIndex !== currentZIndex && currentZIndex !== undefined) {
              // Use requestAnimationFrame to avoid infinite loops
              requestAnimationFrame(() => {
                node.style.setProperty('z-index', currentZIndex.toString(), 'important')
              })
            }
          }
        })
      })
      
      // Observe style attribute changes
      observer.observe(node, {
        attributes: true,
        attributeFilter: ['style']
      })
      
      observersRef.current.push(observer)

      if (reducedMotion) return

      // Create draggable
      const drag = Draggable.create(node, {
        type: 'x,y',
        x: initialX,
        y: initialY,
        bounds: bounds,
        inertia: true,
        edgeResistance: 0.5,
        allowContextMenu: true,
        allowNativeTouchScrolling: false,
        liveSnap: false,
        snap: false,
        zIndexBoost: false, // Disable GSAP's automatic z-index management
        onPress() {
          // Bring card to front
          topZIndexRef.current += 1
          const newZIndex = topZIndexRef.current
          cardZIndexesRef.current[index] = newZIndex
          
          // Set z-index with !important to prevent GSAP from overriding
          node.style.setProperty('z-index', newZIndex.toString(), 'important')
          node.classList.add('dragging')
        },
        onRelease() {
          node.classList.remove('dragging')
          const currentZIndex = cardZIndexesRef.current[index]
          
          // Ensure z-index stays set
          node.style.setProperty('z-index', currentZIndex.toString(), 'important')
          
          // Animate rotation only
          gsap.to(node, {
            rotation: initialRotation,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)',
            overwrite: false
          })
        },
        onDrag() {
          const currentZIndex = cardZIndexesRef.current[index]
          // Ensure z-index stays set during drag
          node.style.setProperty('z-index', currentZIndex.toString(), 'important')
          
          // Update rotation
          const rot = initialRotation + (this.x * 0.05) + (this.y * 0.05)
          gsap.to(node, { 
            rotation: rot, 
            duration: 0.1, 
            overwrite: false
          })
        },
        onThrowUpdate() {
          const currentZIndex = cardZIndexesRef.current[index]
          // Ensure z-index stays set during throw
          node.style.setProperty('z-index', currentZIndex.toString(), 'important')
          
          const rot = initialRotation + (this.x * 0.05) + (this.y * 0.05)
          gsap.set(node, { rotation: rot })
        },
        onThrowComplete() {
          const currentZIndex = cardZIndexesRef.current[index]
          
          // Ensure z-index stays set
          node.style.setProperty('z-index', currentZIndex.toString(), 'important')
          
          // Animate rotation only
          gsap.to(node, {
            rotation: initialRotation,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)',
            overwrite: false
          })
        }
      })[0]

      draggablesRef.current.push(drag)
    })

    return () => {
      // Clean up observers
      observersRef.current.forEach(observer => observer.disconnect())
      observersRef.current = []
      
      // Clean up draggables
      draggablesRef.current.forEach(d => d && d.kill())
      draggablesRef.current = []
    }
  }, [images, reducedMotion, boundsPadding])

  return (
    <div
      ref={containerRef}
      className="draggable-image-stack"
    >
      {images.map((img, index) => (
        <div
          key={img.key ?? index}
          className="draggable-image"
          data-index={index}
        >
          <img
            src={img.src}
            alt={img.alt || `Image ${index + 1}`}
            onError={(e) => {
              e.currentTarget.classList.add('error')
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default memo(DraggableImageStack)
