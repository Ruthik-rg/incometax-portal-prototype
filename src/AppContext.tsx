import React, { createContext, useContext, useState, useEffect } from 'react';
import type { TaxpayerId, TaxpayerProfile, CanonicalServiceId, PublicUtilityId } from './types';
import { TAXPAYERS, GUEST_TAXPAYER, CANONICAL_SERVICES } from './mockData';

interface AppContextType {
  activeTaxpayerId: TaxpayerId;
  taxpayer: TaxpayerProfile;
  switchTaxpayer: (id: TaxpayerId) => void;
  resetTaxpayerScenario: (id?: TaxpayerId) => void;
  activeView: {
    type: 'home' | 'service' | 'utility' | 'login-gate';
    id?: CanonicalServiceId | PublicUtilityId;
  };
  navigateToService: (serviceId: CanonicalServiceId) => void;
  navigateToUtility: (utilityId: PublicUtilityId) => void;
  navigateToHome: () => void;
  pendingLoginServiceId: CanonicalServiceId | null;
  loginWithPreservedIntent: (targetTaxpayer: TaxpayerId) => void;
  cancelLoginGate: () => void;
  // Stateful Ecosystem Mutations
  submitItrDraft: () => string; // Returns generated Ack No
  verifyReturn: (ay: string) => void;
  validateBankAndReissue: (bankName: string) => void;
  submitNoticeResponse: (explanation: string) => void;
  recordTaxPayment: (amount: number, type: string) => void;
  linkAadhaarSuccess: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [taxpayerWorlds, setTaxpayerWorlds] = useState<Record<string, TaxpayerProfile>>(() => {
    return TAXPAYERS; // Always load pristine TAXPAYERS from single source of truth for fresh hackathon demo
  });

  // Default to Guest mode for pre-login security demonstration
  const [activeTaxpayerId, setActiveTaxpayerId] = useState<TaxpayerId>('guest');
  const [activeView, setActiveView] = useState<{
    type: 'home' | 'service' | 'utility' | 'login-gate';
    id?: CanonicalServiceId | PublicUtilityId;
  }>({ type: 'home' });

  const [pendingLoginServiceId, setPendingLoginServiceId] = useState<CanonicalServiceId | null>(null);

  const taxpayer = activeTaxpayerId === 'guest' ? GUEST_TAXPAYER : (taxpayerWorlds[activeTaxpayerId] || TAXPAYERS[activeTaxpayerId] || TAXPAYERS.priya);

  const resetTaxpayerScenario = (id?: TaxpayerId) => {
    const targetId = id || activeTaxpayerId;
    if (targetId !== 'guest' && TAXPAYERS[targetId]) {
      setTaxpayerWorlds((prev) => ({
        ...prev,
        [targetId]: JSON.parse(JSON.stringify(TAXPAYERS[targetId])),
      }));
    } else {
      setTaxpayerWorlds(JSON.parse(JSON.stringify(TAXPAYERS)));
    }
  };

  const switchTaxpayer = (id: TaxpayerId) => {
    // Reset targeted persona back to pristine initial demo state upon login/switch
    if (id !== 'guest' && TAXPAYERS[id]) {
      setTaxpayerWorlds((prev) => ({
        ...prev,
        [id]: JSON.parse(JSON.stringify(TAXPAYERS[id])),
      }));
    }
    setActiveTaxpayerId(id);
    if (pendingLoginServiceId && id !== 'guest') {
      setActiveView({ type: 'service', id: pendingLoginServiceId });
      setPendingLoginServiceId(null);
    }
  };

  const navigateToService = (serviceId: CanonicalServiceId) => {
    const meta = CANONICAL_SERVICES[serviceId];
    if (meta.preLoginAccess === 'login-required' && activeTaxpayerId === 'guest') {
      setPendingLoginServiceId(serviceId);
      setActiveView({ type: 'login-gate', id: serviceId });
      return;
    }
    setActiveView({ type: 'service', id: serviceId });
  };

  const loginWithPreservedIntent = (targetTaxpayer: TaxpayerId) => {
    // Reset target persona state to pristine demo state upon logging in
    if (targetTaxpayer !== 'guest' && TAXPAYERS[targetTaxpayer]) {
      setTaxpayerWorlds((prev) => ({
        ...prev,
        [targetTaxpayer]: JSON.parse(JSON.stringify(TAXPAYERS[targetTaxpayer])),
      }));
    }
    const targetService = pendingLoginServiceId;
    setActiveTaxpayerId(targetTaxpayer);
    if (targetService) {
      setActiveView({ type: 'service', id: targetService });
      setPendingLoginServiceId(null);
    } else {
      setActiveView({ type: 'home' });
    }
  };

