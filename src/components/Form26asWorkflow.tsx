import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { FileSpreadsheet, Download, Search, CheckCircle } from 'lucide-react';
import { OfficialServiceGuideDrawer } from './OfficialServiceGuideDrawer';

export const Form26asWorkflow: React.FC = () => {
  const { taxpayer } = useApp();
  const [ay, setAy] = useState('2026-27');

  const partA_TDS = taxpayer.form26as.partA_TDS;

  return (
    <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Form 26AS Ledger */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#0b2341] to-slate-900 text-white p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-teal-300 font-bold uppercase tracking-wider">Canonical Service #5</div>
              <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                <FileSpreadsheet size={22} className="text-teal-400" />
                Form 26AS Tax Credit Statement
              </h2>
              <p className="text-xs text-slate-300">Tax Deducted at Source (TDS) ledger for {taxpayer.name} (PAN: {taxpayer.pan}).</p>
            </div>
            <select
              value={ay}
              onChange={(e) => setAy(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-lg px-3 py-1.5"
            >
              <option value="2026-27">AY 2026-27</option>
            </select>
          </div>

          <div className="p-6 space-y-5">
            <div className="p-4 bg-[#FAF7F2] border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#1E3A2B] uppercase">Taxpayer PAN Ledger Record</div>
                <div className="text-sm font-black text-slate-900 mt-0.5">{taxpayer.name} ({taxpayer.pan})</div>
              </div>
              <button className="bg-[#004B32] hover:bg-[#003825] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm">
                <Download size={13} />
                <span>Export Text / PDF</span>
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-xs text-[#1E3A2B] uppercase tracking-wider">PART A: Tax Deducted at Source (TDS)</h3>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#FAF7F2] text-slate-700 uppercase font-bold border-b text-[10px]">
                    <tr>
                      <th className="p-3">TAN</th>
                      <th className="p-3">Deductor Name</th>
                      <th className="p-3">Sec</th>
                      <th className="p-3 text-right">Amount Paid / Credited</th>
                      <th className="p-3 text-right">Total TDS Deposited</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {partA_TDS.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-bold text-slate-800">{t.tan}</td>
                        <td className="p-3 font-semibold text-[#1E3A2B]">{t.deductorName}</td>
                        <td className="p-3 text-slate-500 font-mono">Sec {t.section}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">₹{t.totalIncomePaid.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-700">₹{t.tdsDeposited.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Official Form 26AS Guidelines Drawer */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          <OfficialServiceGuideDrawer
            serviceName="Form 26AS Tax Credit Statement"
            whoShouldUse={[
              'Taxpayers cross-checking TDS deducted by employers & deductors',
              'Taxpayers claiming tax credit for advance tax or self-assessment tax paid',
              'Individual taxpayers verifying TCS (Tax Collected at Source) credits',
            ]}
            whyChooseThis={[
              'Official legal ledger of all tax deposits credited against your PAN',
              'Essential reference before claiming TDS refund in your ITR filing',
              'Eliminates tax mismatches between TDS certificate (Form 16) & portal',
            ]}
            keyRules={[
              'Form 26AS is updated after deductors file quarterly TDS returns (Form 24Q/26Q)',
              'If TDS is missing, contact your employer or deductor to rectify TAN filing',
            ]}
            officialDocRef="incometax.gov.in/Form26AS-Guide-2026"
          />
        </div>

      </div>
    </div>
  );
};
