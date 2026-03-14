'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  hexToHsl,
  hslToHex,
  getHslFromWheelPosition,
  getColorWheelPosition,
  generateHarmonyColors,
  getSmartColorRecommendation,
  getHarmonyModes,
  type HarmonyMode
} from '@/lib/colorUtils';

interface ColorWheelProps {
  colors: string[];
  onColorsChange: (colors: string[]) => void;
  maxColors?: number;
  className?: string;
}

type SelectionMode = 'free' | 'recommend';

export function ColorWheel({
  colors,
  onColorsChange,
  maxColors = 8,
  className
}: ColorWheelProps) {
  const [mode, setMode] = useState<SelectionMode>('free');
  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>('analogous');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    mode: HarmonyMode;
    colors: string[];
    name: string;
    description: string;
  } | null>(null);
  
  const wheelRef = useRef<HTMLDivElement>(null);
  const wheelRadius = 120;

  // 获取当前选中颜色的HSL值
  const currentHsl = hexToHsl(colors[selectedIndex] || '#FF0000');

  // 计算选择器在色轮上的位置
  const selectorPosition = getColorWheelPosition(
    currentHsl.h,
    currentHsl.s,
    wheelRadius
  );

  // 处理色轮点击/拖动
  const handleWheelInteraction = useCallback(
    (clientX: number, clientY: number) => {
      if (!wheelRef.current) return;

      const rect = wheelRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = clientX - centerX;
      const y = clientY - centerY;

      const { h, s } = getHslFromWheelPosition(x, y, wheelRadius);
      const newColor = hslToHex({ h, s, l: currentHsl.l });

      if (mode === 'free') {
        // 自由选择模式：只更新当前选中的颜色
        const newColors = [...colors];
        newColors[selectedIndex] = newColor;
        onColorsChange(newColors);
      } else {
        // 推荐选择模式：基于新颜色生成配色方案
        const harmonyColors = generateHarmonyColors(newColor, harmonyMode);
        onColorsChange(harmonyColors.slice(0, maxColors));
      }
    },
    [colors, currentHsl.l, harmonyMode, maxColors, mode, onColorsChange, selectedIndex]
  );

  // 鼠标事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleWheelInteraction(e.clientX, e.clientY);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        handleWheelInteraction(e.clientX, e.clientY);
      }
    },
    [isDragging, handleWheelInteraction]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 添加全局鼠标事件监听
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 获取智能推荐
  const handleGetRecommendation = () => {
    const baseColor = colors[selectedIndex];
    const rec = getSmartColorRecommendation(baseColor);
    setRecommendation(rec);
    setHarmonyMode(rec.mode);
    onColorsChange(rec.colors);
  };

  // 添加颜色
  const addColor = () => {
    if (colors.length < maxColors) {
      const newColors = [...colors, '#808080'];
      onColorsChange(newColors);
      setSelectedIndex(newColors.length - 1);
    }
  };

  // 移除颜色
  const removeColor = (index: number) => {
    if (colors.length > 1) {
      const newColors = colors.filter((_, i) => i !== index);
      onColorsChange(newColors);
      if (selectedIndex >= newColors.length) {
        setSelectedIndex(newColors.length - 1);
      }
    }
  };

  // 更新亮度
  const handleLightnessChange = (lightness: number) => {
    const newColor = hslToHex({ ...currentHsl, l: lightness });
    if (mode === 'free') {
      const newColors = [...colors];
      newColors[selectedIndex] = newColor;
      onColorsChange(newColors);
    } else {
      const baseHsl = { ...currentHsl, l: lightness };
      const baseColor = hslToHex(baseHsl);
      const harmonyColors = generateHarmonyColors(baseColor, harmonyMode);
      onColorsChange(harmonyColors.slice(0, maxColors));
    }
  };

  // 切换和谐模式
  const handleHarmonyModeChange = (newMode: HarmonyMode) => {
    setHarmonyMode(newMode);
    if (mode === 'recommend') {
      const baseColor = colors[selectedIndex];
      const harmonyColors = generateHarmonyColors(baseColor, newMode);
      onColorsChange(harmonyColors.slice(0, maxColors));
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* 模式切换 */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        <button
          onClick={() => setMode('free')}
          className={cn(
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
            mode === 'free'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          自由选择
        </button>
        <button
          onClick={() => setMode('recommend')}
          className={cn(
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
            mode === 'recommend'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          推荐选择
        </button>
      </div>

      {/* 色轮区域 */}
      <div className="flex flex-col items-center gap-6">
        {/* 色轮 */}
        <div className="relative">
          <div
            ref={wheelRef}
            onMouseDown={handleMouseDown}
            className={cn(
              'w-64 h-64 rounded-full cursor-crosshair relative select-none',
              'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900',
              isDragging && 'cursor-grabbing'
            )}
            style={{
              background: `
                radial-gradient(circle, white 0%, transparent 15%),
                conic-gradient(
                  from 0deg,
                  hsl(0, 100%, 50%),
                  hsl(60, 100%, 50%),
                  hsl(120, 100%, 50%),
                  hsl(180, 100%, 50%),
                  hsl(240, 100%, 50%),
                  hsl(300, 100%, 50%),
                  hsl(360, 100%, 50%)
                )
              `
            }}
          >
            {/* 饱和度遮罩 */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, transparent 0%, rgba(255,255,255,0.3) 100%)'
              }}
            />
            
            {/* 选择器指示器 */}
            <div
              className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-white shadow-lg pointer-events-none transition-transform"
              style={{
                left: `calc(50% + ${selectorPosition.x}px)`,
                top: `calc(50% + ${selectorPosition.y}px)`,
                backgroundColor: colors[selectedIndex],
                boxShadow: '0 0 0 2px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.3)'
              }}
            />
          </div>

          {/* 中心亮度控制 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-background shadow-lg flex items-center justify-center pointer-events-auto">
              <input
                type="range"
                min="0"
                max="100"
                value={currentHsl.l}
                onChange={(e) => handleLightnessChange(Number(e.target.value))}
                className="w-12 h-2 cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #000, ${colors[selectedIndex]}, #fff)`
                }}
              />
            </div>
          </div>
        </div>

        {/* 亮度滑块 */}
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>亮度</span>
            <span>{currentHsl.l}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={currentHsl.l}
            onChange={(e) => handleLightnessChange(Number(e.target.value))}
            className="w-full h-3 rounded-full cursor-pointer appearance-none"
            style={{
              background: `linear-gradient(to right, #000, ${hslToHex({ ...currentHsl, l: 50 })}, #fff)`
            }}
          />
        </div>
      </div>

      {/* 推荐选择模式下的和谐模式选择 */}
      {mode === 'recommend' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">配色方案</span>
            <button
              onClick={handleGetRecommendation}
              className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              智能推荐
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {getHarmonyModes().map(({ mode: hm, name, description }) => (
              <button
                key={hm}
                onClick={() => handleHarmonyModeChange(hm)}
                className={cn(
                  'p-3 rounded-lg border text-left transition-all',
                  harmonyMode === hm
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted'
                )}
              >
                <div className="font-medium text-sm">{name}</div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {description}
                </div>
              </button>
            ))}
          </div>

          {/* 智能推荐结果展示 */}
          {recommendation && (
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm">{recommendation.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({getHarmonyModes().find(m => m.mode === recommendation.mode)?.name})
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {recommendation.description}
              </p>
              <div className="flex gap-2">
                {recommendation.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 颜色列表 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">已选颜色</span>
          <span className="text-xs text-muted-foreground">
            {colors.length}/{maxColors}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {colors.map((color, index) => (
            <div
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'group relative w-10 h-10 rounded-full cursor-pointer transition-all',
                'border-2 hover:scale-110',
                selectedIndex === index
                  ? 'border-primary scale-110'
                  : 'border-transparent'
              )}
              style={{ backgroundColor: color }}
            >
              {/* 删除按钮 */}
              {colors.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeColor(index);
                  }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          
          {colors.length < maxColors && (
            <button
              onClick={addColor}
              className="w-10 h-10 rounded-full border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5 flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
            >
              +
            </button>
          )}
        </div>

        {/* 颜色值显示 */}
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <div
            className="w-8 h-8 rounded-full border border-border"
            style={{ backgroundColor: colors[selectedIndex] }}
          />
          <input
            type="text"
            value={colors[selectedIndex]?.toUpperCase()}
            onChange={(e) => {
              const value = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                const newColors = [...colors];
                newColors[selectedIndex] = value;
                onColorsChange(newColors);
              }
            }}
            className="flex-1 bg-transparent font-mono text-sm uppercase"
          />
        </div>
      </div>
    </div>
  );
}
