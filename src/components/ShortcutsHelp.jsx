import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { KEYBOARD_SHORTCUTS } from '../lib/constants';
import { X, Keyboard } from 'lucide-react';

export default function ShortcutsHelp() {
  const showShortcutsHelp = useGameStore((s) => s.showShortcutsHelp);

  if (!showShortcutsHelp) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={() => useGameStore.setState({ showShortcutsHelp: false })}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="modal-content max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
              <Keyboard size={24} className="text-primary-light" /> Keyboard Shortcuts
            </h2>
            <button
              onClick={() => useGameStore.setState({ showShortcutsHelp: false })}
              className="text-dark-muted hover:text-dark-text transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-2">
            {Object.entries(KEYBOARD_SHORTCUTS).map(([key, shortcut]) => (
              <div
                key={key}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5"
              >
                <kbd className="inline-flex items-center justify-center min-w-[40px] h-8 px-3 rounded-lg bg-dark-surface border border-dark-border font-mono text-sm text-primary-light font-bold">
                  {shortcut.label}
                </kbd>
                <span className="text-sm text-dark-text">{shortcut.desc}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-xs text-primary-light">
              💡 Shortcuts only work when not typing in an input field. Select a team first (1-5) before using C/W keys.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
