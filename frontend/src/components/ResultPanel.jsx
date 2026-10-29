import React, { useState } from "react";
import { CheckCircle2, ShieldAlert, Copy, Check, Info, Server, Cpu, Database } from "lucide-react";

export default function ResultPanel({ result, onClear }) {
  const [copied, setCopied] = useState(false);
  
  if (!result) return null;

  const { payment, aiResult } = result;
  
  // Extract values
  const prediction = aiResult?.prediction || payment?.prediction || "UNKNOWN";
  const fraudScore = aiResult?.fraudPercentage !== undefined ? aiResult.fraudPercentage : (payment?.fraudScore || 0);
  const isGenuine = prediction === "GENUINE";
  const mongoId = payment?._id || "N/A";
  const txHash = payment?.blockchainHash || result?.blockchain?.transactionId || "";
  
  // Parse SHAP explanation
  let shapData = {};
  if (payment?.explanation) {
    try {
      shapData = JSON.parse(payment.explanation);
    } catch (e) {
      console.error("Error parsing explanation:", e);
    }
  } else if (aiResult?.shapExplanation) {
    shapData = aiResult.shapExplanation;
  }

  // Map SHAP feature names to human-readable strings
  const featureLabels = {
    step: "Time Step Alignment",
    type: "Transaction Type Flag",
    amount: "Transaction Value Size",
    oldbalanceOrg: "Sender Orig. Balance",
    newbalanceOrig: "Sender End Balance",
    oldbalanceDest: "Receiver Orig. Balance",
    newbalanceDest: "Receiver End Balance",
    isFlaggedFraud: "System Rules Flag"
  };

  const handleCopy = () => {
    if (!txHash) return;
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine risk category
  let riskColor = "text-security-genuine border-security-genuine/30";
  let riskBg = "bg-security-genuine/10";
  if (fraudScore >= 50) {
    riskColor = "text-security-fraud border-security-fraud/30";
    riskBg = "bg-security-fraud/10";
  } else if (fraudScore >= 15) {
    riskColor = "text-amber-500 border-amber-500/30";
    riskBg = "bg-amber-500/10";
  }

  return (
    <div className="w-full space-y-6 animate-fade-in font-sans">
      
      {/* Top action: Back to form */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Transaction Security Analysis
        </h3>
        <button
          onClick={onClear}
          className="px-4 py-1.5 bg-slate-900 border border-brand-border/40 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition"
        >
          Check Another Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Main prediction and Risk Gauge (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden shadow-2xl">
          
          {/* Background glow base on result */}
          <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20 ${isGenuine ? "bg-security-genuine" : "bg-security-fraud"}`}></div>

          <div className="text-center w-full">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-900 border border-brand-border/30 px-3 py-1 rounded-full">
              AI Security Classifier
            </span>
            
            {/* Main status indicator */}
            <div className="mt-8 flex flex-col items-center">
              {isGenuine ? (
                <div className="p-4 bg-security-genuine/10 border-2 border-security-genuine/30 rounded-full mb-4 shadow-lg shadow-security-genuine/10">
                  <CheckCircle2 className="w-16 h-16 text-security-genuine" />
                </div>
              ) : (
                <div className="p-4 bg-security-fraud/10 border-2 border-security-fraud/30 rounded-full mb-4 shadow-lg shadow-security-fraud/10 animate-bounce">
                  <ShieldAlert className="w-16 h-16 text-security-fraud" />
                </div>
              )}

              <h2 className={`text-2xl font-extrabold tracking-wider ${isGenuine ? "text-security-genuine" : "text-security-fraud"}`}>
                {isGenuine ? "PAYMENT APPROVED" : "PAYMENT BLOCKED"}
              </h2>
              
              <p className="text-slate-400 text-xs mt-2 max-w-xs mx-auto">
                {isGenuine 
                  ? "XGBoost classifier verified transaction credentials. Validated on ledger." 
                  : "Transaction halted. Fraud patterns identified in balance states."}
              </p>
            </div>
          </div>

          {/* Risk Gauge Visual (Gauge) */}
          <div className="w-full flex flex-col items-center mt-8 pt-6 border-t border-brand-border/20">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">
              AI Risk Coefficient
            </span>
            
            <div className="relative flex items-center justify-center">
              {/* Speedometer semi-circle SVG */}
              <svg className="w-36 h-20" viewBox="0 0 100 50">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke={isGenuine ? "#10b981" : "#ef4444"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="125"
                  strokeDashoffset={125 - (125 * Math.min(100, Math.max(0, fraudScore))) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute bottom-0 text-center">
                <span className="text-3xl font-black text-white leading-none">
                  {fraudScore.toFixed(2)}%
                </span>
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                  Fraud probability
                </span>
              </div>
            </div>

            <div className={`mt-4 px-3 py-1 text-xs font-extrabold rounded-md uppercase tracking-wider border ${riskColor} ${riskBg}`}>
              {fraudScore < 15 ? "Low Risk" : fraudScore < 50 ? "Medium Risk" : "Critical Risk"}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Ledger pipeline & SHAP impact logs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Metadata details */}
          <div className="p-6 rounded-3xl glass-panel shadow-2xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 border-b border-brand-border/20">
              Transactional Credentials
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Sender</span>
                <div className="text-sm font-semibold text-slate-200 truncate">{payment?.senderName}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Receiver</span>
                <div className="text-sm font-semibold text-slate-200 truncate">{payment?.receiverName}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Amount</span>
                <div className="text-sm font-bold text-white">₹{payment?.amount}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Database ID</span>
                <div className="text-xs text-slate-400 truncate" title={mongoId}>{mongoId}</div>
              </div>
            </div>
          </div>

          {/* Blockchain Confirmation details */}
          <div className="p-6 rounded-3xl glass-panel shadow-2xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 border-b border-brand-border/20 mb-4">
              Hyperledger Fabric Consensus
            </h4>
            
            {isGenuine ? (
              <div className="space-y-4">
                <div className="p-4 bg-security-genuine/5 border border-security-genuine/20 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">Ledger State Hash (Transaction ID)</span>
                    {txHash && (
                      <button
                        onClick={handleCopy}
                        className="flex items-center space-x-1 bg-slate-900 border border-brand-border/40 hover:bg-slate-800 px-2 py-1 rounded text-[10px] text-slate-300 transition duration-150"
                      >
                        {copied ? <Check className="w-3 h-3 text-security-genuine" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? "Copied!" : "Copy ID"}</span>
                      </button>
                    )}
                  </div>
                  <div className="text-xs font-mono text-slate-300 bg-brand-darkest p-2 rounded-lg mt-2 overflow-x-auto select-all border border-brand-border/20 leading-relaxed break-all">
                    {txHash || "ledger_commit_hash_pending"}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center space-x-2 bg-slate-900 border border-brand-border/20 px-3 py-2 rounded-xl text-slate-400">
                    <span className="text-security-genuine">✓</span>
                    <span>Proposal Endorsed</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-900 border border-brand-border/20 px-3 py-2 rounded-xl text-slate-400">
                    <span className="text-security-genuine">✓</span>
                    <span>Orderer Submitted</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-900 border border-brand-border/20 px-3 py-2 rounded-xl text-slate-400">
                    <span className="text-security-genuine">✓</span>
                    <span>Ledger Committed</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-security-fraud/5 border border-security-fraud/20 rounded-2xl text-center">
                <span className="text-xs font-bold text-security-fraud uppercase tracking-widest block mb-1">
                  Blockchain Submissions Aborted
                </span>
                <p className="text-[11px] text-slate-400">
                  Fabric network policies blocked this transaction. Ledger updates aborted due to positive fraud detection.
                </p>
              </div>
            )}
          </div>

          {/* Blockchain Pipeline Graphic */}
          <div className="p-6 rounded-3xl glass-panel shadow-2xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
              Network Routing Pipeline Flow
            </h4>
            
            <div className="flex flex-col sm:flex-row items-center justify-between relative px-2 gap-4 sm:gap-2">
              
              {/* Background Connecting Line */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 hidden sm:block"></div>

              {/* Step 1: Initiate */}
              <div className="flex flex-col items-center text-center z-10 w-28">
                <div className="w-8 h-8 rounded-full bg-brand-accent/20 border border-brand-accent flex items-center justify-center shadow-lg shadow-brand-accent/20">
                  <Server className="w-3.5 h-3.5 text-brand-accent" />
                </div>
                <span className="text-[10px] text-slate-300 font-semibold mt-2">Tx Initiated</span>
              </div>

              {/* Step 2: AI Fraud Check */}
              <div className="flex flex-col items-center text-center z-10 w-28">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-lg ${
                  isGenuine 
                    ? "bg-security-genuine/20 border-security-genuine shadow-security-genuine/20" 
                    : "bg-security-fraud/25 border-security-fraud shadow-security-fraud/35 animate-pulse"
                }`}>
                  <Cpu className={`w-3.5 h-3.5 ${isGenuine ? "text-security-genuine" : "text-security-fraud"}`} />
                </div>
                <span className={`text-[10px] font-semibold mt-2 ${isGenuine ? "text-slate-300" : "text-security-fraud"}`}>
                  AI Fraud Filter
                </span>
              </div>

              {/* Step 3: Blockchain Consensus */}
              <div className="flex flex-col items-center text-center z-10 w-28">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                  !isGenuine 
                    ? "bg-slate-900 border-slate-800 text-slate-600 opacity-40 line-through" 
                    : "bg-security-genuine/20 border-security-genuine shadow-lg shadow-security-genuine/20"
                }`}>
                  <Database className={`w-3.5 h-3.5 ${isGenuine ? "text-security-genuine" : "text-slate-600"}`} />
                </div>
                <span className={`text-[10px] font-semibold mt-2 ${isGenuine ? "text-slate-300" : "text-slate-600"}`}>
                  Fabric Consensus
                </span>
              </div>

              {/* Step 4: Confirmed */}
              <div className="flex flex-col items-center text-center z-10 w-28">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                  !isGenuine 
                    ? "bg-slate-900 border-slate-800 text-slate-600 opacity-40" 
                    : "bg-brand-cyanAI/20 border-brand-cyanAI shadow-lg shadow-brand-cyanAI/20"
                }`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isGenuine ? "text-brand-cyanAI" : "text-slate-600"}`} />
                </div>
                <span className={`text-[10px] font-semibold mt-2 ${isGenuine ? "text-slate-300" : "text-slate-600"}`}>
                  Ledger Committed
                </span>
              </div>

            </div>
          </div>

          {/* SHAP Explanations Chart */}
          {Object.keys(shapData).length > 0 && (
            <div className="p-6 rounded-3xl glass-panel shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border/20 mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  SHAP Decision Impact Analysis
                </h4>
                <div className="flex items-center space-x-1.5 text-[9px] text-slate-500 uppercase font-semibold">
                  <Info className="w-3 h-3 text-brand-cyanAI" />
                  <span>Feature contribution to fraud index</span>
                </div>
              </div>

              <div className="space-y-3.5">
                {Object.entries(shapData)
                  .filter(([key]) => key !== "isFlaggedFraud") // hide uninteresting features
                  .map(([key, val]) => {
                    const label = featureLabels[key] || key;
                    const valNum = parseFloat(val) || 0;
                    
                    // Cap the bar width rendering to avoid overflow issues
                    const absVal = Math.min(100, Math.abs(valNum) * 15); 
                    const isPositive = valNum >= 0;

                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-300 text-[11px]">{label}</span>
                          <span className={`font-mono text-[10px] ${isPositive ? "text-security-fraud" : "text-security-genuine"}`}>
                            {valNum > 0 ? `+${valNum.toFixed(4)}` : valNum.toFixed(4)}
                          </span>
                        </div>
                        
                        {/* Custom horizontal slider bar */}
                        <div className="w-full bg-slate-900 border border-brand-border/20 h-2.5 rounded-full overflow-hidden flex relative">
                          {/* Left (Genuine support) or Right (Fraud support) based on SHAP polarity */}
                          <div className="w-1/2 border-r border-slate-800 flex justify-end">
                            {!isPositive && (
                              <div 
                                className="bg-security-genuine h-full rounded-l" 
                                style={{ width: `${absVal}%` }}
                              ></div>
                            )}
                          </div>
                          <div className="w-1/2">
                            {isPositive && (
                              <div 
                                className="bg-security-fraud h-full rounded-r" 
                                style={{ width: `${absVal}%` }}
                              ></div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="mt-4 pt-4 border-t border-brand-border/20 flex justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                <span className="text-security-genuine">← Supports Genuine Prediction</span>
                <span className="text-security-fraud">Supports Fraud Prediction →</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
