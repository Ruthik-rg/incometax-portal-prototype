import type { CanonicalServiceMeta, TaxpayerProfile, CalendarEvent } from './types';
import { computeTaxAY2026 } from './taxLogic';

export const CANONICAL_SERVICES: Record<string, CanonicalServiceMeta> = {
  'file-itr': {
    id: 'file-itr',
    title: 'File Income Tax Return',
    shortDesc: 'Prepare, review, submit ITR for AY 2026-27 & proceed to e-Verify.',
    iconName: 'FileText',
    preLoginAccess: 'login-required',
    category: 'Filing',
  },
  'e-verify': {
    id: 'e-verify',
    title: 'e-Verify Return',
    shortDesc: 'Instant verification using Aadhaar OTP, EVC, or Net Banking.',
    iconName: 'ShieldCheck',
    preLoginAccess: 'full',
    category: 'Filing',
  },
  'e-pay-tax': {
    id: 'e-pay-tax',
    title: 'e-Pay Tax',
    shortDesc: 'Pay Advance Tax, Self-Assessment, or Regular Tax online.',
    iconName: 'CreditCard',
    preLoginAccess: 'full',
    category: 'Payments',
  },
  'ais-tis': {
    id: 'ais-tis',
    title: 'AIS / TIS',
    shortDesc: 'Annual Information Statement & Taxpayer Information Summary.',
    iconName: 'BarChart3',
    preLoginAccess: 'login-required',
    category: 'Tax Credits',
  },
  'form-26as': {
    id: 'form-26as',
    title: 'Form 26AS',
    shortDesc: 'View tax deducted/collected at source (TDS/TCS) & tax credits.',
    iconName: 'FileSpreadsheet',
    preLoginAccess: 'login-required',
    category: 'Tax Credits',
  },
  'refund-status': {
    id: 'refund-status',
    title: 'Refund Status',
    shortDesc: 'Track refund status, resolve failed bank validation & request reissue.',
    iconName: 'RefreshCw',
    preLoginAccess: 'login-required',
    category: 'Payments',
  },
  'respond-notices': {
    id: 'respond-notices',
    title: 'Respond to Notices',
    shortDesc: 'View e-Proceedings under Sec 143(1)/148, draft response & submit.',
    iconName: 'AlertCircle',
    preLoginAccess: 'login-required',
    category: 'Compliance',
  },
  'link-aadhaar': {
    id: 'link-aadhaar',
    title: 'Link Aadhaar',
    shortDesc: 'Check PAN-Aadhaar linkage status and request linkage.',
    iconName: 'Link',
    preLoginAccess: 'full',
    category: 'Services',
  },
  'filing-history': {
    id: 'filing-history',
    title: 'Filing History',
    shortDesc: 'View previous year return filing history and download ITR-V PDFs.',
    iconName: 'History',
    preLoginAccess: 'login-required',
    category: 'Filing',
  },
};

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    date: '31',
    day: 'FRIDAY',
    month: 'AUG',
    title: 'ITR Filing Deadline (Non-Audit)',
    description: 'Due date for filing Individual ITR for AY 2026-27 without late fee.',
    urgency: 'high',
    assessmentYear: '2026-27',
    relatedServiceId: 'file-itr',
  },
  {
    id: 'evt-2',
    date: '15',
    day: 'TUESDAY',
    month: 'SEP',
    title: 'Second Installment of Advance Tax',
    description: 'Pay at least 45% of total advance tax liability for FY 2026-27.',
    urgency: 'medium',
    assessmentYear: '2027-28',
    relatedServiceId: 'e-pay-tax',
  },
  {
    id: 'evt-3',
    date: '30',
    day: 'WEDNESDAY',
    month: 'SEP',
    title: 'e-Verification Window Expiry',
    description: 'Complete e-Verification for returns filed in August within 30 days.',
    urgency: 'high',
    assessmentYear: '2026-27',
    relatedServiceId: 'e-verify',
  },
];

// -------------------------------------------------------------
// 1. PRIYA SHAH (Normal Salaried Filer -> Refund Scenario)
// -------------------------------------------------------------
const priyaGross = 1224000;
const priyaTaxResultNew = computeTaxAY2026(priyaGross, 0, 'new'); 
const priyaTDS = 105000; 
const priyaCalculatedRefund = Math.max(0, priyaTDS - priyaTaxResultNew.finalTaxPayable); // ₹47,904

