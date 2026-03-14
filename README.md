# Gradient Background Generator

A powerful Next.js application for creating stunning SVG gradient backgrounds with real-time preview, interactive dual-color wheel, and AI-powered color recommendations.

## Features

- **Interactive Dual-Color Wheel**: Visual color selection with two simultaneous color pickers on the same wheel
- **Dual Selection Modes**:
  - **Free Selection Mode**: Manually pick two colors simultaneously on the color wheel
  - **Recommendation Mode**: AI-powered color harmony suggestions based on color theory
- **Color Harmony Algorithms**:
  - **Complementary**: Colors opposite on the color wheel (180° apart)
  - **Analogous**: Adjacent colors for harmonious blends (±30°)
  - **Triadic**: Three evenly spaced colors (120° apart)
  - **Split Complementary**: Base color plus adjacent to its complement
  - **Tetradic**: Four colors forming a rectangle on the wheel
  - **Monochromatic**: Single hue with varying lightness/saturation
  - **Diadic**: 60° contrast colors for modern designs
  - **Warm-Cool**: Warm and cool tone contrast
- **Smart Recommendations**: System analyzes your base color and suggests the best harmony mode with scoring
- **Harmony Score**: Real-time calculation of color harmony degree (0-100%)
- **Real-time Preview**: See your gradient backgrounds update instantly as you modify colors
- **Preset Templates**: Choose from professionally designed color combinations
- **API Integration**: Generate gradients programmatically via REST API
- **SVG Export**: Download your creations as high-quality SVG files
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Color Theory & Algorithms

### Color Harmony Modes

The application implements eight scientifically-proven color harmony formulas based on the color wheel:

| Mode | Description | Best For | Color Count |
|------|-------------|----------|-------------|
| **Complementary** | Two colors opposite each other (180° apart) | High contrast, visual impact | 2 |
| **Analogous** | Three adjacent colors (±30°) | Harmonious, natural feel | 3 |
| **Triadic** | Three evenly spaced colors (120°) | Balanced, vibrant designs | 3 |
| **Split Complementary** | Base + two adjacent to complement | Dynamic with less tension | 3 |
| **Tetradic** | Four colors in rectangular formation | Rich, complex palettes | 4 |
| **Monochromatic** | Single hue, varying lightness/saturation | Clean, minimalist designs | 3 |
| **Diadic** | 60° contrast colors | Modern, fashionable designs | 3 |
| **Warm-Cool** | Warm and cool tone contrast | Visual depth and layering | 3 |

### Smart Recommendation Algorithm

The system analyzes your selected color's characteristics and calculates harmony scores:

- **Color Characteristics Analysis**:
  - Dark colors (L < 30%): Recommends complementary for contrast
  - Light colors (L > 70%): Recommends triadic for balance
  - Muted colors (S < 30%): Recommends analogous for harmony
  - Vibrant colors (S > 60%, 30% < L < 70%): Recommends split complementary
  - Warm colors (0°-60°, 300°-360°): Recommends warm-cool contrast
  - Cool colors (120°-240°): Recommends warm-cool contrast

- **Harmony Score Calculation** (0-100%):
  - Contrast ratio (30%): WCAG-compliant contrast analysis
  - Saturation balance (20%): Variance in saturation levels
  - Lightness balance (20%): Variance in lightness levels
  - Hue distribution (30%): Ideal color wheel distribution

### Dual-Color Selection

The new color wheel supports simultaneous selection of two colors:

1. **Free Mode**:
   - Two independent color selectors on the same wheel
   - Drag either selector to adjust its color
   - Click on color cards to activate specific selector
   - Real-time harmony score display
   - Individual lightness controls for each color

2. **Recommendation Mode**:
   - Select a base color on the wheel
   - System generates top 4 color harmony recommendations
   - Each recommendation includes harmony score
   - One-click application of recommended palettes

## Getting Started

Read the documentation at https://opennext.js.org/cloudflare.

## Develop

Run the Next.js development server:

