import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminPricing, savePricingRates } from '../api/client'
import { clearAdminToken, getAdminToken } from '../api/authStorage'
import { pricing as fallbackPricing } from '../data/content'
import { cn } from '../utils/cn'

const ICONS = [
  { value: 'sun', label: 'Sun (Morning)' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'sunset', label: 'Sunset (Evening)' },
  { value: 'moon', label: 'Moon (Night)' },
]

function toEditable(rate, index) {
  return {
    key: rate.key || rate.id,
    name: rate.name || '',
    amount:
      Number(
        rate.amount ?? String(rate.price || '').replace(/[^\d]/g, ''),
      ) || 0,
    unit: rate.unit || '/hr',
    note: rate.note || '',
    icon: rate.icon || 'sun',
    popular: Boolean(rate.popular),
    sortOrder: rate.sortOrder ?? index + 1,
    active: rate.active !== false,
  }
}

const field =
  'mt-1 block h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

export default function AdminRates() {
  const navigate = useNavigate()
  const token = getAdminToken()
  const [rates, setRates] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const data = await getAdminPricing(token)
      const list = (data.rates || []).map(toEditable)
      setRates(
        list.length
          ? list
          : fallbackPricing.map((r, i) =>
              toEditable(
                {
                  ...r,
                  amount: Number(String(r.price).replace(/[^\d]/g, '')),
                },
                i,
              ),
            ),
      )
    } catch (err) {
      if (err.status === 401) {
        clearAdminToken()
        navigate('/admin/login', { replace: true })
        return
      }
      setError(err.message || 'Failed to load rates')
      setRates(
        fallbackPricing.map((r, i) =>
          toEditable(
            {
              ...r,
              amount: Number(String(r.price).replace(/[^\d]/g, '')),
            },
            i,
          ),
        ),
      )
    } finally {
      setLoading(false)
    }
  }, [token, navigate])

  useEffect(() => {
    load()
  }, [load])

  const updateField = (key, patch) => {
    setRates((prev) =>
      prev.map((r) => (r.key === key ? { ...r, ...patch } : r)),
    )
    setSuccess('')
    setError('')
  }

  const setPopular = (key) => {
    setRates((prev) =>
      prev.map((r) => ({
        ...r,
        popular: r.key === key,
      })),
    )
    setSuccess('')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    for (const r of rates) {
      if (!r.name.trim() || !r.note.trim()) {
        setError('Name and time note are required for every rate')
        return
      }
      if (!Number.isFinite(Number(r.amount)) || Number(r.amount) < 0) {
        setError(`Invalid amount for ${r.name}`)
        return
      }
    }

    setSaving(true)
    try {
      const data = await savePricingRates(
        token,
        rates.map((r) => ({
          ...r,
          amount: Math.round(Number(r.amount)),
          name: r.name.trim().toUpperCase(),
          note: r.note.trim(),
        })),
      )
      setRates((data.rates || []).map(toEditable))
      setSuccess('Rates saved — website pricing updated')
    } catch (err) {
      if (err.status === 401) {
        clearAdminToken()
        navigate('/admin/login', { replace: true })
        return
      }
      setError(err.message || 'Failed to save rates')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Website rates
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Edit prices shown on the public pricing section. Changes go live
            after save.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 hover:border-primary/50"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading rates…</p>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {rates.map((rate) => (
              <div
                key={rate.key}
                className={cn(
                  'rounded-2xl border bg-white p-4 shadow-[0_8px_30px_rgb(15_23_42_/_0.04)] sm:p-5',
                  rate.popular ? 'border-primary/50 ring-1 ring-primary/20' : 'border-slate-200',
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {rate.key}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <input
                        type="checkbox"
                        checked={rate.popular}
                        onChange={() => setPopular(rate.key)}
                        className="rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      Popular
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <input
                        type="checkbox"
                        checked={rate.active}
                        onChange={(e) =>
                          updateField(rate.key, { active: e.target.checked })
                        }
                        className="rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      Visible
                    </label>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="block text-xs font-medium text-slate-500">
                    Display name
                    <input
                      type="text"
                      value={rate.name}
                      onChange={(e) =>
                        updateField(rate.key, { name: e.target.value })
                      }
                      className={field}
                      required
                    />
                  </label>

                  <label className="block text-xs font-medium text-slate-500">
                    Price (₹ / hour)
                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={rate.amount}
                      onChange={(e) =>
                        updateField(rate.key, { amount: e.target.value })
                      }
                      className={field}
                      required
                    />
                  </label>

                  <label className="block text-xs font-medium text-slate-500">
                    Time window
                    <input
                      type="text"
                      value={rate.note}
                      onChange={(e) =>
                        updateField(rate.key, { note: e.target.value })
                      }
                      className={field}
                      placeholder="6AM – 12PM"
                      required
                    />
                  </label>

                  <label className="block text-xs font-medium text-slate-500">
                    Icon
                    <select
                      value={rate.icon}
                      onChange={(e) =>
                        updateField(rate.key, { icon: e.target.value })
                      }
                      className={field}
                    >
                      {ICONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Website preview
                  </p>
                  <p className="mt-1 font-display text-xl font-bold text-slate-900">
                    ₹{Number(rate.amount) || 0}
                    <span className="ml-1 text-sm font-medium text-slate-500">
                      {rate.unit}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">{rate.note}</p>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="h-11 rounded-xl bg-primary px-6 text-xs font-bold uppercase tracking-wide text-slate-900 transition hover:brightness-105 disabled:opacity-60 sm:text-sm"
          >
            {saving ? 'Saving…' : 'Save rates'}
          </button>
        </form>
      )}
    </div>
  )
}