export const FLAGSHIP_PRIYA_SHAH: TaxpayerProfile = {
  id: 'priya',
  name: 'Priya Shah',
  taxpayerType: 'Individual',
  residentialStatus: 'Resident Individual',
  age: 29,
  occupation: 'Software Engineer',
  city: 'Bengaluru, Karnataka',
  ay: 'AY 2026-27',
  fy: 'FY 2025-26',
  pan: 'AABCP1234A',
  aadhaar: 'XXXX XXXX 4821',
  mobile: '98XXXXXX42',
  email: 'priya.shah@example.test',
  statusTag: '👩 Priya — Normal Salaried Filer (Salary → ITR → e-Verify → Refund)',
  scenarioDescription: 'Salaried software engineer in Bengaluru. Salary ₹12.00L + Savings interest ₹24k = ₹12.24L gross income. ₹1.05L TDS paid exceeds ₹57,096 tax liability, resulting in ₹47,904 refund.',

  salary: {
    basicMonthly: 50000,
    hraMonthly: 25000,
    specialAllowanceMonthly: 20000,
    otherAllowanceMonthly: 5000,
    grossMonthly: 100000,
    grossAnnual: 1200000,
    employerName: 'ABC Technologies Pvt. Ltd.',
    employerType: 'Private Company (Technology)',
    industry: 'Software / IT Services',
    officeCity: 'Bengaluru',
    employeeId: 'ABC-SE-0427',
    designation: 'Software Engineer',
    period: 'April 2025 – March 2026',
    employerTan: 'BLRA12345B',
  },

  income: {
    salary: 1200000,
    savingsInterest: 24000,
    fdInterest: 0,
    dividend: 0,
    grossTotalIncome: 1224000,
  },

  deductions: {
    sec80C: 0,
    sec80D: 0,
    sec80CCD1B: 0,
    totalDeductions: 0,
  },

  form16: {
    certificateNo: 'F16-AY2026-ABC-0427',
    employerName: 'ABC Technologies Pvt. Ltd.',
    employerTan: 'BLRA12345B',
    employeeName: 'Priya Shah',
    employeePan: 'AABCP1234A',
    ay: 'AY 2026-27',
    fy: 'FY 2025-26',
    grossSalary: 1200000,
    taxableSalary: 1125000,
    tdsDeducted: 105000,
    certificateStatus: 'Available',
  },

  form26as: {
    ay: 'AY 2026-27',
    fy: 'FY 2025-26',
    pan: 'AABCP1234A',
    partA_TDS: [
      {
        id: '26as-1',
        tan: 'BLRA12345B',
        deductorName: 'ABC Technologies Pvt. Ltd.',
        section: '192',
        totalIncomePaid: 1200000,
        tdsDeposited: 105000,
        quarter: 'Q1-Q4',
      },
    ],
    totalTDS: priyaTDS,
  },

  ais: {
    ay: 'AY 2026-27',
    transactions: [
      {
        id: 'AIS-PRI-01',
        category: 'Salary Information (Sec 192)',
        informationCode: 'SAL-192',
        sourceName: 'ABC Technologies Pvt. Ltd.',
        amount: 1200000,
        tdsAmount: 105000,
        date: '31-Mar-2026',
      },
      {
        id: 'AIS-PRI-02',
        category: 'Savings Bank Interest (Sec 194A)',
        informationCode: 'INT-SB',
        sourceName: 'HDFC Bank - Savings Account',
        amount: 24000,
        tdsAmount: 0,
        date: '31-Mar-2026',
      },
    ],
  },
  tis: {
    salaryIncome: 1200000,
    interestIncome: 24000,
    dividendIncome: 0,
    totalReportedIncome: 1224000,
  },

  bankAccounts: [
    {
      id: 'BANK-PRIYA-01',
      bankName: 'HDFC Bank',
      accountType: 'Savings Account',
      maskedAccount: 'XXXX XXXX 7824',
      ifsc: 'HDFC000MOCK',
      holderName: 'Priya Shah',
      primary: true,
      validationStatus: 'validated',
    },
  ],

  aadhaarStatus: {
    pan: 'AABCP1234A',
    aadhaarMasked: 'XXXX XXXX 4821',
    status: 'linked',
    linkedDate: '15 June 2024',
  },

  returns: {
    'AY2025-26': {
      id: 'RET-2025-01',
      ay: 'AY 2025-26',
      fy: 'FY 2024-25',
      itrForm: 'ITR-1 (Sahaj)',
      status: 'processed',
      verificationStatus: 'verified',
      acknowledgementNo: '394820194821',
      submittedDate: '24-Jul-2025',
      verifiedDate: '24-Jul-2025',
      grossIncome: 1050000,
      deductions: 0,
      taxableIncome: 975000,
      computedTax: 52500,
      tdsClaimed: 52500,
      refundOrTaxDue: 0,
    },
    'AY2026-27': {
      id: 'RET-2026-01',
      ay: 'AY 2026-27',
      fy: 'FY 2025-26',
      itrForm: 'ITR-1 (Sahaj)',
      status: 'draft',
      verificationStatus: 'pending',
      grossIncome: 1224000,
      deductions: 0,
      taxableIncome: 1149000,
      computedTax: priyaTaxResultNew.finalTaxPayable,
      tdsClaimed: priyaTDS,
      refundOrTaxDue: priyaCalculatedRefund,
    },
  },

  refund: {
    ay: 'AY 2026-27',
    refundId: 'REF-AY2627-0427',
    amount: priyaCalculatedRefund,
    status: 'processing',
    primaryBankId: 'BANK-PRIYA-01',
    timeline: [
      { stage: 'Return Filed', date: 'Pending Submission', status: 'pending' },
      { stage: 'Return Verified', date: 'Pending Verification', status: 'pending' },
      { stage: 'Return Processed by CPC', date: 'Awaiting Processing', status: 'pending' },
      { stage: 'Refund Issued to SBI CMP', date: 'Awaiting Issuance', status: 'pending' },
      { stage: 'Refund Credited to HDFC Bank (XXXX 7824)', date: 'Awaiting Credit', status: 'pending' },
    ],
  },

  actionHistory: [
    {
      id: 'act-1',
      title: 'ITR-1 Return Draft Saved (80% Complete)',
      timestamp: 'Today, 10:30 AM',
      badge: 'Draft Saved',
      serviceId: 'file-itr',
    },
    {
      id: 'act-2',
      title: 'Form 26AS Tax Credits Auto-Reconciled',
      timestamp: 'Yesterday, 04:15 PM',
      badge: 'TDS Matched',
      serviceId: 'form-26as',
    },
  ],

  notifications: [
    {
      id: 'notif-1',
      title: 'AY 2026-27 Return Ready to File',
      description: 'Your pre-filled ITR-1 draft is 80% complete with ABC Technologies salary data. Submit & e-Verify now.',
      timestamp: '1 hour ago',
      read: false,
      serviceId: 'file-itr',
    },
  ],
};

