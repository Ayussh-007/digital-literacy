import { motion } from 'framer-motion';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const baseStyles = "btn-game font-heading font-bold transition-all relative overflow-hidden";
  
  const sizeStyles = {
    sm: "!px-4 !py-2 text-sm",
    md: "!px-6 !py-3 text-base",
    lg: "!px-8 !py-4 text-lg",
  };

  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
    accent: "btn-accent",
    success: "btn-success",
    ghost: "bg-transparent border-transparent text-dark-muted hover:text-white hover:bg-white/10 hover:border-white/20 !shadow-none",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={disabled || loading ? {} : { scale: 1.02, y: -2 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
          {children}
        </>
      )}
      {!disabled && !loading && variant !== 'ghost' && variant !== 'secondary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out" />
      )}
    </motion.button>
  );
}
