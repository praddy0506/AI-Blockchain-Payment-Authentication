import React from "react";
import { Shield, LogOut, Power, User } from "lucide-react";

export default function Navbar({ onLogout }) {
  // Decode user profile from token if available, otherwise default to "System Admin"
  const token = localStorage.getItem("token");
  let userEmail = "security.admin@secure.net";
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userEmail = payload.email || userEmail;
    } catch (e) {
      console.error("Failed to parse token payload:", e);
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-brand-border/30 px-6 py-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-brand-accent/20 border border-brand-accent/40 rounded-lg shadow-inner">
            <Shield className="w-5 h-5 text-brand-accent animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-wide text-white">
              AI Blockchain Pay
            </span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
              Security Ledger console
            </span>
          </div>
        </div>

        {/* SYSTEM STATUS (Pulsing operational status) */}
        <div className="hidden sm:flex items-center space-x-2.5 bg-slate-950/60 border border-brand-border/20 px-4 py-1.5 rounded-full shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-security-genuine opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-security-genuine"></span>
          </span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            System Operational
          </span>
        </div>

        {/* PROFILE & LOGOUT */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-brand-card border border-brand-border/30 px-3 py-1.5 rounded-xl">
            <div className="w-6 h-6 rounded-full bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-brand-accent" />
            </div>
            <span className="text-xs font-medium text-slate-300 hidden md:inline">
              {userEmail}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center space-x-1.5 bg-slate-900 border border-brand-border/40 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

      </div>
    </header>
  );
}
