import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, Plane, Shield, Bell } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { useToast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';
import { LogoHorizontal, LogoMark } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

// Brand-colored SVG icons for social providers (inline so no extra deps)
const GoogleIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.42-1.7 4.16-5.5 4.16-3.31 0-6-2.74-6-6.13S8.69 6 12 6c1.88 0 3.14.8 3.86 1.49l2.63-2.54C16.84 3.43 14.62 2.4 12 2.4 6.74 2.4 2.5 6.65 2.5 11.93s4.24 9.53 9.5 9.53c5.48 0 9.11-3.85 9.11-9.27 0-.62-.07-1.1-.16-1.59H12z"/>
    <path fill="#34A853" d="M3.88 7.16l3.12 2.29C7.84 7.6 9.77 6 12 6c1.88 0 3.14.8 3.86 1.49l2.63-2.54C16.84 3.43 14.62 2.4 12 2.4 8.13 2.4 4.79 4.62 3.88 7.16z" opacity="0"/>
    <path fill="#FBBC05" d="M12 21.46c2.59 0 4.77-.86 6.36-2.34l-3.04-2.49c-.83.58-1.94 1-3.32 1-2.55 0-4.71-1.72-5.49-4.04l-3.13 2.42C4.55 19.18 8 21.46 12 21.46z" opacity="0"/>
    <path fill="#4285F4" d="M21.45 12.19c0-.62-.07-1.1-.16-1.59H12v3.9h5.5a4.7 4.7 0 0 1-2.04 3.07l3.04 2.49c1.78-1.65 2.95-4.1 2.95-7.87z"/>
    <path fill="#34A853" d="M12 21.46c2.59 0 4.77-.86 6.36-2.34l-3.04-2.49c-.83.58-1.94 1-3.32 1-2.55 0-4.71-1.72-5.49-4.04l-3.13 2.42C4.55 19.18 8 21.46 12 21.46z"/>
    <path fill="#FBBC05" d="M6.51 13.59A5.94 5.94 0 0 1 6.2 12c0-.55.1-1.09.27-1.59L3.34 8C2.79 9.2 2.5 10.55 2.5 12s.29 2.8.84 4l3.17-2.41z"/>
    <path fill="#EA4335" d="M12 6c1.88 0 3.14.8 3.86 1.49l2.63-2.54C16.84 3.43 14.62 2.4 12 2.4 8 2.4 4.55 4.68 3.34 8l3.17 2.41C7.29 8.09 9.45 6 12 6z"/>
  </svg>
);

const FacebookIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill="#1877F2" d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 17.99 24 12z"/>
  </svg>
);

const AppleIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const XIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

function SocialButton({ icon: Icon, label, onClick, brandColor, disabled, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.99] transition-all ${
        disabled ? 'opacity-60 cursor-not-allowed hover:bg-white' : ''
      }`}
      style={brandColor ? { color: brandColor } : undefined}
    >
      <Icon className="w-5 h-5" />
      <span className="text-slate-800">{label}</span>
      {badge && (
        <span className="ml-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
    </button>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, loginWithGoogle } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(null); // provider name when loading

  const handleGoogle = () => {
    setLoading('Google');
    // Real Google OAuth via Emergent — full-page redirect.
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    loginWithGoogle();
  };

  const handleComingSoon = (provider) => {
    toast({
      title: `${provider} sign-in coming soon`,
      description:
        `Connect your ${provider} developer credentials to enable this. For now, please use Google or email.`,
    });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Missing details', description: 'Please enter your email and password.' });
      return;
    }
    setLoading('email');
    try {
      const data = await login(email, password);
      toast({ title: 'Welcome back!', description: `Signed in as ${data.email}` });
      setTimeout(() => navigate('/'), 400);
    } catch (err) {
      toast({ title: 'Could not sign in', description: err.message || 'Please try again.' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Brand panel */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] relative overflow-hidden bg-[#05203c] text-white p-12 flex-col justify-between">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-[#0770e3] blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[24rem] h-[24rem] rounded-full bg-[#00d1c1] blur-3xl opacity-50" />
        </div>

        <div className="relative">
          <Link to="/">
            <LogoHorizontal height={42} variant="light" withSlogan={false} />
          </Link>
        </div>

        <div className="relative max-w-lg">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#00d1c1] mb-5 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d1c1] animate-pulse" /> Book Smart. Fly Better.
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
            Your travel <span className="text-[#00d1c1]">Yaro</span> awaits.
          </h2>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed">
            Sign in to unlock personalized flight deals, price drop alerts, and one-click booking across 1,200+ travel sites.
          </p>

          <ul className="space-y-3">
            {[
              { icon: Bell, text: 'Personalized price alerts on routes you love' },
              { icon: Plane, text: 'Save trips and sync across all your devices' },
              { icon: Shield, text: 'Member-only deals and zero booking fees' },
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-200">
                <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 text-[#00d1c1]" />
                </div>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-slate-400">
          © {new Date().getFullYear()} FlyYaro Technologies Pvt Ltd · FlyYaro.com
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8 flex justify-center">
            <Link to="/">
              <LogoHorizontal height={40} variant="dark" withSlogan={false} />
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">Log in</h1>
            <p className="text-slate-600">
              New here?{' '}
              <Link to="/signup" className="text-[#0770e3] font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          {/* Social buttons */}
          <div className="space-y-3">
            <SocialButton
              icon={GoogleIcon}
              label={loading === 'Google' ? 'Redirecting to Google…' : 'Continue with Google'}
              onClick={handleGoogle}
              disabled={loading === 'Google'}
            />
            <SocialButton
              icon={FacebookIcon}
              label="Continue with Facebook"
              onClick={() => handleComingSoon('Facebook')}
              badge="Soon"
            />
            <div className="grid grid-cols-2 gap-3">
              <SocialButton
                icon={AppleIcon}
                label="Apple"
                onClick={() => handleComingSoon('Apple')}
                badge="Soon"
              />
              <SocialButton
                icon={XIcon}
                label="X / Twitter"
                onClick={() => handleComingSoon('X')}
                badge="Soon"
              />
            </div>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="px-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">
              or with email
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                Email
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-[#0770e3]/20 focus-visible:border-[#0770e3]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password
                </Label>
                <a href="#" className="text-xs text-[#0770e3] hover:underline font-medium">
                  Forgot?
                </a>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-12 rounded-xl border-slate-200 focus-visible:ring-[#0770e3]/20 focus-visible:border-[#0770e3]"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label="toggle password visibility"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={remember} onCheckedChange={setRemember} />
              <span className="text-sm text-slate-700">Keep me signed in</span>
            </label>

            <Button
              type="submit"
              disabled={loading === 'email'}
              className="w-full h-12 bg-[#0770e3] hover:bg-[#0660c5] text-white font-semibold rounded-xl text-base"
            >
              {loading === 'email' ? (
                'Signing in…'
              ) : (
                <>
                  Log in <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-6 leading-relaxed">
            By continuing, you agree to FlyYaro's{' '}
            <a href="#" className="text-slate-700 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-slate-700 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
