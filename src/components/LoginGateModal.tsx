import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { CANONICAL_SERVICES, TAXPAYERS } from '../mockData';
import type { TaxpayerId, CanonicalServiceId } from '../types';
import { Lock, ArrowRight, ShieldCheck, UserCheck, KeyRound, Sparkles, X } from 'lucide-react';

export const LoginGateModal: React.FC = () => {
  const { pendingLoginServiceId, loginWithPreservedIntent, cancelLoginGate } = useApp();
  const [selectedPersona, setSelectedPersona] = useState<TaxpayerId>('priya');
  const [userPan, setUserPan] = useState(TAXPAYERS.priya.pan);
  const [password, setPassword] = useState('••••••••••••');

  const targetService = pendingLoginServiceId ? CANONICAL_SERVICES[pendingLoginServiceId] : null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithPreservedIntent(selectedPersona);
  };

  const PERSONA_KEYS = Object.keys(TAXPAYERS) as TaxpayerId[];

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* Header Strip */}
        <div className="bg-[#0b2341] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#004B32] rounded-lg">
              <Lock size={18} className="text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Access Control Policy</div>
              <h3 className="text-base font-bold font-serif">Authentication Required</h3>
            </div>
          </div>
          <button onClick={cancelLoginGate} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Intent Preservation Badge */}
          {targetService && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-[#004B32]">
                <Sparkles size={14} className="text-amber-500" />
                <span>Intent Preserved Route</span>
              </div>
              <p className="text-xs text-slate-700">
                You were attempting to access <strong>{targetService.title}</strong>. Logging in will take you directly into this service.
              </p>
            </div>
          )}

          {/* Persona Switcher Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Select Mock Taxpayer Persona to Login</label>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
              {PERSONA_KEYS.map((id) => {
                const p = TAXPAYERS[id];
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPersona(p.id);
                      setUserPan(p.pan);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                      selectedPersona === p.id
                        ? 'border-[#004B32] bg-emerald-50/70 text-[#1E3A2B] ring-2 ring-[#004B32]'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-[#1E3A2B]">{p.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{p.statusTag}</div>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded border">
                      {p.pan}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">User ID / PAN</label>
              <input
                type="text"
                value={userPan}
                onChange={(e) => setUserPan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-bold text-slate-900"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <UserCheck size={16} />
              <span>Login as {TAXPAYERS[selectedPersona]?.name || 'Taxpayer'} & Continue</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
