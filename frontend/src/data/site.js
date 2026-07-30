export const siteInfo = {
  name: 'SHREE TURF 360°',
  shortName: 'SHREE TURF',
  tagline: 'आपली माणसं आपलं मैदान',
  taglineAlt: 'इचलकरंजीकरांची हक्काची Turf!',
  location: 'Ichalkaranji, Maharashtra',
  address:
    'Balaji chowk, near Balaji Patsansatha, Asara Nagar, Ichalkaranji, Maharashtra 416115',
  addressLines: [
    'Balaji chowk, near Balaji Patsansatha',
    'Asara Nagar, Ichalkaranji',
    'Maharashtra 416115',
  ],
  phone: '+91 70575 17775',
  email: 'book@shreeturf360.com',
  hours: '6:00 AM – 6:00 AM (overnight)',
  whatsapp: '917057517775',
  instagram: 'https://www.instagram.com/shree_turf360?igsh=MzJ6N3JqMW9mbWVs',
  facebook: 'https://facebook.com/shreeturf360',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(
      'Balaji chowk, near Balaji Patsansatha, Asara Nagar, Ichalkaranji, Maharashtra 416115',
    ),
  /** Public site origin — set VITE_SITE_URL in production (e.g. https://shreeturf360.com) */
  siteUrl: (import.meta.env.VITE_SITE_URL || 'https://shreeturf360.com').replace(
    /\/$/,
    '',
  ),
  seo: {
    titleDefault: 'Shree Turf 360° | Football & Cricket Turf in Ichalkaranji',
    titleBook: 'Book a Slot | Shree Turf 360° Ichalkaranji',
    description:
      'Book football and cricket turf slots at Shree Turf 360° in Ichalkaranji. FIFA-quality pitch, LED lights, easy online booking from 6 AM overnight. Call +91 70575 17775.',
    descriptionBook:
      'Reserve your football or cricket slot online at Shree Turf 360°, Ichalkaranji. Choose date, pick free hours, and confirm your booking in minutes.',
    keywords:
      'turf booking Ichalkaranji, football turf Ichalkaranji, cricket turf, box cricket, Shree Turf 360, book turf online, LED turf Maharashtra, Asara Nagar turf',
    locale: 'en_IN',
    ogImagePath: '/turflogo.jpeg',
  },
}

export const navLinks = [
  { label: 'HOME', id: 'home' },
  { label: 'ABOUT US', id: 'about' },
  { label: 'FACILITIES', id: 'facilities' },
  { label: 'PRICING', id: 'pricing' },
  { label: 'GALLERY', id: 'gallery' },
  { label: 'BOOK A SLOT', to: '/book' },
  { label: 'CONTACT US', id: 'contact' },
]
