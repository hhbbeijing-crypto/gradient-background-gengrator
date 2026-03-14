# Gradient Background Generator

A powerful Next.js application for creating stunning SVG gradient backgrounds with real-time preview, interactive color wheel, and AI-powered color recommendations.

## Features

- **Interactive Color Wheel**: Visual color selection with drag-and-drop interface
- **Dual Selection Modes**:
  - **Free Selection Mode**: Manually pick colors on the color wheel
  - **Recommendation Mode**: AI-powered color harmony suggestions
- **Color Harmony Algorithms**:
  - **Complementary**: Colors opposite on the color wheel (180° apart)
  - **Analogous**: Adjacent colors for harmonious blends (±30°)
  - **Triadic**: Three evenly spaced colors (120° apart)
  - **Split Complementary**: Base color plus adjacent to its complement
  - **Tetradic**: Four colors forming a rectangle on the wheel
  - **Monochromatic**: Single hue with varying lightness/saturation
- **Smart Recommendations**: System analyzes your base color and suggests the best harmony mode
- **Real-time Preview**: See your gradient backgrounds update instantly as you modify colors
- **Preset Templates**: Choose from professionally designed color combinations
- **API Integration**: Generate gradients programmatically via REST API
- **SVG Export**: Download your creations as high-quality SVG files
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Color Theory & Algorithms

### Color Harmony Modes

The application implements six scientifically-proven color harmony formulas based on the color wheel:

| Mode | Description | Best For |
|------|-------------|----------|
| **Complementary** | Two colors opposite each other (180° apart) | High contrast, visual impact |
| **Analogous** | Three adjacent colors (±30°) | Harmonious, natural feel |
| **Triadic** | Three evenly spaced colors (120°) | Balanced, vibrant designs |
| **Split Complementary** | Base + two adjacent to complement | Dynamic with less tension |
| **Tetradic** | Four colors in rectangular formation | Rich, complex palettes |
| **Monochromatic** | Single hue, varying lightness/saturation | Clean, minimalist designs |

### Smart Recommendation Algorithm

The system analyzes your selected color's characteristics:
- **Dark colors** (L < 30%): Recommends complementary for contrast
- **Light colors** (L > 70%): Recommends triadic for balance
- **Muted colors** (S < 30%): Recommends analogous for harmony
- **Vibrant colors**: Recommends split complementary for dynamic results

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
- All six color harmony algorithms
- Contrast ratio calculations (WCAG compliant)
- Color wheel position calculations
- Smart recommendation logic

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
│   └── ColorWheel.tsx        # Interactive color wheel component
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
// { mode: 'splitComplementary', colors: [...], name: '...', description: '...' }

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
