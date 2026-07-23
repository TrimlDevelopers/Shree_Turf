import { motion } from 'framer-motion'
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from 'react-icons/fa'
import { siteInfo } from '../../data/site'
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgb(132_211_33_/_0.08),_transparent_55%)]" />

      <Container className="relative py-5 sm:py-6 md:py-7">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mx-auto flex w-full max-w-md flex-col md:max-w-xl"
        >
          <p className="text-center text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary md:text-xs">
            Follow Us
          </p>

          <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:gap-2 md:mt-3 md:gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="group flex min-h-[2.75rem] flex-col items-center justify-center gap-0.5 rounded-lg border border-primary/45 bg-card px-1 py-1.5 text-primary transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-bg hover:shadow-[0_0_12px_rgb(132_211_33_/_0.28)] sm:min-h-[3rem] md:min-h-[3.25rem] md:flex-row md:gap-2 md:rounded-xl md:px-3 md:py-2"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" />
                <span className="text-[0.5rem] font-semibold uppercase tracking-[0.08em] sm:text-[0.55rem] md:text-[0.7rem] md:tracking-[0.1em]">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </motion.div>
      </Container>

      <div className="relative border-t border-white/8 bg-card/50">
        <Container className="relative flex flex-col items-center justify-center gap-1 py-3 text-center sm:min-h-[2.75rem] sm:flex-row sm:gap-0 md:py-3.5">
          <p className="text-[0.7rem] text-muted sm:text-xs">
            © {new Date().getFullYear()} Shree Turf 360°. All Rights Reserved.
          </p>
          <p className="text-[0.6rem] text-muted/80 sm:absolute sm:right-4 sm:top-1/2 sm:-translate-y-1/2 sm:text-right sm:text-[0.65rem] md:right-6">
            Designed and developed by{' '}
            <span className="font-semibold text-primary">Tribound Tech</span>
          </p>
        </Container>
      </div>
    </footer>
  )
}