// -------------------------------------------------------------
// 2. RIYA NAIR (Failed Refund Scenario -> Bank Reissue)
// -------------------------------------------------------------
const riyaGross = 1140000; // Salary 10.8L + Savings 18k + FD 42k
const riyaTaxResult = computeTaxAY2026(riyaGross, 0, 'new'); // Taxable 10.65L -> Tax 46,500
const riyaTotalTDS = 124200; // Salary TDS 1.20L + FD TDS 4,200
const riyaRefund = Math.max(0, riyaTotalTDS - riyaTaxResult.finalTaxPayable); // ₹77,700

export const RIYA_NAIR: TaxpayerProfile = {
  id: 'riya',
  name: 'Riya Nair',
  taxpayerType: 'Individual',
  residentialStatus: 'Resident Individual',
  age: 31,
  occupation: 'Marketing Lead',
  city: 'Mumbai, Maharashtra',
  ay: 'AY 2026-27',
  fy: 'FY 2025-26',
  pan: 'ABCDE9876F',
  aadhaar: 'XXXX XXXX 1928',
  mobile: '98XXXXXX88',
  email: 'riya.nair@example.test',
  statusTag: '👩 Riya — Failed Refund Scenario (Filed → Refund Failed → Validate Replacement Bank → Reissue)',
  scenarioDescription: 'Marketing lead in Mumbai. Filed AY 2026-27 return claiming ₹77,700 refund. CPC issued refund but SBI CMP returned it due to closed primary bank account. Requires bank validation & reissue request.',

  salary: {
    basicMonthly: 45000,
    hraMonthly: 22500,
    specialAllowanceMonthly: 17500,
    otherAllowanceMonthly: 5000,
    grossMonthly: 90000,
    grossAnnual: 1080000,
    employerName: 'Global Brand Media Ltd.',
    employerType: 'Private Company (Media)',
    industry: 'Advertising & Marketing',
    officeCity: 'Mumbai',
    employeeId: 'GBM-RN-1928',
    designation: 'Marketing Lead',
    period: 'April 2025 – March 2026',
    employerTan: 'MUMG98765A',
  },

  income: {
    salary: 1080000,
    savingsInterest: 18000,
    fdInterest: 42000,
    dividend: 0,
    grossTotalIncome: 1140000,
  },

  deductions: {
    sec80C: 0,
    sec80D: 0,
    sec80CCD1B: 0,
    totalDeductions: 0,
  },

  form16: {
    certificateNo: 'F16-AY2026-GBM-1928',
    employerName: 'Global Brand Media Ltd.',
    employerTan: 'MUMG98765A',
    employeeName: 'Riya Nair',
    employeePan: 'ABCDE9876F',
    ay: 'AY 2026-27',
    fy: 'FY 2025-26',
    grossSalary: 1080000,
    taxableSalary: 1005000,
    tdsDeducted: 120000,
    certificateStatus: 'Available',
  },

  form26as: {
    ay: 'AY 2026-27',
    fy: 'FY 2025-26',
    pan: 'ABCDE9876F',
    partA_TDS: [
      {
        id: '26as-riya-1',
        tan: 'MUMG98765A',
        deductorName: 'Global Brand Media Ltd.',
        section: '192',
        totalIncomePaid: 1080000,
        tdsDeposited: 120000,
        quarter: 'Q1-Q4',
      },
      {
        id: '26as-riya-2',
        tan: 'MUMB12345C',
        deductorName: 'Axis Bank Ltd.',
        section: '194A',
        totalIncomePaid: 42000,
        tdsDeposited: 4200,
        quarter: 'Q4',
      },
    ],
    totalTDS: riyaTotalTDS,
  },

  ais: {
    ay: 'AY 2026-27',
    transactions: [
      {
        id: 'AIS-RIY-01',
        category: 'Salary Information (Sec 192)',
        informationCode: 'SAL-192',
        sourceName: 'Global Brand Media Ltd.',
        amount: 1080000,
        tdsAmount: 120000,
        date: '31-Mar-2026',
      },
      {
        id: 'AIS-RIY-02',
        category: 'Savings Bank Interest (Sec 194A)',
        informationCode: 'INT-SB',
        sourceName: 'Old Legacy Bank - Savings Account',
        amount: 18000,
        tdsAmount: 0,
        date: '31-Mar-2026',
      },
      {
        id: 'AIS-RIY-03',
        category: 'Fixed Deposit Interest (Sec 194A)',
        informationCode: 'INT-FD',
        sourceName: 'Axis Bank - FD Account',
        amount: 42000,
        tdsAmount: 4200,
        date: '31-Mar-2026',
      },
    ],
  },

  tis: {
    salaryIncome: 1080000,
    interestIncome: 60000,
    dividendIncome: 0,
    totalReportedIncome: 1140000,
  },

  bankAccounts: [
    {
      id: 'BANK-RIYA-PRIMARY',
      bankName: 'Old Legacy Bank',
      accountType: 'Savings Account',
      maskedAccount: 'XXXX XXXX 1102',
      ifsc: 'OLGB000MOCK',
      holderName: 'Riya Nair',
      primary: true,
      validationStatus: 'failed',
    },
    {
      id: 'BANK-RIYA-REPLACEMENT',
      bankName: 'Axis Bank',
      accountType: 'Savings Account',
      maskedAccount: 'XXXX XXXX 9948',
      ifsc: 'UTIB000MOCK',
      holderName: 'Riya Nair',
      primary: false,
      validationStatus: 'unvalidated',
    },
  ],

  aadhaarStatus: {
    pan: 'ABCDE9876F',
    aadhaarMasked: 'XXXX XXXX 1928',
    status: 'linked',
    linkedDate: '10 January 2023',
  },

  returns: {
    'AY2026-27': {
      id: 'RET-2026-RIYA',
      ay: 'AY 2026-27',
      fy: 'FY 2025-26',
      itrForm: 'ITR-1 (Sahaj)',
      status: 'processed',
      verificationStatus: 'verified',
      acknowledgementNo: '883920194827',
      submittedDate: '10-Jul-2026',
      verifiedDate: '10-Jul-2026',
      grossIncome: 1140000,
      deductions: 0,
      taxableIncome: 1065000,
      computedTax: riyaTaxResult.finalTaxPayable,
      tdsClaimed: riyaTotalTDS,
      refundOrTaxDue: riyaRefund,
    },
  },

  refund: {
    ay: 'AY 2026-27',
    refundId: 'REF-AY2627-RIYA-8839',
    amount: riyaRefund,
    status: 'failed',
    failureReason: 'SBI CMP transaction rejected: Account Closed / Invalid IFSC for Old Legacy Bank (XXXX 1102).',
    primaryBankId: 'BANK-RIYA-PRIMARY',
    replacementBankId: 'BANK-RIYA-REPLACEMENT',
    timeline: [
      { stage: 'Return Filed & Verified', date: '10-Jul-2026', status: 'completed' },
      { stage: 'Return Processed by CPC', date: '25-Jul-2026', status: 'completed' },
      { stage: 'Refund Issued to SBI CMP', date: '01-Aug-2026', status: 'completed' },
      { stage: 'Bank Credit Transfer', date: '02-Aug-2026 (FAILED)', status: 'active' },
      { stage: 'Refund Reissue Request', date: 'Action Required', status: 'pending' },
    ],
  },

  actionHistory: [
    {
      id: 'act-riy-1',
      title: 'Refund Credit Failed Notification Received',
      timestamp: '02-Aug-2026',
      badge: 'Action Required',
      serviceId: 'refund-status',
    },
  ],

  notifications: [
    {
      id: 'notif-riy-1',
      title: 'Refund Reissue Action Required',
      description: 'Your refund of ₹77,700 for AY 2026-27 failed due to account validation error. Validate Axis Bank & request reissue now.',
      timestamp: 'Yesterday',
      read: false,
      serviceId: 'refund-status',
    },
  ],
};

