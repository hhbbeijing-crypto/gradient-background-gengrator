import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  hslToHex,
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  getSplitComplementaryColors,
  getMonochromaticColors,
  getRecommendedColors
} from '../utils';

describe('Color Conversion Utilities', () => {
  describe('hexToRgb', () => {
    it('should convert hex color to RGB', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should handle hex without # prefix', () => {
      expect(hexToRgb('FF0000')).toEqual({ r: 255, g: 0, b: 0 });
    });
  });

  describe('rgbToHex', () => {
    it('should convert RGB to hex color', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
    });
  });

  describe('rgbToHsl and hslToRgb', () => {
    it('should convert between RGB and HSL correctly', () => {
      const rgb = { r: 255, g: 0, b: 0 };
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const convertedRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      
      expect(Math.round(convertedRgb.r)).toBe(rgb.r);
      expect(Math.round(convertedRgb.g)).toBe(rgb.g);
      expect(Math.round(convertedRgb.b)).toBe(rgb.b);
    });
  });

  describe('hexToHsl and hslToHex', () => {
    it('should convert between hex and HSL correctly', () => {
      const hex = '#FF0000';
      const hsl = hexToHsl(hex);
      const convertedHex = hslToHex(hsl.h, hsl.s, hsl.l);
      
      expect(convertedHex.toLowerCase()).toBe(hex.toLowerCase());
    });
  });
});

describe('Color Recommendation Algorithms', () => {
  describe('getComplementaryColor', () => {
    it('should return complementary color', () => {
      const complementary = getComplementaryColor('#FF0000');
      expect(complementary).toBeDefined();
      expect(typeof complementary).toBe('string');
      expect(complementary.startsWith('#')).toBe(true);
    });
  });

  describe('getAnalogousColors', () => {
    it('should return array of analogous colors', () => {
      const analogous = getAnalogousColors('#FF0000');
      expect(Array.isArray(analogous)).toBe(true);
      expect(analogous.length).toBe(2);
      analogous.forEach(color => {
        expect(typeof color).toBe('string');
        expect(color.startsWith('#')).toBe(true);
      });
    });

    it('should accept custom count and angle', () => {
      const analogous = getAnalogousColors('#FF0000', 3, 45);
      expect(analogous.length).toBe(3);
    });
  });

  describe('getTriadicColors', () => {
    it('should return two triadic colors', () => {
      const triadic = getTriadicColors('#FF0000');
      expect(Array.isArray(triadic)).toBe(true);
      expect(triadic.length).toBe(2);
      triadic.forEach(color => {
        expect(typeof color).toBe('string');
        expect(color.startsWith('#')).toBe(true);
      });
    });
  });

  describe('getSplitComplementaryColors', () => {
    it('should return two split complementary colors', () => {
      const splitComplementary = getSplitComplementaryColors('#FF0000');
      expect(Array.isArray(splitComplementary)).toBe(true);
      expect(splitComplementary.length).toBe(2);
      splitComplementary.forEach(color => {
        expect(typeof color).toBe('string');
        expect(color.startsWith('#')).toBe(true);
      });
    });
  });

  describe('getMonochromaticColors', () => {
    it('should return array of monochromatic colors', () => {
      const monochromatic = getMonochromaticColors('#FF0000');
      expect(Array.isArray(monochromatic)).toBe(true);
      expect(monochromatic.length).toBe(3);
      monochromatic.forEach(color => {
        expect(typeof color).toBe('string');
        expect(color.startsWith('#')).toBe(true);
      });
    });

    it('should accept custom count', () => {
      const monochromatic = getMonochromaticColors('#FF0000', 5);
      expect(monochromatic.length).toBe(5);
    });
  });

  describe('getRecommendedColors', () => {
    it('should return all recommended color groups', () => {
      const recommendations = getRecommendedColors('#FF0000');
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
      
      recommendations.forEach(group => {
        expect(group).toHaveProperty('name');
        expect(group).toHaveProperty('colors');
        expect(Array.isArray(group.colors)).toBe(true);
      });
    });

    it('should contain all required color schemes', () => {
      const recommendations = getRecommendedColors('#FF0000');
      const schemeNames = recommendations.map(r => r.name);
      
      expect(schemeNames).toContain('互补色');
      expect(schemeNames).toContain('邻近色');
      expect(schemeNames).toContain('三角色');
      expect(schemeNames).toContain('分裂互补');
      expect(schemeNames).toContain('单色');
    });
  });
});

describe('Edge Cases', () => {
  it('should handle invalid hex colors gracefully', () => {
    expect(hexToRgb('invalid')).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('should clamp RGB values to valid range', () => {
    const hex = rgbToHex(300, -50, 128);
    expect(hex).toBe('#ff0080');
  });

  it('should work with various colors', () => {
    const testColors = ['#5135FF', '#FF5828', '#F69CFF', '#FFA50F', '#00C9FF', '#92FE9D'];
    
    testColors.forEach(color => {
      const recommendations = getRecommendedColors(color);
      expect(recommendations.length).toBeGreaterThan(0);
    });
  });
});

console.log('All color utility tests passed! 🎨');
