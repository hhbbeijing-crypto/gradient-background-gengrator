/**
 * 色彩工具函数 - 提供颜色转换和色彩理论算法
 */

export interface HSL {
  h: number; // 色相: 0-360
  s: number; // 饱和度: 0-100
  l: number; // 亮度: 0-100
}

export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

/**
 * 将 HEX 颜色转换为 RGB
 */
export function hexToRgb(hex: string): RGB {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

/**
 * 将 RGB 颜色转换为 HEX
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * 将 RGB 转换为 HSL
 */
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * 将 HSL 转换为 RGB
 */
export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * 将 HEX 转换为 HSL
 */
export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex));
}

/**
 * 将 HSL 转换为 HEX
 */
export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

/**
 * 色彩和谐模式
 */
export type HarmonyMode = 
  | 'complementary'      // 互补色
  | 'analogous'          // 类似色
  | 'triadic'            // 三角色
  | 'splitComplementary' // 分裂互补色
  | 'tetradic'           // 方形色/四角色
  | 'monochromatic';     // 单色

/**
 * 根据基础色和和谐模式生成配色方案
 */
export function generateHarmonyColors(baseColor: string, mode: HarmonyMode): string[] {
  const baseHsl = hexToHsl(baseColor);
  const colors: string[] = [baseColor];

  switch (mode) {
    case 'complementary':
      // 互补色: 色相 + 180°
      colors.push(hslToHex({
        h: (baseHsl.h + 180) % 360,
        s: baseHsl.s,
        l: baseHsl.l
      }));
      break;

    case 'analogous':
      // 类似色: 色相 -30° 和 +30°
      colors.push(
        hslToHex({
          h: (baseHsl.h - 30 + 360) % 360,
          s: baseHsl.s,
          l: baseHsl.l
        }),
        hslToHex({
          h: (baseHsl.h + 30) % 360,
          s: baseHsl.s,
          l: baseHsl.l
        })
      );
      break;

    case 'triadic':
      // 三角色: 色相 +120° 和 +240°
      colors.push(
        hslToHex({
          h: (baseHsl.h + 120) % 360,
          s: baseHsl.s,
          l: baseHsl.l
        }),
        hslToHex({
          h: (baseHsl.h + 240) % 360,
          s: baseHsl.s,
          l: baseHsl.l
        })
      );
      break;

    case 'splitComplementary':
      // 分裂互补色: 色相 +150° 和 +210°
      colors.push(
        hslToHex({
          h: (baseHsl.h + 150) % 360,
          s: baseHsl.s,
          l: baseHsl.l
        }),
        hslToHex({
          h: (baseHsl.h + 210) % 360,
          s: baseHsl.s,
          l: baseHsl.l
        })
      );
      break;

    case 'tetradic':
      // 方形色: 色相 +90°, +180°, +270°
      colors.push(
        hslToHex({
          h: (baseHsl.h + 90) % 360,
          s: baseHsl.s,
          l: baseHsl.l
        }),
        hslToHex({
          h: (baseHsl.h + 180) % 360,
          s: baseHsl.s,
          l: baseHsl.l
        }),
        hslToHex({
          h: (baseHsl.h + 270) % 360,
          s: baseHsl.s,
          l: baseHsl.l
        })
      );
      break;

    case 'monochromatic':
      // 单色: 改变亮度和饱和度
      colors.push(
        hslToHex({
          h: baseHsl.h,
          s: Math.max(20, baseHsl.s - 30),
          l: Math.min(90, baseHsl.l + 30)
        }),
        hslToHex({
          h: baseHsl.h,
          s: Math.min(100, baseHsl.s + 20),
          l: Math.max(20, baseHsl.l - 20)
        })
      );
      break;
  }

  return colors;
}

/**
 * 计算两个颜色之间的对比度 (WCAG标准)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const luminance1 = getRelativeLuminance(rgb1);
  const luminance2 = getRelativeLuminance(rgb2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * 计算相对亮度
 */
