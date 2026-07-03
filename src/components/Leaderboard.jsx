import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Star, ArrowLeft, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export default function Leaderboard() {
  const { getTeams, getActiveClass, setView } = useGameStore();
  const teams = getTeams();
  const activeClass = getActiveClass();

  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.3 },
      colors: ['#6C5CE7', '#A29BFE', '#00CEC9', '#FD79A8', '#FDCB6E'],
    });
  }, []);

  const medals = ['🥇', '🥈', '🥉'];
  const podiumOrder = [1, 0, 2];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <button onClick={() => setView('dashboard')} className="flex items-center gap-3 text-dark-muted hover:text-dark-text transition-colors font-medium">
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-heading text-5xl font-bold bg-gradient-to-r from-warning via-accent to-primary bg-clip-text text-transparent">
          🏆 Leaderboard
        </h1>
        <p className="text-dark-muted mt-3 text-lg">{activeClass?.name}</p>
      </motion.div>

      {/* Podium */}
      {teams.length > 0 && (
        <div className="flex items-end justify-center gap-6" style={{ paddingTop: '32px' }}>
          {podiumOrder.map((rank) => {
            const team = teams[rank];
            if (!team) return null;
            const heights = [300, 240, 190];
            const podiumH = heights[rank];
            const avatarSizes = [96, 80, 72];
            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rank * 0.2, type: 'spring', stiffness: 200 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={rank === 0 ? { y: [0, -12, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="mb-4"
                >
                  <div
                    className="rounded-3xl flex items-center justify-center shadow-2xl"
                    style={{
                      width: `${avatarSizes[rank]}px`,
                      height: `${avatarSizes[rank]}px`,
                      background: `linear-gradient(135deg, ${team.color}30, ${team.color}10)`,
                      border: `3px solid ${team.color}50`,
                      fontSize: rank === 0 ? '3rem' : '2.5rem',
                      boxShadow: rank === 0 ? `0 0 40px ${team.color}30` : `0 8px 24px rgba(0,0,0,0.2)`,
                    }}
                  >
                    {team.emoji}
                  </div>
                </motion.div>
                <span className="text-4xl mb-2">{medals[rank]}</span>
                <p className="font-heading font-bold text-xl" style={{ color: team.color }}>{team.name}</p>
                <motion.p
                  key={team.totalPoints}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="font-heading font-black text-4xl mt-1"
                  style={{ color: team.color, textShadow: `0 0 24px ${team.color}30` }}
                >
                  {team.totalPoints}
                </motion.p>
                <p className="text-xs text-dark-muted mt-1 font-medium">points</p>

                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: podiumH }}
                  transition={{ delay: 0.5 + rank * 0.15, duration: 0.8, ease: 'easeOut' }}
                  className="rounded-t-3xl mt-4 flex items-end justify-center pb-6"
                  style={{
                    width: rank === 0 ? '160px' : '140px',
                    background: `linear-gradient(180deg, ${team.color}30, ${team.color}08)`,
                    borderTop: `3px solid ${team.color}60`,
                  }}
                >
                  <span className="font-heading font-bold text-6xl" style={{ opacity: 0.12 }}>{rank + 1}</span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full Rankings */}
      <div className="glass-card" style={{ padding: '36px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h3 className="font-heading font-bold text-xl mb-6 flex items-center gap-3">
          <Star size={22} className="text-warning" /> Full Rankings
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {teams.map((team, i) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              layout
              className={`leaderboard-row ${
                i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''
              }`}
              style={i >= 3 ? { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' } : {}}
            >
              <span className="text-2xl" style={{ width: '40px', textAlign: 'center' }}>
                {i < 3 ? medals[i] : `#${i + 1}`}
              </span>
              <span className="text-3xl">{team.emoji}</span>
              <div className="flex-1">
                <p className="font-heading font-bold text-base" style={{ color: team.color }}>{team.name}</p>
                <div className="flex gap-4 text-xs text-dark-muted mt-1">
                  <span>Quiz: {team.quizPoints || 0}</span>
                  <span>Bonus: {team.bonusPoints || 0}</span>
                  <span>Activity: {team.activityPoints || 0}</span>
                </div>
              </div>
              {/* Progress Bar */}
              <div style={{ width: '140px' }}>
                <div className="w-full rounded-full overflow-hidden" style={{ height: '8px', background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${team.color}, ${team.color}88)` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${teams[0]?.totalPoints ? (team.totalPoints / teams[0].totalPoints) * 100 : 0}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  />
                </div>
              </div>
              <motion.span
                key={team.totalPoints}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="font-heading font-black text-2xl"
                style={{ color: team.color, width: '80px', textAlign: 'right' }}
              >
                {team.totalPoints}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
