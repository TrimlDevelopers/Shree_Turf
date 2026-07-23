import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { siteInfo } from '../../data/site'

export default function FloatingWhatsApp() {
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
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-3 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-bg shadow-[0_0_32px_rgb(132_211_33_/_0.45)] sm:right-4 sm:h-14 sm:w-14 md:bottom-8 md:right-6 md:h-16 md:w-16"
    >
      <FaWhatsapp className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
    </motion.a>
  )
}
