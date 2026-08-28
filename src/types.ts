export type CanonicalServiceId =
  | 'file-itr'
  | 'e-verify'
  | 'e-pay-tax'
  | 'ais-tis'
  | 'form-26as'
  | 'refund-status'
  | 'respond-notices'
  | 'link-aadhaar'
  | 'filing-history';

export type PublicUtilityId = 'tax-calculator' | 'download-forms' | 'tax-calendar';

export type TaxpayerId = 'priya' | 'riya' | 'karan' | 'malikarjun' | 'meera' | 'guest';

// Comprehensive Taxpayer Ecosystem Domain Types
export interface SalaryBreakdown {
  basicMonthly: number;
  hraMonthly: number;
  specialAllowanceMonthly: number;
  otherAllowanceMonthly: number;
  grossMonthly: number;
  grossAnnual: number;
  employerName: string;
  employerType: string;
  industry: string;
  officeCity: string;
  employeeId: string;
  designation: string;
  period: string;
  employerTan: string;
}

export interface IncomeBreakdown {
  salary: number;
  savingsInterest: number;
  fdInterest: number;
  dividend: number;
  grossTotalIncome: number;
}

export interface ChapterVIADeductions {
  sec80C: number;
  sec80D: number;
  sec80CCD1B: number;
  totalDeductions: number;
}

export interface Form16Data {
  certificateNo: string;
  employerName: string;
  employerTan: string;
  employeeName: string;
  employeePan: string;
  ay: string;
  fy: string;
  grossSalary: number;
  taxableSalary: number;
  tdsDeducted: number;
  certificateStatus: 'Available' | 'Pending';
}

export interface Form26ASTransaction {
  id: string;
  tan: string;
  deductorName: string;
  section: string;
  totalIncomePaid: number;
  tdsDeposited: number;
  quarter: string;
}

export interface Form26ASData {
  ay: string;
  fy: string;
  pan: string;
  partA_TDS: Form26ASTransaction[];
  totalTDS: number;
}

export interface AISTransaction {
  id: string;
  category: string;
  informationCode: string;
  sourceName: string;
  amount: number;
  tdsAmount: number;
  date: string;
}

export interface AISData {
  ay: string;
  transactions: AISTransaction[];
}

export interface TISSummary {
  salaryIncome: number;
  interestIncome: number;
  dividendIncome: number;
  totalReportedIncome: number;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  maskedAccount: string;
  ifsc: string;
  holderName: string;
  primary: boolean;
  validationStatus: 'validated' | 'pending' | 'failed' | 'unvalidated';
}

export interface AadhaarLinkStatus {
  pan: string;
  aadhaarMasked: string;
  status: 'linked' | 'not-linked';
  linkedDate?: string;
}

export interface ITRReturnRecord {
  id: string;
  ay: string;
  fy: string;
  itrForm: string;
  status: 'draft' | 'submitted' | 'verified' | 'processing' | 'processed' | 'refund-issued';
  verificationStatus: 'verified' | 'pending' | 'rejected';
  acknowledgementNo?: string;
  submittedDate?: string;
  verifiedDate?: string;
  grossIncome: number;
  deductions: number;
  taxableIncome: number;
  computedTax: number;
  tdsClaimed: number;
  refundOrTaxDue: number;
}

export interface NoticeRecord {
  noticeId: string;
  din: string;
  section: string;
  ay: string;
  issuedDate: string;
  dueDate: string;
  status: 'action-required' | 'response-submitted';
  summary: string;
  amount: number;
  explanation?: string;
}

export interface RefundRecord {
  ay: string;
  refundId: string;
  amount: number;
  status: 'processing' | 'issued' | 'credited' | 'failed' | 'reissue-requested';
  failureReason?: string;
  primaryBankId: string;
  replacementBankId?: string;
  timeline: Array<{ stage: string; date: string; status: 'completed' | 'active' | 'pending' }>;
}

export interface ActionLog {
  id: string;
  title: string;
  timestamp: string;
  badge: string;
  serviceId: CanonicalServiceId;
}

export interface NotificationAlert {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  serviceId?: CanonicalServiceId;
}

export interface TaxpayerProfile {
  id: TaxpayerId;
  name: string;
  taxpayerType: string;
  residentialStatus: string;
  age: number;
  occupation: string;
  city: string;
  ay: string;
  fy: string;
  pan: string;
  aadhaar: string;
  mobile: string;
  email: string;
  statusTag: string;
  scenarioDescription: string;
  
  // Fully Derived Financial Ecosystem Fields
  salary: SalaryBreakdown;
  income: IncomeBreakdown;
  deductions: ChapterVIADeductions;
  form16: Form16Data;
  form26as: Form26ASData;
  ais: AISData;
  tis: TISSummary;
  bankAccounts: BankAccount[];
  aadhaarStatus: AadhaarLinkStatus;
  returns: Record<string, ITRReturnRecord>; // Keyed by AY e.g., "AY2026-27"
  notice?: NoticeRecord;
  refund?: RefundRecord;
  actionHistory: ActionLog[];
  notifications: NotificationAlert[];
}

export interface CanonicalServiceMeta {
  id: CanonicalServiceId;
  title: string;
  shortDesc: string;
  iconName: string;
  preLoginAccess: 'full' | 'preview' | 'login-required';
  category: 'Filing' | 'Payments' | 'Tax Credits' | 'Compliance' | 'Services';
}

export interface CalendarEvent {
  id: string;
  date: string;
  day: string;
  month: string;
  title: string;
  description: string;
  urgency: 'high' | 'medium' | 'low';
  assessmentYear: string;
  relatedServiceId: CanonicalServiceId;
}

export interface IntentMatch {
  query: string;
  matchedServiceId: CanonicalServiceId | PublicUtilityId;
  confidence: number;
  title: string;
  description: string;
}
