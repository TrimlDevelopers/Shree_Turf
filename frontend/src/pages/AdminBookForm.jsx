import { useEffect, useState } from 'react'
import { createAdminBooking, getSlots } from '../api/client'
import { timeSlots } from '../data/content'
import { siteInfo } from '../data/site'
import { notifyBookingsChanged } from '../contexts/BookingDraftContext'
import { cn } from '../utils/cn'

const GAMES = ['Football', 'Cricket', 'Box Cricket']

function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const field =
  'mt-1 block h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

export default function AdminBookForm({ token, onCreated }) {
  const today = todayISO()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(today)
  const [selectedTimes, setSelectedTimes] = useState([])
  const [game, setGame] = useState('Football')
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [slotRows, setSlotRows] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!open || !date) return
    let cancelled = false
    setLoadingSlots(true)
    getSlots(date)
      .then((data) => {
        if (cancelled) return
        setSlotRows(data.slots || [])
        const booked = new Set(
          (data.slots || [])
            .filter((s) => s.status === 'booked')
            .map((s) => s.time),
        )
        setSelectedTimes((prev) => prev.filter((t) => !booked.has(t)))
      })
      .catch(() => {
        if (!cancelled) {
          setSlotRows(
            timeSlots.map((time, i) => ({
              id: `${date}-${i}`,
              time,
              status: 'available',
            })),
          )
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false)
      })
    return () => {
      cancelled = true
    }
  }, [open, date])

  const toggleTime = (time, taken) => {
    if (taken) return
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    )
    setError('')
  }

  const availableTimes = slotRows
    .filter((s) => s.status === 'available')
    .map((s) => s.time)

  const allFreeSelected =
    availableTimes.length > 0 &&
    availableTimes.every((t) => selectedTimes.includes(t))

  const reserveFullDay = () => {
    if (availableTimes.length === 0) {
      setError('No free slots left on this date')
      return
    }
    setSelectedTimes(availableTimes)
    setError('')
    setSuccess('')
    if (!notes.trim()) {
      setNotes('Full day reservation')
    }
    if (!customerName.trim()) {
      setCustomerName('Full day block')
    }
    if (!phone.trim()) {
      setPhone(siteInfo.phone.replace(/\s/g, ''))
    }
  }

  const clearSlots = () => {
    setSelectedTimes([])
    setError('')
  }

  const reset = () => {
    setDate(today)
    setSelectedTimes([])
    setGame('Football')
    setCustomerName('')
    setPhone('')
    setCustomerEmail('')
    setNotes('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!date || selectedTimes.length === 0 || !game || !customerName.trim() || !phone.trim()) {
      setError('Fill date, at least one slot, game, name, and phone')
      return
    }

    const isFullDay =
      availableTimes.length > 0 &&
      availableTimes.every((t) => selectedTimes.includes(t))

    setSubmitting(true)
    try {
      await createAdminBooking(token, {
        date,
        slots: selectedTimes,
        game,
        customerName: customerName.trim(),
        phone: phone.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        notes: notes.trim() || (isFullDay ? 'Full day reservation' : ''),
      })
      notifyBookingsChanged()
      setSuccess(
        isFullDay
          ? `Full day reserved (${selectedTimes.length} slots)`
          : 'Booking created and confirmed',
      )
      reset()
      onCreated?.()
    } catch (err) {
      setError(err.message || 'Could not create booking')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v)
          setError('')
          setSuccess('')
        }}
        className="rounded-xl bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-900 transition hover:brightness-105"
      >
        {open ? 'Close form' : '+ Book slot'}
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgb(15_23_42_/_0.04)] sm:p-5"
        >
          <p className="text-sm font-semibold text-slate-900">
            Create booking (confirmed immediately)
          </p>
          <p className="mt-1 text-xs text-slate-500">
            For walk-ins or phone bookings. Slots are locked as soon as you save.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block text-xs font-medium text-slate-500">
              Date
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                  setSelectedTimes([])
                }}
                className={field}
                required
              />
            </label>

            <label className="block text-xs font-medium text-slate-500">
              Game
              <select
                value={game}
                onChange={(e) => setGame(e.target.value)}
                className={field}
              >
                {GAMES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs font-medium text-slate-500 sm:col-span-2 lg:col-span-1">
              Customer name
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={field}
                placeholder="Name"
                required
              />
            </label>

            <label className="block text-xs font-medium text-slate-500">
              Phone
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={field}
                placeholder="Phone number"
                required
              />
            </label>

            <label className="block text-xs font-medium text-slate-500">
              Email (optional)
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className={field}
                placeholder="customer@email.com"
              />
            </label>

            <label className="block text-xs font-medium text-slate-500 sm:col-span-2">
              Notes (optional)
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={field}
                placeholder="Walk-in, cash, etc."
              />
            </label>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-medium text-slate-500">Time slots</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={reserveFullDay}
                  disabled={loadingSlots || availableTimes.length === 0}
                  className={cn(
                    'rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition disabled:opacity-40',
                    allFreeSelected
                      ? 'border-primary bg-primary/15 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-primary/50',
                  )}
                >
                  Reserve full day
                  {availableTimes.length > 0
                    ? ` (${availableTimes.length})`
                    : ''}
                </button>
                {selectedTimes.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSlots}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 hover:text-slate-800"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            {loadingSlots ? (
              <p className="mt-2 text-xs text-slate-400">Loading slots…</p>
            ) : (
              <div className="mt-2 grid max-h-48 grid-cols-2 gap-1.5 overflow-y-auto sm:grid-cols-3 md:grid-cols-4">
                {slotRows.map((slot) => {
                  const taken = slot.status === 'booked'
                  const selected = selectedTimes.includes(slot.time)
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={taken}
                      onClick={() => toggleTime(slot.time, taken)}
                      className={cn(
                        'rounded-lg border px-2 py-2 text-left text-[11px] font-medium transition',
                        taken &&
                          'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300',
                        !taken &&
                          !selected &&
                          'border-slate-200 bg-white text-slate-700 hover:border-primary/50',
                        selected &&
                          'border-primary bg-primary/15 text-slate-900',
                      )}
                    >
                      <span className="block">{slot.time}</span>
                      <span
                        className={cn(
                          'text-[9px] font-bold uppercase tracking-wider',
                          taken ? 'text-red-400' : 'text-emerald-600',
                        )}
                      >
                        {taken ? 'Booked' : selected ? 'Selected' : 'Free'}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
            {allFreeSelected && availableTimes.length > 0 && (
              <p className="mt-2 text-xs font-medium text-emerald-700">
                Full day selected — all {availableTimes.length} free slots will
                be locked.
              </p>
            )}
          </div>

          {error && (
            <p className="mt-3 text-sm font-medium text-amber-700">{error}</p>
          )}
          {success && (
            <p className="mt-3 text-sm font-medium text-emerald-700">{success}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 h-10 rounded-xl bg-primary px-5 text-xs font-bold uppercase tracking-wide text-slate-900 transition hover:brightness-105 disabled:opacity-60"
          >
            {submitting
              ? 'Saving…'
              : allFreeSelected
                ? 'Confirm full day'
                : 'Confirm booking'}
          </button>
        </form>
      )}
    </div>
  )
}
