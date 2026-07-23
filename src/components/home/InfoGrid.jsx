import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa'
import { HiCheckCircle } from 'react-icons/hi'
import { whyChoose, testimonial } from '../../data/content'
import { siteInfo } from '../../data/site'
import Container from '../ui/Container'
import HeroQuickBook from './HeroQuickBook'

export default function InfoGrid() {
  return (
    <section id="about" className="pb-10 pt-1 sm:pb-12 sm:pt-2 md:pb-16 md:pt-3 lg:pb-20">
      <Container>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 xl:grid-cols-4 xl:gap-6">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ y: -4 }}
            className="glass-card flex flex-col p-3.5 sm:p-5 md:p-6 lg:p-7"
          >
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.08em] text-primary sm:text-base sm:tracking-[0.1em] md:text-lg md:tracking-[0.12em]">
              Why Choose Us?
            </h3>
            <ul className="mt-3 flex flex-1 flex-col gap-2.5 sm:mt-4 sm:gap-3 sm:space-y-0 md:mt-5 md:gap-3.5">
              {whyChoose.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-1.5 text-[11px] leading-snug text-muted sm:gap-2.5 sm:text-sm"
                >
                  <HiCheckCircle
                    className="mt-0.5 shrink-0 text-primary"
                    size={14}
                  />
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
            className="glass-card flex flex-col p-3.5 sm:p-5 md:p-6 lg:p-7"
          >
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.08em] text-primary sm:text-base sm:tracking-[0.1em] md:text-lg md:tracking-[0.12em]">
              What Players Say
            </h3>
            <div className="mt-3 flex items-center gap-2 sm:mt-4 sm:gap-3 md:mt-5">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/40 sm:h-11 sm:w-11 md:h-12 md:w-12"
              />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-primary sm:text-sm md:text-base">
                  {testimonial.name}
                </p>
                <div className="mt-0.5 flex gap-0.5 text-accent sm:mt-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <FaStar key={i} size={10} />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 flex-1 text-[11px] leading-relaxed text-muted sm:mt-4 sm:text-sm">
              &ldquo;{testimonial.review}&rdquo;
            </p>
          </motion.article>

          <div
            id="book-slot"
            className="col-span-2 scroll-mt-28 flex min-h-0 min-w-0 xl:col-span-1"
          >
            <HeroQuickBook />
          </div>

          <motion.article
            id="contact"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: 0.16 }}
            whileHover={{ y: -4 }}
            className="glass-card col-span-2 flex scroll-mt-28 flex-col p-4 sm:p-5 md:p-6 lg:p-7 xl:col-span-1"
          >
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.1em] text-primary sm:text-base sm:tracking-[0.1em] md:text-lg md:tracking-[0.12em]">
              Visit Us
            </h3>
            <div className="mt-4 flex flex-1 items-start gap-3 sm:mt-5">
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
              className="mt-5 inline-flex items-center justify-center gap-2 self-start rounded-full border border-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-text transition hover:bg-primary/10 sm:mt-6"
            >
              Directions →
            </motion.a>
          </motion.article>
        </div>
      </Container>
    </section>
  )
}
