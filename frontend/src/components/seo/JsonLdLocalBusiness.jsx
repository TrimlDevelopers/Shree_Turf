import { useEffect } from 'react'
import { siteInfo } from '../../data/site'

const SCRIPT_ID = 'shree-turf-jsonld'

/**
 * LocalBusiness / sports activity structured data for Google.
 */
export default function JsonLdLocalBusiness() {
  useEffect(() => {
    const data = {
      '@context': 'https://schema.org',
      '@type': ['SportsActivityLocation', 'LocalBusiness'],
      name: siteInfo.name,
      description: siteInfo.seo.description,
      url: siteInfo.siteUrl,
      telephone: siteInfo.phone,
      email: siteInfo.email,
      image: `${siteInfo.siteUrl}${siteInfo.seo.ogImagePath}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Balaji chowk, near Balaji Patsansatha, Asara Nagar',
        addressLocality: 'Ichalkaranji',
        addressRegion: 'Maharashtra',
        postalCode: '416115',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        // Approximate Asara Nagar, Ichalkaranji — update if you have exact coords
        latitude: 16.6913,
        longitude: 74.4629,
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '06:00',
        closes: '06:00',
      },
      sameAs: [siteInfo.instagram, siteInfo.facebook].filter(Boolean),
      priceRange: '₹₹',
      areaServed: {
        '@type': 'City',
        name: 'Ichalkaranji',
      },
    }

    let script = document.getElementById(SCRIPT_ID)
    if (!script) {
      script = document.createElement('script')
      script.id = SCRIPT_ID
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(data)

    return () => {
      script?.remove()
    }
  }, [])

  return null
}
