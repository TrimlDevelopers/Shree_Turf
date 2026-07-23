import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { siteInfo } from '../../data/site'
import { scrollToSection } from '../../hooks/useActiveSection'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { cn } from '../../utils/cn'

const IO_THRESHOLDS = Array.from({ length: 101 }, (_, i) => i / 100)
const SHOW_OFFSET_PX = 50
const MOBILE_QUERY = '(max-width: 767px)'

export default function Navbar() {
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const [scrolled, setScrolled] = useState(false)
  const [galleryReached, setGalleryReached] = useState(false)

  // Desktop: subtle glass on scroll
  useEffect(() => {
    if (isMobile) return undefined

    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile])

  // Mobile: glass bar appears once Gallery top hits ~50px from viewport top
  useEffect(() => {
    if (!isMobile) {
      setGalleryReached(true)
      return undefined
    }

    setGalleryReached(false)
    const target = document.getElementById('gallery')
    if (!target) return undefined

    const update = (top) => {
      setGalleryReached(top <= SHOW_OFFSET_PX)
    }

    update(target.getBoundingClientRect().top)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        update(entry.boundingClientRect.top)
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: IO_THRESHOLDS,
      },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [isMobile])

  return (
    <motion.header
      initial={false}
      animate={
        isMobile
          ? {
              y: 0,
              opacity: 1,
              backgroundColor: galleryReached
                ? 'rgba(0, 0, 0, 0.7)'
                : 'rgba(0, 0, 0, 0)',
              borderBottomColor: galleryReached
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(255, 255, 255, 0)',
              backdropFilter: galleryReached ? 'blur(12px)' : 'blur(0px)',
              WebkitBackdropFilter: galleryReached ? 'blur(12px)' : 'blur(0px)',
            }
          : {
              y: 0,
              opacity: 1,
              backgroundColor: scrolled ? 'rgba(5, 5, 5, 0.92)' : 'rgba(5, 5, 5, 0)',
              borderBottomColor: scrolled
                ? 'rgba(132, 211, 33, 0.14)'
                : 'rgba(255, 255, 255, 0)',
              backdropFilter: scrolled ? 'blur(18px)' : 'blur(0px)',
              WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'blur(0px)',
            }
      }
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-[9999] w-full border-b will-change-transform',
      )}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center px-4 sm:h-[80px] sm:px-5 md:h-[88px] md:px-6 lg:px-8 xl:h-[96px] xl:px-10">
        <button
          type="button"
          onClick={() => scrollToSection('home')}
          className="relative z-10 shrink-0"
          aria-label={`${siteInfo.name} — Home`}
        >
          <motion.img
            src="/turflogo.jpeg"
            alt={siteInfo.name}
            className="h-11 w-11 rounded-full object-cover shadow-[0_0_24px_rgb(132_211_33_/_0.18)] sm:h-14 sm:w-14 md:h-16 md:w-16 xl:h-[76px] xl:w-[76px]"
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          />
        </button>
      </div>
    </motion.header>
  )
}
