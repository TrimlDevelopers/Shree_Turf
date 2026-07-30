import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FaArrowLeft,
  FaCheck,
  FaClock,
  FaEnvelope,
  FaFutbol,
  FaPhone,
  FaUser,
} from 'react-icons/fa'
import { HiCheckCircle } from 'react-icons/hi'
import { createBooking, getPricing, getSlots } from '../api/client'
import DateStrip from '../components/booking/DateStrip'
import SlotPicker from '../components/booking/SlotPicker'
import Container from '../components/ui/Container'
import MiniCalendar from '../components/ui/MiniCalendar'
import {
  BOOKINGS_CHANGED,
  notifyBookingsChanged,
  useBookingDraft,
} from '../contexts/BookingDraftContext'
import { pricing as fallbackPricing, getSlotsForDate } from '../data/content'
import { siteInfo } from '../data/site'
import { cn } from '../utils/cn'
import {
  buildDateRange,
  estimateTotal,
  formatDisplayDate,
  formatLongDate,
  formatRupee,
  shortSlotLabel,
  slotStartHour,
  todayISO,
} from '../utils/booking'

const GAMES = ['Football', 'Cricket', 'Box Cricket']

const fieldShell =
  'relative flex h-11 w-full min-w-0 items-center rounded-xl border border-white/15 bg-bg/80 px-3 transition focus-within:border-primary/70 sm:h-12 sm:px-3.5'

const panel =
  'rounded-2xl border border-white/10 bg-card/80 shadow-[0_16px_48px_rgb(0_0_0_/_0.35)] backdrop-blur-xl sm:rounded-3xl'