```bash
npm run dev
# or similar package manager command
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Testing

Run the color utility tests to verify the color harmony algorithms:

```bash
# Run tests (requires Jest to be installed)
npm test

# Or run the manual test in browser console
# Open DevTools and run: runColorTests()
```

### Test Coverage

The test suite validates:
- Color conversion functions (HEX ↔ RGB ↔ HSL)
- All eight color harmony algorithms
- Contrast ratio calculations (WCAG compliant)
- Color wheel position calculations
- Smart recommendation logic
- Harmony score calculation
- Dual-color gradient generation

## Preview

Preview the application locally on the Cloudflare runtime:

```bash
npm run preview
# or similar package manager command
```

## Deploy

Deploy the application to Cloudflare:

```bash
npm run deploy
# or similar package manager command
```

## Custom Domain

The deployed application is available at:

**gbg.nuclearrockstone.xyz**

Configure your DNS and Cloudflare settings accordingly (add the appropriate CNAME/A records and route the domain to your Cloudflare deployment).

## API Usage

Generate gradients programmatically using the REST API:

```
GET https://gbg.nuclearrockstone.xyz/api?colors=hex_FF0000&colors=hex_00FF00&width=800&height=600
```

### Parameters:
- `colors`: Hex colors with `hex_` prefix (e.g., `hex_FF0000` for red)
- `width`: Image width in pixels (100-2000)
- `height`: Image height in pixels (100-2000)

### Example with Multiple Colors:
```
GET /api?colors=hex_5135FF&colors=hex_FF5828&colors=hex_F69CFF&width=1200&height=800
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── route.ts          # API endpoint for SVG generation
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main application page
├── components/
│   ├── ui/                   # UI components (Button, Card, Input)
│   └── ColorWheel.tsx        # Interactive dual-color wheel component
├── hooks/
│   └── useGradientGenerator.tsx  # Gradient generation hook
├── lib/
│   ├── services/
│   │   └── gradientGenerator.ts  # SVG generation logic
│   ├── __tests__/
│   │   └── colorUtils.test.ts    # Color algorithm tests
│   ├── colorUtils.ts         # Color theory algorithms
│   ├── constants.ts          # Color presets
│   └── utils.ts              # Utility functions
```

## Color Utilities

The `colorUtils.ts` module provides comprehensive color manipulation functions:

```typescript
// Color conversion
hexToRgb('#FF0000')        // { r: 255, g: 0, b: 0 }
rgbToHsl({ r: 255, g: 0, b: 0 })  // { h: 0, s: 100, l: 50 }
hexToHsl('#FF0000')        // { h: 0, s: 100, l: 50 }

// Generate harmony colors
generateHarmonyColors('#FF0000', 'complementary')
// ['#ff0000', '#00ffff']

generateHarmonyColors('#FF0000', 'triadic')
// ['#ff0000', '#00ff00', '#0000ff']

// Smart recommendation
getSmartColorRecommendation('#FF0000')
// { mode: 'splitComplementary', colors: [...], name: '...', description: '...', score: 85 }

// Get multiple recommendations
getColorRecommendations('#FF0000', 3)
// [{ mode: '...', colors: [...], score: 85 }, ...]

// Calculate harmony score
calculateHarmonyScore(['#FF0000', '#00FFFF'])
// 85 (0-100 harmony score)

// Generate dual-color gradients
generateDualColorGradients('#FF0000', '#0000FF')
// [{ name: 'Classic Gradient', colors: [...], angle: 135, description: '...' }, ...]

// Contrast calculation (WCAG)
getContrastRatio('#000000', '#FFFFFF')  // 21
```

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + Custom components
- **Icons**: Lucide React
- **Deployment**: Cloudflare Workers (via OpenNext)
- **TypeScript**: Full type safety

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Client-side color calculations for instant feedback
- Optimized SVG generation
- Lazy loading of color wheel component
- Minimal dependencies

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## License

MIT License - feel free to use this project for personal or commercial purposes.
