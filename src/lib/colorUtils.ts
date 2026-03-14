/**
 * 色彩工具函数 - 提供颜色转换和色彩理论算法
 * 基于现代色彩科学和色彩心理学原理
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

export interface ColorHarmony {
  mode: HarmonyMode;
  colors: string[];
  name: string;
  description: string;
  score: number;
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
  | 'monochromatic'      // 单色
  | 'diadic'             // 对比色 (近似互补)
  | 'warmCool';          // 冷暖对比

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

    case 'diadic':
      // 对比色: 色相 +60° (近似互补，创造和谐对比)
      colors.push(
        hslToHex({
          h: (baseHsl.h + 60) % 360,
          s: Math.min(100, baseHsl.s + 10),
          l: Math.min(70, Math.max(30, baseHsl.l))
        }),
        hslToHex({
          h: (baseHsl.h + 180) % 360,
          s: baseHsl.s,
          l: baseHsl.l
        })
      );
      break;

    case 'warmCool':
      // 冷暖对比: 基于基础色是暖色还是冷色推荐对比
      const isWarm = baseHsl.h >= 0 && baseHsl.h <= 60 || baseHsl.h >= 300 && baseHsl.h <= 360;
      if (isWarm) {
        // 暖色基础，推荐冷色
        colors.push(
          hslToHex({
            h: 200 + Math.random() * 60, // 蓝绿色系
            s: Math.min(100, baseHsl.s + 20),
            l: baseHsl.l
          }),
          hslToHex({
            h: 240 + Math.random() * 40, // 蓝紫色系
            s: baseHsl.s,
            l: Math.min(70, baseHsl.l + 10)
          })
        );
      } else {
        // 冷色基础，推荐暖色
        colors.push(
          hslToHex({
            h: 10 + Math.random() * 40, // 橙红色系
            s: Math.min(100, baseHsl.s + 20),
            l: baseHsl.l
          }),
          hslToHex({
            h: 40 + Math.random() * 30, // 黄橙色系
            s: baseHsl.s,
            l: Math.min(70, baseHsl.l + 10)
          })
        );
      }
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
 * 计算色彩和谐度评分
 * 基于色彩理论的科学评估
 */
export function calculateHarmonyScore(colors: string[]): number {
  if (colors.length < 2) return 0;
  
  let score = 0;
  const hsls = colors.map(hexToHsl);
  
  // 1. 对比度评分 (30%)
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const contrast = getContrastRatio(colors[i], colors[j]);
      // 理想对比度在 3:1 到 7:1 之间
      if (contrast >= 3 && contrast <= 7) {
        score += 30 / (colors.length * (colors.length - 1) / 2);
      } else if (contrast > 7) {
        score += 20 / (colors.length * (colors.length - 1) / 2);
      } else {
        score += 10 / (colors.length * (colors.length - 1) / 2);
      }
    }
  }
  
  // 2. 饱和度平衡评分 (20%)
  const avgSaturation = hsls.reduce((sum, hsl) => sum + hsl.s, 0) / hsls.length;
  const saturationVariance = hsls.reduce((sum, hsl) => sum + Math.pow(hsl.s - avgSaturation, 2), 0) / hsls.length;
  score += Math.max(0, 20 - saturationVariance / 100);
  
  // 3. 亮度平衡评分 (20%)
  const avgLightness = hsls.reduce((sum, hsl) => sum + hsl.l, 0) / hsls.length;
  const lightnessVariance = hsls.reduce((sum, hsl) => sum + Math.pow(hsl.l - avgLightness, 2), 0) / hsls.length;
  score += Math.max(0, 20 - lightnessVariance / 100);
  
  // 4. 色相分布评分 (30%)
  if (colors.length >= 2) {
    const hues = hsls.map(h => h.h).sort((a, b) => a - b);
    const hueDiffs = [];
    for (let i = 0; i < hues.length; i++) {
      const nextIndex = (i + 1) % hues.length;
      let diff = Math.abs(hues[nextIndex] - hues[i]);
      if (diff > 180) diff = 360 - diff;
      hueDiffs.push(diff);
    }
    const avgHueDiff = hueDiffs.reduce((a, b) => a + b, 0) / hueDiffs.length;
    // 理想情况下色相均匀分布
    const idealDiff = 360 / colors.length;
    const hueScore = Math.max(0, 30 - Math.abs(avgHueDiff - idealDiff) / 3);
    score += hueScore;
  }
  
  return Math.min(100, Math.round(score));
}

/**
 * 智能推荐最佳配色方案
 * 基于色彩理论、色彩心理学和对比度分析
 */
