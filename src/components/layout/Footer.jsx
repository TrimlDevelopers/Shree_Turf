import { motion } from 'framer-motion'
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
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

      <Container className="relative grid gap-10 py-12 sm:gap-12 sm:py-14 md:grid-cols-2 md:items-start md:gap-14 lg:py-16">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center md:items-start md:text-left"
        >
          <button
            type="button"
            onClick={() => scrollToSection('home')}
            className="group flex flex-col items-center gap-3 transition hover:opacity-90 md:flex-row md:items-center md:gap-4"
            aria-label={siteInfo.name}
          >
            <img
              src="/turflogo.jpeg"
              alt=""
              className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/50 shadow-[0_0_20px_rgb(132_211_33_/_0.2)] transition group-hover:ring-primary sm:h-[4.25rem] sm:w-[4.25rem]"
            />
            <span>
              <span className="block font-display text-xl font-bold tracking-wide text-text sm:text-2xl md:text-xl lg:text-2xl">
                {siteInfo.name}
              </span>
              <span className="mt-1 block text-sm font-medium text-primary sm:text-base">
                {siteInfo.tagline}
              </span>
            </span>
          </button>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted sm:mt-6 sm:text-[0.95rem]">
            Premium cricket &amp; football turf with LED flood lights in
            Ichalkaranji, Kolhapur.
          </p>

          <a
            href={`tel:${siteInfo.phone.replace(/\s/g, '')}`}
            className="mt-5 inline-flex w-full max-w-md items-center justify-center gap-2.5 rounded-full border border-primary/40 bg-card/60 px-5 py-3 text-sm font-semibold text-text transition hover:border-primary hover:bg-primary/10 md:mt-6 md:w-auto md:justify-start md:py-2.5"
          >
            <FaPhoneAlt className="text-primary" size={13} />
            {siteInfo.phone}
          </a>
        </motion.div>

        {/* Contact / Social */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full"
        >
          <div className="hidden md:block">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Connect With Us
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-card/70 px-4 py-3.5">
                <FaMapMarkerAlt className="mt-0.5 shrink-0 text-primary" size={15} />
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted">
                    Location
                  </p>
                  <p className="mt-1 text-sm leading-snug text-text">
                    {siteInfo.location}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-card/70 px-4 py-3.5">
                <FaClock className="mt-0.5 shrink-0 text-primary" size={15} />
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted">
                    Hours
                  </p>
                  <p className="mt-1 text-sm leading-snug text-text">
                    {siteInfo.hours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-primary md:mt-7 md:text-left">
            Follow Us
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 md:flex md:justify-start">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="group flex h-12 items-center justify-center rounded-2xl border border-primary/45 bg-card text-primary transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-bg hover:shadow-[0_0_24px_rgb(132_211_33_/_0.35)] md:h-11 md:w-11 md:rounded-full"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </motion.div>
      </Container>

      <div className="relative border-t border-white/8 bg-card/50">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-center sm:flex-row sm:gap-2 sm:text-left">
          <p className="text-xs text-muted sm:text-sm">
            © {new Date().getFullYear()} Shree Turf 360°. All Rights Reserved.
          </p>
          <button
            type="button"
            onClick={() => scrollToSection('contact')}
            className="text-xs font-medium uppercase tracking-[0.14em] text-muted/80 transition hover:text-primary"
          >
            Get Directions
          </button>
        </Container>
      </div>
    </footer>
  )
}
