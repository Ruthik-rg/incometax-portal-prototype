import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { BarChart3, Filter, Download, ArrowUpRight, Search } from 'lucide-react';
import { OfficialServiceGuideDrawer } from './OfficialServiceGuideDrawer';

export const AisTisWorkflow: React.FC = () => {
  const { taxpayer } = useApp();
  const [activeTab, setActiveTab] = useState<'tis' | 'ais'>('ais');
  const [ay, setAy] = useState('2026-27');
  const [searchFilter, setSearchFilter] = useState('');

  const transactions = taxpayer.ais.transactions;

  const filteredTxs = transactions.filter((t) =>
    t.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
    t.sourceName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive AIS/TIS View */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#0b2341] to-slate-900 text-white p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider">Canonical Service #4</div>
              <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                <BarChart3 size={22} className="text-indigo-400" />
                AIS / TIS Annual Information Statement
              </h2>
              <p className="text-xs text-slate-300">Financial transaction records for {taxpayer.name} (PAN: {taxpayer.pan}).</p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={ay}
                onChange={(e) => setAy(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-lg px-3 py-1.5"
              >
                <option value="2026-27">AY 2026-27</option>
              </select>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Toggle Tabs */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('ais')}
                className={`px-4 py-2.5 font-bold text-xs border-b-2 transition ${
                  activeTab === 'ais' ? 'border-[#004B32] text-[#004B32]' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                AIS Transactions (Detailed Records)
              </button>
              <button
                onClick={() => setActiveTab('tis')}
                className={`px-4 py-2.5 font-bold text-xs border-b-2 transition ${
                  activeTab === 'tis' ? 'border-[#004B32] text-[#004B32]' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                TIS Summary (Aggregated Feed)
              </button>
            </div>

            {activeTab === 'ais' ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="relative flex-1 max-w-xs">
                    <input
                      type="text"
                      placeholder="Search deductor or income type..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg py-1.5 pl-8 pr-3 text-xs text-slate-800"
                    />
                    <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
                  </div>

                  <div className="text-xs text-slate-500 font-semibold">
                    Total Reported Income: <span className="font-bold text-[#004B32]">₹{taxpayer.income.grossTotalIncome.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#FAF7F2] text-slate-700 font-bold border-b">
                      <tr>
                        <th className="p-3">Category & Code</th>
                        <th className="p-3">Reporting Entity / Deductor</th>
                        <th className="p-3 text-right">Reported Value (₹)</th>
                        <th className="p-3 text-right">TDS Credits (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTxs.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 font-semibold text-[#1E3A2B]">{t.category}</td>
                          <td className="p-3 text-slate-600 font-mono text-[11px]">{t.sourceName}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">₹{t.amount.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-700">₹{t.tdsAmount.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-[#FAF7F2] border border-slate-200 rounded-xl space-y-3 animate-fadeIn">
                <h4 className="font-bold text-xs text-[#1E3A2B] uppercase tracking-wider">Taxpayer Information Summary (TIS) Rollup</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="text-slate-500 font-medium">Employer Reported Salary Income</div>
                    <div className="font-bold text-base text-slate-900 mt-1">₹{taxpayer.tis.salaryIncome.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-400">ABC Technologies Pvt. Ltd.</div>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="text-slate-500 font-medium">Savings Account Interest</div>
                    <div className="font-bold text-base text-slate-900 mt-1">₹{taxpayer.tis.interestIncome.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-400">HDFC Bank Savings</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Official AIS Guidelines Drawer */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          <OfficialServiceGuideDrawer
            serviceName="AIS / TIS Financial Information"
            whoShouldUse={[
              'Every taxpayer verifying income prior to filing ITR',
              'Taxpayers with multiple bank savings accounts & fixed deposits',
              'Investors earning dividend income or trading mutual funds/stocks',
              'Taxpayers cross-checking TDS credits against Form 16',
            ]}
            whyChooseThis={[
              '360-degree comprehensive summary of all financial transactions (SFT)',
              'Allows taxpayers to submit online feedback on misreported entries',
              'Automatically populates pre-filled income fields in ITR-1 & ITR-2',
              'Prevents Sec 143(1) tax mismatch notices from CBDT processing systems',
            ]}
            keyRules={[
              'TIS aggregates AIS data at source level for seamless filing',
              'If you disagree with any entry, submit feedback in AIS tab before filing',
              'AIS is updated in real-time as banks & deductors file SFT statements',
            ]}
            officialDocRef="incometax.gov.in/AIS-TIS-Guide-2026"
          />
        </div>

      </div>
    </div>
  );
};
