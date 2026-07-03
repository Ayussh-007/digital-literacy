import { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import FloatingBackground from './components/FloatingBackground';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import QuizModule from './components/QuizModule';
import WheelOfFortune from './components/WheelOfFortune';
import Leaderboard from './components/Leaderboard';
import ProgressMap from './components/ProgressMap';
import Statistics from './components/Statistics';
import AdminPanel from './components/AdminPanel';
import ConfettiEffect from './components/ConfettiEffect';
import Notification from './components/Notification';
import ActivityModal from './components/ActivityModal';
import MysteryBox from './components/MysteryBox';
import ShortcutsHelp from './components/ShortcutsHelp';
import { AnimatePresence, motion } from 'framer-motion';

const viewComponents = {
  dashboard: Dashboard,
  quiz: QuizModule,
  wheel: WheelOfFortune,
  leaderboard: Leaderboard,
  map: ProgressMap,
  stats: Statistics,
  admin: AdminPanel,
};

export default function App() {
  const { currentView, initialize, isPaused } = useGameStore();

  useEffect(() => {
    initialize();
  }, []);

  useKeyboardShortcuts();

  const ViewComponent = viewComponents[currentView] || Dashboard;

  return (
    <div className="min-h-screen gradient-mesh">
      <FloatingBackground />
      <Sidebar />

      {/* Main Content - generous padding, offset for wider sidebar */}
      <main
        className="relative min-h-screen"
        style={{ marginLeft: 'clamp(240px, 18vw, 320px)', padding: '24px 32px', zIndex: 10 }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ViewComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Global Overlays */}
      <ConfettiEffect />
      <Notification />
      <ActivityModal />
      <MysteryBox />
      <ShortcutsHelp />

      {/* Pause Overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: 300, background: 'rgba(11, 7, 24, 0.92)', backdropFilter: 'blur(12px)' }}
            onClick={() => useGameStore.setState({ isPaused: false })}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-8xl mb-8"
              >
                ⏸️
              </motion.div>
              <h2 className="font-heading text-5xl font-bold text-dark-text mb-4">Game Paused</h2>
              <p className="text-dark-muted text-lg">
                Press <kbd className="px-4 py-2 rounded-xl bg-dark-card border border-dark-border font-mono text-primary-light text-base">Esc</kbd> or click anywhere to resume
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
