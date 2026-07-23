import Hero from '../components/home/Hero'
import FacilitiesBar from '../components/home/FacilitiesBar'
import PricingAvailability from '../components/home/PricingAvailability'
import Gallery from '../components/home/Gallery'
import InfoGrid from '../components/home/InfoGrid'
import CTABanner from '../components/home/CTABanner'

export default function Home() {
  return (
    <>
      <Hero />
      <FacilitiesBar />
      <PricingAvailability />
      <Gallery />
      <InfoGrid />
      <CTABanner />
    </>
  )
}
