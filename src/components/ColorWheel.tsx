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
  getColorRecommendations,
  getHarmonyModes,
  calculateHarmonyScore,
  generateDualColorGradients,
  type HarmonyMode,
  type ColorHarmony
} from '@/lib/colorUtils';
import { Sparkles, Palette, Lightbulb, RotateCcw, Check } from 'lucide-react';

interface ColorWheelProps {
  colors: string[];
  onColorsChange: (colors: string[]) => void;
  maxColors?: number;
  className?: string;
}

type SelectionMode = 'free' | 'recommend';
type ActiveSelector = 0 | 1; // 两个颜色选择器

export function ColorWheel({
  colors,
  onColorsChange,
  maxColors = 8,
  className
}: ColorWheelProps) {
  const [mode, setMode] = useState<SelectionMode>('free');
  const [activeSelector, setActiveSelector] = useState<ActiveSelector>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [recommendations, setRecommendations] = useState<ColorHarmony[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<ColorHarmony | null>(null);
  const [showDualPreview, setShowDualPreview] = useState(true);
  
  const wheelRef = useRef<HTMLDivElement>(null);
  const wheelRadius = 140;

  // 确保至少有两个颜色
  const safeColors = colors.length >= 2 ? colors : [colors[0] || '#FF6B6B', colors[0] || '#4ECDC4'];
  
  // 获取两个主要颜色的HSL值
  const color1Hsl = hexToHsl(safeColors[0]);
  const color2Hsl = hexToHsl(safeColors[1]);

  // 计算两个选择器在色轮上的位置
  const selector1Position = getColorWheelPosition(color1Hsl.h, color1Hsl.s, wheelRadius);
  const selector2Position = getColorWheelPosition(color2Hsl.h, color2Hsl.s, wheelRadius);

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
      
      if (mode === 'free') {
        // 自由选择模式：更新当前选中的颜色
        const newColor = hslToHex({ h, s, l: activeSelector === 0 ? color1Hsl.l : color2Hsl.l });
        const newColors = [...safeColors];
        newColors[activeSelector] = newColor;
        onColorsChange(newColors);
      } else {
        // 推荐选择模式：更新主颜色并生成推荐
        const newColor = hslToHex({ h, s, l: 50 });
        const recs = getColorRecommendations(newColor, 4);
        setRecommendations(recs);
        if (recs.length > 0) {
          setSelectedRecommendation(recs[0]);
          onColorsChange(recs[0].colors);
        }
      }
    },
    [color1Hsl.l, color2Hsl.l, activeSelector, mode, onColorsChange, safeColors]
  );

  // 鼠标事件处理
  const handleMouseDown = (e: React.MouseEvent, selectorIndex?: ActiveSelector) => {
    e.preventDefault();
    setIsDragging(true);
    if (selectorIndex !== undefined && mode === 'free') {
      setActiveSelector(selectorIndex);
    }
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
  const handleGetRecommendations = () => {
    const baseColor = safeColors[activeSelector];
    const recs = getColorRecommendations(baseColor, 4);
    setRecommendations(recs);
    if (recs.length > 0) {
      setSelectedRecommendation(recs[0]);
      onColorsChange(recs[0].colors);
    }
  };

  // 应用推荐方案
  const applyRecommendation = (rec: ColorHarmony) => {
    setSelectedRecommendation(rec);
    onColorsChange(rec.colors);
  };

  // 更新亮度
  const handleLightnessChange = (lightness: number, selectorIndex: ActiveSelector) => {
    const targetHsl = selectorIndex === 0 ? color1Hsl : color2Hsl;
    const newColor = hslToHex({ ...targetHsl, l: lightness });
    const newColors = [...safeColors];
    newColors[selectorIndex] = newColor;
    onColorsChange(newColors);
  };

  // 交换两个颜色
  const swapColors = () => {
    const newColors = [...safeColors];
    [newColors[0], newColors[1]] = [newColors[1], newColors[0]];
    onColorsChange(newColors);
  };

  // 随机颜色
  const randomizeColors = () => {
    const randomColor = () => hslToHex({
      h: Math.floor(Math.random() * 360),
      s: 60 + Math.floor(Math.random() * 40),
      l: 40 + Math.floor(Math.random() * 40)
    });
    onColorsChange([randomColor(), randomColor()]);
  };

  // 计算当前双色的和谐度
  const currentHarmonyScore = calculateHarmonyScore([safeColors[0], safeColors[1]]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* 模式切换 */}
      <div className="flex gap-2 p-1 bg-muted rounded-xl">
        <button
          onClick={() => {
            setMode('free');
            setRecommendations([]);
            setSelectedRecommendation(null);
          }}
          className={cn(
            'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2',
            mode === 'free'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Palette className="w-4 h-4" />
          自由选择
        </button>
        <button
          onClick={() => {
            setMode('recommend');
            handleGetRecommendations();
          }}
          className={cn(
            'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2',
            mode === 'recommend'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Sparkles className="w-4 h-4" />
          智能推荐
        </button>
      </div>

      {/* 色轮区域 */}
      <div className="flex flex-col items-center gap-6">
        {/* 双色调预览 */}
        {showDualPreview && mode === 'free' && (
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>双色渐变预览</span>
              <span className={cn(
                "font-medium",
                currentHarmonyScore >= 80 ? "text-green-500" :
                currentHarmonyScore >= 60 ? "text-yellow-500" : "text-orange-500"
              )}>
                和谐度: {currentHarmonyScore}%
              </span>
            </div>
            <div 
              className="h-16 rounded-xl shadow-inner"
              style={{
                background: `linear-gradient(135deg, ${safeColors[0]}, ${safeColors[1]})`
              }}
            />
          </div>
        )}

        {/* 色轮容器 */}
        <div className="relative">
          {/* 色轮 */}
          <div
            ref={wheelRef}
            onMouseDown={(e) => handleMouseDown(e)}
            className={cn(
              'w-72 h-72 rounded-full cursor-crosshair relative select-none',
              'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900',
              isDragging && 'cursor-grabbing'
            )}
            style={{
              background: `
                radial-gradient(circle, white 0%, transparent 20%),
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
                background: 'radial-gradient(circle, transparent 0%, rgba(255,255,255,0.4) 100%)'
              }}
            />
            
            {/* 选择器1 (主色) */}
            {mode === 'free' && (
              <div
                onMouseDown={(e) => handleMouseDown(e, 0)}
                className={cn(
                  "absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-3 cursor-grab active:cursor-grabbing transition-transform hover:scale-110",
                  activeSelector === 0 ? "border-white z-20" : "border-white/70 z-10"
                )}
                style={{
                  left: `calc(50% + ${selector1Position.x}px)`,
                  top: `calc(50% + ${selector1Position.y}px)`,
                  backgroundColor: safeColors[0],
                  boxShadow: activeSelector === 0 
                    ? '0 0 0 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)' 
                    : '0 0 0 2px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.3)',
                  borderWidth: '3px'
                }}
                title="主色"
              />
            )}

            {/* 选择器2 (副色) */}
            {mode === 'free' && (
              <div
                onMouseDown={(e) => handleMouseDown(e, 1)}
                className={cn(
                  "absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-3 cursor-grab active:cursor-grabbing transition-transform hover:scale-110",
                  activeSelector === 1 ? "border-white z-20" : "border-white/70 z-10"
                )}
                style={{
                  left: `calc(50% + ${selector2Position.x}px)`,
                  top: `calc(50% + ${selector2Position.y}px)`,
                  backgroundColor: safeColors[1],
                  boxShadow: activeSelector === 1 
                    ? '0 0 0 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)' 
                    : '0 0 0 2px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.3)',
                  borderWidth: '3px'
                }}
                title="副色"
              />
            )}

            {/* 推荐模式下的选择器 */}
            {mode === 'recommend' && selectedRecommendation && (
              <>
                {selectedRecommendation.colors.slice(0, 2).map((color, index) => {
                  const hsl = hexToHsl(color);
                  const pos = getColorWheelPosition(hsl.h, hsl.s, wheelRadius);
                  return (
                    <div
                      key={index}
                      className="absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full border-2 border-white z-10 pointer-events-none"
                      style={{
                        left: `calc(50% + ${pos.x}px)`,
                        top: `calc(50% + ${pos.y}px)`,
                        backgroundColor: color,
                        boxShadow: '0 0 0 2px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.3)'
                      }}
                    />
                  );
                })}
              </>
            )}
          </div>

          {/* 中心控制区 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-background shadow-lg flex flex-col items-center justify-center pointer-events-auto gap-1">
              <button
                onClick={swapColors}
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
                title="交换颜色"
              >
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={randomizeColors}
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
                title="随机颜色"
              >
                <Lightbulb className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* 亮度控制 */}
        {mode === 'free' && (
          <div className="w-full grid grid-cols-2 gap-4">
            {/* 颜色1亮度 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">主色亮度</span>
                <span className="font-medium">{color1Hsl.l}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={color1Hsl.l}
                onChange={(e) => handleLightnessChange(Number(e.target.value), 0)}
                className="w-full h-2 rounded-full cursor-pointer appearance-none"
                style={{
                  background: `linear-gradient(to right, #000, ${hslToHex({ ...color1Hsl, l: 50 })}, #fff)`
                }}
              />
            </div>

            {/* 颜色2亮度 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">副色亮度</span>
                <span className="font-medium">{color2Hsl.l}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={color2Hsl.l}
                onChange={(e) => handleLightnessChange(Number(e.target.value), 1)}
                className="w-full h-2 rounded-full cursor-pointer appearance-none"
                style={{
                  background: `linear-gradient(to right, #000, ${hslToHex({ ...color2Hsl, l: 50 })}, #fff)`
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 推荐选择模式下的推荐列表 */}
      {mode === 'recommend' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              智能推荐方案
            </span>
            <button
              onClick={handleGetRecommendations}
              className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              重新推荐
            </button>
          </div>
          
          <div className="grid gap-3">
            {recommendations.map((rec, index) => (
              <button
                key={rec.mode}
                onClick={() => applyRecommendation(rec)}
                className={cn(
                  'p-4 rounded-xl border text-left transition-all',
                  selectedRecommendation?.mode === rec.mode
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/50 hover:bg-muted'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium text-sm flex items-center gap-2">
                      {rec.name}
                      {index === 0 && (
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          最佳
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {rec.description}
                    </div>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">
                    评分: {rec.score}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {rec.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-lg border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  {selectedRecommendation?.mode === rec.mode && (
                    <Check className="w-5 h-5 text-primary ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 颜色值显示 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">当前颜色</span>
          <div className="flex gap-2">
            <button
              onClick={() => onColorsChange([...safeColors, '#808080'])}
              disabled={safeColors.length >= maxColors}
              className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 disabled:opacity-50"
            >
              + 添加
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {/* 颜色1 */}
          <div 
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer",
              mode === 'free' && activeSelector === 0 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            )}
            onClick={() => mode === 'free' && setActiveSelector(0)}
          >
            <div
              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: safeColors[0] }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-0.5">主色</div>
              <input
                type="text"
                value={safeColors[0]?.toUpperCase()}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                    const newColors = [...safeColors];
                    newColors[0] = value;
                    onColorsChange(newColors);
                  }
                }}
                className="w-full bg-transparent font-mono text-sm uppercase outline-none"
              />
            </div>
          </div>

          {/* 颜色2 */}
          <div 
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer",
              mode === 'free' && activeSelector === 1 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            )}
            onClick={() => mode === 'free' && setActiveSelector(1)}
          >
            <div
              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: safeColors[1] }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-0.5">副色</div>
              <input
                type="text"
                value={safeColors[1]?.toUpperCase()}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                    const newColors = [...safeColors];
                    newColors[1] = value;
                    onColorsChange(newColors);
                  }
                }}
                className="w-full bg-transparent font-mono text-sm uppercase outline-none"
              />
            </div>
          </div>
        </div>

        {/* 额外颜色 */}
        {safeColors.length > 2 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {safeColors.slice(2).map((color, index) => (
              <div key={index + 2} className="flex items-center gap-2 px-2 py-1 bg-muted rounded-lg">
                <div
                  className="w-6 h-6 rounded-full border border-white"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs font-mono">{color.toUpperCase()}</span>
                <button
                  onClick={() => {
                    const newColors = safeColors.filter((_, i) => i !== index + 2);
                    onColorsChange(newColors);
                  }}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 和谐模式说明 */}
      {mode === 'free' && (
        <div className="p-4 bg-muted/50 rounded-xl border border-border">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            使用提示
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• 拖动色轮上的圆点选择颜色</li>
            <li>• 白色边框的是当前激活的选择器</li>
            <li>• 点击颜色卡片可切换激活的选择器</li>
            <li>• 使用亮度滑块微调颜色明暗</li>
            <li>• 切换到"智能推荐"获取配色建议</li>
          </ul>
        </div>
      )}
    </div>
  );
}
