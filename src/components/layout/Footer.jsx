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

      <Container className="relative grid gap-6 py-8 sm:gap-8 sm:py-10 md:grid-cols-2 md:items-stretch md:gap-6 lg:py-12">
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

          <div className="mt-3 flex flex-1 flex-col gap-2">
            <div className="flex items-start gap-2.5 rounded-xl border border-white/8 bg-card/70 px-3 py-2.5 sm:px-3.5 sm:py-3">
              <FaMapMarkerAlt className="mt-0.5 shrink-0 text-primary" size={13} />
              <div className="min-w-0">
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-muted">
                  Location
                </p>
                <p className="mt-1 text-xs leading-relaxed text-text sm:text-[0.8rem]">
                  {siteInfo.address}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="inline-flex min-h-9 items-center justify-center rounded-xl border border-primary/40 bg-transparent px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-primary transition hover:bg-primary/10"
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

          <div className="mt-3 grid flex-1 grid-cols-3 gap-2 sm:gap-2.5">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="group flex min-h-[3.25rem] flex-col items-center justify-center gap-1 rounded-xl border border-primary/45 bg-card px-1.5 py-2 text-primary transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-bg hover:shadow-[0_0_16px_rgb(132_211_33_/_0.3)] sm:min-h-[3.5rem] sm:py-2.5 md:min-h-[3.75rem]"
              >
                <Icon size={15} />
                <span className="text-[0.55rem] font-semibold uppercase tracking-[0.1em] sm:text-[0.6rem]">
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
