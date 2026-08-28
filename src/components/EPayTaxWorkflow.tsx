import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { CreditCard, CheckCircle2, Receipt, ArrowRight, ShieldCheck, Search, FileText, Lock, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OfficialServiceGuideDrawer } from './OfficialServiceGuideDrawer';

export const EPayTaxWorkflow: React.FC = () => {
  const { recordTaxPayment, taxpayer, activeTaxpayerId, navigateToService, triggerLoginModal } = useApp();
  
  // Anonymous / Pre-login stage state
  const isGuest = activeTaxpayerId === 'guest';
  const [inputPan, setInputPan] = useState('');
  const [panValidated, setPanValidated] = useState(false);
  const [panError, setPanError] = useState('');

  // Active taxpayer domain values
  const return2026 = taxpayer.returns['AY2026-27'];
  const isPaidInHistory = taxpayer.actionHistory.some((a) => a.serviceId === 'e-pay-tax');
  const rawTaxDue = return2026?.refundOrTaxDue || 0; // Negative means tax is due e.g. -20800
  const isTaxDue = rawTaxDue < 0 && !isPaidInHistory;
  const taxDueAmount = isTaxDue ? Math.abs(rawTaxDue) : 0;

  // Form states
  const [paymentType, setPaymentType] = useState('Self-Assessment Tax (300)');
  const [ay, setAy] = useState('AY 2026-27');
  const [amount, setAmount] = useState(taxDueAmount);
  const [step, setStep] = useState<'form' | 'review' | 'success'>('form');
  const [paymentDone, setPaymentDone] = useState<{ challanNo: string; date: string; ref: string } | null>(null);

  // 1. PAN Validation Handler (Must collect & validate PAN without authorizing transactions)
  const handlePanValidate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPan = inputPan.trim().toUpperCase();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      setPanError('Invalid PAN format. Please enter a valid 10-character PAN (e.g. FGHPM6789K).');
      return;
    }
    setPanError('');
    setPanValidated(true);
  };

  // 2. Proceed to Login Requirement for Pre-login Transactional Service
  const handleProceedToAuthenticate = () => {
    triggerLoginModal();
  };

  // 3. Form Review Trigger
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    setStep('review');
  };

  // 4. Explicit Final Confirmation Handler
  const handleFinalPaymentConfirm = () => {
    recordTaxPayment(amount, paymentType);
    const mockChallan = 'CRN-2627-' + Math.floor(100000 + Math.random() * 900000);
    const mockRef = 'MOCK-PAY-826104';
    setPaymentDone({
      challanNo: mockChallan,
      ref: mockRef,
      date: new Date().toLocaleString(),
    });
    setStep('success');
    confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: e-Pay Tax Workflow Card */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#0b2341] to-slate-900 text-white p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-purple-300 font-bold uppercase tracking-wider">Canonical Service #3</div>
              <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                <CreditCard size={22} className="text-purple-400" />
                e-Pay Tax Online
              </h2>
              <p className="text-xs text-slate-300">Generate Challan ITNS 280 for Self-Assessment & Advance Tax payments.</p>
            </div>
            {!isGuest && (
              <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-xs text-amber-400 font-semibold">
                PAN: {taxpayer.pan}
              </div>
            )}
          </div>

          <div className="p-6">
            
            {/* ANONYMOUS PRE-LOGIN GATE: Collect & Validate PAN First */}
            {isGuest ? (
              <div className="space-y-5 animate-fadeIn">
                {!panValidated ? (
                  <form onSubmit={handlePanValidate} className="space-y-4 max-w-md mx-auto py-4">
                    <div className="text-center space-y-1 mb-4">
                      <h3 className="text-lg font-bold text-slate-900 font-serif">Enter Taxpayer PAN to Begin</h3>
                      <p className="text-xs text-slate-600">Provide Permanent Account Number to check tax payment eligibility.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">PAN (Permanent Account Number)</label>
                      <input
                        type="text"
                        value={inputPan}
                        onChange={(e) => setInputPan(e.target.value.toUpperCase())}
                        placeholder="e.g. FGHPM6789K"
                        maxLength={10}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-mono font-bold text-sm tracking-wider text-slate-900 focus:ring-2 focus:ring-[#004B32]"
                        required
                      />
                      {panError && <p className="text-xs text-red-600 font-semibold mt-1">{panError}</p>}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <span>Validate PAN & Continue</span>
                      <ArrowRight size={15} />
                    </button>
                  </form>
                ) : (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-center max-w-lg mx-auto">
                    <div className="inline-flex p-3 bg-amber-100 rounded-full text-amber-800 mb-1">
                      <Lock size={32} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold uppercase">
                        PAN Validated: {inputPan}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 font-serif mt-2">Authentication Required to Complete Payment</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Entering PAN identifies your tax account, but does not authorize tax payments. Log in as <strong>{inputPan}</strong> to load your active tax calculation ledger.
                      </p>
                    </div>

                    <button
                      onClick={handleProceedToAuthenticate}
                      className="w-full bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck size={16} />
                      <span>Authenticate & Access Tax Account →</span>
                    </button>
                  </div>
                )}
              </div>
            ) : isPaidInHistory || paymentDone ? (
              /* COMPLETED PAYMENT READ-ONLY STATE */
              <div className="text-center py-8 space-y-4 animate-fadeIn bg-[#FAF7F2] border border-emerald-200 rounded-2xl p-6">
                <div className="inline-flex p-3 bg-emerald-100 rounded-full text-[#004B32] mb-1">
                  <CheckCircle2 size={48} />
                </div>

                <h3 className="text-2xl font-black text-slate-900 font-serif">Tax Payment Completed</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Self-assessment tax payment for PAN <strong className="font-mono text-slate-900">{taxpayer.pan}</strong> ({ay}) has been recorded and verified. Your tax liability balance is <strong className="font-bold text-[#004B32]">₹0</strong>.
                </p>

                <div className="p-4 bg-white border border-slate-200 rounded-xl inline-block text-left max-w-md w-full font-mono text-xs space-y-1.5 shadow-sm">
                  <div className="flex justify-between border-b pb-1 text-slate-500 font-sans font-bold">
                    <span>Official Tax Challan Status</span>
                    <span className="text-[#004B32]">PAID & VERIFIED ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Minor Head:</span>
                    <span className="font-bold text-slate-900">{paymentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Challan Reference:</span>
                    <span className="font-bold text-slate-900">{paymentDone?.challanNo || 'CRN-2627-826104'}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1.5 font-bold">
                    <span className="text-slate-500 font-sans">Balance Tax Due:</span>
                    <span className="text-[#004B32]">₹0</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigateToService('file-itr')}
                    className="bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md inline-flex items-center gap-1.5"
                  >
                    <FileText size={14} />
                    <span>Return to ITR & Complete Final Submission →</span>
                  </button>
                </div>
              </div>
            ) : !isTaxDue ? (
              /* NO TAX CURRENTLY PAYABLE STATE */
              <div className="text-center py-8 space-y-4 animate-fadeIn bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <div className="inline-flex p-3 bg-emerald-100 rounded-full text-[#004B32] mb-1">
                  <CheckCircle2 size={44} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">No Tax Currently Payable</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Based on current pre-filled records for PAN <strong className="font-mono text-slate-900">{taxpayer.pan}</strong> ({ay}), total prepaid TDS credits cover your calculated tax liability. No self-assessment tax payment is required.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => navigateToService('file-itr')}
                    className="bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-md inline-flex items-center gap-1.5"
                  >
                    <FileText size={14} />
                    <span>Proceed to File Return →</span>
                  </button>
                </div>
              </div>
            ) : step === 'form' ? (
              /* AUTHENTICATED PAYMENT FORM & ELIGIBILITY VALIDATION */
              <form onSubmit={handleProceedToReview} className="space-y-5 animate-fadeIn">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-900">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-amber-700" />
                    <span>Outstanding Self-Assessment Tax Payable Identified</span>
                  </div>
                  <div>
                    Tax computation for AY 2026-27 requires a payment of <strong className="font-mono text-amber-950 font-bold">₹{taxDueAmount.toLocaleString('en-IN')}</strong> to achieve zero balance due.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#1E3A2B] mb-1">Permanent Account Number (PAN)</label>
                    <input
                      type="text"
                      value={taxpayer.pan}
                      disabled
                      className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2.5 font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1E3A2B] mb-1">Assessment Year</label>
                    <select
                      value={ay}
                      onChange={(e) => setAy(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-800"
                    >
                      <option value="AY 2026-27">AY 2026-27</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#1E3A2B] mb-1">Type of Payment (Minor Head)</label>
                    <select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-800"
                    >
                      <option value="Self-Assessment Tax (300)">Self-Assessment Tax (300)</option>
                      <option value="Advance Tax (100)">Advance Tax (100)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#1E3A2B] mb-1">Tax Amount to Pay (₹)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono font-bold text-base text-slate-900"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs py-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Review Payment Details →</span>
                </button>
              </form>
            ) : (
              /* EXPLICIT PAYMENT REVIEW & CONFIRMATION STEP */
              <div className="space-y-5 animate-fadeIn">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs text-[#004B32]">
                  <div className="font-bold">Review Challan ITNS 280 Before Final Submission</div>
                  <div>Please verify the tax head, assessment year, and amount before issuing authorization.</div>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs font-mono">
                  <div className="flex justify-between border-b pb-1 font-sans font-bold text-slate-700">
                    <span>Taxpayer Name:</span>
                    <span className="text-slate-900">{taxpayer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">PAN:</span>
                    <span className="font-bold text-slate-900">{taxpayer.pan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Assessment Year:</span>
                    <span className="font-bold text-slate-900">{ay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Payment Minor Head:</span>
                    <span className="font-bold text-slate-900">{paymentType}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-sm">
                    <span className="text-slate-700 font-sans">Total Payment Authorization:</span>
                    <span className="text-[#004B32]">₹{amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="w-1/3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-3 rounded-xl transition"
                  >
                    Edit Details
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalPaymentConfirm}
                    className="w-2/3 bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs py-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck size={16} />
                    <span>Explicit Confirm & Issue Challan</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Guidance Drawer */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          <OfficialServiceGuideDrawer
            serviceName="e-Pay Tax Service"
            whoShouldUse={[
              'Taxpayers with balance tax payable before submitting ITR',
              'Taxpayers paying Advance Tax installments quarterly',
            ]}
            whyChooseThis={[
              'Direct integration with authorized net banking and UPI payment gateways',
              'Generates official Challan ITNS 280 with BSR code for ITR claim',
            ]}
            keyRules={[
              'Self-assessment tax under Minor Head 300 must be paid prior to ITR filing',
            ]}
            officialDocRef="incometax.gov.in/ePayTax-Guide-2026"
          />
        </div>

      </div>
    </div>
  );
};
