export interface TaxCalculationResult {
  grossIncome: number;
  applicableDeductions: number;
  taxableIncome: number;
  baseTax: number;
  rebate87A: number;
  taxAfterRebate: number;
  surcharge: number;
  marginalRelief: number;
  surchargeAfterRelief: number;
  cess: number;
  finalTaxPayable: number;
  effectiveTaxRate: number;
  slabBreakdown: Array<{ range: string; rate: string; taxableInSlab: number; taxAmount: number }>;
}

export function computeTaxAY2026(grossIncome: number, deductions: number, regime: 'new' | 'old' = 'new'): TaxCalculationResult {
  // Step 1: Net Taxable Income Calculation
  const safeGross = Math.max(0, Number(grossIncome) || 0);
  const safeDeductions = regime === 'new' ? 75000 : Math.max(0, Number(deductions) || 0) + 50000;
  const taxableIncome = Math.max(0, safeGross - safeDeductions);

  let baseTax = 0;
  const slabBreakdown: Array<{ range: string; rate: string; taxableInSlab: number; taxAmount: number }> = [];

  if (regime === 'new') {
    // New Tax Regime (Section 115BAC) Slabs:
    // 0 - 4,00,000: 0%
    // 4,00,001 - 8,00,000: 5%
    // 8,00,001 - 12,00,000: 10%
    // 12,00,001 - 16,00,000: 15%
    // 16,00,001 - 20,00,000: 20%
    // 20,00,001 - 24,00,000: 25%
    // Above 24,00,000: 30%

    const slabs = [
      { min: 0, max: 400000, rate: 0, label: '0 – 4,00,000', rateLabel: '0%' },
      { min: 400000, max: 800000, rate: 0.05, label: '4,00,001 – 8,00,000', rateLabel: '5%' },
      { min: 800000, max: 1200000, rate: 0.10, label: '8,00,001 – 12,00,000', rateLabel: '10%' },
      { min: 1200000, max: 1600000, rate: 0.15, label: '12,00,001 – 16,00,000', rateLabel: '15%' },
      { min: 1600000, max: 2000000, rate: 0.20, label: '16,00,001 – 20,00,000', rateLabel: '20%' },
      { min: 2000000, max: 2400000, rate: 0.25, label: '20,00,001 – 24,00,000', rateLabel: '25%' },
      { min: 2400000, max: Infinity, rate: 0.30, label: 'Above 24,00,000', rateLabel: '30%' },
    ];

    slabs.forEach((s) => {
      if (taxableIncome > s.min) {
        const taxableInSlab = Math.min(taxableIncome - s.min, s.max - s.min);
        const taxAmount = taxableInSlab * s.rate;
        baseTax += taxAmount;
        slabBreakdown.push({
          range: s.label,
          rate: s.rateLabel,
          taxableInSlab,
          taxAmount,
        });
      }
    });
  } else {
    // Old Tax Regime Slabs
    const slabs = [
      { min: 0, max: 250000, rate: 0, label: '0 – 2,50,000', rateLabel: '0%' },
      { min: 250000, max: 500000, rate: 0.05, label: '2,50,001 – 5,00,000', rateLabel: '5%' },
      { min: 500000, max: 1000000, rate: 0.20, label: '5,00,001 – 10,00,000', rateLabel: '20%' },
      { min: 1000000, max: Infinity, rate: 0.30, label: 'Above 10,00,000', rateLabel: '30%' },
    ];

    slabs.forEach((s) => {
      if (taxableIncome > s.min) {
        const taxableInSlab = Math.min(taxableIncome - s.min, s.max - s.min);
        const taxAmount = taxableInSlab * s.rate;
        baseTax += taxAmount;
        slabBreakdown.push({
          range: s.label,
          rate: s.rateLabel,
          taxableInSlab,
          taxAmount,
        });
      }
    });
  }

  // Step 3: Section 87A Tax Rebate
  // New Regime: If taxable income <= 12,00,000, 100% tax rebate is applicable up to 60,000 (effective tax = 0).
  // Marginal relief under 87A for income slightly exceeding 12L: Tax cannot exceed (Taxable Income - 12L).
  let rebate87A = 0;
  if (regime === 'new') {
    if (taxableIncome <= 1200000) {
      rebate87A = Math.min(baseTax, 60000);
    } else if (taxableIncome > 1200000 && taxableIncome < 1275000) {
      // Marginal relief under Section 87A:
      const excessIncome = taxableIncome - 1200000;
      if (baseTax > excessIncome) {
        rebate87A = baseTax - excessIncome;
      }
    }
  } else {
    // Old Regime: Taxable income <= 5,00,000 -> Max rebate 12,500
    if (taxableIncome <= 500000) {
      rebate87A = Math.min(baseTax, 12500);
    }
  }

  const taxAfterRebate = Math.max(0, baseTax - rebate87A);

  // Step 4: Surcharge & Marginal Relief
  // Surcharge Rates on Base Tax:
  // > 50L to 1 Cr: 10%
  // > 1 Cr to 2 Cr: 15%
  // > 2 Cr: 25% (Cap under 115BAC)
  let surchargeRate = 0;
  let thresholdLimit = 0;

  if (taxableIncome > 20000000) {
    surchargeRate = 0.25;
    thresholdLimit = 20000000;
  } else if (taxableIncome > 10000000) {
    surchargeRate = 0.15;
    thresholdLimit = 10000000;
  } else if (taxableIncome > 5000000) {
    surchargeRate = 0.10;
    thresholdLimit = 5000000;
  }

  let surcharge = taxAfterRebate * surchargeRate;
  let marginalRelief = 0;

  if (thresholdLimit > 0) {
    // Compute tax on threshold limit
    const thresholdResult = computeTaxAY2026(thresholdLimit + safeDeductions, deductions, regime);
    const taxOnThreshold = thresholdResult.taxAfterRebate + thresholdResult.surcharge;
    
    // Max allowable (Tax + Surcharge) = Tax on threshold + (Actual Taxable Income - Threshold Limit)
    const maxAllowableTaxWithSurcharge = taxOnThreshold + (taxableIncome - thresholdLimit);
    const actualTaxWithSurcharge = taxAfterRebate + surcharge;

    if (actualTaxWithSurcharge > maxAllowableTaxWithSurcharge) {
      marginalRelief = actualTaxWithSurcharge - maxAllowableTaxWithSurcharge;
      surcharge = Math.max(0, surcharge - marginalRelief);
    }
  }

  const surchargeAfterRelief = surcharge;

  // Step 5: Health & Education Cess (4%)
  const cess = (taxAfterRebate + surchargeAfterRelief) * 0.04;
  const finalTaxPayable = Math.round(taxAfterRebate + surchargeAfterRelief + cess);
  const effectiveTaxRate = safeGross > 0 ? (finalTaxPayable / safeGross) * 100 : 0;

  return {
    grossIncome: safeGross,
    applicableDeductions: safeDeductions,
    taxableIncome,
    baseTax,
    rebate87A,
    taxAfterRebate,
    surcharge,
    marginalRelief,
    surchargeAfterRelief,
    cess,
    finalTaxPayable,
    effectiveTaxRate,
    slabBreakdown,
  };
}
