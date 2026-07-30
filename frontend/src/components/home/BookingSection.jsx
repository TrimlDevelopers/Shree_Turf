import Container from '../ui/Container'
import MotionReveal from '../ui/MotionReveal'
import HeroQuickBook from './HeroQuickBook'

export default function BookingSection() {
  return (
    <section
      id="book-slot"
      className="relative scroll-mt-28 border-y border-primary/10 bg-card/25 py-14 md:py-16 lg:py-20"
    >
      <Container>
        <MotionReveal className="mx-auto max-w-lg text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Quick Booking
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-text sm:text-3xl">
            Reserve Your Hour
          </h2>
          <p className="mt-2 text-sm text-muted">
            Pick a date, time, and game — we&apos;ll check if the pitch is free.
          </p>
        </MotionReveal>

        <MotionReveal delay={0.1} className="mt-8 flex justify-center md:mt-10">
          <HeroQuickBook />
        </MotionReveal>
      </Container>
    </section>
  )
}
