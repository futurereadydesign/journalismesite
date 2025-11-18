# Custom Cursor CTA Landing Page

A premium 5-slide landing intro with a custom cursor CTA that follows the mouse with smooth, delayed motion.

## Features

- **Custom Cursor CTA**: Circular cursor with "Continue" label that smoothly follows mouse movement
- **Smooth Animations**: GSAP-powered animations with expo-out and power2-out easing
- **5-Slide System**: Click anywhere to advance through slides
- **Accessibility**: Full keyboard navigation, reduced motion support, and ARIA live regions
- **Touch Support**: Automatic fallback to fixed bottom button on touch devices
- **Performance Optimized**: GPU-accelerated animations, throttled mouse tracking

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Customization

### Cursor Settings

Edit `src/components/CustomCursor.jsx`:
- `delayMs`: Follow delay (default: 200ms)
- `label`: Cursor label text (default: "Continue")
- Size: Adjust width/height in the component (96px desktop, 72px tablet)

### Animation Settings

Edit `src/components/Slide.jsx`:
- Text animation duration: `duration: 1.6` (expo.out)
- Blur amount: `filter: 'blur(10px)'`
- Y offset: `y: 40`

### Slide Content

Edit `src/App.jsx`:
- Modify the `SLIDES` array to change slide content
- Add/remove slides as needed

## Accessibility

- **Keyboard Navigation**: Space/Enter to advance, Arrow keys to navigate
- **Reduced Motion**: Automatically detects `prefers-reduced-motion` and simplifies animations
- **Screen Readers**: ARIA live regions announce slide changes
- **Focus Management**: Visible focus outlines on interactive elements

## Browser Support

- Modern browsers with ES6+ support
- CSS Grid and Flexbox support required
- GSAP 3.x required

## Performance

- Uses `transform` and `opacity` for GPU acceleration
- RequestAnimationFrame for smooth mouse tracking
- Throttled animations to maintain 60fps
- Minimal layout thrashing