// -------------------------------------------------------------
// 3. KARAN MEHTA (Compliance / Notice Scenario)
// -------------------------------------------------------------
const karanGross = 1892000; // Professional Receipts 18.6L + Savings Interest 32k
const karanTaxResult = computeTaxAY2026(karanGross, 0, 'new'); // Taxable 18.17L -> Tax 2,05,100
const karanTDS = 186000;

export const KARAN_MEHTA: TaxpayerProfile = {
  id: 'karan',
  name: 'Karan Mehta',
  taxpayerType: 'Individual (Professional)',
  residentialStatus: 'Resident Individual',
  age: 35,
  occupation: 'Independent IT Consultant',
  city: 'Delhi NCR',
  ay: 'AY 2026-27',
  fy: 'FY 2025-26',
  pan: 'KLMNO5432P',
  aadhaar: 'XXXX XXXX 9931',
  mobile: '98XXXXXX55',
  email: 'karan.consulting@example.test',
  statusTag: '👨 Karan — Compliance Scenario (Sec 143(1) Notice → e-Proceedings → Respond → Submit)',
  scenarioDescription: 'IT consultant in Delhi NCR. Filed ITR-3 reporting ₹18.92L business receipts. Received Sec 143(1) notice regarding SFT high-value transaction mismatch of ₹4.50L. Action required before 15-Sep-2026 deadline.',

  salary: {
    basicMonthly: 0,
    hraMonthly: 0,
    specialAllowanceMonthly: 0,
    otherAllowanceMonthly: 0,
    grossMonthly: 0,
    grossAnnual: 0,
    employerName: 'Self-Employed / Independent Consultant',
    employerType: 'Professional Practice',
    industry: 'IT Consulting',
    officeCity: 'Delhi NCR',
    employeeId: 'PROP-KM-5432',
    designation: 'Principal Consultant',
    period: 'April 2025 – March 2026',
    employerTan: 'N/A',
  },

  income: {
    salary: 0,
    savingsInterest: 32000,
    fdInterest: 0,
    dividend: 0,
    grossTotalIncome: 1892000,
  },

  deductions: {
    sec80C: 0,
    sec80D: 0,
    sec80CCD1B: 0,
    totalDeductions: 0,
  },

  form16: {
    certificateNo: 'N/A (Professional Income)',
    employerName: 'N/A',
    employerTan: 'N/A',
    employeeName: 'Karan Mehta',
    employeePan: 'KLMNO5432P',
    ay: 'AY 2026-27',
    fy: 'FY 2025-26',
    grossSalary: 0,
    taxableSalary: 0,
    tdsDeducted: 0,
    certificateStatus: 'Pending',
  },

  form26as: {
    ay: 'AY 2026-27',
    fy: 'FY 2025-26',
    pan: 'KLMNO5432P',
    partA_TDS: [
      {
        id: '26as-kar-1',
        tan: 'DELC12345K',
        deductorName: 'Enterprise Cloud Systems Ltd.',
        section: '194J',
        totalIncomePaid: 1860000,
        tdsDeposited: 186000,
        quarter: 'Q1-Q4',
      },
    ],
    totalTDS: karanTDS,
  },

  ais: {
    ay: 'AY 2026-27',
    transactions: [
      {
        id: 'AIS-KAR-01',
        category: 'Professional Fees (Sec 194J)',
        informationCode: 'PRO-194J',
        sourceName: 'Enterprise Cloud Systems Ltd.',
        amount: 1860000,
        tdsAmount: 186000,
        date: '31-Mar-2026',
      },
      {
        id: 'AIS-KAR-02',
        category: 'Savings Bank Interest (Sec 194A)',
        informationCode: 'INT-SB',
        sourceName: 'Kotak Mahindra Bank',
        amount: 32000,
        tdsAmount: 0,
        date: '31-Mar-2026',
      },
      {
        id: 'AIS-KAR-03',
        category: 'High-Value SFT Financial Transaction (SFT-005)',
        informationCode: 'SFT-005',
        sourceName: 'Kotak Mahindra Bank - Securities Transfer',
        amount: 450000,
        tdsAmount: 0,
        date: '15-Jan-2026',
      },
    ],
  },

  tis: {
    salaryIncome: 0,
    interestIncome: 32000,
    dividendIncome: 0,
    totalReportedIncome: 1892000,
  },

  bankAccounts: [
    {
      id: 'BANK-KARAN-01',
      bankName: 'Kotak Mahindra Bank',
      accountType: 'Current Account',
      maskedAccount: 'XXXX XXXX 4410',
      ifsc: 'KKBK000MOCK',
      holderName: 'Karan Mehta',
      primary: true,
      validationStatus: 'validated',
    },
  ],

  aadhaarStatus: {
    pan: 'KLMNO5432P',
    aadhaarMasked: 'XXXX XXXX 9931',
    status: 'linked',
    linkedDate: '12 August 2022',
  },

  returns: {
    'AY2026-27': {
      id: 'RET-2026-KAR',
      ay: 'AY 2026-27',
      fy: 'FY 2025-26',
      itrForm: 'ITR-3',
      status: 'submitted',
      verificationStatus: 'verified',
      acknowledgementNo: '992019482012',
      submittedDate: '01-Aug-2026',
      verifiedDate: '01-Aug-2026',
      grossIncome: 1892000,
      deductions: 0,
      taxableIncome: 1817000,
      computedTax: karanTaxResult.finalTaxPayable,
      tdsClaimed: karanTDS,
      refundOrTaxDue: karanTaxResult.finalTaxPayable - karanTDS,
    },
  },

  notice: {
    noticeId: 'NOT-2026-1431-094',
    din: 'ITBA/AST/S/143(1)/2026-27/105942',
    section: '143(1)(a) Proposed Adjustment',
    ay: 'AY 2026-27',
    issuedDate: '12-Aug-2026',
    dueDate: '15-Sep-2026',
    status: 'action-required',
    summary: 'Assessing Officer observed a variance of ₹4,50,000 between SFT-005 Reported Securities Receipt and Gross Business Income in ITR-3.',
    amount: 450000,
  },

  refund: undefined,

  actionHistory: [
    {
      id: 'act-kar-1',
      title: 'Notice u/s 143(1)(a) Issued by CPC',
      timestamp: '12-Aug-2026',
      badge: 'Notice Issued',
      serviceId: 'respond-notices',
    },
  ],

  notifications: [
    {
      id: 'notif-kar-1',
      title: 'Compliance Action Required: Sec 143(1) Notice',
      description: 'Response required for Notice ITBA/AST/S/143(1) regarding SFT reconciliation before 15-Sep-2026.',
      timestamp: '2 days ago',
      read: false,
      serviceId: 'respond-notices',
    },
  ],
};

