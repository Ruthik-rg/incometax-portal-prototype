import React from 'react';
import { Building2, Globe, Heart, Shield, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pt-10 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 font-black text-white text-base mb-3">
            <Building2 size={18} className="text-emerald-400" />
            <span>Income Tax Portal</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            National Income Tax e-Filing Portal Prototype built for <strong>Build What Moves India</strong> Hackathon.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">Canonical Services</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>File Income Tax Return</li>
            <li>e-Verify Return</li>
            <li>e-Pay Tax Online</li>
            <li>AIS / TIS Statement</li>
            <li>Form 26AS Tax Credits</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">Public Utilities</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>Old vs New Tax Calculator</li>
            <li>Download Official Utility Forms</li>
            <li>Tax Calendar & Deadlines</li>
            <li>Link Aadhaar to PAN</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">Help & Support</h4>
          <p className="text-[11px] text-slate-400">Toll-Free Helpline: 1800 103 0025</p>
          <p className="text-[11px] text-slate-400 mt-1">Working Hours: Mon-Fri 9:00 AM - 6:00 PM</p>
          <div className="mt-4 p-2 bg-slate-900 border border-slate-800 rounded text-[10px] text-amber-300">
            Synthetic Mock Prototype • No Real Government Integration Implied.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 mt-8 pt-4 flex flex-wrap justify-between items-center text-[11px] text-slate-500">
        <div>© 2026 Income Tax e-Filing Portal Prototype. All Rights Reserved.</div>
        <div>Built for Hackathon Demo</div>
      </div>
    </footer>
  );
};
