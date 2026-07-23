import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { siteInfo } from '../../data/site'
import { scrollToSection } from '../../hooks/useActiveSection'

const IO_THRESHOLDS = Array.from({ length: 101 }, (_, i) => i / 100)

export default function Navbar() {
  const headerRef = useRef(null)
  const [galleryReached, setGalleryReached] = useState(false)

  // Same on mobile + desktop: open glass bar only when Gallery hits the header
  useEffect(() => {
    const target = document.getElementById('gallery')
    if (!target) return undefined

    const update = (top) => {
      const headerH = headerRef.current?.offsetHeight ?? 68
      setGalleryReached(top <= headerH)
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
  }, [])

  return (
    <motion.header
      ref={headerRef}
      initial={false}
      animate={{
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
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-[9999] w-full border-b will-change-transform"
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