  const cancelLoginGate = () => {
    setPendingLoginServiceId(null);
    setActiveView({ type: 'home' });
  };

  const navigateToUtility = (utilityId: PublicUtilityId) => {
    setActiveView({ type: 'utility', id: utilityId });
  };

  const navigateToHome = () => {
    setActiveView({ type: 'home' });
  };

  // Dynamic Ecosystem Mutators
  const recordTaxPayment = (amount: number, type: string) => {
    setTaxpayerWorlds((prev) => {
      if (activeTaxpayerId === 'guest') return prev;
      const current = { ...(prev[activeTaxpayerId] || TAXPAYERS[activeTaxpayerId]) };

      // Mutate refundOrTaxDue in return record when self-assessment tax is paid!
      const currentReturn = current.returns['AY2026-27'];
      if (currentReturn && currentReturn.refundOrTaxDue < 0) {
        const newBalance = currentReturn.refundOrTaxDue + amount; // -20800 + 20800 = 0
        current.returns['AY2026-27'] = {
          ...currentReturn,
          refundOrTaxDue: newBalance,
        };
      }

      current.actionHistory = [
        { id: Date.now().toString(), title: `${type} Paid: ₹${amount.toLocaleString('en-IN')}`, timestamp: 'Just now', badge: 'Payment Success', serviceId: 'e-pay-tax' },
        ...current.actionHistory,
      ];
      current.notifications = [
        { id: Date.now().toString(), title: 'Challan Receipt Generated', description: `Paid ₹${amount.toLocaleString('en-IN')} under ${type}. Challan BSR Code: 000293.`, timestamp: 'Just now', read: false, serviceId: 'e-pay-tax' },
        ...current.notifications,
      ];
      return { ...prev, [activeTaxpayerId]: current };
    });
  };

