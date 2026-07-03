import { motion } from 'framer-motion';

export default function Card({
  children,
  variant = 'primary',
  padding = 'lg',
  className = '',
  hoverEffect = false,
  ...props
}) {
  const baseStyles = "relative overflow-hidden backdrop-blur-xl border transition-all duration-300";
  
  const variants = {
    primary: "bg-[#1E1735]/80 border-[#6C5CE7]/20 shadow-md",
    secondary: "bg-[#151027]/60 border-[#2D2550] shadow-sm",
    important: "bg-[#1E1735]/90 border-[#FD79A8]/50 shadow-glow",
  };

  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const radii = {
    primary: "rounded-[24px]",
    secondary: "rounded-[16px]",
    important: "rounded-[24px]",
  };

  const hoverStyles = hoverEffect 
    ? "hover:-translate-y-2 hover:shadow-lg hover:border-[#6C5CE7]/40" 
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${baseStyles} ${variants[variant]} ${radii[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
