import { motion } from 'framer-motion';

export default function Card({
  children,
  variant = 'primary',
  padding = 'lg',
  className = '',
  hoverEffect = false,
  ...props
}) {
  const baseStyles = "relative overflow-hidden transition-all duration-300";
  
  const variants = {
    primary: "glass-card",
    secondary: "glass-card-light opacity-80",
    important: "glass-card border-[rgba(253,121,168,0.4)] shadow-[0_0_32px_rgba(253,121,168,0.4)]",
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
