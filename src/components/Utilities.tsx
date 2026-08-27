import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Download, FileText, CheckCircle2, ShieldCheck, Printer, Calculator, Info, Check, HelpCircle, ArrowRightLeft, Sparkles, AlertTriangle } from 'lucide-react';
import { generateMockPdfBlob } from '../pdfGenerator';
import { computeTaxAY2026 } from '../taxLogic';

export const TaxCalculatorUtility: React.FC = () => {
  const [income, setIncome] = useState(1275000);
  const [deductions, setDeductions] = useState(150000);
  const [regime, setRegime] = useState<'new' | 'old'>('new');

  const newRegimeResult = computeTaxAY2026(income, deductions, 'new');
  const oldRegimeResult = computeTaxAY2026(income, deductions, 'old');
  const activeResult = regime === 'new' ? newRegimeResult : oldRegimeResult;

  const taxDifference = Math.abs(newRegimeResult.finalTaxPayable - oldRegimeResult.finalTaxPayable);
  const recommendedRegime = newRegimeResult.finalTaxPayable <= oldRegimeResult.finalTaxPayable ? 'new' : 'old';

  return (
    <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden my-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0b2341] via-[#0f4c3a] to-[#0b2341] text-white p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-amber-300 font-extrabold uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={14} className="text-amber-300" />
            <span>Public Tax Utility • AY 2026-27</span>
          </div>
          <h2 className="text-2xl font-black font-serif tracking-tight mt-0.5">
            Income Tax & Slab Comparison Calculator
          </h2>
          <p className="text-xs text-slate-200 mt-1">Section 115BAC New Tax Regime with Sec 87A Rebate & Marginal Relief Engine.</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl text-right font-mono text-xs">
          <div className="text-[10px] text-slate-300 font-bold uppercase">Tax Saving Recommendation</div>
          <div className="text-sm font-extrabold text-amber-300">
            Choose {recommendedRegime === 'new' ? 'New Regime (Sec 115BAC)' : 'Old Regime'}
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Input Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-[#FAF7F2] p-5 rounded-2xl border border-slate-200">
          <div>
            <label className="block text-xs font-extrabold text-[#1E3A2B] uppercase tracking-wider mb-1.5">
              Gross Annual Income (₹)
            </label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              placeholder="Enter gross salary/income"
              className="w-full bg-white border-2 border-slate-300/80 rounded-xl p-3 text-base font-extrabold text-slate-900 focus:ring-2 focus:ring-[#004B32] focus:border-[#004B32] shadow-sm transition"
            />
            <p className="text-[10px] text-slate-500 mt-1 font-semibold">Includes Salary, Bank Interest, Dividends, and Rental income.</p>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#1E3A2B] uppercase tracking-wider mb-1.5">
              Select Active Tax Regime View
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setRegime('new')}
                className={`flex-1 p-3 rounded-xl text-xs font-bold transition border ${
                  regime === 'new'
                    ? 'bg-[#004B32] text-white border-[#004B32] shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                New Regime (Sec 115BAC)
              </button>
              <button
                type="button"
                onClick={() => setRegime('old')}
                className={`flex-1 p-3 rounded-xl text-xs font-bold transition border ${
                  regime === 'old'
                    ? 'bg-[#004B32] text-white border-[#004B32] shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Old Tax Regime
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-semibold">New Regime auto-applies ₹75,000 standard deduction.</p>
          </div>
        </div>

        {/* Chapter VI-A Deductions Input for Old Regime */}
        {regime === 'old' && (
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2 animate-fadeIn">
            <label className="block text-xs font-extrabold text-amber-900 uppercase tracking-wider">
              Chapter VI-A Deductions (Section 80C, 80D, 80CCD, HRA) (₹)
            </label>
            <input
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(Number(e.target.value))}
              className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-[10px] text-amber-800 font-medium">Sum of 80C (PPF, ELSS, EPF), 80D (Health Insurance), and NPS deductions.</p>
          </div>
        )}

        {/* Regime Comparison Banner */}
        <div className="p-4 bg-emerald-50 border-2 border-emerald-500/60 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#004B32] text-amber-300 rounded-xl">
              <ArrowRightLeft size={20} />
            </div>
            <div>
              <div className="font-extrabold text-xs text-[#1E3A2B] uppercase tracking-wider">Side-by-Side Tax Comparison</div>
              <div className="text-xs text-slate-600 mt-0.5">
                New Regime Tax: <strong className="text-slate-900">₹{newRegimeResult.finalTaxPayable.toLocaleString('en-IN')}</strong> | 
                Old Regime Tax: <strong className="text-slate-900">₹{oldRegimeResult.finalTaxPayable.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-200/80 px-2.5 py-1 rounded-full border border-emerald-300">
              You Save ₹{taxDifference.toLocaleString('en-IN')} under {recommendedRegime === 'new' ? 'New Regime' : 'Old Regime'}
            </span>
          </div>
        </div>

        {/* Computation Summary Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Detailed Tax Computation Ledger */}
          <div className="lg:col-span-7 p-5 bg-[#FAF7F2] border border-slate-200/90 rounded-2xl space-y-3 shadow-sm">
            <h3 className="font-bold text-xs text-[#1E3A2B] uppercase tracking-wider border-b border-slate-200/80 pb-2">
              Detailed Tax Ledger & Mathematical Breakdown ({regime === 'new' ? 'Sec 115BAC' : 'Old Regime'})
            </h3>

            <div className="space-y-2.5 text-xs font-medium text-slate-700">
              <div className="flex justify-between">
                <span>Gross Annual Income:</span>
                <span className="font-bold text-slate-900">₹{activeResult.grossIncome.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>Standard & Chapter VI-A Deductions:</span>
                <span className="text-emerald-700 font-bold">- ₹{activeResult.applicableDeductions.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-slate-900 text-sm">
                <span>Net Taxable Income:</span>
                <span>₹{activeResult.taxableIncome.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between pt-1">
                <span>Base Progressive Slab Tax:</span>
                <span className="font-bold text-slate-900">₹{activeResult.baseTax.toLocaleString('en-IN')}</span>
              </div>

              {activeResult.rebate87A > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold bg-emerald-100/80 p-2 rounded-xl border border-emerald-200">
                  <span>Section 87A Tax Rebate:</span>
                  <span>- ₹{activeResult.rebate87A.toLocaleString('en-IN')}</span>
                </div>
              )}

              {activeResult.surchargeAfterRelief > 0 && (
                <div className="flex justify-between text-amber-900 font-bold bg-amber-100/80 p-2 rounded-xl border border-amber-200">
                  <span>High Income Surcharge:</span>
                  <span>+ ₹{activeResult.surchargeAfterRelief.toLocaleString('en-IN')}</span>
                </div>
              )}

              {activeResult.marginalRelief > 0 && (
                <div className="flex justify-between text-indigo-900 font-bold bg-indigo-50 p-2 rounded-xl border border-indigo-200">
                  <span>Marginal Relief Benefit:</span>
                  <span>- ₹{activeResult.marginalRelief.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Health & Education Cess (4%):</span>
                <span className="font-bold text-slate-900">₹{activeResult.cess.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between border-t-2 border-slate-300 pt-2.5 text-lg font-black text-[#004B32]">
                <span>Total Tax Payable:</span>
                <span>₹{activeResult.finalTaxPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Right: Progressive Slab Breakdown Table */}
          <div className="lg:col-span-5 p-5 bg-white border border-slate-200/90 rounded-2xl space-y-3 shadow-sm">
            <h3 className="font-bold text-xs text-[#1E3A2B] uppercase tracking-wider border-b border-slate-100 pb-2">
              Progressive Tax Slab Breakdown
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#FAF7F2] text-slate-700 font-bold border-b text-[10px] uppercase">
                  <tr>
                    <th className="p-2">Slab Bracket (₹)</th>
                    <th className="p-2">Rate</th>
                    <th className="p-2 text-right">Tax (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeResult.slabBreakdown.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2 font-mono text-[11px] font-bold text-slate-800">{s.range}</td>
                      <td className="p-2 font-bold text-[#004B32]">{s.rate}</td>
                      <td className="p-2 text-right font-mono font-bold text-slate-900">₹{s.taxAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
              <div className="flex justify-between font-semibold">
                <span>Effective Tax Rate:</span>
                <span className="font-bold text-[#004B32]">{activeResult.effectiveTaxRate.toFixed(2)}%</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">Calculated according to official CBDT AY 2026-27 tax slabs.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export const DownloadFormsUtility: React.FC = () => {
  const { taxpayer } = useApp();
  const [downloadedForm, setDownloadedForm] = useState<string | null>(null);

  const FORMS_CATALOGUE = [
    { title: 'ITR-V (Acknowledgement Form)', desc: 'Official Acknowledgement receipt for verified return filing.', ay: 'AY 2026-27' },
    { title: 'Form 16 / 16A Certificate', desc: 'TDS Certificate issued by employer & deductors for Salary income.', ay: 'AY 2026-27' },
    { title: 'Form 26AS Tax Credit Statement', desc: 'Annual Tax Statement showing all TDS credits and advance tax payments.', ay: 'AY 2026-27' },
    { title: 'AIS / TIS Financial Report', desc: 'Annual Information Statement detailing all financial transactions.', ay: 'AY 2026-27' },
    { title: 'ITR-1 Sahaj Form (PDF & Schema)', desc: 'Blank Return Form for individuals having salary income up to ₹50 Lakhs.', ay: 'AY 2026-27' },
    { title: 'Challan ITNS 280 Payment Voucher', desc: 'Proof of advance tax and self-assessment tax payments.', ay: 'AY 2026-27' },
  ];

  const handleDownload = (title: string) => {
    generateMockPdfBlob(
      `Official Document: ${title}`,
      `Government of India • Income Tax e-Filing Portal Output`,
      [
        { label: 'Taxpayer Name', value: taxpayer.name || 'Priya Shah' },
        { label: 'PAN Number', value: taxpayer.pan || 'AABCP1234A' },
        { label: 'Document Name', value: title },
        { label: 'Assessment Year', value: 'AY 2026-27' },
        { label: 'Generated Date', value: new Date().toLocaleDateString() },
        { label: 'Digital Verification Status', value: 'DIGITALLY VERIFIED (CBDT)' },
      ]
    );
    setDownloadedForm(title);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden my-6">
      <div className="bg-gradient-to-r from-[#0b2341] to-slate-900 text-white p-5 flex items-center justify-between">
        <div>
          <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Public Utility Service</div>
          <h2 className="text-xl font-bold flex items-center gap-2 font-serif">
            <Download size={22} className="text-amber-400" />
            Download Forms & ITR-V Statements
          </h2>
          <p className="text-xs text-slate-300">Generate, view and print official ITR-V, Form 16, and Form 26AS PDFs in real-time.</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {downloadedForm && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-[#004B32] font-bold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{downloadedForm} generated and opened in Print/PDF window!</span>
            </div>
            <button onClick={() => setDownloadedForm(null)} className="text-slate-500 hover:text-slate-700">Dismiss</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FORMS_CATALOGUE.map((form, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#FAF7F2] border border-slate-200/80 rounded-xl flex flex-col justify-between hover:border-[#004B32] transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-emerald-100 text-[#004B32] font-bold text-[9px] uppercase px-2 py-0.5 rounded">
                    {form.ay}
                  </span>
                  <FileText size={16} className="text-slate-400" />
                </div>
                <h4 className="font-bold text-xs text-[#1E3A2B]">{form.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1">{form.desc}</p>
              </div>

              <button
                onClick={() => handleDownload(form.title)}
                className="mt-3 bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Printer size={13} />
                <span>View / Print {form.title.split(' ')[0]} PDF</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
