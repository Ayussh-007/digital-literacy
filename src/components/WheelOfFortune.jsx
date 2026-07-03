import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../lib/sounds';
import { WHEEL_SEGMENTS } from '../lib/constants';
import { ArrowLeft, RotateCw } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';

export default function WheelOfFortune() {
  const {
    setView, soundEnabled, getTeamsUnsorted, addPoints,
    triggerConfetti, setNotification, setMultiplier, addPowerUp,
    addPointsToAll,
  } = useGameStore();

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const teams = getTeamsUnsorted();

  const segments = WHEEL_SEGMENTS;
  const segmentAngle = 360 / segments.length;

  const spinWheel = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setShowResult(false);
    setResult(null);

    if (soundEnabled) soundManager.play('spin');

    // Random result
    const extraRotations = 8 + Math.random() * 5; // 8-13 full rotations
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + extraRotations * 360 + randomAngle;

    setRotation(totalRotation);

    // Determine result after animation
    setTimeout(() => {
      const normalizedAngle = (360 - (totalRotation % 360)) % 360;
      const segmentIndex = Math.floor(normalizedAngle / segmentAngle) % segments.length;
      const selectedSegment = segments[segmentIndex];

      setResult(selectedSegment);
      setShowResult(true);
      setSpinning(false);

      if (soundEnabled) soundManager.play('celebration');
    }, 5000);
  }, [spinning, rotation, segmentAngle, segments, soundEnabled]);

  const applyResult = (teamId) => {
    if (!result || !teamId) return;

    const team = teams.find((t) => t.id === teamId);

    switch (result.type) {
      default:
        // For 'fun' types, we just show a notification
        break;
    }

    triggerConfetti();
    setNotification({
      emoji: '🎡',
      title: result.label,
      subtitle: `Challenge for ${team?.emoji} ${team?.name}`,
    });
    setShowResult(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] gap-6">
      <div className="flex-shrink-0">
        <Button variant="ghost" onClick={() => setView('dashboard')} icon={ArrowLeft}>
          Back to Dashboard
        </Button>
      </div>

      <div className="flex flex-1 gap-8 min-h-0">
        {/* Wheel - Absolute Hero (Left/Center) */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          
          <div className="absolute inset-0 bg-[#A29BFE]/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative mb-12 transform scale-110">
            {/* Pointer */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              <svg width="40" height="40" viewBox="0 0 30 30">
                <polygon points="15,30 5,5 25,5" fill="#FDCB6E" stroke="#F9CA24" strokeWidth="2" />
              </svg>
            </div>

            {/* Glowing Backdrop */}
            <div className="absolute inset-0 bg-[#6C5CE7] rounded-full blur-3xl opacity-20" />

            {/* Wheel SVG */}
            <motion.div
              animate={{ rotate: rotation }}
              transition={{ duration: 5, ease: [0.15, 0.85, 0.15, 1] }}
              className="relative rounded-full shadow-[0_0_0_12px_#151027,0_0_40px_rgba(108,92,231,0.5)] bg-[#151027]"
              style={{ width: 500, height: 500 }}
            >
              <svg viewBox="0 0 500 500" width="500" height="500">
                {segments.map((seg, i) => {
                  const startAngle = (i * segmentAngle * Math.PI) / 180;
                  const endAngle = ((i + 1) * segmentAngle * Math.PI) / 180;
                  const midAngle = (startAngle + endAngle) / 2;

                  const x1 = 250 + 240 * Math.cos(startAngle);
                  const y1 = 250 + 240 * Math.sin(startAngle);
                  const x2 = 250 + 240 * Math.cos(endAngle);
                  const y2 = 250 + 240 * Math.sin(endAngle);
                  const largeArc = segmentAngle > 180 ? 1 : 0;

                  const textRadius = 170;
                  const textX = 250 + textRadius * Math.cos(midAngle);
                  const textY = 250 + textRadius * Math.sin(midAngle);
                  const textRotation = (midAngle * 180) / Math.PI;

                  return (
                    <g key={i}>
                      <path
                        d={`M 250 250 L ${x1} ${y1} A 240 240 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={seg.color}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="2"
                      />
                      <text
                        x={textX}
                        y={textY}
                        fill="white"
                        fontSize="13"
                        fontWeight="bold"
                        fontFamily="var(--font-heading)"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                        style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))' }}
                      >
                        {seg.label}
                      </text>
                    </g>
                  );
                })}
                {/* Center Core */}
                <circle cx="250" cy="250" r="40" fill="#0B0718" stroke="#6C5CE7" strokeWidth="6" />
                <circle cx="250" cy="250" r="30" fill="#151027" />
                <text x="250" y="250" fill="white" fontSize="24" textAnchor="middle" dominantBaseline="middle">
                  🎡
                </text>
              </svg>
            </motion.div>
          </div>

          <Button
            size="lg"
            onClick={spinWheel}
            disabled={spinning}
            icon={RotateCw}
            className={`w-64 text-xl py-5 shadow-[0_0_30px_rgba(253,121,168,0.4)] ${spinning ? 'opacity-50' : ''}`}
            variant="accent"
          >
            {spinning ? 'Spinning...' : 'SPIN!'}
          </Button>

          {/* Result Overlay */}
          <AnimatePresence>
            {showResult && result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 50 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-[#0B0718]/60 backdrop-blur-sm"
              >
                <Card padding="lg" className="max-w-md w-full text-center border-4" style={{ borderColor: result.color }}>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                    transition={{ repeat: 3, duration: 0.5 }}
                    className="text-7xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <h3 className="font-heading text-4xl font-bold mb-4" style={{ color: result.color, textShadow: `0 0 20px ${result.color}80` }}>
                    {result.label}
                  </h3>
                  <p className="text-dark-muted text-base mb-6 font-medium">Select a team for this challenge:</p>

                  <div className="grid grid-cols-2 gap-3">
                    {teams.map((team) => (
                      <motion.button
                        key={team.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => applyResult(team.id)}
                        className="p-4 rounded-xl bg-[#151027] border border-[#2D2550] hover:border-white/30 transition-all shadow-md flex items-center gap-3"
                      >
                        <span className="text-3xl">{team.emoji}</span>
                        <span className="text-sm font-bold flex-1 text-left truncate" style={{ color: team.color }}>{team.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right Sidebar */}
        <div className="w-[320px] flex flex-col gap-4 flex-shrink-0">
          <Card padding="md" className="flex-1 overflow-hidden flex flex-col">
            <h3 className="font-heading font-bold text-sm text-dark-muted uppercase tracking-wider mb-4">🏆 Current Scores</h3>
            <div className="overflow-y-auto custom-scrollbar pr-2 space-y-2">
              {[...teams].sort((a, b) => b.totalPoints - a.totalPoints).map((team, i) => (
                <div key={team.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#151027] border border-[#2D2550]">
                  <span className="text-lg w-6 text-center">{['🥇', '🥈', '🥉'][i] || `#${i + 1}`}</span>
                  <span className="text-2xl">{team.emoji}</span>
                  <span className="font-bold text-sm flex-1 truncate" style={{ color: team.color }}>{team.name}</span>
                  <span className="font-black text-white">{team.totalPoints}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="md" className="max-h-[300px] overflow-hidden flex flex-col">
            <h3 className="font-heading font-bold text-sm text-dark-muted uppercase tracking-wider mb-4">🎡 Wheel Challenges</h3>
            <div className="overflow-y-auto custom-scrollbar flex flex-wrap gap-2 pr-2">
              {segments.map((seg, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151027] border border-[#2D2550]">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color, boxShadow: `0 0 8px ${seg.color}` }} />
                  <span className="text-xs font-bold text-dark-text truncate">{seg.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
