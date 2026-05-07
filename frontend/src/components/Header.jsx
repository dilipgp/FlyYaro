import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Hotel, Car, Globe, Menu, X, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import { LogoHorizontal } from './Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const navItems = [
  { label: 'Flights', icon: Plane, path: '/' },
  { label: 'Hotels', icon: Hotel, path: '/' },
  { label: 'Car hire', icon: Car, path: '/' },
];

function readUser() {
  try {
    const raw = localStorage.getItem('flyyaro_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Header({ variant = 'home' }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const isLight = variant === 'home';

  useEffect(() => {
    setUser(readUser());
    const handler = () => setUser(readUser());
    window.addEventListener('storage', handler);
    window.addEventListener('focus', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('focus', handler);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('flyyaro_user');
    setUser(null);
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()
    : 'FY';

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
          aria-label="FlyYaro home"
          className="flex items-center"
        >
          <LogoHorizontal height={36} variant={isLight ? 'light' : 'dark'} withSlogan={false} />
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isLight ? 'hover:bg-white/10' : 'hover:bg-slate-100'
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

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isLight ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                  }`}
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0770e3] to-[#00d1c1] flex items-center justify-center text-xs font-bold text-white">
                    {initials}
                  </span>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-semibold truncate">{user.name}</div>
                  <div className="text-xs text-slate-500 truncate">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserIcon className="w-4 h-4 mr-2" /> My profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Plane className="w-4 h-4 mr-2" /> My trips
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-rose-600 focus:text-rose-700">
                  <LogOut className="w-4 h-4 mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className={
                isLight
                  ? 'bg-white text-[#05203c] hover:bg-slate-100 rounded-full font-semibold'
                  : 'bg-[#0770e3] hover:bg-[#0660c5] text-white rounded-full font-semibold'
              }
            >
              Log in
            </Button>
          )}
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
            {user ? (
              <>
                <div className="px-3 py-3 flex items-center gap-3 border-t border-white/10 mt-2">
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0770e3] to-[#00d1c1] flex items-center justify-center text-xs font-bold text-white">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">{user.name}</div>
                    <div className="text-xs opacity-70 truncate">{user.email}</div>
                  </div>
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="w-full rounded-full mt-2"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Log out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setOpen(false);
                  navigate('/login');
                }}
                className={
                  isLight
                    ? 'w-full bg-white text-[#05203c] hover:bg-slate-100 rounded-full mt-2'
                    : 'w-full bg-[#0770e3] hover:bg-[#0660c5] rounded-full mt-2'
                }
              >
                Log in
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
