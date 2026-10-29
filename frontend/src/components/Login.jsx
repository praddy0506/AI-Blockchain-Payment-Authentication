import React, { useState } from "react";
import axios from "axios";
import { Shield, Cpu, Lock, ArrowRight, AlertTriangle } from "lucide-react";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Connect to backend API. In typical dev environments, we point to localhost:5000
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.data && response.data.token) {
        onLoginSuccess(response.data.token);
      } else {
        setError("Invalid response from auth server.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message || 
        "Authentication server connection failed. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-brand-darkest text-slate-100 overflow-hidden font-sans">
      
      {/* LEFT SIDE: Brand & Value Prop (hidden on small mobile, shown on md and up) */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-brand-dark to-brand-darkest border-r border-brand-border/40 relative">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-cyanAI/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Logo/Header */}
        <div className="flex items-center space-x-3 z-10">
          <div className="p-2 bg-brand-accent/20 border border-brand-accent/40 rounded-xl">
            <Shield className="w-6 h-6 text-brand-accent" />
          </div>
          <span className="font-bold text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            SECUREGATEWAY
          </span>
        </div>

        {/* Hero Concept */}
        <div className="my-auto max-w-lg z-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full border border-brand-accent/25">
            Security Intelligence
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-6 leading-tight">
            AI BLOCKCHAIN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-cyanAI">
              PAYMENT AUTHENTICATION
            </span>
          </h1>
          <p className="mt-6 text-slate-400 text-lg leading-relaxed">
            Intelligent payment security powered by XGBoost machine learning and Hyperledger Fabric blockchain ledgering. Zero-trust transactional integrity verified in milliseconds.
          </p>

          {/* Visual Indicators */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="flex items-center space-x-3 p-3 bg-brand-dark/50 border border-brand-border/20 rounded-xl">
              <Cpu className="w-5 h-5 text-brand-cyanAI" />
              <span className="text-sm font-medium text-slate-300">AI Fraud Engine</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-brand-dark/50 border border-brand-border/20 rounded-xl">
              <Shield className="w-5 h-5 text-brand-accent" />
              <span className="text-sm font-medium text-slate-300">Fabric Consensus</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-500 z-10">
          &copy; 2026 AI-Blockchain Payment Security System. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Login form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 bg-brand-darkest relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none md:hidden"></div>

        <div className="w-full max-w-md p-8 rounded-2xl glass-panel shadow-2xl relative z-10">
          <div className="text-center md:text-left mb-8">
            {/* Logo for mobile only */}
            <div className="flex md:hidden items-center justify-center space-x-2 mb-6">
              <div className="p-2 bg-brand-accent/20 border border-brand-accent/40 rounded-xl">
                <Shield className="w-5 h-5 text-brand-accent" />
              </div>
              <span className="font-bold text-lg tracking-wider text-slate-100">
                SECUREGATEWAY
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Security Console Access
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Provide credentials to verify session clearance.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-security-fraud/10 border border-security-fraud/30 rounded-xl flex items-start space-x-3 text-security-fraud">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="w-full bg-brand-dark border border-brand-border/40 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-white px-4 py-3 rounded-xl transition duration-200"
                  placeholder="admin@secure.net"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  className="w-full bg-brand-dark border border-brand-border/40 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-white px-4 py-3 rounded-xl transition duration-200"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-brand-accent to-brand-accentHover text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-95 transition-all duration-200 shadow-lg shadow-brand-accent/25 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating Session...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-brand-border/20 text-center">
            <span className="text-xs text-slate-500">
              Authorized personnel only. All access connections are logged.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
