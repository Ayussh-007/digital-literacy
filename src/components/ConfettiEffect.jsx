import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store/gameStore';

export default function ConfettiEffect() {
  const showConfetti = useGameStore((s) => s.showConfetti);
  const fired = useRef(false);

  useEffect(() => {
    if (showConfetti && !fired.current) {
      fired.current = true;
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#6C5CE7', '#A29BFE', '#00CEC9', '#FD79A8', '#FDCB6E', '#FF6B6B'],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#6C5CE7', '#A29BFE', '#00CEC9', '#FD79A8', '#FDCB6E', '#FF6B6B'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } else if (!showConfetti) {
      fired.current = false;
    }
  }, [showConfetti]);

  return null;
}
