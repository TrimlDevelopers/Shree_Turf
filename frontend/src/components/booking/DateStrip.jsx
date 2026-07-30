import { useEffect, useRef } from 'react'
import { FaCalendarAlt } from 'react-icons/fa'
import { cn } from '../../utils/cn'
import { todayISO } from '../../utils/booking'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function parseParts(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m, d, date: new Date(y, m - 1, d) }
}

/**
 * Horizontal day strip — scrolls only inside itself (never the page).
 */
export default function DateStrip({ dates, value, onChange, onOpenCalendar }) {
  const scrollerRef = useRef(null)
  const today = todayISO()

  useEffect(() => {
    const root = scrollerRef.current
    if (!root) return
    const active = root.querySelector('[data-active="true"]')
    if (!active) return

    const target =
      active.offsetLeft - (root.clientWidth - active.offsetWidth) / 2
    root.scrollTo({
      left: Math.max(0, target),
      behavior: 'smooth',
    })
  }, [value])

  return (
    <div className="flex w-full min-w-0 items-stretch gap-2">
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-3 bg-gradient-to-r from-card via-card/80 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-3 bg-gradient-to-l from-card via-card/80 to-transparent"
        />
        <div
          ref={scrollerRef}
          className="flex w-full gap-2 overflow-x-auto overscroll-x-contain scroll-smooth pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          role="listbox"
          aria-label="Select date"
        >
          {dates.map((iso) => {
            const { date } = parseParts(iso)
            const active = iso === value
            const isToday = iso === today
            return (
              <button
                key={iso}
                type="button"
                role="option"
                aria-selected={active}
                data-active={active ? 'true' : undefined}
                onClick={() => onChange(iso)}
                className={cn(
                  'flex w-[3.6rem] shrink-0 snap-start flex-col items-center rounded-xl border px-1 py-2 transition active:scale-[0.97] sm:w-16 sm:rounded-2xl sm:px-1.5 sm:py-2.5 md:w-[4.25rem]',
                  active
                    ? 'border-primary bg-primary text-bg shadow-[0_0_20px_rgb(132_211_33_/_0.3)]'
                    : 'border-white/12 bg-bg/50 text-text hover:border-primary/45 hover:bg-primary/10',
                )}
              >
                <span
                  className={cn(
                    'text-[8px] font-semibold uppercase tracking-wider sm:text-[9px]',
                    active ? 'text-bg/80' : 'text-muted',
                  )}
                >
                  {isToday ? 'Today' : WEEKDAYS[date.getDay()]}
                </span>
                <span className="mt-0.5 font-display text-base font-extrabold leading-none sm:text-lg md:text-xl">
                  {date.getDate()}
                </span>
                <span
                  className={cn(
                    'mt-0.5 text-[8px] font-medium uppercase sm:text-[9px]',
                    active ? 'text-bg/75' : 'text-muted',
                  )}
                >
                  {date.toLocaleString('en-IN', { month: 'short' })}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {onOpenCalendar && (
        <button
          type="button"
          onClick={onOpenCalendar}
          className="flex w-10 shrink-0 flex-col items-center justify-center rounded-xl border border-primary/35 bg-primary/10 text-primary transition hover:border-primary hover:bg-primary/15 sm:w-12 sm:rounded-2xl"
          aria-label="Open calendar"
        >
          <FaCalendarAlt className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="mt-0.5 text-[7px] font-bold uppercase tracking-wider text-muted sm:text-[8px]">
            Cal
          </span>
        </button>
      )}
    </div>
  )
}
