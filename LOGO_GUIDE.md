# Terry Golden Logo System

## Logo Variants

The Terry Golden brand uses three official logo variants stored in `src/config/logoConfig.ts`:

### 1. Light Logo (Primary)
- **Usage**: Dark backgrounds (navigation, footer, hero sections)
- **File**: `logoConfig.light`
- **Color**: White/Light colored text
- **Format**: WebP, 16:9 aspect ratio

### 2. Dark Logo
- **Usage**: Light backgrounds (if needed)
- **File**: `logoConfig.dark`
- **Color**: Black/Dark colored text
- **Format**: WebP, 16:9 aspect ratio

### 3. Icon/Monogram
- **Usage**: Favicon, app icons, social media avatars
- **File**: `logoConfig.icon`
- **Format**: WebP, 1:1 square aspect ratio

## Implementation

### In React Components
```tsx
import logoConfig from '../config/logoConfig';

<img 
  src={logoConfig.light} 
  alt="Terry Golden" 
  className="h-10 w-auto"
/>
```

### Current Usage
- **Navigation**: Header logo (light variant)
- **Footer**: Brand logo (light variant)
- **Favicon**: Browser tab icon (monogram)
- **Social Meta**: Open Graph & Twitter cards (light variant)

## Responsive Sizing
- **Mobile Navigation**: h-8 (32px)
- **Desktop Navigation**: h-10 (40px)
- **Footer**: h-12 (48px)
- **Favicon**: 32x32px

## Brand Guidelines
- Always maintain aspect ratio
- Use `object-contain` for proper scaling
- Ensure sufficient contrast with background
- Never distort or modify logo colors
