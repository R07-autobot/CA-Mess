import { DayPlan, ScheduledTopic, TopicExecutionFramework, TopicLinkReference, AttemptPortion } from '../types/ca-study';
import { FRAMEWORKS } from './dailyStudySchedule';

export const FINAL_FRAMEWORKS: Record<string, TopicExecutionFramework> = {
  frIndASMethod: {
    name: 'Ind AS 4-Step Technical Presentation Method (210m)',
    description: 'Gold-standard Ind AS answer framework for CA Final Financial Reporting.',
    steps: [
      'Step 1 (30m): Ind AS Identification & Objective - State applicable Ind AS (e.g., Ind AS 115, 116, 109, 103) and definition criteria.',
      'Step 2 (70m): Recognition & Measurement Accounting Principles - Detail initial vs subsequent measurement (FVOCI, FVTPL, Amortised cost, Lessee ROU asset).',
      'Step 3 (60m): Working Notes & Journal Entries - Draft comprehensive journal entries with narrations and balance sheet extract.',
      'Step 4 (50m): Disclosure & Comparison with Past Year ICAI Exam Questions - Verify transition provisions and carving-outs.',
    ],
    proTip: 'In CA Final FR, quoting exact standard paragraphs (e.g. Ind AS 115 5-Step Model, Ind AS 103 Acquisition Method) secures maximum technical marks.',
  },
  afmQuantMethod: {
    name: 'AFM Formula & Risk Neutral Pricing Method (210m)',
    description: 'Rigorous computational presentation framework for Forex, Derivatives, and Portfolio Management.',
    steps: [
      'Step 1 (25m): Data Extraction & Unit Consistency - Note spot, forward rates, bid-ask spreads, annualized volatility, and risk-free rates.',
      'Step 2 (75m): Core Formula Derivation - Solve working notes: Forward premium/discount, Black-Scholes d1/d2, Beta regression, or Swap cash flows.',
      'Step 3 (60m): Strategy Payoff Table / Arbitrage Matrix - Construct comparative outcome tables comparing hedge alternatives (Forward vs Money Market vs Options).',
      'Step 4 (50m): Financial Recommendation & Managerial Advice - Conclude with the optimal strategy and total savings/cost in domestic currency.',
    ],
    proTip: 'Always specify foreign currency units clearly (e.g., USD/INR vs INR/USD) to avoid inversion errors.',
  },
  auditEthicsMethod: {
    name: 'Advanced Audit & Professional Ethics 3-Tier Proof (90m)',
    description: 'Statutory and Standards-based drafting protocol for CA Final Paper 3.',
    steps: [
      'Step 1 (25m): Applicable Clause & Schedule / Standard on Auditing - Quote exact Clause number, Schedule (First vs Second), and Part of CA Act 1949, or relevant SA.',
      'Step 2 (35m): Council Guidelines / Ethical Principle - Explain underlying legal rationale, threats to independence (Self-interest, Advocacy), or mandatory auditor duty.',
      'Step 3 (30m): Case Evaluation & Verdict - Conclude unambiguously whether the Chartered Accountant is "Guilty of Professional Misconduct" or auditor\'s report requires modification.',
    ],
    proTip: 'Always conclude with: "Therefore, in view of the above provision, Mr. X is guilty of professional misconduct under Clause... of Part... of First/Second Schedule".',
  },
  dtInternationalTax: {
    name: 'Direct Tax & Transfer Pricing Computation Protocol (90m)',
    description: 'Comprehensive tax calculation aligning statutory sections with transfer pricing adjustments.',
    steps: [
      'Step 1 (25m): Statutory Section & Threshold - State section (e.g. Sec 92C Arm\'s Length Price, Sec 90 DTAA, Sec 115JB MAT).',
      'Step 2 (35m): Adjustment & Primary/Secondary Adjustments - Calculate upward adjustment, interest under Sec 92CE, or tax credit under Rule 128.',
      'Step 3 (30m): Net Impact on Total Income & Tax Payable - Apply corporate surcharge, Health & Education Cess, and double tax relief.',
    ],
    proTip: 'Always state whether the transaction is an "International Transaction" under Sec 92B or "Specified Domestic Transaction" under Sec 92BA.',
  },
};

