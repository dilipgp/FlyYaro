import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { useToast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';
import { LogoHorizontal } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

const GoogleIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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

function SocialButton({ icon: Icon, label, onClick, disabled, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.99] transition-all ${
        disabled ? 'opacity-60 cursor-not-allowed hover:bg-white' : ''
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
      {badge && (
        <span className="ml-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
    </button>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, loginWithGoogle } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(null);

  const handleGoogle = () => {
    setLoading('Google');
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    loginWithGoogle();
  };

  const handleComingSoon = (provider) => {
    toast({
      title: `${provider} sign-up coming soon`,
      description: `Connect your ${provider} developer credentials to enable this. For now, please use Google or email.`,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast({ title: 'Missing details', description: 'Please complete all fields to sign up.' });
      return;
    }
    if (form.password.length < 8) {
      toast({ title: 'Weak password', description: 'Use at least 8 characters.' });
      return;
    }
    if (!agree) {
      toast({ title: 'Please accept', description: 'You must agree to the Terms to continue.' });
      return;
    }
    setLoading('email');
    try {
      const data = await register({ name: form.name, email: form.email, password: form.password });
      toast({ title: 'Account created!', description: `Welcome aboard, ${data.name}.` });
      setTimeout(() => navigate('/'), 400);
    } catch (err) {
      toast({ title: 'Could not create account', description: err.message || 'Please try again.' });
    } finally {
      setLoading(null);
    }
  };

  const pwdStrong = form.password.length >= 8;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Brand panel */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] relative overflow-hidden bg-[#05203c] text-white p-12 flex-col justify-between">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-[#0770e3] blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[24rem] h-[24rem] rounded-full bg-[#00d1c1] blur-3xl opacity-50" />
        </div>

        <Link to="/" className="relative">
          <LogoHorizontal height={42} variant="light" withSlogan={false} />
        </Link>

        <div className="relative max-w-lg">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#00d1c1] mb-5 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d1c1] animate-pulse" /> Join FlyYaro
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
            Save up to <span className="text-[#00d1c1]">40%</span> on your next flight.
          </h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Create your free account in 30 seconds and unlock smarter ways to fly.
          </p>

          <div className="space-y-3">
            {[
              'Free to join — no credit card required',
              'Price drop alerts for your favorite routes',
              'Exclusive member-only deals and discounts',
              'Sync trips across all your devices',
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-200">
                <div className="w-6 h-6 rounded-full bg-[#00d1c1]/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#00d1c1]" />
                </div>
                <span className="text-sm">{b}</span>
              </div>
            ))}
          </div>
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
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">
              Create your account
            </h1>
            <p className="text-slate-600">
              Already have one?{' '}
              <Link to="/login" className="text-[#0770e3] font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>

          <div className="space-y-3">
            <SocialButton
              icon={GoogleIcon}
              label={loading === 'Google' ? 'Redirecting to Google…' : 'Sign up with Google'}
              onClick={handleGoogle}
              disabled={loading === 'Google'}
            />
            <SocialButton
              icon={FacebookIcon}
              label="Sign up with Facebook"
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                Full name
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Traveller"
                  className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-[#0770e3]/20 focus-visible:border-[#0770e3]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                Email
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-[#0770e3]/20 focus-visible:border-[#0770e3]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 8 characters"
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
              {form.password.length > 0 && (
                <p className={`text-xs mt-1.5 ${pwdStrong ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {pwdStrong ? '✓ Strong password' : 'Use at least 8 characters'}
                </p>
              )}
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <Checkbox checked={agree} onCheckedChange={setAgree} className="mt-0.5" />
              <span className="text-sm text-slate-700 leading-relaxed">
                I agree to FlyYaro's{' '}
                <a href="#" className="text-[#0770e3] hover:underline">Terms</a> and{' '}
                <a href="#" className="text-[#0770e3] hover:underline">Privacy Policy</a>
              </span>
            </label>

            <Button
              type="submit"
              disabled={loading === 'email'}
              className="w-full h-12 bg-[#0770e3] hover:bg-[#0660c5] text-white font-semibold rounded-xl text-base"
            >
              {loading === 'email' ? (
                'Creating account…'
              ) : (
                <>
                  Create account <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
