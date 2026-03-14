'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ColorWheel } from '@/components/ColorWheel';
import { getRecommendedColors } from '@/lib/utils';
import { Palette, Sparkles, Plus, Trash2 } from 'lucide-react';

interface ColorSelectorProps {
  colors: string[];
  setColors: (colors: string[]) => void;
}

type SelectorMode = 'free' | 'recommended';

export function ColorSelector({ colors, setColors }: ColorSelectorProps) {
  const [mode, setMode] = useState<SelectorMode>('free');
  const [activeIndex, setActiveIndex] = useState(0);
  const [primaryColor, setPrimaryColor] = useState(colors[0] || '#5135FF');

  const handleColorSelect = (color: string, index?: number) => {
    if (index !== undefined) {
      const newColors = [...colors];
      newColors[index] = color;
      setColors(newColors);
      setPrimaryColor(color);
    } else {
      setPrimaryColor(color);
    }
  };

  const addColor = () => {
    if (colors.length < 8) {
      setColors([...colors, '#000000']);
      setActiveIndex(colors.length);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      const newColors = colors.filter((_, i) => i !== index);
      setColors(newColors);
      setActiveIndex(Math.max(0, index - 1));
    }
  };

  const applyRecommendedColor = (recommendedColor: string) => {
    if (colors.length < 8) {
      setColors([...colors, recommendedColor]);
    } else {
      const newColors = [...colors];
      newColors[activeIndex] = recommendedColor;
      setColors(newColors);
    }
  };

  const recommendedColors = getRecommendedColors(primaryColor);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-lg">Colors</h2>
        </div>
        <span className="text-xs font-mono bg-muted px-2 py-1 rounded-md text-muted-foreground">
          {colors.length}/8
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          variant={mode === 'free' ? 'default' : 'outline'}
          onClick={() => setMode('free')}
          className="flex-1"
        >
          <Palette className="w-4 h-4 mr-2" />
          自由选择
        </Button>
        <Button
          variant={mode === 'recommended' ? 'default' : 'outline'}
          onClick={() => setMode('recommended')}
          className="flex-1"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          推荐选择
        </Button>
      </div>

      {mode === 'free' && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <ColorWheel
              selectedColors={colors}
              onColorSelect={handleColorSelect}
              activeIndex={activeIndex}
            />
          </div>
          
          <div className="space-y-3">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-3">
                <button
                  onClick={() => setActiveIndex(index)}
                  className={`w-12 h-12 rounded-xl border-2 transition-all ${
                    index === activeIndex ? 'border-primary ring-2 ring-primary/20' : 'border-muted-foreground/30'
                  }`}
                  style={{ backgroundColor: color }}
                />
                <Input
                  type="text"
                  value={color.toUpperCase()}
                  onChange={(e) => handleColorSelect(e.target.value, index)}
                  className="font-mono text-sm tracking-wider uppercase"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeColor(index)}
                  disabled={colors.length <= 2}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {colors.length < 8 && (
            <Button onClick={addColor} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              添加颜色
            </Button>
          )}
        </div>
      )}

      {mode === 'recommended' && (
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium text-muted-foreground">选择主色调</label>
            <div className="flex items-center gap-3">
              <Input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-16 h-12 p-1 rounded-xl cursor-pointer"
              />
              <Input
                type="text"
                value={primaryColor.toUpperCase()}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="font-mono text-sm tracking-wider uppercase"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-muted-foreground">推荐颜色组合</label>
            
            {recommendedColors.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">{group.name}</div>
                <div className="flex gap-2">
                  <div 
                    className="w-12 h-12 rounded-xl border-2 border-muted-foreground/30"
                    style={{ backgroundColor: primaryColor }}
                  />
                  {group.colors.map((color, colorIndex) => (
                    <button
                      key={colorIndex}
                      onClick={() => applyRecommendedColor(color)}
                      className="w-12 h-12 rounded-xl border-2 border-muted-foreground/30 hover:border-primary transition-colors"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            <label className="text-sm font-medium text-muted-foreground">当前颜色列表</label>
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl border-2 border-muted-foreground/30"
                  style={{ backgroundColor: color }}
                />
                <Input
                  type="text"
                  value={color.toUpperCase()}
                  onChange={(e) => {
                    const newColors = [...colors];
                    newColors[index] = e.target.value;
                    setColors(newColors);
                  }}
                  className="font-mono text-sm tracking-wider uppercase"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeColor(index)}
                  disabled={colors.length <= 2}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
