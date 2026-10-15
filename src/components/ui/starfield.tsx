'use client';

import React, { useEffect, useRef } from 'react';

export interface StarColor {
  r: number;
  g: number;
  b: number;
}

export interface StarfieldProps {
  starCount?: number;
  waveFrequency?: number;
  starEscapeWidth?: number;
  voidWidth?: number;
  starColor?: StarColor;
  maxOpacity?: number;
  rotationSpeed?: number;
  waveSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface Star {
  orbital: number;
  opacity: number;
  position: { x: number; y: number };
  originPosition: { x: number; y: number };
  rotation: number;
  realPosition: { x: number; y: number };
  rSpeed: number;
  waveSpeed1: number;
  waveSpeed2: number;
  wave1: number;
  wave2: number;
  id: number;
}

const Starfield: React.FC<StarfieldProps> = ({
  starCount = 25000,
  waveFrequency = 20,
  starEscapeWidth = 255,
  voidWidth = 100,
  starColor = { r: 168, g: 85, b: 247 },
  maxOpacity = 255,
  rotationSpeed = 0.0005,
  waveSpeed = 0.01,
  className = '',
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let size = { x: 0, y: 0 };
    let imagedata: ImageData;
    let buf: ArrayBuffer;
    let data: Uint32Array;
    let startTime = Date.now();
    let currentTime = 0;

    const setSize = () => {
      size.x = container.clientWidth || 300;
      size.y = container.clientHeight || 300;
      canvas.width = size.x;
      canvas.height = size.y;

      // Initialize pixel data
      imagedata = context.createImageData(size.x, size.y);
      buf = new ArrayBuffer(imagedata.data.length);
      data = new Uint32Array(imagedata.data.buffer);
      starsRef.current = []; // Reset stars on resize
    };

    const rotate = (cx: number, cy: number, x: number, y: number, radians: number) => {
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);
      const nx = cos * (x - cx) + sin * (y - cy) + cx;
      const ny = cos * (y - cy) - sin * (x - cx) + cy;
      return { x: nx, y: ny };
    };

    const createStar = () => {
      const rands = [
        Math.random() * (starEscapeWidth / 2) + 1,
        Math.random() * (starEscapeWidth / 2) + starEscapeWidth,
      ];
      const orbital = rands.reduce((p, c) => p + c, 0) / rands.length;
      const opacity = Math.floor(
        (1 - orbital / starEscapeWidth) * maxOpacity + Math.random() * 80
      );
      let position = {
        x: size.x / 2,
        y: size.y / 2 + orbital,
      };
      const originPosition = { ...position };
      const rotation = Math.PI * (Math.random() * 2);
      position = rotate(
        size.x / 2,
        size.y / 2,
        position.x,
        position.y,
        rotation
      );
      const realPosition = { ...position };
      const rSpeed = Math.random() * rotationSpeed + opacity / 20000;
      const waveSpeed1 = Math.random() * waveSpeed;
      const waveSpeed2 = Math.random() * waveSpeed;
      const wave1 = Math.sin(currentTime * waveSpeed1) * waveFrequency;
      const wave2 = Math.sin(currentTime * waveSpeed2) * waveFrequency;
      const id = starsRef.current.length;
      const star: Star = {
        orbital,
        opacity,
        position,
        originPosition,
        rotation,
        realPosition,
        rSpeed,
        waveSpeed1,
        waveSpeed2,
        wave1,
        wave2,
        id,
      };
      starsRef.current.push(star);
    };

    const drawStar = (star: Star) => {
      // Clear previous pixel
      const prevIndex =
        Math.floor(star.realPosition.y + star.wave1) * size.x +
        Math.floor(star.realPosition.x + star.wave2);
      if (prevIndex >= 0 && prevIndex < data.length) {
        data[prevIndex] = 0;
      }

      // Update star properties
      star.wave1 = Math.sin(currentTime * star.waveSpeed1) * waveFrequency;
      star.wave2 = Math.sin(currentTime * star.waveSpeed2) * waveFrequency;
      star.realPosition = rotate(
        size.x / 2,
        size.y / 2,
        star.position.x,
        star.position.y,
        star.rSpeed * currentTime
      );
      star.opacity = Math.floor(
        (1 - star.orbital / starEscapeWidth) * maxOpacity + Math.random() * 80
      );

      // Draw new pixel
      const index =
        Math.floor(star.realPosition.y + star.wave1) * size.x +
        Math.floor(star.realPosition.x + star.wave2);
      if (index >= 0 && index < data.length) {
        data[index] =
          (star.opacity << 24) | // alpha
          (starColor.b << 16) | // blue
          (starColor.g << 8) | // green
          starColor.r; // red
      }
    };

    const render = () => {
      currentTime = (Date.now() - startTime) / 10;

      context.fillRect(0, 0, size.x, size.y);

      // Create new stars
      if (starsRef.current.length < starCount) {
        for (let i = 0; i < Math.min(100, starCount - starsRef.current.length); i++) {
          createStar();
        }
      }

      // Draw all stars
      for (const star of starsRef.current) {
        drawStar(star);
      }

      // Update canvas
      context.putImageData(imagedata, 0, 0);

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(render);
    };

    // Initialize
    setSize();
    render();

    // Handle resize
    const resizeHandler = () => setSize();
    window.addEventListener('resize', resizeHandler);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', resizeHandler);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [starCount, waveFrequency, starEscapeWidth, voidWidth, starColor, maxOpacity, rotationSpeed, waveSpeed]);

  return (
    <div ref={containerRef} className={className} style={{ width: '100%', height: '100%', ...style }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
};

export { Starfield };
export default Starfield;
