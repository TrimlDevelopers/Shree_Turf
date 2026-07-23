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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '0%'],
  )
  const bgScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1],
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
      className="relative isolate aspect-[1077/1753] w-full overflow-hidden bg-bg md:aspect-auto md:min-h-[100svh]"
    >
      {/* Mobile logo — header stays hidden until Gallery */}
      <img
        src="/turflogo.jpeg"
        alt={siteInfo.name}
        className="absolute left-4 top-3.5 z-20 h-11 w-11 rounded-full object-cover shadow-[0_0_24px_rgb(132_211_33_/_0.18)] sm:left-5 sm:top-4 sm:h-14 sm:w-14 md:hidden"
      />

      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          style={{ y: bgY, scale: bgScale }}
          className="absolute inset-0 will-change-transform"
        >
          {/* Mobile: aspect matches photo → full “SHREE TURF 360” */}
          <img
            src={heroTurf}
            alt=""
            aria-hidden
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full max-h-none w-full max-w-none translate-x-[7px] scale-[1.12] object-cover object-center brightness-110 contrast-105 saturate-125 md:hidden"
          />
          {/* Desktop: full-bleed cover */}
          <img
            src={heroTurf}
            alt=""
            aria-hidden
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 hidden h-full max-h-none w-full max-w-none object-cover object-[center_52%] brightness-110 contrast-105 saturate-125 md:block"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent sm:from-black/50 sm:via-black/20 md:from-black/60 md:via-black/25 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45" />
      </div>

      <Container className="relative flex h-full flex-col justify-end pb-8 pt-16 sm:justify-center sm:pb-28 sm:pt-40 md:min-h-[100svh] md:justify-center md:py-36 md:pt-56">
        {/* Headline — upper right */}
        <motion.h1
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease }}
          className="pointer-events-none absolute right-4 top-12 z-10 max-w-[min(100%,18rem)] text-right font-display text-[1.85rem] font-extrabold uppercase leading-[0.95] tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.55)] sm:right-5 sm:top-20 sm:max-w-[22rem] sm:text-4xl md:right-6 md:top-[252px] md:max-w-[28rem] md:text-5xl lg:right-8 lg:top-[268px] lg:text-[3.5rem] xl:right-10 xl:text-[4rem]"
        >
          <span className="block">Play More.</span>
          <span className="block text-primary">Worry Less.</span>
        </motion.h1>

        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full max-w-xl text-center will-change-transform [text-shadow:0_2px_18px_rgba(0,0,0,0.45)] sm:mt-[380px] md:mx-auto md:mt-[168px]"
        >
          <motion.p
            variants={item}
            className="text-[11.3px] font-bold uppercase tracking-[0.22em] text-white sm:text-[12.4px] md:text-[13.4px] md:tracking-[0.28em]"
          >
            Ichalkaranji&apos;s Premier Turf
          </motion.p>

          <motion.p
            variants={item}
            className="mt-2.5 text-[15.5px] font-semibold leading-snug tracking-wide text-accent [text-shadow:0_2px_12px_rgba(0,0,0,0.75),0_1px_2px_rgba(0,0,0,0.9)] sm:mt-3 sm:text-[16.5px] md:text-[18.5px] lg:text-[20.6px]"
          >
            {siteInfo.tagline}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4"
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