// -------------------------------------------------------------
// 4. MALIKARJUN (First-Time Taxpayer -> Tax Payable Scenario)
// -------------------------------------------------------------
const mallikarjunGross = 1425000;
const mallikarjunTaxResult = computeTaxAY2026(mallikarjunGross, 0, 'new'); 
const mallikarjunTDS = 65000;
const mallikarjunTaxPayable = mallikarjunTaxResult.finalTaxPayable - mallikarjunTDS; // Exactly ₹20,800

export const MALLIKARJUN_RAO: TaxpayerProfile = {
  id: 'malikarjun',
  name: 'Malikarjun',
  taxpayerType: 'Individual',
  residentialStatus: 'Resident Individual',
  age: 27,
  occupation: 'Software Engineer',
  city: 'Bengaluru, Karnataka',
  ay: 'AY 2026-27',
  fy: 'FY 2025-26',
  pan: 'FGHPM6789K',
  aadhaar: 'XXXX XXXX 7392',
  mobile: '97XXXXXX10',
  email: 'm.rao@example.test',
  statusTag: '👨 Malikarjun — First-Time Taxpayer (Link Aadhaar → ITR → e-Pay Tax ₹20.8k → e-Verify)',
  scenarioDescription: 'First-time taxpayer in Bengaluru. Salary ₹14.00L + Interest ₹25k = ₹14.25L gross income. Link Aadhaar pending. Requires ₹20,800 self-assessment tax payment before filing and e-verifying.',

  salary: {
    basicMonthly: 60000,
    hraMonthly: 30000,
    specialAllowanceMonthly: 21667,
    otherAllowanceMonthly: 5000,
    grossMonthly: 116667,
    grossAnnual: 1400000,
    employerName: 'Bharat Digital Solutions Pvt. Ltd.',
    employerType: 'Private Company (Technology)',
    industry: 'Software / Digital Solutions',
    officeCity: 'Bengaluru',
    employeeId: 'BDS-MR-7392',
    designation: 'Software Engineer',
    period: 'April 2025 – March 2026',
    employerTan: 'BLRB98765C',
  },

  income: {
    salary: 1400000,
    savingsInterest: 25000,
    fdInterest: 0,
    dividend: 0,
    grossTotalIncome: 1425000,
  },

  deductions: {
    sec80C: 0,
    sec80D: 0,
    sec80CCD1B: 0,
    totalDeductions: 0,
  },

  form16: {
    certificateNo: 'F16-AY2026-BDS-7392',
    employerName: 'Bharat Digital Solutions Pvt. Ltd.',
    employerTan: 'BLRB98765C',
    employeeName: 'Malikarjun',
    employeePan: 'FGHPM6789K',
    ay: 'AY 2026-27',
    fy: 'FY 2025-26',
    grossSalary: 1400000,
    taxableSalary: 1325000,
    tdsDeducted: 65000,
    certificateStatus: 'Available',
  },

  form26as: {
    ay: 'AY 2026-27',
    fy: 'FY 2025-26',
    pan: 'FGHPM6789K',
    partA_TDS: [
      {
        id: '26as-mal-1',
        tan: 'BLRB98765C',
        deductorName: 'Bharat Digital Solutions Pvt. Ltd.',
        section: '192',
        totalIncomePaid: 1400000,
        tdsDeposited: 65000,
        quarter: 'Q1-Q4',
      },
    ],
    totalTDS: mallikarjunTDS,
  },

  ais: {
    ay: 'AY 2026-27',
    transactions: [
      {
        id: 'AIS-MAL-01',
        category: 'Salary Information (Sec 192)',
        informationCode: 'SAL-192',
        sourceName: 'Bharat Digital Solutions Pvt. Ltd.',
        amount: 1400000,
        tdsAmount: 65000,
        date: '31-Mar-2026',
      },
      {
        id: 'AIS-MAL-02',
        category: 'Savings Bank Interest (Sec 194A)',
        informationCode: 'INT-SB',
        sourceName: 'ICICI Bank - Savings Account',
        amount: 25000,
        tdsAmount: 0,
        date: '31-Mar-2026',
      },
    ],
  },
  tis: {
    salaryIncome: 1400000,
    interestIncome: 25000,
    dividendIncome: 0,
    totalReportedIncome: 1425000,
  },

  bankAccounts: [
    {
      id: 'BANK-MAL-01',
      bankName: 'ICICI Bank',
      accountType: 'Savings Account',
      maskedAccount: 'XXXX XXXX 3920',
      ifsc: 'ICIC000MOCK',
      holderName: 'Malikarjun',
      primary: true,
      validationStatus: 'validated',
    },
  ],

  aadhaarStatus: {
    pan: 'FGHPM6789K',
    aadhaarMasked: 'XXXX XXXX 7392',
    status: 'not-linked',
  },

  returns: {
    'AY2026-27': {
      id: 'RET-2026-MAL',
      ay: 'AY 2026-27',
      fy: 'FY 2025-26',
      itrForm: 'ITR-1 (Sahaj)',
      status: 'draft',
      verificationStatus: 'pending',
      grossIncome: 1425000,
      deductions: 0,
      taxableIncome: 1350000,
      computedTax: mallikarjunTaxResult.finalTaxPayable,
      tdsClaimed: mallikarjunTDS,
      refundOrTaxDue: -mallikarjunTaxPayable, // Negative indicates tax payable balance
    },
  },

  refund: undefined,

  actionHistory: [
    {
      id: 'act-mal-1',
      title: 'First-Time Taxpayer Profile Initialized',
      timestamp: 'Today, 09:00 AM',
      badge: 'Account Ready',
      serviceId: 'file-itr',
    },
    {
      id: 'act-mal-2',
      title: 'Form 26AS TDS & AIS Records Matched',
      timestamp: 'Today, 09:15 AM',
      badge: 'Data Matched',
      serviceId: 'ais-tis',
    },
  ],

  notifications: [
    {
      id: 'notif-mal-1',
      title: 'PAN-Aadhaar Linking Pending',
      description: 'Your PAN FGHPM6789K is not linked with Aadhaar. Link now before filing your return.',
      timestamp: '30 mins ago',
      read: false,
      serviceId: 'link-aadhaar',
    },
    {
      id: 'notif-mal-2',
      title: 'AY 2026-27 Return Ready to File',
      description: 'Pre-filled return initialized with Bharat Digital Solutions salary data. Balance tax payable: ₹20,800.',
      timestamp: '1 hour ago',
      read: false,
      serviceId: 'file-itr',
    },
  ],
};

