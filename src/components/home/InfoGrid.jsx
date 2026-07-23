import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa'
import { HiCheckCircle } from 'react-icons/hi'
import { whyChoose, testimonial } from '../../data/content'
import { siteInfo } from '../../data/site'
import Container from '../ui/Container'
import HeroQuickBook from './HeroQuickBook'

export default function InfoGrid() {
  return (
    <section id="about" className="section-space pt-4 sm:pt-6 md:pt-8">
      <Container>
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ y: -4 }}
            className="glass-card p-5 sm:p-6 md:p-7"
          >
            <h3 className="font-display text-base font-bold uppercase tracking-[0.1em] text-primary sm:text-lg sm:tracking-[0.12em]">
              Why Choose Us?
            </h3>
            <ul className="mt-4 space-y-3 sm:mt-5 sm:space-y-3.5">
              {whyChoose.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted sm:gap-3">
                  <HiCheckCircle className="mt-0.5 shrink-0 text-primary" size={18} />
                  <span className="text-text">{item}</span>
                </li>
              ))}
            </ul>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: 0.08 }}
            whileHover={{ y: -4 }}
            className="glass-card p-5 sm:p-6 md:p-7"
          >
            <h3 className="font-display text-base font-bold uppercase tracking-[0.1em] text-primary sm:text-lg sm:tracking-[0.12em]">
              What Players Say
            </h3>
            <div className="mt-4 flex items-center gap-3 sm:mt-5">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/40 sm:h-12 sm:w-12"
              />
              <div className="min-w-0">
                <p className="font-semibold text-primary">{testimonial.name}</p>
                <div className="mt-1 flex gap-0.5 text-accent">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <FaStar key={i} size={12} />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              &ldquo;{testimonial.review}&rdquo;
            </p>
          </motion.article>

          <div id="book-slot" className="scroll-mt-28 flex h-full min-w-0 md:col-span-1">
            <HeroQuickBook />
          </div>

          <motion.article
            id="contact"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: 0.16 }}
            whileHover={{ y: -4 }}
            className="glass-card scroll-mt-28 p-5 sm:p-6 md:p-7"
          >
            <h3 className="font-display text-base font-bold uppercase tracking-[0.1em] text-primary sm:text-lg sm:tracking-[0.12em]">
              Visit Us
            </h3>
            <div className="mt-4 flex items-start gap-3 sm:mt-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                <FaMapMarkerAlt size={16} />
              </span>
              <div className="min-w-0 space-y-0.5 text-sm leading-relaxed text-muted">
                {siteInfo.addressLines.map((line) => (
                  <p key={line} className="break-words text-text">
                    {line}
                  </p>
                ))}
                <p className="break-words pt-1 text-muted">{siteInfo.address}</p>
              </div>
            </div>

            <motion.a
              href={siteInfo.mapsUrl}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.03, x: 2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-text transition hover:bg-primary/10"
            >
              Directions →
            </motion.a>
          </motion.article>
        </div>
      </Container>
    </section>
  )
}
