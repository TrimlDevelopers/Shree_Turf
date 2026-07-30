import { motion } from 'framer-motion'
import { FaLightbulb, FaCar, FaShower, FaTint } from 'react-icons/fa'
import { GiSoccerField } from 'react-icons/gi'
import { MdSportsCricket } from 'react-icons/md'
import { amenities } from '../../data/content'
import Container from '../ui/Container'

const iconMap = {
  'premium-turf': GiSoccerField,
  'led-lights': FaLightbulb,
  parking: FaCar,
  changing: FaShower,
  water: FaTint,
  equipment: MdSportsCricket,
}

export default function FacilitiesBar() {
  return (
    <section id="facilities" className="relative py-8 sm:py-10 md:py-12 lg:py-14">
      <Container>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:gap-4 lg:grid-cols-6 lg:gap-4">
          {amenities.map((item, index) => {
            const Icon = iconMap[item.id] || GiSoccerField

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{
                  y: -4,
                  boxShadow: '0 0 32px rgba(132, 211, 33, 0.28)',
                }}
                className="group flex h-full min-h-[118px] flex-col items-center justify-center rounded-2xl border border-primary/40 bg-card px-2.5 py-4 text-center shadow-[0_12px_40px_rgb(0_0_0_/_0.35)] transition duration-300 hover:border-primary hover:bg-card/95 sm:min-h-[136px] sm:px-3 sm:py-5 md:min-h-[148px] md:px-4 md:py-6"
              >
                <span className="mb-2.5 flex items-center justify-center text-primary drop-shadow-[0_0_12px_rgb(132_211_33_/_0.55)] transition duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgb(132_211_33_/_0.85)] sm:mb-3">
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9" />
                </span>

                <h3 className="text-[10px] font-bold uppercase leading-tight tracking-[0.05em] text-white sm:text-[11px] md:text-xs lg:text-[13px]">
                  {item.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h3>
              </motion.article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
