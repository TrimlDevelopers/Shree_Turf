import { FaCheck } from 'react-icons/fa'
import { cn } from '../../utils/cn'
import {
  PERIOD_META,
  periodKeyForSlot,
  rateAmount,
  shortSlotLabel,
} from '../../utils/booking'

const slotGrid =
  'grid w-full min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'

export default function SlotPicker({
  slots,
  selectedTimes,
  onToggle,
  ratesByKey,
  loading,
}) {
  const grouped = PERIOD_META.map((period) => ({
    ...period,
    items: (slots || []).filter(
      (s) => periodKeyForSlot(s.time) === period.key,
    ),
  })).filter((g) => g.items.length > 0)

  if (loading) {
    return (
      <div className={slotGrid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-xl border border-white/8 bg-white/5 sm:h-16"
          />
        ))}
      </div>
    )
  }

  if (!slots?.length) {
    return (
      <p className="rounded-xl border border-white/10 bg-bg/40 px-4 py-8 text-center text-sm text-muted">
        No slots available for this date.
      </p>
    )
  }

  return (
    <div className="w-full min-w-0 space-y-4 sm:space-y-5">
      {grouped.map((group) => {
        const rate = ratesByKey[group.key]
        const amount = rateAmount(rate)
        const freeInGroup = group.items.filter(
          (s) => s.status === 'available',
        ).length

        return (
          <div key={group.key} className="min-w-0">
            <div className="mb-2 flex items-end justify-between gap-2 sm:mb-2.5 sm:gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <h3 className="font-display text-xs font-bold uppercase tracking-[0.12em] text-text sm:text-sm md:text-base">
                    {group.label}
                  </h3>
                  <span className="text-[10px] text-muted">{freeInGroup} free</span>
                </div>
                <p className="text-[10px] text-muted sm:text-[11px]">{group.range}</p>
              </div>
              {amount > 0 && (
                <p className="shrink-0 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary sm:px-2.5 sm:py-1 sm:text-[11px]">
                  ₹{amount}
                  <span className="font-normal text-muted">/hr</span>
                </p>
              )}
            </div>

            <div className={slotGrid}>
              {group.items.map((slot) => {
                const booked = slot.status === 'booked'
                const selected = selectedTimes.includes(slot.time)
                return (
                  <button
                    key={slot.id || slot.time}
                    type="button"
                    disabled={booked}
                    onClick={() => onToggle(slot)}
                    className={cn(
                      'relative flex min-h-14 w-full min-w-0 flex-col items-center justify-center rounded-xl border px-1 py-2 text-center transition active:scale-[0.97] sm:min-h-16 sm:px-1.5 sm:py-2.5',
                      booked &&
                        'cursor-not-allowed border-white/5 bg-white/[0.03] text-muted/40',
                      !booked &&
                        !selected &&
                        'border-white/12 bg-bg/45 text-text hover:border-primary/55 hover:bg-primary/10',
                      selected &&
                        'border-primary bg-primary text-bg shadow-[0_0_16px_rgb(132_211_33_/_0.28)]',
                    )}
                    aria-pressed={selected}
                  >
                    {selected && (
                      <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-bg/25">
                        <FaCheck size={7} />
                      </span>
                    )}
                    <span className="w-full truncate text-[10px] font-bold leading-tight sm:text-[11px] md:text-xs">
                      {shortSlotLabel(slot.time)}
                    </span>
                    <span
                      className={cn(
                        'mt-0.5 text-[8px] font-semibold uppercase tracking-wider sm:mt-1 sm:text-[9px]',
                        booked && 'text-red-400/80',
                        selected && 'text-bg/80',
                        !booked && !selected && 'text-primary',
                      )}
                    >
                      {booked ? 'Booked' : selected ? 'Selected' : 'Free'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
