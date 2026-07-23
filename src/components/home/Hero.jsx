import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { FaMapMarkerAlt, FaPhoneAlt, FaCalendarAlt } from 'react-icons/fa'
import heroTurf from '../../assets/hero-turf-real.jpeg'
import { siteInfo } from '../../data/site'
import { scrollToSection } from '../../hooks/useActiveSection'
import Container from '../ui/Container'

const ease = [0.22, 1, 0.36, 1]

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.25,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease },
  },
}

const sports = ['Football', 'Cricket', 'Friends', 'Fitness']

export default function Hero() {
  const sectionRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ['0%', '0%'] : ['0%', '28%'],
  )
  const bgScale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1.05, 1.05] : [1.08, 1.2],
  )
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, 80],
  )
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.65],
    prefersReducedMotion ? [1, 1] : [1, 0],
  )

  return (
    <motion.section
      ref={sectionRef}
      id="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease }}
      className="relative isolate min-h-[100svh] overflow-hidden"
    >
      {/* Parallax + slow floating background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: bgY, scale: bgScale }}
          className="absolute inset-x-0 -top-[12%] h-[124%] w-full will-change-transform"
        >
          <motion.img
            src={heroTurf}
            alt="Shree Turf 360° — Ichalkaranji"
            initial={{ opacity: 0, scale: 1.12 }}
            animate={
              prefersReducedMotion
                ? { opacity: 1, scale: 1.05 }
                : {
                    opacity: 1,
                    scale: [1.08, 1.14, 1.08],
                    x: ['0%', '1.5%', '0%'],
                  }
            }
            transition={
              prefersReducedMotion
                ? { duration: 1.2, ease }
                : {
                    opacity: { duration: 1.4, ease },
                    scale: { duration: 22, repeat: Infinity, ease: 'easeInOut' },
                    x: { duration: 22, repeat: Infinity, ease: 'easeInOut' },
                  }
            }
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-[center_42%] brightness-110 contrast-105 saturate-125 sm:object-[center_28%] md:object-[center_22%]"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-bg/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent sm:from-black/50" />

        {/* Soft animated green glow */}
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
            animate={{ opacity: [0.15, 0.35, 0.15], scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>

      <Container className="relative flex min-h-[100svh] flex-col justify-center py-24 pb-28 sm:py-28 md:py-32 lg:py-36">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full max-w-[34rem] will-change-transform [text-shadow:0_2px_20px_rgba(0,0,0,0.45)]"
        >
          <motion.p
            variants={item}
            className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary sm:text-xs md:text-[13px] md:tracking-[0.28em]"
          >
            Ichalkaranji&apos;s Premier Turf
          </motion.p>

          <motion.p
            variants={item}
            className="mt-2.5 text-[15px] font-semibold leading-snug tracking-wide text-accent sm:mt-3 sm:text-base md:text-lg lg:text-xl"
          >
            {siteInfo.tagline}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-4 font-display text-[2.35rem] font-extrabold uppercase leading-[0.96] tracking-tight text-white sm:mt-5 sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[4.75rem]"
          >
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.7, ease }}
            >
              Play More.
            </motion.span>
            <br />
            <motion.span
              className="inline-block text-primary"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.62, duration: 0.7, ease }}
            >
              Worry Less.
            </motion.span>
          </motion.h1>

          <motion.div variants={item} className="mt-5 space-y-2 sm:mt-6">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] font-medium text-white sm:text-base md:text-lg">
              {sports.map((word, i) => (
                <motion.span
                  key={word}
                  className="inline-flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.45, ease }}
                >
                  {i > 0 && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                  )}
                  {word}.
                </motion.span>
              ))}
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.25, duration: 0.6 }}
              className="text-sm text-muted sm:text-base md:text-lg"
            >
              Book your slot and enjoy the game!
            </motion.p>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <motion.button
              type="button"
              onClick={() => scrollToSection('book-slot')}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      boxShadow: [
                        '0 0 20px rgba(132,211,33,0.25)',
                        '0 0 36px rgba(132,211,33,0.5)',
                        '0 0 20px rgba(132,211,33,0.25)',
                      ],
                    }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
              }
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-[0.06em] text-bg sm:w-auto sm:px-7 sm:text-[15px]"
            >
              <FaCalendarAlt size={15} />
              Book Your Slot
            </motion.button>

            <motion.a
              href={`tel:${siteInfo.phone.replace(/\s/g, '')}`}
              whileHover={{ scale: 1.04, y: -2, borderColor: 'rgba(255,255,255,0.7)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-white/40 bg-black/20 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.06em] text-white backdrop-blur-sm transition hover:bg-white/10 sm:w-auto sm:bg-transparent sm:px-7 sm:text-[15px] sm:backdrop-blur-none"
            >
              <FaPhoneAlt size={14} />
              Call Now
            </motion.a>
          </motion.div>

          <motion.div
            variants={item}
            animate={
              prefersReducedMotion
                ? undefined
                : { y: [0, -5, 0] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }
            }
            className="mt-6 inline-flex max-w-[calc(100%-4.5rem)] items-center gap-2.5 rounded-full border border-white/15 bg-card/75 px-4 py-2.5 backdrop-blur-md sm:mt-8 sm:max-w-full"
          >
            <motion.span
              animate={
                prefersReducedMotion
                  ? undefined
                  : { scale: [1, 1.15, 1] }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }
              className="shrink-0 text-primary"
            >
              <FaMapMarkerAlt size={14} />
            </motion.span>
            <span className="truncate text-xs font-medium text-white sm:text-sm">
              Ichalkaranji, Kolhapur, Maharashtra
            </span>
          </motion.div>
        </motion.div>
      </Container>
    </motion.section>
  )
}
