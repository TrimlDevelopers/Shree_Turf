import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  FaCalendarCheck,
  FaTags,
  FaChartPie,
  FaExternalLinkAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa'
import { clearAdminToken } from '../api/authStorage'
import { siteInfo } from '../data/site'
import { cn } from '../utils/cn'
import Seo from '../components/seo/Seo'

const LOGO = '/turflogo.jpeg'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: FaChartPie, end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: FaCalendarCheck },
  { to: '/admin/rates', label: 'Rates', icon: FaTags },
]

const TITLES = {
  '/admin': 'Dashboard',
  '/admin/bookings': 'Bookings',
  '/admin/rates': 'Rates',
}

const SUBTITLES = {
  '/admin': 'Overview of turf operations',
  '/admin/bookings': 'Confirm, cancel, and create slots',
  '/admin/rates': 'Update prices shown on the website',
}

function BrandBlock({ compact = false }) {
  return (
    <div className={cn('flex items-center gap-3', compact && 'gap-2.5')}>
      <img
        src={LOGO}
        alt={siteInfo.name}
        className={cn(
          'rounded-full object-cover ring-2 ring-primary/30 shadow-[0_0_20px_rgb(132_211_33_/_0.2)]',
          compact ? 'h-9 w-9' : 'h-12 w-12',
        )}
      />
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
          Admin portal
        </p>
        <p
          className={cn(
            'truncate font-display font-bold leading-tight text-slate-900',
            compact ? 'text-sm' : 'text-base',
          )}
        >
          {siteInfo.shortName}
        </p>
        {!compact && (
          <p className="mt-0.5 truncate text-xs text-slate-500">
            Operations console
          </p>
        )}
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const logout = () => {
    clearAdminToken()
    navigate('/admin/login', { replace: true })
  }

  const pageTitle = TITLES[location.pathname] || 'Admin'
  const pageSubtitle = SUBTITLES[location.pathname] || ''

  const NavItems = ({ onNavigate }) => (
    <nav className="flex flex-col gap-1 p-3">
      <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        Menu
      </p>
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
              isActive
                ? 'bg-primary text-slate-900 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0 opacity-80" />
          {label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="min-h-dvh bg-[#eef2ec] text-slate-900">
      <Seo
        title={`${pageTitle} | Admin · ${siteInfo.shortName}`}
        description="Shree Turf 360° admin panel."
        path={location.pathname}
        noindex
      />
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="border-b border-slate-100 px-4 py-5">
          <BrandBlock />
        </div>

        <div className="flex-1 overflow-y-auto">
          <NavItems />
        </div>

        <div className="space-y-1 border-t border-slate-100 p-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <FaExternalLinkAlt className="h-3.5 w-3.5" />
            View website
          </a>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <FaSignOutAlt className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <BrandBlock compact />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavItems onNavigate={() => setMobileOpen(false)} />
            </div>
            <div className="space-y-1 border-t border-slate-100 p-3">
              <a
                href="/"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600"
              >
                <FaExternalLinkAlt className="h-3.5 w-3.5" />
                View website
              </a>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600"
              >
                <FaSignOutAlt className="h-4 w-4" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
          <div className="flex h-14 items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden"
                aria-label="Open menu"
              >
                <FaBars />
              </button>
              <img
                src={LOGO}
                alt=""
                className="hidden h-9 w-9 rounded-full object-cover ring-2 ring-primary/25 sm:block lg:hidden"
              />
              <div className="min-w-0">
                <h1 className="truncate font-display text-lg font-bold text-slate-900 sm:text-xl">
                  {pageTitle}
                </h1>
                {pageSubtitle && (
                  <p className="hidden truncate text-xs text-slate-500 sm:block">
                    {pageSubtitle}
                  </p>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
