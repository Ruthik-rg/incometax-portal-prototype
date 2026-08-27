import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Link, CheckCircle2, ShieldCheck, ArrowRight, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OfficialServiceGuideDrawer } from './OfficialServiceGuideDrawer';

export const LinkAadhaarWorkflow: React.FC = () => {
  const { taxpayer, linkAadhaarSuccess, navigateToService } = useApp();
  const isLinked = taxpayer.aadhaarStatus.status === 'linked';

  const [aadhaarInput, setAadhaarInput] = useState(taxpayer.aadhaar || 'XXXX XXXX 7392');
  const [otpInput, setOtpInput] = useState('739214'); // Synthetic Mock OTP for Mallikarjun
  const [step, setStep] = useState(1);

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    linkAadhaarSuccess();
    setStep(3);
    confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Linkage Status & Action Card */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#0b2341] to-slate-900 text-white p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-violet-300 font-bold uppercase tracking-wider">Canonical Service #8</div>
              <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                <Link size={22} className="text-violet-400" />
                Link Aadhaar with PAN
              </h2>
              <p className="text-xs text-slate-300">Demographic linkage status between PAN and Aadhaar in CBDT records.</p>
            </div>
            <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-xs text-amber-400 font-semibold">
              PAN: {taxpayer.pan}
            </div>
          </div>

          <div className="p-6 space-y-5">
            {isLinked || step === 3 ? (
              <div className="p-6 bg-[#FAF7F2] border-2 border-emerald-500/60 rounded-2xl space-y-4 text-center animate-fadeIn">
                <div className="inline-flex p-3 bg-emerald-100 rounded-full text-[#004B32] mb-1">
                  <CheckCircle2 size={44} />
                </div>

                <h3 className="text-2xl font-black text-slate-900 font-serif">PAN-Aadhaar Linked Successfully!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  CBDT database confirms that PAN <strong className="font-mono text-slate-900">{taxpayer.pan}</strong> is now linked with Aadhaar <strong className="font-mono text-slate-900">{taxpayer.aadhaar}</strong>.
                </p>

                <div className="p-4 bg-white border border-slate-200 rounded-xl max-w-sm mx-auto font-mono text-xs text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">PAN Number:</span>
                    <span className="font-bold text-slate-900">{taxpayer.pan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Aadhaar Number:</span>
                    <span className="font-bold text-slate-900">{taxpayer.aadhaar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Status:</span>
                    <span className="font-bold text-[#004B32] uppercase">Operative & Verified ✓</span>
                  </div>
                </div>

                <button
                  onClick={() => navigateToService('file-itr')}
                  className="bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-md inline-flex items-center gap-1.5"
                >
                  <span>Proceed to File Return Now</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleLinkSubmit} className="space-y-5 animate-fadeIn">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold space-y-1">
                  <div className="font-bold">PAN-Aadhaar Linking Pending</div>
                  <div className="text-[11px] text-amber-800">Your PAN <strong className="font-mono">{taxpayer.pan}</strong> must be linked with Aadhaar to file your return.</div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Permanent Account Number (PAN)</label>
                    <input
                      type="text"
                      value={taxpayer.pan}
                      disabled
                      className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2.5 font-mono font-bold text-xs text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Aadhaar Number (12 Digits)</label>
                    <input
                      type="text"
                      value={aadhaarInput}
                      onChange={(e) => setAadhaarInput(e.target.value)}
                      placeholder="Enter 12-digit Aadhaar"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono font-bold text-xs text-slate-900"
                      required
                    />
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <label className="block text-xs font-bold text-slate-700">Enter 6-digit Aadhaar OTP</label>
                    <input
                      type="text"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="739214"
                      maxLength={6}
                      className="w-full max-w-xs bg-white border border-slate-300 rounded-lg p-2.5 font-mono font-bold text-base text-center tracking-widest text-slate-900"
                      required
                    />
                    <div className="text-[10px] text-slate-500">Demo OTP: <strong className="font-mono text-[#004B32]">739214</strong></div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs py-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck size={16} />
                  <span>Submit & Link Aadhaar</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Guidance Drawer */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          <OfficialServiceGuideDrawer
            serviceName="PAN-Aadhaar Linkage Compliance"
            whoShouldUse={[
              'All individual taxpayers holding valid PAN and Aadhaar',
              'Taxpayers ensuring PAN remains operative for ITR filing & TDS credit',
            ]}
            whyChooseThis={[
              'Mandatory requirement under Section 139AA of Income Tax Act',
              'Prevents PAN from becoming inoperative and incurring higher 20% TDS deduction',
            ]}
            keyRules={[
              'Demographic details (Name, Date of Birth, Gender) must match across PAN and Aadhaar',
            ]}
            officialDocRef="incometax.gov.in/LinkAadhaar-Guide-2026"
          />
        </div>

      </div>
    </div>
  );
};