  const submitItrDraft = (): string => {
    const mockAck = 'MOCK-ITR-2627-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    setTaxpayerWorlds((prev) => {
      if (activeTaxpayerId === 'guest') return prev;
      const current = { ...(prev[activeTaxpayerId] || TAXPAYERS[activeTaxpayerId]) };

      const currentReturn = current.returns['AY2026-27'] || {
        id: 'RET-2026-01',
        ay: 'AY 2026-27',
        fy: 'FY 2025-26',
        itrForm: 'ITR-1 (Sahaj)',
        status: 'submitted',
        verificationStatus: 'pending',
        grossIncome: current.income.grossTotalIncome,
        deductions: current.deductions.totalDeductions,
        taxableIncome: current.income.grossTotalIncome - 75000,
        computedTax: 189150,
        tdsClaimed: current.form26as.totalTDS,
        refundOrTaxDue: 0,
      };

      current.returns['AY2026-27'] = {
        ...currentReturn,
        status: 'submitted',
        verificationStatus: 'pending',
        acknowledgementNo: mockAck,
        submittedDate: now,
      };

      current.actionHistory = [
        {
          id: Date.now().toString(),
          title: `ITR-1 Return Submitted for AY 2026-27 (Ack: ${mockAck})`,
          timestamp: 'Just now',
          badge: 'Submitted',
          serviceId: 'file-itr',
        },
        ...current.actionHistory,
      ];

      current.notifications = [
        {
          id: Date.now().toString(),
          title: 'Return Submitted Successfully',
          description: `Your ITR-1 for AY 2026-27 has been submitted with Ack No: ${mockAck}. e-Verification is pending.`,
          timestamp: 'Just now',
          read: false,
          serviceId: 'e-verify',
        },
        ...current.notifications,
      ];

      return { ...prev, [activeTaxpayerId]: current };
    });

    return mockAck;
  };

  const verifyReturn = (ay: string) => {
    const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    setTaxpayerWorlds((prev) => {
      if (activeTaxpayerId === 'guest') return prev;
      const current = { ...(prev[activeTaxpayerId] || TAXPAYERS[activeTaxpayerId]) };

      const key = ay.replace(' ', ''); // e.g. "AY2026-27"
      if (current.returns[key]) {
        current.returns[key] = {
          ...current.returns[key],
          status: 'verified',
          verificationStatus: 'verified',
          verifiedDate: now,
        };
      }

      if (current.refund) {
        current.refund.status = 'processing';
        current.refund.timeline = current.refund.timeline.map((t) => {
          if (t.stage === 'Return Filed') return { ...t, date: current.returns[key]?.submittedDate || now, status: 'completed' };
          if (t.stage === 'Return Verified') return { ...t, date: now, status: 'completed' };
          if (t.stage === 'Return Processed by CPC') return { ...t, date: 'In Progress', status: 'active' };
          return t;
        });
      }

      current.actionHistory = [
        {
          id: Date.now().toString(),
          title: `Return e-Verified for ${ay} via Aadhaar OTP`,
          timestamp: 'Just now',
          badge: 'e-Verified',
          serviceId: 'e-verify',
        },
        ...current.actionHistory,
      ];

      current.notifications = [
        {
          id: Date.now().toString(),
          title: 'Return e-Verified Successfully',
          description: `Your return for ${ay} has been digitally e-Verified using Aadhaar OTP (Ref: 482913).`,
          timestamp: 'Just now',
          read: false,
          serviceId: 'filing-history',
        },
        ...current.notifications,
      ];

      return { ...prev, [activeTaxpayerId]: current };
    });
  };

  const validateBankAndReissue = (bankName: string) => {
    setTaxpayerWorlds((prev) => {
      if (activeTaxpayerId === 'guest') return prev;
      const current = { ...(prev[activeTaxpayerId] || TAXPAYERS[activeTaxpayerId]) };
      if (current.refund) {
        current.refund = {
          ...current.refund,
          status: 'reissue-requested',
        };
      }
      current.actionHistory = [
        { id: Date.now().toString(), title: 'Bank Validated & Reissue Requested', timestamp: 'Just now', badge: 'Reissue Sent', serviceId: 'refund-status' },
        ...current.actionHistory,
      ];
      current.notifications = [
        { id: Date.now().toString(), title: 'Refund Reissue Request Dispatched', description: `Refund of ₹${current.refund?.amount.toLocaleString('en-IN')} dispatched to ${bankName}.`, timestamp: 'Just now', read: false, serviceId: 'refund-status' },
        ...current.notifications,
      ];
      return { ...prev, [activeTaxpayerId]: current };
    });
  };

  const submitNoticeResponse = (explanation: string) => {
    setTaxpayerWorlds((prev) => {
      if (activeTaxpayerId === 'guest') return prev;
      const current = { ...(prev[activeTaxpayerId] || TAXPAYERS[activeTaxpayerId]) };
      if (current.notice) {
        current.notice.status = 'response-submitted';
        current.notice.explanation = explanation;
      }
      current.actionHistory = [
        { id: Date.now().toString(), title: 'Notice Response Submitted', timestamp: 'Just now', badge: 'Submitted', serviceId: 'respond-notices' },
        ...current.actionHistory,
      ];
      current.notifications = [
        { id: Date.now().toString(), title: 'Response Submitted to Assessing Officer', description: 'Your written response and attached documents were stored with Acknowledgement DIN.', timestamp: 'Just now', read: false, serviceId: 'respond-notices' },
        ...current.notifications,
      ];
      return { ...prev, [activeTaxpayerId]: current };
    });
  };

  const linkAadhaarSuccess = () => {
    setTaxpayerWorlds((prev) => {
      if (activeTaxpayerId === 'guest') return prev;
      const current = { ...(prev[activeTaxpayerId] || TAXPAYERS[activeTaxpayerId]) };
      current.aadhaarStatus.status = 'linked';
      current.aadhaarStatus.linkedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      current.actionHistory = [
        { id: Date.now().toString(), title: 'Aadhaar Linked with PAN', timestamp: 'Just now', badge: 'Linked', serviceId: 'link-aadhaar' },
        ...current.actionHistory,
      ];
      current.notifications = [
        { id: Date.now().toString(), title: 'PAN-Aadhaar Linking Successful', description: 'Your PAN and Aadhaar are linked in tax records.', timestamp: 'Just now', read: false, serviceId: 'link-aadhaar' },
        ...current.notifications,
      ];
      return { ...prev, [activeTaxpayerId]: current };
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTaxpayerId,
        taxpayer,
        switchTaxpayer,
        resetTaxpayerScenario,
        activeView,
        navigateToService,
        navigateToUtility,
        navigateToHome,
        pendingLoginServiceId,
        loginWithPreservedIntent,
        cancelLoginGate,
        submitItrDraft,
        verifyReturn,
        validateBankAndReissue,
        submitNoticeResponse,
        recordTaxPayment,
        linkAadhaarSuccess,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
