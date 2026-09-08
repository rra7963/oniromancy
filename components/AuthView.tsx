import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, UserPlus, LogIn } from "lucide-react";

interface AuthPayload {
  mode: "login" | "signup";
  email: string;
  password: string;
  name?: string;
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.449 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
    </g>
  </svg>
);

interface AuthViewProps {
  onAuthenticate: (
    mode: "login" | "signup",
    email: string,
    password: string,
    name?: string
  ) => Promise<{ keepLoading?: boolean } | void>;
  onGoogleLogin: () => Promise<void>;
  errorMessage?: string | null;
  successMessage?: string | null;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onAuthenticate,
  onGoogleLogin,
  errorMessage,
  successMessage,
}) => {
  const [mode, setMode] = useState<AuthPayload["mode"]>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    setLocalError(null);
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    try {
      const result = await onAuthenticate(mode, email, password, name || undefined);
      if (result && result.keepLoading) {
        // Do not stop loading
      } else {
        setLoading(false);
      }
    } catch (err: unknown) {
      let message = "Something went wrong.";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        message = String((err as any).message);
      }
      setLocalError(message);
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLocalError(null);
    setGoogleLoading(true);
    try {
      await onGoogleLogin();
    } catch (err: unknown) {
      let message = "Google sign-in failed.";
      if (err instanceof Error) {
        message = err.message;
      }
      setLocalError(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const isSignup = mode === "signup";

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="bg-mystic-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mystic-gold to-transparent"></div>

        <div className="text-center mb-8 relative">
          <Link href="/" className="absolute left-0 top-0 text-slate-500 hover:text-white transition-colors text-xs flex items-center gap-1">
             ← Home
          </Link>
          <div className="w-16 h-16 bg-mystic-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
            <Eye className="text-mystic-gold w-8 h-8 animate-pulse-slow" />
          </div>
          <h2 className="text-2xl font-display text-white mb-2">
            {isSignup ? "Start Your Journey" : "Welcome Back"}
          </h2>
          <p className="text-slate-400 font-serif italic">
            {isSignup
              ? '"Begin your exploration of the self."'
              : '"Continue where you left off."'}
          </p>
        </div>

        {(localError || errorMessage) && (
          <div 
            className="mb-4 border text-sm px-4 py-3 rounded-lg bg-red-900/30 border-red-500/30 text-red-200"
          >
            {localError || errorMessage}
          </div>
        )}

        {successMessage && (
          <div 
            className="mb-4 border text-sm px-4 py-3 rounded-lg bg-green-900/30 border-green-500/30 text-green-200"
          >
            {successMessage}
          </div>
        )}

        {!successMessage && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignup && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-mystic-gold/50 focus:outline-none transition-colors font-sans"
                placeholder="Your Name"
              />
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-mystic-gold/50 focus:outline-none transition-colors font-sans"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-mystic-gold/50 focus:outline-none transition-colors font-sans"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-mystic-800 to-mystic-900 hover:from-mystic-700 hover:to-mystic-800 border border-white/10 text-white py-3 rounded-lg font-sans uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              "Connecting..."
            ) : (
              <>
                {isSignup ? (
                  <UserPlus className="w-4 h-4" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {isSignup ? "Create Account" : "Sign In"}
              </>
            )}
          </button>
        </form>
        )}

        <div className="mt-6 w-full">
          <div className="relative flex items-center justify-center text-xs uppercase tracking-[0.4em] text-slate-600 mb-4">
            <div className="absolute inset-x-0 h-px bg-white/10"></div>
            <span className="px-3 bg-mystic-900 text-slate-500">OR</span>
          </div>
          <button
            type="button"
            disabled={googleLoading}
            onClick={handleGoogle}
            className="w-full bg-white text-black py-3 rounded-lg font-sans text-sm font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition disabled:opacity-60"
          >
            {googleLoading ? (
              "Connecting..."
            ) : (
              <>
                <GoogleIcon />
                Sign in with Google
              </>
            )}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">
          {isSignup ? (
            <>
              Already have an account?
              <button
                className="text-mystic-gold ml-2 underline-offset-4 hover:underline"
                onClick={() => setMode("login")}
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?
              <button
                className="text-mystic-gold ml-2 underline-offset-4 hover:underline"
                onClick={() => setMode("signup")}
              >
                Create account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
