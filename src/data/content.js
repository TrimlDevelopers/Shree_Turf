export const amenities = [
  {
    id: 'premium-turf',
    title: 'Premium Quality Turf',
    lines: ['Premium Quality', 'Turf'],
  },
  {
    id: 'led-lights',
    title: 'LED Flood Lights',
    lines: ['LED', 'Flood Lights'],
  },
  {
    id: 'parking',
    title: 'Parking Available',
    lines: ['Parking', 'Available'],
  },
  {
    id: 'changing',
    title: 'Changing Rooms',
    lines: ['Changing', 'Rooms'],
  },
  {
    id: 'water',
    title: 'Drinking Water',
    lines: ['Drinking', 'Water'],
  },
  {
    id: 'equipment',
    title: 'Equipment Available',
    lines: ['Equipment', 'Available'],
  },
]

export const pricing = [
  {
    id: 'morning',
    name: 'MORNING',
    price: '₹700',
    unit: '/hr',
    note: '6AM – 12PM',
    icon: 'sun',
  },
  {
    id: 'afternoon',
    name: 'AFTERNOON',
    price: '₹800',
    unit: '/hr',
    note: '12PM – 4PM',
    icon: 'afternoon',
  },
  {
    id: 'evening',
    name: 'EVENING',
    price: '₹1000',
    unit: '/hr',
    note: '4PM – 7PM',
    icon: 'sunset',
    popular: true,
  },
  {
    id: 'night',
    name: 'NIGHT',
    price: '₹1200',
    unit: '/hr',
    note: '7PM – 12AM',
    icon: 'moon',
  },
]

export const liveSlots = [
  { id: 's1', time: '6AM – 7AM', status: 'available' },
  { id: 's2', time: '7AM – 8AM', status: 'available' },
  { id: 's3', time: '8AM – 9AM', status: 'booked' },
  { id: 's4', time: '9AM – 10AM', status: 'available' },
  { id: 's5', time: '10AM – 11AM', status: 'available' },
  { id: 's6', time: '11AM – 12PM', status: 'available' },
  { id: 's7', time: '12PM – 1PM', status: 'available' },
  { id: 's8', time: '1PM – 2PM', status: 'booked' },
  { id: 's9', time: '2PM – 3PM', status: 'available' },
  { id: 's10', time: '3PM – 4PM', status: 'available' },
  { id: 's11', time: '4PM – 5PM', status: 'booked' },
  { id: 's12', time: '5PM – 6PM', status: 'booked' },
  { id: 's13', time: '6PM – 7PM', status: 'available' },
  { id: 's14', time: '7PM – 8PM', status: 'booked' },
  { id: 's15', time: '8PM – 9PM', status: 'available' },
  { id: 's16', time: '9PM – 10PM', status: 'available' },
  { id: 's17', time: '10PM – 11PM', status: 'booked' },
  { id: 's18', time: '11PM – 12AM', status: 'available' },
]

export const timeSlots = [
  '06:00 – 07:00',
  '07:00 – 08:00',
  '08:00 – 09:00',
  '09:00 – 10:00',
  '10:00 – 11:00',
  '11:00 – 12:00',
  '12:00 – 13:00',
  '13:00 – 14:00',
  '14:00 – 15:00',
  '15:00 – 16:00',
  '16:00 – 17:00',
  '17:00 – 18:00',
  '18:00 – 19:00',
  '19:00 – 20:00',
  '20:00 – 21:00',
  '21:00 – 22:00',
  '22:00 – 23:00',
  '23:00 – 00:00',
]

export const whyChoose = [
  'FIFA Quality Turf',
  'Well Maintained',
  'Bright LED Flood Lights',
  'Easy Online Booking',
  'Safe & Secure Premises',
  'Friendly Staff Support',
]

export const galleryImages = [
  {
    id: 1,
    src: '/gallery/01.jpg',
    alt: 'Night football under floodlights',
  },
  {
    id: 2,
    src: '/gallery/02.jpg',
    alt: 'Players celebrating on turf',
  },
  {
    id: 3,
    src: '/gallery/03.jpg',
    alt: 'Close-up of artificial grass',
  },
  {
    id: 4,
    src: '/gallery/04.jpg',
    alt: 'Football on the pitch',
  },
  {
    id: 5,
    src: '/gallery/05.jpg',
    alt: 'Team huddle before kickoff',
  },
  {
    id: 6,
    src: '/gallery/06.jpg',
    alt: 'Stadium atmosphere',
  },
]

export const testimonial = {
  name: 'Sachin Patil',
  role: 'Weekend league captain',
  rating: 5,
  review:
    'Best turf in Ichalkaranji. Floodlights are bright, grass feels premium, and booking is always smooth for our Friday games.',
  avatar: 'https://i.pravatar.cc/150?img=12',
}
