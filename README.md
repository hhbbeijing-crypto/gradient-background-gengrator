# Gradient Background Generator

A powerful Next.js application for creating stunning SVG gradient backgrounds with real-time preview and customizable color palettes.

## Features

- **Real-time Preview**: See your gradient backgrounds update instantly as you modify colors
- **Custom Color Palettes**: Add up to 8 colors to create unique gradients
- **Preset Templates**: Choose from professionally designed color combinations
- **API Integration**: Generate gradients programmatically via REST API
- **SVG Export**: Download your creations as high-quality SVG files
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Color Wheel Picker**: Interactive color wheel for intuitive color selection
- **Dual Selection Modes**:
  - **Free Mode**: Manually select any colors from the color wheel
  - **Recommended Mode**: Smart color recommendations based on color theory
- **Color Theory Algorithms**: Includes complementary, analogous, triadic, split-complementary, and monochromatic color schemes

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

## Color Selection Modes

### Free Selection Mode
- Interactive color wheel for visual color selection
- Click and drag to select colors directly from the wheel
- Add up to 8 colors to your gradient palette
- Fine-tune colors with hex code input

### Recommended Selection Mode
- Select a primary color and get smart recommendations
- Color theory-based suggestions including:
  - **Complementary Colors**: Opposite on the color wheel for high contrast
  - **Analogous Colors**: Adjacent colors for harmonious combinations
  - **Triadic Colors**: Three colors equally spaced for vibrant palettes
  - **Split-Complementary**: Variation of complementary with softer contrast
  - **Monochromatic**: Shades and tints of the same hue

## Testing

### Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Color Utility Tests
Test the color conversion and recommendation algorithms by running the test file. You can use Node.js to execute it directly:

```bash
# Create a simple test runner if needed, or integrate with your test framework
npx tsx src/lib/__tests__/colorUtils.test.ts
```

## Color Algorithms

The color recommendation system uses standard color theory:

1. **RGB-HSL Conversion**: Colors are converted between RGB and HSL color spaces for easier manipulation
2. **Complementary**: Hue shifted by 180°
3. **Analogous**: Hues shifted by ±30°
4. **Triadic**: Hues shifted by ±120°
5. **Split-Complementary**: Hues shifted by ±150°
6. **Monochromatic**: Same hue, varying lightness

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
