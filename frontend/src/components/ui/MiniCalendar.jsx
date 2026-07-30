import { useEffect, useMemo, useState } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { cn } from '../../utils/cn'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function toISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function addMonths(date, count) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1)
}

/**
 * Month calendar popup. Selectable range: minISO .. maxISO (inclusive).
 */
export default function MiniCalendar({ value, minISO, maxISO, onSelect }) {
  const selected = value || minISO
  const [view, setView] = useState(() => startOfMonth(parseISO(selected)))

  useEffect(() => {
    setView(startOfMonth(parseISO(selected)))
  }, [selected])

  const cells = useMemo(() => {
    const first = startOfMonth(view)
    const startPad = first.getDay()
    const daysInMonth = new Date(
      view.getFullYear(),
      view.getMonth() + 1,
      0,
    ).getDate()

    const list = []
    for (let i = 0; i < startPad; i += 1) list.push(null)
    for (let day = 1; day <= daysInMonth; day += 1) {
      list.push(new Date(view.getFullYear(), view.getMonth(), day))
    }
    while (list.length % 7 !== 0) list.push(null)
    return list
  }, [view])

  const monthLabel = view.toLocaleString('en-IN', {
    month: 'long',
    year: 'numeric',
  })

  const canPrev =
    toISO(startOfMonth(view)) > toISO(startOfMonth(parseISO(minISO)))
  const canNext =
    toISO(startOfMonth(view)) < toISO(startOfMonth(parseISO(maxISO)))

  const todayMark = minISO

  return (
    <div className="w-full rounded-xl border border-primary/40 bg-card p-3 shadow-[0_16px_40px_rgb(0_0_0_/_0.55)]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => setView((v) => addMonths(v, -1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-text transition hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Previous month"
        >
          <HiChevronLeft size={18} />
        </button>
        <p className="font-display text-sm font-bold text-text">{monthLabel}</p>
        <button
          type="button"
          disabled={!canNext}
          onClick={() => setView((v) => addMonths(v, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-text transition hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Next month"
        >
          <HiChevronRight size={18} />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-1 text-center text-[10px] font-bold uppercase tracking-wider text-muted"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} className="h-9" />
          }

          const iso = toISO(date)
          const disabled = iso < minISO || iso > maxISO
          const active = iso === selected
          const isToday = iso === todayMark

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(iso)}
              className={cn(
                'flex h-9 items-center justify-center rounded-lg text-sm font-semibold transition',
                disabled && 'cursor-not-allowed text-muted/35',
                !disabled && !active && 'text-text hover:bg-primary/15',
                active && 'bg-primary text-bg',
                isToday && !active && !disabled && 'ring-1 ring-primary/50',
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
