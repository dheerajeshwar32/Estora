import React, { useState, useMemo } from 'react';
import { IndianRupee, PieChart } from 'lucide-react';

const MortgageCalculator = ({ price }) => {
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanYears, setLoanYears] = useState(20);

  const downPayment = (price * downPaymentPct) / 100;
  const principal = price - downPayment;

  const emi = useMemo(() => {
    if (principal <= 0) return 0;
    const r = interestRate / 12 / 100;
    const n = loanYears * 12;
    if (r === 0) return principal / n;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [principal, interestRate, loanYears]);

  const totalPayment = emi * loanYears * 12;
  const totalInterest = totalPayment - principal;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-navy-950 rounded-3xl p-8 border border-white/5 mb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
          <PieChart size={20} />
        </div>
        <h2 className="text-xl font-medium text-[color:var(--theme-white)]">Mortgage Calculator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Controls */}
        <div className="space-y-8">
          {/* Down Payment */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-slate-400">Down Payment ({downPaymentPct}%)</label>
              <span className="text-sm font-bold text-[color:var(--theme-white)]">{formatCurrency(downPayment)}</span>
            </div>
            <input 
              type="range" min="0" max="100" step="5"
              value={downPaymentPct} onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              className="w-full accent-blue-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-slate-400">Interest Rate</label>
              <span className="text-sm font-bold text-[color:var(--theme-white)]">{interestRate}%</span>
            </div>
            <input 
              type="range" min="1" max="15" step="0.1"
              value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-blue-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Loan Term */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-slate-400">Loan Term</label>
              <span className="text-sm font-bold text-[color:var(--theme-white)]">{loanYears} Years</span>
            </div>
            <input 
              type="range" min="5" max="30" step="1"
              value={loanYears} onChange={(e) => setLoanYears(Number(e.target.value))}
              className="w-full accent-blue-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-center">
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-2">Estimated EMI</p>
            <div className="text-3xl sm:text-4xl font-bold text-blue-400 flex flex-wrap justify-center items-baseline gap-1 break-words">
              {formatCurrency(emi)}
              <span className="text-sm sm:text-lg text-slate-500 font-medium">/mo</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-slate-400">Principal Amount</span>
              <span className="font-medium text-[color:var(--theme-white)]">{formatCurrency(principal)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-slate-400">Total Interest</span>
              <span className="font-medium text-[color:var(--theme-white)]">{formatCurrency(totalInterest)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-slate-400">Total Payable (Loan)</span>
              <span className="font-bold text-[color:var(--theme-white)]">{formatCurrency(totalPayment)}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-slate-400">Total Property Cost</span>
              <span className="font-bold text-blue-400">{formatCurrency(totalPayment + downPayment)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;

