// Mock data for Skyscanner clone

export const POPULAR_DESTINATIONS = [
  {
    city: 'New York',
    country: 'United States',
    code: 'JFK',
    price: 412,
    image: 'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHw0fHxjaXR5c2NhcGV8ZW58MHx8fHwxNzc4MTY2ODAyfDA&ixlib=rb-4.1.0&q=85',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    code: 'HND',
    price: 689,
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwxfHxjaXR5c2NhcGV8ZW58MHx8fHwxNzc4MTY2ODAyfDA&ixlib=rb-4.1.0&q=85',
  },
  {
    city: 'London',
    country: 'United Kingdom',
    code: 'LHR',
    price: 348,
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwyfHxjaXR5c2NhcGV8ZW58MHx8fHwxNzc4MTY2ODAyfDA&ixlib=rb-4.1.0&q=85',
  },
  {
    city: 'Paris',
    country: 'France',
    code: 'CDG',
    price: 298,
    image: 'https://images.unsplash.com/photo-1554366347-897a5113f6ab?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBkZXN0aW5hdGlvbnN8ZW58MHx8fHwxNzc4MTY2ODAyfDA&ixlib=rb-4.1.0&q=85',
  },
  {
    city: 'Bali',
    country: 'Indonesia',
    code: 'DPS',
    price: 745,
    image: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHx0cmF2ZWwlMjBkZXN0aW5hdGlvbnN8ZW58MHx8fHwxNzc4MTY2ODAyfDA&ixlib=rb-4.1.0&q=85',
  },
  {
    city: 'Dubai',
    country: 'United Arab Emirates',
    code: 'DXB',
    price: 512,
    image: 'https://images.pexels.com/photos/18477451/pexels-photo-18477451.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    code: 'SIN',
    price: 678,
    image: 'https://images.pexels.com/photos/17007760/pexels-photo-17007760.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  },
  {
    city: 'San Francisco',
    country: 'United States',
    code: 'SFO',
    price: 389,
    image: 'https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwzfHxjaXR5c2NhcGV8ZW58MHx8fHwxNzc4MTY2ODAyfDA&ixlib=rb-4.1.0&q=85',
  },
];

export const AIRPORTS = [
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy Intl', country: 'United States' },
  { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles Intl', country: 'United States' },
  { code: 'SFO', city: 'San Francisco', name: 'San Francisco Intl', country: 'United States' },
  { code: 'ORD', city: 'Chicago', name: 'O’Hare Intl', country: 'United States' },
  { code: 'LHR', city: 'London', name: 'Heathrow', country: 'United Kingdom' },
  { code: 'LGW', city: 'London', name: 'Gatwick', country: 'United Kingdom' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle', country: 'France' },
  { code: 'AMS', city: 'Amsterdam', name: 'Schiphol', country: 'Netherlands' },
  { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt am Main', country: 'Germany' },
  { code: 'MAD', city: 'Madrid', name: 'Barajas', country: 'Spain' },
  { code: 'BCN', city: 'Barcelona', name: 'El Prat', country: 'Spain' },
  { code: 'FCO', city: 'Rome', name: 'Fiumicino', country: 'Italy' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai Intl', country: 'UAE' },
  { code: 'DOH', city: 'Doha', name: 'Hamad Intl', country: 'Qatar' },
  { code: 'SIN', city: 'Singapore', name: 'Changi', country: 'Singapore' },
  { code: 'HND', city: 'Tokyo', name: 'Haneda', country: 'Japan' },
  { code: 'NRT', city: 'Tokyo', name: 'Narita', country: 'Japan' },
  { code: 'ICN', city: 'Seoul', name: 'Incheon Intl', country: 'South Korea' },
  { code: 'HKG', city: 'Hong Kong', name: 'Hong Kong Intl', country: 'Hong Kong' },
  { code: 'SYD', city: 'Sydney', name: 'Kingsford Smith', country: 'Australia' },
  { code: 'DPS', city: 'Bali', name: 'Ngurah Rai Intl', country: 'Indonesia' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji', country: 'India' },
  { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi Intl', country: 'India' },
  { code: 'YYZ', city: 'Toronto', name: 'Pearson Intl', country: 'Canada' },
  { code: 'GRU', city: 'São Paulo', name: 'Guarulhos', country: 'Brazil' },
];

export const AIRLINES = [
  { code: 'BA', name: 'British Airways', logo: 'BA' },
  { code: 'AA', name: 'American Airlines', logo: 'AA' },
  { code: 'DL', name: 'Delta Air Lines', logo: 'DL' },
  { code: 'UA', name: 'United Airlines', logo: 'UA' },
  { code: 'EK', name: 'Emirates', logo: 'EK' },
  { code: 'QR', name: 'Qatar Airways', logo: 'QR' },
  { code: 'SQ', name: 'Singapore Airlines', logo: 'SQ' },
  { code: 'LH', name: 'Lufthansa', logo: 'LH' },
  { code: 'AF', name: 'Air France', logo: 'AF' },
  { code: 'KL', name: 'KLM', logo: 'KL' },
  { code: 'TK', name: 'Turkish Airlines', logo: 'TK' },
  { code: 'CX', name: 'Cathay Pacific', logo: 'CX' },
];

const PROVIDERS = ['Trip.com', 'Kiwi.com', 'eDreams', 'Expedia', 'Booking.com', 'Vayama', 'Mytrip', 'BudgetAir'];

function pad(n) { return n < 10 ? '0' + n : '' + n; }
function fmtTime(h, m) { return `${pad(h % 24)}:${pad(m)}`; }
function seedRandom(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function generateFlights(from = 'JFK', to = 'LHR', date = '') {
  const rand = seedRandom(`${from}-${to}-${date}`);
  const flights = [];
  const baseDuration = 240 + Math.floor(rand() * 480); // 4h - 12h
  const basePrice = 180 + Math.floor(rand() * 600);

  for (let i = 0; i < 14; i++) {
    const airline = AIRLINES[Math.floor(rand() * AIRLINES.length)];
    const stops = rand() < 0.45 ? 0 : rand() < 0.85 ? 1 : 2;
    const durMins = baseDuration + Math.floor(rand() * 180) + stops * 90;
    const depH = Math.floor(rand() * 24);
    const depM = Math.floor(rand() * 12) * 5;
    const arrTotal = depH * 60 + depM + durMins;
    const arrH = Math.floor(arrTotal / 60);
    const arrM = arrTotal % 60;
    const price = Math.max(89, Math.round(basePrice + (rand() - 0.5) * 300 - stops * 20));
    const provider = PROVIDERS[Math.floor(rand() * PROVIDERS.length)];
    const stopCity = stops > 0 ? ['DXB', 'AMS', 'FRA', 'IST', 'DOH'][Math.floor(rand() * 5)] : null;

    flights.push({
      id: `FL-${i}-${from}-${to}`,
      airline,
      from,
      to,
      depTime: fmtTime(depH, depM),
      arrTime: fmtTime(arrH, arrM),
      arrDayOffset: arrTotal >= 24 * 60 ? 1 : 0,
      duration: durMins,
      stops,
      stopCity,
      price,
      provider,
      cabin: 'Economy',
      eco: rand() < 0.3,
      selfTransfer: stops > 0 && rand() < 0.3,
    });
  }
  return flights;
}

export function durationLabel(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${pad(m)}m`;
}

export const TRENDING_SEARCHES = [
  { from: 'New York (JFK)', to: 'London (LHR)', price: 412 },
  { from: 'Los Angeles (LAX)', to: 'Tokyo (HND)', price: 689 },
  { from: 'San Francisco (SFO)', to: 'Paris (CDG)', price: 542 },
  { from: 'Chicago (ORD)', to: 'Rome (FCO)', price: 478 },
  { from: 'Miami (MIA)', to: 'Madrid (MAD)', price: 389 },
  { from: 'Boston (BOS)', to: 'Amsterdam (AMS)', price: 421 },
];

export const FAQ_ITEMS = [
  {
    q: 'How does Skyscanner find such cheap flight deals?',
    a: 'We compare flights from over 1,200 airlines and travel sites in seconds, so you can find the lowest prices available without booking fees added on.',
  },
  {
    q: 'When is the best time to book a flight?',
    a: 'For domestic flights, booking 1–3 months ahead usually gets the best prices. For international, aim for 3–6 months ahead and avoid school holidays.',
  },
  {
    q: 'Can I find cheap last-minute flights?',
    a: 'Yes — our Everywhere search and price alerts help you grab last-minute bargains. Be flexible with dates and airports for the best savings.',
  },
  {
    q: 'Are there hidden fees with Skyscanner?',
    a: 'No. Skyscanner is a free comparison service. We don’t charge any booking fees — the price you see goes straight to the travel provider.',
  },
];
