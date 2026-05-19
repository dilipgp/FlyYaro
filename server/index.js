import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { Duffel } from '@duffel/api'
import Amadeus from 'amadeus'
import jwt from 'jsonwebtoken'
import pg from 'pg'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 8080
const JWT_SECRET = process.env.JWT_SECRET || 'flyyara_jwt_secret_2024'
const NODE_ENV = process.env.NODE_ENV || 'development'

// Middleware
app.use(cors({
  origin: NODE_ENV === 'production' 
    ? true  // Allow same origin in production
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Initialize APIs
const duffel = process.env.DUFFEL_TOKEN ? new Duffel({ token: process.env.DUFFEL_TOKEN }) : null
const amadeus = (process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET) 
  ? new Amadeus({
      clientId: process.env.AMADEUS_CLIENT_ID,
      clientSecret: process.env.AMADEUS_CLIENT_SECRET
    })
  : null

// Initialize PostgreSQL (optional)
let pool = null
if (process.env.DATABASE_URL) {
  const { Pool } = pg
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  })
  
  pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      google_id VARCHAR(255) UNIQUE,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      picture TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `).catch(err => console.log('DB init:', err.message))
}

console.log('✓ Environment:', NODE_ENV)
console.log('✓ Port:', PORT)
console.log('✓ Duffel:', duffel ? 'Connected' : 'Not configured')
console.log('✓ Amadeus:', amadeus ? 'Connected' : 'Demo mode')
console.log('✓ PostgreSQL:', pool ? 'Connected' : 'Not configured')

// ===== API ROUTES (Must come BEFORE static files) =====

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    services: {
      duffel: !!duffel,
      amadeus: !!amadeus,
      database: !!pool
    }
  })
})

// Google Auth
app.post('/api/auth/google', async (req, res) => {
  try {
    const { googleId, email, name, picture } = req.body
    
    if (!email || !name) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    let user = { id: 1, email, name, picture }
    
    if (pool) {
      const result = await pool.query(
        `INSERT INTO users (google_id, email, name, picture, last_login)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
         ON CONFLICT (email) 
         DO UPDATE SET 
           google_id = EXCLUDED.google_id,
           name = EXCLUDED.name,
           picture = EXCLUDED.picture,
           last_login = CURRENT_TIMESTAMP
         RETURNING *`,
        [googleId, email, name, picture]
      )
      user = result.rows[0]
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, picture: user.picture },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ success: true, token, user })
  } catch (error) {
    console.error('Auth error:', error)
    res.status(500).json({ error: 'Authentication failed' })
  }
})

// Verify JWT
app.get('/api/auth/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ error: 'No token' })
    const decoded = jwt.verify(token, JWT_SECRET)
    res.json({ success: true, user: decoded })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

// Amadeus Flight Search
app.post('/api/flights/amadeus', async (req, res) => {
  try {
    const { origin, destination, departureDate, returnDate, adults = 1 } = req.body
    
    // Demo mode - generate realistic data
    if (!amadeus) {
      const airlines = [
        { code: 'AF', name: 'Air France' },
        { code: 'LH', name: 'Lufthansa' },
        { code: 'BA', name: 'British Airways' },
        { code: 'KL', name: 'KLM' },
        { code: 'EK', name: 'Emirates' },
        { code: 'QR', name: 'Qatar Airways' },
      ]
      
      const routeTimes = {
        'AMS-DEL': 495, 'DEL-AMS': 520, 'LHR-JFK': 480, 'JFK-LHR': 420,
        'CDG-DXB': 395, 'DXB-CDG': 440, 'FRA-SIN': 720, 'SIN-FRA': 760,
      }
      
      const routeKey = `${origin}-${destination}`
      const baseDuration = routeTimes[routeKey] || routeTimes[`${destination}-${origin}`] || 360
      const flights = []
      
      for (let i = 0; i < 18; i++) {
        const airline = airlines[Math.floor(Math.random() * airlines.length)]
        const stops = Math.random() > 0.6 ? 1 : 0
        const duration = Math.floor(baseDuration * (0.95 + Math.random() * 0.1) + (stops * 75))
        const depHour = 6 + Math.floor(Math.random() * 16)
        const depMin = [0, 15, 30, 45][Math.floor(Math.random() * 4)]
        const price = Math.round(280 + Math.random() * 650 - (stops * 40))
        
        flights.push({
          id: `AMA${Date.now()}${i}`,
          airline: airline.name,
          airlineCode: airline.code,
          flightNumber: `${airline.code}${100 + Math.floor(Math.random() * 900)}`,
          departure: {
            airport: origin, code: origin,
            time: `${depHour.toString().padStart(2, '0')}:${depMin.toString().padStart(2, '0')}`,
            date: departureDate,
          },
          arrival: {
            airport: destination, code: destination,
            time: `${((depHour + Math.floor(duration/60)) % 24).toString().padStart(2, '0')}:${depMin.toString().padStart(2, '0')}`,
            date: departureDate,
          },
          duration: `${Math.floor(duration/60)}h ${duration%60}m`,
          durationMinutes: duration,
          stops,
          price,
          currency: 'USD',
          provider: 'Amadeus',
          providerUrl: 'https://amadeus.com',
          baggage: { cabin: true, checked: stops === 0 ? 1 : 0 },
          amenities: [],
          co2: Math.round(duration * 1.4),
          _source: 'Amadeus Self-Service API',
        })
      }
      
      return res.json({
        success: true,
        source: 'amadeus',
        flights: flights.sort((a, b) => a.price - b.price)
      })
    }

    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      returnDate,
      adults,
      max: 20,
      currencyCode: 'USD'
    })

    const flights = response.data.map((offer, idx) => {
      const outbound = offer.itineraries[0]
      const first = outbound.segments[0]
      const last = outbound.segments[outbound.segments.length - 1]
      
      return {
        id: offer.id || `AMA${idx}`,
        airline: first.carrierCode,
        airlineCode: first.carrierCode,
        flightNumber: `${first.carrierCode}${first.number}`,
        departure: {
          airport: first.departure.iataCode,
          code: first.departure.iataCode,
          time: first.departure.at.split('T')[1].substring(0, 5),
          date: departureDate,
        },
        arrival: {
          airport: last.arrival.iataCode,
          code: last.arrival.iataCode,
          time: last.arrival.at.split('T')[1].substring(0, 5),
          date: departureDate,
        },
        duration: outbound.duration.replace('PT', '').toLowerCase(),
        durationMinutes: 360,
        stops: outbound.segments.length - 1,
        price: parseFloat(offer.price.total),
        currency: offer.price.currency,
        provider: 'Amadeus',
        providerUrl: 'https://amadeus.com',
        baggage: { cabin: true, checked: 1 },
        amenities: [],
        co2: 0,
        _source: 'Amadeus'
      }
    })

    res.json({ success: true, source: 'amadeus', flights })
  } catch (error) {
    console.error('Amadeus error:', error.message)
    res.json({ success: true, source: 'demo', flights: [], error: error.message })
  }
})

// Duffel search (fallback)
app.post('/api/flights/search', async (req, res) => {
  if (!duffel) {
    return res.json({ success: false, flights: [] })
  }
  
  try {
    const { origin, destination, departureDate, returnDate, passengers = { adults: 1 } } = req.body
    const slices = [{ origin, destination, departure_date: departureDate }]
    if (returnDate) slices.push({ origin: destination, destination: origin, departure_date: returnDate })

    const offerRequest = await duffel.offerRequests.create({
      slices,
      passengers: [...Array(passengers.adults || 1).fill({ type: 'adult' })],
      cabin_class: 'economy',
    })

    const offers = await duffel.offers.list({
      offer_request_id: offerRequest.data.id,
      limit: 20,
    })

    const flights = offers.data.map(offer => {
      const out = offer.slices[0]
      const first = out.segments[0]
      const last = out.segments[out.segments.length - 1]
      const dep = new Date(first.departing_at)
      const arr = new Date(last.arriving_at)
      const mins = Math.round((arr - dep) / 60000)
      
      return {
        id: offer.id,
        airline: first.marketing_carrier.name,
        airlineCode: first.marketing_carrier.iata_code,
        flightNumber: `${first.marketing_carrier.iata_code}${first.marketing_carrier_flight_number}`,
        departure: {
          airport: first.origin.name,
          code: first.origin.iata_code,
          time: dep.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          date: departureDate,
        },
        arrival: {
          airport: last.destination.name,
          code: last.destination.iata_code,
          time: arr.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          date: departureDate,
        },
        duration: `${Math.floor(mins/60)}h ${mins%60}m`,
        durationMinutes: mins,
        stops: out.segments.length - 1,
        price: parseFloat(offer.total_amount),
        currency: offer.total_currency,
        provider: 'Duffel',
        providerUrl: 'https://duffel.com',
        baggage: { cabin: true, checked: 0 },
        amenities: [],
        co2: Math.round(mins * 1.5),
      }
    })

    res.json({ success: true, flights })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ===== SERVE FRONTEND (Must come AFTER API routes) =====

const distPath = path.join(__dirname, '../dist')

// Serve static files from dist
app.use(express.static(distPath, {
  maxAge: NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache')
    }
  }
}))

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next()
  }
  
  // Serve index.html for SPA routing
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err)
      res.status(500).send('Error loading application')
    }
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════╗
║   FlyYara.com - Production Server      ║
╠════════════════════════════════════════╣
║ Environment: ${NODE_ENV.padEnd(26)} ║
║ Port: ${PORT.toString().padEnd(31)} ║
║ Frontend: ${distPath.padEnd(27)} ║
╚════════════════════════════════════════╝
  `)
})

export default app