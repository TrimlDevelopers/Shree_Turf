import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { siteInfo } from '../../data/site'
import { cn } from '../../utils/cn'

export default function FloatingWhatsApp() {
  const { pathname } = useLocation()
  const onBook = pathname === '/book'

  return (
    <motion.a
      href={`https://wa.me/${siteInfo.whatsapp}?text=${encodeURIComponent('Hi! I want to book a slot at Shree Turf 360°.')}`}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp Shree Turf"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.4 }}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'fixed right-3 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_24px_rgb(37_211_102_/_0.45)] sm:right-4 sm:h-14 sm:w-14 md:right-6 md:h-16 md:w-16',
        onBook
          ? 'bottom-[max(1.25rem,env(safe-area-inset-bottom))] md:bottom-8'
          : 'bottom-[max(1.25rem,env(safe-area-inset-bottom))] md:bottom-8',
      )}
    >
      <FaWhatsapp className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
    </motion.a>
  )
}