export const CA_FINAL_CURRICULUM_BLOCKS = [
  // Block 1: Audit Standards (Morning) & FR Ind AS 115 (Evening)
  {
    morningPaperCode: 'Paper 3',
    morningPaperShortName: 'Audit',
    morningChapterId: 'final_audit_ch1',
    morningChapterTitle: 'Quality Management (SQC 1 & SA 220) and General Principles (SA 200, 210, 230)',
    morningSubtopics: [
      'SQC 1: Quality Management elements, Leadership responsibilities & Engagement Quality Review',
      'SA 220 (Revised): Quality Management for an Audit of Financial Statements',
      'SA 210: Agreeing the Terms of Audit Engagements & Preconditions for an Audit',
      'SA 230: Audit Documentation, Working Papers ownership, Assembly period (60 days), Retention (7 years)',
    ],
    morningSmModule: 'ICAI Final Audit Module 1',
    morningPageRange: 'Pages 1.10 – 1.48',
    morningIllustrations: 'Illustrations 1-6 & Descriptive Case Studies 1-5',
    morningRtpPyq: 'RTP Nov 2025 Case Scenario 1 & Past Exam May 2024 Q1',
    morningBareAct: 'ICAI Standards on Auditing SQC 1, SA 220, 210, 230',
    morningFramework: FINAL_FRAMEWORKS.auditEthicsMethod,
    morningMemory: 'SQC 1 Elements Mnemonic: "HEAL ME" (HR, Ethical requirements, Acceptance, Leadership, Monitoring, Engagement performance).',
    morningLinks: [
      {
        id: 'fin_link_m1_1',
        title: 'ICAI BoS Knowledge Portal: Final Audit Module 1 PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI BoS Official',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'fin_link_m1_2',
        title: 'YouTube: SQC 1 & SA 220/210/230 Detailed Revision',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Shubham Keswani',
        url: 'https://www.youtube.com/results?search_query=CA+Final+Audit+SQC+1+SA+220+Shubham+Keswani',
        priceNote: 'Free YouTube Lecture',
      },
      {
        id: 'fin_link_m1_3',
        title: 'CA Final Audit Exam-Oriented Fast Track Batch',
        type: 'paid_batch' as const,
        costType: 'paid' as const,
        provider: 'BB Virtuals / CA Shubham Keswani',
        url: 'https://bbvirtuals.com',
        priceNote: 'Paid Comprehensive Course',
      },
    ],
    // Evening
    eveningPaperCode: 'Paper 1',
    eveningPaperShortName: 'FR (Ind AS)',
    eveningChapterId: 'final_fr_ch5',
    eveningChapterTitle: 'Ind AS 115: Revenue from Contracts with Customers (5-Step Framework)',
    eveningSubtopics: [
      'Step 1 & 2: Identify Contract & Distinct Performance Obligations (Goods vs Services)',
      'Step 3: Determining Transaction Price (Variable consideration, Financing component, Non-cash)',
      'Step 4: Allocating Transaction Price to Performance Obligations based on Standalone Selling Price',
      'Step 5: Revenue recognition Over Time vs Point in Time (Contract Asset vs Trade Receivable)',
    ],
    eveningSmModule: 'ICAI Final FR Module 2',
    eveningPageRange: 'Pages 5.12 – 5.86',
    eveningIllustrations: 'Comprehensive Illustrations 1 to 14 & RTP questions',
    eveningRtpPyq: 'Past Exam Nov 2024 (16 Marks question on Multiple Element Contracts)',
    eveningBareAct: 'Ind AS 115 Standard Text (MCA Gazette Notification)',
    eveningFramework: FINAL_FRAMEWORKS.frIndASMethod,
    eveningMemory: 'Ind AS 115 5-Step Mnemonic: "I-D-D-A-R" (Identify contract, Distinct obligations, Determine price, Allocate, Recognize).',
    eveningLinks: [
      {
        id: 'fin_link_e1_1',
        title: 'ICAI BoS Knowledge Portal: Final FR Ind AS 115 PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI BoS Official',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'fin_link_e1_2',
        title: 'YouTube: Ind AS 115 5-Step Model Marathon & ICAI Illustrations',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Ajay Agarwal / CA Bhavik Chokshi',
        url: 'https://www.youtube.com/results?search_query=CA+Final+Ind+AS+115+Ajay+Agarwal+Bhavik+Chokshi',
        priceNote: 'Free YouTube Lecture',
      },
      {
        id: 'fin_link_e1_3',
        title: 'CA Final FR Master Course with Comprehensive Question Bank',
        type: 'paid_batch' as const,
        costType: 'paid' as const,
        provider: 'Aldine CA / CA Parveen Sharma',
        url: 'https://aldine.edu.in',
        priceNote: 'Paid Comprehensive Course',
      },
    ],
  },

  // Block 2: Professional Ethics (Morning) & AFM Forex Management (Evening)
  {
    morningPaperCode: 'Paper 3',
    morningPaperShortName: 'Audit',
    morningChapterId: 'final_audit_ch9',
    morningChapterTitle: 'Professional Ethics: CA Act 1949 First Schedule (Clauses 1 to 12)',
    morningSubtopics: [
      'First Schedule Part I: Clause 1 (Practice in own name), Clause 2 (Sharing fees with non-members)',
      'First Schedule Part I: Clause 6 (Soliciting clients/advertisement guidelines, website norms)',
      'First Schedule Part I: Clause 7 (Touting, designation CA, visiting cards guidelines)',
      'First Schedule Part I: Clause 8 (Communication with previous auditor in writing & valid mode)',
    ],
    morningSmModule: 'ICAI Final Audit Module 3',
    morningPageRange: 'Pages 18.5 – 18.62',
    morningIllustrations: 'Test Your Knowledge Case Scenarios 1 to 12',
    morningRtpPyq: 'RTP May 2025 Case Study on Clause 6 & 8',
    morningBareAct: 'Chartered Accountants Act 1949 First Schedule Part I',
    morningFramework: FINAL_FRAMEWORKS.auditEthicsMethod,
    morningMemory: 'Clause 6: "No Solicitation, No Circulars, Strictly Prescribed Website Guidelines". Clause 8: "Prior Written Communication with Previous Auditor is Mandatory".',
    morningLinks: [
      {
        id: 'fin_link_m2_1',
        title: 'ICAI BoS Knowledge Portal: Professional Ethics Module 3',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI BoS Official',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'fin_link_m2_2',
        title: 'YouTube: Professional Ethics First Schedule Complete Masterclass',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Shubham Keswani',
        url: 'https://www.youtube.com/results?search_query=CA+Final+Professional+Ethics+First+Schedule+Shubham+Keswani',
        priceNote: 'Free YouTube Lecture',
      },
    ],
    // Evening
    eveningPaperCode: 'Paper 2',
    eveningPaperShortName: 'AFM',
    eveningChapterId: 'final_afm_ch7',
    eveningChapterTitle: 'Foreign Exchange Exposure and Risk Management (Forex Hedging)',
    eveningSubtopics: [
      'Exchange Rate Quotations: Direct vs Indirect, Cross Currency Rates & Bid-Ask Spreads',
      'Interest Rate Parity (IRP) & Purchasing Power Parity (PPP) with Arbitrage Calculations',
      'Forward Contract Cover vs Money Market Hedge (Borrowing/Investing in foreign & domestic currency)',
      'Leading, Lagging, Netting & Currency Futures/Options Hedging',
    ],
    eveningSmModule: 'ICAI Final AFM Module 2',
    eveningPageRange: 'Pages 7.10 – 7.74',
    eveningIllustrations: 'Comprehensive Illustrations 1 to 16 & ICAI Compendium Problems',
    eveningRtpPyq: 'Past Exam May 2024 Q3 (12 Marks: Money Market Hedge vs Forward Contract)',
    eveningBareAct: 'FEMA 1999 Regulations & RBI Forex Hedging Directives',
    eveningFramework: FINAL_FRAMEWORKS.afmQuantMethod,
    eveningMemory: 'IRP Formula: Forward Rate = Spot Rate × (1 + Interest Rate Domestic) / (1 + Interest Rate Foreign).',
    eveningLinks: [
      {
        id: 'fin_link_e2_1',
        title: 'ICAI BoS Knowledge Portal: Final AFM Forex Module PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI BoS Official',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'fin_link_e2_2',
        title: 'YouTube: CA Final AFM Forex Management Marathon',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Ajay Agarwal / CA Aditya Jain',
        url: 'https://www.youtube.com/results?search_query=CA+Final+AFM+Forex+Management+Ajay+Agarwal+Aditya+Jain',
        priceNote: 'Free YouTube Lecture',
      },
      {
        id: 'fin_link_e2_3',
        title: 'CA Final AFM Concept & Practical Question Bank',
        type: 'paid_book' as const,
        costType: 'paid' as const,
        provider: 'Taxmann / CA Ashish Kalra',
        url: 'https://www.taxmann.com',
        priceNote: 'Paid Practice Scanner',
      },
    ],
  },

  // Block 3: International Taxation (Morning) & Ind AS 103 Business Combinations (Evening)
  {
    morningPaperCode: 'Paper 4',
    morningPaperShortName: 'Direct Tax & Int Tax',
    morningChapterId: 'final_dt_ch7',
    morningChapterTitle: 'International Taxation: Transfer Pricing (Sec 92 to 92F & CbCR)',
    morningSubtopics: [
      'Section 92A & 92B: Associated Enterprise (AE) 26% shareholding/control criteria & International Transaction',
      'Section 92C: 5 Arm\'s Length Price (ALP) Methods (CUP, Resale Price, Cost Plus, Profit Split, TNMM)',
      'Section 92CE: Secondary Adjustments & 90-day repatriation timeline or 18% tax on deemed advance',
      'Documentation & Compliance: Master File (Rule 10DA), Local File & Country-by-Country Report (CbCR)',
    ],
    morningSmModule: 'ICAI Final DT Module 3 (International Taxation)',
    morningPageRange: 'Pages 14.15 – 14.85',
    morningIllustrations: 'Practical Illustrations 1 to 10 & RTP Nov 2025 Case Questions',
    morningRtpPyq: 'Past Exam Nov 2024 Q4(a) (10 Marks Transfer Pricing methods)',
    morningBareAct: 'Income Tax Act 1961 Sec 92, 92A, 92B, 92C, 92CE & Income Tax Rules',
    morningFramework: FINAL_FRAMEWORKS.dtInternationalTax,
    morningMemory: 'AE Thresholds: 26% Voting Power, 51% Loan of total assets, or 90% Raw materials supplied by one enterprise.',
    morningLinks: [
      {
        id: 'fin_link_m3_1',
        title: 'ICAI BoS Knowledge Portal: Final Direct Tax Module 3 PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI BoS Official',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'fin_link_m3_2',
        title: 'YouTube: Transfer Pricing Complete Revision & Case Laws',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Bhanwar Borana (BB Sir)',
        url: 'https://www.youtube.com/results?search_query=CA+Final+Transfer+Pricing+Bhanwar+Borana+BB+Sir',
        priceNote: 'Free YouTube Lecture',
      },
      {
        id: 'fin_link_m3_3',
        title: 'CA Final Direct Tax & International Tax Fast Track Batch',
        type: 'paid_batch' as const,
        costType: 'paid' as const,
        provider: 'BB Virtuals / CA Bhanwar Borana',
        url: 'https://bbvirtuals.com',
        priceNote: 'Paid Comprehensive Course',
      },
    ],
    // Evening
    eveningPaperCode: 'Paper 1',
    eveningPaperShortName: 'FR (Ind AS)',
    eveningChapterId: 'final_fr_ch11',
    eveningChapterTitle: 'Ind AS 103: Business Combinations & Purchase Consideration Accounting',
    eveningSubtopics: [
      'Acquisition Method: Identifying Acquirer, Acquisition Date & Purchase Consideration (PC) Valuation',
      'Contingent Consideration: Measurement at Fair Value & subsequent adjustment through P&L vs Equity',
      'Goodwill vs Bargain Purchase Gain (Capital Reserve / OCI) computation',
      'Common Control Transactions (Appendix C of Ind AS 103): Pooling of Interest method',
    ],
    eveningSmModule: 'ICAI Final FR Module 3',
    eveningPageRange: 'Pages 11.10 – 11.95',
    eveningIllustrations: 'Comprehensive Problems 1 to 18 & Step Acquisition Scenarios',
    eveningRtpPyq: 'Past Exam May 2024 Q1 (Compulsory 20 Marks Business Combination Case)',
    eveningBareAct: 'Ind AS 103 Business Combinations Standard Text',
    eveningFramework: FINAL_FRAMEWORKS.frIndASMethod,
    eveningMemory: 'PC = Equity shares at Fair Value + Cash + Deferred Consideration at PV + Contingent Consideration at FV.',
    eveningLinks: [
      {
        id: 'fin_link_e3_1',
        title: 'ICAI BoS Knowledge Portal: Final FR Ind AS 103 PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI BoS Official',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'fin_link_e3_2',
        title: 'YouTube: Ind AS 103 Business Combinations Master Marathon',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Ajay Agarwal / CA Bhavik Chokshi',
        url: 'https://www.youtube.com/results?search_query=CA+Final+Ind+AS+103+Business+Combinations+Ajay+Agarwal+Bhavik+Chokshi',
        priceNote: 'Free YouTube Lecture',
      },
    ],
  },

  // Block 4: GST Input Tax Credit (Morning) & AFM Portfolio Management (Evening)
  {
    morningPaperCode: 'Paper 5',
    morningPaperShortName: 'IDT (GST & Customs)',
    morningChapterId: 'final_idt_ch4',
    morningChapterTitle: 'Input Tax Credit (ITC: Sec 16, 17 Blocked Credit, Rule 42 & 43)',
    morningSubtopics: [
      'Section 16: Eligibility, 4 conditions for taking ITC, 180-day vendor payment rule & GSTR-2B reflection',
      'Section 17(5): Blocked Credits master list (Motor vehicles, Food, Health, Club, Works Contract)',
      'Rule 42: Apportionment of common inputs and input services between taxable & exempt supplies',
      'Rule 43: Reversal of ITC on Capital Goods (60 months useful life calculation)',
    ],
    morningSmModule: 'ICAI Final IDT Module 1',
    morningPageRange: 'Pages 4.10 – 4.78',
    morningIllustrations: 'Practical Illustrations 1 to 15 & Comprehensive Numerical Questions',
    morningRtpPyq: 'Past Exam Nov 2024 (14 Marks Rule 42 & 43 Comprehensive Calculation)',
    morningBareAct: 'CGST Act 2017 Sec 16, 17 & CGST Rules 42, 43',
    morningFramework: FRAMEWORKS.practical4Step,
    morningMemory: 'Blocked Credit Sec 17(5) Mnemonic: "M-F-H-C-W" (Motor vehicles, Food & beverage, Health insurance, Club membership, Works contract for immovable property).',
    morningLinks: [
      {
        id: 'fin_link_m4_1',
        title: 'ICAI BoS Knowledge Portal: Final IDT Module 1 PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI BoS Official',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'fin_link_m4_2',
        title: 'YouTube: GST Input Tax Credit Sec 16, 17(5), Rule 42/43 Masterclass',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Vishal Bhattad (Vsmart Academy)',
        url: 'https://www.youtube.com/results?search_query=CA+Final+GST+ITC+Section+16+17+Vishal+Bhattad',
        priceNote: 'Free YouTube Lecture',
      },
      {
        id: 'fin_link_m4_3',
        title: 'CA Final IDT Super 35 / Compiler with GST Amendment Notes',
        type: 'paid_book' as const,
        costType: 'paid' as const,
        provider: 'Vsmart Academy / CA Vishal Bhattad',
        url: 'https://vsmartacademy.com',
        priceNote: 'Paid Question Bank',
      },
    ],
    // Evening
    eveningPaperCode: 'Paper 2',
    eveningPaperShortName: 'AFM',
    eveningChapterId: 'final_afm_ch4',
    eveningChapterTitle: 'Portfolio Management: Markowitz Model, Beta, CAPM & Performance Evaluation',
    eveningSubtopics: [
      'Two-Security & Three-Security Portfolio Risk and Expected Return (Covariance & Correlation)',
      'Capital Asset Pricing Model (CAPM): SML vs CML, Beta computation & Undervalued/Overvalued security assessment',
      'Arbitrage Pricing Theory (APT) & Factor Sensitivity models',
      'Portfolio Performance Evaluation: Sharpe Ratio, Treynor Ratio, Jensen\'s Alpha & Fama Decomposition',
    ],
    eveningSmModule: 'ICAI Final AFM Module 1',
    eveningPageRange: 'Pages 4.15 – 4.88',
    eveningIllustrations: 'Comprehensive Problems 1 to 20 & Past Exam Compendium',
    eveningRtpPyq: 'Past Exam Nov 2024 Q2(a) (10 Marks Sharpe vs Treynor vs Jensen Alpha)',
    eveningBareAct: 'SEBI (Mutual Funds) Regulations & Modern Portfolio Theory',
    eveningFramework: FINAL_FRAMEWORKS.afmQuantMethod,
    eveningMemory: 'Sharpe = (Rp - Rf) / Standard Deviation. Treynor = (Rp - Rf) / Beta. Alpha = Actual Return - CAPM Expected Return.',
    eveningLinks: [
      {
        id: 'fin_link_e4_1',
        title: 'ICAI BoS Knowledge Portal: Final AFM Portfolio Module PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI BoS Official',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'fin_link_e4_2',
        title: 'YouTube: Portfolio Management Complete Revision & Formulas',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Ajay Agarwal / CA Aditya Jain',
        url: 'https://www.youtube.com/results?search_query=CA+Final+AFM+Portfolio+Management+Ajay+Agarwal+Aditya+Jain',
        priceNote: 'Free YouTube Lecture',
      },
    ],
  },

  // Block 5: Corporate Tax MAT (Morning) & Ind AS 109 Financial Instruments (Evening)
  {
    morningPaperCode: 'Paper 4',
    morningPaperShortName: 'Direct Tax & Int Tax',
    morningChapterId: 'final_dt_ch4',
    morningChapterTitle: 'Corporate Taxation: MAT (Sec 115JB) & Business Trusts (REIT/InvIT)',
    morningSubtopics: [
      'Section 115JB: Minimum Alternate Tax (15%) on Book Profits & Mandatory Additions/Deductions',
      'Ind AS adjustments to Book Profits under Sec 115JB(2C) for transitioning to Ind AS',
      'Taxation of Business Trusts (REIT / InvIT): Pass-through status under Sec 115UA & Unit-holder tax',
      'MAT Credit entitlement under Sec 115JAA (15 years carry-forward mechanism)',
    ],
    morningSmModule: 'ICAI Final DT Module 2',
    morningPageRange: 'Pages 9.10 – 9.68',
    morningIllustrations: 'Comprehensive Practical Question on MAT & General Income Tax computation',
    morningRtpPyq: 'Past Exam May 2024 Q2 (14 Marks MAT vs Normal Tax computation)',
    morningBareAct: 'Income Tax Act 1961 Sec 115JB, 115JAA, 115UA',
    morningFramework: FINAL_FRAMEWORKS.dtInternationalTax,
    morningMemory: 'Book Profit Additions: Income Tax, Provisions for diminution of assets, Dividend paid/proposed, Transfer to reserves.',
    morningLinks: [
      {
        id: 'fin_link_m5_1',
        title: 'ICAI BoS Knowledge Portal: Final Direct Tax Module 2 PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI BoS Official',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'fin_link_m5_2',
        title: 'YouTube: MAT Section 115JB Complete Practical Masterclass',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Bhanwar Borana (BB Sir)',
        url: 'https://www.youtube.com/results?search_query=CA+Final+MAT+Section+115JB+Bhanwar+Borana+BB+Sir',
        priceNote: 'Free YouTube Lecture',
      },
    ],
    // Evening
    eveningPaperCode: 'Paper 1',
    eveningPaperShortName: 'FR (Ind AS)',
    eveningChapterId: 'final_fr_ch10',
    eveningChapterTitle: 'Financial Instruments: Ind AS 109 & 32 (Classification, Impairment & Derivatives)',
    eveningSubtopics: [
      'Financial Asset Classification: Amortised Cost vs FVOCI vs FVTPL (SPPI Test & Business Model Test)',
      'Financial Liabilities: Compound Financial Instruments & Split Accounting (Equity component in OCI)',
      'Expected Credit Loss (ECL) Model: 12-month ECL vs Lifetime ECL (Significant increase in credit risk)',
      'Hedge Accounting: Fair Value Hedge vs Cash Flow Hedge accounting entries',
    ],
    eveningSmModule: 'ICAI Final FR Module 3',
    eveningPageRange: 'Pages 10.15 – 10.120',
    eveningIllustrations: 'Comprehensive Numerical Problems 1 to 24',
    eveningRtpPyq: 'Past Exam Nov 2024 (16 Marks Compound Financial Instrument & Split Accounting)',
    eveningBareAct: 'Ind AS 109 Financial Instruments Standard Text',
    eveningFramework: FINAL_FRAMEWORKS.frIndASMethod,
    eveningMemory: 'Compound Instruments: Value of Debt = PV of cash flows at market interest rate; Equity Component = Total Issue Proceeds - Debt Value.',
    eveningLinks: [
      {
        id: 'fin_link_e5_1',
        title: 'ICAI BoS Knowledge Portal: Final FR Ind AS 109 PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI BoS Official',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'fin_link_e5_2',
        title: 'YouTube: Ind AS 109 Financial Instruments Masterclass',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Ajay Agarwal / CA Bhavik Chokshi',
        url: 'https://www.youtube.com/results?search_query=CA+Final+Ind+AS+109+Financial+Instruments+Ajay+Agarwal+Bhavik+Chokshi',
        priceNote: 'Free YouTube Lecture',
      },
    ],
  },

  // Block 6: Integrated Business Solutions (IBS Multi-disciplinary Case Study)
  {
    morningPaperCode: 'Paper 6',
    morningPaperShortName: 'IBS (Case Studies)',
    morningChapterId: 'final_ibs_ch1',
    morningChapterTitle: 'IBS Case Study 1: Corporate Restructuring, Valuation, Ind AS & Tax Implications',
    morningSubtopics: [
      'Multi-disciplinary Issue 1: Merger Scheme evaluation under Companies Act Sec 230-232',
      'Multi-disciplinary Issue 2: Purchase consideration under Ind AS 103 & Swap Ratio from AFM Valuation',
      'Multi-disciplinary Issue 3: Tax neutrality under Income Tax Act Sec 47(vi) & MAT carry-forward Sec 72A',
      'Multi-disciplinary Issue 4: Auditor\'s reporting under SA 700 & CARO 2020 on restructuring',
    ],
    morningSmModule: 'ICAI Final IBS Case Study Compendium',
    morningPageRange: 'Case Study 1 to 3',
    morningIllustrations: 'Comprehensive 25-Mark Integrated Case Scenario',
    morningRtpPyq: 'ICAI Mock Test Paper 2025 (Paper 6 IBS Case Study 1)',
    morningBareAct: 'Multi-disciplinary Statute Integration (CA 2013 + IT Act + Ind AS)',
    morningFramework: FINAL_FRAMEWORKS.frIndASMethod,
    morningMemory: 'IBS 4-Lens Protocol: Always evaluate an acquisition via (1) Legal (2) Accounting Ind AS (3) Tax Sec 47/72A (4) Audit Reporting.',
    morningLinks: [
      {
        id: 'fin_link_m6_1',
        title: 'ICAI BoS Knowledge Portal: Paper 6 IBS Case Study Compendium',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI BoS Official',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'fin_link_m6_2',
        title: 'YouTube: CA Final Paper 6 Integrated Business Solutions Strategy',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Final Faculty Consortium',
        url: 'https://www.youtube.com/results?search_query=CA+Final+Paper+6+Integrated+Business+Solutions+IBS+Case+Study+ICAI',
        priceNote: 'Free YouTube Guide',
      },
    ],
    // Evening
    eveningPaperCode: 'Paper 1',
    eveningPaperShortName: 'FR (Ind AS)',
    eveningChapterId: 'final_fr_ch12',
    eveningChapterTitle: 'Consolidated Financial Statements: Ind AS 110, 111, 28 & 27',
    eveningSubtopics: [
      'Control Criteria under Ind AS 110: Power, Exposure to variable returns & Ability to use power',
      'Consolidation Adjustments: Unrealised inter-company profits, Uniform accounting policies & NCI at FV vs proportionate share',
      'Joint Arrangements (Ind AS 111): Joint Operations vs Joint Ventures (Equity Method under Ind AS 28)',
      'Loss of Control & Deconsolidation accounting entries',
    ],
    eveningSmModule: 'ICAI Final FR Module 4',
    eveningPageRange: 'Pages 12.10 – 12.98',
    eveningIllustrations: 'Consolidation Comprehensive Practical Problems 1 to 14',
    eveningRtpPyq: 'Past Exam May 2024 Q5 (16 Marks Consolidated Balance Sheet & P&L)',
    eveningBareAct: 'Ind AS 110 Consolidated Financial Statements',
    eveningFramework: FINAL_FRAMEWORKS.frIndASMethod,
    eveningMemory: 'NCI Share = Net Assets of Subsidiary at Book Value + Net Fair Value Adjustments × NCI Percentage.',
    eveningLinks: [
      {
        id: 'fin_link_e6_1',
        title: 'ICAI BoS Knowledge Portal: Final FR Consolidation PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI BoS Official',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'fin_link_e6_2',
        title: 'YouTube: Ind AS 110 Consolidation Master Marathon',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Ajay Agarwal / CA Bhavik Chokshi',
        url: 'https://www.youtube.com/results?search_query=CA+Final+Ind+AS+110+Consolidation+Ajay+Agarwal+Bhavik+Chokshi',
        priceNote: 'Free YouTube Lecture',
      },
    ],
  },
];

