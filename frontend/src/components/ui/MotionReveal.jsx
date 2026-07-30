import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const presets = {
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  up: {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -28 },
    show: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 28 },
    show: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.94 },
    show: { opacity: 1, scale: 1 },
  },
}

export default function MotionReveal({
  children,
  className,
  delay = 0,
  as = 'div',
  preset = 'up',
  amount = 0.25,
}) {
  const Component = motion[as] || motion.div
  const variants = presets[preset] || presets.up

  return (
    <Component
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
    >
      {children}
    </Component>
  )
}
