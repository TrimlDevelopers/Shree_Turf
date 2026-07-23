import { motion } from 'framer-motion'
import { FaPhoneAlt, FaWhatsapp, FaFutbol } from 'react-icons/fa'
import { siteInfo } from '../../data/site'
import Container from '../ui/Container'

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-secondary">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgb(132 211 33 / 0.35), transparent 45%), radial-gradient(circle at 80% 50%, rgb(0 0 0 / 0.25), transparent 40%)',
        }}
      />

      <Container className="relative flex flex-col items-center gap-5 py-8 sm:flex-row sm:justify-between sm:gap-6 sm:py-10 md:gap-8 md:py-12">
        <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-5 md:gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-bg/30 text-primary shadow-inner sm:h-20 sm:w-20 md:h-24 md:w-24"
            aria-hidden
          >
            <FaFutbol className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md text-center font-display text-lg font-extrabold uppercase leading-tight tracking-wide text-text sm:text-left sm:text-xl md:text-2xl lg:text-3xl"
          >
            Ready to Play? Book Your Slot Now!
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center"
        >
          <motion.a
            href={`tel:${siteInfo.phone}`}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-text/30 bg-bg/40 px-5 py-3 text-sm font-bold uppercase tracking-wide text-text backdrop-blur-sm transition hover:bg-bg/60 sm:w-auto"
          >
            <FaPhoneAlt size={14} />
            Call
          </motion.a>

          <motion.a
            href={`https://wa.me/${siteInfo.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wide text-bg btn-glow sm:w-auto"
          >
            <FaWhatsapp size={16} />
            WhatsApp Us
          </motion.a>
        </motion.div>
      </Container>
    </section>
  )
}
