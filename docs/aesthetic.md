# WoundSnap Design Aesthetic Guide

This document defines the visual design system for WoundSnap based on the mockup designs and implemented screens.

## Color Palette

### Primary Colors
- **Teal Primary:** `#17a2b8` - Main brand color for buttons, headers, and accents
- **Teal Hover:** `#138496` - Darker teal for hover states
- **White:** `#ffffff` - Primary background color for clean, medical aesthetic
- **Black:** `#000000` - Primary text color for maximum readability

### Supporting Colors
- **Dark Gray:** `#333333` - Secondary text and subtle elements
- **Light Gray:** `#666666` - Tertiary text (forgot password, labels)
- **Border Gray:** `#dddddd` - Input borders and card dividers
- **Placeholder Gray:** `#999999` - Input placeholder text

### Status Colors
- **Error Red:** `#f8d7da` background, `#721c24` text
- **Warning Yellow:** `#ffeb3b` for risk factors
- **Success Green:** `#4CAF50` for positive states

### Legacy Colors (Non-Mockup Screens)
- **Gradient Background:** `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Glass Effects:** `rgba(255, 255, 255, 0.1)` with `backdrop-filter: blur(10px)`

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Font Sizes & Weights
- **Large Title:** `2.5rem` / `font-weight: 600` (Login title)
- **Page Title:** `2rem` / `font-weight: 700` (Welcome title)
- **App Name:** `1.5rem` / `font-weight: 600` (Header branding)
- **Body Text:** `1.1rem` / `font-weight: 400` (Descriptions)
- **Input Text:** `1rem` / `font-weight: 400`
- **Button Text:** `1.1rem` / `font-weight: 600`
- **Small Text:** `0.9rem` / `font-weight: 400` (Links, labels)

### Line Height
- **Headings:** `1.2` - Tight for impact
- **Body Text:** `1.6` - Comfortable reading
- **Lists:** `1.4` - Balanced spacing

## Layout Patterns

### Screen Structure
```css
/* Clean white background screens (mockup-based) */
.screen-container {
  background: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Gradient background screens (dashboard, results) */
.gradient-background {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Container Patterns
- **Centered Content:** `max-width: 500px` for forms and focused content
- **Padding:** `2rem` on desktop, `1rem` on mobile
- **Card Layouts:** White backgrounds with `border-radius: 16px` and subtle shadows

### Header Patterns
```css
/* Teal header style (Welcome screen) */
.teal-header {
  background: #17a2b8;
  border-radius: 0 0 25px 25px;
  padding: 3rem 2rem 2rem 2rem;
  box-shadow: 0 4px 15px rgba(23, 162, 184, 0.3);
}
```

## Component Styles

### Buttons

#### Primary Button (Teal)
```css
.primary-button {
  background: #17a2b8;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-button:hover {
  background: #138496;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(23, 162, 184, 0.3);
}
```

#### Secondary Button (Black)
```css
.secondary-button {
  background: #000000;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.secondary-button:hover {
  background: #333333;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
```

#### Gray Button (Upload/Secondary Actions)
```css
.gray-button {
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
}

.gray-button:hover {
  background: #545b62;
}
```

### Input Fields
```css
.input-field {
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 25px;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  color: #333333;
  outline: none;
  transition: border-color 0.2s;
}

.input-field:focus {
  border-color: #17a2b8;
}

.input-field::placeholder {
  color: #999999;
}
```

### Text Areas
```css
.textarea-field {
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1rem;
  color: #333333;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
}
```

## Spacing System

### Margins & Padding
- **Small:** `0.5rem` - Internal component spacing
- **Medium:** `1rem` - Standard element spacing
- **Large:** `1.5rem` - Section spacing
- **Extra Large:** `2rem` - Major section separation
- **Huge:** `2.5rem` - Content block separation

### Border Radius
- **Buttons:** `25px` - Fully rounded pill style
- **Cards:** `16px` - Prominent rounded corners
- **Input Fields:** `25px` (text inputs) / `8px` (textareas)
- **Headers:** `0 0 25px 25px` - Rounded bottom corners only

## Interactive Elements

### Hover Effects
- **Buttons:** `transform: translateY(-2px)` + appropriate shadow
- **Links:** `text-decoration: underline` or subtle color change
- **Cards:** Subtle background brightness increase

### Transitions
```css
transition: all 0.2s;
```
All interactive elements should have smooth 0.2s transitions.

### Focus States
- **Inputs:** Teal border color `#17a2b8`
- **Buttons:** Maintain accessibility with proper focus indicators

## Screen Categories

### Mockup-Based Screens (Clean White)
Use these patterns for screens with design mockups:
- Welcome Screen
- Login Screen  
- Photo Capture Screen
- Any future screens with provided mockups

**Characteristics:**
- White backgrounds (`#ffffff`)
- Teal and black color scheme
- Card-based layouts
- Minimal, focused content

### Dashboard/Workflow Screens (Gradient)
Use these patterns for functional workflow screens:
- Dashboard
- Results Screen
- Analysis displays

**Characteristics:**
- Apply `.gradient-background` class
- Glass morphism effects with `rgba(255, 255, 255, 0.1)` and `backdrop-filter`
- White text on gradient backgrounds

## Mobile Responsiveness

### Breakpoints
```css
@media (max-width: 768px) {
  /* Mobile adjustments */
}
```

### Mobile Patterns
- **Padding:** Reduce from `2rem` to `1rem`
- **Font Sizes:** Scale down appropriately
- **Buttons:** Full width or centered
- **Content Cards:** Adjust margins for smaller screens

## Icon Usage

### Consistent Icon Set
- **Heart:** `🤍` - Branding (white heart)
- **Camera:** `📷` - Photo capture
- **Medical:** Standard emoji for medical contexts
- **Navigation:** Standard UI icons (🏠, ⚙️, etc.)

### Icon Sizing
- **Branding:** `2rem` (header icons)
- **Large Illustrations:** `8rem` (camera in photo capture)
- **UI Icons:** `1.25rem` (navigation, buttons)

## Error Handling Design

### Error Messages
```css
.error-display {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  border-radius: 8px;
  padding: 1rem;
}
```

### Loading States
- **Buttons:** Show loading text ("Logging in...", "Capturing...")
- **Disabled State:** `opacity: 0.6` + `cursor: not-allowed`

## Implementation Guidelines

### CSS Class Naming
- **New Screens:** Use `-new` suffix for mockup-based designs
- **Legacy Screens:** Keep existing class names for gradient screens
- **Components:** Descriptive, semantic naming

### Code Organization
1. **Global Styles:** Base typography, colors, utilities
2. **Screen Styles:** Grouped by screen/component
3. **Responsive:** Mobile adjustments at end of each section

### Quality Standards
- All colors must have sufficient contrast for accessibility
- Interactive elements must have clear hover/focus states
- Mobile experience must be optimized for touch interfaces
- Loading and error states must be clearly designed

## Usage Examples

### Creating a New Screen
```tsx
// For mockup-based screens
<div className="new-screen-name">
  <div className="content-container">
    <h1 className="screen-title">Screen Title</h1>
    <button className="primary-button">Action</button>
  </div>
</div>
```

### CSS Template
```css
.new-screen-name {
  background: #ffffff;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.content-container {
  width: 100%;
  max-width: 500px;
  text-align: center;
}
```

This guide ensures all new screens maintain the professional, medical-grade aesthetic established in the mockups while providing flexibility for functional workflow screens.
