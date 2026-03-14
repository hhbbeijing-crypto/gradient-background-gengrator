'use client';

import { useEffect, useRef, useState } from 'react';
import { hslToHex, hexToHsl } from '@/lib/utils';

interface ColorWheelProps {
  selectedColors: string[];
  onColorSelect: (color: string, index?: number) => void;
  activeIndex?: number;
  size?: number;
}

export function ColorWheel({ 
  selectedColors, 
  onColorSelect, 
  activeIndex = 0,
  size = 280 
}: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const center = size / 2;
  const radius = center - 20;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - center;
        const dy = y - center;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= radius) {
          const angle = Math.atan2(dy, dx);
          const hue = ((angle * 180 / Math.PI) + 360) % 360;
          const saturation = (distance / radius) * 100;
          const lightness = 50;

          ctx.fillStyle = hslToHex(hue, saturation, lightness);
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.stroke();

    selectedColors.forEach((color, index) => {
      const hsl = hexToHsl(color);
      const angle = (hsl.h * Math.PI) / 180;
      const distance = (hsl.s / 100) * radius;
      const x = center + distance * Math.cos(angle);
      const y = center + distance * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, index === activeIndex ? 12 : 10, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = index === activeIndex ? '#000' : '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();
    });
  }, [selectedColors, activeIndex, size, center, radius]);

  const getColorFromPosition = (x: number, y: number) => {
    const dx = x - center;
    const dy = y - center;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > radius) return null;

    const angle = Math.atan2(dy, dx);
    const hue = ((angle * 180 / Math.PI) + 360) % 360;
    const saturation = Math.min((distance / radius) * 100, 100);
    const lightness = 50;

    return hslToHex(hue, saturation, lightness);
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const color = getColorFromPosition(x, y);
    if (color) {
      onColorSelect(color, activeIndex);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="cursor-crosshair rounded-full shadow-lg"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={(e) => isDragging && handleInteraction(e)}
        onClick={handleInteraction}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleInteraction}
      />
      <div className="flex gap-2 flex-wrap justify-center">
        {selectedColors.map((color, index) => (
          <button
            key={index}
            onClick={() => onColorSelect(color, index)}
            className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${
              index === activeIndex ? 'border-black scale-110' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
