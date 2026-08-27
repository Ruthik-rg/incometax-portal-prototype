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
// 1. FLAGSHIP TAXPAYER: PRIYA SHAH (The Normal Filer)
// -------------------------------------------------------------
const priyaGross = 1224000;
const priyaTaxResultNew = computeTaxAY2026(priyaGross, 0, 'new'); 
const priyaTDS = 105000; 
const priyaCalculatedRefund = Math.max(0, priyaTDS - priyaTaxResultNew.finalTaxPayable);

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
  statusTag: '👩 Priya — The Normal Filer (Salary → ITR → e-Verify → Refund)',
  scenarioDescription: 'Salaried software engineer in Bengaluru. Preferred New Tax Regime with ₹12.24L gross income, pre-filled return draft 80% complete, ₹1.05L TDS paid, and pending submission/e-verification.',

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
        id: 'AIS-01',
        category: 'Salary Information (Sec 192)',
        informationCode: 'SAL-192',
        sourceName: 'ABC Technologies Pvt. Ltd.',
        amount: 1200000,
        tdsAmount: 105000,
        date: '31-Mar-2026',
      },
      {
        id: 'AIS-02',
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
// 2. FIRST-TIME TAXPAYER: MALLIKARJUN RAO (Self-Assessment Tax Payable)
// -------------------------------------------------------------
const mallikarjunGross = 1425000;
const mallikarjunTaxResult = computeTaxAY2026(mallikarjunGross, 0, 'new'); 
// Math Check for Mallikarjun (AY 2026-27 New Regime):
// Taxable Income = 14,25,000 - 75,000 = 13,50,000
// 0-4L @ 0%: 0
// 4L-8L @ 5%: 20,000
// 8L-12L @ 10%: 40,000
// 12L-13.5L @ 15%: 22,500
// Base Tax = 82,500
// Cess 4% = 3,300
// Total Tax Liability = 85,800
// TDS Paid by Employer (Bharat Digital Solutions) = 65,000
// Self-Assessment Tax Payable = 85,800 - 65,000 = 20,800!

const mallikarjunTDS = 65000;
const mallikarjunTaxPayable = mallikarjunTaxResult.finalTaxPayable - mallikarjunTDS; // Exactly ₹20,800!

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

  // First-time filer has NO historical returns
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
      computedTax: mallikarjunTaxResult.finalTaxPayable, // ₹85,800
      tdsClaimed: mallikarjunTDS, // ₹65,000
      refundOrTaxDue: -mallikarjunTaxPayable, // -₹20,800 (Tax Due)
    },
  },

  refund: undefined, // First-time filer with tax due has no refund record

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
  malikarjun: MALLIKARJUN_RAO,
};

// Default Pre-login Guest State
export const GUEST_TAXPAYER: TaxpayerProfile = {
  ...FLAGSHIP_PRIYA_SHAH,
  id: 'guest',
  name: 'Guest User (Unauthenticated)',
  pan: 'PRE-LOGIN-GUEST',
  aadhaar: 'XXXX XXXX 0000',
  statusTag: 'Guest / Unauthenticated Mode',
  scenarioDescription: 'Guest user exploring public services. Protected services trigger the Centralized Access Control Gate.',
};
