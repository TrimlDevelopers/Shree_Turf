import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCalendarAlt, FaClock, FaFutbol, FaCheck } from 'react-icons/fa'
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

function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatSelectedSlots(slots) {
  if (slots.length === 0) return 'Select Time'
  if (slots.length === 1) return slots[0]
  if (slots.length === 2) return slots.join(' · ')
  return `${slots.length} slots selected`
}

export default function HeroQuickBook() {
  const [date, setDate] = useState('')
  const [selectedTimes, setSelectedTimes] = useState([])
  const [game, setGame] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [timeOpen, setTimeOpen] = useState(false)
  const dateRef = useRef(null)
  const timeMenuRef = useRef(null)

  const today = todayISO()

  useEffect(() => {
    if (!timeOpen) return
    const onPointerDown = (e) => {
      if (!timeMenuRef.current?.contains(e.target)) {
        setTimeOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [timeOpen])

  const openDatePicker = () => {
    const input = dateRef.current
    if (!input) return
    try {
      if (typeof input.showPicker === 'function') {
        input.showPicker()
        return
      }
    } catch {
      /* ignore */
    }
    input.focus()
    input.click()
  }

  const toggleTime = (slot) => {
    setSelectedTimes((prev) =>
      prev.includes(slot) ? prev.filter((t) => t !== slot) : [...prev, slot],
    )
    setError('')
  }

  const handleCheck = (e) => {
    e.preventDefault()
    if (!date || selectedTimes.length === 0 || !game) {
      setError('Please select date, at least one time slot, and game')
      return
    }
    setError('')
    setTimeOpen(false)
    setStatus('checking')
    window.setTimeout(() => setStatus('available'), 700)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-full w-full min-w-0"
    >
      <div className="relative flex h-full w-full flex-col overflow-visible rounded-2xl border border-primary bg-card/90 p-4 shadow-[0_24px_80px_rgb(0_0_0_/_0.55)] backdrop-blur-xl sm:p-5 md:p-6 lg:p-7">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top_right,_rgb(132_211_33_/_0.12),_transparent_55%)]" />

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
                  Slot booked waiting for confirmation
                </p>
                <p className="mt-1 text-sm text-muted">
                  {game} · {formatDisplayDate(date)}
                </p>
                <ul className="mt-3 space-y-1 text-sm font-medium text-white">
                  {selectedTimes.map((slot) => (
                    <li key={slot}>{slot}</li>
                  ))}
                </ul>
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
                {/* Date */}
                <div
                  className={cn(fieldShell, 'relative w-full cursor-pointer')}
                  onClick={openDatePicker}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openDatePicker()
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Select Date"
                >
                  <FaCalendarAlt
                    className="pointer-events-none shrink-0 text-muted"
                    size={14}
                  />
                  <span
                    className={cn(
                      'pointer-events-none flex-1 pl-3 text-sm',
                      date ? 'text-white' : 'text-muted',
                    )}
                  >
                    {date ? formatDisplayDate(date) : 'Select Date'}
                  </span>
                  <HiChevronDown
                    className="pointer-events-none shrink-0 text-muted"
                    size={18}
                  />
                  <input
                    ref={dateRef}
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    onClick={(e) => {
                      e.stopPropagation()
                      try {
                        e.currentTarget.showPicker?.()
                      } catch {
                        /* ignore */
                      }
                    }}
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-[0.01]"
                    aria-label="Select Date"
                  />
                </div>

                {/* Time — multi select */}
                <div ref={timeMenuRef} className="relative z-30">
                  <button
                    type="button"
                    onClick={() => setTimeOpen((v) => !v)}
                    className={cn(
                      fieldShell,
                      'w-full cursor-pointer text-left',
                      timeOpen && 'border-primary/70',
                    )}
                    aria-expanded={timeOpen}
                    aria-haspopup="listbox"
                  >
                    <FaClock className="shrink-0 text-muted" size={14} />
                    <span
                      className={cn(
                        'flex-1 truncate pl-3 text-sm',
                        selectedTimes.length ? 'text-white' : 'text-muted',
                      )}
                    >
                      {formatSelectedSlots(selectedTimes)}
                    </span>
                    <HiChevronDown
                      className={cn(
                        'shrink-0 text-muted transition-transform',
                        timeOpen && 'rotate-180',
                      )}
                      size={18}
                    />
                  </button>

                  <AnimatePresence>
                    {timeOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-0 right-0 top-[calc(100%+6px)] max-h-52 overflow-y-auto rounded-xl border border-primary/40 bg-card shadow-[0_16px_40px_rgb(0_0_0_/_0.55)] [scrollbar-width:thin]"
                        role="listbox"
                        aria-multiselectable="true"
                        aria-label="Select time slots"
                      >
                        <p className="sticky top-0 z-10 border-b border-white/8 bg-card px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
                          Tap to select multiple
                        </p>
                        {timeSlots.map((slot) => {
                          const selected = selectedTimes.includes(slot)
                          return (
                            <button
                              key={slot}
                              type="button"
                              role="option"
                              aria-selected={selected}
                              onClick={() => toggleTime(slot)}
                              className={cn(
                                'flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition hover:bg-primary/10',
                                selected ? 'bg-primary/10 text-primary' : 'text-white',
                              )}
                            >
                              <span>{slot}</span>
                              <span
                                className={cn(
                                  'flex h-5 w-5 items-center justify-center rounded border',
                                  selected
                                    ? 'border-primary bg-primary text-bg'
                                    : 'border-white/25',
                                )}
                              >
                                {selected && <FaCheck size={10} />}
                              </span>
                            </button>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {selectedTimes.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {selectedTimes.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => toggleTime(slot)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary transition hover:bg-primary/20"
                        >
                          {slot}
                          <span aria-hidden className="text-primary/80">
                            ×
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

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
