import React from "react";
import { CreditCard, CheckCircle2, ShieldAlert, Cpu, Database } from "lucide-react";

export default function StatsCards({ sessionStats }) {
  const { total = 0, genuine = 0, fraud = 0 } = sessionStats;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center space-x-2">
          <span>Active Session Security Monitor</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyanAI animate-ping"></span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Session Total */}
          <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:border-brand-border/80 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Session Total</span>
                <h3 className="text-2xl font-bold text-white mt-1.5">{total}</h3>
              </div>
              <div className="p-3 bg-slate-900 border border-brand-border/40 rounded-xl text-slate-400 group-hover:text-white transition duration-300">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Payments audited since session login
            </div>
          </div>

          {/* Card 2: Approved / Genuine */}
          <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:border-security-genuine/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Approved (Genuine)</span>
                <h3 className="text-2xl font-bold text-security-genuine mt-1.5">{genuine}</h3>
              </div>
              <div className="p-3 bg-slate-900 border border-brand-border/40 rounded-xl text-security-genuine group-hover:bg-security-genuine/10 transition duration-300">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Recorded to Hyperledger Fabric
            </div>
          </div>

          {/* Card 3: Blocked / Fraud */}
          <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:border-security-fraud/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Blocked (Fraud)</span>
                <h3 className="text-2xl font-bold text-security-fraud mt-1.5">{fraud}</h3>
              </div>
              <div className="p-3 bg-slate-900 border border-brand-border/40 rounded-xl text-security-fraud group-hover:bg-security-fraud/10 transition duration-300">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Halted before ledger submission
            </div>
          </div>

          {/* Card 4: AI Protection Status */}
          <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:border-brand-cyanAI/55 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Guard Status</span>
                <h3 className="text-lg font-bold text-brand-cyanAI mt-2 uppercase tracking-wide">XGBoost Active</h3>
              </div>
              <div className="p-3 bg-slate-900 border border-brand-border/40 rounded-xl text-brand-cyanAI group-hover:bg-brand-cyanAI/10 transition duration-300">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div className="mt-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              SHAP explanation engine ready
            </div>
          </div>
        </div>
      </div>

      {/* Database/Ledger Vault Status */}
      <div className="p-4 rounded-xl border border-dashed border-brand-border/40 bg-slate-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-900 rounded-lg text-slate-500">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Ledger Vault History
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Historical ledger stats require off-chain audit logs syncing. Currently offline to prevent backend latency.
            </div>
          </div>
        </div>
        <div className="inline-flex items-center justify-center px-3 py-1 text-[10px] font-bold text-slate-400 bg-slate-900 border border-brand-border/50 rounded-lg">
          DATABASE STATS UNAVAILABLE (REQUIRES AUDIT CLEARANCE)
        </div>
      </div>
    </div>
  );
}
