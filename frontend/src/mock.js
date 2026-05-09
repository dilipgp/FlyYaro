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

// Codes marked `popular: true` show first in the dropdown when no search query is entered.
export const AIRPORTS = [
  // ===== North America =====
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy Intl', country: 'United States', popular: true },
  { code: 'LGA', city: 'New York', name: 'LaGuardia', country: 'United States' },
  { code: 'EWR', city: 'Newark', name: 'Newark Liberty Intl', country: 'United States' },
  { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles Intl', country: 'United States', popular: true },
  { code: 'SFO', city: 'San Francisco', name: 'San Francisco Intl', country: 'United States', popular: true },
  { code: 'SAN', city: 'San Diego', name: 'San Diego Intl', country: 'United States' },
  { code: 'LAS', city: 'Las Vegas', name: 'Harry Reid Intl', country: 'United States' },
  { code: 'SEA', city: 'Seattle', name: 'Seattle-Tacoma Intl', country: 'United States' },
  { code: 'ORD', city: 'Chicago', name: 'O’Hare Intl', country: 'United States', popular: true },
  { code: 'MDW', city: 'Chicago', name: 'Midway Intl', country: 'United States' },
  { code: 'ATL', city: 'Atlanta', name: 'Hartsfield-Jackson Intl', country: 'United States' },
  { code: 'DFW', city: 'Dallas', name: 'Dallas/Fort Worth Intl', country: 'United States' },
  { code: 'IAH', city: 'Houston', name: 'George Bush Intercontinental', country: 'United States' },
  { code: 'MIA', city: 'Miami', name: 'Miami Intl', country: 'United States' },
  { code: 'MCO', city: 'Orlando', name: 'Orlando Intl', country: 'United States' },
  { code: 'BOS', city: 'Boston', name: 'Logan Intl', country: 'United States' },
  { code: 'IAD', city: 'Washington', name: 'Dulles Intl', country: 'United States' },
  { code: 'DCA', city: 'Washington', name: 'Reagan National', country: 'United States' },
  { code: 'PHL', city: 'Philadelphia', name: 'Philadelphia Intl', country: 'United States' },
  { code: 'DEN', city: 'Denver', name: 'Denver Intl', country: 'United States' },
  { code: 'PHX', city: 'Phoenix', name: 'Sky Harbor Intl', country: 'United States' },
  { code: 'YYZ', city: 'Toronto', name: 'Pearson Intl', country: 'Canada', popular: true },
  { code: 'YVR', city: 'Vancouver', name: 'Vancouver Intl', country: 'Canada' },
  { code: 'YUL', city: 'Montreal', name: 'Montréal-Trudeau Intl', country: 'Canada' },
  { code: 'YYC', city: 'Calgary', name: 'Calgary Intl', country: 'Canada' },
  { code: 'MEX', city: 'Mexico City', name: 'Benito Juárez Intl', country: 'Mexico' },
  { code: 'CUN', city: 'Cancún', name: 'Cancún Intl', country: 'Mexico' },

  // ===== Europe =====
  { code: 'LHR', city: 'London', name: 'Heathrow', country: 'United Kingdom', popular: true },
  { code: 'LGW', city: 'London', name: 'Gatwick', country: 'United Kingdom' },
  { code: 'STN', city: 'London', name: 'Stansted', country: 'United Kingdom' },
  { code: 'LTN', city: 'London', name: 'Luton', country: 'United Kingdom' },
  { code: 'MAN', city: 'Manchester', name: 'Manchester', country: 'United Kingdom' },
  { code: 'EDI', city: 'Edinburgh', name: 'Edinburgh', country: 'United Kingdom' },
  { code: 'DUB', city: 'Dublin', name: 'Dublin', country: 'Ireland' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle', country: 'France', popular: true },
  { code: 'ORY', city: 'Paris', name: 'Orly', country: 'France' },
  { code: 'NCE', city: 'Nice', name: 'Côte d’Azur', country: 'France' },
  { code: 'AMS', city: 'Amsterdam', name: 'Schiphol', country: 'Netherlands', popular: true },
  { code: 'BRU', city: 'Brussels', name: 'Brussels', country: 'Belgium' },
  { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt am Main', country: 'Germany', popular: true },
  { code: 'MUC', city: 'Munich', name: 'Munich', country: 'Germany' },
  { code: 'BER', city: 'Berlin', name: 'Brandenburg', country: 'Germany' },
  { code: 'HAM', city: 'Hamburg', name: 'Hamburg', country: 'Germany' },
  { code: 'DUS', city: 'Düsseldorf', name: 'Düsseldorf', country: 'Germany' },
  { code: 'ZRH', city: 'Zurich', name: 'Zürich', country: 'Switzerland' },
  { code: 'GVA', city: 'Geneva', name: 'Geneva', country: 'Switzerland' },
  { code: 'VIE', city: 'Vienna', name: 'Vienna Intl', country: 'Austria' },
  { code: 'CPH', city: 'Copenhagen', name: 'Kastrup', country: 'Denmark' },
  { code: 'ARN', city: 'Stockholm', name: 'Arlanda', country: 'Sweden' },
  { code: 'OSL', city: 'Oslo', name: 'Gardermoen', country: 'Norway' },
  { code: 'HEL', city: 'Helsinki', name: 'Helsinki-Vantaa', country: 'Finland' },
  { code: 'WAW', city: 'Warsaw', name: 'Chopin', country: 'Poland' },
  { code: 'PRG', city: 'Prague', name: 'Václav Havel', country: 'Czech Republic' },
  { code: 'BUD', city: 'Budapest', name: 'Ferenc Liszt Intl', country: 'Hungary' },
  { code: 'MAD', city: 'Madrid', name: 'Barajas', country: 'Spain' },
  { code: 'BCN', city: 'Barcelona', name: 'El Prat', country: 'Spain' },
  { code: 'AGP', city: 'Málaga', name: 'Costa del Sol', country: 'Spain' },
  { code: 'PMI', city: 'Palma de Mallorca', name: 'Son Sant Joan', country: 'Spain' },
  { code: 'LIS', city: 'Lisbon', name: 'Humberto Delgado', country: 'Portugal' },
  { code: 'OPO', city: 'Porto', name: 'Francisco Sá Carneiro', country: 'Portugal' },
  { code: 'FCO', city: 'Rome', name: 'Fiumicino', country: 'Italy' },
  { code: 'MXP', city: 'Milan', name: 'Malpensa', country: 'Italy' },
  { code: 'VCE', city: 'Venice', name: 'Marco Polo', country: 'Italy' },
  { code: 'NAP', city: 'Naples', name: 'Capodichino', country: 'Italy' },
  { code: 'ATH', city: 'Athens', name: 'Eleftherios Venizelos', country: 'Greece' },
  { code: 'IST', city: 'Istanbul', name: 'Istanbul Airport', country: 'Turkey' },
  { code: 'SAW', city: 'Istanbul', name: 'Sabiha Gökçen', country: 'Turkey' },
  { code: 'AYT', city: 'Antalya', name: 'Antalya', country: 'Turkey' },
  { code: 'SVO', city: 'Moscow', name: 'Sheremetyevo', country: 'Russia' },
  { code: 'DME', city: 'Moscow', name: 'Domodedovo', country: 'Russia' },

  // ===== Middle East / Africa =====
  { code: 'DXB', city: 'Dubai', name: 'Dubai Intl', country: 'United Arab Emirates', popular: true },
  { code: 'AUH', city: 'Abu Dhabi', name: 'Abu Dhabi Intl', country: 'United Arab Emirates' },
  { code: 'DOH', city: 'Doha', name: 'Hamad Intl', country: 'Qatar' },
  { code: 'RUH', city: 'Riyadh', name: 'King Khalid Intl', country: 'Saudi Arabia' },
  { code: 'JED', city: 'Jeddah', name: 'King Abdulaziz Intl', country: 'Saudi Arabia' },
  { code: 'KWI', city: 'Kuwait City', name: 'Kuwait Intl', country: 'Kuwait' },
  { code: 'BAH', city: 'Manama', name: 'Bahrain Intl', country: 'Bahrain' },
  { code: 'TLV', city: 'Tel Aviv', name: 'Ben Gurion', country: 'Israel' },
  { code: 'CAI', city: 'Cairo', name: 'Cairo Intl', country: 'Egypt' },
  { code: 'JNB', city: 'Johannesburg', name: 'O. R. Tambo', country: 'South Africa' },
  { code: 'CPT', city: 'Cape Town', name: 'Cape Town Intl', country: 'South Africa' },
  { code: 'NBO', city: 'Nairobi', name: 'Jomo Kenyatta Intl', country: 'Kenya' },
  { code: 'ADD', city: 'Addis Ababa', name: 'Bole Intl', country: 'Ethiopia' },
  { code: 'LOS', city: 'Lagos', name: 'Murtala Muhammed Intl', country: 'Nigeria' },
  { code: 'CMN', city: 'Casablanca', name: 'Mohammed V', country: 'Morocco' },

  // ===== Asia =====
  { code: 'SIN', city: 'Singapore', name: 'Changi', country: 'Singapore', popular: true },
  { code: 'KUL', city: 'Kuala Lumpur', name: 'KL Intl', country: 'Malaysia' },
  { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi', country: 'Thailand', popular: true },
  { code: 'DMK', city: 'Bangkok', name: 'Don Mueang', country: 'Thailand' },
  { code: 'HKT', city: 'Phuket', name: 'Phuket Intl', country: 'Thailand' },
  { code: 'CGK', city: 'Jakarta', name: 'Soekarno-Hatta Intl', country: 'Indonesia' },
  { code: 'DPS', city: 'Bali', name: 'Ngurah Rai Intl', country: 'Indonesia', popular: true },
  { code: 'MNL', city: 'Manila', name: 'Ninoy Aquino Intl', country: 'Philippines' },
  { code: 'CEB', city: 'Cebu', name: 'Mactan-Cebu Intl', country: 'Philippines' },
  { code: 'HAN', city: 'Hanoi', name: 'Noi Bai Intl', country: 'Vietnam' },
  { code: 'SGN', city: 'Ho Chi Minh City', name: 'Tan Son Nhat Intl', country: 'Vietnam' },
  { code: 'HND', city: 'Tokyo', name: 'Haneda', country: 'Japan', popular: true },
  { code: 'NRT', city: 'Tokyo', name: 'Narita', country: 'Japan' },
  { code: 'KIX', city: 'Osaka', name: 'Kansai Intl', country: 'Japan' },
  { code: 'NGO', city: 'Nagoya', name: 'Chubu Centrair', country: 'Japan' },
  { code: 'ICN', city: 'Seoul', name: 'Incheon Intl', country: 'South Korea' },
  { code: 'GMP', city: 'Seoul', name: 'Gimpo Intl', country: 'South Korea' },
  { code: 'PEK', city: 'Beijing', name: 'Capital Intl', country: 'China' },
  { code: 'PKX', city: 'Beijing', name: 'Daxing Intl', country: 'China' },
  { code: 'PVG', city: 'Shanghai', name: 'Pudong Intl', country: 'China' },
  { code: 'SHA', city: 'Shanghai', name: 'Hongqiao Intl', country: 'China' },
  { code: 'CAN', city: 'Guangzhou', name: 'Baiyun Intl', country: 'China' },
  { code: 'HKG', city: 'Hong Kong', name: 'Hong Kong Intl', country: 'Hong Kong' },
  { code: 'TPE', city: 'Taipei', name: 'Taoyuan Intl', country: 'Taiwan' },

  // ===== South Asia =====
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj Intl', country: 'India', popular: true },
  { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi Intl', country: 'India', popular: true },
  { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda Intl', country: 'India' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai Intl', country: 'India' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi Intl', country: 'India' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose Intl', country: 'India' },
  { code: 'COK', city: 'Kochi', name: 'Cochin Intl', country: 'India' },
  { code: 'GOI', city: 'Goa', name: 'Dabolim', country: 'India' },
  { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel Intl', country: 'India' },
  { code: 'PNQ', city: 'Pune', name: 'Pune', country: 'India' },
  { code: 'JAI', city: 'Jaipur', name: 'Jaipur Intl', country: 'India' },
  { code: 'TRV', city: 'Thiruvananthapuram', name: 'Trivandrum Intl', country: 'India' },
  { code: 'KTM', city: 'Kathmandu', name: 'Tribhuvan Intl', country: 'Nepal' },
  { code: 'CMB', city: 'Colombo', name: 'Bandaranaike Intl', country: 'Sri Lanka' },
  { code: 'DAC', city: 'Dhaka', name: 'Hazrat Shahjalal Intl', country: 'Bangladesh' },
  { code: 'KHI', city: 'Karachi', name: 'Jinnah Intl', country: 'Pakistan' },
  { code: 'LHE', city: 'Lahore', name: 'Allama Iqbal Intl', country: 'Pakistan' },
  { code: 'ISB', city: 'Islamabad', name: 'Islamabad Intl', country: 'Pakistan' },
  { code: 'MLE', city: 'Malé', name: 'Velana Intl', country: 'Maldives' },

  // ===== Oceania =====
  { code: 'SYD', city: 'Sydney', name: 'Kingsford Smith', country: 'Australia' },
  { code: 'MEL', city: 'Melbourne', name: 'Tullamarine', country: 'Australia' },
  { code: 'BNE', city: 'Brisbane', name: 'Brisbane', country: 'Australia' },
  { code: 'PER', city: 'Perth', name: 'Perth', country: 'Australia' },
  { code: 'AKL', city: 'Auckland', name: 'Auckland', country: 'New Zealand' },
  { code: 'WLG', city: 'Wellington', name: 'Wellington Intl', country: 'New Zealand' },

  // ===== South America =====
  { code: 'GRU', city: 'São Paulo', name: 'Guarulhos', country: 'Brazil' },
  { code: 'GIG', city: 'Rio de Janeiro', name: 'Galeão', country: 'Brazil' },
  { code: 'EZE', city: 'Buenos Aires', name: 'Ministro Pistarini', country: 'Argentina' },
  { code: 'SCL', city: 'Santiago', name: 'Arturo Merino Benítez', country: 'Chile' },
  { code: 'LIM', city: 'Lima', name: 'Jorge Chávez Intl', country: 'Peru' },
  { code: 'BOG', city: 'Bogotá', name: 'El Dorado', country: 'Colombia' },
  { code: 'PTY', city: 'Panama City', name: 'Tocumen Intl', country: 'Panama' },
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
    q: 'How does FlyYaro find such cheap flight deals?',
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
    q: 'Are there hidden fees with FlyYaro?',
    a: 'No. FlyYaro is a free comparison service. We don’t charge any booking fees — the price you see goes straight to the travel provider.',
  },
];
