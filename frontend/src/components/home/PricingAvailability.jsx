import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaSun, FaCloudSun, FaMoon } from 'react-icons/fa'
import { WiDaySunnyOvercast } from 'react-icons/wi'
import { pricing as fallbackPricing } from '../../data/content'
import { getPricing } from '../../api/client'
import Container from '../ui/Container'

const icons = {
  sun: FaSun,
  afternoon: WiDaySunnyOvercast,
  sunset: FaCloudSun,
  moon: FaMoon,
}

export default function PricingAvailability() {
  const [pricing, setPricing] = useState(fallbackPricing)

  useEffect(() => {
    let cancelled = false
    getPricing()
      .then((data) => {
        if (cancelled) return
        const rates = data.rates || []
        if (rates.length) setPricing(rates)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section
      id="pricing"
      className="pb-8 pt-12 sm:pb-10 sm:pt-14 md:pb-14 md:pt-20 lg:pt-24"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-xl font-bold text-text sm:text-2xl md:text-3xl lg:text-4xl"
          >
            Simple Pricing.{' '}
            <span className="text-primary">Play More.</span>
          </motion.h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted md:text-base">
            Morning to overnight — pick your window and book the pitch.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-4">
          {pricing.map((plan, index) => {
            const Icon = icons[plan.icon] || FaSun
            const isPopular = Boolean(plan.popular)

            return (
              <motion.div
                key={plan.id || plan.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.06, duration: 0.45 }}
                className={
                  isPopular
                    ? 'relative flex min-w-0 flex-col items-center rounded-2xl border-2 border-primary bg-card/60 px-3 py-5 text-center shadow-[0_0_28px_rgb(132_211_33_/_0.18)] sm:px-4 sm:py-6'
                    : 'relative flex min-w-0 flex-col items-center rounded-2xl border border-primary/40 bg-card/40 px-3 py-5 text-center transition hover:border-primary/70 sm:px-4 sm:py-6'
                }
              >
                {isPopular && (
                  <span className="absolute -top-2 right-2 rounded bg-accent px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-bg sm:text-[9px]">
                    Popular
                  </span>
                )}
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary sm:h-10 sm:w-10">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-text sm:text-xs">
                  {plan.name}
                </p>
                <p className="mt-0.5 text-[10px] text-muted sm:text-[11px]">
                  {plan.note}
                </p>
                <p className="mt-2 font-display text-2xl font-extrabold text-text sm:text-3xl">
                  {plan.price}
                  <span className="ml-0.5 text-xs font-normal text-muted">
                    {plan.unit}
                  </span>
                </p>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
