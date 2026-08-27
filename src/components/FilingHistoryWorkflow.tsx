import React from 'react';
import { useApp } from '../AppContext';
import { History, Download, ShieldCheck, FileText, Eye, Printer } from 'lucide-react';
import { generateMockPdfBlob } from '../pdfGenerator';
import { OfficialServiceGuideDrawer } from './OfficialServiceGuideDrawer';

export const FilingHistoryWorkflow: React.FC = () => {
  const { taxpayer, navigateToService } = useApp();

  const returnsList = Object.values(taxpayer.returns);

  const handleViewPdf = (ret: typeof returnsList[0]) => {
    generateMockPdfBlob(
      `ITR-V Verification Acknowledgement (${ret.itrForm})`,
      `Assessment Year: ${ret.ay} • Acknowledgement No: ${ret.acknowledgementNo || 'MOCK-ACK-0427'}`,
      [
        { label: 'Taxpayer Name', value: taxpayer.name },
        { label: 'PAN Number', value: taxpayer.pan },
        { label: 'ITR Form Type', value: ret.itrForm },
        { label: 'Assessment Year', value: ret.ay },
        { label: 'Financial Year', value: ret.fy },
        { label: 'Filing Date', value: ret.submittedDate || '24-Jul-2025' },
        { label: 'Acknowledgement Number', value: ret.acknowledgementNo || 'Pending Submission' },
        { label: 'Verification Status', value: ret.verificationStatus.toUpperCase() },
        { label: 'Gross Income Reported', value: `₹${ret.grossIncome.toLocaleString('en-IN')}` },
        { label: 'Refund / Tax Ledger Result', value: ret.refundOrTaxDue > 0 ? `Refund ₹${ret.refundOrTaxDue.toLocaleString('en-IN')}` : 'Nil' },
      ]
    );
  };

  return (
    <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Filing History List */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#0b2341] to-slate-900 text-white p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-300 font-bold uppercase tracking-wider">Canonical Service #9</div>
              <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                <History size={22} className="text-emerald-400" />
                Filing History & Official ITR-V Statements
              </h2>
              <p className="text-xs text-slate-300">Access return history across assessment years, track processing status & print ITR-V receipts.</p>
            </div>
            <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-xs text-amber-400 font-semibold">
              PAN: {taxpayer.pan}
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-3">
              {returnsList.map((ret) => (
                <div
                  key={ret.id}
                  className="p-4 bg-[#FAF7F2] border border-slate-200/90 rounded-2xl flex flex-wrap items-center justify-between gap-4 hover:border-[#004B32] transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="bg-[#004B32] text-amber-300 font-bold text-xs px-2.5 py-0.5 rounded-full font-mono">
                        {ret.ay}
                      </span>
                      <span className="font-extrabold text-xs text-[#1E3A2B]">{ret.itrForm}</span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                          ret.verificationStatus === 'verified'
                            ? 'bg-emerald-100 text-[#004B32]'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {ret.verificationStatus}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 font-mono">
                      Ack No: <strong className="text-slate-900">{ret.acknowledgementNo || 'Draft - Unsubmitted'}</strong> • Filed: {ret.submittedDate || 'Pending'}
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Gross Income: <strong className="text-slate-800 font-mono">₹{ret.grossIncome.toLocaleString('en-IN')}</strong> | 
                      Calculated Refund: <strong className="text-[#004B32] font-mono">₹{(ret.refundOrTaxDue || 0).toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewPdf(ret)}
                      className="bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Printer size={13} />
                      <span>View / Print ITR-V</span>
                    </button>

                    {ret.verificationStatus === 'pending' && (
                      <button
                        onClick={() => navigateToService('e-verify')}
                        className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                      >
                        <ShieldCheck size={13} />
                        <span>e-Verify Return</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Guidance Drawer */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          <OfficialServiceGuideDrawer
            serviceName="Filing History & Compliance Records"
            whoShouldUse={[
              'Taxpayers accessing official ITR-V acknowledgement receipts for loans & visas',
              'Taxpayers reviewing historical return submissions across financial years',
            ]}
            whyChooseThis={[
              'Official repository of digitally submitted tax returns',
              'Provides instant PDF generation and printing of verified ITR-V receipts',
            ]}
            keyRules={[
              'Returns filed without e-Verification must be verified within 30 days or sent to CPC Bengaluru',
            ]}
            officialDocRef="incometax.gov.in/FilingHistory-Guide-2026"
          />
        </div>

      </div>
    </div>
  );
};
