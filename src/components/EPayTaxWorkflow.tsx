import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { CreditCard, CheckCircle2, Receipt, ArrowRight, ShieldCheck, Search, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OfficialServiceGuideDrawer } from './OfficialServiceGuideDrawer';

export const EPayTaxWorkflow: React.FC = () => {
  const { recordTaxPayment, taxpayer, navigateToService } = useApp();
  
  // Calculate if there's self-assessment tax due from taxpayer ecosystem
  const return2026 = taxpayer.returns['AY2026-27'];
  const isPaidInHistory = taxpayer.actionHistory.some((a) => a.serviceId === 'e-pay-tax');
  const taxDueAmount = return2026?.refundOrTaxDue < 0 ? Math.abs(return2026.refundOrTaxDue) : 20800;

  const [paymentType, setPaymentType] = useState('Self-Assessment Tax (300)');
  const [ay, setAy] = useState('AY 2026-27');
  const [amount, setAmount] = useState(taxDueAmount);
  const [pan, setPan] = useState(taxpayer.pan);
  const [paymentDone, setPaymentDone] = useState<{ challanNo: string; date: string; ref: string } | null>(null);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    recordTaxPayment(amount, paymentType);
    const mockChallan = 'CRN-2627-' + Math.floor(100000 + Math.random() * 900000);
    const mockRef = 'MOCK-PAY-826104';
    setPaymentDone({
      challanNo: mockChallan,
      ref: mockRef,
      date: new Date().toLocaleString(),
    });
    confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: e-Pay Tax Form */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#0b2341] to-slate-900 text-white p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-purple-300 font-bold uppercase tracking-wider">Canonical Service #3</div>
              <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                <CreditCard size={22} className="text-purple-400" />
                e-Pay Tax Online
              </h2>
              <p className="text-xs text-slate-300">Generate Challan ITNS 280 for Self-Assessment Tax payment.</p>
            </div>
            <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-xs text-amber-400 font-semibold">
              PAN: {taxpayer.pan}
            </div>
          </div>

          <div className="p-6">
            {isPaidInHistory || paymentDone ? (
              <div className="text-center py-8 space-y-4 animate-fadeIn bg-[#FAF7F2] border border-emerald-200 rounded-2xl p-6">
                <div className="inline-flex p-3 bg-emerald-100 rounded-full text-[#004B32] mb-1">
                  <CheckCircle2 size={48} />
                </div>

                <h3 className="text-2xl font-black text-slate-900 font-serif">Tax Payment Already Completed</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Self-assessment tax payment for PAN <strong className="font-mono text-slate-900">{pan}</strong> ({ay}) has been recorded and verified. Your tax liability balance is <strong className="font-bold text-[#004B32]">₹0</strong>.
                </p>

                <div className="p-4 bg-white border border-slate-200 rounded-xl inline-block text-left max-w-md w-full font-mono text-xs space-y-1.5">
                  <div className="flex justify-between border-b pb-1 text-slate-500 font-sans font-bold">
                    <span>Official Tax Challan Status</span>
                    <span className="text-[#004B32]">PAID & VERIFIED ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Minor Head:</span>
                    <span className="font-bold text-slate-900">Self-Assessment Tax (300)</span>
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
            ) : (
              <form onSubmit={handlePay} className="space-y-5 animate-fadeIn">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-900">
                  <div className="font-bold">Outstanding Tax Payment Identified</div>
                  <div>Your AY 2026-27 calculation requires a self-assessment tax payment of <strong className="font-mono text-amber-950 font-bold">₹{amount.toLocaleString('en-IN')}</strong> to achieve zero balance payable.</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#1E3A2B] mb-1">Permanent Account Number (PAN)</label>
                    <input
                      type="text"
                      value={pan}
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
                  <CreditCard size={16} />
                  <span>Generate Challan & Complete Tax Payment</span>
                </button>
              </form>
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
