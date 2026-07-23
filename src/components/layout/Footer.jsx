import { motion } from 'framer-motion'
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt,
} from 'react-icons/fa'
import { siteInfo } from '../../data/site'
import { scrollToSection } from '../../hooks/useActiveSection'
import Container from '../ui/Container'

const socialLinks = [
  { label: 'Facebook', href: siteInfo.facebook, icon: FaFacebookF },
  { label: 'Instagram', href: siteInfo.instagram, icon: FaInstagram },
  {
    label: 'WhatsApp',
    href: `https://wa.me/${siteInfo.whatsapp}`,
    icon: FaWhatsapp,
  },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-primary/20 bg-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgb(132_211_33_/_0.1),_transparent_55%)]" />

      <Container className="relative grid gap-8 py-10 sm:gap-10 sm:py-12 md:grid-cols-2 md:items-stretch md:gap-8 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-primary md:text-left">
            Connect With Us
          </p>

          <div className="mt-4 flex flex-1 flex-col gap-3">
            <div className="flex flex-1 items-start gap-3 rounded-2xl border border-white/8 bg-card/70 px-4 py-4 sm:px-5 sm:py-5">
              <FaMapMarkerAlt className="mt-0.5 shrink-0 text-primary" size={16} />
              <div className="min-w-0">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted">
                  Location
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-text">
                  {siteInfo.address}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-primary/40 bg-transparent px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-primary transition hover:bg-primary/10"
            >
              Get Directions
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="flex w-full flex-col"
        >
          <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-primary md:text-left">
            Follow Us
          </p>

          <div className="mt-4 grid flex-1 grid-cols-3 gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="group flex h-full min-h-[5.5rem] flex-col items-center justify-center gap-2 rounded-2xl border border-primary/45 bg-card px-2 py-4 text-primary transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-bg hover:shadow-[0_0_24px_rgb(132_211_33_/_0.35)] sm:min-h-[6.5rem] sm:py-5"
              >
                <Icon size={20} />
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em]">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </motion.div>
      </Container>

      <div className="relative border-t border-white/8 bg-card/50">
        <Container className="relative flex flex-col items-center justify-center gap-2 py-5 text-center sm:min-h-[3.25rem] sm:flex-row sm:gap-0">
          <p className="text-xs text-muted sm:text-sm">
            © {new Date().getFullYear()} Shree Turf 360°. All Rights Reserved.
          </p>
          <p className="text-[0.7rem] text-muted/80 sm:absolute sm:right-4 sm:top-1/2 sm:-translate-y-1/2 sm:text-right sm:text-xs md:right-6 lg:right-8">
            Designed and developed by{' '}
            <span className="font-semibold text-primary">Tribound Tech</span>
          </p>
        </Container>
      </div>
    </footer>
  )
}
