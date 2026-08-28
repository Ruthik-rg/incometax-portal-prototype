import React, { useState } from 'react';
import { useApp } from '../AppContext';
import type { NotificationAlert } from '../types';
import { Sparkles, ArrowRight, RefreshCw, AlertCircle, FileText, Bell, ChevronDown, ChevronUp, History, CheckCircle2, ShieldCheck, Link, X, ExternalLink } from 'lucide-react';

export const PostLoginDashboard: React.FC = () => {
  const { taxpayer, navigateToService, markNotificationAsRead } = useApp();

  // State for View More / See Less toggles (Default: 2 items)
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  // State for Notification Detail Modal Popup
  const [selectedNotificationModal, setSelectedNotificationModal] = useState<NotificationAlert | null>(null);

  const displayedActivities = showAllActivities ? taxpayer.actionHistory : taxpayer.actionHistory.slice(0, 2);
  const displayedNotifications = showAllNotifications ? taxpayer.notifications : taxpayer.notifications.slice(0, 2);

  const return2026 = taxpayer.returns['AY2026-27'];
  const isDraft = return2026?.status === 'draft';
  const isSubmitted = return2026?.status === 'submitted';
  const isVerified = return2026?.status === 'verified';
  const isAadhaarLinked = taxpayer.aadhaarStatus.status === 'linked';

  const hasPendingNotice = taxpayer.notice && taxpayer.notice.status === 'action-required';
  const isNoticeResolved = taxpayer.notice && taxpayer.notice.status === 'response-submitted';
  const hasFailedRefund = taxpayer.refund && taxpayer.refund.status === 'failed';
  const isRefundReissued = taxpayer.refund && taxpayer.refund.status === 'reissue-requested';

  // Dynamic values derived directly from active taxpayer profile
  const taxPayableOrRefund = return2026?.refundOrTaxDue || 0;
  const isTaxDue = taxPayableOrRefund < 0;

  return (
    <div className="space-y-6 py-4">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0b2341] via-[#0f4c3a] to-[#0b2341] text-white rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-amber-300 font-extrabold uppercase tracking-wider">Authenticated Citizen Portal</div>
          <h1 className="text-2xl font-black tracking-tight mt-0.5 font-serif">Welcome, {taxpayer.name}</h1>
          <p className="text-xs text-slate-200 mt-1">
            PAN: <span className="font-mono text-amber-300 font-bold">{taxpayer.pan}</span> • Aadhaar: <span className="font-mono text-slate-300">{taxpayer.aadhaar}</span>
          </p>
        </div>
      </div>

      {/* Taxpayer Snapshot Cards & Story Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Action Required Story Card */}
        <div className="lg:col-span-7 bg-white border-2 border-[#004B32] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full border flex items-center gap-1 ${
              hasPendingNotice || hasFailedRefund
                ? 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse'
                : isNoticeResolved || isRefundReissued || isVerified
                ? 'bg-emerald-100 text-[#004B32] border-emerald-300'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}>
              <Sparkles size={13} />
              <span>
                {hasPendingNotice
                  ? 'Action Required: Income Tax Notice Issued'
                  : isNoticeResolved
                  ? 'Notice Response Submitted & Under Review'
                  : hasFailedRefund
                  ? 'Action Required: Refund Credit Failed'
                  : isRefundReissued
                  ? 'Refund Reissue Request Dispatched'
                  : !isAadhaarLinked
                  ? 'Action Required: Link Aadhaar Pending'
                  : isDraft
                  ? 'Action Required: Return Ready to File'
                  : isSubmitted && !isVerified
                  ? 'Action Required: e-Verification Pending'
                  : 'Return Processed & Verified'}
              </span>
            </span>
            <FileText size={20} className="text-[#004B32]" />
          </div>

          <div>
            <h3 className="font-serif font-black text-lg text-slate-900">
              {hasPendingNotice
                ? 'Sec 143(1) Notice Received — Action Required'
                : isNoticeResolved
                ? 'Notice Response Submitted Successfully ✓'
                : hasFailedRefund
                ? 'Refund Credit Failed — Update Bank Account'
                : isRefundReissued
                ? 'Refund Reissue Dispatched to SBI CMP ✓'
                : !isAadhaarLinked
                ? 'Complete PAN-Aadhaar Linkage before filing'
                : isDraft
                ? `Your AY 2026-27 Return is ready to file`
                : isSubmitted && !isVerified
                ? 'Return Submitted — Complete e-Verification'
                : 'AY 2026-27 Return Verified Successfully'}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {hasPendingNotice
                ? `Assessing Officer observed a variance of ₹4.50L in SFT reported income. Respond to Notice ${taxpayer.notice?.din} before ${taxpayer.notice?.dueDate}.`
                : isNoticeResolved
                ? `Your written response for Notice ${taxpayer.notice?.din} has been recorded and submitted to Assessing Officer Ward 12(1).`
                : hasFailedRefund
                ? `Refund of ₹${taxpayer.refund?.amount.toLocaleString('en-IN')} returned by SBI CMP due to invalid bank details. Validate replacement bank to request reissue.`
                : isRefundReissued
                ? `Refund reissue request of ₹${taxpayer.refund?.amount.toLocaleString('en-IN')} has been validated and dispatched to SBI CMP.`
                : !isAadhaarLinked
                ? 'Demographic linking between PAN and Aadhaar is required to submit your return and process tax payments.'
                : isDraft
                ? `Pre-filled with ${taxpayer.salary.employerName} salary (₹${(taxpayer.salary.grossAnnual / 100000).toFixed(2)}L) and bank interest (₹${taxpayer.income.savingsInterest.toLocaleString('en-IN')}). ${isTaxDue ? `Self-assessment tax due: ₹${Math.abs(taxPayableOrRefund).toLocaleString('en-IN')}.` : ''}`
                : isSubmitted && !isVerified
                ? 'Return submitted with Ack No. Verification required within 30 days.'
                : 'Your return has been verified using Aadhaar OTP. CPC processing initiated.'}
            </p>
          </div>

          {/* Stepper Progress Checklist */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-bold">
            <div className="p-2 bg-emerald-100 text-[#004B32] rounded-lg text-center">✓ Salary Info</div>
            <div className="p-2 bg-emerald-100 text-[#004B32] rounded-lg text-center">✓ TDS Matched</div>
            <div className={`p-2 rounded-lg text-center ${isAadhaarLinked ? 'bg-emerald-100 text-[#004B32]' : 'bg-amber-100 text-amber-900 animate-pulse'}`}>
              {isAadhaarLinked ? '✓ Link Aadhaar' : '● Link Aadhaar'}
            </div>
            <div className={`p-2 rounded-lg text-center ${isSubmitted || isVerified ? 'bg-emerald-100 text-[#004B32]' : 'bg-slate-100 text-slate-500'}`}>
              {isSubmitted || isVerified ? '✓ File Return' : '○ File Return'}
            </div>
            <div
              onClick={() => navigateToService('e-verify')}
              className={`p-2 rounded-lg text-center transition cursor-pointer ${
                isVerified
                  ? 'bg-emerald-100 text-[#004B32]'
                  : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse hover:bg-amber-200'
              }`}
              title={!isVerified ? 'Click to complete e-Verification via Aadhaar OTP' : 'Return e-Verified'}
            >
              {isVerified ? '✓ e-Verified' : '● e-Verify Now →'}
            </div>
          </div>

          <button
            onClick={() => navigateToService(
              hasPendingNotice || isNoticeResolved
                ? 'respond-notices'
                : hasFailedRefund || isRefundReissued
                ? 'refund-status'
                : !isAadhaarLinked
                ? 'link-aadhaar'
                : isSubmitted && !isVerified
                ? 'e-verify'
                : isDraft
                ? 'file-itr'
                : 'filing-history'
            )}
            className="w-full bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-md"
          >
            <span>
              {hasPendingNotice
                ? 'View & Respond to Notice u/s 143(1) →'
                : isNoticeResolved
                ? 'View Submitted Notice Response Receipt →'
                : hasFailedRefund
                ? 'Validate Bank & Request Refund Reissue →'
                : isRefundReissued
                ? 'View Dispatched Refund Reissue Status →'
                : !isAadhaarLinked
                ? 'Link Aadhaar Now →'
                : isDraft
                ? 'Start Return & File Now →'
                : isSubmitted && !isVerified
                ? 'Proceed to e-Verify Return →'
                : 'View Filing History & Print ITR-V'}
            </span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Right Column: Tax Snapshot Card */}
        <div className="lg:col-span-5 bg-[#FAF7F2] border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-xs text-[#1E3A2B] uppercase tracking-wider border-b border-slate-200 pb-2">
            {taxpayer.name}'s Financial Tax Snapshot
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <div className="text-slate-500 font-semibold text-[11px]">Gross Total Income</div>
              <div className="text-lg font-black text-slate-900 font-mono mt-0.5">₹{(taxpayer.income.grossTotalIncome / 100000).toFixed(2)}L</div>
              <div className="text-[10px] text-slate-400">Salary + Interest</div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <div className="text-slate-500 font-semibold text-[11px]">TDS Credit (26AS)</div>
              <div className="text-lg font-black text-[#004B32] font-mono mt-0.5">₹{(taxpayer.form26as.totalTDS / 1000).toFixed(0)}K</div>
              <div className="text-[10px] text-slate-400">{taxpayer.salary.employerName ? taxpayer.salary.employerName.split(' ')[0] : 'TDS Credit'}</div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <div className="text-slate-500 font-semibold text-[11px]">{isTaxDue ? 'Self-Assessment Tax Due' : 'Calculated Tax Refund'}</div>
              <div className={`text-base font-black font-mono mt-0.5 ${isTaxDue ? 'text-amber-800' : 'text-[#004B32]'}`}>
                ₹{Math.abs(taxPayableOrRefund).toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-400">{isTaxDue ? 'Payable via e-Pay Tax' : 'Refund via SBI CMP'}</div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <div className="text-slate-500 font-semibold text-[11px]">Compliance Status</div>
              <div className={`text-base font-extrabold mt-0.5 ${
                hasPendingNotice
                  ? 'text-rose-700'
                  : isNoticeResolved || isRefundReissued || isVerified
                  ? 'text-emerald-700'
                  : hasFailedRefund
                  ? 'text-amber-700'
                  : 'text-amber-800'
              }`}>
                {hasPendingNotice
                  ? 'Notice Issued'
                  : isNoticeResolved
                  ? 'Response Submitted ✓'
                  : hasFailedRefund
                  ? 'Refund Failed'
                  : isRefundReissued
                  ? 'Reissue Requested ✓'
                  : isVerified
                  ? 'Verified ✓'
                  : 'Pending Verification'}
              </div>
              <div className="text-[10px] text-slate-400">
                {hasPendingNotice
                  ? 'Response Required'
                  : isNoticeResolved
                  ? 'Under CPC Review'
                  : hasFailedRefund
                  ? 'Reissue Needed'
                  : isRefundReissued
                  ? 'Dispatched to Bank'
                  : isAadhaarLinked
                  ? 'Aadhaar OTP Ready'
                  : 'Aadhaar Link Pending'}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity & Notification History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Recent Taxpayer Activity Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="font-bold text-xs text-[#1E3A2B] uppercase tracking-wider flex items-center gap-1.5">
                <History size={15} className="text-[#004B32]" />
                <span>Recent Taxpayer Activity</span>
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-bold px-2 py-0.5 rounded">
                {taxpayer.actionHistory.length} Recorded
              </span>
            </div>

            <div className="space-y-2.5">
              {displayedActivities.map((act) => (
                <div key={act.id} className="p-3 bg-[#FAF7F2] border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-800">{act.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{act.timestamp}</div>
                  </div>
                  <span className="bg-white text-[#004B32] font-mono font-bold text-[10px] px-2 py-1 rounded border border-slate-200">
                    {act.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {taxpayer.actionHistory.length > 2 && (
            <button
              onClick={() => setShowAllActivities(!showAllActivities)}
              className="pt-2 text-xs font-bold text-[#004B32] hover:underline flex items-center gap-1 self-start"
            >
              <span>{showAllActivities ? 'Show Less' : `View All (${taxpayer.actionHistory.length})`}</span>
              {showAllActivities ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>

        {/* Notifications & System Alerts Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="font-bold text-xs text-[#1E3A2B] uppercase tracking-wider flex items-center gap-1.5">
                <Bell size={15} className="text-[#004B32]" />
                <span>System Notifications</span>
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                {taxpayer.notifications.filter((n) => !n.read).length} Unread
              </span>
            </div>

            <div className="space-y-2.5">
              {displayedNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationAsRead(notif.id);
                    setSelectedNotificationModal(notif);
                  }}
                  className={`p-3 rounded-xl space-y-1 text-xs transition cursor-pointer hover:shadow-md ${
                    !notif.read
                      ? 'bg-amber-100/90 border-2 border-amber-400 shadow-sm ring-1 ring-amber-300'
                      : 'bg-slate-50 border border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5 font-bold text-amber-950">
                      {!notif.read && <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse border border-white shadow-sm"></span>}
                      <span>{notif.title}</span>
                    </div>
                    <span className="text-[9px] text-amber-800 font-mono">{notif.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug line-clamp-2">{notif.description}</p>
                </div>
              ))}
            </div>
          </div>

          {taxpayer.notifications.length > 2 && (
            <button
              onClick={() => setShowAllNotifications(!showAllNotifications)}
              className="pt-2 text-xs font-bold text-[#004B32] hover:underline flex items-center gap-1 self-start"
            >
              <span>{showAllNotifications ? 'Show Less' : `View All (${taxpayer.notifications.length})`}</span>
              {showAllNotifications ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>

      </div>

      {/* Notification Detail Modal Popup */}
      {selectedNotificationModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-fadeIn">
            
            {/* Modal Header */}
            <div className="bg-[#0b2341] text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-[#004B32] rounded-lg">
                  <Bell size={18} className="text-amber-400" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">CBDT Official System Alert</div>
                  <h3 className="text-base font-bold font-serif">{selectedNotificationModal.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotificationModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-500 font-mono border-b pb-2">
                <span>Timestamp: <strong>{selectedNotificationModal.timestamp}</strong></span>
                <span className="bg-emerald-100 text-[#004B32] px-2 py-0.5 rounded font-sans font-bold text-[10px] uppercase">
                  Marked as Read ✓
                </span>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 leading-relaxed font-medium">
                {selectedNotificationModal.description}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 font-mono flex justify-between">
                <span>Associated PAN: <strong>{taxpayer.pan}</strong></span>
                <span>Assessment Year: <strong>AY 2026-27</strong></span>
              </div>

              <div className="pt-2 flex space-x-3">
                {selectedNotificationModal.serviceId && (
                  <button
                    onClick={() => {
                      const srvId = selectedNotificationModal.serviceId!;
                      setSelectedNotificationModal(null);
                      navigateToService(srvId);
                    }}
                    className="flex-1 bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs py-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink size={14} />
                    <span>Proceed to Related Service →</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedNotificationModal(null)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-3 rounded-xl transition"
                >
                  Close Alert
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
