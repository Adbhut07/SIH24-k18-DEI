"use client";

import { useEffect, useRef } from "react";

const NeonBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize the canvas to fit the screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Object arrays
    const stars: Star[] = [];
    const planes: Aircraft[] = [];
    const clouds: Cloud[] = [];

    // Helper functions
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    // Star class
    class Star {
      x: number;
      y: number;
      radius: number;
      color: string;
      twinkleFactor: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = randomInRange(0.5, 1.5);
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
        this.twinkleFactor = randomInRange(0.01, 0.03);
      }

      update() {
        const alpha = parseFloat(this.color.match(/[\d.]+(?=\))$/)?.[0] ?? "0.5");
        const newAlpha = alpha + this.twinkleFactor * (Math.random() > 0.5 ? 1 : -1);
        this.color = `rgba(255, 255, 255, ${Math.max(0.3, Math.min(1, newAlpha))})`;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Aircraft class
    class Aircraft {
      x: number;
      y: number;
      speed: number;
      type: "plane" | "jet";

      constructor() {
        this.x = Math.random() < 0.5 ? -50 : canvas.width + 50;
        this.y = randomInRange(canvas.height * 0.1, canvas.height * 0.9);
        this.speed = randomInRange(1.5, 3);
        this.type = Math.random() < 0.7 ? "plane" : "jet";
        if (this.x > canvas.width) this.speed *= -1; // Reverse direction
      }

      update() {
        this.x += this.speed;
        if (this.x < -100 || this.x > canvas.width + 100) {
          this.x = this.speed > 0 ? -50 : canvas.width + 50;
          this.y = randomInRange(canvas.height * 0.1, canvas.height * 0.9);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.speed < 0) ctx.scale(-1, 1); // Flip for reverse direction
        ctx.strokeStyle = this.type === "plane" ? "rgba(200, 200, 200, 0.8)" : "rgba(255, 100, 100, 0.8)";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(30, 0);
        ctx.lineTo(25, -5);
        ctx.moveTo(15, 0);
        ctx.lineTo(20, -10);
        ctx.lineTo(10, -10);
        ctx.stroke();

        ctx.restore();
      }
    }

    // Cloud class
    class Cloud {
      x: number;
      y: number;
      width: number;
      height: number;
      speed: number;

      constructor() {
        this.width = randomInRange(100, 200);
        this.height = this.width * 0.6;
        this.x = Math.random() * (canvas.width + this.width) - this.width;
        this.y = randomInRange(0, canvas.height * 0.6);
        this.speed = randomInRange(0.2, 0.5);
      }

      update() {
        this.x += this.speed;
        if (this.x > canvas.width + this.width) {
          this.x = -this.width;
          this.y = randomInRange(0, canvas.height * 0.6);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
        
        ctx.fillStyle = gradient;
        
        // Draw cloud shape
        ctx.beginPath();
        ctx.moveTo(this.width * 0.2, this.height * 0.5);
        ctx.bezierCurveTo(
          this.width * 0.2, this.height * 0.2,
          this.width * 0.4, this.height * 0.2,
          this.width * 0.5, this.height * 0.4
        );
        ctx.bezierCurveTo(
          this.width * 0.6, this.height * 0.2,
          this.width * 0.8, this.height * 0.2,
          this.width * 0.8, this.height * 0.5
        );
        ctx.bezierCurveTo(
          this.width, this.height * 0.5,
          this.width, this.height * 0.7,
          this.width * 0.8, this.height * 0.8
        );
        ctx.bezierCurveTo(
          this.width * 0.6, this.height,
          this.width * 0.4, this.height,
          this.width * 0.2, this.height * 0.8
        );
        ctx.bezierCurveTo(
          0, this.height * 0.7,
          0, this.height * 0.5,
          this.width * 0.2, this.height * 0.5
        );
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
      }
    }

    // // Create stars, planes, and clouds
    // const createStars = (count: number) => {
    //   for (let i = 0; i < count; i++) stars.push(new Star());
    // };

    const createPlanes = (count: number) => {
      for (let i = 0; i < count; i++) planes.push(new Aircraft());
    };

    const createClouds = (count: number) => {
      for (let i = 0; i < count; i++) clouds.push(new Cloud());
    };

    // Animation loop
    const animate = () => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 255, 0, canvas.height);
      gradient.addColorStop(0, '#ADD8E6'); // Light blue at the top
      gradient.addColorStop(1, '#87CEEB'); // Sky blue at the bottom
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.update();
        star.draw();
      });

      clouds.forEach((cloud) => {
        cloud.update();
        cloud.draw();
      });

      planes.forEach((plane) => {
        plane.update();
        plane.draw();
      });

      requestAnimationFrame(animate);
    };

    // createStars(200);
    createPlanes(25);
    createClouds(10);
    animate();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />;
};

export default NeonBackground;

