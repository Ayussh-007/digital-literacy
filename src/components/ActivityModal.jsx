import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../lib/sounds';
import { X, Plus, Award } from 'lucide-react';

export default function ActivityModal() {
  const {
    showActivityModal, soundEnabled, getTeamsUnsorted,
    addActivity, triggerConfetti, setNotification, addPoints,
  } = useGameStore();

  const [name, setName] = useState('');
  const [points, setPoints] = useState(10);
  const [winningTeamId, setWinningTeamId] = useState('');
  const [notes, setNotes] = useState('');
  const teams = getTeamsUnsorted();

  if (!showActivityModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addActivity({
      name: name.trim(),
      points,
      winningTeamId: winningTeamId || null,
      notes: notes.trim(),
      teamId: winningTeamId || null,
      description: name.trim(),
    });

    if (soundEnabled) soundManager.play('celebration');
    triggerConfetti();

    const team = teams.find((t) => t.id === winningTeamId);
    setNotification({
      emoji: '🎯',
      title: `${name} completed!`,
      subtitle: team ? `Winner: ${team.emoji} ${team.name} (+${points})` : 'Activity recorded!',
    });

    // Reset
    setName('');
    setPoints(10);
    setWinningTeamId('');
    setNotes('');
    useGameStore.setState({ showActivityModal: false });
  };

  const activityPresets = [
    'Password Relay', 'Drawing Competition', 'Treasure Hunt',
    'Computer Parts Race', 'Mime Challenge', 'Puzzle Race',
    'Memory Challenge', 'Digital Bingo', 'Logo Guessing',
    'Coding Cards', 'Role Play', 'Internet Safety Game',
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={() => useGameStore.setState({ showActivityModal: false })}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">🎯</span> Add Activity
            </h2>
            <button
              onClick={() => useGameStore.setState({ showActivityModal: false })}
              className="text-dark-muted hover:text-dark-text transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Preset Activities */}
          <div className="mb-4">
            <label className="text-xs text-dark-muted font-medium mb-2 block">Quick Select</label>
            <div className="flex flex-wrap gap-2">
              {activityPresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setName(preset)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                    name === preset
                      ? 'bg-primary/20 text-primary-light border border-primary/40'
                      : 'bg-white/5 text-dark-muted hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-dark-muted font-medium mb-1 block">Activity Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-game"
                placeholder="Enter activity name..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-dark-muted font-medium mb-1 block">Points</label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  className="input-game"
                  min={0}
                  max={100}
                />
              </div>
              <div>
                <label className="text-sm text-dark-muted font-medium mb-1 block">Winning Team</label>
                <select
                  value={winningTeamId}
                  onChange={(e) => setWinningTeamId(e.target.value)}
                  className="select-game"
                >
                  <option value="">No winner</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-dark-muted font-medium mb-1 block">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-game"
                rows={3}
                placeholder="Any additional notes..."
              />
            </div>

            <button type="submit" className="btn-game btn-primary w-full text-lg py-4">
              <Award size={20} /> Record Activity
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
