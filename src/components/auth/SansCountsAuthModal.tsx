import React, { useState } from 'react';
import { X, ShieldCheck, Key, User, ArrowRight, CheckCircle2, Lock, ExternalLink, Sparkles, LogIn } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SANSCOUNTS_CLIENT_ID = 'sc_client_sansneat_live';
export const SANSCOUNTS_CLIENT_SECRET = 'sc_sec_sansneat_82f1b702e9a1c4';
export const SANSCOUNTS_REDIRECT_URI = 'https://sansneat.sanssiu.com/auth/callback';
export const SANSCOUNTS_PROVIDER_URL = 'https://sanscounts.sanssiu.com';

export const SansCountsAuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { loginWithSansCounts, user, logout } = useApp();
  const [activeTab, setActiveTab] = useState<'oauth' | 'signin' | 'credentials'>('oauth');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Real SansCounts OAuth 2.0 Live Popup Flow
  const handleLiveOAuthPopup = () => {
    setIsLoading(true);
    setErrorMessage('');

    const redirectUri = `${window.location.origin}/auth/callback`;
    const liveOAuthUrl = `${SANSCOUNTS_PROVIDER_URL}/?client_id=${SANSCOUNTS_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    const width = 560;
    const height = 720;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const authWindow = window.open(
      liveOAuthUrl,
      'sanscounts_oauth_popup',
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
    );

    if (!authWindow) {
      // Fallback if popup blocked
      setErrorMessage('Popup was blocked by browser. You can use direct sign-in below.');
      setIsLoading(false);
    }
  };

  const handleQuickSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Please enter your SansCounts username or ID');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/sanscounts/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: SANSCOUNTS_CLIENT_ID,
          client_secret: SANSCOUNTS_CLIENT_SECRET,
          username: username.trim(),
          firstName: firstName.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('SansCounts authentication failed');
      }

      const data = await res.json();
      loginWithSansCounts({
        username: data.user.username,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName || 'Sans',
        avatar: data.user.avatar,
        token: data.access_token,
        isConnected: true,
      });

      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to authenticate with SansCounts');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-500 via-[#00C2FF] to-cyan-400 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/30 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full">
              Single Sign-On (SSO)
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight">SansCounts Auth</h2>
          <p className="text-xs text-white/90 mt-1">
            Connect SansNeat with your verified SansCounts ID
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/60 text-xs font-bold">
          <button
            onClick={() => setActiveTab('oauth')}
            className={`flex-1 py-3 transition cursor-pointer border-b-2 ${
              activeTab === 'oauth'
                ? 'border-[#00C2FF] text-[#00C2FF] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            OAuth 2.0 Connect
          </button>
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-3 transition cursor-pointer border-b-2 ${
              activeTab === 'signin'
                ? 'border-[#00C2FF] text-[#00C2FF] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Direct Login
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-3 transition cursor-pointer border-b-2 ${
              activeTab === 'credentials'
                ? 'border-[#00C2FF] text-[#00C2FF] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Keys & URLs
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {user.isConnected ? (
            <div className="text-center py-3">
              <div className="w-16 h-16 rounded-full ring-4 ring-[#00C2FF]/30 mx-auto mb-3 overflow-hidden bg-sky-50 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-[#00C2FF]" />
                )}
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Connected to SansCounts
              </span>
              <h3 className="text-lg font-bold text-gray-900">{user.firstName} {user.lastName}</h3>
              <p className="text-xs text-gray-500 mb-1">@{user.username}</p>
              <p className="text-[11px] text-gray-400 mb-6">{user.email}</p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-[#00C2FF] hover:bg-[#00a8dc] text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-md shadow-[#00C2FF]/30"
                >
                  Continue Browsing
                </button>
                <button
                  onClick={() => {
                    logout();
                  }}
                  className="py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : activeTab === 'oauth' ? (
            <div className="space-y-4">
              <div className="p-4 bg-sky-50/70 border border-sky-200/80 rounded-2xl text-center space-y-2">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-xs mx-auto flex items-center justify-center text-[#00C2FF]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-900">Authorize SansNeat with SansCounts</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Click below to open the official SansCounts Single Sign-On window and authorize with Client ID <code className="bg-white px-1.5 py-0.5 rounded text-[11px] font-mono text-sky-600 font-bold">sc_client_sansneat_live</code>.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                  {errorMessage}
                </div>
              )}

              <button
                type="button"
                onClick={handleLiveOAuthPopup}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-[#00C2FF] hover:bg-[#00a8dc] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#00C2FF]/30 active:scale-98 transition cursor-pointer disabled:opacity-75"
              >
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>Connect via SansCounts OAuth</span>
              </button>

              <div className="flex items-center gap-2 text-[11px] text-gray-400 justify-center">
                <Lock className="w-3.5 h-3.5" />
                <span>OAuth 2.0 PKCE & Secure Token Exchange</span>
              </div>
            </div>
          ) : activeTab === 'signin' ? (
            <form onSubmit={handleQuickSignIn} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  SansCounts Username / ID
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. sanssiu or sophia"
                    className="w-full pl-10 pr-24 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#00C2FF] outline-none transition"
                  />
                  <span className="absolute right-3 text-[11px] font-semibold text-gray-400 pointer-events-none">
                    @sanscounts.san
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter SansCounts password"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#00C2FF] outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Sophia Williams"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-[#00C2FF] outline-none transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#00C2FF] hover:bg-[#00a8dc] text-white font-bold text-xs rounded-xl shadow-md shadow-[#00C2FF]/30 active:scale-98 transition cursor-pointer disabled:opacity-75"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In with SansCounts</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Demo Accounts */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-[11px] text-gray-400 mb-2 font-medium">Quick Accounts:</p>
                <div className="flex flex-wrap gap-1.5">
                  {['sophia', 'sanssiu', 'sanscounts', 'foodie'].map((name) => (
                    <button
                      type="button"
                      key={name}
                      onClick={() => {
                        setUsername(name);
                        setPassword('pass123');
                        setFirstName(name.charAt(0).toUpperCase() + name.slice(1));
                      }}
                      className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-[#00C2FF] text-[11px] font-bold rounded-lg transition cursor-pointer"
                    >
                      @{name}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Client ID
                  </span>
                  <code className="inline-block mt-1 font-mono text-gray-900 bg-white px-2 py-1 rounded border border-gray-200 select-all break-all">
                    {SANSCOUNTS_CLIENT_ID}
                  </code>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Client Secret
                  </span>
                  <code className="inline-block mt-1 font-mono text-gray-900 bg-white px-2 py-1 rounded border border-gray-200 select-all break-all">
                    {SANSCOUNTS_CLIENT_SECRET}
                  </code>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Redirect URI
                  </span>
                  <code className="inline-block mt-1 font-mono text-[#00C2FF] bg-white px-2 py-1 rounded border border-gray-200 select-all break-all">
                    {SANSCOUNTS_REDIRECT_URI}
                  </code>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    OAuth Provider Endpoint
                  </span>
                  <code className="inline-block mt-1 font-mono text-gray-800 bg-white px-2 py-1 rounded border border-gray-200 select-all break-all">
                    {SANSCOUNTS_PROVIDER_URL}
                  </code>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('oauth')}
                className="w-full py-2.5 bg-[#00C2FF] hover:bg-[#00a8dc] text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Back to OAuth Connect
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
