# Intro Sequence Implementation

## Overview
A premium React + GSAP intro sequence with title screen, 5 text slides, dynamic background images, custom cursor CTA, and smooth scroll transition.

## Features

### 1. Title Screen
- Full-screen title section with H1 and descriptive text
- "Enter" button to proceed
- Fade-in animation: opacity 0→1, y: 40→0, blur: 12px→0, duration: 1.6s, easing: expo.out
- Keyboard support: Enter/Space to proceed
- Fades out smoothly when "Enter" is clicked

### 2. Five Text Slides
- Slide 1: "Deze website is een persoonlijk reisverslag..."
- Slide 2: "hoe doe je dat nou, andere verhalen schrijven?"
- Slide 3: "Omdat het ertoe doet welke verhalen we vertellen..."
- Slide 4: "Co-creatie in de journalistiek..."
- Slide 5: "Start your journey" + "Begin" button

Each slide:
- Fade-in: opacity 0→1, y: 36→0, blur: 10px→0, duration: 1.8s, easing: expo.out
- Organic highlight animations on marked text
- Highlights start at 1.4s (just before fade-in completes)

### 3. Custom Cursor CTA
- 96px circular cursor
- Light blue (#7EB2DE) background
- "Continue" label (sans-serif, not uppercase)
- Smooth follow with ~180ms delay (GSAP quickTo)
- Only appears after title screen
- Scales on click and slide changes
- Entire viewport is clickable

### 4. Background Images
- Each slide has its own background image
- Images stored in `/public/bg/slide1.png` through `slide5.png`
- Animation: scale 1.08→1.0, opacity 0→1, blur: 6px→2px, duration: 1.8–2.0s
- Parallax effect: 4–7px movement based on mouse position
- Oversized at 180% width for abstract floating effect

### 5. Scroll to Content
- Slide 5 "Begin" button triggers scroll
- Smooth scroll exactly 100vh down
- Intro fades out after scroll completes
- Main content appears below intro

### 6. Accessibility
- Reduced motion: disables parallax, reduces animation duration, removes blurs
- Keyboard navigation: Enter/Space advances, Arrow keys navigate
- Touch support: fixed bottom "Continue" button on touch devices
- ARIA live regions announce slide changes
- Focus outlines on interactive elements

## File Structure

```
src/
  App.jsx                 # Main app with intro sequence
  components/
    TitleScreen.jsx       # Title screen component
    Slide.jsx             # Individual slide component
    CustomCursor.jsx      # Custom cursor CTA
    BackgroundImage.jsx   # Background image with parallax
    TouchFallback.jsx     # Touch device button
  styles.css              # Global styles and animations
public/
  bg/
    slide1.png           # Background for slide 1
    slide2.png           # Background for slide 2
    slide3.png           # Background for slide 3
    slide4.png           # Background for slide 4
    slide5.png           # Background for slide 5
```

## Usage

1. Add background images to `/public/bg/` folder
2. Run `npm run dev`
3. Title screen appears first
4. Click "Enter" or press Enter/Space to proceed
5. Navigate through 5 slides
6. Click "Begin" on slide 5 to scroll to main content

## Customization

### Change Slide Text
Edit the `SLIDES` array in `src/App.jsx`

### Change Colors
Update CSS variables in `src/styles.css`:
- `--color-black`: #1C1C1C
- `--color-white`: #FFFFFA
- `--color-primary`: #F7D14C
- `--color-secondary`: #7EB2DE
- `--color-accent-pink`: #F8DEFB
- `--color-accent-green`: #395B50

### Adjust Animations
- Title screen: Edit `TitleScreen.jsx`
- Slide animations: Edit `Slide.jsx` (duration, easing, blur amount)
- Background animations: Edit `BackgroundImage.jsx`
- Cursor follow: Edit `CustomCursor.jsx` (duration, delayMs)

### Background Images
Place images in `/public/bg/`:
- Recommended size: 1920x1080 or larger
- Format: PNG or JPG
- Optimize for web (< 500KB each)

## Performance

- GPU-accelerated animations (transform, opacity)
- Throttled mouse tracking with requestAnimationFrame
- GSAP quickTo for smooth cursor follow
- Optimized parallax with quickTo
- Lazy loading of background images

## Browser Support

- Modern browsers with ES6+ support
- CSS custom properties support required
- GSAP 3.x required
- requestAnimationFrame support

