import { cn } from '../../utils/cn'

const variants = {
  primary:
    'bg-primary text-bg hover:bg-primary/90 btn-glow',
  secondary:
    'bg-transparent text-text border border-primary hover:bg-primary/10',
  ghost: 'bg-transparent text-muted hover:text-text',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm md:text-base',
  lg: 'px-8 py-3.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  href,
  type = 'button',
  ...props
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-300 rounded-full',
    'hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    className,
  )

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
