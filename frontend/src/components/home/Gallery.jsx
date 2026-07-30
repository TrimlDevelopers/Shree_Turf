import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { galleryImages } from '../../data/content'
import Container from '../ui/Container'
import { cn } from '../../utils/cn'

export default function Gallery() {
  const prefersReducedMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)

  const loopImages = useMemo(
    () => [...galleryImages, ...galleryImages, ...galleryImages],
    [],
  )

  const pause = () => setPaused(true)
  const resume = () => setPaused(false)

  return (
    <section id="gallery" className="relative z-10 bg-bg pb-8 pt-0 sm:pb-10 sm:pt-4 md:pb-12 md:pt-6">
      <Container>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 font-display text-xl font-bold uppercase tracking-[0.14em] text-primary sm:mb-8 sm:text-2xl sm:tracking-[0.18em] md:mb-10 md:text-3xl"
        >
          Gallery
        </motion.h2>
      </Container>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6 }}
        className="overflow-hidden"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocusCapture={pause}
        onBlurCapture={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
      >
        <div
          className={cn(
            'flex w-max gap-3 sm:gap-4 md:gap-5',
            !prefersReducedMotion && 'animate-gallery-marquee',
            paused && '![animation-play-state:paused]',
          )}
        >
          {loopImages.map((image, index) => (
            <figure
              key={`${image.id}-${index}`}
              className="group relative w-[82vw] max-w-[300px] shrink-0 sm:w-[55vw] sm:max-w-[340px] md:w-[280px] lg:w-[320px] xl:w-[340px]"
            >
              <div className="overflow-hidden rounded-2xl border border-primary/20 shadow-[0_20px_50px_rgb(0_0_0_/_0.45)] transition duration-500 group-hover:border-primary/50 group-hover:shadow-[0_24px_60px_rgb(132_211_33_/_0.18)]">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
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
