import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Plane, Clock, ArrowRight, Filter, ChevronDown, Leaf, AlertCircle, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchForm from '../components/SearchForm';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Slider } from '../components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { generateFlights, durationLabel, AIRPORTS, AIRLINES } from '../mock';
import { useCurrency } from '../context/CurrencyContext';

function StopsLabel({ stops, city }) {
  if (stops === 0) return <span className="text-emerald-600 font-medium">Direct</span>;
  return (
    <span className="text-slate-700">
      {stops} stop{stops > 1 ? 's' : ''}{city ? ` · ${city}` : ''}
    </span>
  );
}

function FlightCard({ flight, onSelect, formatPrice }) {
  const fromAirport = AIRPORTS.find((a) => a.code === flight.from);
  const toAirport = AIRPORTS.find((a) => a.code === flight.to);
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-[#0770e3] transition-all">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
              {flight.airline.logo}
            </div>
            <div className="text-sm text-slate-700 font-medium">{flight.airline.name}</div>
            {flight.eco && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                <Leaf className="w-3 h-3" /> Eco
              </span>
            )}
            {flight.selfTransfer && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                <AlertCircle className="w-3 h-3" /> Self transfer
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{flight.depTime}</div>
              <div className="text-xs text-slate-500 mt-0.5">{flight.from} · {fromAirport?.city}</div>
            </div>

            <div className="flex-1 flex flex-col items-center min-w-0">
              <div className="text-xs text-slate-500 mb-1">{durationLabel(flight.duration)}</div>
              <div className="w-full h-px bg-slate-300 relative">
                {flight.stops > 0 && Array.from({ length: flight.stops }).map((_, i) => (
                  <span key={i} className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-400" style={{ left: `${((i + 1) / (flight.stops + 1)) * 100}%` }} />
                ))}
                <Plane className="absolute right-0 -top-2 w-4 h-4 text-slate-400" />
              </div>
              <div className="text-xs mt-1">
                <StopsLabel stops={flight.stops} city={flight.stopCity} />
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {flight.arrTime}
                {flight.arrDayOffset > 0 && <sup className="text-xs text-rose-500 ml-0.5">+{flight.arrDayOffset}</sup>}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{flight.to} · {toAirport?.city}</div>
            </div>
          </div>
        </div>

        <div className="md:w-56 bg-slate-50 md:border-l border-t md:border-t-0 border-slate-200 p-5 flex flex-col items-center justify-center text-center">
          <div className="text-xs text-slate-500">via {flight.provider}</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">{formatPrice(flight.price)}</div>
          <div className="text-xs text-slate-500 mb-3">total per traveler</div>
          <Button
            onClick={() => onSelect(flight)}
            className="w-full bg-[#0770e3] hover:bg-[#0660c5] text-white rounded-lg font-semibold"
          >
            Select <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function FilterPanel({ filters, setFilters, allAirlines, maxPrice, formatPrice }) {
  const toggleAirline = (code) => {
    const cur = new Set(filters.airlines);
    if (cur.has(code)) cur.delete(code); else cur.add(code);
    setFilters({ ...filters, airlines: Array.from(cur) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-slate-900 mb-3">Stops</h3>
        <div className="space-y-2">
          {[
            { v: 'any', l: 'Any' },
            { v: 'direct', l: 'Direct only' },
            { v: '1', l: 'Up to 1 stop' },
          ].map((opt) => (
            <label key={opt.v} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="stops"
                checked={filters.stops === opt.v}
                onChange={() => setFilters({ ...filters, stops: opt.v })}
                className="w-4 h-4 accent-[#0770e3]"
              />
              <span className="text-sm text-slate-700">{opt.l}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-3">Price (max {formatPrice(filters.priceMax)})</h3>
        <Slider
          value={[filters.priceMax]}
          onValueChange={(v) => setFilters({ ...filters, priceMax: v[0] })}
          min={50}
          max={maxPrice}
          step={10}
          className="my-4"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>{formatPrice(50)}</span>
          <span>{formatPrice(maxPrice)}</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-3">Airlines</h3>
        <div className="space-y-2 max-h-60 overflow-auto pr-2">
          {allAirlines.map((a) => (
            <label key={a.code} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={filters.airlines.includes(a.code)}
                onCheckedChange={() => toggleAirline(a.code)}
              />
              <span className="text-sm text-slate-700">{a.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Results() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const from = params.get('from') || 'JFK';
  const to = params.get('to') || 'LHR';
  const depart = params.get('depart') || '';

  const allFlights = useMemo(() => generateFlights(from, to, depart), [from, to, depart]);
  const allAirlines = useMemo(() => {
    const codes = new Set(allFlights.map((f) => f.airline.code));
    return AIRLINES.filter((a) => codes.has(a.code));
  }, [allFlights]);
  const maxPrice = useMemo(() => Math.max(...allFlights.map((f) => f.price)) + 50, [allFlights]);

  const [sort, setSort] = useState('best');
  const [filters, setFilters] = useState({ stops: 'any', priceMax: maxPrice, airlines: [] });
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    setFilters((f) => ({ ...f, priceMax: maxPrice }));
  }, [maxPrice]);

  const filtered = useMemo(() => {
    let list = allFlights.filter((f) => {
      if (filters.stops === 'direct' && f.stops !== 0) return false;
      if (filters.stops === '1' && f.stops > 1) return false;
      if (f.price > filters.priceMax) return false;
      if (filters.airlines.length > 0 && !filters.airlines.includes(f.airline.code)) return false;
      return true;
    });
    if (sort === 'cheapest') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'fastest') list = [...list].sort((a, b) => a.duration - b.duration);
    else list = [...list].sort((a, b) => a.price * 0.7 + a.duration * 0.5 - (b.price * 0.7 + b.duration * 0.5));
    return list;
  }, [allFlights, filters, sort]);

  const fromAirport = AIRPORTS.find((a) => a.code === from);
  const toAirport = AIRPORTS.find((a) => a.code === to);

  const select = (flight) => {
    const sp = new URLSearchParams({
      flightId: flight.id,
      from: flight.from,
      to: flight.to,
      airline: flight.airline.code,
      dep: flight.depTime,
      arr: flight.arrTime,
      price: String(flight.price),
      duration: String(flight.duration),
      stops: String(flight.stops),
      provider: flight.provider,
      depart,
    });
    navigate(`/flight?${sp.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header variant="plain" />

      {/* Search summary bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-lg md:text-xl font-bold text-slate-900 truncate">
              {fromAirport?.city} ({from}) <span className="text-slate-400">→</span> {toAirport?.city} ({to})
            </div>
            <div className="text-sm text-slate-500">
              {depart || 'Any date'} · {filtered.length} of {allFlights.length} results
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowSearch(!showSearch)}
            className="rounded-full border-slate-300"
          >
            Edit search <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showSearch ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        {showSearch && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-6">
            <SearchForm initial={{ from: fromAirport, to: toAirport }} compact />
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sidebar filters */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-900">Filters</h2>
                <button
                  onClick={() => setFilters({ stops: 'any', priceMax: maxPrice, airlines: [] })}
                  className="text-xs text-[#0770e3] hover:underline font-medium"
                >
                  Reset
                </button>
              </div>
              <FilterPanel filters={filters} setFilters={setFilters} allAirlines={allAirlines} maxPrice={maxPrice} formatPrice={formatPrice} />
            </div>
          </aside>

          <main className="lg:col-span-9">
            {/* Sort tabs */}
            <div className="bg-white rounded-xl border border-slate-200 mb-4 p-1 flex items-center justify-between gap-2">
              <Tabs value={sort} onValueChange={setSort} className="flex-1">
                <TabsList className="grid grid-cols-3 w-full bg-transparent">
                  <TabsTrigger value="best" className="data-[state=active]:bg-[#0770e3]/10 data-[state=active]:text-[#0770e3] rounded-lg">
                    <div className="text-left">
                      <div className="text-sm font-semibold">Best</div>
                      <div className="text-xs opacity-70">Recommended</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="cheapest" className="data-[state=active]:bg-[#0770e3]/10 data-[state=active]:text-[#0770e3] rounded-lg">
                    <div className="text-left">
                      <div className="text-sm font-semibold">Cheapest</div>
                      <div className="text-xs opacity-70">Lowest price</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="fastest" className="data-[state=active]:bg-[#0770e3]/10 data-[state=active]:text-[#0770e3] rounded-lg">
                    <div className="text-left">
                      <div className="text-sm font-semibold">Fastest</div>
                      <div className="text-xs opacity-70">Shortest trip</div>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden rounded-lg">
                    <Filter className="w-4 h-4 mr-2" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <h2 className="font-bold text-lg mb-4">Filters</h2>
                  <FilterPanel filters={filters} setFilters={setFilters} allAirlines={allAirlines} maxPrice={maxPrice} formatPrice={formatPrice} />
                </SheetContent>
              </Sheet>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-1">No flights match your filters</h3>
                <p className="text-sm text-slate-600">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((f) => (
                  <FlightCard key={f.id} flight={f} onSelect={select} formatPrice={formatPrice} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
