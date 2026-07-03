import { motion } from 'framer-motion';

export default function Table({
  columns,
  data,
  keyExtractor,
  renderRow,
  className = '',
}) {
  return (
    <div className={`overflow-x-auto rounded-[16px] border border-[#2D2550] bg-[#151027]/40 ${className}`}>
      <table className="w-full text-sm text-left">
        <thead className="bg-[#1E1735] text-dark-muted font-heading uppercase text-xs sticky top-0 z-10 shadow-sm border-b border-[#2D2550]">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`px-6 py-4 font-bold tracking-wider ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2D2550]">
          {data.map((item, index) => (
            <motion.tr
              key={keyExtractor(item)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-white/5 transition-colors group"
            >
              {renderRow(item, index)}
            </motion.tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-dark-muted">
                <div className="flex flex-col items-center justify-center gap-3">
                  <span className="text-4xl opacity-50">📭</span>
                  <p>No data available</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
