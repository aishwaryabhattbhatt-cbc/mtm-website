# Responsive Website Framework

A complete responsive web foundation with a 12-column grid system, designed to work seamlessly from 1920px desktop screens down to mobile devices.

## 🎯 Features

- **12-Column Grid System** - Flexible, mobile-first grid layout
- **5 Responsive Breakpoints** - Optimized for all device sizes
- **CSS Custom Properties** - Easy customization with design tokens
- **Responsive Typography** - Scales font sizes based on screen size
- **Responsive Margins & Gutters** - Automatically adjusts spacing
- **JavaScript Utilities** - Breakpoint detection and responsive helpers
- **Utility Classes** - Quick styling without writing custom CSS

## 📱 Breakpoints

| Breakpoint | Width | Use Case |
|-----------|-------|----------|
| **xs** | < 480px | Small phones |
| **sm** | 480px - 767px | Large phones |
| **md** | 768px - 1023px | Tablets |
| **lg** | 1024px - 1439px | Small laptops |
| **xl** | 1440px - 1919px | Desktops |
| **xxl** | 1920px+ | Large desktops |

## 🏗️ Grid System

### 12-Column Layout

The grid uses CSS Grid with 12 columns. All columns are full-width on mobile by default and expand at larger breakpoints.

#### Column Classes

```html
<!-- Mobile: Full width (12 cols) -->
<div class="row">
    <div class="col col-12">Full Width</div>
    
    <!-- Tablet: Half width (6 cols), Mobile: Full width (12 cols) -->
    <div class="col col-12 col-md-6">Half Width on Tablet</div>
    
    <!-- Desktop: Quarter width (3 cols), Tablet: Half (6 cols), Mobile: Full (12 cols) -->
    <div class="col col-12 col-md-6 col-lg-3">Quarter Width on Desktop</div>
</div>
```

#### Available Column Spans

- `col-1` to `col-12` - Mobile (xs/sm)
- `col-md-1` to `col-md-12` - Tablet
- `col-lg-1` to `col-lg-12` - Small desktop
- `col-xl-1` to `col-xl-12` - Desktop
- `col-xxl-1` to `col-xxl-12` - Large desktop

## 🎨 Responsive Spacing

### Gaps (Gutters)

| Breakpoint | Gap Size |
|-----------|----------|
| Mobile | 20px |
| Tablet | 24px |
| Desktop | 32px |

### Margin & Padding Tokens

```css
--margin-xs: 8px
--margin-sm: 12px
--margin-md: 16px
--margin-lg: 24px
--margin-xl: 32px
--margin-2xl: 48px

--padding-xs: 8px
--padding-sm: 12px
--padding-md: 16px
--padding-lg: 24px
--padding-xl: 32px
--padding-2xl: 48px
```

## 🔧 Container Widths

| Breakpoint | Width | Padding |
|-----------|-------|---------|
| Mobile (xs) | 100% | 20px |
| Mobile (sm) | 100% | 20px |
| Tablet (md) | 100% | 24px |
| Small Desktop (lg) | 960px | 32px |
| Desktop (xl) | 1200px | 32px |
| Large Desktop (xxl) | 1320px | 32px |

## 🚀 Usage Examples

### Basic Responsive Layout

```html
<div class="container">
    <div class="row">
        <!-- Mobile: Full width, Tablet: Half, Desktop: Third -->
        <div class="col col-12 col-md-6 col-lg-4">
            <div class="box">Column 1</div>
        </div>
        
        <div class="col col-12 col-md-6 col-lg-4">
            <div class="box">Column 2</div>
        </div>
        
        <div class="col col-12 col-md-6 col-lg-4">
            <div class="box">Column 3</div>
        </div>
    </div>
</div>
```

### Two-Column Layout

```html
<div class="container">
    <div class="row">
        <!-- Main content: 2/3 on desktop, full on mobile -->
        <div class="col col-12 col-lg-8">
            <div class="box">Main Content</div>
        </div>
        
        <!-- Sidebar: 1/3 on desktop, full on mobile -->
        <div class="col col-12 col-lg-4">
            <div class="box">Sidebar</div>
        </div>
    </div>
</div>
```

### Responsive Cards Grid

