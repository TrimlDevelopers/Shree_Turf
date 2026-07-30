import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminLogin } from '../api/client'
import { setAdminToken } from '../api/authStorage'
import { siteInfo } from '../data/site'
import Seo from '../components/seo/Seo'

const LOGO = '/turflogo.jpeg'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await adminLogin(email.trim(), password)
      setAdminToken(data.token)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#eef2ec] px-4 py-10">
      <Seo
        title={`Admin Login | ${siteInfo.shortName}`}
        description="Admin login for Shree Turf 360°."
        path="/admin/login"
        noindex
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgb(132_211_33_/_0.18),_transparent_55%)]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <img
            src={LOGO}
            alt={siteInfo.name}
            className="h-20 w-20 rounded-full object-cover shadow-[0_12px_40px_rgb(132_211_33_/_0.35)] ring-4 ring-white"
          />
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.22em] text-secondary">
            Admin portal
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-slate-900">
            {siteInfo.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage bookings & website rates
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgb(15_23_42_/_0.1)] sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>

            {error && (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold uppercase tracking-wide text-slate-900 transition hover:brightness-105 disabled:opacity-70"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <Link
            to="/"
            className="mt-6 block text-center text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-secondary"
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  )
}
