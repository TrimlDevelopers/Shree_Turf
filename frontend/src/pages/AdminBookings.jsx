import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  deleteBooking,
  listBookings,
  updateBookingStatus,
} from '../api/client'
import { clearAdminToken, getAdminToken } from '../api/authStorage'
import { cn } from '../utils/cn'
import { notifyBookingsChanged } from '../contexts/BookingDraftContext'
import AdminBookForm from './AdminBookForm'

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
]

function formatDisplayDate(value) {
  if (!value) return ''
  const [y, m, d] = value.split('-')
  return `${d}/${m}/${y}`
}

function statusClass(status) {
  if (status === 'confirmed') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }
  if (status === 'cancelled') {
    return 'bg-red-50 text-red-600 border-red-200'
  }
  return 'bg-amber-50 text-amber-700 border-amber-200'
}

export default function AdminBookings() {
  const navigate = useNavigate()
  const token = getAdminToken()
  const [bookings, setBookings] = useState([])
  const [status, setStatus] = useState('pending')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const data = await listBookings(token, {
        date: date || undefined,
        status: status || undefined,
      })
      setBookings(data.bookings || [])
    } catch (err) {
      if (err.status === 401) {
        clearAdminToken()
        navigate('/admin/login', { replace: true })
        return
      }
      setError(err.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [token, date, status, navigate])

  useEffect(() => {
    load()
  }, [load])

  const onStatusChange = async (id, nextStatus) => {
    setBusyId(id)
    setError('')
    try {
      await updateBookingStatus(token, id, nextStatus)
      notifyBookingsChanged()
      await load()
    } catch (err) {
      setError(err.message || 'Update failed')
    } finally {
      setBusyId(null)
    }
  }

  const onDelete = async (id) => {
    if (!window.confirm('Delete this booking permanently?')) return
    setBusyId(id)
    setError('')
    try {
      await deleteBooking(token, id)
      notifyBookingsChanged()
      await load()
    } catch (err) {
      setError(err.message || 'Delete failed')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900">
          Bookings
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage customer requests and walk-in reservations.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value || 'all'}
              type="button"
              onClick={() => setStatus(f.value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition',
                status === f.value
                  ? 'border-primary bg-primary text-slate-900'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-primary/50 hover:text-slate-900',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <label className="block text-xs font-medium text-slate-500">
          Filter by date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </div>

      <AdminBookForm
        token={token}
        onCreated={() => {
          setStatus('confirmed')
          load()
        }}
      />

      {error && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(15_23_42_/_0.04)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Slots</th>
              <th className="px-4 py-3 font-semibold">Game</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr
                  key={b._id}
                  className="border-t border-slate-100 align-top hover:bg-slate-50/70"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-slate-800">
                    {formatDisplayDate(b.date)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{b.customerName}</p>
                    <p className="text-xs text-slate-500">{b.phone}</p>
                    {b.customerEmail ? (
                      <p className="text-xs text-slate-500">{b.customerEmail}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-700">
                    <ul className="space-y-0.5">
                      {(b.slots || []).map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-slate-800">{b.game}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                        statusClass(b.status),
                      )}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {b.status !== 'confirmed' && (
                        <button
                          type="button"
                          disabled={busyId === b._id}
                          onClick={() => onStatusChange(b._id, 'confirmed')}
                          className="rounded-lg bg-primary px-2.5 py-1 text-[10px] font-bold uppercase text-slate-900 disabled:opacity-60"
                        >
                          Confirm
                        </button>
                      )}
                      {b.status !== 'cancelled' && (
                        <button
                          type="button"
                          disabled={busyId === b._id}
                          onClick={() => onStatusChange(b._id, 'cancelled')}
                          className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase text-red-600 disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      )}
                      {b.status === 'cancelled' && (
                        <button
                          type="button"
                          disabled={busyId === b._id}
                          onClick={() => onStatusChange(b._id, 'pending')}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase text-slate-600 disabled:opacity-60"
                        >
                          Restore
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={busyId === b._id}
                        onClick={() => onDelete(b._id)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase text-slate-500 hover:text-slate-800 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