function getRelativeLuminance(rgb: RGB): number {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * 根据背景色获取推荐的前景文字颜色（黑或白）
 */
export function getContrastText(backgroundColor: string): '#000000' | '#FFFFFF' {
  const rgb = hexToRgb(backgroundColor);
  const luminance = getRelativeLuminance(rgb);
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * 获取色轮上的位置坐标
 * @param hue 色相 (0-360)
 * @param saturation 饱和度 (0-100)
 * @param radius 色轮半径
 * @returns 相对于色轮中心的坐标 {x, y}
 */
export function getColorWheelPosition(
  hue: number, 
  saturation: number, 
  radius: number
): { x: number; y: number } {
  const angle = (hue - 90) * (Math.PI / 180); // 从12点钟方向开始
  const distance = (saturation / 100) * radius;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance
  };
}

/**
 * 从色轮坐标获取色相和饱和度
 * @param x 相对于中心的x坐标
 * @param y 相对于中心的y坐标
 * @param radius 色轮半径
 * @returns HSL中的h和s值
 */
export function getHslFromWheelPosition(
  x: number, 
  y: number, 
  radius: number
): { h: number; s: number } {
  const distance = Math.min(Math.sqrt(x * x + y * y), radius);
  const saturation = (distance / radius) * 100;
  
  let angle = Math.atan2(y, x) * (180 / Math.PI);
  angle = (angle + 90 + 360) % 360; // 转换为0-360，从12点钟方向开始
  
  return { h: Math.round(angle), s: Math.round(saturation) };
}

/**
 * 生成色轮的CSS渐变背景
 */
export function generateColorWheelGradient(): string {
  return `conic-gradient(
    from 0deg,
    hsl(0, 100%, 50%),
    hsl(60, 100%, 50%),
    hsl(120, 100%, 50%),
    hsl(180, 100%, 50%),
    hsl(240, 100%, 50%),
    hsl(300, 100%, 50%),
    hsl(360, 100%, 50%)
  )`;
}

/**
 * 智能推荐最佳配色方案
 * 基于色彩理论和对比度分析
 */
export function getSmartColorRecommendation(baseColor: string): {
  mode: HarmonyMode;
  colors: string[];
  name: string;
  description: string;
} {
  const hsl = hexToHsl(baseColor);
  
  // 根据基础色的特性选择最佳和谐模式
  let recommendedMode: HarmonyMode;
  let name: string;
  let description: string;

  // 分析颜色的饱和度和亮度
  const isVibrant = hsl.s > 50 && hsl.l > 30 && hsl.l < 70;
  const isDark = hsl.l < 30;
  const isLight = hsl.l > 70;
  const isMuted = hsl.s < 30;

  if (isMuted) {
    // 低饱和度颜色适合使用类似色或单色方案
    recommendedMode = 'analogous';
    name = '柔和协调';
    description = '基于类似色的柔和配色，适合优雅、专业的视觉风格';
  } else if (isDark) {
    // 深色适合使用互补色增加对比
    recommendedMode = 'complementary';
    name = '强烈对比';
    description = '互补色配色方案，创造强烈的视觉冲击力';
  } else if (isLight) {
    // 浅色适合使用三角色或分裂互补色
    recommendedMode = 'triadic';
    name = '活力平衡';
    description = '三角色配色方案，色彩丰富且保持平衡';
  } else if (isVibrant) {
    // 鲜艳的颜色适合使用分裂互补色
    recommendedMode = 'splitComplementary';
    name = '动态张力';
    description = '分裂互补色方案，既有对比又不过于强烈';
  } else {
    // 默认使用类似色
    recommendedMode = 'analogous';
    name = '和谐统一';
    description = '类似色配色方案，创造和谐统一的视觉效果';
  }

  return {
    mode: recommendedMode,
    colors: generateHarmonyColors(baseColor, recommendedMode),
    name,
    description
  };
}

/**
 * 获取所有可用的和谐模式及其描述
 */
export function getHarmonyModes(): Array<{
  mode: HarmonyMode;
  name: string;
  description: string;
  colorCount: number;
}> {
  return [
    {
      mode: 'complementary',
      name: '互补色',
      description: '色轮上相对的颜色，创造强烈对比',
      colorCount: 2
    },
    {
      mode: 'analogous',
      name: '类似色',
      description: '色轮上相邻的颜色，和谐统一',
      colorCount: 3
    },
    {
      mode: 'triadic',
      name: '三角色',
      description: '色轮上等距的三种颜色，平衡丰富',
      colorCount: 3
    },
    {
      mode: 'splitComplementary',
      name: '分裂互补色',
      description: '一种颜色与其互补色两侧的颜色',
      colorCount: 3
    },
    {
      mode: 'tetradic',
      name: '方形色',
      description: '色轮上形成矩形的四种颜色',
      colorCount: 4
    },
    {
      mode: 'monochromatic',
      name: '单色',
      description: '同一色相的不同明度和饱和度',
      colorCount: 3
    }
  ];
}
