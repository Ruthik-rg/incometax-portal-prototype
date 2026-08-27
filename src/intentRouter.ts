import type { CanonicalServiceId, PublicUtilityId, IntentMatch } from './types';

const INTENT_PATTERNS: Array<{
  keywords: string[];
  serviceId: CanonicalServiceId | PublicUtilityId;
  title: string;
  description: string;
}> = [
  {
    keywords: ['refund', 'money back', 'where is refund', 'not received refund', 'reissue', 'bank refund'],
    serviceId: 'refund-status',
    title: 'Refund Status & Resolution',
    description: 'Check refund progress, view failure reason, or validate replacement bank for reissue.',
  },
  {
    keywords: ['file', 'itr', 'return', 'income tax return', 'submit return', 'file return', 'itr 1', 'itr 2'],
    serviceId: 'file-itr',
    title: 'File Income Tax Return (AY 2026-27)',
    description: 'Prepare, review pre-filled salary data, submit ITR and proceed to e-Verify.',
  },
  {
    keywords: ['notice', 'demand', 'proceeding', '143', '148', 'letter', 'scrutiny', 'got a notice'],
    serviceId: 'respond-notices',
    title: 'e-Proceedings & Notice Response',
    description: 'View active tax notices, attach supporting files, and submit written response.',
  },
  {
    keywords: ['pay', 'advance tax', 'tax payment', 'challan', 'self assessment', 'pay tax'],
    serviceId: 'e-pay-tax',
    title: 'e-Pay Tax Online',
    description: 'Generate challan and pay Advance Tax, Self Assessment Tax or Regular Assessment.',
  },
  {
    keywords: ['tds', 'form 26as', '26as', 'tax credit', 'tax deducted', 'tcs'],
    serviceId: 'form-26as',
    title: 'Form 26AS Tax Credit Statement',
    description: 'Review TDS credits, TCS collections, and advance taxes deposited by deductors.',
  },
  {
    keywords: ['ais', 'tis', 'annual information', 'financial transactions', 'stock trades', 'interest income'],
    serviceId: 'ais-tis',
    title: 'Annual Information Statement (AIS/TIS)',
    description: 'Comprehensive financial transaction records summary provided by reporting entities.',
  },
  {
    keywords: ['verify', 'everify', 'verification', 'aadhaar otp', 'evc', 'pending verification'],
    serviceId: 'e-verify',
    title: 'e-Verify Return',
    description: 'Verify filed return using Aadhaar OTP, Net Banking, or Bank EVC.',
  },
  {
    keywords: ['history', 'past returns', 'acknowledgement', 'itr-v', 'old returns'],
    serviceId: 'filing-history',
    title: 'Filing History & Acknowledgements',
    description: 'View filed returns ledger for previous assessment years and download ITR-V.',
  },
  {
    keywords: ['aadhaar', 'link aadhaar', 'pan link', 'pan aadhaar'],
    serviceId: 'link-aadhaar',
    title: 'Link Aadhaar to PAN',
    description: 'Check status or complete instant linking of Aadhaar to PAN.',
  },
  {
    keywords: ['calculate', 'tax calculator', 'old regime', 'new regime', 'tax savings', 'regime comparison'],
    serviceId: 'tax-calculator',
    title: 'Interactive Tax Calculator',
    description: 'Compare Old vs New Tax regime savings with live tax computation.',
  },
  {
    keywords: ['download', 'forms', 'itr forms', 'form 16', 'blank forms', 'pdf forms'],
    serviceId: 'download-forms',
    title: 'Download Utilities & Forms',
    description: 'Download offline JSON schemas, blank PDF forms, and Form 16 templates.',
  },
];

export function resolveIntent(query: string): IntentMatch | null {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return null;

  let bestMatch: IntentMatch | null = null;
  let highestScore = 0;

  for (const pattern of INTENT_PATTERNS) {
    let score = 0;
    for (const kw of pattern.keywords) {
      if (normalized.includes(kw)) {
        score += kw.length * 2;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = {
        query,
        matchedServiceId: pattern.serviceId,
        title: pattern.title,
        description: pattern.description,
        matchScore: score,
      };
    }
  }

  return bestMatch;
}
