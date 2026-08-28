import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { ShieldCheck, CheckCircle2, KeyRound, Building, Smartphone, ArrowRight, Search, FileText, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OfficialServiceGuideDrawer } from './OfficialServiceGuideDrawer';

export const EVerifyWorkflow: React.FC = () => {
  const { taxpayer, activeTaxpayerId, verifyReturn, navigateToService, triggerLoginModal } = useApp();
  
  // Anonymous / Pre-login stage state
  const isGuest = activeTaxpayerId === 'guest';
  const [inputPan, setInputPan] = useState('');
  const [panValidated, setPanValidated] = useState(false);
  const [panError, setPanError] = useState('');

  // Active Return derived from single source of truth
  const activeReturn = taxpayer.returns['AY2026-27'];
  const isAlreadyVerified = activeReturn?.verificationStatus === 'verified' || activeReturn?.status === 'verified';
  const isSubmitted = activeReturn?.status === 'submitted' || activeReturn?.status === 'verified';
  const pan = taxpayer.pan;
  const ay = activeReturn?.ay || 'AY 2026-27';
  const ackNo = activeReturn?.acknowledgementNo || 'MOCK-ITR-2627-00427';

  // Form & Verification states
  const [selectedMethod, setSelectedMethod] = useState<'aadhaar' | 'evc' | 'netbank'>('aadhaar');
  const [otp, setOtp] = useState('482913'); // Official Mock OTP
  const [step, setStep] = useState<'select' | 'review' | 'success'>('select');
  const [verifiedAck, setVerifiedAck] = useState<string | null>(null);

  // 1. PAN Validation Handler
  const handlePanValidate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPan = inputPan.trim().toUpperCase();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      setPanError('Invalid PAN format. Please enter a valid 10-character PAN (e.g. AABCP1234A).');
      return;
    }
    setPanError('');
    setPanValidated(true);
  };

  // 2. Intent-preserving Login Trigger
  const handleProceedToAuthenticate = () => {
    triggerLoginModal();
  };

  // 3. Review Trigger
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };

  // 4. Explicit Verification Handler
  const handleFinalVerifyConfirm = () => {
    verifyReturn(ay);
    const evrNo = 'EVR-2627-' + Math.floor(100000 + Math.random() * 900000);
    setVerifiedAck(evrNo);
    setStep('success');
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: e-Verification Workflow Card */}
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
                      <h3 className="text-lg font-bold text-slate-900 font-serif">Enter PAN to Locate Pending Return</h3>
                      <p className="text-xs text-slate-600">Provide Permanent Account Number to check e-Verification status.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">PAN (Permanent Account Number)</label>
                      <input
                        type="text"
                        value={inputPan}
                        onChange={(e) => setInputPan(e.target.value.toUpperCase())}
                        placeholder="e.g. AABCP1234A"
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
                      <span>Validate PAN & Locate Return</span>
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
                      <h3 className="text-lg font-bold text-slate-900 font-serif mt-2">Authentication Required to e-Verify</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Entering PAN identifies your filing record, but does not authorize e-Verification. Log in as <strong>{inputPan}</strong> to access your pending return acknowledgement.
                      </p>
                    </div>

                    <button
                      onClick={handleProceedToAuthenticate}
                      className="w-full bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck size={16} />
                      <span>Authenticate & Access Pending Return →</span>
                    </button>
                  </div>
                )}
              </div>
            ) : isAlreadyVerified || step === 'success' ? (
              /* ALREADY VERIFIED STATE */
              <div className="text-center py-8 space-y-4 animate-fadeIn bg-[#FAF7F2] border border-emerald-200 rounded-2xl p-6">
                <div className="inline-flex p-3 bg-emerald-100 rounded-full text-[#004B32] mb-1">
                  <CheckCircle2 size={48} />
                </div>

                <h3 className="text-2xl font-black text-slate-900 font-serif">Return Already e-Verified</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your return for PAN <strong className="font-mono text-slate-900">{pan}</strong> ({ay}) with Ack No <strong className="font-mono text-slate-900">{ackNo}</strong> has been digitally verified in CBDT records.
                </p>

                <div className="p-4 bg-white border border-slate-200 rounded-xl inline-block text-left max-w-md w-full font-mono text-xs space-y-1.5 shadow-sm">
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
            ) : !isSubmitted ? (
              /* UN-SUBMITTED RETURN GATE */
              <div className="text-center py-8 space-y-4 animate-fadeIn bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <div className="inline-flex p-3 bg-amber-100 rounded-full text-amber-800 mb-1">
                  <Lock size={44} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">No Pending Return to e-Verify</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  You must submit your ITR-1 return for AY 2026-27 before e-verification can be initiated.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => navigateToService('file-itr')}
                    className="bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-md inline-flex items-center gap-1.5"
                  >
                    <FileText size={14} />
                    <span>Go to File ITR Return →</span>
                  </button>
                </div>
              </div>
            ) : step === 'select' ? (
              /* SELECTION FORM */
              <form onSubmit={handleProceedToReview} className="space-y-6 animate-fadeIn">
                <div className="p-4 bg-[#FAF7F2] border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-[#1E3A2B] uppercase">Pending Return Identified</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono">
                    <div><span className="text-slate-500 font-sans">PAN:</span> <strong className="text-slate-900">{pan}</strong></div>
                    <div><span className="text-slate-500 font-sans">AY:</span> <strong className="text-slate-900">{ay}</strong></div>
                    <div><span className="text-slate-500 font-sans">Ack No:</span> <strong className="text-slate-900">{ackNo}</strong></div>
                  </div>
                </div>

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
                  <span>Review & Confirm e-Verification →</span>
                </button>
              </form>
            ) : (
              /* EXPLICIT REVIEW & VERIFICATION CONFIRMATION STEP */
              <div className="space-y-5 animate-fadeIn">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs text-[#004B32]">
                  <div className="font-bold">Review e-Verification Declaration</div>
                  <div>Please review your return acknowledgement and verification method before final sign-off.</div>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs font-mono">
                  <div className="flex justify-between border-b pb-1 font-sans font-bold text-slate-700">
                    <span>Taxpayer Name:</span>
                    <span className="text-slate-900">{taxpayer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">PAN:</span>
                    <span className="font-bold text-slate-900">{pan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Assessment Year:</span>
                    <span className="font-bold text-slate-900">{ay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Acknowledgement No:</span>
                    <span className="font-bold text-slate-900">{ackNo}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold font-sans">
                    <span className="text-slate-700">Verification Mode:</span>
                    <span className="text-[#004B32] font-mono">Aadhaar OTP ({otp})</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep('select')}
                    className="w-1/3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-3 rounded-xl transition"
                  >
                    Edit Details
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalVerifyConfirm}
                    className="w-2/3 bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs py-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck size={16} />
                    <span>Explicit Confirm & Sign Return</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Guidance Drawer */}
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
