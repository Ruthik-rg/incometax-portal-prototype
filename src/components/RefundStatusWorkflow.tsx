import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { RefreshCw, AlertTriangle, CheckCircle2, Building, ShieldCheck, ArrowRight, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OfficialServiceGuideDrawer } from './OfficialServiceGuideDrawer';

export const RefundStatusWorkflow: React.FC = () => {
  const { taxpayer, validateBankAndReissue } = useApp();
  const [selectedBank, setSelectedBank] = useState('HDFC Bank (XXXX 7824)');
  const [ifsc, setIfsc] = useState('HDFC000MOCK');
  const [accNo, setAccNo] = useState('501002938411');
  const [isReissued, setIsReissued] = useState(taxpayer.refund?.status === 'reissue-requested');

  const refund = taxpayer.refund || {
    ay: 'AY 2026-27',
    refundId: 'REF-AY2627-0427',
    amount: 24500,
    status: 'processing',
    primaryBankId: 'BANK-PRIYA-01',
    timeline: [
      { stage: 'Return Filed', date: '24-Jul-2026', status: 'completed' },
      { stage: 'Return Verified', date: '24-Jul-2026', status: 'completed' },
      { stage: 'Return Processed by CPC', date: 'In Progress', status: 'active' },
      { stage: 'Refund Issued to SBI CMP', date: 'Awaiting Processing', status: 'pending' },
      { stage: 'Refund Credited to HDFC Bank (XXXX 7824)', date: 'Awaiting Credit', status: 'pending' },
    ],
  };

  const handleValidateAndReissue = (e: React.FormEvent) => {
    e.preventDefault();
    validateBankAndReissue(selectedBank);
    setIsReissued(true);
    confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Refund Timeline & Resolution */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#0b2341] to-slate-900 text-white p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-rose-300 font-bold uppercase tracking-wider">Canonical Service #6</div>
              <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                <RefreshCw size={22} className="text-rose-400" />
                Refund Status & Timeline Tracker
              </h2>
              <p className="text-xs text-slate-300">Track refund progress from return submission to bank account credit.</p>
            </div>
            <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-xs text-amber-400 font-semibold">
              PAN: {taxpayer.pan}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Refund Amount & Status Card */}
            <div className="bg-[#FAF7F2] border border-slate-200 rounded-2xl p-5">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4 border-b border-slate-200 pb-3">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">{refund.ay} Calculated Tax Refund</div>
                  <div className="text-2xl font-black text-[#004B32] font-mono mt-0.5">₹{refund.amount.toLocaleString('en-IN')}</div>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${
                    isReissued
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : refund.status === 'failed'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                      : refund.status === 'credited'
                      ? 'bg-emerald-100 text-[#004B32]'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {isReissued ? 'Reissue Dispatched' : refund.status === 'failed' ? 'Refund Failed' : refund.status === 'credited' ? 'Credited' : 'Processing at CPC'}
                </span>
              </div>

              {/* Bank Account Allocation Info */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building size={16} className="text-[#004B32]" />
                  <div>
                    <span className="font-bold text-[#1E3A2B]">Designated Primary Bank:</span>
                    <span className="text-slate-600 font-mono ml-1.5">
                      {taxpayer.bankAccounts.find((b) => b.primary)?.bankName || 'Primary Bank'} ({taxpayer.bankAccounts.find((b) => b.primary)?.maskedAccount || 'XXXX 7824'})
                    </span>
                  </div>
                </div>
                <span className="bg-emerald-100 text-[#004B32] text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                  {taxpayer.bankAccounts.find((b) => b.primary)?.validationStatus || 'Validated'}
                </span>
              </div>
            </div>

            {/* Stepper Timeline Progression */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs text-[#1E3A2B] uppercase tracking-wider">Refund Lifecycle Progression</h3>

              <div className="space-y-2">
                {refund.timeline.map((stepItem, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition ${
                      stepItem.status === 'completed'
                        ? 'bg-emerald-50/80 border-emerald-200 text-[#004B32]'
                        : stepItem.status === 'active'
                        ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                          stepItem.status === 'completed'
                            ? 'bg-[#004B32] text-white'
                            : stepItem.status === 'active'
                            ? 'bg-amber-600 text-white animate-pulse'
                            : 'bg-slate-300 text-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="font-bold">{stepItem.stage}</span>
                    </div>

                    <div className="flex items-center space-x-2 font-mono text-[11px]">
                      <Clock size={13} className="opacity-60" />
                      <span>{stepItem.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Failed Refund Reissue Resolution Form (For Failed Scenarios) */}
            {refund.status === 'failed' && !isReissued && (
              <div className="space-y-4 border border-rose-200 rounded-xl p-5 bg-rose-50/40 animate-fadeIn">
                <div className="flex items-start space-x-3 text-rose-900">
                  <AlertTriangle size={24} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Why did your refund fail?</h4>
                    <p className="text-xs text-rose-800 mt-1 leading-relaxed">{refund.failureReason}</p>
                  </div>
                </div>

                <form onSubmit={handleValidateAndReissue} className="bg-white p-4 border border-rose-200 rounded-xl space-y-4">
                  <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Building size={16} className="text-emerald-600" />
                    Validate Replacement Bank & Request Refund Reissue
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">IFSC Code</label>
                      <input
                        type="text"
                        value={ifsc}
                        onChange={(e) => setIfsc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase font-bold text-slate-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        value={accNo}
                        onChange={(e) => setAccNo(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-slate-900"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs py-2.5 rounded-lg transition shadow-sm"
                  >
                    Submit Refund Reissue Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Official Guidance Drawer */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          <OfficialServiceGuideDrawer
            serviceName="Refund Processing & Bank Credit"
            whoShouldUse={[
              'Taxpayers with excess TDS or advance tax paid over final liability',
              'Taxpayers tracking refund credit after e-Verification',
              'Taxpayers resolving failed bank account validations',
            ]}
            whyChooseThis={[
              'Direct credit via SBI CMP gateway into validated bank accounts',
              'Automated status updates as return progresses through CPC Bengaluru',
              'Provides refund reissue request facility for failed transactions',
            ]}
            keyRules={[
              'Bank accounts must be pre-validated and PAN-linked for refund credit',
              'Interest on refund under Sec 244A @ 0.5% per month is paid if refund delay exceeds 30 days',
            ]}
            officialDocRef="incometax.gov.in/RefundStatus-Guide-2026"
          />
        </div>

      </div>
    </div>
  );
};
