import { useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { galleryImages } from '../../data/content'
import Container from '../ui/Container'

const AUTO_MS = 3200

export default function Gallery() {
  const trackRef = useRef(null)
  const pauseRef = useRef(false)

  const scrollByCard = useCallback((dir) => {
    const el = trackRef.current
    if (!el) return
    const amount = Math.min(el.clientWidth * 0.85, 380)
    const max = el.scrollWidth - el.clientWidth

    if (dir > 0 && el.scrollLeft >= max - 8) {
      el.scrollTo({ left: 0, behavior: 'smooth' })
      return
    }
    if (dir < 0 && el.scrollLeft <= 8) {
      el.scrollTo({ left: max, behavior: 'smooth' })
      return
    }

    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    const id = window.setInterval(() => {
      if (pauseRef.current) return
      scrollByCard(1)
    }, AUTO_MS)

    return () => window.clearInterval(id)
  }, [scrollByCard])

  const pause = () => {
    pauseRef.current = true
  }
  const resume = () => {
    pauseRef.current = false
  }

  return (
    <section id="gallery" className="relative z-10 bg-bg pb-8 pt-0 sm:pb-10 sm:pt-4 md:pb-12 md:pt-6">
      <Container>
        <div className="mb-6 flex items-center justify-between gap-3 sm:mb-8 md:mb-10 md:gap-4">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-xl font-bold uppercase tracking-[0.14em] text-primary sm:text-2xl sm:tracking-[0.18em] md:text-3xl"
          >
            Gallery
          </motion.h2>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              aria-label="Previous images"
              onClick={() => scrollByCard(-1)}
              onMouseEnter={pause}
              onMouseLeave={resume}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary text-primary transition hover:bg-primary hover:text-bg sm:h-10 sm:w-10 md:h-11 md:w-11"
            >
              <HiChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Next images"
              onClick={() => scrollByCard(1)}
              onMouseEnter={pause}
              onMouseLeave={resume}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary text-primary transition hover:bg-primary hover:text-bg sm:h-10 sm:w-10 md:h-11 md:w-11"
            >
              <HiChevronRight size={20} />
            </button>
          </div>
        </div>
      </Container>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6 }}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocusCapture={pause}
        onBlurCapture={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
      >
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 sm:px-5 md:gap-5 md:px-8 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] [&::-webkit-scrollbar]:hidden"
        >
          {galleryImages.map((image) => (
            <figure
              key={image.id}
              className="group relative w-[82vw] max-w-[300px] shrink-0 snap-start sm:w-[55vw] sm:max-w-[340px] md:w-[280px] lg:w-[320px] xl:w-[340px]"
            >
              <div className="overflow-hidden rounded-2xl border border-primary/20 shadow-[0_20px_50px_rgb(0_0_0_/_0.45)] transition duration-500 group-hover:border-primary/50 group-hover:shadow-[0_24px_60px_rgb(132_211_33_/_0.18)]">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                />
              </div>
            </figure>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
