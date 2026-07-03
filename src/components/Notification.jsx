import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { X } from 'lucide-react';

export default function Notification() {
  const notification = useGameStore((s) => s.notification);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -60, scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed left-1/2 -translate-x-1/2"
          style={{ zIndex: 200, top: '28px' }}
        >
          <div
            className="flex items-center gap-5 shadow-2xl"
            style={{
              padding: '20px 32px',
              borderRadius: '24px',
              background: 'rgba(30, 23, 53, 0.85)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(108, 92, 231, 0.25)',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(108, 92, 231, 0.1)',
            }}
          >
            <span className="text-3xl">{notification.emoji || '✨'}</span>
            <div>
              <p className="font-heading font-bold text-lg text-dark-text">{notification.title}</p>
              {notification.subtitle && (
                <p className="text-dark-muted text-sm mt-0.5">{notification.subtitle}</p>
              )}
            </div>
            <button
              onClick={() => useGameStore.setState({ notification: null })}
              className="ml-4 text-dark-muted hover:text-dark-text transition-colors p-2 rounded-xl hover:bg-white/5"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
