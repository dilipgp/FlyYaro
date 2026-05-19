import React from 'react';
import { Download, Copy, Check } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { LogoMark, LogoHorizontal, LogoStacked, LOGO_SVG } from '../components/Logo';

function downloadSvg(svg, filename) {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function downloadPng(svg, filename, width = 1200) {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });
  const ratio = img.height / img.width;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = Math.round(width * ratio);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  canvas.toBlob((b) => {
    const u = URL.createObjectURL(b);
    const a = document.createElement('a');
    a.href = u;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(u);
  }, 'image/png');
}

function LogoCard({ title, description, bg, children, svgGetter, baseName }) {
  const [copied, setCopied] = React.useState(false);

  const copySvg = async () => {
    await navigator.clipboard.writeText(svgGetter());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
      <div
        className="flex items-center justify-center min-h-[260px] p-10"
        style={{ background: bg }}
      >
        {children}
      </div>
      <div className="p-5 border-t border-slate-100">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => downloadSvg(svgGetter(), `${baseName}.svg`)}
            className="bg-[#0770e3] hover:bg-[#0660c5] text-white rounded-lg"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> SVG
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => downloadPng(svgGetter(), `${baseName}.png`, 1600)}
            className="rounded-lg border-slate-300"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> PNG
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={copySvg}
            className="rounded-lg text-slate-600"
          >
            {copied ? (
              <><Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Copied</>
            ) : (
              <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy SVG</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Swatch({ name, hex, textColor = '#fff' }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="group rounded-2xl overflow-hidden border border-slate-200 text-left hover:shadow-md transition-shadow"
    >
      <div className="h-28 flex items-end p-4" style={{ background: hex, color: textColor }}>
        <span className="text-xs font-semibold opacity-90">{copied ? 'Copied!' : 'Click to copy'}</span>
      </div>
      <div className="p-4 bg-white">
        <div className="font-semibold text-slate-900 text-sm">{name}</div>
        <div className="text-xs text-slate-500 font-mono mt-0.5">{hex}</div>
      </div>
    </button>
  );
}

export default function BrandShowcase() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header variant="plain" />

      <section className="bg-gradient-to-br from-[#05203c] to-[#0a3a6b] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium text-[#00d1c1] mb-5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#00d1c1] animate-pulse" /> Brand Kit
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-3">
            FlyYaro Brand
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl">
            Logos, colors and our promise — <span className="text-[#00d1c1] font-semibold">Book Smart. Fly Better.</span>
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Logo variants</h2>
        <p className="text-slate-600 mb-8">Click any download button to grab the asset for your use.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <LogoCard
            title="Mark — Light background"
            description="Use for favicons, app icons & avatar slots"
            bg="#ffffff"
            svgGetter={LOGO_SVG.mark}
            baseName="flyyaro-mark"
          >
            <LogoMark size={140} />
          </LogoCard>

          <LogoCard
            title="Mark — Dark background"
            description="On navy / brand color backgrounds"
            bg="#05203c"
            svgGetter={LOGO_SVG.mark}
            baseName="flyyaro-mark-dark"
          >
            <LogoMark size={140} />
          </LogoCard>

          <LogoCard
            title="Mark — On gradient"
            description="Marketing & social media backgrounds"
            bg="linear-gradient(135deg,#0770e3 0%,#00d1c1 100%)"
            svgGetter={LOGO_SVG.mark}
            baseName="flyyaro-mark-gradient"
          >
            <div className="bg-white/95 rounded-3xl p-6">
              <LogoMark size={120} />
            </div>
          </LogoCard>

          <LogoCard
            title="Horizontal — Light"
            description="Headers, websites, email signatures"
            bg="#ffffff"
            svgGetter={() => LOGO_SVG.horizontal('dark')}
            baseName="flyyaro-horizontal-light"
          >
            <LogoHorizontal height={64} variant="dark" />
          </LogoCard>

          <LogoCard
            title="Horizontal — Dark"
            description="For dark / navy backgrounds"
            bg="#05203c"
            svgGetter={() => LOGO_SVG.horizontal('light')}
            baseName="flyyaro-horizontal-dark"
          >
            <LogoHorizontal height={64} variant="light" />
          </LogoCard>

          <LogoCard
            title="Horizontal — No slogan"
            description="Compact lockup for tight spaces"
            bg="#f1f5f9"
            svgGetter={() => LOGO_SVG.horizontal('dark').replace(/<text x="222"[^<]+<\/text>/, '')}
            baseName="flyyaro-horizontal-noslogan"
          >
            <LogoHorizontal height={64} variant="dark" withSlogan={false} />
          </LogoCard>

          <LogoCard
            title="Stacked — Light"
            description="Splash screens, posters, presentations"
            bg="#ffffff"
            svgGetter={() => LOGO_SVG.stacked('dark')}
            baseName="flyyaro-stacked-light"
          >
            <LogoStacked size={120} variant="dark" />
          </LogoCard>

          <LogoCard
            title="Stacked — Dark"
            description="Social media profiles & placards"
            bg="#05203c"
            svgGetter={() => LOGO_SVG.stacked('light')}
            baseName="flyyaro-stacked-dark"
          >
            <LogoStacked size={120} variant="light" />
          </LogoCard>

          <LogoCard
            title="Slogan lockup"
            description="Standalone tagline mark"
            bg="#f1f5f9"
            svgGetter={() => `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="180" viewBox="0 0 800 180"><rect width="800" height="180" fill="#ffffff"/><text x="400" y="95" text-anchor="middle" font-family="Inter, sans-serif" font-size="56" font-weight="800" fill="#0a2540" letter-spacing="-1">Book Smart.</text><text x="400" y="150" text-anchor="middle" font-family="Inter, sans-serif" font-size="56" font-weight="800" fill="#0770e3" letter-spacing="-1">Fly Better.</text></svg>`}
            baseName="flyyaro-slogan"
          >
            <div className="text-center leading-tight">
              <div className="text-3xl md:text-4xl font-extrabold text-[#0a2540]">Book Smart.</div>
              <div className="text-3xl md:text-4xl font-extrabold text-[#0770e3]">Fly Better.</div>
            </div>
          </LogoCard>
        </div>
      </section>

      <section className="bg-white border-y border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Color palette</h2>
          <p className="text-slate-600 mb-8">Click any swatch to copy the hex code.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Swatch name="Primary Blue" hex="#0770e3" />
            <Swatch name="Accent Teal" hex="#00d1c1" />
            <Swatch name="Deep Navy" hex="#05203c" />
            <Swatch name="Pure White" hex="#ffffff" textColor="#0a2540" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Typography</h2>
        <p className="text-slate-600 mb-8">Inter — modern, friendly, highly legible across all weights.</p>
        <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Display · 800</div>
            <div className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              Fly<span className="text-[#0770e3]">Yaro</span>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Heading · 700</div>
            <div className="text-3xl font-bold text-slate-900">Book Smart. Fly Better.</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Body · 400</div>
            <p className="text-base text-slate-700 leading-relaxed max-w-2xl">
              FlyYaro compares flights from 1,200+ airlines and travel sites — your trusted buddy for every journey, with no hidden fees.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Brand voice</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {[
            { t: 'Trusted', d: 'Like a friend who knows the best deals — honest, transparent, no surprises.' },
            { t: 'Smart', d: 'Data-driven. We compare 1,200+ sources in seconds so customers never overpay.' },
            { t: 'Friendly', d: '“Yaro” means buddy. We speak warmly, simply, and without travel-industry jargon.' },
          ].map((v) => (
            <div key={v.t} className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="text-[#0770e3] font-bold text-lg mb-2">{v.t}</div>
              <p className="text-sm text-slate-600 leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