export default function BookPage() {
  const { draft } = useBookingDraft()
  const today = todayISO()
  const dates = useMemo(() => buildDateRange(today, 15), [today])
  const maxDate = dates[dates.length - 1]

  const [date, setDate] = useState(today)
  const [selectedTimes, setSelectedTimes] = useState([])
  const [slots, setSlots] = useState(() => getSlotsForDate(today))
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [rates, setRates] = useState(fallbackPricing)
  const [game, setGame] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const calendarRef = useRef(null)
  const detailsRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!draft.version) return
    if (draft.date) setDate(draft.date)
    if (draft.times?.length) setSelectedTimes(draft.times)
  }, [draft.version, draft.date, draft.times])

  useEffect(() => {
    let cancelled = false
    getPricing()
      .then((data) => {
        if (!cancelled && data.rates?.length) setRates(data.rates)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoadingSlots(true)
    getSlots(date)
      .then((data) => {
        if (cancelled) return
        const next = data.slots || []
        setSlots(next)
        const booked = new Set(
          next.filter((s) => s.status === 'booked').map((s) => s.time),
        )
        setSelectedTimes((prev) => prev.filter((t) => !booked.has(t)))
      })
      .catch(() => {
        if (!cancelled) setSlots(getSlotsForDate(date))
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false)
      })
    return () => {
      cancelled = true
    }
  }, [date, refreshKey])

  useEffect(() => {
    const onChanged = () => setRefreshKey((k) => k + 1)
    window.addEventListener(BOOKINGS_CHANGED, onChanged)
    return () => window.removeEventListener(BOOKINGS_CHANGED, onChanged)
  }, [])

  useEffect(() => {
    if (!calendarOpen) return
    const onPointerDown = (e) => {
      if (!calendarRef.current?.contains(e.target)) setCalendarOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [calendarOpen])

  const ratesByKey = useMemo(
    () => Object.fromEntries(rates.map((r) => [r.key || r.id, r])),
    [rates],
  )

  const total = estimateTotal(selectedTimes, rates)
  const freeCount = slots.filter((s) => s.status === 'available').length
  const bookedCount = slots.length - freeCount
  const selectedCount = selectedTimes.length
  const nameOk = customerName.trim().length >= 2
  const phoneDigits = phone.replace(/\D/g, '')
  const phoneOk = phoneDigits.length >= 10
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())
  const canSubmit =
    selectedCount > 0 && Boolean(game) && nameOk && phoneOk && emailOk

  const ctaLabel =
    status === 'submitting'
      ? 'Booking…'
      : selectedCount === 0
        ? 'Select a slot'
        : !canSubmit
          ? 'Fill details'
          : 'Confirm booking'

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleDateChange = (next) => {
    setDate(next)
    setSelectedTimes([])
    setError('')
    setStatus('idle')
    setCalendarOpen(false)
  }

  const toggleSlot = (slot) => {
    if (slot.status !== 'available') return
    setSelectedTimes((prev) => {
      const next = prev.includes(slot.time)
        ? prev.filter((t) => t !== slot.time)
        : [...prev, slot.time]
      return [...next].sort((a, b) => slotStartHour(a) - slotStartHour(b))
    })
    setError('')
    setStatus('idle')
  }

  const removeSlot = (time) => {
    setSelectedTimes((prev) => prev.filter((t) => t !== time))
    setError('')
  }

  const resetAfterSuccess = () => {
    setStatus('idle')
    setSelectedTimes([])
    setGame('')
    setCustomerName('')
    setPhone('')
    setCustomerEmail('')
    setError('')
    setRefreshKey((k) => k + 1)
  }

  const handleSubmit = async (e) => {
    e?.preventDefault?.()
    if (!date || selectedTimes.length === 0) {
      setError('Select at least one time slot')
      return
    }
    if (!game) {
      setError('Choose a game')
      scrollToDetails()
      return
    }
    if (!nameOk) {
      setError('Enter your name')
      scrollToDetails()
      return
    }
    if (!phoneOk) {
      setError('Enter a valid 10-digit phone number')
      scrollToDetails()
      return
    }
    if (!emailOk) {
      setError('Enter a valid email address')
      scrollToDetails()
      return
    }

    setError('')
    setStatus('submitting')
    try {
      await createBooking({
        date,
        slots: selectedTimes,
        game,
        customerName: customerName.trim(),
        phone: phoneDigits,
        customerEmail: customerEmail.trim().toLowerCase(),
      })
      notifyBookingsChanged()
      setStatus('success')
    } catch (err) {
      setStatus('idle')
      setError(err.message || 'Could not create booking')
    }
  }

  const handlePrimaryCta = () => {
    if (selectedCount === 0) {
      setError('Tap a free slot above to continue')
      window.scrollTo({ top: 180, behavior: 'smooth' })
      return
    }
    if (!canSubmit) {
      setError(
        !game
          ? 'Choose a game'
          : !nameOk
            ? 'Enter your name'
            : !phoneOk
              ? 'Enter a valid 10-digit phone number'
              : 'Enter a valid email address',
      )
      scrollToDetails()
      return
    }
    handleSubmit()
  }

  return (
    <div className="relative min-h-[100svh] w-full max-w-[100vw] overflow-x-hidden bg-bg pb-16 pt-[5.25rem] sm:pt-28 md:pb-20 md:pt-32 lg:pb-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_at_top,_rgb(132_211_33_/_0.16),_transparent_58%)] sm:h-72" />

      <Container className="relative w-full min-w-0 max-w-6xl lg:max-w-7xl">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted transition hover:text-primary sm:text-xs"
            >
              <FaArrowLeft size={10} />
              Back to home
            </Link>
            <h1 className="mt-2 font-display text-[1.5rem] font-extrabold leading-tight text-text sm:text-3xl md:text-4xl">
              Book a <span className="text-primary">Slot</span>
            </h1>
            <p className="mt-1.5 max-w-md text-xs leading-relaxed text-muted sm:text-sm">
              Pick a date, tap free hours, and confirm. We&apos;ll reach you on
              WhatsApp / call.
            </p>
          </div>

          <div className="w-full min-w-0 sm:w-auto">
            <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-white/10 bg-card/70 px-3 py-2 sm:rounded-2xl sm:px-4 sm:py-3">
              <FaClock className="shrink-0 text-primary" size={12} />
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted sm:text-[10px]">
                  {siteInfo.shortName}
                </p>
                <p className="truncate text-xs font-semibold text-text sm:text-sm">
                  {siteInfo.hours}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        {status !== 'success' && (
          <div className="mb-4 flex w-full min-w-0 items-center justify-between gap-1 sm:mb-6 sm:gap-2">
            {[
              { n: 1, label: 'Date', done: Boolean(date), active: selectedCount === 0 },
              { n: 2, label: 'Slots', done: selectedCount > 0, active: selectedCount === 0 },
              {
                n: 3,
                label: 'Details',
                done: canSubmit,
                active: selectedCount > 0,
              },
            ].map((s) => (
              <div
                key={s.n}
                className="flex min-w-0 flex-1 flex-col items-center gap-1 sm:flex-row sm:justify-center sm:gap-2"
              >
                <div
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold sm:h-8 sm:w-8 sm:text-xs',
                    s.done && !s.active && 'bg-primary/20 text-primary',
                    s.active && 'bg-primary text-bg',
                    !s.done && !s.active && 'bg-white/8 text-muted',
                  )}
                >
                  {s.done && !s.active ? <FaCheck size={9} /> : s.n}
                </div>
                <span
                  className={cn(
                    'text-[9px] font-semibold uppercase tracking-wider sm:text-[11px]',
                    s.active ? 'text-primary' : 'text-muted',
                  )}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(panel, 'mx-auto max-w-lg p-6 text-center sm:p-8')}
            >
              <HiCheckCircle className="mx-auto text-primary" size={52} />
              <h2 className="mt-3 font-display text-xl font-bold text-text sm:text-2xl">
                Request received
              </h2>
              <p className="mt-2 text-sm text-muted">
                Your booking is pending confirmation. The admin has been notified by email — you&apos;ll get a confirmation email once approved.
              </p>
              <div className="mt-5 rounded-2xl border border-white/10 bg-bg/60 px-4 py-3 text-left text-sm">
                <p className="font-semibold text-primary">{game}</p>
                <p className="mt-1 text-text">{formatLongDate(date)}</p>
                <ul className="mt-2 space-y-1 text-muted">
                  {selectedTimes.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                {total > 0 && (
                  <p className="mt-3 font-display text-lg font-bold text-text">
                    Est. {formatRupee(total)}
                  </p>
                )}
              </div>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={resetAfterSuccess}
                  className="rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-bg"
                >
                  Book another
                </button>
                <Link
                  to="/"
                  className="rounded-full border border-white/20 px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-text transition hover:border-primary/50"
                >
                  Home
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="grid w-full min-w-0 items-start gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,22rem)] lg:gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,24rem)] xl:gap-8"
            >
              <div className="min-w-0 space-y-4 sm:space-y-5">
                <section className={cn(panel, 'min-w-0 overflow-x-hidden p-3 sm:p-5')}>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h2 className="font-display text-xs font-bold uppercase tracking-[0.14em] text-primary sm:text-sm">
                      1. Choose date
                    </h2>
                    <p className="shrink-0 text-[11px] text-muted sm:text-xs">
                      {formatDisplayDate(date)}
                      {date === today ? ' · Today' : ''}
                    </p>
                  </div>

                  <div ref={calendarRef} className="min-w-0">
                    <DateStrip
                      dates={dates}
                      value={date}
                      onChange={handleDateChange}
                      onOpenCalendar={() => setCalendarOpen((v) => !v)}
                    />

                    <AnimatePresence>
                      {calendarOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="relative z-20 mt-3 w-full min-w-0"
                        >
                          <MiniCalendar
                            value={date}
                            minISO={today}
                            maxISO={maxDate}
                            onSelect={handleDateChange}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </section>

                <section className={cn(panel, 'min-w-0 overflow-x-hidden p-3 sm:p-5')}>
                  <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-display text-xs font-bold uppercase tracking-[0.14em] text-primary sm:text-sm">
                      2. Select slots
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[9px] font-semibold uppercase tracking-wider text-muted sm:gap-x-3 sm:text-[10px]">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-sm border border-white/25 bg-bg" />
                        Free ({freeCount})
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-sm bg-primary" />
                        Selected ({selectedCount})
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-sm bg-white/15" />
                        Booked ({bookedCount})
                      </span>
                    </div>
                  </div>

                  {selectedCount > 0 && (
                    <div className="mb-3 flex max-w-full flex-wrap gap-1.5 sm:mb-4">
                      {selectedTimes.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => removeSlot(t)}
                          className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-2.5 py-1 text-[10px] font-semibold text-primary transition hover:bg-primary/25 sm:text-[11px]"
                        >
                          <span className="truncate">{shortSlotLabel(t)}</span>
                          <span aria-hidden>×</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <SlotPicker
                    slots={slots}
                    selectedTimes={selectedTimes}
                    onToggle={toggleSlot}
                    ratesByKey={ratesByKey}
                    loading={loadingSlots}
                  />
                </section>
              </div>

              <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
                <section
                  ref={detailsRef}
                  className={cn(panel, 'min-w-0 overflow-x-hidden p-3 sm:p-5')}
                >
                  <h2 className="font-display text-xs font-bold uppercase tracking-[0.14em] text-primary sm:text-sm">
                    3. Your details
                  </h2>
                  <p className="mt-1 text-[11px] text-muted sm:text-xs">
                    Almost done — we need these to confirm your booking.
                  </p>

                  <div className="mt-3 space-y-3 sm:mt-4">
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted">
                        Game <span className="text-primary">*</span>
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {GAMES.map((g) => {
                          const active = game === g
                          return (
                            <button
                              key={g}
                              type="button"
                              onClick={() => {
                                setGame(g)
                                setError('')
                              }}
                              className={cn(
                                'flex min-h-11 flex-col items-center justify-center rounded-xl border px-1 py-2 text-center transition active:scale-[0.97]',
                                active
                                  ? 'border-primary bg-primary text-bg shadow-[0_0_16px_rgb(132_211_33_/_0.28)]'
                                  : 'border-white/12 bg-bg/50 text-text hover:border-primary/50',
                              )}
                            >
                              <FaFutbol
                                className={active ? 'text-bg' : 'text-primary'}
                                size={12}
                              />
                              <span className="mt-1 text-[9px] font-bold uppercase leading-tight tracking-wide sm:text-[10px]">
                                {g === 'Box Cricket' ? 'Box' : g}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                        Your name <span className="text-primary">*</span>
                      </p>
                      <label
                        className={cn(
                          fieldShell,
                          nameOk && customerName && 'border-primary/40',
                        )}
                      >
                        <FaUser className="shrink-0 text-muted" size={13} />
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => {
                            setCustomerName(e.target.value)
                            setError('')
                          }}
                          placeholder="e.g. Rahul Patil"
                          className="h-full w-full bg-transparent py-2.5 pl-2.5 text-sm text-white outline-none placeholder:text-muted/70 sm:pl-3"
                          autoComplete="name"
                        />
                      </label>
                    </div>

                    <div>
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                        Phone number <span className="text-primary">*</span>
                      </p>
                      <label
                        className={cn(
                          fieldShell,
                          phoneOk && 'border-primary/40',
                        )}
                      >
                        <FaPhone className="shrink-0 text-muted" size={13} />
                        <input
                          type="tel"
                          inputMode="numeric"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value.replace(/[^\d\s+]/g, ''))
                            setError('')
                          }}
                          placeholder="10-digit mobile number"
                          className="h-full w-full bg-transparent py-2.5 pl-2.5 text-sm text-white outline-none placeholder:text-muted/70 sm:pl-3"
                          autoComplete="tel"
                          maxLength={14}
                        />
                      </label>
                    </div>

                    <div>
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                        Email <span className="text-primary">*</span>
                      </p>
                      <label
                        className={cn(
                          fieldShell,
                          emailOk && 'border-primary/40',
                        )}
                      >
                        <FaEnvelope className="shrink-0 text-muted" size={13} />
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => {
                            setCustomerEmail(e.target.value)
                            setError('')
                          }}
                          placeholder="you@example.com"
                          className="h-full w-full bg-transparent py-2.5 pl-2.5 text-sm text-white outline-none placeholder:text-muted/70 sm:pl-3"
                          autoComplete="email"
                        />
                      </label>
                      <p className="mt-1 text-[10px] text-muted">
                        Confirmation email will be sent here after admin approves.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-3.5 sm:mt-5 sm:p-4">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted sm:text-[10px]">
                      Booking summary
                    </p>
                    <p className="mt-1.5 font-display text-base font-bold text-text sm:text-lg">
                      {formatLongDate(date)}
                    </p>
                    {selectedCount === 0 ? (
                      <p className="mt-2 text-xs text-muted sm:text-sm">
                        Tap free slots above to add hours.
                      </p>
                    ) : (
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {selectedTimes.map((t) => (
                          <li
                            key={t}
                            className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary"
                          >
                            <FaCheck size={8} />
                            {shortSlotLabel(t)}
                          </li>
                        ))}
                      </ul>
                    )}
                    {game && (
                      <p className="mt-2 text-xs text-muted">
                        Game:{' '}
                        <span className="font-semibold text-text">{game}</span>
                      </p>
                    )}
                    <div className="mt-3 flex items-end justify-between border-t border-white/10 pt-3 sm:mt-4">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-muted sm:text-[10px]">
                          Est. total
                        </p>
                        <p className="font-display text-xl font-extrabold text-primary sm:text-2xl">
                          {selectedCount ? formatRupee(total) : '—'}
                        </p>
                      </div>
                      <p className="text-[11px] text-muted sm:text-xs">
                        {selectedCount} hr{selectedCount === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>

                  {error && (
                    <p className="mt-3 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-medium text-accent">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    onClick={(e) => {
                      if (!canSubmit) {
                        e.preventDefault()
                        handlePrimaryCta()
                      }
                    }}
                    className={cn(
                      'mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold uppercase tracking-[0.08em] transition active:scale-[0.99]',
                      canSubmit
                        ? 'bg-primary text-bg shadow-[0_0_28px_rgb(132_211_33_/_0.4)]'
                        : 'bg-primary/35 text-bg/90',
                    )}
                  >
                    {status === 'submitting' ? 'Booking…' : ctaLabel}
                  </button>

                  <p className="mt-2 text-center text-[11px] text-muted">
                    {canSubmit
                      ? 'Admin will get your request by email. You get confirmation after approval.'
                      : selectedCount === 0
                        ? 'First pick one or more free slots'
                        : 'Choose game, name, phone & email to unlock confirm'}
                  </p>
                </section>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </Container>
    </div>
  )
}
