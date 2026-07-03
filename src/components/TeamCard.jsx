import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../lib/sounds';
import { POWER_UPS } from '../lib/constants';

export default function TeamCard({ team, rank, compact = false }) {
  const { selectedTeamId, selectTeam, soundEnabled, addPoints, triggerConfetti, setNotification } = useGameStore();
  const isSelected = selectedTeamId === team.id;

  const handleSelect = () => {
    selectTeam(isSelected ? null : team.id);
    if (soundEnabled) soundManager.play('click');
  };

  const handleQuickScore = (e, pts) => {
    e.stopPropagation();
    addPoints(team.id, pts, pts > 0 ? 'bonus' : 'penalty', pts > 0 ? 'Quick +4' : 'Quick -1');
    if (soundEnabled) soundManager.play(pts > 0 ? 'correct' : 'wrong');
    if (pts > 0) triggerConfetti();
    setNotification({
      emoji: pts > 0 ? '✅' : '❌',
      title: `${team.emoji} ${team.name}: ${pts > 0 ? '+' : ''}${pts}`,
    });
  };

  const activePowerUps = team.powerUps || [];
  const medals = ['🥇', '🥈', '🥉'];

  if (compact) {
    return (
      <motion.button
        onClick={handleSelect}
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
        layout
        className="w-full flex items-center gap-4 text-left cursor-pointer rounded-2xl transition-all duration-300"
        style={{
          padding: '14px 18px',
          background: isSelected ? `${team.color}12` : 'rgba(255, 255, 255, 0.03)',
          border: `1px solid ${isSelected ? team.color + '40' : 'transparent'}`,
        }}
      >
        {rank !== undefined && rank < 3 && (
          <span className="text-xl">{medals[rank]}</span>
        )}
        {rank !== undefined && rank >= 3 && (
          <span className="text-sm text-dark-muted font-bold" style={{ width: '28px', textAlign: 'center' }}>#{rank + 1}</span>
        )}
        <span className="text-2xl">{team.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-sm truncate" style={{ color: team.color }}>
            {team.name}
          </p>
        </div>
        <motion.span
          key={team.totalPoints}
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
          className="font-heading font-bold text-lg"
          style={{ color: team.color }}
        >
          {team.totalPoints}
        </motion.span>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleSelect}
      whileHover={{ scale: 1.03, y: -6 }}
      whileTap={{ scale: 0.97 }}
      layout
      className={`team-card w-full text-left cursor-pointer ${isSelected ? 'selected' : ''}`}
      style={{
        borderColor: isSelected ? team.color : 'transparent',
        borderImage: isSelected ? 'none' : undefined,
      }}
    >
      {/* Gradient color bar */}
      <div
        className="absolute top-0 left-0 right-0 rounded-t-3xl"
        style={{ height: '4px', background: `linear-gradient(90deg, ${team.color}, ${team.color}88)` }}
      />

      {/* Rank badge */}
      {rank !== undefined && rank < 3 && (
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, delay: 0.2 }}
          className="absolute -top-3 -right-2 text-2xl"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
        >
          {medals[rank]}
        </motion.div>
      )}

      {/* Mascot + Name */}
      <div className="flex items-center gap-4 mb-5">
        <motion.div
          className="flex items-center justify-center rounded-2xl"
          style={{
            width: '56px', height: '56px',
            background: `linear-gradient(135deg, ${team.color}20, ${team.color}08)`,
            border: `1px solid ${team.color}25`,
          }}
          animate={isSelected ? { rotate: [0, -8, 8, 0] } : {}}
          transition={{ repeat: isSelected ? Infinity : 0, duration: 1.5 }}
        >
          <span className="text-3xl">{team.emoji}</span>
        </motion.div>
        <div>
          <h3 className="font-heading font-bold text-lg" style={{ color: team.color }}>
            {team.name}
          </h3>
          {rank !== undefined && <p className="text-xs text-dark-muted mt-0.5">Rank #{rank + 1}</p>}
        </div>
      </div>

      {/* Score */}
      <div className="text-center mb-5">
        <motion.div
          key={team.totalPoints}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="font-heading font-black text-5xl"
          style={{ color: team.color, textShadow: `0 0 32px ${team.color}30` }}
        >
          {team.totalPoints}
        </motion.div>
        <p className="text-xs text-dark-muted mt-2 uppercase tracking-wider font-medium">Total Points</p>
      </div>

      {/* Quick Score Buttons */}
      <div className="flex gap-3 mb-5">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={(e) => handleQuickScore(e, 4)}
          className="flex-1 py-3 rounded-xl font-heading font-bold text-sm transition-all"
          style={{
            background: 'rgba(0, 184, 148, 0.12)',
            border: '1px solid rgba(0, 184, 148, 0.25)',
            color: '#55EFC4',
          }}
        >
          +4
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={(e) => handleQuickScore(e, -1)}
          className="flex-1 py-3 rounded-xl font-heading font-bold text-sm transition-all"
          style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.2)',
            color: '#FF6B6B',
          }}
        >
          −1
        </motion.button>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Quiz', value: team.quizPoints || 0, color: '#74B9FF' },
          { label: 'Bonus', value: team.bonusPoints || 0, color: '#55EFC4' },
          { label: 'Activity', value: team.activityPoints || 0, color: '#FD79A8' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="text-center py-2.5 rounded-xl"
            style={{ background: 'rgba(255, 255, 255, 0.03)' }}
          >
            <p className="text-xs text-dark-muted mb-0.5">{stat.label}</p>
            <p className="font-bold text-sm" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Power-ups */}
      {activePowerUps.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {activePowerUps.map((puId, i) => {
            const pu = POWER_UPS.find((p) => p.id === puId);
            return (
              <span
                key={`${puId}-${i}`}
                className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(108, 92, 231, 0.15)', border: '1px solid rgba(108, 92, 231, 0.25)' }}
              >
                <span>{pu?.emoji || '⚡'}</span>
                <span className="text-primary-light font-medium">{pu?.name || puId}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Selection glow */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            boxShadow: `0 0 48px ${team.color}25, inset 0 0 48px ${team.color}08`,
          }}
        />
      )}
    </motion.button>
  );
}
