import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { FaPhoneAlt, FaCalendarAlt } from 'react-icons/fa'
import heroTurf from '../../assets/hero-turf-real.jpeg'
import { siteInfo } from '../../data/site'
import { scrollToSection } from '../../hooks/useActiveSection'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import Container from '../ui/Container'

const ease = [0.22, 1, 0.36, 1]

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 24, filter: 'blur(5px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease },
  },
}

export default function Hero() {
  const sectionRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const isMobile = useMediaQuery('(max-width: 767px)')

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion || isMobile ? ['0%', '0%'] : ['0%', '18%'],
  )
  const bgScale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion || isMobile ? [1, 1] : [1.05, 1.12],
  )
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, 60],
  )
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.7],
    prefersReducedMotion ? [1, 1] : [1, 0],
  )

  return (
    <motion.section
      ref={sectionRef}
      id="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.85, ease }}
      className="relative isolate min-h-[100svh] overflow-hidden bg-bg"
    >
      {/* True full-bleed background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          style={{ y: bgY, scale: bgScale }}
          className="absolute inset-0 will-change-transform"
        >
          {/* Mobile edge fill — covers letterbox so zoom-out never shows black bars */}
          <img
            src={heroTurf}
            alt=""
            aria-hidden
            decoding="async"
            className="absolute inset-0 h-full w-full scale-110 object-cover object-[center_45%] brightness-110 contrast-105 saturate-125 blur-[2px] md:hidden"
          />
          {/* Mobile: object-contain so full “SHREE TURF 360” fits; desktop stays cover */}
          <img
            src={heroTurf}
            alt=""
            aria-hidden
            fetchPriority="high"
            decoding="async"
            className="relative h-full min-h-full w-full min-w-full object-contain object-center brightness-110 contrast-105 saturate-125 md:object-cover md:object-[center_40%]"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/10 sm:from-black/60 sm:via-black/25 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>

      <Container className="relative flex min-h-[100svh] flex-col justify-center py-28 pt-44 sm:py-32 sm:pt-52 md:py-36 md:pt-56">
        {/* Headline — upper right */}
        <motion.h1
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease }}
          className="pointer-events-none absolute right-4 top-20 z-10 max-w-[min(100%,18rem)] text-right font-display text-[1.85rem] font-extrabold uppercase leading-[0.95] tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.55)] sm:right-5 sm:top-24 sm:max-w-[22rem] sm:text-4xl md:right-6 md:top-28 md:max-w-[28rem] md:text-5xl lg:right-8 lg:top-32 lg:text-[3.5rem] xl:right-10 xl:text-[4rem]"
        >
          <span className="block">Play More.</span>
          <span className="block text-primary">Worry Less.</span>
        </motion.h1>

        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-[470px] w-full max-w-xl text-center will-change-transform [text-shadow:0_2px_18px_rgba(0,0,0,0.45)] md:mt-[138px] md:text-left"
        >
          <motion.p
            variants={item}
            className="text-[11.3px] font-bold uppercase tracking-[0.22em] text-white sm:text-[12.4px] md:text-[13.4px] md:tracking-[0.28em]"
          >
            Ichalkaranji&apos;s Premier Turf
          </motion.p>

          <motion.p
            variants={item}
            className="mt-2.5 text-[15.5px] font-semibold leading-snug tracking-wide text-primary sm:mt-3 sm:text-[16.5px] md:text-[18.5px] lg:text-[20.6px]"
          >
            {siteInfo.tagline}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-7 flex w-full flex-col items-center gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 md:items-start md:justify-start"
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
              whileHover={{
                scale: 1.04,
                y: -2,
                borderColor: 'rgba(255,255,255,0.7)',
              }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-white/45 bg-black/20 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.06em] text-white backdrop-blur-sm transition hover:bg-white/10 sm:w-auto sm:bg-transparent sm:px-7 sm:text-[15px] sm:backdrop-blur-none"
            >
              <FaPhoneAlt size={14} />
              Call Now
            </motion.a>
          </motion.div>
        </motion.div>
      </Container>
    </motion.section>
  )
}
