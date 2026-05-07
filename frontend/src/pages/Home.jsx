import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell, TrendingUp, Shield, Search, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchForm from '../components/SearchForm';
import { POPULAR_DESTINATIONS, TRENDING_SEARCHES, FAQ_ITEMS } from '../mock';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="home" />

      {/* Hero */}
      <section className="relative bg-[#05203c] text-white pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#0770e3] blur-3xl" />
          <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-[#00d1c1] blur-3xl opacity-40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 pt-12 md:pt-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium text-[#00d1c1] mb-5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#00d1c1] animate-pulse" /> Book Smart. Fly Better.
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-4">
              Fly with your Yaro.<br />
              <span className="text-[#00d1c1]">Cheaper flights. Smarter trips.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl">
              FlyYaro compares flights from 1,200+ airlines and travel sites — your trusted buddy for every journey, with no hidden fees.
            </p>
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 -mb-24">
          <SearchForm />
        </div>
      </section>

      {/* Spacer for overlap */}
      <div className="h-24" />

      {/* Why Skyscanner */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Search,
              title: 'Compare in seconds',
              text: 'We search across hundreds of airlines and travel sites at once to find the best deals.',
            },
            {
              icon: Shield,
              title: 'No hidden fees',
              text: 'The price you see is the price you pay. We don’t add booking fees or sneaky charges.',
            },
            {
              icon: Bell,
              title: 'Set price alerts',
              text: 'Track flights you love and we’ll let you know when prices change.',
            },
          ].map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#0770e3]/10 text-[#0770e3] flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900">{f.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular destinations */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Popular destinations</h2>
            <p className="text-slate-600">Flights to where the world is going right now</p>
          </div>
          <Link to="/search?from=JFK&to=LHR" className="hidden md:flex items-center gap-1 text-[#0770e3] font-semibold hover:underline">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {POPULAR_DESTINATIONS.map((d) => (
            <Link
              key={d.code}
              to={`/search?from=JFK&to=${d.code}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-slate-200"
            >
              <img
                src={d.image}
                alt={d.city}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-lg font-bold">{d.city}</div>
                    <div className="text-xs text-white/80">{d.country}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/80">from</div>
                    <div className="text-base font-bold">${d.price}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending searches */}
      <section className="bg-slate-50 py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-7 h-7 text-[#0770e3]" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Trending searches</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TRENDING_SEARCHES.map((s, i) => {
              const fromCode = s.from.match(/\(([^)]+)\)/)?.[1] || 'JFK';
              const toCode = s.to.match(/\(([^)]+)\)/)?.[1] || 'LHR';
              return (
                <Link
                  key={i}
                  to={`/search?from=${fromCode}&to=${toCode}`}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-[#0770e3] hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#0770e3]/10 text-[#0770e3] flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {s.from} → {s.to}
                      </div>
                      <div className="text-xs text-slate-500">Round-trip · Economy</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <div className="text-xs text-slate-500">from</div>
                    <div className="text-base font-bold text-slate-900">${s.price}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-slate-200">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold py-5 hover:text-[#0770e3]">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base leading-relaxed pb-5">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-16">
        <div className="rounded-3xl bg-gradient-to-r from-[#0770e3] to-[#0a8df0] p-10 md:p-16 text-white relative overflow-hidden">
          <div className="relative max-w-2xl">
            <h3 className="text-3xl md:text-4xl font-bold mb-3">Ready for your next adventure?</h3>
            <p className="text-white/90 mb-6 text-lg">
              Sign up for price alerts and never miss a deal on the routes you love.
            </p>
            <button className="inline-flex items-center gap-2 bg-white text-[#0770e3] px-6 py-3 rounded-full font-semibold hover:bg-slate-100 transition-colors">
              Create price alert <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
