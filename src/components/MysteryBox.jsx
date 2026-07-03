import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../lib/sounds';
import { MYSTERY_REWARDS } from '../lib/constants';
import { X } from 'lucide-react';

export default function MysteryBox() {
  const {
    showMysteryBox, soundEnabled, getTeamsUnsorted, addPoints,
    addPointsToAll, triggerConfetti, setNotification, awardBadge,
  } = useGameStore();

  const [revealed, setRevealed] = useState(false);
  const [reward, setReward] = useState(null);
  const [opening, setOpening] = useState(false);
  const teams = getTeamsUnsorted();

  if (!showMysteryBox) return null;

  const handleOpen = () => {
    if (opening || revealed) return;
    setOpening(true);
    if (soundEnabled) soundManager.play('spin');

    setTimeout(() => {
      const randomReward = MYSTERY_REWARDS[Math.floor(Math.random() * MYSTERY_REWARDS.length)];
      setReward(randomReward);
      setRevealed(true);
      setOpening(false);
      if (soundEnabled) soundManager.play('celebration');
      triggerConfetti();
    }, 2000);
  };

  const handleApply = (teamId) => {
    if (!reward) return;

    switch (reward.effect.type) {
      case 'everyone':
        addPointsToAll(reward.effect.value, `Mystery Box: ${reward.label}`);
        break;
      case 'everyone_double':
        teams.forEach((t) => {
          addPoints(t.id, t.totalPoints, 'bonus', `Mystery Box: Double Points!`);
        });
        break;
      case 'points':
        if (teamId) {
          addPoints(teamId, reward.effect.value, 'bonus', `Mystery Box: ${reward.label}`);
        }
        break;
      case 'badge':
        if (teamId) {
          awardBadge(teamId, reward.effect.value);
        }
        break;
      case 'random_team':
        const randomTeam = teams[Math.floor(Math.random() * teams.length)];
        addPoints(randomTeam.id, reward.effect.value, 'bonus', `Mystery Box: ${reward.label}`);
        setNotification({
          emoji: '🎲',
          title: `${randomTeam.emoji} ${randomTeam.name} wins!`,
          subtitle: `+${reward.effect.value} points from Mystery Box`,
        });
        break;
      default:
        setNotification({
          emoji: reward.emoji,
          title: reward.label,
          subtitle: 'Teacher decides what happens next!',
        });
        break;
    }

    if (soundEnabled) soundManager.play('bonus');
    handleClose();
  };

  const handleClose = () => {
    useGameStore.setState({ showMysteryBox: false });
    setRevealed(false);
    setReward(null);
    setOpening(false);
  };

  const needsTeam = reward && (reward.effect.type === 'points' || reward.effect.type === 'badge');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="modal-content text-center max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-dark-muted hover:text-dark-text transition-colors"
          >
            <X size={20} />
          </button>

          <h2 className="font-heading text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            📦 Mystery Box
          </h2>

          {!revealed ? (
            <div>
              <motion.button
                onClick={handleOpen}
                disabled={opening}
                whileHover={opening ? {} : { scale: 1.1 }}
                whileTap={opening ? {} : { scale: 0.9 }}
                animate={opening ? {
                  rotate: [0, -5, 5, -5, 5, 0],
                  scale: [1, 1.1, 0.9, 1.1, 0.9, 1],
                } : {
                  y: [0, -8, 0],
                }}
                transition={opening ? {
                  repeat: Infinity, duration: 0.5,
                } : {
                  repeat: Infinity, duration: 2, ease: 'easeInOut',
                }}
                className="text-8xl inline-block cursor-pointer select-none"
              >
                {opening ? '✨' : '📦'}
              </motion.button>
              <p className="text-dark-muted mt-4 text-lg">
                {opening ? 'Opening...' : 'Click to open!'}
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="text-7xl mb-4">{reward.emoji}</div>
              <h3 className="font-heading text-2xl font-bold text-warning mb-2">
                {reward.label}
              </h3>

              {needsTeam ? (
                <div className="mt-6">
                  <p className="text-dark-muted mb-3">Select a team to receive the reward:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {teams.map((team) => (
                      <motion.button
                        key={team.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApply(team.id)}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20 transition-all"
                      >
                        <span className="text-2xl block">{team.emoji}</span>
                        <span className="text-xs" style={{ color: team.color }}>{team.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleApply(null)}
                  className="btn-game btn-primary text-lg px-8 py-4 mt-4"
                >
                  Apply Reward! 🎉
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
