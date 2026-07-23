import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCalendarAlt, FaClock, FaFutbol } from 'react-icons/fa'
import { HiCheckCircle, HiChevronDown } from 'react-icons/hi'
import { timeSlots } from '../../data/content'
import { cn } from '../../utils/cn'

const games = ['Football', 'Cricket', 'Box Cricket']

const fieldShell =
  'relative flex h-11 w-full min-w-0 items-center rounded-xl border border-white/15 bg-bg/80 px-3 transition focus-within:border-primary/70 focus-within:bg-bg sm:h-[46px] sm:px-3.5'

const selectClass =
  'h-full w-full min-w-0 appearance-none bg-transparent py-3 pl-6 pr-6 text-sm text-white outline-none sm:pl-7 sm:pr-7'

function formatDisplayDate(value) {
  if (!value) return ''
  const [y, m, d] = value.split('-')
  return `${d}/${m}/${y}`
}

export default function HeroQuickBook() {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [game, setGame] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const handleCheck = (e) => {
    e.preventDefault()
    if (!date || !time || !game) {
      setError('Please select date, time, and game')
      return
    }
    setError('')
    setStatus('checking')
    window.setTimeout(() => setStatus('available'), 700)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="relative flex h-full w-full min-w-0"
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-primary bg-card/90 p-4 shadow-[0_24px_80px_rgb(0_0_0_/_0.55)] backdrop-blur-xl sm:p-5 md:p-6 lg:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgb(132_211_33_/_0.12),_transparent_55%)]" />

        <div className="relative flex flex-1 flex-col">
          <h2 className="font-display text-lg font-bold uppercase tracking-[0.16em] text-primary sm:text-xl">
            Book a Slot
          </h2>

          <AnimatePresence mode="wait">
            {status === 'available' ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 flex flex-1 flex-col items-center justify-center py-6 text-center"
              >
                <HiCheckCircle className="text-primary" size={48} />
                <p className="mt-3 font-display text-xl font-bold text-white">
                  Slot Available
                </p>
                <p className="mt-1 text-sm text-muted">
                  {game} · {formatDisplayDate(date)} · {time}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-5 text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
                >
                  Check another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleCheck}
                className="mt-6 flex flex-1 flex-col space-y-3"
              >
                {/* Date — custom label hides native dd-mm-yyyy */}
                <label className={cn(fieldShell, 'cursor-pointer')}>
                  <FaCalendarAlt
                    className="pointer-events-none shrink-0 text-muted"
                    size={14}
                  />
                  <span
                    className={cn(
                      'pointer-events-none relative z-10 flex-1 pl-3 text-sm',
                      date ? 'text-white' : 'text-muted',
                    )}
                  >
                    {date ? formatDisplayDate(date) : 'Select Date'}
                  </span>
                  <input
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
                    aria-label="Select Date"
                  />
                  <HiChevronDown
                    className="pointer-events-none shrink-0 text-muted"
                    size={18}
                  />
                </label>

                {/* Time */}
                <label className={fieldShell}>
                  <FaClock className="pointer-events-none shrink-0 text-muted" size={14} />
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={cn(selectClass, !time && 'text-muted')}
                    aria-label="Select Time"
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot} className="bg-card text-white">
                        {slot}
                      </option>
                    ))}
                  </select>
                  <HiChevronDown
                    className="pointer-events-none shrink-0 text-muted"
                    size={18}
                  />
                </label>

                {/* Game */}
                <label className={fieldShell}>
                  <FaFutbol className="pointer-events-none shrink-0 text-muted" size={14} />
                  <select
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    className={cn(selectClass, !game && 'text-muted')}
                    aria-label="Select Game"
                  >
                    <option value="">Select Game</option>
                    {games.map((g) => (
                      <option key={g} value={g} className="bg-card text-white">
                        {g}
                      </option>
                    ))}
                  </select>
                  <HiChevronDown
                    className="pointer-events-none shrink-0 text-muted"
                    size={18}
                  />
                </label>

                {error && (
                  <p className="text-xs font-medium text-accent">{error}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={status === 'checking'}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-auto flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-xs font-bold uppercase tracking-[0.06em] text-bg shadow-[0_0_28px_rgb(132_211_33_/_0.35)] transition disabled:opacity-70 sm:px-5 sm:py-3.5 sm:text-sm sm:tracking-[0.08em]"
                >
                  {status === 'checking' ? 'Checking…' : 'Check Availability'}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
