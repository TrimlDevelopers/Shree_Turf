import { motion } from 'framer-motion'
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaPhoneAlt,
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

      <Container className="relative grid gap-10 py-12 sm:gap-12 sm:py-14 lg:grid-cols-3 lg:items-start lg:gap-10 lg:py-16">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <button
            type="button"
            onClick={() => scrollToSection('home')}
            className="group flex flex-col items-center gap-3 transition hover:opacity-90 sm:flex-row sm:items-center sm:gap-4 lg:items-start xl:items-center"
            aria-label={siteInfo.name}
          >
            <img
              src="/turflogo.jpeg"
              alt=""
              className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-primary/50 shadow-[0_0_20px_rgb(132_211_33_/_0.2)] transition group-hover:ring-primary"
            />
            <span className="min-w-0">
              <span className="block font-display text-xl font-bold tracking-wide text-text sm:text-2xl">
                {siteInfo.name}
              </span>
              <span className="mt-1 block text-sm font-medium text-primary">
                {siteInfo.tagline}
              </span>
            </span>
          </button>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted lg:max-w-none">
            Premium cricket &amp; football turf with LED flood lights in
            Ichalkaranji, Kolhapur.
          </p>

          <a
            href={`tel:${siteInfo.phone.replace(/\s/g, '')}`}
            className="mt-5 inline-flex w-full max-w-md items-center justify-center gap-2.5 rounded-full border border-primary/40 bg-card/60 px-5 py-3 text-sm font-semibold text-text transition hover:border-primary hover:bg-primary/10 lg:mt-6 lg:max-w-none"
          >
            <FaPhoneAlt className="text-primary" size={13} />
            {siteInfo.phone}
          </a>
        </motion.div>

        {/* Location — desktop/tablet */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="hidden md:flex md:flex-col"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Connect With Us
          </p>

          <div className="mt-5 flex flex-1 flex-col gap-3">
            <div className="flex flex-1 items-start gap-3 rounded-2xl border border-white/8 bg-card/70 px-5 py-5">
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

        {/* Follow Us */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="w-full"
        >
          <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-primary lg:text-left">
            Follow Us
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-primary/45 bg-card px-2 py-4 text-primary transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-bg hover:shadow-[0_0_24px_rgb(132_211_33_/_0.35)] sm:py-5"
              >
                <Icon size={20} />
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em]">
                  {label === 'Facebook'
                    ? 'Facebook'
                    : label === 'Instagram'
                      ? 'Instagram'
                      : 'WhatsApp'}
                </span>
              </a>
            ))}
          </div>
        </motion.div>
      </Container>

      <div className="relative border-t border-white/8 bg-card/50">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted sm:text-sm">
            © {new Date().getFullYear()} Shree Turf 360°. All Rights Reserved.
          </p>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted/70 md:hidden">
            {siteInfo.location}
          </p>
        </Container>
      </div>
    </footer>
  )
}
