import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaSun, FaCloudSun, FaMoon, FaCalendarAlt } from 'react-icons/fa'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'
import { WiDaySunnyOvercast } from 'react-icons/wi'
import { pricing, getSlotsForDate } from '../../data/content'
import { scrollToSection } from '../../hooks/useActiveSection'
import Container from '../ui/Container'
import { cn } from '../../utils/cn'

const icons = {
  sun: FaSun,
  afternoon: WiDaySunnyOvercast,
  sunset: FaCloudSun,
  moon: FaMoon,
}

const PREVIEW_COUNT = 5

function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDisplayDate(value) {
  if (!value) return ''
  const [y, m, d] = value.split('-')
  return `${d}/${m}/${y}`
}

function isSameDay(a, b) {
  return a === b
}

export default function PricingAvailability() {
  const today = todayISO()
  const [selectedDate, setSelectedDate] = useState(today)
  const [showFull, setShowFull] = useState(false)

  const slots = useMemo(() => getSlotsForDate(selectedDate), [selectedDate])
  const remaining = slots.length - PREVIEW_COUNT
  const visibleSlots = showFull ? slots : slots.slice(0, PREVIEW_COUNT)
  const availableCount = slots.filter((s) => s.status === 'available').length

  const handleDateChange = (value) => {
    setSelectedDate(value || today)
    setShowFull(false)
  }

  // Allow selecting today + next 14 days
  const maxDate = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  })()

  return (
    <section id="pricing" className="section-space">
      <Container>
        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 xl:gap-14">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-xl font-bold text-text sm:text-2xl md:text-3xl lg:text-4xl"
            >
              Simple Pricing.{' '}
              <span className="text-primary">Play More.</span>
            </motion.h2>
            <p className="mt-2 max-w-md text-sm text-muted md:text-base">
              Morning to midnight — pick your window and book the pitch.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3 md:gap-4">
              {pricing.map((plan, index) => {
                const Icon = icons[plan.icon] || FaSun
                const isPopular = Boolean(plan.popular)

                return (
                  <motion.article
                    key={plan.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="relative min-w-0"
                  >
                    {isPopular && (
                      <span className="absolute -right-0.5 top-2 z-10 rotate-12 rounded-sm bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-bg shadow-md sm:-right-1 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px]">
                        Popular
                      </span>
                    )}

                    <div
                      className={cn(
                        'relative flex h-full flex-col items-center overflow-hidden rounded-2xl border bg-card/80 p-3 text-center shadow-[0_16px_48px_rgb(0_0_0_/_0.4)] backdrop-blur-xl transition duration-500 sm:p-4 md:p-5',
                        isPopular
                          ? 'border-primary shadow-[0_0_40px_rgb(132_211_33_/_0.22)]'
                          : 'border-primary/30 hover:border-primary/60 hover:shadow-[0_0_28px_rgb(132_211_33_/_0.15)]',
                      )}
                    >
                      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary sm:mb-3 sm:h-11 sm:w-11">
                        <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                      </div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-text sm:text-xs sm:tracking-[0.14em] md:text-sm">
                        {plan.name}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted sm:mt-1 sm:text-[11px] md:text-xs">
                        {plan.note}
                      </p>

                      <div className="mt-2 flex items-end justify-center gap-0.5 sm:mt-3 sm:gap-1">
                        <span className="font-display text-xl font-extrabold text-text sm:text-2xl md:text-3xl">
                          {plan.price}
                        </span>
                        <span className="mb-0.5 text-[10px] text-muted sm:text-xs md:text-sm">
                          {plan.unit}
                        </span>
                      </div>

                      <motion.button
                        type="button"
                        onClick={() => scrollToSection('book-slot')}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="mt-3 w-full rounded-full bg-primary px-2 py-2 text-[10px] font-bold uppercase tracking-wide text-bg btn-glow sm:mt-5 sm:px-3 sm:py-2.5 sm:text-[11px] md:text-xs"
                      >
                        Book Now
                      </motion.button>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="glass-card relative w-full overflow-hidden p-4 sm:p-5 md:p-6 lg:mt-2"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgb(132_211_33_/_0.1),_transparent_50%)]" />

            <div className="relative">
              <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-2">
                <h3 className="font-display text-sm font-bold uppercase tracking-[0.1em] text-primary sm:text-base sm:tracking-[0.12em] md:text-lg">
                  Live Slot Availability
                </h3>
                <p className="text-[11px] text-muted sm:text-xs">
                  <span className="font-semibold text-primary">{availableCount}</span>
                  {' '}open · {slots.length} slots
                </p>
              </div>

              {/* Date picker */}
              <label className="relative mt-4 flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-xl border border-white/15 bg-bg/70 px-3 transition focus-within:border-primary/70 hover:border-primary/40 sm:mt-5 sm:h-12 sm:px-3.5">
                <FaCalendarAlt className="shrink-0 text-primary" size={14} />
                <span className="pointer-events-none flex-1 text-sm font-medium text-text">
                  {formatDisplayDate(selectedDate)}
                  {isSameDay(selectedDate, today) && (
                    <span className="ml-2 text-xs font-normal text-muted">
                      (Today)
                    </span>
                  )}
                </span>
                <span className="pointer-events-none text-[10px] font-bold uppercase tracking-wider text-primary">
                  Change
                </span>
                <input
                  type="date"
                  value={selectedDate}
                  min={today}
                  max={maxDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  aria-label="Select date to check availability"
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>

              <div
                className={cn(
                  'mt-4 space-y-2 sm:mt-5 sm:space-y-2.5',
                  showFull &&
                    'max-h-[20rem] overflow-y-auto pr-1 sm:max-h-[28rem] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/40',
                )}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={selectedDate}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-2 sm:space-y-2.5"
                  >
                    {visibleSlots.map((slot, index) => {
                      const isAvailable = slot.status === 'available'
                      return (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-bg/50 px-3 py-2.5 sm:px-4"
                          style={{
                            animationDelay: `${Math.min(index, 8) * 30}ms`,
                          }}
                        >
                          <span className="text-xs font-semibold text-text sm:text-sm">
                            {slot.time}
                          </span>
                          <span
                            className={cn(
                              'shrink-0 text-[10px] font-bold uppercase tracking-wider sm:text-[11px]',
                              isAvailable ? 'text-primary' : 'text-red-400',
                            )}
                          >
                            {isAvailable ? 'Available' : 'Booked'}
                          </span>
                        </div>
                      )
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFull((v) => !v)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-primary bg-transparent px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-text transition hover:bg-primary/10 sm:mt-5 sm:px-5 sm:py-3 sm:text-sm"
              >
                {showFull ? (
                  <>
                    Show Less
                    <HiChevronUp size={18} className="text-primary" />
                  </>
                ) : (
                  <>
                    See More
                    <span className="normal-case tracking-normal text-primary">
                      (+{remaining})
                    </span>
                    <HiChevronDown size={18} className="text-primary" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
