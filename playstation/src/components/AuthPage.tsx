import { useState } from 'react';

import { useAuth } from '@/hooks/AuthContext';

export function AuthPage() {
  const { signIn, fabricAuthEnabled } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    try { await signIn(); } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to sign in.');
    } finally { setLoading(false); }
  };

  return (
    <main className="auth-page">
      <div className="auth-symbols">△ ○ × □</div>
      <section className="auth-card">
        <div className="ps-brand auth-brand"><span className="ps-glyph">P</span><span>PlayStation</span></div>
        <p>PLAYSTATION STORE</p>
        <h1>Welcome back</h1>
        <span>Sign in with your Microsoft account to enter the Rayfin storefront.</span>
        <button onClick={() => void handleSignIn()} disabled={loading}>
          <i className="microsoft-mark"><b /><b /><b /><b /></i>
          {loading ? fabricAuthEnabled ? 'Opening Fabric…' : 'Signing in…' : 'Continue with Microsoft'}
        </button>
        {error && <small>{error}</small>}
      </section>
    </main>
  );
}
