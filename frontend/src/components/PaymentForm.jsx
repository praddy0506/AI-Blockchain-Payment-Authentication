import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShieldCheck, UserCheck, Smartphone, MapPin, RefreshCw } from "lucide-react";

export default function PaymentForm({ onAuthenticationStart, onAuthenticationSuccess, onAuthenticationFailure }) {
  // Extract authenticated user's name from JWT email payload
  const [senderName] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.email) {
          const namePart = payload.email.split("@")[0];
          return namePart.charAt(0).toUpperCase() + namePart.slice(1);
        }
      } catch (e) {
        console.error("Token parse error:", e);
      }
    }
    return "Authenticated User";
  });

  const [receiverName, setReceiverName] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [transactionType, setTransactionType] = useState("PAYMENT"); // matches TYPE_MAPPING in AI
  const [location, setLocation] = useState("New York, USA");
  const [device, setDevice] = useState("iPhone 15 Pro");

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");

  const loadingMessages = [
    "Analyzing transaction metadata...",
    "Invoking XGBoost machine learning model...",
    "Calculating SHAP explanation features...",
    "Preparing Hyperledger Fabric ledger submission...",
    "Broadcasting transaction proposal to peer nodes...",
    "Confirming ledger state consensus..."
  ];

  // Handle simulated loading message steps
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 700);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!senderName || !receiverName || !amount || !location || !device) {
      setError("Please fill in all required fields.");
      return;
    }

    const amtNum = parseFloat(amount);
    if (isNaN(amtNum) || amtNum <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    setLoading(true);
    setError("");
    onAuthenticationStart();

    // Silently calculate balance parameters for the API compatibility layer
    const sBefore = 10000;
    const rBefore = 5000;
    let sAfter = sBefore;
    let rAfter = rBefore;

    if (transactionType === "PAYMENT" || transactionType === "TRANSFER" || transactionType === "CASH_OUT") {
      sAfter = Math.max(0, sBefore - amtNum);
      rAfter = rBefore + amtNum;
    } else if (transactionType === "CASH_IN") {
      sAfter = sBefore + amtNum;
      rAfter = Math.max(0, rBefore - amtNum);
    }

    const token = localStorage.getItem("token");

    const payload = {
      senderName,
      receiverName,
      amount: amtNum,
      paymentMethod,
      transactionType,
      location,
      device,
      senderBalanceBefore: sBefore,
      senderBalanceAfter: sAfter,
      receiverBalanceBefore: rBefore,
      receiverBalanceAfter: rAfter,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/payment",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        onAuthenticationSuccess(response.data);
      } else {
        setError("Invalid response received from server.");
        onAuthenticationFailure("Invalid response format.");
      }
    } catch (err) {
      console.error("Payment authentication failed:", err);
      const errMsg = err.response?.data?.message || "Connection to API server failed.";
      setError(errMsg);
      onAuthenticationFailure(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-brand-border/40 font-sans">
      
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-brand-darkest/90 rounded-3xl z-30 flex flex-col justify-center items-center p-8 backdrop-blur-sm">
          <div className="relative flex items-center justify-center w-24 h-24 mb-6">
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full border-4 border-brand-accent/20 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full border-4 border-brand-cyanAI/40 border-t-brand-accent animate-spin"></div>
            <ShieldCheck className="w-8 h-8 text-brand-cyanAI" />
          </div>
          
          <h3 className="text-lg font-bold text-white tracking-wide">
            AUTHENTICATING TRANSACTION
          </h3>
          
          <div className="mt-4 flex flex-col items-center max-w-md w-full">
            <span className="text-xs text-brand-cyanAI font-semibold tracking-widest uppercase">
              Pipeline Stage {loadingStep + 1} of {loadingMessages.length}
            </span>
            <p className="text-slate-300 text-sm mt-2 text-center font-medium animate-pulse">
              {loadingMessages[loadingStep]}
            </p>

            {/* Simulated progress bar */}
            <div className="w-full bg-slate-900 border border-brand-border/40 h-2 rounded-full mt-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-brand-accent to-brand-cyanAI h-full transition-all duration-300"
                style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Header (Development Fill buttons removed for Production) */}
      <div className="pb-6 border-b border-brand-border/20 mb-6">
        <h2 className="text-xl font-extrabold text-white flex items-center space-x-2.5">
          <ShieldCheck className="w-5 h-5 text-brand-accent" />
          <span>Authenticate Secure Payment</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Analyze transactional metadata with XGBoost and register block to ledger.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-security-fraud/10 border border-security-fraud/30 rounded-xl text-security-fraud text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Core details (Sender/Receiver) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
              Sender Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <UserCheck className="w-4 h-4" />
              </span>
              <input
                type="text"
                readOnly
                className="w-full bg-slate-900 border border-brand-border/20 text-slate-400 opacity-80 select-none pointer-events-none pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
                value={senderName}
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
              Receiver Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <UserCheck className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                placeholder="Enter receiver name"
                className="w-full bg-slate-950 border border-brand-border/40 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-white pl-10 pr-4 py-2.5 rounded-xl text-sm transition"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Amount Field (PROMINENT) */}
        <div className="p-5 bg-slate-950/60 border border-brand-border/30 rounded-2xl">
          <label className="block text-brand-cyanAI text-xs font-bold uppercase tracking-widest mb-2 text-center sm:text-left">
            Payment Value (INR)
          </label>
          <div className="relative max-w-md mx-auto sm:mx-0">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
              <span className="text-2xl font-bold text-brand-accent w-8 h-8 flex items-center justify-center select-none">₹</span>
            </span>
            <input
              type="number"
              required
              step="any"
              placeholder="0.00"
              className="w-full bg-brand-darkest border border-brand-border/50 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-white pl-14 pr-4 py-3 rounded-xl text-2xl font-extrabold tracking-wide transition"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        {/* Metadatas (Type / Method / Location / Device) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
              Tx Type
            </label>
            <select
              className="w-full bg-slate-950 border border-brand-border/40 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-white px-3 py-2.5 rounded-xl text-xs font-semibold uppercase transition"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="PAYMENT">PAYMENT</option>
              <option value="TRANSFER">TRANSFER</option>
              <option value="CASH_OUT">CASH_OUT</option>
              <option value="DEBIT">DEBIT</option>
              <option value="CASH_IN">CASH_IN</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
              Payment Method
            </label>
            <select
              className="w-full bg-slate-950 border border-brand-border/40 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-white px-3 py-2.5 rounded-xl text-xs font-semibold transition"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Crypto Wallet">Crypto Wallet</option>
              <option value="Mobile Pay">Mobile Pay</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
              Location
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <MapPin className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-brand-border/40 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-white pl-9 pr-3 py-2.5 rounded-xl text-xs transition"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
              Device Agent
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Smartphone className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-brand-border/40 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-white pl-9 pr-3 py-2.5 rounded-xl text-xs transition"
                value={device}
                onChange={(e) => setDevice(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-brand-accent to-brand-accentHover text-white py-3.5 rounded-xl font-bold tracking-wider uppercase text-sm flex items-center justify-center space-x-2 shadow-lg shadow-brand-accent/20 hover:opacity-95 active:scale-[0.99] transition duration-200"
        >
          <RefreshCw className="w-4 h-4 animate-spin-slow" />
          <span>Authorize & Authenticate Payment</span>
        </button>

      </form>
    </div>
  );
}
