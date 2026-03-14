/**
 * 色彩工具函数测试
 * 运行测试: npm test
 */

import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  hslToHex,
  generateHarmonyColors,
  getSmartColorRecommendation,
  getContrastRatio,
  getHslFromWheelPosition,
  getColorWheelPosition,
  type HarmonyMode
} from '../colorUtils';

describe('Color Utils', () => {
  describe('Basic Conversions', () => {
    test('hexToRgb converts hex to RGB correctly', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    test('rgbToHex converts RGB to hex correctly', () => {
      expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
      expect(rgbToHex({ r: 0, g: 255, b: 0 })).toBe('#00ff00');
      expect(rgbToHex({ r: 0, g: 0, b: 255 })).toBe('#0000ff');
      expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
      expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
    });

    test('rgbToHsl converts RGB to HSL correctly', () => {
      const red = rgbToHsl({ r: 255, g: 0, b: 0 });
      expect(red.h).toBe(0);
      expect(red.s).toBe(100);
      expect(red.l).toBe(50);

      const green = rgbToHsl({ r: 0, g: 255, b: 0 });
      expect(green.h).toBe(120);
      expect(green.s).toBe(100);
      expect(green.l).toBe(50);

      const blue = rgbToHsl({ r: 0, g: 0, b: 255 });
      expect(blue.h).toBe(240);
      expect(blue.s).toBe(100);
      expect(blue.l).toBe(50);
    });

    test('hslToRgb converts HSL to RGB correctly', () => {
      expect(hslToRgb({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0 });
      expect(hslToRgb({ h: 120, s: 100, l: 50 })).toEqual({ r: 0, g: 255, b: 0 });
      expect(hslToRgb({ h: 240, s: 100, l: 50 })).toEqual({ r: 0, g: 0, b: 255 });
    });

    test('hexToHsl and hslToHex are inverse operations', () => {
      const testColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
      testColors.forEach(color => {
        const hsl = hexToHsl(color);
        const backToHex = hslToHex(hsl);
        expect(backToHex.toLowerCase()).toBe(color.toLowerCase());
      });
    });
  });

  describe('Harmony Colors', () => {
    test('complementary colors are 180 degrees apart', () => {
      const colors = generateHarmonyColors('#FF0000', 'complementary');
      expect(colors).toHaveLength(2);
      
      const baseHsl = hexToHsl(colors[0]);
      const compHsl = hexToHsl(colors[1]);
      const hueDiff = Math.abs(baseHsl.h - compHsl.h);
      expect(hueDiff).toBe(180);
    });

    test('analogous colors are 30 degrees apart', () => {
      const colors = generateHarmonyColors('#FF0000', 'analogous');
      expect(colors).toHaveLength(3);
      
      const hsls = colors.map(hexToHsl);
      const diff1 = Math.abs(hsls[0].h - hsls[1].h);
      const diff2 = Math.abs(hsls[2].h - hsls[0].h);
      expect(diff1).toBe(30);
      expect(diff2).toBe(30);
    });

    test('triadic colors are 120 degrees apart', () => {
      const colors = generateHarmonyColors('#FF0000', 'triadic');
      expect(colors).toHaveLength(3);
      
      const hsls = colors.map(hexToHsl);
      const diff1 = Math.abs(hsls[1].h - hsls[0].h);
      const diff2 = Math.abs(hsls[2].h - hsls[0].h);
      expect(diff1).toBe(120);
      expect(diff2).toBe(240);
    });

    test('tetradic colors form a rectangle on color wheel', () => {
      const colors = generateHarmonyColors('#FF0000', 'tetradic');
      expect(colors).toHaveLength(4);
      
      const hsls = colors.map(hexToHsl);
      expect(Math.abs(hsls[1].h - hsls[0].h)).toBe(90);
      expect(Math.abs(hsls[2].h - hsls[0].h)).toBe(180);
      expect(Math.abs(hsls[3].h - hsls[0].h)).toBe(270);
    });

    test('monochromatic colors have same hue', () => {
      const colors = generateHarmonyColors('#FF0000', 'monochromatic');
      expect(colors).toHaveLength(3);
      
      const hsls = colors.map(hexToHsl);
      const baseHue = hsls[0].h;
      hsls.forEach(hsl => {
        expect(hsl.h).toBe(baseHue);
      });
    });

    test('split complementary colors are at 150 and 210 degrees', () => {
      const colors = generateHarmonyColors('#FF0000', 'splitComplementary');
      expect(colors).toHaveLength(3);
      
      const hsls = colors.map(hexToHsl);
      expect(Math.abs(hsls[1].h - hsls[0].h)).toBe(150);
      expect(Math.abs(hsls[2].h - hsls[0].h)).toBe(210);
    });
  });

  describe('Smart Recommendation', () => {
    test('returns valid recommendation structure', () => {
      const rec = getSmartColorRecommendation('#FF0000');
      expect(rec).toHaveProperty('mode');
      expect(rec).toHaveProperty('colors');
      expect(rec).toHaveProperty('name');
      expect(rec).toHaveProperty('description');
      expect(rec.colors.length).toBeGreaterThan(0);
    });

    test('recommends different modes based on color characteristics', () => {
      const darkColor = getSmartColorRecommendation('#330000');
      const lightColor = getSmartColorRecommendation('#FFCCCC');
      const mutedColor = getSmartColorRecommendation('#808080');
      const vibrantColor = getSmartColorRecommendation('#FF0080');

      // 深色通常推荐互补色
      expect(['complementary', 'analogous']).toContain(darkColor.mode);
      // 浅色通常推荐三角色
      expect(['triadic', 'analogous']).toContain(lightColor.mode);
      // 低饱和度通常推荐类似色
      expect(['analogous', 'monochromatic']).toContain(mutedColor.mode);
      // 鲜艳颜色通常推荐分裂互补色
      expect(['splitComplementary', 'analogous', 'triadic']).toContain(vibrantColor.mode);
    });
  });

  describe('Contrast Ratio', () => {
    test('calculates contrast ratio correctly', () => {
      // 黑色和白色应该有最高对比度
      const blackWhiteContrast = getContrastRatio('#000000', '#FFFFFF');
      expect(blackWhiteContrast).toBeCloseTo(21, 0);

      // 相同颜色对比度为1
      const sameColorContrast = getContrastRatio('#FF0000', '#FF0000');
      expect(sameColorContrast).toBe(1);

      // 红色和绿色应该有中等对比度
      const redGreenContrast = getContrastRatio('#FF0000', '#00FF00');
      expect(redGreenContrast).toBeGreaterThan(1);
      expect(redGreenContrast).toBeLessThan(21);
    });
  });

  describe('Color Wheel Position', () => {
    test('getColorWheelPosition calculates correct position', () => {
      // 红色 (0度) 应该在顶部偏右
      const red = getColorWheelPosition(0, 100, 100);
      expect(red.x).toBeCloseTo(0, 0);
      expect(red.y).toBeCloseTo(-100, 0);

      // 绿色 (120度)
      const green = getColorWheelPosition(120, 100, 100);
      expect(green.x).toBeGreaterThan(0);
      expect(green.y).toBeGreaterThan(0);

      // 蓝色 (240度)
      const blue = getColorWheelPosition(240, 100, 100);
      expect(blue.x).toBeLessThan(0);
      expect(blue.y).toBeGreaterThan(0);
    });

    test('getHslFromWheelPosition and getColorWheelPosition are inverse', () => {
      const testCases = [
        { h: 0, s: 100 },
        { h: 120, s: 100 },
        { h: 240, s: 100 },
        { h: 60, s: 50 },
        { h: 180, s: 75 }
      ];

      testCases.forEach(({ h, s }) => {
        const pos = getColorWheelPosition(h, s, 100);
        const hsl = getHslFromWheelPosition(pos.x, pos.y, 100);
        expect(hsl.h).toBeCloseTo(h, -1);
        expect(hsl.s).toBeCloseTo(s, -1);
      });
    });
  });
});

// 手动测试运行器（用于非Jest环境）
export function runManualTests() {
  console.log('Running manual color utils tests...\n');

  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void) {
    try {
      fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (error) {
      console.log(`✗ ${name}`);
      console.error(`  Error: ${error}`);
      failed++;
    }
  }

  function expect(actual: unknown) {
    return {
      toEqual(expected: unknown) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
      },
      toBe(expected: unknown) {
        if (actual !== expected) {
          throw new Error(`Expected ${expected}, got ${actual}`);
        }
      },
      toBeCloseTo(expected: number, precision: number) {
        const multiplier = Math.pow(10, -precision);
        if (Math.abs(Number(actual) - expected) > multiplier) {
          throw new Error(`Expected ${actual} to be close to ${expected}`);
        }
      },
      toHaveLength(expected: number) {
        if ((actual as Array<unknown>).length !== expected) {
          throw new Error(`Expected length ${expected}, got ${(actual as Array<unknown>).length}`);
        }
      },
      toHaveProperty(key: string) {
        if (!(actual as Record<string, unknown>)[key]) {
          throw new Error(`Expected object to have property ${key}`);
        }
      },
      toBeGreaterThan(expected: number) {
        if (Number(actual) <= expected) {
          throw new Error(`Expected ${actual} to be greater than ${expected}`);
        }
      },
      toBeLessThan(expected: number) {
        if (Number(actual) >= expected) {
          throw new Error(`Expected ${actual} to be less than ${expected}`);
        }
      },
      toContain(item: unknown) {
        if (!(actual as Array<unknown>).includes(item)) {
          throw new Error(`Expected array to contain ${item}`);
        }
      }
    };
  }

  // 基本转换测试
  test('hexToRgb converts red correctly', () => {
    expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
  });

  test('rgbToHex converts red correctly', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
  });

  test('hexToHsl converts red correctly', () => {
    const hsl = hexToHsl('#FF0000');
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });

  // 和谐色测试
  test('complementary generates 2 colors', () => {
    const colors = generateHarmonyColors('#FF0000', 'complementary');
    expect(colors).toHaveLength(2);
  });

  test('analogous generates 3 colors', () => {
    const colors = generateHarmonyColors('#FF0000', 'analogous');
    expect(colors).toHaveLength(3);
  });

  test('triadic generates 3 colors', () => {
    const colors = generateHarmonyColors('#FF0000', 'triadic');
    expect(colors).toHaveLength(3);
  });

  test('tetradic generates 4 colors', () => {
    const colors = generateHarmonyColors('#FF0000', 'tetradic');
    expect(colors).toHaveLength(4);
  });

  // 对比度测试
  test('black and white have high contrast', () => {
    const contrast = getContrastRatio('#000000', '#FFFFFF');
    expect(contrast).toBeGreaterThan(20);
  });

  // 智能推荐测试
  test('smart recommendation returns valid structure', () => {
    const rec = getSmartColorRecommendation('#FF0000');
    expect(rec).toHaveProperty('mode');
    expect(rec).toHaveProperty('colors');
    expect(rec).toHaveProperty('name');
    expect(rec).toHaveProperty('description');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  return { passed, failed };
}

// 如果直接运行此文件，执行测试
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).runColorTests = runManualTests;
}
