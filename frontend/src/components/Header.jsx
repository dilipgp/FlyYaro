import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Hotel, Car, Globe, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

const navItems = [
  { label: 'Flights', icon: Plane, path: '/' },
  { label: 'Hotels', icon: Hotel, path: '/' },
  { label: 'Car hire', icon: Car, path: '/' },
];

export default function Header({ variant = 'home' }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isLight = variant === 'home';

  return (
    <header
      className={
        isLight
          ? 'bg-[#05203c] text-white'
          : 'bg-white text-slate-900 border-b border-slate-200'
      }
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-bold text-2xl tracking-tight"
        >
          <span className={isLight ? 'text-white' : 'text-[#0770e3]'}>sky</span>
          <span className={isLight ? 'text-[#00d1c1]' : 'text-[#0770e3]'}>scanner</span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isLight
                  ? 'hover:bg-white/10'
                  : 'hover:bg-slate-100'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
              isLight ? 'hover:bg-white/10' : 'hover:bg-slate-100'
            }`}
          >
            <Globe className="w-4 h-4" />
            EN · USD
            <ChevronDown className="w-4 h-4" />
          </button>
          <Button
            variant={isLight ? 'secondary' : 'default'}
            className={
              isLight
                ? 'bg-white text-[#05203c] hover:bg-slate-100 rounded-full font-semibold'
                : 'bg-[#0770e3] hover:bg-[#0660c5] text-white rounded-full font-semibold'
            }
          >
            Log in
          </Button>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div
          className={`md:hidden border-t ${
            isLight ? 'bg-[#05203c] border-white/10' : 'bg-white border-slate-200'
          }`}
        >
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg ${
                  isLight ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
            <button className="w-full text-left flex items-center gap-3 px-3 py-3">
              <Globe className="w-5 h-5" /> EN · USD
            </button>
            <Button
              className={
                isLight
                  ? 'w-full bg-white text-[#05203c] hover:bg-slate-100 rounded-full mt-2'
                  : 'w-full bg-[#0770e3] hover:bg-[#0660c5] rounded-full mt-2'
              }
            >
              Log in
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