```html
<div class="container">
    <div class="row">
        <!-- 1 per row on mobile, 2 on tablet, 4 on desktop -->
        <div class="col col-12 col-md-6 col-lg-3">
            <div class="card">Card 1</div>
        </div>
        <div class="col col-12 col-md-6 col-lg-3">
            <div class="card">Card 2</div>
        </div>
        <div class="col col-12 col-md-6 col-lg-3">
            <div class="card">Card 3</div>
        </div>
        <div class="col col-12 col-md-6 col-lg-3">
            <div class="card">Card 4</div>
        </div>
    </div>
</div>
```

## 📐 CSS Custom Properties

All values can be customized via CSS variables in the `:root` selector:

```css
:root {
    --grid-gap: 20px;
    --grid-gap-md: 24px;
    --grid-gap-lg: 32px;
    --container-width-lg: 960px;
    --container-width-xl: 1200px;
    --margin-lg: 24px;
    /* ...and more */
}
```

## 💻 JavaScript API

The `ResponsiveManager` class provides breakpoint detection:

```javascript
// Check current breakpoint
responsive.currentBreakpoint // 'md', 'lg', 'xl', etc.

// Check device type
responsive.isMobile()   // true/false
responsive.isTablet()   // true/false
responsive.isDesktop()  // true/false

// Get dimensions
responsive.getWindowDimensions()  // { width, height, breakpoint }

// Get responsive values
responsive.getGridGap()       // 20, 24, or 32 (based on breakpoint)
responsive.getContainerWidth() // 'auto', 960, 1200, or 1320

// Listen for breakpoint changes
window.addEventListener('breakpointchange', (event) => {
    console.log('New breakpoint:', event.detail.breakpoint);
});
```

## 🎯 Utility Classes

### Margin
```html
<div class="mt-md mb-lg mx-auto">Margin utilities</div>
```

### Padding
```html
<div class="p-lg">Padding utilities</div>
```

### Text Alignment
```html
<div class="text-center">Centered text</div>
<div class="text-left">Left aligned</div>
<div class="text-right">Right aligned</div>
```

### Display & Flex
```html
<div class="flex-center">Flex centered content</div>
<div class="flex-between">Space between items</div>
<div class="d-none-mobile">Hidden on mobile</div>
<div class="d-none-desktop">Hidden on desktop</div>
```

## 📝 File Structure

```
Website-v3/
├── index.html       # HTML structure with example layouts
├── styles.css       # Complete responsive CSS with grid system
├── script.js        # JavaScript responsive utilities
└── README.md        # This file
```

## 🔍 How It Works

### Mobile-First Approach

1. **Default styles** apply to mobile (< 768px)
2. **Media queries** override for larger screens
3. **Grid columns** default to full-width (col-12)
4. **Breakpoint classes** (col-md-6, col-lg-4, etc.) expand at larger sizes

### Responsive Containers

- Container width scales at breakpoints
- Padding/gutters adjust automatically
- Typography scales for readability

### Flexible Grid

- 12-column system works for any layout
- Easily create 2, 3, 4, or 6-column layouts
- Nesting rows/columns supported

## 🎨 Customization

### Change Grid Gap

```css
:root {
    --grid-gap: 16px;      /* Mobile */
    --grid-gap-md: 20px;   /* Tablet */
    --grid-gap-lg: 24px;   /* Desktop */
}
```

### Change Container Widths

```css
:root {
    --container-width-lg: 1024px;
    --container-width-xl: 1280px;
    --container-width-xxl: 1400px;
}
```

### Add Custom Breakpoint

```css
:root {
    --breakpoint-custom: 1600px;
}

@media (min-width: 1600px) {
    .col-custom-6 {
        grid-column: span 6;
    }
}
```

## 🧪 Testing Responsive Design

1. **Desktop**: Open in full-width browser (1920px+)
2. **Tablet**: Resize browser to 768px - 1023px
3. **Mobile**: Resize browser to < 480px or use DevTools
4. **Console**: Check `responsive` object for debugging

## 📊 Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ⚠️ Limited CSS Grid support

## 📖 Next Steps

1. Add your branding colors to CSS variables
2. Create components (buttons, navigation, cards)
3. Add interactive features with JavaScript
4. Test across devices
5. Deploy!

---

**Built with ❤️ for responsive web design**
