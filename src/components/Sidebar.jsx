import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import {
  LayoutDashboard, HelpCircle, Dices, Trophy, Map, BarChart3,
  Settings, Volume2, VolumeX, Keyboard, ChevronDown, Plus, Menu, X
} from 'lucide-react';
import { soundManager } from '../lib/sounds';
import { useState } from 'react';
import Button from './ui/Button';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, emoji: '🏠' },
  { id: 'quiz', label: 'Quiz', icon: HelpCircle, emoji: '❓' },
  { id: 'wheel', label: 'Wheel', icon: Dices, emoji: '🎡' },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, emoji: '🏆' },
  { id: 'map', label: 'Progress Map', icon: Map, emoji: '🗺️' },
  { id: 'stats', label: 'Statistics', icon: BarChart3, emoji: '📊' },
  { id: 'admin', label: 'Admin', icon: Settings, emoji: '⚙️' },
];

export default function Sidebar() {
  const { currentView, setView, classes, activeClassId, setActiveClass, addClass, soundEnabled, toggleSound } = useGameStore();
  const [collapsed, setCollapsed] = useState(false);
  const activeClass = classes.find((c) => c.id === activeClassId);

  const handleNav = (id) => {
    if (soundEnabled) soundManager.play('click');
    setView(id);
  };

  const handleAddClass = () => {
    const name = prompt('Enter class name (e.g., Grade 2B):');
    if (name?.trim()) {
      addClass(name.trim());
      if (soundEnabled) soundManager.play('bonus');
    }
  };

  return (
    <motion.aside
      initial={{ x: '-100%' }}
      animate={{ x: 0, width: collapsed ? 80 : '18vw' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-[#0B0718] border-r border-[#2D2550] shadow-[4px_0_24px_rgba(0,0,0,0.2)] min-w-[240px] max-w-[320px]"
    >
      {/* Header */}
      <div className={`px-6 pt-8 pb-6 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="text-3xl">
              🎮
            </motion.div>
            <div>
              <h1 className="font-heading font-bold text-lg bg-gradient-to-r from-[#A29BFE] to-[#55EFC4] bg-clip-text text-transparent leading-tight">
                Digital Hero
              </h1>
              <p className="text-[11px] text-dark-muted font-bold tracking-widest uppercase mt-0.5">Adventure</p>
            </div>
          </div>
        )}
        {collapsed && <div className="text-3xl">🎮</div>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-xl text-dark-muted hover:text-white hover:bg-white/10 transition-colors ${collapsed ? 'mt-4' : ''}`}
        >
          {collapsed ? <Menu size={20} /> : <ChevronDown size={20} className="rotate-90" />}
        </button>
      </div>

      {!collapsed && (
        <div className="px-6 pb-4">
          <label className="text-[11px] text-dark-muted font-bold uppercase tracking-wider mb-2 block px-1">
            Active Class
          </label>
          <div className="relative">
            <select
              value={activeClassId || ''}
              onChange={(e) => setActiveClass(e.target.value)}
              className="w-full bg-[#151027] border border-[#2D2550] rounded-xl px-4 py-3 text-sm font-medium text-white appearance-none outline-none focus:border-[#6C5CE7] transition-colors"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-muted pointer-events-none" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNav(item.id)}
              whileHover={!isActive ? { x: collapsed ? 0 : 4, backgroundColor: 'rgba(255,255,255,0.05)' } : {}}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-4 px-4'} py-3 rounded-2xl text-left transition-all duration-150 relative group overflow-hidden`}
              style={isActive ? {
                background: 'linear-gradient(90deg, rgba(108, 92, 231, 0.15), transparent)',
              } : {}}
            >
              {isActive && (
                <motion.div layoutId="active-nav-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#A29BFE] rounded-r-full shadow-[0_0_12px_#A29BFE]" />
              )}
              <div
                className={`flex items-center justify-center rounded-xl transition-all duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                style={{
                  width: '40px', height: '40px',
                  background: isActive ? 'linear-gradient(135deg, rgba(108, 92, 231, 0.4), rgba(162, 155, 254, 0.2))' : 'rgba(255, 255, 255, 0.04)',
                  boxShadow: isActive ? '0 0 16px rgba(108, 92, 231, 0.3)' : 'none',
                }}
              >
                <span className="text-xl">{item.emoji}</span>
              </div>
              {!collapsed && (
                <span className={`font-heading font-bold text-[16px] transition-colors ${isActive ? 'text-white' : 'text-dark-muted group-hover:text-white'}`}>
                  {item.label}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer Settings */}
      <div className="p-6">
        <div className={`bg-[#151027] rounded-[16px] border border-[#2D2550] flex ${collapsed ? 'flex-col p-2 gap-2' : 'items-center justify-between p-4'}`}>
          <button
            onClick={() => { toggleSound(); soundManager.setEnabled(!soundEnabled); }}
            className="p-2 rounded-xl text-dark-muted hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center w-full"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          {!collapsed && <div className="w-px h-6 bg-[#2D2550]" />}
          <button
            onClick={() => useGameStore.setState({ showShortcutsHelp: true })}
            className="p-2 rounded-xl text-dark-muted hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center w-full"
            title="Keyboard Shortcuts"
          >
            <Keyboard size={18} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
