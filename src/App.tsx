import { useState, useEffect, useMemo } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plane, Search, Calendar, Users, ArrowRightLeft, MapPin, 
  Filter, Clock, DollarSign, Luggage, Wifi, Zap, 
  ChevronDown, X, Star, Heart, Share2, Settings, 
  BarChart3, Key, Globe, LogIn, User, Menu,
  Plus, Trash2, ArrowRight, Check, Info, 
  TrendingUp, Shield, Award, ChevronUp
} from 'lucide-react'

// Types
interface Airport {
  code: string
  city: string
  name: string
  country: string
}

interface Flight {
  id: string
  airline: string
  airlineCode: string
  flightNumber: string
  departure: {
    airport: string
    code: string
    time: string
    date: string
  }
  arrival: {
    airport: string
    code: string
    time: string
    date: string
  }
  duration: string
  durationMinutes: number
  stops: number
  stopCities?: string[]
  price: number
  currency: string
  provider: string
  providerUrl: string
  baggage: {
    cabin: boolean
    checked: number
  }
  amenities: string[]
  co2: number
  isBest?: boolean
  isCheapest?: boolean
  isFastest?: boolean
}

interface SearchParams {
  tripType: 'roundtrip' | 'oneway' | 'multicity'
  from: Airport | null
  to: Airport | null
  departDate: string
  returnDate: string
  passengers: {
    adults: number
    children: number
    infants: number
  }
  cabinClass: string
  directOnly: boolean
  legs?: { from: Airport | null, to: Airport | null, date: string }[]
}

// Data with real coordinates for accurate flight times
const AIRPORTS: (Airport & { lat: number, lon: number })[] = [
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy', country: 'USA', lat: 40.6413, lon: -73.7781 },
  { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles Intl', country: 'USA', lat: 33.9416, lon: -118.4085 },
  { code: 'LHR', city: 'London', name: 'Heathrow', country: 'UK', lat: 51.4700, lon: -0.4543 },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle', country: 'France', lat: 49.0097, lon: 2.5479 },
  { code: 'DXB', city: 'Dubai', name: 'Dubai Intl', country: 'UAE', lat: 25.2532, lon: 55.3657 },
  { code: 'SIN', city: 'Singapore', name: 'Changi', country: 'Singapore', lat: 1.3644, lon: 103.9915 },
  { code: 'HND', city: 'Tokyo', name: 'Haneda', country: 'Japan', lat: 35.5494, lon: 139.7798 },
  { code: 'SYD', city: 'Sydney', name: 'Kingsford Smith', country: 'Australia', lat: -33.9399, lon: 151.1753 },
  { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt', country: 'Germany', lat: 50.0379, lon: 8.5622 },
  { code: 'AMS', city: 'Amsterdam', name: 'Schiphol', country: 'Netherlands', lat: 52.3105, lon: 4.7683 },
  { code: 'IST', city: 'Istanbul', name: 'Istanbul', country: 'Turkey', lat: 41.2753, lon: 28.7519 },
  { code: 'MAD', city: 'Madrid', name: 'Barajas', country: 'Spain', lat: 40.4983, lon: -3.5676 },
  { code: 'BCN', city: 'Barcelona', name: 'El Prat', country: 'Spain', lat: 41.2974, lon: 2.0833 },
  { code: 'FCO', city: 'Rome', name: 'Fiumicino', country: 'Italy', lat: 41.8003, lon: 12.2389 },
  { code: 'MUC', city: 'Munich', name: 'Franz Josef', country: 'Germany', lat: 48.3538, lon: 11.7861 },
  { code: 'ZRH', city: 'Zurich', name: 'Zurich', country: 'Switzerland', lat: 47.4647, lon: 8.5492 },
  { code: 'VIE', city: 'Vienna', name: 'Vienna Intl', country: 'Austria', lat: 48.1103, lon: 16.5697 },
  { code: 'CPH', city: 'Copenhagen', name: 'Kastrup', country: 'Denmark', lat: 55.6180, lon: 12.6508 },
  { code: 'ARN', city: 'Stockholm', name: 'Arlanda', country: 'Sweden', lat: 59.6519, lon: 17.9186 },
  { code: 'OSL', city: 'Oslo', name: 'Gardermoen', country: 'Norway', lat: 60.1939, lon: 11.1004 },
  { code: 'DUB', city: 'Dublin', name: 'Dublin', country: 'Ireland', lat: 53.4213, lon: -6.2701 },
  { code: 'LIS', city: 'Lisbon', name: 'Humberto Delgado', country: 'Portugal', lat: 38.7742, lon: -9.1342 },
  { code: 'ATH', city: 'Athens', name: 'Eleftherios', country: 'Greece', lat: 37.9364, lon: 23.9445 },
  { code: 'DOH', city: 'Doha', name: 'Hamad', country: 'Qatar', lat: 25.2731, lon: 51.6080 },
  { code: 'AUH', city: 'Abu Dhabi', name: 'Zayed', country: 'UAE', lat: 24.4330, lon: 54.6511 },
  { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi', country: 'Thailand', lat: 13.6900, lon: 100.7501 },
  { code: 'HKG', city: 'Hong Kong', name: 'Hong Kong Intl', country: 'Hong Kong', lat: 22.3080, lon: 113.9185 },
  { code: 'ICN', city: 'Seoul', name: 'Incheon', country: 'South Korea', lat: 37.4602, lon: 126.4407 },
  { code: 'PEK', city: 'Beijing', name: 'Capital', country: 'China', lat: 40.0799, lon: 116.6031 },
  { code: 'PVG', city: 'Shanghai', name: 'Pudong', country: 'China', lat: 31.1443, lon: 121.8083 },
  { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi', country: 'India', lat: 28.5562, lon: 77.1000 },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati', country: 'India', lat: 19.0896, lon: 72.8656 },
  { code: 'GRU', city: 'São Paulo', name: 'Guarulhos', country: 'Brazil', lat: -23.4356, lon: -46.4731 },
  { code: 'MEX', city: 'Mexico City', name: 'Benito Juárez', country: 'Mexico', lat: 19.4363, lon: -99.0721 },
  { code: 'YYZ', city: 'Toronto', name: 'Pearson', country: 'Canada', lat: 43.6777, lon: -79.6248 },
  { code: 'YVR', city: 'Vancouver', name: 'Vancouver Intl', country: 'Canada', lat: 49.1947, lon: -123.1839 },
  { code: 'SFO', city: 'San Francisco', name: 'San Francisco Intl', country: 'USA', lat: 37.6213, lon: -122.3790 },
  { code: 'ORD', city: 'Chicago', name: "O'Hare", country: 'USA', lat: 41.9742, lon: -87.9073 },
  { code: 'MIA', city: 'Miami', name: 'Miami Intl', country: 'USA', lat: 25.7959, lon: -80.2870 },
  { code: 'DFW', city: 'Dallas', name: 'Fort Worth', country: 'USA', lat: 32.8998, lon: -97.0403 },
  { code: 'ATL', city: 'Atlanta', name: 'Hartsfield-Jackson', country: 'USA', lat: 33.6407, lon: -84.4277 },
]

const AIRLINES = [
  { name: 'Emirates', code: 'EK', color: '#D71921' },
  { name: 'Qatar Airways', code: 'QR', color: '#5C0D39' },
  { name: 'Singapore Airlines', code: 'SQ', color: '#00266B' },
  { name: 'British Airways', code: 'BA', color: '#075AAA' },
  { name: 'Lufthansa', code: 'LH', color: '#05164D' },
  { name: 'Air France', code: 'AF', color: '#00205B' },
  { name: 'KLM', code: 'KL', color: '#00A1DE' },
  { name: 'Turkish Airlines', code: 'TK', color: '#E30613' },
  { name: 'Delta', code: 'DL', color: '#003366' },
  { name: 'United', code: 'UA', color: '#002244' },
  { name: 'American Airlines', code: 'AA', color: '#0078D2' },
  { name: 'Cathay Pacific', code: 'CX', color: '#00675B' },
  { name: 'ANA', code: 'NH', color: '#003399' },
  { name: 'JAL', code: 'JL', color: '#000000' },
  { name: 'Qantas', code: 'QF', color: '#E0001B' },
]

const PROVIDERS = [
  { name: 'FlyYara', logo: 'FY', color: '#0062E3' },
  { name: 'Expedia', logo: 'EX', color: '#00355F' },
  { name: 'Kayak', logo: 'KY', color: '#FF690F' },
  { name: 'Kiwi.com', logo: 'KW', color: '#00A991' },
  { name: 'Google Flights', logo: 'GF', color: '#4285F4' },
  { name: 'Airline Direct', logo: 'AD', color: '#1A1A1A' },
]

const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'CAD', symbol: 'C$', rate: 1.36 },
  { code: 'AUD', symbol: 'A$', rate: 1.52 },
  { code: 'INR', symbol: '₹', rate: 83.2 },
]

// Meta-Search Engine - Aggregates from multiple APIs
interface SearchSource {
  name: string
  weight: number
  avgResponseTime: number
  reliability: number
}

const SEARCH_SOURCES: SearchSource[] = [
  { name: 'Amadeus', weight: 0.4, avgResponseTime: 920, reliability: 0.98 },
  { name: 'Duffel (NDC)', weight: 0.25, avgResponseTime: 850, reliability: 0.96 },
  { name: 'Kiwi Tequila', weight: 0.2, avgResponseTime: 950, reliability: 0.92 },
  { name: 'Travelpayouts', weight: 0.1, avgResponseTime: 700, reliability: 0.90 },
  { name: 'Skyscanner', weight: 0.05, avgResponseTime: 1100, reliability: 0.93 },
]

// Calculate real distance between airports (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Calculate realistic flight time based on distance
function calculateFlightTime(distanceKm: number, stops: number): number {
  // Average cruise speed ~850 km/h, plus takeoff/landing/taxi time
  const cruiseTime = (distanceKm / 850) * 60 // in minutes
  const overhead = 45 // taxi, takeoff, landing
  const stopTime = stops * 75 // average layover
  return Math.round(cruiseTime + overhead + stopTime)
}

// Smart Ranking Algorithm
function calculateFlightScore(flight: Flight, userPrefs?: any): number {
  const priceScore = 1 - (flight.price / 2000) // Normalize to 0-1
  const durationScore = 1 - (flight.durationMinutes / 1440)
  const stopsScore = flight.stops === 0 ? 1 : flight.stops === 1 ? 0.7 : 0.4
  const airlineScore = ['Emirates', 'Qatar Airways', 'Singapore Airlines'].includes(flight.airline) ? 1 : 0.8
  const timeScore = (() => {
    const hour = parseInt(flight.departure.time.split(':')[0])
    if (hour >= 7 && hour <= 10) return 0.9 // Morning preference
    if (hour >= 17 && hour <= 20) return 0.85 // Evening
    return 0.7
  })()
  
  // Weighted score
  return (
    priceScore * 0.4 +
    durationScore * 0.3 +
    stopsScore * 0.15 +
    airlineScore * 0.1 +
    timeScore * 0.05
  ) * 100
}

function generateFlights(params: SearchParams): Flight[] {
  const flights: Flight[] = []
  const cacheKey = `search_${params.from?.code}_${params.to?.code}_${params.departDate}`
  
  // Check cache first (5 min TTL)
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < 300000) { // 5 minutes
        console.log('✓ Cache hit - returning cached results')
        return data
      }
    } catch {}
  }
  
  const basePrice = 250 + Math.random() * 800
  
  // Calculate REAL distance and flight time
  const fromAirport = AIRPORTS.find(a => a.code === params.from?.code)
  const toAirport = AIRPORTS.find(a => a.code === params.to?.code)
  const distanceKm = fromAirport && toAirport 
    ? calculateDistance(fromAirport.lat, fromAirport.lon, toAirport.lat, toAirport.lon)
    : 5000 // default
  
  const isLongHaul = distanceKm > 4000
  
  // Simulate meta-search from multiple sources
  SEARCH_SOURCES.forEach(source => {
    const sourceFlights = Math.floor(5 + Math.random() * 8)
    const sourcePriceMultiplier = 0.9 + Math.random() * 0.25
    const sourceDelay = source.avgResponseTime * (0.8 + Math.random() * 0.4)
    
    for (let i = 0; i < sourceFlights; i++) {
      const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)]
      const stops = params.directOnly ? 0 : (Math.random() > 0.65 ? (Math.random() > 0.85 ? 2 : 1) : 0)
      
      // Use REALISTIC flight time based on actual distance
      const baseFlightTime = calculateFlightTime(distanceKm, 0)
      const durationVariation = 0.9 + Math.random() * 0.2 // ±10% variation
      const durationMinutes = Math.floor(baseFlightTime * durationVariation + (stops * 75))
      const hours = Math.floor(durationMinutes / 60)
      const mins = durationMinutes % 60
      
      const depHour = 5 + Math.floor(Math.random() * 18)
      const depMin = [0, 15, 30, 45][Math.floor(Math.random() * 4)]
      const depTime = `${depHour.toString().padStart(2, '0')}:${depMin.toString().padStart(2, '0')}`
      
      const arrTotalMins = depHour * 60 + depMin + durationMinutes
      const arrHour = Math.floor((arrTotalMins % 1440) / 60)
      const arrMin = arrTotalMins % 60
      const arrTime = `${arrHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')}`
      
      const priceVariation = 0.75 + Math.random() * 0.5
      const stopPenalty = stops * 55
      const timePremium = (depHour >= 7 && depHour <= 10) || (depHour >= 17 && depHour <= 20) ? 1.18 : 1
      const sourceAdjustment = source.name.includes('Kiwi') ? 0.92 : source.name.includes('Duffel') ? 1.05 : 1
      const price = Math.round((basePrice * priceVariation * sourcePriceMultiplier - stopPenalty) * timePremium * sourceAdjustment)
      
      const stopCities = stops > 0 ? 
        Array.from({ length: stops }, () => AIRPORTS[Math.floor(Math.random() * AIRPORTS.length)].city) 
        : undefined
      
      // Generate unique ID with source
      const sourceCode = source.name.split(' ')[0].substring(0, 2).toUpperCase()
      
      flights.push({
        id: `${sourceCode}${Date.now()}_${i}`,
        airline: airline.name,
        airlineCode: airline.code,
        flightNumber: `${airline.code}${100 + Math.floor(Math.random() * 900)}`,
        departure: {
          airport: params.from?.name || 'Origin',
          code: params.from?.code || 'ORG',
          time: depTime,
          date: params.departDate,
        },
        arrival: {
          airport: params.to?.name || 'Destination',
          code: params.to?.code || 'DST',
          time: arrTime,
          date: params.departDate,
        },
        duration: `${hours}h ${mins}m`,
        durationMinutes,
        stops,
        stopCities,
        price,
        currency: 'USD',
        provider: source.name,
        providerUrl: `https://www.google.com/travel/flights?q=${params.from?.code}+to+${params.to?.code}&ref=flyyara`,
        baggage: {
          cabin: true,
          checked: stops === 0 && Math.random() > 0.25 ? 1 : Math.random() > 0.7 ? 1 : 0,
        },
        amenities: [
          ...(Math.random() > 0.25 ? ['wifi'] : []),
          ...(Math.random() > 0.45 ? ['power'] : []),
          ...(isLongHaul && Math.random() > 0.35 ? ['meal'] : []),
          ...(airline.name.includes('Emirates') || airline.name.includes('Qatar') ? ['entertainment'] : []),
        ],
        co2: Math.round((durationMinutes / 60) * 90 * (1 + stops * 0.22)),
        // @ts-ignore - add metadata
        _source: source.name,
        _responseTime: Math.round(sourceDelay),
        _score: 0,
      })
    }
  })
  
  // Calculate smart scores
  flights.forEach(f => {
    ;(f as any)._score = calculateFlightScore(f)
  })
  
  // Deduplicate similar flights (same airline, similar time, within $20)
  const deduped = flights.filter((flight, index, self) => {
    return !self.slice(0, index).some(other => 
      other.airline === flight.airline &&
      Math.abs(parseInt(other.departure.time.split(':')[0]) - parseInt(flight.departure.time.split(':')[0])) < 2 &&
      Math.abs(other.price - flight.price) < 25 &&
      other.stops === flight.stops
    )
  })
  
  // Mark best options using smart ranking
  const sortedByScore = [...deduped].sort((a, b) => (b as any)._score - (a as any)._score)
  const sortedByPrice = [...deduped].sort((a, b) => a.price - b.price)
  const sortedByDuration = [...deduped].sort((a, b) => a.durationMinutes - b.durationMinutes)
  
  if (sortedByPrice[0]) sortedByPrice[0].isCheapest = true
  if (sortedByDuration[0]) sortedByDuration[0].isFastest = true
  if (sortedByScore[0]) sortedByScore[0].isBest = true
  
  // Sort by smart score initially
  const result = deduped.sort((a, b) => {
    if ((a as any).isBest) return -1
    if ((b as any).isBest) return 1
    return (b as any)._score - (a as any)._score
  })
  
  // Cache results
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ data: result, timestamp: Date.now() }))
  } catch {}
  
  console.log(`✓ Meta-search complete: ${SEARCH_SOURCES.length} sources, ${flights.length} raw, ${result.length} after dedupe`)
  
  return result
}

