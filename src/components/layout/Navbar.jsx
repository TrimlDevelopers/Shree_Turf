import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaPhoneAlt } from 'react-icons/fa'
import { navLinks, siteInfo } from '../../data/site'
import { scrollToSection, useActiveSection } from '../../hooks/useActiveSection'
import { cn } from '../../utils/cn'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const activeId = useActiveSection()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: scrolled ? 'rgba(5, 5, 5, 0.88)' : 'rgba(5, 5, 5, 0)',
        borderBottomColor: scrolled
          ? 'rgba(132, 211, 33, 0.14)'
          : 'rgba(255, 255, 255, 0)',
        backdropFilter: scrolled ? 'blur(18px)' : 'blur(0px)',
        WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 border-b"
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-3 px-4 sm:h-[80px] sm:px-5 md:h-[88px] md:px-6 lg:px-8 xl:h-[96px] xl:px-10">
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

        {/* Desktop nav — xl+ only */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 xl:flex xl:gap-1 2xl:gap-2">
          {navLinks.map((link) => {
            const isActive = activeId === link.id
            return (
              <motion.button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                whileHover="hover"
                className={cn(
                  'relative whitespace-nowrap px-2.5 py-2 text-[12px] font-semibold uppercase tracking-[0.06em] transition-colors duration-300 2xl:px-3.5 2xl:text-[14px]',
                  isActive ? 'text-primary' : 'text-white hover:text-primary',
                )}
              >
                <motion.span
                  variants={{ hover: { y: -1 } }}
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                  className="inline-block"
                >
                  {link.label}
                </motion.span>

                {isActive ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2.5 -bottom-0.5 h-[2.5px] rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <motion.span
                    variants={{ hover: { scaleX: 1, opacity: 1 } }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    className="absolute inset-x-2.5 -bottom-0.5 h-[2px] origin-center rounded-full bg-primary/50"
                    transition={{ duration: 0.22 }}
                  />
                )}
              </motion.button>
            )
          })}
        </nav>

        <motion.a
          href={`tel:${siteInfo.phone.replace(/\s/g, '')}`}
          whileHover={{
            scale: 1.03,
            boxShadow: '0 0 28px rgba(132, 211, 33, 0.45)',
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          className="relative z-10 inline-flex shrink-0 items-center gap-2 rounded-full border border-primary bg-transparent px-3 py-2 text-xs font-semibold tracking-wide text-white transition-colors duration-300 hover:bg-primary/10 sm:px-4 sm:py-2.5 sm:text-[13px] md:px-5 md:text-sm"
        >
          <FaPhoneAlt className="text-primary" size={12} />
          <span className="hidden sm:inline">{siteInfo.phone}</span>
          <span className="sm:hidden">Call</span>
        </motion.a>
      </div>
    </motion.header>
  )
}