// Generates the comprehensive day-by-day roadmap for CA Final till target exam date starting from 2026-10-26
export function generateFinalRoadmapTillMay2027(
  startDateStr: string = '2026-10-26',
  examDateStr: string = '2027-05-01',
  portion: AttemptPortion = 'both'
): Record<string, DayPlan> {
  const result: Record<string, DayPlan> = {};
  const start = new Date(startDateStr);
  const examDate = new Date(`${examDateStr}T00:00:00`);

  const diffTime = examDate.getTime() - start.getTime();
  const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  let blocksToUse: any[] = CA_FINAL_CURRICULUM_BLOCKS;
  if (portion === 'group1') {
    // Pure Group 1: Paper 1 (FR Ind AS), Paper 2 (AFM), Paper 3 (Advanced Audit)
    blocksToUse = [
      CA_FINAL_CURRICULUM_BLOCKS[0], // Audit + FR Ind AS 115
      CA_FINAL_CURRICULUM_BLOCKS[1], // Audit Ethics + AFM Forex
      {
        ...CA_FINAL_CURRICULUM_BLOCKS[0],
        eveningPaperCode: CA_FINAL_CURRICULUM_BLOCKS[2].eveningPaperCode,
        eveningPaperShortName: CA_FINAL_CURRICULUM_BLOCKS[2].eveningPaperShortName,
        eveningChapterId: CA_FINAL_CURRICULUM_BLOCKS[2].eveningChapterId,
        eveningChapterTitle: CA_FINAL_CURRICULUM_BLOCKS[2].eveningChapterTitle,
        eveningSubtopics: CA_FINAL_CURRICULUM_BLOCKS[2].eveningSubtopics,
        eveningSmModule: CA_FINAL_CURRICULUM_BLOCKS[2].eveningSmModule,
        eveningPageRange: CA_FINAL_CURRICULUM_BLOCKS[2].eveningPageRange,
        eveningIllustrations: CA_FINAL_CURRICULUM_BLOCKS[2].eveningIllustrations,
        eveningRtpPyq: CA_FINAL_CURRICULUM_BLOCKS[2].eveningRtpPyq,
        eveningBareAct: CA_FINAL_CURRICULUM_BLOCKS[2].eveningBareAct,
        eveningFramework: CA_FINAL_CURRICULUM_BLOCKS[2].eveningFramework,
        eveningMemory: CA_FINAL_CURRICULUM_BLOCKS[2].eveningMemory,
        eveningLinks: CA_FINAL_CURRICULUM_BLOCKS[2].eveningLinks,
      }, // Audit + FR Ind AS 103
      {
        ...CA_FINAL_CURRICULUM_BLOCKS[1],
        eveningPaperCode: CA_FINAL_CURRICULUM_BLOCKS[3].eveningPaperCode,
        eveningPaperShortName: CA_FINAL_CURRICULUM_BLOCKS[3].eveningPaperShortName,
        eveningChapterId: CA_FINAL_CURRICULUM_BLOCKS[3].eveningChapterId,
        eveningChapterTitle: CA_FINAL_CURRICULUM_BLOCKS[3].eveningChapterTitle,
        eveningSubtopics: CA_FINAL_CURRICULUM_BLOCKS[3].eveningSubtopics,
        eveningSmModule: CA_FINAL_CURRICULUM_BLOCKS[3].eveningSmModule,
        eveningPageRange: CA_FINAL_CURRICULUM_BLOCKS[3].eveningPageRange,
        eveningIllustrations: CA_FINAL_CURRICULUM_BLOCKS[3].eveningIllustrations,
        eveningRtpPyq: CA_FINAL_CURRICULUM_BLOCKS[3].eveningRtpPyq,
        eveningBareAct: CA_FINAL_CURRICULUM_BLOCKS[3].eveningBareAct,
        eveningFramework: CA_FINAL_CURRICULUM_BLOCKS[3].eveningFramework,
        eveningMemory: CA_FINAL_CURRICULUM_BLOCKS[3].eveningMemory,
        eveningLinks: CA_FINAL_CURRICULUM_BLOCKS[3].eveningLinks,
      }, // Audit Ethics + AFM Portfolio
      {
        ...CA_FINAL_CURRICULUM_BLOCKS[0],
        eveningPaperCode: CA_FINAL_CURRICULUM_BLOCKS[4].eveningPaperCode,
        eveningPaperShortName: CA_FINAL_CURRICULUM_BLOCKS[4].eveningPaperShortName,
        eveningChapterId: CA_FINAL_CURRICULUM_BLOCKS[4].eveningChapterId,
        eveningChapterTitle: CA_FINAL_CURRICULUM_BLOCKS[4].eveningChapterTitle,
        eveningSubtopics: CA_FINAL_CURRICULUM_BLOCKS[4].eveningSubtopics,
        eveningSmModule: CA_FINAL_CURRICULUM_BLOCKS[4].eveningSmModule,
        eveningPageRange: CA_FINAL_CURRICULUM_BLOCKS[4].eveningPageRange,
        eveningIllustrations: CA_FINAL_CURRICULUM_BLOCKS[4].eveningIllustrations,
        eveningRtpPyq: CA_FINAL_CURRICULUM_BLOCKS[4].eveningRtpPyq,
        eveningBareAct: CA_FINAL_CURRICULUM_BLOCKS[4].eveningBareAct,
        eveningFramework: CA_FINAL_CURRICULUM_BLOCKS[4].eveningFramework,
        eveningMemory: CA_FINAL_CURRICULUM_BLOCKS[4].eveningMemory,
        eveningLinks: CA_FINAL_CURRICULUM_BLOCKS[4].eveningLinks,
      }, // Audit + FR Ind AS 109
      {
        ...CA_FINAL_CURRICULUM_BLOCKS[1],
        eveningPaperCode: CA_FINAL_CURRICULUM_BLOCKS[5].eveningPaperCode,
        eveningPaperShortName: CA_FINAL_CURRICULUM_BLOCKS[5].eveningPaperShortName,
        eveningChapterId: CA_FINAL_CURRICULUM_BLOCKS[5].eveningChapterId,
        eveningChapterTitle: CA_FINAL_CURRICULUM_BLOCKS[5].eveningChapterTitle,
        eveningSubtopics: CA_FINAL_CURRICULUM_BLOCKS[5].eveningSubtopics,
        eveningSmModule: CA_FINAL_CURRICULUM_BLOCKS[5].eveningSmModule,
        eveningPageRange: CA_FINAL_CURRICULUM_BLOCKS[5].eveningPageRange,
        eveningIllustrations: CA_FINAL_CURRICULUM_BLOCKS[5].eveningIllustrations,
        eveningRtpPyq: CA_FINAL_CURRICULUM_BLOCKS[5].eveningRtpPyq,
        eveningBareAct: CA_FINAL_CURRICULUM_BLOCKS[5].eveningBareAct,
        eveningFramework: CA_FINAL_CURRICULUM_BLOCKS[5].eveningFramework,
        eveningMemory: CA_FINAL_CURRICULUM_BLOCKS[5].eveningMemory,
        eveningLinks: CA_FINAL_CURRICULUM_BLOCKS[5].eveningLinks,
      }, // Audit + FR Ind AS 110 Consolidation
    ];
  } else if (portion === 'group2') {
    // Pure Group 2: Paper 4 (DT), Paper 5 (IDT), Paper 6 (IBS)
    blocksToUse = [
      {
        // Morning DT Transfer Pricing & Evening IDT ITC
        morningPaperCode: CA_FINAL_CURRICULUM_BLOCKS[2].morningPaperCode,
        morningPaperShortName: CA_FINAL_CURRICULUM_BLOCKS[2].morningPaperShortName,
        morningChapterId: CA_FINAL_CURRICULUM_BLOCKS[2].morningChapterId,
        morningChapterTitle: CA_FINAL_CURRICULUM_BLOCKS[2].morningChapterTitle,
        morningSubtopics: CA_FINAL_CURRICULUM_BLOCKS[2].morningSubtopics,
        morningSmModule: CA_FINAL_CURRICULUM_BLOCKS[2].morningSmModule,
        morningPageRange: CA_FINAL_CURRICULUM_BLOCKS[2].morningPageRange,
        morningIllustrations: CA_FINAL_CURRICULUM_BLOCKS[2].morningIllustrations,
        morningRtpPyq: CA_FINAL_CURRICULUM_BLOCKS[2].morningRtpPyq,
        morningBareAct: CA_FINAL_CURRICULUM_BLOCKS[2].morningBareAct,
        morningFramework: CA_FINAL_CURRICULUM_BLOCKS[2].morningFramework,
        morningMemory: CA_FINAL_CURRICULUM_BLOCKS[2].morningMemory,
        morningLinks: CA_FINAL_CURRICULUM_BLOCKS[2].morningLinks,

        eveningPaperCode: CA_FINAL_CURRICULUM_BLOCKS[3].morningPaperCode,
        eveningPaperShortName: CA_FINAL_CURRICULUM_BLOCKS[3].morningPaperShortName,
        eveningChapterId: CA_FINAL_CURRICULUM_BLOCKS[3].morningChapterId,
        eveningChapterTitle: CA_FINAL_CURRICULUM_BLOCKS[3].morningChapterTitle,
        eveningSubtopics: CA_FINAL_CURRICULUM_BLOCKS[3].morningSubtopics,
        eveningSmModule: CA_FINAL_CURRICULUM_BLOCKS[3].morningSmModule,
        eveningPageRange: CA_FINAL_CURRICULUM_BLOCKS[3].morningPageRange,
        eveningIllustrations: CA_FINAL_CURRICULUM_BLOCKS[3].morningIllustrations,
        eveningRtpPyq: CA_FINAL_CURRICULUM_BLOCKS[3].morningRtpPyq,
        eveningBareAct: CA_FINAL_CURRICULUM_BLOCKS[3].morningBareAct,
        eveningFramework: CA_FINAL_CURRICULUM_BLOCKS[3].morningFramework,
        eveningMemory: CA_FINAL_CURRICULUM_BLOCKS[3].morningMemory,
        eveningLinks: CA_FINAL_CURRICULUM_BLOCKS[3].morningLinks,
      },
      {
        // Morning IDT ITC & Evening DT MAT Sec 115JB
        morningPaperCode: CA_FINAL_CURRICULUM_BLOCKS[3].morningPaperCode,
        morningPaperShortName: CA_FINAL_CURRICULUM_BLOCKS[3].morningPaperShortName,
        morningChapterId: CA_FINAL_CURRICULUM_BLOCKS[3].morningChapterId,
        morningChapterTitle: 'GST: Place of Supply & Tax Invoices (Sec 10-13 IGST & Sec 31 CGST)',
        morningSubtopics: [
          'Place of supply of Goods (Domestic vs Import/Export)',
          'Place of supply of Services (General Rule Sec 12(2) vs Specific Services Sec 12(3)-12(14))',
          'Export of Services 5 Cumulative Conditions under Sec 2(6) IGST Act',
          'Tax Invoice, Credit & Debit Notes, E-Invoicing mandate thresholds',
        ],
        morningSmModule: 'ICAI Final IDT Module 2',
        morningPageRange: 'Pages 7.5 – 7.60',
        morningIllustrations: 'Place of Supply Practical Scenarios 1 to 12',
        morningRtpPyq: 'Nov 2024 RTP Place of Supply Case Problem',
        morningBareAct: 'IGST Act 2017 Sec 10, 11, 12, 13',
        morningFramework: FINAL_FRAMEWORKS.auditEthicsMethod,
        morningMemory: 'Export of Service: Supplier in India, Recipient outside India, Place outside India, Payment in convertible forex, Not merely establishment of distinct person.',
        morningLinks: CA_FINAL_CURRICULUM_BLOCKS[3].morningLinks,

        eveningPaperCode: CA_FINAL_CURRICULUM_BLOCKS[4].morningPaperCode,
        eveningPaperShortName: CA_FINAL_CURRICULUM_BLOCKS[4].morningPaperShortName,
        eveningChapterId: CA_FINAL_CURRICULUM_BLOCKS[4].morningChapterId,
        eveningChapterTitle: CA_FINAL_CURRICULUM_BLOCKS[4].morningChapterTitle,
        eveningSubtopics: CA_FINAL_CURRICULUM_BLOCKS[4].morningSubtopics,
        eveningSmModule: CA_FINAL_CURRICULUM_BLOCKS[4].morningSmModule,
        eveningPageRange: CA_FINAL_CURRICULUM_BLOCKS[4].morningPageRange,
        eveningIllustrations: CA_FINAL_CURRICULUM_BLOCKS[4].morningIllustrations,
        eveningRtpPyq: CA_FINAL_CURRICULUM_BLOCKS[4].morningRtpPyq,
        eveningBareAct: CA_FINAL_CURRICULUM_BLOCKS[4].morningBareAct,
        eveningFramework: CA_FINAL_CURRICULUM_BLOCKS[4].morningFramework,
        eveningMemory: CA_FINAL_CURRICULUM_BLOCKS[4].morningMemory,
        eveningLinks: CA_FINAL_CURRICULUM_BLOCKS[4].morningLinks,
      },
      {
        // Morning DT DTAA & Evening IBS Case Studies
        morningPaperCode: CA_FINAL_CURRICULUM_BLOCKS[2].morningPaperCode,
        morningPaperShortName: CA_FINAL_CURRICULUM_BLOCKS[2].morningPaperShortName,
        morningChapterId: 'final_dt_ch8',
        morningChapterTitle: 'International Taxation: Double Taxation Relief (Sec 90, 90A, 91 & Rule 128)',
        morningSubtopics: [
          'Bilateral Relief Sec 90 vs Unilateral Relief Sec 91 computation steps',
          'Foreign Tax Credit (FTC) Rule 128: Doubly taxed income calculation',
          'Tax Residency Certificate (TRC) Form 10F mandatory compliance',
          'Equalisation Levy 2.0 & Significant Economic Presence (SEP)',
        ],
        morningSmModule: 'ICAI Final DT Module 3',
        morningPageRange: 'Pages 15.10 – 15.65',
        morningIllustrations: 'FTC Rule 128 Comprehensive Computations 1 to 8',
        morningRtpPyq: 'May 2024 Exam Sec 91 Unilateral Relief Question',
        morningBareAct: 'Income Tax Act Sec 90, 91 & Rule 128',
        morningFramework: FINAL_FRAMEWORKS.dtInternationalTax,
        morningMemory: 'Sec 91 Relief = Doubly taxed income x Indian tax rate or Foreign tax rate (whichever is lower).',
        morningLinks: CA_FINAL_CURRICULUM_BLOCKS[2].morningLinks,

        eveningPaperCode: CA_FINAL_CURRICULUM_BLOCKS[5].morningPaperCode,
        eveningPaperShortName: CA_FINAL_CURRICULUM_BLOCKS[5].morningPaperShortName,
        eveningChapterId: CA_FINAL_CURRICULUM_BLOCKS[5].morningChapterId,
        eveningChapterTitle: CA_FINAL_CURRICULUM_BLOCKS[5].morningChapterTitle,
        eveningSubtopics: CA_FINAL_CURRICULUM_BLOCKS[5].morningSubtopics,
        eveningSmModule: CA_FINAL_CURRICULUM_BLOCKS[5].morningSmModule,
        eveningPageRange: CA_FINAL_CURRICULUM_BLOCKS[5].morningPageRange,
        eveningIllustrations: CA_FINAL_CURRICULUM_BLOCKS[5].morningIllustrations,
        eveningRtpPyq: CA_FINAL_CURRICULUM_BLOCKS[5].morningRtpPyq,
        eveningBareAct: CA_FINAL_CURRICULUM_BLOCKS[5].morningBareAct,
        eveningFramework: CA_FINAL_CURRICULUM_BLOCKS[5].morningFramework,
        eveningMemory: CA_FINAL_CURRICULUM_BLOCKS[5].morningMemory,
        eveningLinks: CA_FINAL_CURRICULUM_BLOCKS[5].morningLinks,
      },
    ];
  }

  const blockCount = blocksToUse.length;

  for (let i = 0; i < totalDays; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    const dateStr = current.toISOString().split('T')[0];
    const dayOfWeek = current.getDay(); // 0 is Sunday
    const weekNumber = Math.floor(i / 7) + 1;
    const isSunday = dayOfWeek === 0;

    let phase: DayPlan['phase'] = 'Phase 1: Foundation & ICAI SM';
    if (i > 150) {
      phase = 'Phase 4: Exam Marathon';
    } else if (i > 110) {
      phase = 'Phase 3: R2 & Mock Tests';
    } else if (i > 70) {
      phase = 'Phase 2: R1 & RTPs/PYQ';
    }

    if (isSunday) {
      // Sunday Spaced Repetition Buffer for Working Professionals
      const prevBlockIdx = (Math.floor(i / 7) - 1 + blockCount) % blockCount;
      const refBlock = blocksToUse[prevBlockIdx];

      const morningTopic: ScheduledTopic = {
        id: `fin_m_sun_${dateStr}`,
        slot: 'morning',
        paperCode: refBlock.morningPaperCode,
        paperShortName: refBlock.morningPaperShortName,
        chapterId: refBlock.morningChapterId,
        chapterTitle: `[Sunday Recall] ${refBlock.morningChapterTitle}`,
        subtopics: [
          'Weekly Spaced Active Recall: Write out all standard numbers & penalty thresholds from memory',
          'Past Week Theory Error Log Review & ICAI Model Answer Benchmarking',
          'Timed 30-Minute Speed Writing Drill on Unseen ICAI RTP Question',
        ],
        completedSubtopics: [],
        allocatedMinutes: 90,
        spentMinutes: 0,
        resources: {
          icaiSmModule: refBlock.morningSmModule,
          pageRange: refBlock.morningPageRange,
          illustrations: 'Weekly Review Illustrations',
          rtpPyqRef: 'RTP Speed Test',
          bareActOrStd: refBlock.morningBareAct,
        },
        links: refBlock.morningLinks,
        framework: refBlock.morningFramework,
        memoryTechnique: 'Day 7 Spaced Review Loop: Verify retention without looking at notes first.',
        isCompleted: false,
      };

      const eveningTopic: ScheduledTopic = {
        id: `fin_e_sun_${dateStr}`,
        slot: 'evening',
        paperCode: refBlock.eveningPaperCode,
        paperShortName: refBlock.eveningPaperShortName,
        chapterId: refBlock.eveningChapterId,
        chapterTitle: `[Sunday Numerical Buffer] ${refBlock.eveningChapterTitle}`,
        subtopics: [
          'Comprehensive 3.5h Full-Scale Numerical Problem under strict exam conditions',
          'Independent Verification of Balance Sheet Adjustments & Valuation Formulas',
          'Weekly Backlog Clearance & Catch-up Session for Working Professionals',
        ],
        completedSubtopics: [],
        allocatedMinutes: 210,
        spentMinutes: 0,
        resources: {
          icaiSmModule: refBlock.eveningSmModule,
          pageRange: refBlock.eveningPageRange,
          illustrations: 'Compendium Comprehensive Mock Drill',
          rtpPyqRef: refBlock.eveningRtpPyq,
          bareActOrStd: refBlock.eveningBareAct,
        },
        links: refBlock.eveningLinks,
        framework: refBlock.eveningFramework,
        memoryTechnique: 'Sunday Long-Problem Mastery: Formulate full working notes cleanly without assistance.',
        isCompleted: false,
      };

      result[dateStr] = {
        dayNumber: i + 1,
        date: dateStr,
        phase,
        weekNumber,
        morningTopic,
        eveningTopic,
        status: i === 0 ? 'in_progress' : 'upcoming',
        summaryTarget: `Week ${weekNumber} Sunday Spaced Repetition Buffer & Comprehensive Case Drill`,
      };
    } else {
      // Regular Study Day: Pick block cyclicly
      const blockIndex = i % blockCount;
      const b = blocksToUse[blockIndex];

      const morningTopic: ScheduledTopic = {
        id: `fin_m_${dateStr}`,
        slot: 'morning',
        paperCode: b.morningPaperCode,
        paperShortName: b.morningPaperShortName,
        chapterId: b.morningChapterId,
        chapterTitle: b.morningChapterTitle,
        subtopics: b.morningSubtopics,
        completedSubtopics: [],
        allocatedMinutes: 90,
        spentMinutes: 0,
        resources: {
          icaiSmModule: b.morningSmModule,
          pageRange: b.morningPageRange,
          illustrations: b.morningIllustrations,
          rtpPyqRef: b.morningRtpPyq,
          bareActOrStd: b.morningBareAct,
        },
        links: b.morningLinks,
        framework: b.morningFramework,
        memoryTechnique: b.morningMemory,
        isCompleted: false,
      };

      const eveningTopic: ScheduledTopic = {
        id: `fin_e_${dateStr}`,
        slot: 'evening',
        paperCode: b.eveningPaperCode,
        paperShortName: b.eveningPaperShortName,
        chapterId: b.eveningChapterId,
        chapterTitle: b.eveningChapterTitle,
        subtopics: b.eveningSubtopics,
        completedSubtopics: [],
        allocatedMinutes: 210,
        spentMinutes: 0,
        resources: {
          icaiSmModule: b.eveningSmModule,
          pageRange: b.eveningPageRange,
          illustrations: b.eveningIllustrations,
          rtpPyqRef: b.eveningRtpPyq,
          bareActOrStd: b.eveningBareAct,
        },
        links: b.eveningLinks,
        framework: b.eveningFramework,
        memoryTechnique: b.eveningMemory,
        isCompleted: false,
      };

      result[dateStr] = {
        dayNumber: i + 1,
        date: dateStr,
        phase,
        weekNumber,
        morningTopic,
        eveningTopic,
        status: i === 0 ? 'in_progress' : 'upcoming',
        summaryTarget: `Day ${i + 1}: ${b.morningPaperShortName} (${b.morningChapterTitle.slice(0, 30)}...) & ${b.eveningPaperShortName} (${b.eveningChapterTitle.slice(0, 30)}...)`,
      };
    }
  }

  return result;
}

export function generateInitialDailyFinalSchedule(
  startDateStr: string = '2026-10-26',
  examDateStr: string = '2027-05-01',
  portion: AttemptPortion = 'both'
): Record<string, DayPlan> {
  return generateFinalRoadmapTillMay2027(startDateStr, examDateStr, portion);
}
