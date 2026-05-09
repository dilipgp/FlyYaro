import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, ArrowLeftRight, Calendar as CalendarIcon, Users, Search, MapPin, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Checkbox } from './ui/checkbox';
import { AIRPORTS } from '../mock';
import { format } from 'date-fns';

const TRIP_TYPES = [
  { value: 'return', label: 'Round-trip' },
  { value: 'oneway', label: 'One-way' },
  { value: 'multi', label: 'Multi-city' },
];

const CABINS = ['Economy', 'Premium Economy', 'Business', 'First'];

function AirportSelect({ value, onChange, label, placeholder }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? AIRPORTS.filter(
        (a) =>
          a.city.toLowerCase().includes(q) ||
          a.code.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.country.toLowerCase().includes(q)
      ).slice(0, 12)
    : [
        ...AIRPORTS.filter((a) => a.popular),
        ...AIRPORTS.filter((a) => !a.popular).slice(0, 4),
      ].slice(0, 14);

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left px-4 py-3 bg-white border border-slate-200 rounded-lg hover:border-[#0770e3] focus:outline-none focus:border-[#0770e3] focus:ring-2 focus:ring-[#0770e3]/20 transition-colors"
      >
        <div className="text-xs font-semibold text-slate-500 uppercase mb-0.5">{label}</div>
        <div className="text-base font-medium text-slate-900 truncate">
          {value ? `${value.city} (${value.code})` : <span className="text-slate-400">{placeholder}</span>}
        </div>
      </button>
      {open && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 130+ airports — city, country or code"
              className="w-full px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          {!q && (
            <div className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Popular destinations
            </div>
          )}
          <ul className="max-h-80 overflow-auto">
            {filtered.map((a) => (
              <li key={a.code}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(a);
                    setOpen(false);
                    setQuery('');
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3"
                >
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 text-sm truncate">
                      {a.city} <span className="text-slate-400 font-normal">({a.code})</span>
                    </div>
                    <div className="text-xs text-slate-500 truncate">{a.name} · {a.country}</div>
                  </div>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-slate-500">No airports found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function SearchForm({ initial = {}, compact = false }) {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState(initial.tripType || 'return');
  const findAirport = (code) => AIRPORTS.find((a) => a.code === code);
  const [from, setFrom] = useState(initial.from || findAirport('JFK') || AIRPORTS[0]);
  const [to, setTo] = useState(initial.to || findAirport('LHR') || AIRPORTS[1]);
  const [depart, setDepart] = useState(initial.depart || addDays(new Date(), 14));
  const [returnDate, setReturnDate] = useState(initial.returnDate || addDays(new Date(), 21));
  const [travelers, setTravelers] = useState(initial.travelers || { adults: 1, children: 0, infants: 0 });
  const [cabin, setCabin] = useState(initial.cabin || 'Economy');
  const [directOnly, setDirectOnly] = useState(false);

  function addDays(d, n) {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
  }

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const totalTravelers = travelers.adults + travelers.children + travelers.infants;

  const submit = () => {
    if (!from || !to) return;
    const params = new URLSearchParams({
      from: from.code,
      to: to.code,
      depart: format(depart, 'yyyy-MM-dd'),
      ...(tripType === 'return' ? { return: format(returnDate, 'yyyy-MM-dd') } : {}),
      tripType,
      adults: String(travelers.adults),
      children: String(travelers.children),
      infants: String(travelers.infants),
      cabin,
      direct: directOnly ? '1' : '0',
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-2xl ${compact ? 'p-4' : 'p-5 md:p-6'}`}>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex bg-slate-100 rounded-full p-1">
          {TRIP_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTripType(t.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tripType === t.value
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 text-sm font-medium text-slate-700">
              <Users className="w-4 h-4" />
              {totalTravelers} {totalTravelers === 1 ? 'traveler' : 'travelers'}, {cabin}
              <ChevronDown className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-3">
              {[
                { key: 'adults', label: 'Adults', sub: '16+' },
                { key: 'children', label: 'Children', sub: '2-15' },
                { key: 'infants', label: 'Infants', sub: 'Under 2' },
              ].map((row) => (
                <div key={row.key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{row.label}</div>
                    <div className="text-xs text-slate-500">{row.sub}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setTravelers({
                          ...travelers,
                          [row.key]: Math.max(row.key === 'adults' ? 1 : 0, travelers[row.key] - 1),
                        })
                      }
                      className="w-8 h-8 rounded-full border border-slate-300 hover:bg-slate-100 flex items-center justify-center text-lg leading-none"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-medium">{travelers[row.key]}</span>
                    <button
                      onClick={() => setTravelers({ ...travelers, [row.key]: travelers[row.key] + 1 })}
                      className="w-8 h-8 rounded-full border border-slate-300 hover:bg-slate-100 flex items-center justify-center text-lg leading-none"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mt-2 mb-1">Cabin class</div>
                <div className="grid grid-cols-2 gap-2">
                  {CABINS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCabin(c)}
                      className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                        cabin === c
                          ? 'border-[#0770e3] bg-[#0770e3]/5 text-[#0770e3] font-semibold'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
        <div className="md:col-span-5 flex items-stretch gap-2 relative">
          <AirportSelect value={from} onChange={setFrom} label="From" placeholder="Country, city or airport" />
          <button
            onClick={swap}
            type="button"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 hover:border-[#0770e3] hover:text-[#0770e3] transition-colors shadow-sm"
            aria-label="swap"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
          <AirportSelect value={to} onChange={setTo} label="To" placeholder="Country, city or airport" />
        </div>

        <div className="md:col-span-5 flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex-1 text-left px-4 py-3 bg-white border border-slate-200 rounded-lg hover:border-[#0770e3] transition-colors">
                <div className="text-xs font-semibold text-slate-500 uppercase mb-0.5">Depart</div>
                <div className="text-base font-medium text-slate-900 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-slate-400" />
                  {format(depart, 'EEE, MMM d')}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={depart} onSelect={(d) => d && setDepart(d)} disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))} />
            </PopoverContent>
          </Popover>

          {tripType === 'return' && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex-1 text-left px-4 py-3 bg-white border border-slate-200 rounded-lg hover:border-[#0770e3] transition-colors">
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-0.5">Return</div>
                  <div className="text-base font-medium text-slate-900 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    {format(returnDate, 'EEE, MMM d')}
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={returnDate} onSelect={(d) => d && setReturnDate(d)} disabled={(d) => d < depart} />
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="md:col-span-2">
          <Button
            onClick={submit}
            className="w-full h-full min-h-[64px] bg-[#0770e3] hover:bg-[#0660c5] text-white text-base font-semibold rounded-lg"
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Checkbox id="direct" checked={directOnly} onCheckedChange={setDirectOnly} />
        <label htmlFor="direct" className="text-sm text-slate-700 cursor-pointer">
          Direct flights only
        </label>
      </div>
    </div>
  );
}