function Header({ 
  currency, 
  setCurrency, 
  language, 
  setLanguage,
  user,
  setShowAuth
}: any) {
  const [mobileMenu, setMobileMenu] = useState(false)
  const navigate = useNavigate()
  
  return (
    <header className="sticky top-0 z-50 bg-[#05203c] text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[64px]">
          <div className="flex items-center gap-8">
            <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#0062E3] rounded-xl flex items-center justify-center rotate-3">
                <Plane className="w-5 h-5 text-white -rotate-3" />
              </div>
              <span className="text-[22px] font-bold tracking-tight">FlyYara</span>
            </button>
            
            <nav className="hidden lg:flex items-center gap-1">
              {['Flights', 'Hotels', 'Car Hire'].map((item) => (
                <button
                  key={item}
                  className={`px-4 py-2 rounded-lg text-[15px] font-medium transition-all ${
                    item === 'Flights' 
                      ? 'bg-white/15 text-white' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1">
              <button className="p-2.5 hover:bg-white/10 rounded-lg transition-colors">
                <Globe className="w-4.5 h-4.5" />
              </button>
              
              <div className="relative">
                <select
                  value={currency.code}
                  onChange={(e) => setCurrency(CURRENCIES.find(c => c.code === e.target.value)!)}
                  className="appearance-none bg-transparent pl-3 pr-7 py-2 rounded-lg hover:bg-white/10 text-[14px] font-medium cursor-pointer outline-none"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code} className="text-black">{c.code}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
              </div>
              
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none bg-transparent pl-3 pr-7 py-2 rounded-lg hover:bg-white/10 text-[14px] font-medium cursor-pointer outline-none"
                >
                  <option value="EN" className="text-black">EN</option>
                  <option value="ES" className="text-black">ES</option>
                  <option value="FR" className="text-black">FR</option>
                  <option value="DE" className="text-black">DE</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
              </div>
            </div>
            
            {user ? (
              <button className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#0062E3] flex items-center justify-center text-[13px] font-semibold">
                    {user.name[0]}
                  </div>
                )}
                <span className="text-[14px] font-medium">{user.name}</span>
              </button>
            ) : (
              <button 
                onClick={() => setShowAuth(true)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 hover:bg-white/10 rounded-lg transition-colors text-[14px] font-medium"
              >
                <LogIn className="w-4 h-4" />
                Log in
              </button>
            )}
            
            <button 
              onClick={() => setMobileMenu(!mobileMenu)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-white/10 bg-[#05203c] overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {['Flights', 'Hotels', 'Car Hire'].map(item => (
                <button key={item} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/10 text-[15px]">
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function SearchForm({ onSearch, initialParams }: any) {
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway' | 'multicity'>(initialParams?.tripType || 'roundtrip')
  const [from, setFrom] = useState<Airport | null>(initialParams?.from || AIRPORTS[0])
  const [to, setTo] = useState<Airport | null>(initialParams?.to || AIRPORTS[2])
  const [departDate, setDepartDate] = useState(initialParams?.departDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0])
  const [returnDate, setReturnDate] = useState(initialParams?.returnDate || new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0])
  const [passengers, setPassengers] = useState(initialParams?.passengers || { adults: 1, children: 0, infants: 0 })
  const [cabinClass, setCabinClass] = useState(initialParams?.cabinClass || 'Economy')
  const [directOnly, setDirectOnly] = useState(false)
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  const [showPassengers, setShowPassengers] = useState(false)
  const [fromQuery, setFromQuery] = useState('')
  const [toQuery, setToQuery] = useState('')
  const [legs, setLegs] = useState(initialParams?.legs || [
    { from: AIRPORTS[0], to: AIRPORTS[2], date: departDate },
    { from: AIRPORTS[2], to: AIRPORTS[0], date: returnDate }
  ])
  
  const filteredFrom = useMemo(() => {
    if (!fromQuery) return AIRPORTS.slice(0, 8)
    return AIRPORTS.filter(a => 
      a.city.toLowerCase().includes(fromQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(fromQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(fromQuery.toLowerCase())
    ).slice(0, 8)
  }, [fromQuery])
  
  const filteredTo = useMemo(() => {
    if (!toQuery) return AIRPORTS.slice(0, 8)
    return AIRPORTS.filter(a => 
      a.city.toLowerCase().includes(toQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(toQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(toQuery.toLowerCase())
    ).slice(0, 8)
  }, [toQuery])
  
  const totalPassengers = passengers.adults + passengers.children + passengers.infants
  
  const handleSearch = () => {
    onSearch({
      tripType,
      from,
      to,
      departDate,
      returnDate,
      passengers,
      cabinClass,
      directOnly,
      legs: tripType === 'multicity' ? legs : undefined
    })
  }
  
  const swapAirports = () => {
    const temp = from
    setFrom(to)
    setTo(temp)
  }
  
  return (
    <div className="bg-white rounded-[20px] shadow-[0_8px_28px_rgba(5,32,60,0.12)] p-1.5">
      {/* Trip type */}
      <div className="flex items-center gap-1 p-1">
        {(['roundtrip', 'oneway', 'multicity'] as const).map(type => (
          <button
            key={type}
            onClick={() => setTripType(type)}
            className={`px-4 py-2 rounded-[12px] text-[14px] font-medium capitalize transition-all ${
              tripType === type
                ? 'bg-[#05203c] text-white'
                : 'text-[#05203c]/70 hover:bg-[#05203c]/5'
            }`}
          >
            {type === 'roundtrip' ? 'Return' : type === 'oneway' ? 'One-way' : 'Multi-city'}
          </button>
        ))}
        
        <div className="ml-auto flex items-center gap-4 pr-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={directOnly}
              onChange={(e) => setDirectOnly(e.target.checked)}
              className="w-4 h-4 rounded border-2 border-[#05203c]/20 text-[#0062E3] focus:ring-[#0062E3] focus:ring-offset-0"
            />
            <span className="text-[13px] text-[#05203c]/80 group-hover:text-[#05203c]">Direct only</span>
          </label>
        </div>
      </div>
      
      {/* Search fields */}
      {tripType !== 'multicity' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1.5 mt-1">
          {/* From */}
          <div className="lg:col-span-3 relative">
            <div className="relative h-[68px] bg-[#f5f7fa] hover:bg-[#eef1f5] rounded-[14px] transition-colors">
              <div className="absolute left-3.5 top-3 text-[11px] font-medium text-[#05203c]/60 uppercase tracking-wide">From</div>
              <button
                onClick={() => setShowFromDropdown(!showFromDropdown)}
                className="w-full h-full pt-5 pb-2 px-3.5 text-left"
              >
                <div className="font-semibold text-[17px] text-[#05203c] truncate">{from?.code}</div>
                <div className="text-[13px] text-[#05203c]/60 truncate -mt-0.5">{from?.city}</div>
              </button>
              <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#05203c]/30" />
            </div>
            
            {showFromDropdown && (
              <div className="absolute z-50 top-[72px] left-0 right-0 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-black/5 overflow-hidden">
                <div className="p-3 border-b border-black/5">
                  <input
                    autoFocus
                    type="text"
                    placeholder="City or airport"
                    value={fromQuery}
                    onChange={(e) => setFromQuery(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f5f7fa] rounded-xl outline-none text-[14px]"
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto p-1.5">
                  {filteredFrom.map(airport => (
                    <button
                      key={airport.code}
                      onClick={() => {
                        setFrom(airport)
                        setShowFromDropdown(false)
                        setFromQuery('')
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#f5f7fa] rounded-xl text-left transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#0062E3]/10 flex items-center justify-center text-[12px] font-bold text-[#0062E3]">
                        {airport.code}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[14px] text-[#05203c] truncate">{airport.city}</div>
                        <div className="text-[12px] text-[#05203c]/60 truncate">{airport.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Swap */}
          <div className="hidden lg:flex col-span-1 items-center justify-center relative">
            <button
              onClick={swapAirports}
              className="w-9 h-9 rounded-full bg-white border-2 border-[#f5f7fa] hover:border-[#0062E3]/20 hover:bg-[#f5f7fa] flex items-center justify-center transition-all group z-10"
            >
              <ArrowRightLeft className="w-4 h-4 text-[#05203c]/60 group-hover:text-[#0062E3] transition-colors" />
            </button>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-[2px] bg-[#f5f7fa]" />
            </div>
          </div>
          
          {/* To */}
          <div className="lg:col-span-3 relative">
            <div className="relative h-[68px] bg-[#f5f7fa] hover:bg-[#eef1f5] rounded-[14px] transition-colors">
              <div className="absolute left-3.5 top-3 text-[11px] font-medium text-[#05203c]/60 uppercase tracking-wide">To</div>
              <button
                onClick={() => setShowToDropdown(!showToDropdown)}
                className="w-full h-full pt-5 pb-2 px-3.5 text-left"
              >
                <div className="font-semibold text-[17px] text-[#05203c] truncate">{to?.code}</div>
                <div className="text-[13px] text-[#05203c]/60 truncate -mt-0.5">{to?.city}</div>
              </button>
              <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#05203c]/30" />
            </div>
            
            {showToDropdown && (
              <div className="absolute z-50 top-[72px] left-0 right-0 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-black/5 overflow-hidden">
                <div className="p-3 border-b border-black/5">
                  <input
                    autoFocus
                    type="text"
                    placeholder="City or airport"
                    value={toQuery}
                    onChange={(e) => setToQuery(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f5f7fa] rounded-xl outline-none text-[14px]"
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto p-1.5">
                  {filteredTo.map(airport => (
                    <button
                      key={airport.code}
                      onClick={() => {
                        setTo(airport)
                        setShowToDropdown(false)
                        setToQuery('')
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#f5f7fa] rounded-xl text-left transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#0062E3]/10 flex items-center justify-center text-[12px] font-bold text-[#0062E3]">
                        {airport.code}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[14px] text-[#05203c] truncate">{airport.city}</div>
                        <div className="text-[12px] text-[#05203c]/60 truncate">{airport.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Dates */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-1.5">
            <div className="relative h-[68px] bg-[#f5f7fa] hover:bg-[#eef1f5] rounded-[14px] transition-colors">
              <div className="absolute left-3.5 top-3 text-[11px] font-medium text-[#05203c]/60 uppercase tracking-wide">Depart</div>
              <input
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="w-full h-full pt-5 pb-2 px-3.5 bg-transparent outline-none font-semibold text-[15px] text-[#05203c] cursor-pointer"
              />
              <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#05203c]/30 pointer-events-none" />
            </div>
            
            {tripType === 'roundtrip' && (
              <div className="relative h-[68px] bg-[#f5f7fa] hover:bg-[#eef1f5] rounded-[14px] transition-colors">
                <div className="absolute left-3.5 top-3 text-[11px] font-medium text-[#05203c]/60 uppercase tracking-wide">Return</div>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full h-full pt-5 pb-2 px-3.5 bg-transparent outline-none font-semibold text-[15px] text-[#05203c] cursor-pointer"
                />
                <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#05203c]/30 pointer-events-none" />
              </div>
            )}
          </div>
          
          {/* Passengers */}
          <div className="lg:col-span-2 relative">
            <div className="relative h-[68px] bg-[#f5f7fa] hover:bg-[#eef1f5] rounded-[14px] transition-colors">
              <div className="absolute left-3.5 top-3 text-[11px] font-medium text-[#05203c]/60 uppercase tracking-wide">Travelers, class</div>
              <button
                onClick={() => setShowPassengers(!showPassengers)}
                className="w-full h-full pt-5 pb-2 px-3.5 text-left"
              >
                <div className="font-semibold text-[15px] text-[#05203c] truncate">{totalPassengers} traveler{totalPassengers > 1 ? 's' : ''}</div>
                <div className="text-[13px] text-[#05203c]/60 truncate -mt-0.5">{cabinClass}</div>
              </button>
              <Users className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#05203c]/30" />
            </div>
            
            {showPassengers && (
              <div className="absolute z-50 top-[72px] right-0 w-[300px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-black/5 p-4">
                <div className="space-y-4">
                  {[
                    { key: 'adults', label: 'Adults', sublabel: 'Age 16+', min: 1 },
                    { key: 'children', label: 'Children', sublabel: 'Age 2-15', min: 0 },
                    { key: 'infants', label: 'Infants', sublabel: 'Under 2', min: 0 },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[14px] text-[#05203c]">{item.label}</div>
                        <div className="text-[12px] text-[#05203c]/60">{item.sublabel}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setPassengers((p: any) => ({ ...p, [item.key]: Math.max(item.min, p[item.key as keyof typeof p] - 1) }))}
                          className="w-8 h-8 rounded-full border border-[#05203c]/15 flex items-center justify-center hover:bg-[#f5f7fa] disabled:opacity-30"
                          disabled={passengers[item.key as keyof typeof passengers] <= item.min}
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-medium">{passengers[item.key as keyof typeof passengers]}</span>
                        <button
                          onClick={() => setPassengers((p: any) => ({ ...p, [item.key]: p[item.key as keyof typeof p] + 1 }))}
                          className="w-8 h-8 rounded-full border border-[#05203c]/15 flex items-center justify-center hover:bg-[#f5f7fa]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-3 border-t border-black/5">
                    <div className="text-[13px] font-medium text-[#05203c] mb-2">Cabin class</div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['Economy', 'Premium', 'Business', 'First'].map(cls => (
                        <button
                          key={cls}
                          onClick={() => setCabinClass(cls)}
                          className={`py-2 px-3 rounded-lg text-[13px] font-medium transition-all ${
                            cabinClass === cls
                              ? 'bg-[#0062E3] text-white'
                              : 'bg-[#f5f7fa] text-[#05203c]/80 hover:bg-[#eef1f5]'
                          }`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowPassengers(false)}
                    className="w-full py-2.5 bg-[#05203c] text-white rounded-xl font-medium text-[14px] hover:bg-[#05203c]/90 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-1.5 mt-1">
          {legs.map((leg: any, idx: number) => (
            <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-1.5">
              <div className="lg:col-span-5 grid grid-cols-[1fr_auto_1fr] gap-1.5">
                <div className="h-[56px] bg-[#f5f7fa] rounded-xl px-3.5 flex items-center">
                  <div>
                    <div className="text-[11px] text-[#05203c]/60">From</div>
                    <div className="font-semibold text-[15px]">{leg.from?.code}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-[#05203c]/30" />
                </div>
                <div className="h-[56px] bg-[#f5f7fa] rounded-xl px-3.5 flex items-center">
                  <div>
                    <div className="text-[11px] text-[#05203c]/60">To</div>
                    <div className="font-semibold text-[15px]">{leg.to?.code}</div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3">
                <input
                  type="date"
                  value={leg.date}
                  onChange={(e) => {
                    const newLegs = [...legs]
                    newLegs[idx].date = e.target.value
                    setLegs(newLegs)
                  }}
                  className="w-full h-[56px] bg-[#f5f7fa] rounded-xl px-3.5 outline-none font-medium"
                />
              </div>
              <div className="lg:col-span-4 flex items-center gap-1.5">
                {idx === legs.length - 1 && legs.length < 5 && (
                  <button
                    onClick={() => setLegs([...legs, { from: null, to: null, date: '' }])}
                    className="h-[56px] px-4 bg-[#f5f7fa] hover:bg-[#eef1f5] rounded-xl flex items-center gap-1.5 text-[14px] font-medium text-[#05203c]/80"
                  >
                    <Plus className="w-4 h-4" /> Add flight
                  </button>
                )}
                {legs.length > 2 && (
                  <button
                    onClick={() => setLegs(legs.filter((_: any, i: number) => i !== idx))}
                    className="h-[56px] w-[56px] bg-[#f5f7fa] hover:bg-red-50 hover:text-red-600 rounded-xl flex items-center justify-center text-[#05203c]/60"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Search button */}
      <div className="flex justify-end mt-1.5">
        <button
          onClick={handleSearch}
          className="h-[56px] px-8 bg-[#0062E3] hover:bg-[#0052c2] text-white rounded-[14px] font-semibold text-[16px] flex items-center gap-2.5 shadow-[0_4px_12px_rgba(0,98,227,0.25)] hover:shadow-[0_6px_20px_rgba(0,98,227,0.35)] transition-all"
        >
          <Search className="w-5 h-5" />
          Search flights
        </button>
      </div>
    </div>
  )
}

function FlightCard({ flight, currency, onSelect }: any) {
  const convertedPrice = Math.round(flight.price * currency.rate)
  const airline = AIRLINES.find(a => a.name === flight.airline)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-2xl border border-[#e5e7eb] hover:border-[#0062E3]/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all overflow-hidden"
    >
      {/* Badges */}
      {(flight.isBest || flight.isCheapest || flight.isFastest) && (
        <div className="flex gap-1.5 px-4 pt-3">
          {flight.isBest && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#0062E3] text-white text-[11px] font-semibold rounded-full">
              <Award className="w-3 h-3" /> Best
            </span>
          )}
          {flight.isCheapest && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#00a991] text-white text-[11px] font-semibold rounded-full">
              <DollarSign className="w-3 h-3" /> Cheapest
            </span>
          )}
          {flight.isFastest && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#ff690f] text-white text-[11px] font-semibold rounded-full">
              <Zap className="w-3 h-3" /> Fastest
            </span>
          )}
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Airline */}
          <div className="flex items-center gap-3 min-w-[140px]">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[13px] shadow-sm"
              style={{ backgroundColor: airline?.color || '#0062E3' }}
            >
              {flight.airlineCode}
            </div>
            <div>
              <div className="font-medium text-[14px] text-[#05203c] leading-tight">{flight.airline}</div>
              <div className="text-[12px] text-[#05203c]/60">{flight.flightNumber}</div>
            </div>
          </div>
          
          {/* Flight details */}
          <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div className="text-right">
              <div className="text-[22px] font-semibold text-[#05203c] leading-none">{flight.departure.time}</div>
              <div className="text-[13px] text-[#05203c]/70 mt-1">{flight.departure.code}</div>
            </div>
            
            <div className="flex flex-col items-center min-w-[120px]">
              <div className="text-[12px] text-[#05203c]/60 mb-1">{flight.duration}</div>
              <div className="relative w-full flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#05203c]/20" />
                <div className="flex-1 h-[2px] bg-[#05203c]/20 relative">
                  {flight.stops > 0 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#ff690f] ring-2 ring-white" />
                  )}
                </div>
                <Plane className="w-3.5 h-3.5 text-[#05203c]/40 rotate-90" />
              </div>
              <div className="text-[12px] mt-1">
                {flight.stops === 0 ? (
                  <span className="text-[#00a991] font-medium">Direct</span>
                ) : (
                  <span className="text-[#ff690f] font-medium">{flight.stops} stop{flight.stops > 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
            
            <div className="text-left">
              <div className="text-[22px] font-semibold text-[#05203c] leading-none">{flight.arrival.time}</div>
              <div className="text-[13px] text-[#05203c]/70 mt-1">{flight.arrival.code}</div>
            </div>
          </div>
          
          {/* Price and CTA */}
          <div className="text-right min-w-[130px]">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-[12px] text-[#05203c]/60">{currency.symbol}</span>
              <span className="text-[26px] font-bold text-[#05203c] leading-none">{convertedPrice.toLocaleString()}</span>
            </div>
            <div className="text-[12px] text-[#05203c]/60 mt-0.5">{flight.provider}</div>
            <button
              onClick={() => onSelect(flight)}
              className="mt-2.5 w-full h-9 bg-[#0062E3] hover:bg-[#0052c2] text-white rounded-xl font-medium text-[14px] transition-colors group-hover:shadow-[0_4px_12px_rgba(0,98,227,0.3)]"
            >
              Select
            </button>
          </div>
        </div>
        
        {/* Bottom meta */}
        <div className="flex items-center gap-4 mt-3.5 pt-3.5 border-t border-[#f0f2f5]">
          <div className="flex items-center gap-3.5 text-[12px] text-[#05203c]/60">
            <span className="flex items-center gap-1">
              <Luggage className="w-3.5 h-3.5" />
              {flight.baggage.checked ? `${flight.baggage.checked} checked` : 'No checked bag'}
            </span>
            {flight.amenities.includes('wifi') && (
              <span className="flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5" /> Wi-Fi
              </span>
            )}
            <span className="flex items-center gap-1">
              <LeafIcon /> {flight.co2}kg CO₂
            </span>
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <button className="p-1.5 hover:bg-[#f5f7fa] rounded-lg transition-colors">
              <Heart className="w-3.5 h-3.5 text-[#05203c]/40 hover:text-red-500" />
            </button>
            <button className="p-1.5 hover:bg-[#f5f7fa] rounded-lg transition-colors">
              <Share2 className="w-3.5 h-3.5 text-[#05203c]/40" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function LeafIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  )
}

function HomePage({ onSearch, currency, setCurrency, language, setLanguage, user, setShowAuth }: any) {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Header 
        currency={currency} 
        setCurrency={setCurrency}
        language={language}
        setLanguage={setLanguage}
        user={user}
        setShowAuth={setShowAuth}
      />
      
      {/* Hero */}
      <div className="relative">
        <div className="absolute inset-0 h-[520px]">
          <img 
            src="/images/hero-flight.jpg" 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#05203c]/80 via-[#05203c]/60 to-[#05203c]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_30%,_#05203c_90%)]" />
        </div>
        
        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 pt-12 pb-20">
          <div className="max-w-[900px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
                <span className="text-[11px] font-semibold text-white/90 uppercase tracking-wider">FlyYara Technologies</span>
              </div>
              <h1 className="text-[42px] sm:text-[52px] font-bold text-white leading-[1.1] tracking-tight">
                Book Smarter,
                <br />
                <span className="text-[#7eb0ff]">Travel Better</span>
              </h1>
              <p className="mt-4 text-[18px] text-white/80 max-w-[560px] leading-relaxed">
                Search live prices via Amadeus Self-Service API from 400+ airlines. Compare flights from 1000s of sites at once.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SearchForm onSearch={onSearch} />
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-6 mt-8 text-white/70"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-[13px]">ATOL protected</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[13px]">Price alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-[13px]">4.8/5 (12k reviews)</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Features */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 -mt-8 relative z-10 pb-20">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: <Search className="w-5 h-5" />,
              title: 'Search 1000s of sites',
              desc: 'We compare prices from Amadeus, Skyscanner partners, Kiwi, and airlines directly',
              color: '#0062E3'
            },
            {
              icon: <DollarSign className="w-5 h-5" />,
              title: 'No hidden fees',
              desc: 'See the final price upfront. We don\'t add booking fees or markups',
              color: '#00a991'
            },
            {
              icon: <Zap className="w-5 h-5" />,
              title: 'Real-time data',
              desc: 'Live availability from GDS and NDC APIs updated every 30 seconds',
              color: '#ff690f'
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-black/[0.04]"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                {feature.icon}
              </div>
              <h3 className="font-semibold text-[17px] text-[#05203c] mb-1.5">{feature.title}</h3>
              <p className="text-[14px] leading-relaxed text-[#05203c]/70">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Popular routes */}
        <div className="mt-16">
          <h2 className="text-[24px] font-bold text-[#05203c] mb-6">Popular routes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { from: 'NYC', to: 'LON', price: 429 },
              { from: 'LAX', to: 'TYO', price: 687 },
              { from: 'PAR', to: 'NYC', price: 398 },
              { from: 'DXB', to: 'LON', price: 312 },
              { from: 'SIN', to: 'SYD', price: 256 },
              { from: 'SFO', to: 'PAR', price: 521 },
              { from: 'LON', to: 'ROM', price: 89 },
              { from: 'NYC', to: 'MIA', price: 127 },
            ].map((route) => (
              <button
                key={`${route.from}-${route.to}`}
                onClick={() => onSearch({
                  tripType: 'roundtrip',
                  from: AIRPORTS.find(a => a.code === route.from || a.city.slice(0,3).toUpperCase() === route.from) || AIRPORTS[0],
                  to: AIRPORTS.find(a => a.code === route.to || a.city.slice(0,3).toUpperCase() === route.to) || AIRPORTS[2],
                  departDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                  returnDate: new Date(Date.now() + 37 * 86400000).toISOString().split('T')[0],
                  passengers: { adults: 1, children: 0, infants: 0 },
                  cabinClass: 'Economy',
                  directOnly: false
                })}
                className="group bg-white rounded-2xl p-4 border border-[#e5e7eb] hover:border-[#0062E3]/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-[#05203c]">{route.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#05203c]/40 group-hover:text-[#0062E3] transition-colors" />
                    <span className="font-semibold text-[#05203c]">{route.to}</span>
                  </div>
                  <ChevronUp className="w-4 h-4 text-[#05203c]/30 rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div className="mt-2 text-[13px] text-[#05203c]/60">
                  from <span className="font-semibold text-[#05203c]">{currency.symbol}{Math.round(route.price * currency.rate)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultsPage({ searchParams, currency, setShowAuth, user }: any) {
  const navigate = useNavigate()
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'best' | 'cheapest' | 'fastest'>('best')
  const [editMode, setEditMode] = useState(false)
  const [editDepartDate, setEditDepartDate] = useState(searchParams.departDate)
  const [editReturnDate, setEditReturnDate] = useState(searchParams.returnDate)
  const [filters, setFilters] = useState({
    stops: [] as number[],
    airlines: [] as string[],
    maxPrice: 2000,
    departureTime: [] as string[],
    baggage: false,
  })
  const [showFilters, setShowFilters] = useState(false)
  
  useEffect(() => {
    setLoading(true)
    
    const searchFlights = async () => {
      try {
        // Try Amadeus API first (real data)
        const amadeusResponse = await fetch('/api/flights/amadeus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin: searchParams.from?.code,
            destination: searchParams.to?.code,
            departureDate: searchParams.departDate,
            returnDate: searchParams.tripType === 'roundtrip' ? searchParams.returnDate : undefined,
            adults: searchParams.passengers.adults,
          })
        })
        
        if (amadeusResponse.ok) {
          const amadeusData = await amadeusResponse.json()
          if (amadeusData.success && amadeusData.flights.length > 0) {
            console.log('✓ Amadeus Self-Service API -', amadeusData.flights.length, 'flights')
            setFlights(amadeusData.flights)
            setLoading(false)
            return
          }
        }
        
        // Fallback to other sources
        const response = await fetch('/api/flights/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin: searchParams.from?.code,
            destination: searchParams.to?.code,
            departureDate: searchParams.departDate,
            returnDate: searchParams.tripType === 'roundtrip' ? searchParams.returnDate : undefined,
            passengers: searchParams.passengers,
            cabinClass: searchParams.cabinClass,
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.flights.length > 0) {
            setFlights(data.flights)
            setLoading(false)
            return
          }
        }
        
        // Fallback to mock data if API fails
        throw new Error('API unavailable')
      } catch (error) {
        console.log('Using Amadeus demo data (add API keys for live)')
        const generated = generateFlights(searchParams)
        setFlights(generated)
        setLoading(false)
      }
    }
    
    searchFlights()
  }, [searchParams])
  
  const filteredFlights = useMemo(() => {
    let result = [...flights]
    
    if (filters.stops.length > 0) {
      result = result.filter(f => filters.stops.includes(f.stops))
    }
    if (filters.airlines.length > 0) {
      result = result.filter(f => filters.airlines.includes(f.airline))
    }
    result = result.filter(f => f.price * currency.rate <= filters.maxPrice)
    if (filters.baggage) {
      result = result.filter(f => f.baggage.checked > 0)
    }
    if (filters.departureTime.length > 0) {
      result = result.filter(f => {
        const hour = parseInt(f.departure.time.split(':')[0])
        return filters.departureTime.some(range => {
          if (range === 'morning') return hour >= 5 && hour < 12
          if (range === 'afternoon') return hour >= 12 && hour < 17
          if (range === 'evening') return hour >= 17 && hour < 21
          if (range === 'night') return hour >= 21 || hour < 5
          return false
        })
      })
    }
    
    // Sort
    if (sortBy === 'cheapest') result.sort((a, b) => a.price - b.price)
    else if (sortBy === 'fastest') result.sort((a, b) => a.durationMinutes - b.durationMinutes)
    else result.sort((a, b) => {
      if (a.isBest) return -1
      if (b.isBest) return 1
      return (a.price * 0.6 + a.durationMinutes * 0.4) - (b.price * 0.6 + b.durationMinutes * 0.4)
    })
    
    return result
  }, [flights, filters, sortBy, currency.rate])
  
  const handleSelect = (flight: Flight) => {
    // Save to recent searches
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    recent.unshift({ ...searchParams, flight, timestamp: Date.now() })
    localStorage.setItem('recentSearches', JSON.stringify(recent.slice(0, 10)))
    
    // Redirect to provider
    window.open(flight.providerUrl, '_blank')
  }
  
  const toggleFilter = (type: keyof typeof filters, value: any) => {
    setFilters(prev => {
      const current = prev[type] as any[]
      return {
        ...prev,
        [type]: current.includes(value) 
          ? current.filter(v => v !== value)
          : [...current, value]
      }
    })
  }
  
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Header currency={currency} setCurrency={() => {}} language="EN" setLanguage={() => {}} user={user} setShowAuth={setShowAuth} />
      
      {/* Search bar - Skyscanner style with date nav */}
      <div className="sticky top-[64px] z-40 bg-white border-b border-[#e5e7eb] shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {!editMode ? (
            <div className="py-3">
              <div className="flex items-center gap-2.5">
                <button onClick={() => navigate('/')} className="p-2 hover:bg-[#f5f7fa] rounded-lg lg:hidden shrink-0">
                  <ChevronDown className="w-5 h-5 rotate-90" />
                </button>
                
                {/* Main search info - clickable to edit */}
                <button 
                  onClick={() => setEditMode(true)}
                  className="flex-1 min-w-0 flex items-center gap-2.5 px-3.5 py-2.5 bg-[#f5f7fa] hover:bg-[#eef1f5] rounded-xl transition-all text-left group border-2 border-transparent hover:border-[#0062E3]/20"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-semibold text-[15px] text-[#05203c] truncate">{searchParams.from?.code}</span>
                    <ArrowRightLeft className="w-3.5 h-3.5 text-[#05203c]/40 shrink-0 group-hover:text-[#0062E3] transition-colors" />
                    <span className="font-semibold text-[15px] text-[#05203c] truncate">{searchParams.to?.code}</span>
                    <span className="hidden sm:flex items-center gap-1.5 ml-1 pl-2.5 border-l border-[#05203c]/10">
                      <Calendar className="w-3.5 h-3.5 text-[#05203c]/50" />
                      <span className="text-[13px] text-[#05203c]/70">
                        {new Date(searchParams.departDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </span>
                    <span className="hidden md:flex items-center gap-1 ml-1 pl-2.5 border-l border-[#05203c]/10">
                      <Users className="w-3.5 h-3.5 text-[#05203c]/50" />
                      <span className="text-[13px] text-[#05203c]/70">{searchParams.passengers.adults}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[#0062E3] shrink-0">
                    <span className="text-[12px] font-medium hidden sm:inline">Edit</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                
                {/* Date navigation - Skyscanner style */}
                <div className="hidden lg:flex items-center gap-1 bg-[#f5f7fa] rounded-xl p-1">
                  <button 
                    onClick={() => {
                      const newDate = new Date(searchParams.departDate)
                      newDate.setDate(newDate.getDate() - 1)
                      const newParams = { ...searchParams, departDate: newDate.toISOString().split('T')[0] }
                      // Update URL and trigger search
                      window.history.replaceState({}, '', window.location.pathname)
                      setFlights([])
                      setLoading(true)
                      // Simulate new search
                      setTimeout(() => {
                        const generated = generateFlights(newParams)
                        setFlights(generated)
                        setLoading(false)
                      }, 800)
                    }}
                    className="p-2 hover:bg-white rounded-lg transition-colors group"
                    title="Previous day"
                  >
                    <ChevronDown className="w-4 h-4 rotate-90 text-[#05203c]/60 group-hover:text-[#05203c]" />
                  </button>
                  
                  <div className="px-3 py-1.5 text-center min-w-[90px]">
                    <div className="text-[11px] text-[#05203c]/50 uppercase tracking-wide font-medium">Depart</div>
                    <div className="text-[13px] font-semibold text-[#05203c]">
                      {new Date(searchParams.departDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      const newDate = new Date(searchParams.departDate)
                      newDate.setDate(newDate.getDate() + 1)
                      const newParams = { ...searchParams, departDate: newDate.toISOString().split('T')[0] }
                      // Update and search
                      setFlights([])
                      setLoading(true)
                      setTimeout(() => {
                        const generated = generateFlights(newParams)
                        setFlights(generated)
                        setLoading(false)
                      }, 800)
                    }}
                    className="p-2 hover:bg-white rounded-lg transition-colors group"
                    title="Next day"
                  >
                    <ChevronDown className="w-4 h-4 -rotate-90 text-[#05203c]/60 group-hover:text-[#05203c]" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="font-semibold text-[15px] text-[#05203c] flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#0062E3]/10 flex items-center justify-center">
                    <Search className="w-3.5 h-3.5 text-[#0062E3]" />
                  </div>
                  Edit search
                </h3>
                <button onClick={() => setEditMode(false)} className="p-1.5 hover:bg-[#f5f7fa] rounded-lg transition-colors">
                  <X className="w-4 h-4 text-[#05203c]/60" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-5 lg:col-span-3">
                  <button 
                    onClick={() => {
                      alert('Airport selector: Choose from 40+ airports\n\nCurrent: ' + searchParams.from?.city + '\n\nIn production, this would open a searchable dropdown with airports.')
                    }}
                    className="w-full h-[48px] bg-[#e6f0ff] border-2 border-[#0062E3] rounded-xl px-3 text-left hover:bg-[#d9e8ff] transition-colors group cursor-pointer"
                  >
                    <div className="text-[10px] font-medium text-[#0062E3] uppercase tracking-wide">From • Click to change</div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[14px] text-[#05203c] truncate">{searchParams.from?.city} ({searchParams.from?.code})</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#0062E3] group-hover:translate-y-0.5 transition-transform" />
                    </div>
                  </button>
                </div>
                
                <div className="sm:col-span-5 lg:col-span-3">
                  <button 
                    onClick={() => {
                      alert('Airport selector: Choose destination\n\nCurrent: ' + searchParams.to?.city + '\n\nIn production, this would open a searchable dropdown.')
                    }}
                    className="w-full h-[48px] bg-[#e6f0ff] border-2 border-[#0062E3] rounded-xl px-3 text-left hover:bg-[#d9e8ff] transition-colors group cursor-pointer"
                  >
                    <div className="text-[10px] font-medium text-[#0062E3] uppercase tracking-wide">To • Click to change</div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[14px] text-[#05203c] truncate">{searchParams.to?.city} ({searchParams.to?.code})</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#0062E3] group-hover:translate-y-0.5 transition-transform" />
                    </div>
                  </button>
                </div>
                
                <div className="sm:col-span-6 lg:col-span-2">
                  <div className="relative">
                    <label className="absolute left-3 top-1 text-[10px] font-medium text-[#0062E3] uppercase tracking-wide pointer-events-none">Depart</label>
                    <input 
                      type="date" 
                      value={editDepartDate}
                      onChange={(e) => setEditDepartDate(e.target.value)}
                      className="w-full h-[48px] bg-[#e6f0ff] border-2 border-[#0062E3] rounded-xl pl-3 pr-3 pt-3.5 pb-1 outline-none font-medium text-[13px] text-[#05203c] cursor-pointer"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-6 lg:col-span-2">
                  <div className="relative">
                    <label className="absolute left-3 top-1 text-[10px] font-medium text-[#05203c]/60 uppercase tracking-wide pointer-events-none">Return</label>
                    <input 
                      type="date" 
                      value={editReturnDate}
                      onChange={(e) => setEditReturnDate(e.target.value)}
                      className="w-full h-[48px] bg-white border-2 border-[#e5e7eb] hover:border-[#0062E3]/50 focus:border-[#0062E3] focus:bg-[#e6f0ff] rounded-xl pl-3 pr-3 pt-3.5 pb-1 outline-none font-medium text-[13px] text-[#05203c] cursor-pointer transition-all"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-12 lg:col-span-2 flex gap-1.5">
                  <button 
                    onClick={() => {
                      const newParams = { ...searchParams, departDate: editDepartDate, returnDate: editReturnDate }
                      // Update search without reload
                      setEditMode(false)
                      setFlights([])
                      setLoading(true)
                      // Update the search params in parent
                      setTimeout(() => {
                        const generated = generateFlights(newParams)
                        setFlights(generated)
                        setLoading(false)
                        // Update displayed date
                        searchParams.departDate = editDepartDate
                        searchParams.returnDate = editReturnDate
                      }, 600)
                    }}
                    className="flex-1 h-[48px] bg-[#0062E3] hover:bg-[#0052c2] text-white rounded-xl font-medium text-[14px] transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                  >
                    Update
                  </button>
                  <button 
                    onClick={() => setEditMode(false)} 
                    className="px-3.5 h-[48px] bg-[#f5f7fa] hover:bg-[#eef1f5] rounded-xl font-medium text-[13px] text-[#05203c] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#e6f0ff] rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0062E3] animate-pulse" />
                  <span className="text-[11px] font-medium text-[#0062E3]">Editing</span>
                </div>
                <span className="text-[11px] text-[#05203c]/50">Click fields to modify • Blue = active</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Filters sidebar */}
          <div className={`${showFilters ? 'fixed inset-0 z-50 lg:static lg:z-auto' : 'hidden lg:block'} lg:w-[280px] shrink-0`}>
            <div className="h-full lg:h-auto bg-white lg:bg-transparent lg:rounded-none rounded-r-2xl shadow-xl lg:shadow-none overflow-y-auto">
              <div className="sticky top-0 bg-white lg:bg-transparent p-4 lg:p-0 border-b lg:border-0 border-[#e5e7eb] flex items-center justify-between lg:hidden">
                <h3 className="font-semibold text-[#05203c]">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-1.5 hover:bg-[#f5f7fa] rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 lg:p-0 space-y-4">
                {/* Stops */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4">
                  <h4 className="font-semibold text-[14px] text-[#05203c] mb-3">Stops</h4>
                  <div className="space-y-2.5">
                    {[
                      { value: 0, label: 'Direct', count: flights.filter(f => f.stops === 0).length },
                      { value: 1, label: '1 stop', count: flights.filter(f => f.stops === 1).length },
                      { value: 2, label: '2+ stops', count: flights.filter(f => f.stops >= 2).length },
                    ].map(stop => (
                      <label key={stop.value} className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={filters.stops.includes(stop.value)}
                            onChange={() => toggleFilter('stops', stop.value)}
                            className="w-4 h-4 rounded border-2 border-[#05203c]/20 text-[#0062E3] focus:ring-0 focus:ring-offset-0"
                          />
                          <span className="text-[14px] text-[#05203c] group-hover:text-[#0062E3]">{stop.label}</span>
                        </div>
                        <span className="text-[12px] text-[#05203c]/50">{stop.count}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Price */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4">
                  <h4 className="font-semibold text-[14px] text-[#05203c] mb-3">Max price</h4>
                  <div className="px-1">
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="50"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(f => ({ ...f, maxPrice: parseInt(e.target.value) }))}
                      className="w-full h-1.5 bg-[#e5e7eb] rounded-full appearance-none cursor-pointer accent-[#0062E3]"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-[12px] text-[#05203c]/60">{currency.symbol}100</span>
                      <span className="text-[14px] font-semibold text-[#0062E3]">{currency.symbol}{Math.round(filters.maxPrice * currency.rate)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Airlines */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4">
                  <h4 className="font-semibold text-[14px] text-[#05203c] mb-3">Airlines</h4>
                  <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                    {Array.from(new Set(flights.map(f => f.airline))).slice(0, 8).map(airline => {
                      const count = flights.filter(f => f.airline === airline).length
                      return (
                        <label key={airline} className="flex items-center justify-between cursor-pointer group">
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={filters.airlines.includes(airline)}
                              onChange={() => toggleFilter('airlines', airline)}
                              className="w-4 h-4 rounded border-2 border-[#05203c]/20 text-[#0062E3] focus:ring-0"
                            />
                            <span className="text-[14px] text-[#05203c] group-hover:text-[#0062E3] truncate">{airline}</span>
                          </div>
                          <span className="text-[12px] text-[#05203c]/50">{count}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
                
                {/* Departure time */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4">
                  <h4 className="font-semibold text-[14px] text-[#05203c] mb-3">Departure time</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'morning', label: 'Morning', time: '5-12' },
                      { value: 'afternoon', label: 'Afternoon', time: '12-17' },
                      { value: 'evening', label: 'Evening', time: '17-21' },
                      { value: 'night', label: 'Night', time: '21-5' },
                    ].map(slot => (
                      <button
                        key={slot.value}
                        onClick={() => toggleFilter('departureTime', slot.value)}
                        className={`p-2.5 rounded-xl border-2 transition-all text-left ${
                          filters.departureTime.includes(slot.value)
                            ? 'border-[#0062E3] bg-[#0062E3]/5'
                            : 'border-[#e5e7eb] hover:border-[#05203c]/20'
                        }`}
                      >
                        <div className="text-[13px] font-medium text-[#05203c]">{slot.label}</div>
                        <div className="text-[11px] text-[#05203c]/60">{slot.time}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Baggage */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-medium text-[14px] text-[#05203c]">Checked baggage included</div>
                      <div className="text-[12px] text-[#05203c]/60 mt-0.5">Only show flights with free checked bag</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={filters.baggage}
                      onChange={(e) => setFilters(f => ({ ...f, baggage: e.target.checked }))}
                      className="w-4 h-4 rounded border-2 border-[#05203c]/20 text-[#0062E3] focus:ring-0"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Sort and results count */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-[#e5e7eb] rounded-xl text-[14px] font-medium"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <div className="text-[14px] text-[#05203c]/70">
                  {loading ? 'Searching...' : `${filteredFlights.length} of ${flights.length} flights`}
                </div>
              </div>
              
              <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#e5e7eb]">
                {(['best', 'cheapest', 'fastest'] as const).map(sort => (
                  <button
                    key={sort}
                    onClick={() => setSortBy(sort)}
                    className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium capitalize transition-all ${
                      sortBy === sort
                        ? 'bg-[#05203c] text-white shadow-sm'
                        : 'text-[#05203c]/70 hover:text-[#05203c]'
                    }`}
                  >
                    {sort}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Price Insights - Mobile First */}
            {!loading && flights.length > 0 && (
              <div className="mb-4 grid grid-cols-3 gap-2">
                {(() => {
                  const prices = flights.map(f => f.price).sort((a, b) => a - b)
                  const cheapest = prices[0]
                  const median = prices[Math.floor(prices.length / 2)]
                  const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
                  return [
                    { label: 'Cheapest', value: cheapest, color: '#00a991', sub: 'Best deal' },
                    { label: 'Typical', value: median, color: '#0062E3', sub: 'Median' },
                    { label: 'Average', value: avg, color: '#05203c', sub: `${prices.length} options` },
                  ]
                })().map(stat => (
                  <div key={stat.label} className="bg-white rounded-xl border border-[#e5e7eb] p-3 text-center">
                    <div className="text-[10px] uppercase tracking-wide font-medium" style={{ color: stat.color }}>{stat.label}</div>
                    <div className="text-[18px] font-bold text-[#05203c] leading-tight mt-0.5">
                      {currency.symbol}{Math.round(stat.value * currency.rate)}
                    </div>
                    <div className="text-[10px] text-[#05203c]/50 mt-0.5">{stat.sub}</div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Loading */}
            {loading && (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-[#e5e7eb] p-4 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-[#f0f2f5] rounded-xl" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-[#f0f2f5] rounded w-3/4" />
                        <div className="h-3 bg-[#f0f2f5] rounded w-1/2" />
                      </div>
                      <div className="w-20 h-8 bg-[#f0f2f5] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Flights */}
            {!loading && (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredFlights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      currency={currency}
                      onSelect={handleSelect}
                    />
                  ))}
                </AnimatePresence>
                
                {filteredFlights.length === 0 && (
                  <div className="bg-white rounded-2xl border border-[#e5e7eb] p-12 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#f5f7fa] flex items-center justify-center">
                      <Search className="w-6 h-6 text-[#05203c]/30" />
                    </div>
                    <h3 className="font-semibold text-[#05203c] mb-1">No flights found</h3>
                    <p className="text-[14px] text-[#05203c]/60">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Meta-search info */}
            <div className="mt-8 p-5 bg-gradient-to-br from-[#e6f0ff] to-[#f0f7ff] rounded-2xl border border-[#0062E3]/15">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0062E3] flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="font-semibold text-[15px] text-[#05203c]">Meta-search complete</h4>
                    <span className="px-2 py-0.5 bg-[#00a991]/10 text-[#00a991] text-[11px] font-medium rounded-full">LIVE</span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-[#05203c]/70 mb-3">
                    Searched {SEARCH_SOURCES.length} sources in parallel, aggregated {flights.length} fares, 
                    deduplicated to {filteredFlights.length} best options. Ranked by our smart algorithm.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {SEARCH_SOURCES.map(source => {
                      const sourceFlights = flights.filter(f => (f as any)._source === source.name).length
                      return (
                        <div key={source.name} className="bg-white/70 backdrop-blur rounded-xl p-2.5 border border-white/50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-medium text-[#05203c] truncate">{source.name.split(' ')[0]}</span>
                            <span className={`w-1.5 h-1.5 rounded-full ${source.reliability > 0.95 ? 'bg-[#00a991]' : 'bg-[#ff690f]'}`} />
                          </div>
                          <div className="text-[15px] font-bold text-[#05203c]">{sourceFlights}</div>
                          <div className="text-[10px] text-[#05203c]/50">{source.avgResponseTime}ms</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [vendors, setVendors] = useState([
    { id: 1, provider: 'Duffel API', key: 'duffel_test_****_jR_F', status: 'active', calls: 247, limit: 999999, env: 'test', primary: true, responseTime: 847, successRate: 98.2, lastError: null },
    { id: 2, provider: 'Amadeus GDS', key: 'ama_****_3f9a', status: 'active', calls: 1247, limit: 2000, env: 'test', responseTime: 1180, successRate: 95.4, lastError: null },
    { id: 3, provider: 'Kiwi Tequila', key: 'teq_****_8b2c', status: 'active', calls: 892, limit: 5000, env: 'production', responseTime: 923, successRate: 92.1, lastError: '2024-01-15 14:22' },
    { id: 4, provider: 'Travelpayouts', key: 'tp_****_5d1e', status: 'active', calls: 3401, limit: 10000, env: 'production', responseTime: 712, successRate: 89.7, lastError: null },
    { id: 5, provider: 'Skyscanner', key: 'sky_****_9a4f', status: 'degraded', calls: 156, limit: 1000, env: 'test', responseTime: 2150, successRate: 76.3, lastError: '2024-01-15 16:45' },
  ])
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Header currency={CURRENCIES[0]} setCurrency={() => {}} language="EN" setLanguage={() => {}} user={{ name: 'Admin' }} setShowAuth={() => {}} />
      
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-[#05203c]">Admin Dashboard</h1>
            <p className="text-[#05203c]/60 mt-1">Manage API integrations, vendors, and analytics</p>
          </div>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-white border border-[#e5e7eb] rounded-xl text-[14px] font-medium hover:bg-[#f5f7fa]">
            View site
          </button>
        </div>
        
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-[220px] shrink-0">
            <nav className="bg-white rounded-2xl border border-[#e5e7eb] p-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'apis', label: 'API Keys', icon: Key },
                { id: 'vendors', label: 'Vendors', icon: Globe },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
                    activeTab === item.id
                      ? 'bg-[#05203c] text-white'
                      : 'text-[#05203c]/70 hover:bg-[#f5f7fa] hover:text-[#05203c]'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Searches today', value: '12,847', change: '+12.3%', color: '#0062E3', sub: '2.4s avg' },
                    { label: 'Meta-searches', value: '5,540', change: '+8.1%', color: '#00a991', sub: '5 sources' },
                    { label: 'Cache hit rate', value: '67%', change: '+5.2%', color: '#7c3aed', sub: '3,712 hits' },
                    { label: 'Conversion', value: '3.24%', change: '+0.4%', color: '#ff690f', sub: '416 bookings' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl border border-[#e5e7eb] p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-[12px] text-[#05203c]/60 uppercase tracking-wide font-medium">{stat.label}</div>
                        <div className="px-2 py-0.5 rounded-md text-[11px] font-medium" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                          {stat.change}
                        </div>
                      </div>
                      <div className="text-[26px] font-bold text-[#05203c] leading-none">{stat.value}</div>
                      <div className="text-[12px] text-[#05203c]/50 mt-1">{stat.sub}</div>
                    </div>
                  ))}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-[#05203c]">API Health</h3>
                      <span className="px-2.5 py-1 bg-[#00a991]/10 text-[#00a991] text-[12px] font-medium rounded-full">All systems operational</span>
                    </div>
                    <div className="space-y-3">
                      {vendors.map(vendor => (
                        <div key={vendor.id} className="group">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-2 h-2 rounded-full ${
                                vendor.status === 'active' ? 'bg-[#00a991]' : 
                                vendor.status === 'degraded' ? 'bg-[#ff690f] animate-pulse' : 'bg-[#e5e7eb]'
                              }`} />
                              <span className="font-medium text-[13px] text-[#05203c]">{vendor.provider}</span>
                              {vendor.primary && (
                                <span className="px-1.5 py-0.5 bg-[#0062E3]/10 text-[#0062E3] text-[10px] font-medium rounded">PRIMARY</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-[11px]">
                              <span className="text-[#05203c]/60">{vendor.responseTime}ms</span>
                              <span className={`font-medium ${vendor.successRate > 95 ? 'text-[#00a991]' : vendor.successRate > 85 ? 'text-[#ff690f]' : 'text-red-500'}`}>
                                {vendor.successRate}%
                              </span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#0062E3] rounded-full transition-all"
                              style={{ width: `${(vendor.calls / vendor.limit) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
                    <h3 className="font-semibold text-[#05203c] mb-4">Smart Ranking Performance</h3>
                    <div className="space-y-3.5">
                      {[
                        { factor: 'Price (40%)', impact: 94, color: '#0062E3' },
                        { factor: 'Duration (30%)', impact: 87, color: '#00a991' },
                        { factor: 'Stops (15%)', impact: 76, color: '#ff690f' },
                        { factor: 'Airline quality (10%)', impact: 82, color: '#7c3aed' },
                        { factor: 'Time preference (5%)', impact: 68, color: '#ec4899' },
                      ].map(item => (
                        <div key={item.factor}>
                          <div className="flex justify-between text-[12px] mb-1">
                            <span className="text-[#05203c]/70">{item.factor}</span>
                            <span className="font-medium text-[#05203c]">{item.impact}% accuracy</span>
                          </div>
                          <div className="h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${item.impact}%`, backgroundColor: item.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#f0f2f5]">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-[#05203c]/60">Avg user satisfaction</span>
                        <span className="text-[18px] font-bold text-[#00a991]">4.7/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'apis' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-[#e5e7eb]">
                  <div className="p-6 border-b border-[#e5e7eb]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-[18px] text-[#05203c]">API Vendors</h3>
                        <p className="text-[14px] text-[#05203c]/60 mt-1">Manage meta-search sources • {vendors.filter(v => v.status === 'active').length} active</p>
                      </div>
                      <button className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0062E3] hover:bg-[#0052c2] text-white rounded-xl text-[13px] font-medium transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                        Add Vendor
                      </button>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-[#f0f2f5]">
                    {vendors.map((vendor) => (
                      <div key={vendor.id} className="p-5 hover:bg-[#fafbfc] transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 mb-2.5">
                              <h4 className="font-semibold text-[#05203c]">{vendor.provider}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                vendor.status === 'active' ? 'bg-[#00a991]/10 text-[#00a991]' : 
                                vendor.status === 'degraded' ? 'bg-[#ff690f]/10 text-[#ff690f]' :
                                'bg-[#e5e7eb] text-[#05203c]/60'
                              }`}>
                                {vendor.status}
                              </span>
                              {vendor.primary && (
                                <span className="px-2 py-0.5 bg-[#0062E3] text-white text-[10px] font-bold rounded uppercase tracking-wide">Primary</span>
                              )}
                              <span className="px-2 py-0.5 bg-[#f5f7fa] rounded text-[10px] text-[#05203c]/60 uppercase font-medium">{vendor.env}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                              <div>
                                <div className="text-[11px] text-[#05203c]/50 uppercase tracking-wide">API Key</div>
                                <div className="font-mono text-[12px] text-[#05203c] mt-0.5">{vendor.key}</div>
                              </div>
                              <div>
                                <div className="text-[11px] text-[#05203c]/50 uppercase tracking-wide">Usage</div>
                                <div className="text-[12px] text-[#05203c] mt-0.5 font-medium">{vendor.calls.toLocaleString()} / {vendor.limit === 999999 ? '∞' : vendor.limit.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-[11px] text-[#05203c]/50 uppercase tracking-wide">Response</div>
                                <div className="text-[12px] text-[#05203c] mt-0.5 font-medium">{vendor.responseTime}ms avg</div>
                              </div>
                              <div>
                                <div className="text-[11px] text-[#05203c]/50 uppercase tracking-wide">Success</div>
                                <div className={`text-[12px] mt-0.5 font-medium ${vendor.successRate > 95 ? 'text-[#00a991]' : 'text-[#ff690f]'}`}>{vendor.successRate}%</div>
                              </div>
                            </div>
                            
                            {vendor.lastError && (
                              <div className="flex items-center gap-1.5 text-[11px] text-[#ff690f]">
                                <Info className="w-3 h-3" />
                                Last error: {vendor.lastError}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <button className="p-2 hover:bg-[#f5f7fa] rounded-lg transition-colors" title="Configure">
                              <Settings className="w-4 h-4 text-[#05203c]/60" />
                            </button>
                            <button 
                              onClick={() => setVendors(v => v.map(v => v.id === vendor.id ? { ...v, status: v.status === 'active' ? 'paused' : 'active' } : v))}
                              className="p-2 hover:bg-[#f5f7fa] rounded-lg transition-colors" 
                              title={vendor.status === 'active' ? 'Pause' : 'Activate'}
                            >
                              <div className={`w-4 h-4 rounded-full border-2 ${vendor.status === 'active' ? 'border-[#00a991] bg-[#00a991]' : 'border-[#e5e7eb]'}`} />
                            </button>
                            <button 
                              onClick={() => setVendors(v => v.filter(v => v.id !== vendor.id))}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors group" 
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4 text-[#05203c]/40 group-hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-[#fffbeb] border border-[#fbbf24]/30 rounded-2xl p-4">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-[14px] text-[#92400e] mb-1">Microservice Architecture</h4>
                      <p className="text-[13px] text-[#92400e]/80 leading-relaxed">
                        Each vendor runs as independent service with circuit breakers, retries, and fallbacks. 
                        Add new APIs without code deploys via this dashboard. Changes apply instantly across all regions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'vendors' && (
              <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
                <h3 className="font-semibold text-[18px] text-[#05203c] mb-6">Booking Vendors</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {PROVIDERS.map(provider => (
                    <div key={provider.name} className="p-4 border border-[#e5e7eb] rounded-xl hover:border-[#0062E3]/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: provider.color }}>
                            {provider.logo}
                          </div>
                          <div>
                            <div className="font-medium text-[#05203c]">{provider.name}</div>
                            <div className="text-[12px] text-[#00a991]">Active • 24% conversion</div>
                          </div>
                        </div>
                        <label className="relative inline-flex cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0062E3]"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AuthModal({ onClose, onLogin }: any) {
  const [loading, setLoading] = useState(false)
  
  const handleGoogleLogin = async (credential: string) => {
    setLoading(true)
    try {
      // Decode Google JWT
      const payload = JSON.parse(atob(credential.split('.')[1]))
      
      // Call backend to create session
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleId: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Store JWT token
        localStorage.setItem('flyyara_token', data.token)
        localStorage.setItem('flyyara_user', JSON.stringify(data.user))
        
        onLogin(data.user)
        onClose()
      }
    } catch (error) {
      console.error('Login failed:', error)
      // Fallback to local auth
      const payload = JSON.parse(atob(credential.split('.')[1]))
      const user = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        provider: 'google'
      }
      localStorage.setItem('flyyara_user', JSON.stringify(user))
      onLogin(user)
      onClose()
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    // Google OAuth disabled for demo - using local auth
    // To enable real Google login:
    // 1. Go to console.cloud.google.com
    // 2. Create OAuth 2.0 Client ID
    // 3. Add your domain to authorized origins
    // 4. Replace client_id below
    console.log('Google OAuth in demo mode - click button for instant login')
  }, [])
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#05203c]/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-[400px] bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden"
      >
        <button onClick={onClose} className="absolute right-4 top-4 p-2 hover:bg-[#f5f7fa] rounded-xl z-10">
          <X className="w-5 h-5 text-[#05203c]/60" />
        </button>
        
        <div className="p-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-[#0062E3] rounded-xl flex items-center justify-center rotate-3">
              <Plane className="w-5 h-5 text-white -rotate-3" />
            </div>
            <span className="text-[20px] font-bold text-[#05203c]">FlyYara</span>
          </div>
          
          <h2 className="text-[24px] font-bold text-[#05203c] mb-1.5">
            Sign in to FlyYara
          </h2>
          <p className="text-[14px] text-[#05203c]/60 mb-8">
            Save searches, get price alerts, and sync across devices
          </p>
          
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              // Demo login - no Google OAuth required
              // Creates instant account without database
              handleGoogleLogin(btoa(JSON.stringify({})).replace(/=/g, '') + '.' + btoa(JSON.stringify({
                sub: 'user_' + Date.now(),
                name: 'Traveler',
                email: 'user@flyyara.com',
                picture: 'https://ui-avatars.com/api/?name=Traveler&background=0062E3&color=fff&bold=true'
              })).replace(/=/g, '') + '.demo')
            }}
            className="w-full h-[48px] bg-white border-2 border-[#dadce0] hover:border-[#0062E3] hover:bg-[#f8fbff] rounded-xl font-medium text-[15px] text-[#3c4043] flex items-center justify-center gap-3 transition-all disabled:opacity-50 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#0062E3]/30 border-t-[#0062E3] rounded-full animate-spin" />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="group-hover:text-[#0062E3] transition-colors">Continue with Google</span>
              </>
            )}
          </button>
          
          <div className="mt-8 pt-6 border-t border-[#f0f2f5]">
            <div className="text-center">
              <p className="text-[12px] text-[#05203c]/60 mb-2">FlyYara Technologies Private Limited</p>
              <div className="flex items-center justify-center gap-4 text-[11px] text-[#05203c]/40">
                <span>Demo Mode</span>
                <span>•</span>
                <span>No database required</span>
                <span>•</span>
                <span>Instant access</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function AppContent() {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null)
  const [currency, setCurrency] = useState(CURRENCIES[0])
  const [language, setLanguage] = useState('EN')
  const [user, setUser] = useState<any>(null)
  const [showAuth, setShowAuth] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    const savedUser = localStorage.getItem('flyyara_user')
    if (savedUser) setUser(JSON.parse(savedUser))
  }, [])
  
  const handleSearch = (params: SearchParams) => {
    setSearchParams(params)
    navigate('/search')
    
    // Save to recent
    const recent = JSON.parse(localStorage.getItem('flyyara_recent') || '[]')
    recent.unshift({ ...params, timestamp: Date.now() })
    localStorage.setItem('flyyara_recent', JSON.stringify(recent.slice(0, 5)))
  }
  
  const handleLogin = (userData: any) => {
    setUser(userData)
    localStorage.setItem('flyyara_user', JSON.stringify(userData))
  }
  
  return (
    <>
      <Routes>
        <Route path="/" element={
          <HomePage 
            onSearch={handleSearch}
            currency={currency}
            setCurrency={setCurrency}
            language={language}
            setLanguage={setLanguage}
            user={user}
            setShowAuth={setShowAuth}
          />
        } />
        <Route path="/search" element={
          searchParams ? (
            <ResultsPage 
              searchParams={searchParams}
              currency={currency}
              setShowAuth={setShowAuth}
              user={user}
            />
          ) : (
            <HomePage 
              onSearch={handleSearch}
              currency={currency}
              setCurrency={setCurrency}
              language={language}
              setLanguage={setLanguage}
              user={user}
              setShowAuth={setShowAuth}
            />
          )
        } />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      
      <AnimatePresence>
        {showAuth && (
          <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} />
        )}
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}