import { motion } from 'framer-motion';

export default function StatCard({
  label,
  value,
  emoji,
  color,
  trend,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 25 }}
      className="relative overflow-hidden rounded-[24px] bg-[#1E1735]/80 backdrop-blur-xl border border-[#2D2550] p-6 hover:-translate-y-2 transition-transform duration-300"
      style={{
        boxShadow: `0 8px 32px ${color}15`,
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" style={{ background: color }} />
      
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-[16px] flex items-center justify-center text-2xl"
          style={{ background: `${color}20`, border: `1px solid ${color}40` }}
        >
          {emoji}
        </div>
        {trend && (
          <div className={`px-2 py-1 rounded-full text-xs font-bold ${trend > 0 ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-dark-muted font-medium mb-1">{label}</p>
        <motion.p
          key={value}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-heading font-black text-4xl"
          style={{ color }}
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  );
}
