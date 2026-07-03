import { useEffect, useRef, useMemo } from 'react';

// Floating animated background with stars, clouds, and particles
export default function FloatingBackground() {
  const canvasRef = useRef(null);

  const particles = useMemo(() => {
    const arr = [];
    // For liquid blobs, we want fewer but much larger particles
    for (let i = 0; i < 12; i++) {
      arr.push({
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 2000),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1200),
        size: Math.random() * 250 + 150, // Huge sizes for blobs
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.3 + 0.3,
        // Liquid color palette (cyan, purple, magenta, deep blue)
        color: ['#6C5CE7', '#00CEC9', '#FD79A8', '#A29BFE', '#45B7D1'][
          Math.floor(Math.random() * 5)
        ],
      });
    }
    return arr;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Bounce off walls smoothly instead of wrapping
        if (p.x < -p.size || p.x > canvas.width + p.size) p.speedX *= -1;
        if (p.y < -p.size || p.y > canvas.height + p.size) p.speedY *= -1;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        
        // Massive blur for the liquid effect
        ctx.shadowBlur = 80;
        ctx.shadowColor = p.color;
        
        // Use standard blur filter if supported for better liquid blending
        if (ctx.filter) {
           ctx.filter = 'blur(80px)';
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [particles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
}
