"use client";

import { useEffect, useRef } from "react";

export default function FocusedParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Line {
      x: number;
      y: number;
      vx: number;
      vy: number;
      length: number;
      angle: number;
      maxAngle: number;
      speed: number;
    }

    const lines: Line[] = [];
    const lineCount = 8;

    for (let i = 0; i < lineCount; i++) {
      lines.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        length: 40 + Math.random() * 60,
        angle: Math.random() * Math.PI * 2,
        maxAngle: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.01,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#14b8a6";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";

      lines.forEach((line) => {
        line.x += line.vx;
        line.y += line.vy;
        line.angle += line.speed;

        if (line.x < -100) line.x = canvas.width + 100;
        if (line.x > canvas.width + 100) line.x = -100;
        if (line.y < -100) line.y = canvas.height + 100;
        if (line.y > canvas.height + 100) line.y = -100;

        const x1 = line.x;
        const y1 = line.y;
        const x2 = x1 + Math.cos(line.angle) * line.length;
        const y2 = y1 + Math.sin(line.angle) * line.length;

        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
    />
  );
}
