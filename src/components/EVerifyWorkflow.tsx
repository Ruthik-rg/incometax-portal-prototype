import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { ShieldCheck, CheckCircle2, KeyRound, Building, Smartphone, ArrowRight, Search, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OfficialServiceGuideDrawer } from './OfficialServiceGuideDrawer';

export const EVerifyWorkflow: React.FC = () => {
  const { taxpayer, verifyReturn, navigateToService } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<'aadhaar' | 'evc' | 'netbank'>('aadhaar');
  const [otp, setOtp] = useState('482913'); // Official Mock OTP
  const [verifiedAck, setVerifiedAck] = useState<string | null>(null);

  // Active Return derived from single source of truth
  const activeReturn = taxpayer.returns['AY2026-27'];
  const isAlreadyVerified = activeReturn?.verificationStatus === 'verified' || activeReturn?.status === 'verified';
  const pan = taxpayer.pan;
  const ay = activeReturn?.ay || 'AY 2026-27';
  const ackNo = activeReturn?.acknowledgementNo || 'MOCK-ITR-2627-00427';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    verifyReturn(ay);
    const evrNo = 'EVR-2627-' + Math.floor(100000 + Math.random() * 900000);
    setVerifiedAck(evrNo);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: e-Verification Form */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#0b2341] to-slate-900 text-white p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-blue-300 font-bold uppercase tracking-wider">Canonical Service #2</div>
              <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                <ShieldCheck size={22} className="text-blue-400" />
                e-Verify Return
              </h2>
              <p className="text-xs text-slate-300">Instant verification using Aadhaar OTP, EVC, or Net Banking.</p>
            </div>
            <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-xs text-amber-400 font-semibold">
              PAN: {taxpayer.pan}
            </div>
          </div>

          <div className="p-6">
            {isAlreadyVerified || verifiedAck ? (
              <div className="text-center py-8 space-y-4 animate-fadeIn bg-[#FAF7F2] border border-emerald-200 rounded-2xl p-6">
                <div className="inline-flex p-3 bg-emerald-100 rounded-full text-[#004B32] mb-1">
                  <CheckCircle2 size={48} />
                </div>

                <h3 className="text-2xl font-black text-slate-900 font-serif">Return Already e-Verified</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your return for PAN <strong className="font-mono text-slate-900">{pan}</strong> ({ay}) with Ack No <strong className="font-mono text-slate-900">{ackNo}</strong> has been digitally verified in CBDT records. No further action is required.
                </p>

                <div className="p-4 bg-white border border-slate-200 rounded-xl inline-block text-left max-w-md w-full font-mono text-xs space-y-1.5">
                  <div className="text-slate-400 font-bold uppercase font-sans">Verification Status Ledger</div>
                  <div className="text-base font-bold text-[#004B32]">VERIFIED ✓</div>
                  <div className="text-slate-600 font-sans text-xs pt-1">Return is under automated processing at CPC Bengaluru.</div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigateToService('filing-history')}
                    className="bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-md inline-flex items-center gap-1.5"
                  >
                    <FileText size={14} />
                    <span>View Filing History & Print ITR-V</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleVerify} className="space-y-6">
                {/* Pre-filled Return Target Box */}
                <div className="p-4 bg-[#FAF7F2] border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-[#1E3A2B] uppercase">Pending Return for Verification</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono">
                    <div><span className="text-slate-500 font-sans">PAN:</span> <strong className="text-slate-900">{pan}</strong></div>
                    <div><span className="text-slate-500 font-sans">AY:</span> <strong className="text-slate-900">{ay}</strong></div>
                    <div><span className="text-slate-500 font-sans">Ack No:</span> <strong className="text-slate-900">{ackNo}</strong></div>
                  </div>
                </div>

                {/* Verification Method Selection */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#1E3A2B] uppercase tracking-wider">
                    Select Verification Option
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('aadhaar')}
                      className={`p-3 rounded-xl border text-left flex items-start space-x-2 transition ${
                        selectedMethod === 'aadhaar'
                          ? 'border-[#004B32] bg-emerald-50/70 text-[#004B32] font-bold shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Smartphone size={18} className="mt-0.5" />
                      <div>
                        <div className="text-xs">Aadhaar OTP</div>
                        <div className="text-[10px] text-slate-500 font-normal">Registered Mobile ({taxpayer.aadhaar})</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('evc')}
                      className={`p-3 rounded-xl border text-left flex items-start space-x-2 transition ${
                        selectedMethod === 'evc'
                          ? 'border-[#004B32] bg-emerald-50/70 text-[#004B32] font-bold shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <KeyRound size={18} className="mt-0.5" />
                      <div>
                        <div className="text-xs">Generate EVC</div>
                        <div className="text-[10px] text-slate-500 font-normal">Pre-validated Bank Account</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('netbank')}
                      className={`p-3 rounded-xl border text-left flex items-start space-x-2 transition ${
                        selectedMethod === 'netbank'
                          ? 'border-[#004B32] bg-emerald-50/70 text-[#004B32] font-bold shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Building size={18} className="mt-0.5" />
                      <div>
                        <div className="text-xs">Net Banking</div>
                        <div className="text-[10px] text-slate-500 font-normal">Direct Bank Portal Access</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* OTP Input Card */}
                {selectedMethod === 'aadhaar' && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 animate-fadeIn">
                    <label className="block text-xs font-bold text-slate-700">Enter 6-digit Aadhaar OTP</label>
                    <div className="flex space-x-2 max-w-xs">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="482913"
                        maxLength={6}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-center font-mono font-bold text-base tracking-widest text-slate-900"
                        required
                      />
                    </div>
                    <div className="text-[10px] text-slate-500">OTP sent to mobile linked with Aadhaar ({taxpayer.aadhaar}). Demo OTP: <strong className="font-mono text-[#004B32]">482913</strong></div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs py-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck size={16} />
                  <span>Submit & Complete e-Verification</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Official Guidance Drawer */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          <OfficialServiceGuideDrawer
            serviceName="e-Verification Process"
            whoShouldUse={[
              'Taxpayers who filed ITR within the last 30 days',
              'Aadhaar holders with validated mobile numbers',
              'Net Banking account holders with pre-validated bank accounts',
            ]}
            whyChooseThis={[
              'Completes legal filing process — unverified returns are treated as invalid',
              'Eliminates sending physical ITR-V paper copies to CPC Bengaluru',
              'Triggers automated tax processing & refund issuance',
            ]}
            keyRules={[
              'e-Verification must be completed within 30 days of ITR submission',
              'Aadhaar OTP is valid for 10 minutes upon generation',
            ]}
            officialDocRef="incometax.gov.in/eVerify-Guide-2026"
          />
        </div>

      </div>
    </div>
  );
};