export function getSmartColorRecommendation(baseColor: string): ColorHarmony {
  const hsl = hexToHsl(baseColor);
  
  // 分析颜色的特性
  const isVibrant = hsl.s > 60 && hsl.l > 30 && hsl.l < 70;
  const isDark = hsl.l < 30;
  const isLight = hsl.l > 70;
  const isMuted = hsl.s < 30;
  const isWarm = (hsl.h >= 0 && hsl.h <= 60) || (hsl.h >= 300 && hsl.h <= 360);
  const isCool = hsl.h >= 120 && hsl.h <= 240;
  
  // 生成所有可能的配色方案并评分
  const modes: HarmonyMode[] = ['complementary', 'analogous', 'triadic', 'splitComplementary', 'tetradic', 'monochromatic', 'diadic', 'warmCool'];
  const candidates: ColorHarmony[] = [];
  
  for (const mode of modes) {
    const colors = generateHarmonyColors(baseColor, mode);
    const score = calculateHarmonyScore(colors);
    
    let name: string;
    let description: string;
    
    switch (mode) {
      case 'complementary':
        name = '强烈对比';
        description = '互补色配色方案，创造强烈的视觉冲击力和活力';
        break;
      case 'analogous':
        name = '和谐统一';
        description = '类似色配色方案，色彩过渡自然，适合优雅的设计风格';
        break;
      case 'triadic':
        name = '活力平衡';
        description = '三角色配色方案，色彩丰富且保持视觉平衡';
        break;
      case 'splitComplementary':
        name = '动态张力';
        description = '分裂互补色方案，既有对比又不过于强烈';
        break;
      case 'tetradic':
        name = '丰富多彩';
        description = '四角色配色方案，适合复杂、丰富的设计需求';
        break;
      case 'monochromatic':
        name = '简约专业';
        description = '单色配色方案，层次丰富，适合专业、极简风格';
        break;
      case 'diadic':
        name = '现代对比';
        description = '对比色方案，现代感强，适合时尚设计';
        break;
      case 'warmCool':
        name = '冷暖对比';
        description = '冷暖色调对比，创造视觉深度和层次感';
        break;
      default:
        name = '智能推荐';
        description = '基于色彩理论的最佳配色方案';
    }
    
    candidates.push({ mode, colors, name, description, score });
  }
  
  // 根据基础色特性调整评分
  candidates.forEach(candidate => {
    if (isMuted && candidate.mode === 'analogous') candidate.score += 15;
    if (isDark && candidate.mode === 'complementary') candidate.score += 10;
    if (isLight && candidate.mode === 'triadic') candidate.score += 10;
    if (isVibrant && candidate.mode === 'splitComplementary') candidate.score += 15;
    if ((isWarm || isCool) && candidate.mode === 'warmCool') candidate.score += 20;
  });
  
  // 返回评分最高的方案
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0];
}

/**
 * 获取多个配色推荐
 */
export function getColorRecommendations(baseColor: string, count: number = 3): ColorHarmony[] {
  const hsl = hexToHsl(baseColor);
  const modes: HarmonyMode[] = ['complementary', 'analogous', 'triadic', 'splitComplementary', 'tetradic', 'monochromatic', 'diadic', 'warmCool'];
  const candidates: ColorHarmony[] = [];
  
  for (const mode of modes) {
    const colors = generateHarmonyColors(baseColor, mode);
    const score = calculateHarmonyScore(colors);
    
    const modeInfo = getHarmonyModes().find(m => m.mode === mode)!;
    candidates.push({
      mode,
      colors,
      name: modeInfo.name,
      description: modeInfo.description,
      score
    });
  }
  
  // 排序并返回前N个
  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, count);
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
    },
    {
      mode: 'diadic',
      name: '对比色',
      description: '60°夹角的对比配色，现代感强',
      colorCount: 3
    },
    {
      mode: 'warmCool',
      name: '冷暖对比',
      description: '冷暖色调的对比搭配',
      colorCount: 3
    }
  ];
}

/**
 * 生成双色调渐变推荐
 * 基于两个基础色的最佳渐变方案
 */
export function generateDualColorGradients(color1: string, color2: string): Array<{
  name: string;
  colors: string[];
  angle: number;
  description: string;
}> {
  const hsl1 = hexToHsl(color1);
  const hsl2 = hexToHsl(color2);
  
  // 计算两色之间的角度差
  let hueDiff = Math.abs(hsl1.h - hsl2.h);
  if (hueDiff > 180) hueDiff = 360 - hueDiff;
  
  const gradients: Array<{
    name: string;
    colors: string[];
    angle: number;
    description: string;
  }> = [];
  
  // 1. 直接渐变
  gradients.push({
    name: '经典渐变',
    colors: [color1, color2],
    angle: 135,
    description: '两个颜色直接渐变，简洁有力'
  });
  
  // 2. 添加中间过渡色
  const midHsl = {
    h: (hsl1.h + (hsl2.h > hsl1.h ? (hsl2.h - hsl1.h) / 2 : (hsl2.h + 360 - hsl1.h) / 2)) % 360,
    s: (hsl1.s + hsl2.s) / 2,
    l: (hsl1.l + hsl2.l) / 2
  };
  gradients.push({
    name: '柔和过渡',
    colors: [color1, hslToHex(midHsl), color2],
    angle: 135,
    description: '添加中间色，过渡更加柔和自然'
  });
  
  // 3. 基于色彩理论的扩展
  if (hueDiff < 60) {
    // 类似色，添加一个对比色
    const contrastHsl = { ...hsl1, h: (hsl1.h + 180) % 360 };
    gradients.push({
      name: '对比增强',
      colors: [color1, color2, hslToHex(contrastHsl)],
      angle: 120,
      description: '在类似色基础上添加对比色，增加视觉冲击力'
    });
  } else if (hueDiff > 120) {
    // 对比色，添加中间调和色
    gradients.push({
      name: '和谐过渡',
      colors: [color1, hslToHex(midHsl), color2],
      angle: 150,
      description: '通过中间色调和强烈对比'
    });
  }
  
  return gradients;
}
