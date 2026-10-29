import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import StatsCards from "./components/StatsCards";
import PaymentForm from "./components/PaymentForm";
import ResultPanel from "./components/ResultPanel";
import { ShieldAlert, Terminal } from "lucide-react";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [authResult, setAuthResult] = useState(null);
  
  // Track in-memory session stats
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    genuine: 0,
    fraud: 0
  });

  // Keep JWT token sync'd with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Update in-memory counts when an audit completes
  const handlePaymentSuccess = (resultData) => {
    setAuthResult(resultData);
    
    const isGenuine = resultData.aiResult?.prediction === "GENUINE" || resultData.payment?.prediction === "GENUINE";
    
    setSessionStats((prev) => ({
      total: prev.total + 1,
      genuine: prev.genuine + (isGenuine ? 1 : 0),
      fraud: prev.fraud + (isGenuine ? 0 : 1),
    }));
  };

  const handleLogout = () => {
    setToken(null);
    setAuthResult(null);
    setSessionStats({ total: 0, genuine: 0, fraud: 0 });
  };

  // If not signed in, render the premium Login screen
  if (!token) {
    return <Login onLoginSuccess={setToken} />;
  }

  return (
    <div className="min-h-screen bg-brand-darkest text-slate-100 flex flex-col font-sans antialiased selection:bg-brand-accent/30 selection:text-white">
      {/* Top Header navbar */}
      <Navbar onLogout={handleLogout} />

      {/* Main Dashboard Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Row 1: Session Status & Counters */}
        <StatsCards sessionStats={sessionStats} />

        {/* Row 2: Secure workspace workspace */}
        <div className="grid grid-cols-1 gap-6">
          {!authResult ? (
            <PaymentForm 
              onAuthenticationStart={() => {}}
              onAuthenticationSuccess={handlePaymentSuccess}
              onAuthenticationFailure={(err) => console.warn("API Error:", err)}
            />
          ) : (
            <ResultPanel 
              result={authResult}
              onClear={() => setAuthResult(null)}
            />
          )}
        </div>
      </main>

      {/* Bottom Footer Info */}
      <footer className="w-full border-t border-brand-border/20 py-4 text-center mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-[10px] font-semibold text-slate-500 uppercase tracking-widest gap-2">
          <div className="flex items-center space-x-1.5">
            <Terminal className="w-3.5 h-3.5 text-brand-cyanAI" />
            <span>AI Blockchain Payment Authentication System &copy; 2026</span>
          </div>
          <div>
            Fabric SDK: v1.12.0 &bull; Flask ML model: v1.0 &bull; Node Engine: v24
          </div>
        </div>
      </footer>
    </div>
  );
}
