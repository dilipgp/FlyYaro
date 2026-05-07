import React, { useState, useMemo } from 'react';
import { Check, Search, Globe, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CURRENCIES, useCurrency } from '../context/CurrencyContext';

export default function CurrencySelector({ variant = 'light' }) {
  const { code, currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const isLight = variant === 'light'; // light = on dark bg, dark = on light bg

  const filtered = useMemo(() => {
    if (!query.trim()) return CURRENCIES;
    const q = query.toLowerCase();
    return CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
            isLight ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'
          }`}
          aria-label="Change language and currency"
        >
          <Globe className="w-4 h-4" />
          <span>English · {code}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Language</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-900">English</span>
            <span className="text-xs text-slate-500">Default</span>
          </div>
        </div>

        <div className="p-3 border-b border-slate-100">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Currency</div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search currency or country..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0770e3] focus:ring-2 focus:ring-[#0770e3]/15"
            />
          </div>
        </div>

        <ul className="max-h-72 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-slate-500">
              No currency matches "{query}"
            </li>
          ) : (
            filtered.map((c) => {
              const selected = c.code === code;
              return (
                <li key={c.code}>
                  <button
                    onClick={() => {
                      setCurrency(c.code);
                      setOpen(false);
                      setQuery('');
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 ${
                      selected ? 'bg-[#0770e3]/5' : ''
                    }`}
                  >
                    <span className="text-xl leading-none">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${selected ? 'text-[#0770e3]' : 'text-slate-900'}`}>
                          {c.code}
                        </span>
                        <span className="text-xs text-slate-500 truncate">{c.name}</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-600 mr-1">{c.symbol.trim() || c.code}</span>
                    {selected && <Check className="w-4 h-4 text-[#0770e3]" />}
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className="p-3 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-500 leading-relaxed">
            Currently showing prices in <span className="font-semibold text-slate-700">{currency.name} ({currency.code})</span>. Exchange rates updated daily.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
