"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface FluidBackgroundProps {
  colors?: string[];
  className?: string;
  speed?: number;
  intensity?: number;
}

export default function FluidBackground({
  colors = ["#cd0000", "#8b0000", "#1a0000"],
  className = "",
  speed = 0.3,
  intensity = 0.6,
}: FluidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const timeRef = useRef(0);

  const hexToRgb = useCallback((hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parsedColors = colors.map(hexToRgb);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr * 0.25;
      canvas.height = rect.height * dpr * 0.25;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
      mouseRef.current.active = true;
    };
    window.addEventListener("mousemove", onMouseMove);

    const draw = () => {
      timeRef.current += speed * 0.01;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const nx = x / w;
          const ny = y / h;

          const dx = nx - mx;
          const dy = ny - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const v1 = Math.sin(nx * 3.0 + t * 1.2) * Math.cos(ny * 2.5 - t * 0.8);
          const v2 = Math.sin((nx + ny) * 2.0 + t * 0.7) * 0.5;
          const v3 = Math.cos(dist * 4.0 - t * 1.5) * intensity;
          const v4 = Math.sin(nx * 5.0 - t) * Math.sin(ny * 4.0 + t * 0.6) * 0.3;

          let value = (v1 + v2 + v3 + v4) * 0.5 + 0.5;
          value = Math.max(0, Math.min(1, value));

          const mouseInfluence = Math.max(0, 1 - dist * 3) * 0.4;
          value = Math.min(1, value + mouseInfluence);

          const cIdx = value * (parsedColors.length - 1);
          const ci = Math.min(Math.floor(cIdx), parsedColors.length - 2);
          const cf = cIdx - ci;
          const c0 = parsedColors[ci];
          const c1 = parsedColors[ci + 1];

          const idx = (y * w + x) * 4;
          data[idx] = c0.r + (c1.r - c0.r) * cf;
          data[idx + 1] = c0.g + (c1.g - c0.g) * cf;
          data[idx + 2] = c0.b + (c1.b - c0.b) * cf;
          data[idx + 3] = Math.floor(value * 180);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [colors, speed, intensity, hexToRgb]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ imageRendering: "auto", filter: "blur(40px)" }}
    />
  );
}
