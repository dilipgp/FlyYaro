import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_BASE } from '../context/AuthContext';
import { LogoMark } from '../components/Logo';

/**
 * AuthCallback — handles the redirect back from Emergent's Google Auth.
 * The provider redirects to `/auth/callback#session_id=...`.
 * We exchange that one-time `session_id` for our `session_token` cookie,
 * then forward to the home page.
 *
 * REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser, refresh } = useAuth();
  const hasProcessed = useRef(false);
  const [status, setStatus] = useState('Signing you in…');

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const run = async () => {
      const hash = window.location.hash || '';
      const match = hash.match(/session_id=([^&]+)/);
      if (!match) {
        setStatus('Sign-in did not complete. Redirecting…');
        setTimeout(() => navigate('/login', { replace: true }), 800);
        return;
      }
      const sessionId = decodeURIComponent(match[1]);
      try {
        const res = await fetch(`${API_BASE}/auth/google/session`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || 'Could not complete sign-in');
        }
        const data = await res.json();
        setUser(data);
        // Strip the fragment from URL before navigating
        window.history.replaceState({}, document.title, '/auth/callback');
        // Sanity: re-fetch /auth/me to confirm cookie set
        try { await refresh(); } catch { /* ignore */ }
        navigate('/', { replace: true });
      } catch (e) {
        setStatus(`Sign-in failed: ${e.message}`);
        setTimeout(() => navigate('/login', { replace: true }), 1500);
      }
    };

    run();
  }, [navigate, setUser, refresh]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05203c] via-[#0a2a4d] to-[#05203c] text-white">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <LogoMark size={64} />
        </div>
        <div className="inline-block w-10 h-10 border-4 border-[#00d1c1] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-lg font-medium">{status}</p>
        <p className="text-sm text-slate-300 mt-2">Hang tight while we get you in.</p>
      </div>
    </div>
  );
}
