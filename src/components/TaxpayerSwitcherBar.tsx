import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { TAXPAYERS } from '../mockData';
import type { TaxpayerId } from '../types';
import { UserCheck, RefreshCw, AlertCircle } from 'lucide-react';

export const TaxpayerSwitcherBar: React.FC = () => {
  const { activeTaxpayerId, switchTaxpayer, resetTaxpayerScenario, taxpayer, pendingLoginServiceId } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800 flex flex-wrap items-center justify-between shadow-inner">
      <div className="flex items-center space-x-3">
        <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
          Hackathon Demo Controls
        </span>
        <span className="text-slate-300 hidden sm:inline">Active Scenario:</span>
        <span className="font-semibold text-amber-300 flex items-center gap-1">
          {taxpayer.name} ({taxpayer.pan}) — <span className="font-normal text-slate-300">{taxpayer.statusTag}</span>
        </span>
      </div>

      <div className="flex items-center space-x-2 mt-1 sm:mt-0">
        {pendingLoginServiceId && (
          <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800 animate-pulse">
            <AlertCircle size={12} />
            <span>Preserved Intent: Direct access after login!</span>
          </div>
        )}

        <button
          onClick={() => resetTaxpayerScenario()}
          title="Reset current persona back to initial un-filed demo state"
          className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-2.5 py-1 rounded font-semibold transition flex items-center gap-1"
        >
          <RefreshCw size={12} />
          <span>Reset Persona Demo</span>
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1 rounded font-medium transition flex items-center gap-1.5"
        >
          <UserCheck size={13} className="text-emerald-400" />
          <span>Switch Taxpayer Scenario ({Object.keys(TAXPAYERS).length})</span>
        </button>
      </div>

      {isOpen && (
        <div className="w-full mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
          {(Object.keys(TAXPAYERS) as TaxpayerId[]).map((id) => {
            const world = TAXPAYERS[id];
            const isActive = activeTaxpayerId === id;
            return (
              <button
                key={id}
                onClick={() => {
                  switchTaxpayer(id);
                  setIsOpen(false);
                }}
                className={`p-2.5 rounded text-left border transition flex flex-col justify-between ${
                  isActive
                    ? 'bg-emerald-950/80 border-emerald-500 text-white ring-1 ring-emerald-500'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-amber-200 flex items-center justify-between">
                    <span>{world.name}</span>
                    <span className="text-[9px] uppercase font-mono text-slate-400">{world.pan}</span>
                  </div>
                  <div className="text-[10px] text-slate-300 font-medium mt-1 leading-snug">
                    {world.statusTag}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
