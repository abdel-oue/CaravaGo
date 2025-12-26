# CaravaGo Theme Documentation

## Color Palette

This document outlines the color scheme used throughout the CaravaGo application.

### Main Colors

#### Main Color
- **Hex**: `#054d6c`
- **Usage**: Primary brand color, main sections, hero backgrounds
- **Tailwind Class**: `bg-main`, `text-main`, `border-main`
- **Variants**:
  - `main-dark`: `#033a52` - Darker variant
  - `main-light`: `#0c6a93` - Lighter variant

#### Primary (Buttons & CTAs)
- **Hex**: `#d92465`
- **Usage**: Primary action buttons, call-to-action elements
- **Tailwind Class**: `bg-primary`, `text-primary`, `border-primary`
- **Variants**:
  - `primary-dark`: `#b81d54` - Darker variant for hover states
  - `primary-light`: `#e6397a` - Lighter variant

#### Secondary (Secondary Buttons)
- **Hex**: `#f1f5f9`
- **Usage**: Secondary buttons, non-primary actions
- **Tailwind Class**: `bg-secondary`, `text-secondary`, `border-secondary`
- **Variants**:
  - `secondary-dark`: `#e2e8f0` - Darker variant

#### On Main (Buttons on Main Background)
- **Hex**: `#0c6a93`
- **Usage**: Buttons and interactive elements placed on main color backgrounds
- **Tailwind Class**: `bg-onMain`, `text-onMain`, `border-onMain`
- **Variants**:
  - `onMain-dark`: `#054d6c` - Darker variant
  - `onMain-light`: `#1a7ba8` - Lighter variant

### Background Colors

#### Light Background
- **Hex**: `#f1f5f9`
- **Usage**: Light background sections, card backgrounds
- **Tailwind Class**: `bg-bgLight`

### Text Colors

- **Black**: `text-black` - Primary text color on light backgrounds
- **White**: `text-white` - Text color on dark/main backgrounds
- **Gray variants**: Use Tailwind's default gray scale (`text-gray-600`, `text-black/70`, etc.)

## Usage Guidelines

### Buttons

1. **Primary Buttons** (`bg-primary`)
   - Use for main call-to-action buttons
   - Example: "Sign up", "Search", "Create listing"
   - Text color: `text-white`

2. **Secondary Buttons** (`bg-secondary`)
   - Use for secondary actions
   - Example: Cancel buttons, alternative actions
   - Text color: `text-black`

3. **Buttons on Main Background** (`bg-onMain`)
   - Use when button is placed on `bg-main` background
   - Example: Search button in hero section
   - Text color: `text-white`

### Backgrounds

- **White**: `bg-white` - Default background for cards and main content areas
- **Light Gray**: `bg-bgLight` (`#f1f5f9`) - Alternative background for sections
- **Main Color**: `bg-main` (`#054d6c`) - Used for hero sections, headers, footers

### Text Colors

- **On Light Backgrounds**: Use `text-black` or `text-black/70` for muted text
- **On Dark/Main Backgrounds**: Use `text-white` or `text-white/90` for muted text
- **Links**: Use `text-main` with `hover:text-main-dark` for hover states

## Color Examples

### Primary Button
```jsx
<button className="bg-primary text-white hover:bg-primary-dark">
  Click Me
</button>
```

### Secondary Button
```jsx
<button className="bg-secondary text-black hover:bg-secondary-dark">
  Cancel
</button>
```

### Button on Main Background
```jsx
<div className="bg-main">
  <button className="bg-onMain text-white hover:bg-onMain-dark">
    Search
  </button>
</div>
```

### Link
```jsx
<a href="#" className="text-main hover:text-main-dark">
  Learn More
</a>
```

## Accessibility

- Ensure sufficient contrast ratios between text and background colors
- Primary buttons (`#d92465`) on white backgrounds meet WCAG AA standards
- Main color (`#054d6c`) text on white backgrounds meets WCAG AA standards
- Always test color combinations for accessibility compliance

## Tailwind Configuration

All colors are defined in `tailwind.config.js`:

```javascript
colors: {
  main: {
    DEFAULT: '#054d6c',
    dark: '#033a52',
    light: '#0c6a93',
  },
  primary: {
    DEFAULT: '#d92465',
    dark: '#b81d54',
    light: '#e6397a',
  },
  bgLight: {
    DEFAULT: '#f1f5f9',
  },
  secondary: {
    DEFAULT: '#f1f5f9',
    dark: '#e2e8f0',
  },
  onMain: {
    DEFAULT: '#0c6a93',
    dark: '#054d6c',
    light: '#1a7ba8',
  },
}
```

## Color Palette Reference

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Main | `#054d6c` | Brand color, hero sections |
| Primary | `#d92465` | Primary buttons, CTAs |
| Secondary | `#f1f5f9` | Secondary buttons, backgrounds |
| On Main | `#0c6a93` | Buttons on main background |
| Background Light | `#f1f5f9` | Light section backgrounds |
| White | `#ffffff` | Card backgrounds, main content |
| Black | `#000000` | Text on light backgrounds |

