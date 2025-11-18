# Fonts Directory

Place your local font files here (`.woff2`, `.woff`, `.ttf`, `.otf`).

## Example Structure:
```
fonts/
  YourFont-Regular.woff2
  YourFont-Bold.woff2
  YourFont-Italic.woff2
```

## Then add @font-face in styles.css:

```css
@font-face {
  font-family: 'YourFont';
  src: url('/src/fonts/YourFont-Regular.woff2') format('woff2'),
       url('/src/fonts/YourFont-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'YourFont';
  src: url('/src/fonts/YourFont-Bold.woff2') format('woff2'),
       url('/src/fonts/YourFont-Bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

