import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../lib/sounds';
import { TIMER_PRESETS } from '../lib/constants';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function TimerWidget() {
  const {
    timerActive, timerSeconds, timerRemaining,
    startTimer, stopTimer, tickTimer, resetTimer, soundEnabled,
  } = useGameStore();

  const [customTime, setCustomTime] = useState(30);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => {
        const remaining = useGameStore.getState().timerRemaining;
        if (remaining <= 0) {
          clearInterval(intervalRef.current);
          stopTimer();
          if (soundEnabled) soundManager.play('celebration');
          return;
        }
        tickTimer();
        if (remaining <= 5 && soundEnabled) {
          soundManager.play('tick');
        }
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerActive]);

  const progress = timerSeconds > 0 ? (timerRemaining / timerSeconds) * 100 : 0;
  const isWarning = timerRemaining <= 10 && timerActive;
  const isCritical = timerRemaining <= 5 && timerActive;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  const ringColor = isCritical ? '#FF6B6B' : isWarning ? '#FDCB6E' : '#6C5CE7';
  const glowColor = isCritical ? 'rgba(255,107,107,0.3)' : isWarning ? 'rgba(253,203,110,0.2)' : 'rgba(108,92,231,0.2)';

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-heading font-bold text-xl text-white">
          ⏱️ Timer
        </h3>
        {timerActive && (
          <span className="text-xs text-dark-muted uppercase tracking-widest font-bold bg-white/5 px-3 py-1 rounded-full">
            {isCritical ? 'Hurry!' : 'Running'}
          </span>
        )}
      </div>

      {/* Large Glowing Timer Ring */}
      <div className="flex justify-center mb-8 relative">
        <div className="relative" style={{ width: '180px', height: '180px' }}>
          {/* Outer glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: timerActive ? `0 0 40px ${glowColor}, 0 0 80px ${glowColor}` : 'none',
              transition: 'box-shadow 0.5s ease',
            }}
          />
          <svg width="180" height="180" className="transform -rotate-90">
            {/* Background track */}
            <circle
              cx="90" cy="90" r={radius}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress ring */}
            <motion.circle
              cx="90" cy="90" r={radius}
              stroke={ringColor}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="timer-ring transition-all duration-300"
              style={{ filter: `drop-shadow(0 0 12px ${ringColor}60)` }}
            />
          </svg>
          <div className={`absolute inset-0 flex flex-col items-center justify-center ${isCritical ? 'animate-shake' : ''}`}>
            <span
              className="font-heading font-black text-5xl tracking-tight"
              style={{ color: isCritical ? '#FF6B6B' : isWarning ? '#FDCB6E' : '#F0ECF9' }}
            >
              {formatTime(timerRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {TIMER_PRESETS.map((preset) => (
          <motion.button
            key={preset.seconds}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              startTimer(preset.seconds);
              if (soundEnabled) soundManager.play('click');
            }}
            className="font-heading font-bold py-2.5 rounded-xl text-sm transition-colors border"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.05)',
              color: '#A29BFE',
            }}
          >
            {preset.label}
          </motion.button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3 mt-auto pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (timerActive) stopTimer();
            else startTimer(timerRemaining || timerSeconds);
            if (soundEnabled) soundManager.play('click');
          }}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl font-bold py-3 text-[16px] transition-colors border ${
            timerActive 
              ? 'bg-[#FDCB6E]/10 text-[#FDCB6E] border-[#FDCB6E]/30 hover:bg-[#FDCB6E]/20' 
              : 'bg-[#00B894]/10 text-[#00B894] border-[#00B894]/30 hover:bg-[#00B894]/20'
          }`}
        >
          {timerActive ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Start</>}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            resetTimer();
            if (soundEnabled) soundManager.play('click');
          }}
          className="px-5 flex items-center justify-center rounded-xl bg-[#FF6B6B]/10 text-[#FF6B6B] border border-[#FF6B6B]/30 hover:bg-[#FF6B6B]/20 transition-colors"
        >
          <RotateCcw size={20} />
        </motion.button>
      </div>
    </div>
  );
}
