import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const BookingDraftContext = createContext(null)

export function BookingDraftProvider({ children }) {
  const [draft, setDraft] = useState({
    date: '',
    times: [],
    version: 0,
  })

  const applyDraft = useCallback((next) => {
    setDraft((prev) => ({
      date: next.date || '',
      times: Array.isArray(next.times) ? next.times : [],
      version: prev.version + 1,
    }))
  }, [])

  const value = useMemo(() => ({ draft, applyDraft }), [draft, applyDraft])

  return (
    <BookingDraftContext.Provider value={value}>
      {children}
    </BookingDraftContext.Provider>
  )
}

export function useBookingDraft() {
  const ctx = useContext(BookingDraftContext)
  if (!ctx) {
    throw new Error('useBookingDraft must be used within BookingDraftProvider')
  }
  return ctx
}

/** Fired after a booking is created so availability panels can refresh. */
export const BOOKINGS_CHANGED = 'shree:bookings-changed'

export function notifyBookingsChanged() {
  window.dispatchEvent(new Event(BOOKINGS_CHANGED))
}
