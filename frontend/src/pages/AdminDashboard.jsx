import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaTags,
  FaArrowRight,
} from 'react-icons/fa'
import { getAdminPricing, listBookings } from '../api/client'
import { clearAdminToken, getAdminToken } from '../api/authStorage'
import { siteInfo } from '../data/site'
import { cn } from '../utils/cn'

const LOGO = '/turflogo.jpeg'

function StatCard({ icon: Icon, label, value, hint, tone }) {
  const tones = {
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    slate: 'bg-slate-100 text-slate-700',
    lime: 'bg-primary/15 text-secondary',
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgb(15_23_42_/_0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-slate-900">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        <span className={cn('rounded-xl p-3', tones[tone] || tones.slate)}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const token = getAdminToken()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    today: 0,
    rates: 0,
  })

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const today = new Date().toISOString().slice(0, 10)
      const [pending, confirmed, todayList, pricing] = await Promise.all([
        listBookings(token, { status: 'pending' }),
        listBookings(token, { status: 'confirmed' }),
        listBookings(token, { date: today }),
        getAdminPricing(token).catch(() => ({ rates: [] })),
      ])
      setStats({
        pending: pending.bookings?.length || 0,
        confirmed: confirmed.bookings?.length || 0,
        today: todayList.bookings?.length || 0,
        rates: pricing.rates?.length || 0,
      })
    } catch (err) {
      if (err.status === 401) {
        clearAdminToken()
        navigate('/admin/login', { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }, [token, navigate])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(15_23_42_/_0.04)]">
        <div className="relative flex flex-col gap-4 bg-[linear-gradient(135deg,#111111_0%,#1a2e12_55%,#84d321_160%)] px-5 py-6 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-7">
          <div className="flex items-center gap-4">
            <img
              src={LOGO}
              alt={siteInfo.name}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/50 shadow-lg sm:h-16 sm:w-16"
            />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Welcome back
              </p>
              <h2 className="font-display text-xl font-bold sm:text-2xl">
                {siteInfo.name}
              </h2>
              <p className="mt-1 text-sm text-white/70">
                Manage turf bookings and live website rates from one place.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={load}
            className="self-start rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur transition hover:bg-white/20"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading dashboard…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={FaClock}
            label="Pending"
            value={stats.pending}
            hint="Awaiting confirmation"
            tone="amber"
          />
          <StatCard
            icon={FaCheckCircle}
            label="Confirmed"
            value={stats.confirmed}
            hint="Active reservations"
            tone="green"
          />
          <StatCard
            icon={FaCalendarCheck}
            label="Today"
            value={stats.today}
            hint="Bookings for today"
            tone="lime"
          />
          <StatCard
            icon={FaTags}
            label="Rate cards"
            value={stats.rates}
            hint="Shown on website"
            tone="slate"
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/admin/bookings"
          className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgb(15_23_42_/_0.04)] transition hover:border-primary/40"
        >
          <div>
            <p className="font-display text-lg font-bold text-slate-900">
              Manage bookings
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Confirm, cancel, or create walk-in slots
            </p>
          </div>
          <FaArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-secondary" />
        </Link>

        <Link
          to="/admin/rates"
          className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgb(15_23_42_/_0.04)] transition hover:border-primary/40"
        >
          <div>
            <p className="font-display text-lg font-bold text-slate-900">
              Edit website rates
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Update morning to night pricing live
            </p>
          </div>
          <FaArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-secondary" />
        </Link>
      </div>
    </div>
  )
}
