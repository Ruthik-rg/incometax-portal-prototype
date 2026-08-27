import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { AlertCircle, FileCheck, Upload, Send, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RespondNoticesWorkflow: React.FC = () => {
  const { taxpayer, submitNoticeResponse } = useApp();
  const [responseType, setResponseType] = useState('Agree with addition / Partial acceptance');
  const [writtenResponse, setWrittenResponse] = useState(
    'The variance of ₹45,000 in Form 26AS TDS is due to client reimbursement of travel expenses billed separately under Invoice #INV-2025-99. Attached client Ledger & Bank Statements.'
  );
  const [attachedFiles, setAttachedFiles] = useState<string[]>(['Bank_Statement_FY25.pdf', 'Client_Ledger_Extract.pdf']);
  const [declaration, setDeclaration] = useState(false);
  const [submittedAck, setSubmittedAck] = useState<string | null>(null);

  const notice = taxpayer.notice || {
    noticeId: 'NOT-2026-9921',
    din: 'ITBA/AST/S/143(1)/2026-27/1054321',
    section: '143(1)(a) Discrepancy in Income/TDS',
    ay: '2025-26',
    issuedDate: '10-Aug-2026',
    dueDate: '10-Sep-2026',
    status: 'action-required',
    summary: 'Variance of ₹45,000 detected between Form 26AS TDS credit and ITR-3 business income declared.',
    amount: 14850,
  };

  const isSubmitted = notice.status === 'response-submitted' || !!submittedAck;

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    submitNoticeResponse(writtenResponse);
    const ack = 'ACK-NOTICE-DIN-' + Math.floor(100000000 + Math.random() * 900000000);
    setSubmittedAck(ack);
    confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden my-6">
      <div className="bg-gradient-to-r from-red-900 to-slate-900 text-white p-5 flex items-center justify-between">
        <div>
          <div className="text-xs text-red-300 font-bold uppercase tracking-wider">Canonical Service #7 (Flagship)</div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertCircle size={22} className="text-red-400" />
            e-Proceedings & Notice Response Workflow
          </h2>
          <p className="text-xs text-slate-300">View tax notices under Sec 143(1)/148, attach supporting files & submit response.</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Notice Info Card */}
        <div className="bg-red-50/50 border border-red-200 rounded-xl p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-200 pb-3">
            <div>
              <div className="text-xs text-red-700 font-bold uppercase">Section {notice.section}</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">Document Identification No: {notice.din}</div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                isSubmitted ? 'bg-emerald-100 text-emerald-800' : 'bg-red-600 text-white animate-pulse'
              }`}
            >
              {isSubmitted ? 'Response Submitted' : 'Action Required'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500">Assessment Year:</span>
              <div className="font-bold text-slate-800">{notice.ay}</div>
            </div>
            <div>
              <span className="text-slate-500">Issued Date:</span>
              <div className="font-bold text-slate-800">{notice.issuedDate}</div>
            </div>
            <div>
              <span className="text-slate-500">Response Due Date:</span>
              <div className="font-bold text-red-700">{notice.dueDate}</div>
            </div>
            <div>
              <span className="text-slate-500">Demand / Variance:</span>
              <div className="font-bold text-slate-900">₹{notice.amount.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="text-xs text-slate-700 pt-2 border-t border-red-200/60 leading-relaxed">
            <strong className="text-slate-900">Issue Summary:</strong> {notice.summary}
          </div>
        </div>

        {/* Response Form */}
        {isSubmitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-xl text-center space-y-3 animate-fadeIn">
            <CheckCircle2 size={44} className="text-emerald-600 mx-auto" />
            <h3 className="text-2xl font-black text-slate-900">Notice Response Submitted!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your written response and attached evidence have been logged with the Assessing Officer.
            </p>
            <div className="p-4 bg-white border border-emerald-200 rounded-xl max-w-md mx-auto text-left font-mono text-xs space-y-1">
              <div className="text-slate-400 font-bold uppercase font-sans">Acknowledgement DIN</div>
              <div className="text-base font-bold text-slate-900">{submittedAck || 'ACK-NOTICE-DIN-99382104'}</div>
              <div className="text-emerald-700 font-sans text-xs pt-1">Proceeding Status: Response Under Review</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitResponse} className="space-y-5">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">Submit Official Written Response</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Response Option</label>
              <select
                value={responseType}
                onChange={(e) => setResponseType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-800"
              >
                <option value="Agree with addition / Partial acceptance">Agree with addition / Partial acceptance</option>
                <option value="Disagree with addition in full">Disagree with addition in full</option>
                <option value="Request time extension">Request 15-day time extension</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Written Explanation & Clarification</label>
              <textarea
                value={writtenResponse}
                onChange={(e) => setWrittenResponse(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-800 focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* Mock File Attachment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Attach Supporting Documents (PDF / Excel)</label>
              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setAttachedFiles([...attachedFiles, `Document_${attachedFiles.length + 1}.pdf`])}
                    className="bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1 hover:bg-slate-700"
                  >
                    <Upload size={13} />
                    <span>Attach Mock PDF</span>
                  </button>
                  <span className="text-[11px] text-slate-500">Max size: 5MB per document</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {attachedFiles.map((file, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 px-2.5 py-1 rounded text-xs font-mono text-slate-700 flex items-center gap-1.5">
                      <FileText size={12} className="text-red-600" />
                      <span>{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <label className="flex items-center space-x-2 text-xs font-bold text-slate-900 cursor-pointer">
              <input
                type="checkbox"
                checked={declaration}
                onChange={(e) => setDeclaration(e.target.checked)}
                className="rounded border-slate-300 text-red-600 focus:ring-red-500 h-4 w-4"
                required
              />
              <span>I confirm that the information submitted in response to notice {notice.din} is true & correct.</span>
            </label>

            <button
              type="submit"
              disabled={!declaration}
              className="w-full bg-red-600 hover:bg-red-500 disabled:bg-slate-300 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Send size={16} />
              <span>Submit Response to Assessing Officer</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
