import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, Clock, Luggage, Check, Shield, CreditCard, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';
import { AIRPORTS, AIRLINES, durationLabel } from '../mock';
import { useCurrency } from '../context/CurrencyContext';

export default function FlightDetails() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatPrice } = useCurrency();

  const from = params.get('from');
  const to = params.get('to');
  const dep = params.get('dep') || '';
  const arr = params.get('arr') || '';
  const price = parseInt(params.get('price') || '0', 10);
  const duration = parseInt(params.get('duration') || '0', 10);
  const stops = parseInt(params.get('stops') || '0', 10);
  const provider = params.get('provider') || 'Trip.com';
  const airlineCode = params.get('airline') || 'BA';
  const depart = params.get('depart') || '';

  const fromA = AIRPORTS.find((a) => a.code === from);
  const toA = AIRPORTS.find((a) => a.code === to);
  const airline = AIRLINES.find((a) => a.code === airlineCode) || AIRLINES[0];

  const [extras, setExtras] = useState({ bag: false, seat: false, insurance: false });
  const extraTotal = (extras.bag ? 35 : 0) + (extras.seat ? 18 : 0) + (extras.insurance ? 24 : 0);
  const taxes = Math.round(price * 0.18);
  const total = price + taxes + extraTotal;

  const [pax, setPax] = useState({ first: '', last: '', email: '', phone: '' });

  const submit = (e) => {
    e.preventDefault();
    if (!pax.first || !pax.last || !pax.email) {
      toast({ title: 'Missing info', description: 'Please complete passenger details to continue.' });
      return;
    }
    toast({
      title: 'Booking confirmed (demo)',
      description: `${airline.name} · ${from} → ${to} · ${formatPrice(total)}. Confirmation sent to ${pax.email}.`,
    });
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header variant="plain" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#0770e3] mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to results
        </button>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            {/* Flight summary */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-700">
                    {airline.logo}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{airline.name}</div>
                    <div className="text-xs text-slate-500">Operated by {airline.name}</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  {stops === 0 ? 'Direct' : `${stops} stop${stops > 1 ? 's' : ''}`}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <div className="text-3xl font-bold text-slate-900">{dep}</div>
                  <div className="text-sm text-slate-700 font-medium mt-1">{from}</div>
                  <div className="text-xs text-slate-500">{fromA?.city} · {fromA?.name}</div>
                </div>
                <div className="flex-1 flex flex-col items-center min-w-0">
                  <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {durationLabel(duration)}
                  </div>
                  <div className="w-full h-px bg-slate-300 relative">
                    <Plane className="absolute right-0 -top-2 w-4 h-4 text-[#0770e3]" />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{depart || 'Departure'}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-900">{arr}</div>
                  <div className="text-sm text-slate-700 font-medium mt-1">{to}</div>
                  <div className="text-xs text-slate-500">{toA?.city} · {toA?.name}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-200 text-sm">
                <div className="flex items-center gap-2 text-slate-700"><Luggage className="w-4 h-4 text-slate-400" /> Carry-on included</div>
                <div className="flex items-center gap-2 text-slate-700"><Check className="w-4 h-4 text-emerald-600" /> Seat selection</div>
                <div className="flex items-center gap-2 text-slate-700"><Shield className="w-4 h-4 text-slate-400" /> Refundable*</div>
                <div className="flex items-center gap-2 text-slate-700"><Plane className="w-4 h-4 text-slate-400" /> Economy</div>
              </div>
            </div>

            {/* Passenger info */}
            <form onSubmit={submit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Passenger details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first">First name</Label>
                  <Input id="first" value={pax.first} onChange={(e) => setPax({ ...pax, first: e.target.value })} className="mt-1" placeholder="As on passport" />
                </div>
                <div>
                  <Label htmlFor="last">Last name</Label>
                  <Input id="last" value={pax.last} onChange={(e) => setPax({ ...pax, last: e.target.value })} className="mt-1" placeholder="As on passport" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={pax.email} onChange={(e) => setPax({ ...pax, email: e.target.value })} className="mt-1" placeholder="you@example.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={pax.phone} onChange={(e) => setPax({ ...pax, phone: e.target.value })} className="mt-1" placeholder="+1 555 123 4567" />
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900 pt-4">Add extras</h2>
              <div className="space-y-2">
                {[
                  { k: 'bag', l: 'Checked bag (23kg)', p: 35 },
                  { k: 'seat', l: 'Premium seat selection', p: 18 },
                  { k: 'insurance', l: 'Travel insurance', p: 24 },
                ].map((x) => (
                  <label
                    key={x.k}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      extras[x.k] ? 'border-[#0770e3] bg-[#0770e3]/5' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={extras[x.k]}
                        onChange={(e) => setExtras({ ...extras, [x.k]: e.target.checked })}
                        className="w-4 h-4 accent-[#0770e3]"
                      />
                      <span className="text-sm font-medium text-slate-800">{x.l}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">+ {formatPrice(x.p)}</span>
                  </label>
                ))}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0770e3] hover:bg-[#0660c5] text-white font-semibold rounded-lg py-6 text-base mt-4"
              >
                <CreditCard className="w-5 h-5 mr-2" /> Confirm and pay {formatPrice(total)}
              </Button>
              <p className="text-xs text-slate-500 text-center">
                This is a demo — no real payment will be processed.
              </p>
            </form>
          </div>

          {/* Price summary */}
          <aside className="lg:col-span-4">
            <div className="bg-white border border-slate-200 rounded-xl p-6 sticky top-4">
              <h2 className="font-bold text-slate-900 mb-4">Price summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Adult (1 × {formatPrice(price)})</span>
                  <span className="font-medium text-slate-900">{formatPrice(price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Taxes & fees</span>
                  <span className="font-medium text-slate-900">{formatPrice(taxes)}</span>
                </div>
                {extras.bag && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Checked bag</span>
                    <span className="font-medium text-slate-900">{formatPrice(35)}</span>
                  </div>
                )}
                {extras.seat && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Premium seat</span>
                    <span className="font-medium text-slate-900">{formatPrice(18)}</span>
                  </div>
                )}
                {extras.insurance && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Insurance</span>
                    <span className="font-medium text-slate-900">{formatPrice(24)}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-2xl font-bold text-slate-900">{formatPrice(total)}</span>
              </div>
              <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
                Booking via <span className="font-semibold text-slate-800">{provider}</span>. Final price shown to you on their site may differ.
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
      <Toaster />
    </div>
  );
}