// Registered Mock Taxpayer Profiles
export const TAXPAYERS: Record<string, TaxpayerProfile> = {
  priya: FLAGSHIP_PRIYA_SHAH,
  riya: RIYA_NAIR,
  karan: KARAN_MEHTA,
  malikarjun: MALLIKARJUN_RAO,
};

// Clean Default Pre-login Guest State (Unauthenticated)
export const GUEST_TAXPAYER: TaxpayerProfile = {
  id: 'guest',
  name: 'Guest User (Unauthenticated)',
  taxpayerType: 'Individual',
  residentialStatus: 'Resident Individual',
  age: 0,
  occupation: 'Public Explorer',
  city: 'India',
  ay: 'AY 2026-27',
  fy: 'FY 2025-26',
  pan: 'PRE-LOGIN-GUEST',
  aadhaar: 'XXXX XXXX 0000',
  mobile: '0000000000',
  email: 'guest@incometax.test',
  statusTag: 'Guest / Unauthenticated Mode',
  scenarioDescription: 'Guest user exploring public services. Transactional services collect & validate PAN before triggering the Authentication Gate.',
  salary: {
    basicMonthly: 0,
    hraMonthly: 0,
    specialAllowanceMonthly: 0,
    otherAllowanceMonthly: 0,
    grossMonthly: 0,
    grossAnnual: 0,
    employerName: 'Unassigned',
    employerType: 'Public',
    industry: 'N/A',
    officeCity: 'N/A',
    employeeId: 'N/A',
    designation: 'N/A',
    period: 'N/A',
    employerTan: 'N/A',
  },
  income: {
    salary: 0,
    savingsInterest: 0,
    fdInterest: 0,
    dividend: 0,
    grossTotalIncome: 0,
  },
  deductions: {
    sec80C: 0,
    sec80D: 0,
    sec80CCD1B: 0,
    totalDeductions: 0,
  },
  form16: {
    certificateNo: 'N/A',
    employerName: 'N/A',
    employerTan: 'N/A',
    employeeName: 'Unauthenticated Guest',
    employeePan: 'PRE-LOGIN-GUEST',
    ay: 'AY 2026-27',
    fy: 'FY 2025-26',
    grossSalary: 0,
    taxableSalary: 0,
    tdsDeducted: 0,
    certificateStatus: 'Pending',
  },
  form26as: {
    ay: 'AY 2026-27',
    fy: 'FY 2025-26',
    pan: 'PRE-LOGIN-GUEST',
    partA_TDS: [],
    totalTDS: 0,
  },
  ais: {
    ay: 'AY 2026-27',
    transactions: [],
  },
  tis: {
    salaryIncome: 0,
    interestIncome: 0,
    dividendIncome: 0,
    totalReportedIncome: 0,
  },
  bankAccounts: [],
  aadhaarStatus: {
    pan: 'PRE-LOGIN-GUEST',
    aadhaarMasked: 'XXXX XXXX 0000',
    status: 'not-linked',
  },
  returns: {},
  refund: undefined,
  actionHistory: [],
  notifications: [],
};
