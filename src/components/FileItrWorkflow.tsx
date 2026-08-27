import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { FileText, ArrowRight, CheckCircle2, ShieldCheck, Download, AlertCircle, Building2, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OfficialServiceGuideDrawer } from './OfficialServiceGuideDrawer';
import { computeTaxAY2026 } from '../taxLogic';

export const FileItrWorkflow: React.FC = () => {
  const { taxpayer, submitItrDraft, navigateToService } = useApp();
  const [step, setStep] = useState(1);

  // Check if return for AY 2026-27 is already submitted in taxpayer ecosystem
  const activeReturn = taxpayer.returns['AY2026-27'];
  const isAlreadySubmitted = activeReturn?.status === 'submitted' || activeReturn?.status === 'verified';
  const existingAck = activeReturn?.acknowledgementNo;

  // Form Inputs - Pre-filled strictly from Taxpayer Ecosystem Single Source of Truth
  const [ay, setAy] = useState('2026-27');
  const [itrType, setItrType] = useState('ITR-1 (Sahaj)');
  const [salary, setSalary] = useState(taxpayer.salary.grossAnnual);
  const [interestIncome, setInterestIncome] = useState(taxpayer.income.savingsInterest + taxpayer.income.fdInterest);
  const [dividendIncome, setDividendIncome] = useState(taxpayer.income.dividend);
  const [deductions, setDeductions] = useState(taxpayer.deductions.totalDeductions);
  const [declaration, setDeclaration] = useState(false);
  const [submittedAck, setSubmittedAck] = useState<string | null>(existingAck || null);

  // Dynamic calculations derived from single source of truth
  const grossTotalIncome = salary + interestIncome + dividendIncome;
  const taxComputation = computeTaxAY2026(grossTotalIncome, deductions, 'new');
  const totalTDS = taxpayer.form26as.totalTDS;
  
  // Calculate balance tax due using return record dynamic value
  const isPaid = taxpayer.actionHistory.some((a) => a.serviceId === 'e-pay-tax');
  const netTaxDueInRecord = activeReturn?.refundOrTaxDue || 0; // -20800 if unpaid tax, 0 if paid, >0 if refund
  const isTaxDue = netTaxDueInRecord < 0 && !isPaid;
  const absTaxDue = Math.abs(netTaxDueInRecord);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockAck = submitItrDraft();
    setSubmittedAck(mockAck);
    setStep(6);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Service Workflow */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#0b2341] to-slate-900 text-white p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Canonical Service #1</div>
              <h2 className="text-xl font-bold font-serif">File Income Tax Return (AY {ay})</h2>
              <p className="text-xs text-slate-300">Pre-filled ITR-1 Return filing derived from employer Form 16 and AIS records.</p>
            </div>
            <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-xs text-amber-400 font-semibold">
              PAN: {taxpayer.pan}
            </div>
          </div>

          {/* Wizard Step Breadcrumbs */}
          <div className="bg-slate-50 border-b border-slate-200 p-3 overflow-x-auto custom-scrollbar flex items-center justify-between text-xs font-semibold text-slate-600">
            {['1. Personal Info', '2. Pre-filled Income', '3. Deductions', '4. Tax & TDS Ledger', '5. Declaration', '6. Submission & Ack'].map(
              (label, idx) => {
                const stepNum = idx + 1;
                const isActive = step === stepNum;
                const isDone = step > stepNum || isAlreadySubmitted;
                return (
                  <div
                    key={idx}
                    className={`flex items-center space-x-1.5 whitespace-nowrap px-2 py-1 rounded ${
                      isAlreadySubmitted
                        ? 'bg-emerald-100 text-[#004B32] font-bold'
                        : isActive
                        ? 'bg-[#004B32] text-white font-bold'
                        : isDone
                        ? 'text-emerald-700 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    <span>{label}</span>
                  </div>
                );
              }
            )}
          </div>

          {/* Form Step Body */}
          <div className="p-6">
            {isAlreadySubmitted || submittedAck ? (
              <div className="text-center py-8 space-y-4 animate-fadeIn bg-[#FAF7F2] border border-emerald-200 rounded-2xl p-6">
                <div className="inline-flex p-3 bg-emerald-100 rounded-full text-[#004B32] mb-1">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-serif">Return Already Submitted for AY 2026-27</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your ITR-1 return for AY {ay} has been recorded under Acknowledgement Number:
                </p>

                <div className="p-4 bg-white border border-slate-200 rounded-xl inline-block font-mono font-bold text-lg text-slate-900 shadow-sm">
                  {submittedAck || existingAck || 'MOCK-ITR-2627-739210'}
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-[#004B32] font-semibold max-w-md mx-auto">
                  Submission Status: Successfully Logged in CBDT Master Server ✓
                </div>

                <div className="pt-2 flex items-center justify-center space-x-3">
                  <button
                    onClick={() => navigateToService('e-verify')}
                    className="bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    <ShieldCheck size={16} />
                    <span>Proceed to e-Verify Return Now →</span>
                  </button>

                  <button
                    onClick={() => navigateToService('filing-history')}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
                  >
                    View Filing History
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 className="font-bold text-sm text-[#1E3A2B] border-b pb-2">Step 1: Taxpayer Profile & Employment Details</h3>
                    
                    <div className="p-4 bg-[#FAF7F2] border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 font-medium">Full Name:</span>
                        <div className="font-bold text-slate-900">{taxpayer.name}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">PAN / Aadhaar:</span>
                        <div className="font-mono font-bold text-slate-900">{taxpayer.pan} • {taxpayer.aadhaar}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Residential Status:</span>
                        <div className="font-bold text-slate-900">{taxpayer.residentialStatus}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Employer:</span>
                        <div className="font-bold text-slate-900">{taxpayer.salary.employerName} ({taxpayer.salary.employerType})</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Assessment Year</label>
                        <select
                          value={ay}
                          onChange={(e) => setAy(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-800"
                        >
                          <option value="2026-27">AY 2026-27 (FY 2025-26)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ITR Form Type</label>
                        <select
                          value={itrType}
                          onChange={(e) => setItrType(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-800"
                        >
                          <option value="ITR-1 (Sahaj)">ITR-1 (Sahaj) — Salaried & Pensioners</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-[#004B32] text-white font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-[#003825] transition flex items-center gap-1 ml-auto shadow-sm"
                    >
                      <span>Next: Income Details</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 className="font-bold text-sm text-[#1E3A2B] border-b pb-2">Step 2: Pre-filled Income Heads (from AIS & Form 16)</h3>
                    
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Gross Salary Income (Form 16 Part B) (₹)</label>
                        <input
                          type="number"
                          value={salary}
                          onChange={(e) => setSalary(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900"
                        />
                        <span className="text-[10px] text-slate-500">Source: {taxpayer.salary.employerName} (TAN: {taxpayer.salary.employerTan})</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Interest Income (Savings Bank) (₹)</label>
                          <input
                            type="number"
                            value={interestIncome}
                            onChange={(e) => setInterestIncome(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900"
                          />
                          <span className="text-[10px] text-slate-500">Source: Savings Bank Interest (₹{taxpayer.income.savingsInterest.toLocaleString('en-IN')})</span>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Dividend / Other Income (₹)</label>
                          <input
                            type="number"
                            value={dividendIncome}
                            onChange={(e) => setDividendIncome(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900"
                          />
                          <span className="text-[10px] text-slate-500">Source: Reported SFT Feeds</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-[#004B32] space-y-1">
                      <div className="font-bold">Gross Total Income: ₹{grossTotalIncome.toLocaleString('en-IN')}</div>
                      <div className="text-[11px] text-slate-600">Standard deduction of ₹75,000 auto-applied under Sec 115BAC New Tax Regime.</div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-lg"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="bg-[#004B32] text-white font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-[#003825] transition flex items-center gap-1 shadow-sm"
                      >
                        <span>Next: Deductions</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 className="font-bold text-sm text-[#1E3A2B] border-b pb-2">Step 3: Deductions & Standard Deduction</h3>
                    
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                      <div className="font-bold text-[#1E3A2B]">New Tax Regime (Sec 115BAC) Deductions:</div>
                      <div className="flex justify-between">
                        <span>Standard Deduction (Salaried):</span>
                        <span className="font-bold text-emerald-700">₹75,000</span>
                      </div>
                      <div className="flex justify-between border-t pt-1.5 font-bold text-slate-900">
                        <span>Net Taxable Income:</span>
                        <span>₹{(grossTotalIncome - 75000).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-lg"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        className="bg-[#004B32] text-white font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-[#003825] transition flex items-center gap-1 shadow-sm"
                      >
                        <span>Next: Tax & TDS Ledger</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 className="font-bold text-sm text-[#1E3A2B] border-b pb-2">Step 4: Tax Computation & Form 26AS TDS Reconciliation</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                      <div className="p-4 bg-[#FAF7F2] border border-slate-200 rounded-xl space-y-2">
                        <div className="font-bold text-[#1E3A2B] uppercase border-b pb-1">Tax Liability Computation</div>
                        <div className="flex justify-between">
                          <span>Gross Total Income:</span>
                          <span className="font-bold text-slate-900">₹{grossTotalIncome.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Standard Deduction:</span>
                          <span className="text-emerald-700">- ₹75,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taxable Income:</span>
                          <span className="font-bold text-slate-900">₹{(grossTotalIncome - 75000).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between border-t pt-1 font-bold text-[#004B32]">
                          <span>Total Tax Liability (Inc. Cess 4%):</span>
                          <span>₹{taxComputation.finalTaxPayable.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                        <div className="font-bold text-[#004B32] uppercase border-b border-emerald-200 pb-1">TDS Credits (From Form 26AS)</div>
                        <div className="flex justify-between">
                          <span>Employer TDS ({taxpayer.salary.employerName.split(' ')[0]}):</span>
                          <span className="font-mono font-bold text-slate-900">₹{totalTDS.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between border-t border-emerald-200 pt-1 font-bold text-[#004B32]">
                          <span>Total Prepaid TDS Credit:</span>
                          <span>₹{totalTDS.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tax Payable / Refund State Box */}
                    {isTaxDue ? (
                      <div className="p-5 bg-amber-50 border-2 border-amber-500 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-amber-900 uppercase">Self-Assessment Tax Payment Required</div>
                            <div className="text-2xl font-black text-amber-950 font-mono mt-0.5">₹{absTaxDue.toLocaleString('en-IN')}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => navigateToService('e-pay-tax')}
                            className="bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md"
                          >
                            <CreditCard size={15} />
                            <span>Pay Tax Now via e-Pay Tax →</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-amber-800 leading-snug">
                          Tax liability (₹{taxComputation.finalTaxPayable.toLocaleString('en-IN')}) exceeds prepaid TDS credit (₹{totalTDS.toLocaleString('en-IN')}). Complete self-assessment tax payment under Minor Head 300 to proceed.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-[#004B32] text-white rounded-xl flex items-center justify-between font-mono">
                        <span className="text-xs font-bold uppercase">{isPaid ? 'Self-Assessment Tax Status:' : 'Net Calculated Tax Refund:'}</span>
                        <span className="text-xl font-black text-amber-300">
                          {isPaid ? `₹0 Balance Payable (Paid ₹${absTaxDue.toLocaleString('en-IN')} ✓)` : `₹${Math.abs(taxComputation.finalTaxPayable - totalTDS).toLocaleString('en-IN')}`}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-lg"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(5)}
                        disabled={isTaxDue}
                        className="bg-[#004B32] hover:bg-[#003825] disabled:bg-slate-300 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition flex items-center gap-1 shadow-sm"
                      >
                        <span>Next: Self-Declaration</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 className="font-bold text-sm text-[#1E3A2B] border-b pb-2">Step 5: Taxpayer Self-Declaration</h3>
                    
                    <label className="flex items-start space-x-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={declaration}
                        onChange={(e) => setDeclaration(e.target.checked)}
                        className="mt-0.5 rounded text-[#004B32]"
                      />
                      <span className="text-xs text-slate-700 leading-relaxed">
                        I, <strong className="text-slate-900">{taxpayer.name}</strong> (PAN: <strong className="font-mono text-slate-900">{taxpayer.pan}</strong>), declare that the information provided in this return for AY {ay} is true, correct and complete to the best of my knowledge based on Form 16 ({taxpayer.salary.employerName}) and Form 26AS records.
                      </span>
                    </label>

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        className="bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-lg"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={!declaration}
                        className="bg-[#004B32] hover:bg-[#003825] disabled:bg-slate-300 text-white font-bold text-xs px-6 py-2.5 rounded-lg transition shadow-md flex items-center gap-1.5"
                      >
                        <ShieldCheck size={16} />
                        <span>Submit Income Tax Return</span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Official Service Guidelines Side Drawer */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          <OfficialServiceGuideDrawer
            serviceName="ITR-1 (Sahaj) Return Filing"
            whoShouldUse={[
              'Resident Individuals with total income up to ₹50 Lakhs',
              'Income from Salary, Pension, or One House Property',
              'Interest income from Savings/FDs & Dividends',
              'Agricultural income up to ₹5,000 per year',
            ]}
            whyChooseThis={[
              'Pre-filled salary data from Form 16 & AIS feeds',
              'Standard deduction of ₹75,000 automatically claimed',
              'Instant processing and automated refund initiation',
              'Fully compliant with CBDT AY 2026-27 rules',
            ]}
            keyRules={[
              'Cannot use ITR-1 if you have Capital Gains or Business income',
              'Directors in companies or holders of unlisted equity shares must file ITR-2/3',
              'Return must be e-Verified within 30 days of submission',
            ]}
            officialDocRef="incometax.gov.in/ITR1-Sahaj-AY2026"
          />
        </div>

      </div>
    </div>
  );
};
