import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../lib/sounds';
import { BONUS_BUTTONS } from '../lib/constants';
import TeamCard from './TeamCard';
import TimerWidget from './TimerWidget';
import {
  Sparkles, HelpCircle, Dices, Gift, Zap, Trophy,
  TrendingUp, Target, Star,
} from 'lucide-react';

const quickActions = [
  { id: 'quiz', label: 'Start Quiz', emoji: '❓', color: '#6C5CE7', bgFrom: '#6C5CE7', bgTo: '#A29BFE' },
  { id: 'wheel', label: 'Spin Wheel', emoji: '🎡', color: '#FD79A8', bgFrom: '#FD79A8', bgTo: '#E84393' },
  { id: 'mystery', label: 'Mystery Box', emoji: '📦', color: '#00CEC9', bgFrom: '#00CEC9', bgTo: '#55EFC4' },
  { id: 'bonus', label: 'Quick Bonus', emoji: '⚡', color: '#FDCB6E', bgFrom: '#FDCB6E', bgTo: '#F9CA24' },
];

export default function Dashboard() {
  const {
    getActiveClass, getTeams, setView, soundEnabled, selectedTeamId,
    addPoints, currentRound, currentMission, showBonusPanel, triggerConfetti,
    setNotification,
  } = useGameStore();

  const activeClass = getActiveClass();
  const teams = getTeams();

  if (!activeClass) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '80vh' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-card"
          style={{ padding: '64px 80px' }}
        >
          <motion.span
            className="text-7xl block mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            🎮
          </motion.span>
          <h2 className="font-heading text-3xl font-bold text-dark-text mb-3">
            Welcome to Digital Literacy Adventure!
          </h2>
          <p className="text-dark-muted mb-8 text-lg">Create your first class to get started.</p>
          <button
            onClick={() => setView('admin')}
            className="btn-game btn-primary text-lg px-10 py-5"
          >
            <Sparkles size={22} /> Get Started
          </button>
        </motion.div>
      </div>
    );
  }

  const handleQuickAction = (actionId) => {
    if (soundEnabled) soundManager.play('click');
    switch (actionId) {
      case 'quiz': setView('quiz'); break;
      case 'wheel': setView('wheel'); break;
      case 'mystery': useGameStore.setState({ showMysteryBox: true }); break;
      case 'bonus': useGameStore.setState({ showBonusPanel: true }); break;
    }
  };

  const handleBonusClick = (bonus) => {
    if (!selectedTeamId) {
      setNotification({ emoji: '👆', title: 'Select a team first!', subtitle: 'Click on a team card, then award the bonus.' });
      return;
    }
    addPoints(selectedTeamId, bonus.points, 'bonus', bonus.label);
    if (soundEnabled) soundManager.play('bonus');
    triggerConfetti();
    const team = teams.find((t) => t.id === selectedTeamId);
    setNotification({
      emoji: bonus.emoji,
      title: `${bonus.label} +${bonus.points}`,
      subtitle: `Awarded to ${team?.emoji} ${team?.name}`,
    });
  };

  const topTeam = teams[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-heading text-4xl font-bold bg-gradient-to-r from-primary-light via-secondary to-accent bg-clip-text text-transparent">
            {activeClass.name}
          </h1>
          <div className="flex items-center gap-5 mt-2">
            <span className="text-sm text-dark-muted flex items-center gap-2">
              <Target size={15} className="text-primary-light" /> Mission: {currentMission}
            </span>
            <span className="text-sm text-dark-muted flex items-center gap-2">
              <Star size={15} className="text-warning" /> Round {currentRound}
            </span>
          </div>
        </div>
        {topTeam && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 px-6 py-4 rounded-2xl"
            style={{
              background: 'rgba(253, 203, 110, 0.06)',
              border: '1px solid rgba(253, 203, 110, 0.15)',
            }}
          >
            <Trophy size={22} className="text-warning" />
            <div>
              <p className="text-xs text-dark-muted font-medium uppercase tracking-wider">Leading</p>
              <p className="font-heading font-bold text-base" style={{ color: topTeam.color }}>
                {topTeam.emoji} {topTeam.name} · {topTeam.totalPoints} pts
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ── Quick Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-5"
      >
        {quickActions.map((action, i) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            whileHover={{ scale: 1.05, y: -6 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickAction(action.id)}
            className="relative overflow-hidden rounded-3xl text-white"
            style={{
              padding: '28px 20px',
              background: `linear-gradient(135deg, ${action.bgFrom}, ${action.bgTo})`,
              boxShadow: `0 8px 32px ${action.color}30`,
            }}
          >
            <div className="relative z-10 flex flex-col items-center gap-3">
              <span className="text-4xl">{action.emoji}</span>
              <span className="font-heading font-bold text-base">{action.label}</span>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* ── Main Grid: Teams (70%) + Timer/Sidebar (30%) ── */}
      <div className="grid grid-cols-12 gap-8">
        {/* Teams */}
        <div className="col-span-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold text-dark-text flex items-center gap-3">
              <span>👥</span> Teams
            </h2>
            <p className="text-sm text-dark-muted">
              Click to select · Press 1-5
            </p>
          </div>
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {teams.map((team, i) => (
              <motion.div
                key={team.id}
                variants={{
                  hidden: { opacity: 0, y: 24, scale: 0.94 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
              >
                <TeamCard team={team} rank={i} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right sidebar */}
        <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <TimerWidget />

          {/* Leaderboard Card */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 className="font-heading font-bold text-lg mb-5 flex items-center gap-3">
              <Trophy size={20} className="text-warning" /> Leaderboard
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {teams.slice(0, 5).map((team, i) => (
                <TeamCard key={team.id} team={team} rank={i} compact />
              ))}
            </div>
            <button
              onClick={() => setView('leaderboard')}
              className="w-full mt-5 text-sm text-primary-light hover:text-primary font-semibold transition-colors py-3 rounded-xl hover:bg-primary/10"
            >
              View Full Leaderboard →
            </button>
          </div>

          {/* Recent Activity */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 className="font-heading font-bold text-lg mb-5 flex items-center gap-3">
              <TrendingUp size={20} className="text-secondary" /> Recent Events
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '220px', overflowY: 'auto' }}>
              {activeClass.history.length === 0 ? (
                <p className="text-sm text-dark-muted text-center py-6">No events yet. Start a quiz or give bonuses!</p>
              ) : (
                activeClass.history.slice(0, 8).map((event) => {
                  const team = activeClass.teams.find((t) => t.id === event.teamId);
                  return (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 text-sm rounded-xl transition-colors hover:bg-white/4"
                      style={{ padding: '10px 12px' }}
                    >
                      <span className="text-lg">{team?.emoji || '🎯'}</span>
                      <span className="text-dark-muted flex-1 truncate">{event.description}</span>
                      <span
                        className="font-bold font-heading"
                        style={{ color: event.points >= 0 ? '#55EFC4' : '#FF6B6B' }}
                      >
                        {event.points >= 0 ? '+' : ''}{event.points}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bonus Panel ── */}
      {showBonusPanel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ padding: '32px' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-xl flex items-center gap-3">
              <Zap size={22} className="text-warning" /> Quick Bonus Awards
            </h3>
            <button
              onClick={() => useGameStore.setState({ showBonusPanel: false })}
              className="text-dark-muted hover:text-dark-text text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/5 transition-all"
            >
              Close ✕
            </button>
          </div>
          {!selectedTeamId && (
            <p className="text-sm text-warning bg-warning/8 border border-warning/15 rounded-2xl px-5 py-3 mb-6">
              👆 Select a team first, then click a bonus to award it!
            </p>
          )}
          <div className="grid grid-cols-5 lg:grid-cols-10 gap-4">
            {BONUS_BUTTONS.map((bonus) => (
              <motion.button
                key={bonus.id}
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleBonusClick(bonus)}
                className="bonus-btn"
              >
                <span className="emoji">{bonus.emoji}</span>
                <span className="leading-tight text-center" style={{ fontSize: '11px' }}>{bonus.label}</span>
                <span className="points">+{bonus.points}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
