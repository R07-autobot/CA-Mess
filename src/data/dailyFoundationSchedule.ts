import { DayPlan, ScheduledTopic, TopicExecutionFramework, TopicLinkReference, AttemptPortion } from '../types/ca-study';
import { generateTopicResources } from '../utils/topicResources';

export const FOUNDATION_FRAMEWORKS: Record<string, TopicExecutionFramework> = {
  accountsPresentationMethod: {
    name: 'Foundation Accounting Ledger & Adjustment Protocol (210m)',
    description: 'Gold-standard double entry & balance sheet adjustment protocol for CA Foundation Paper 1.',
    steps: [
      'Step 1 (30m): Concept Review & Journal/Ledger Rules - Debit the receiver / Credit the giver; Asset/Expense increases debit, Liability/Income increases credit.',
      'Step 2 (70m): Working Notes & Adjustments - Draft clean working notes for Depreciation, Accrued Expenses, Provision for Doubtful Debts, and Bad Debts.',
      'Step 3 (65m): Ledger Postings & Final Accounts / Partnership Accounts - Complete Trading & P&L, Revaluation, or Capital Accounts extracts with proper headings.',
      'Step 4 (45m): Balance Sheet Cross-Check & ICAI Illustrations - Verify dual effect of every adjustment and ensure Balance Sheet tallies precisely.',
    ],
    proTip: 'In CA Foundation Accounts, examiners award step marks for every single working note. Never skip Working Note 1!',
  },
  businessLawFramework: {
    name: '3-Tier Legal Case Law Presentation Framework (90m)',
    description: 'Structured 3-step legal drafting for 100 Marks Business Laws (Contract Act, Sale of Goods, Partnership, LLP, Companies, Negotiable Instruments).',
    steps: [
      'Step 1 (25m): Relevant Statutory Provision & Section - Cite the governing Act and Section (e.g. Section 2(h) of ICA 1872, Section 138 of NI Act 1881).',
      'Step 2 (35m): Analysis & Application to Given Facts - Correlate the facts of the question with the essential elements of the legal provision.',
      'Step 3 (30m): Clear Conclusive Verdict - State unambiguously: "Hence, Mr. A is liable / not liable to compensate Mr. B".',
    ],
    proTip: 'Always start with: "According to the provisions of Section... of the Indian Contract Act, 1872...". Never write informal conversational answers.',
  },
  qaFastCalculationMethod: {
    name: 'QA 60-Second Calculator & Elimination Protocol (210m)',
    description: 'High-speed speed-test method for 100 Objective MCQs in Mathematics, Logical Reasoning, and Statistics.',
    steps: [
      'Step 1 (25m): Formula & Identity Recall - Write down TVM formulas, Quadratic roots relations, or Variance/SD definitions.',
      'Step 2 (70m): Citizen / Casio Calculator Techniques - Master M+, M-, MR, GT keys for Annuity Regular, Perpetuity, and Compound Interest calculations in <30 seconds.',
      'Step 3 (65m): Backward Substitution & Option Elimination - Test options directly into the equation when algebra is protracted.',
      'Step 4 (50m): Timed 30-Question MCQ Speed Run - Target 45 seconds per question with negative marking discipline (avoid blind guesses).',
    ],
    proTip: 'Time Value of Money (TVM) carries 12-16 marks. Practice PV of Annuity on calculator: 1 ÷ (1+i) [=] [=] ... [GT] × A.',
  },
  economicsAnalyticalMethod: {
    name: 'Economics Diagram & Elasticity Logic Framework (90m)',
    description: 'Conceptual and graphical mastery for Micro, Macro, Public Finance, Money Market, and Indian Economy MCQs.',
    steps: [
      'Step 1 (25m): Core Definition & Assumptions - Understand ceteris paribus, downward sloping demand curve, or Keynesian multiplier.',
      'Step 2 (35m): Formula & Elasticity Verification - Calculate price/income elasticity coefficients (e > 1, e = 1, e < 1).',
      'Step 3 (30m): Market Equilibrium & Policy Matrix - Analyze shift vs movement along curve and RBI Monetary/Fiscal policy impacts.',
    ],
    proTip: 'Remember: MR = 0 when Ed = 1; MR > 0 when Ed > 1; MR < 0 when Ed < 1. This single relationship yields 2-3 guaranteed MCQ marks!',
  },
};

export const CA_FOUNDATION_CURRICULUM_BLOCKS = [
  // Block 1: Contract Act Basics (Morning) & BRS + Rectification (Evening)
  {
    morningPaperCode: 'Paper 2',
    morningPaperShortName: 'Law',
    morningChapterId: 'fnd_p2_ch2',
    morningChapterTitle: 'The Indian Contract Act, 1872: Nature, Offer & Acceptance',
    morningSubtopics: [
      'Essential elements of a valid contract (Sec 10) & Consensus ad idem',
      'Offer and Acceptance rules, Communication of Offer, Acceptance & Revocation (Sec 3-5)',
      'Postal rule & Communication against offeror vs offeree',
      'Types of contracts: Void, Voidable, Illegal, Unenforceable',
    ],
    morningSmModule: 'Module 1, Ch 2, Unit 1',
    morningPageRange: 'Pages 2.1 - 2.28',
    morningIllustrations: 'Practical Problems 1 - 10 & Landmark Case: Balfour v Balfour',
    morningRtpPyq: 'Nov 2024 RTP Q1, May 2024 PYQ Q2(a)',
    morningBareAct: 'Indian Contract Act 1872 Sec 2(a)-2(j), Sec 3-9',
    morningFramework: FOUNDATION_FRAMEWORKS.businessLawFramework,
    morningMemory: 'P-E-R-F-E-C-T Checklist for Valid Contract Essentials',

    eveningPaperCode: 'Paper 1',
    eveningPaperShortName: 'Accounting',
    eveningChapterId: 'fnd_p1_ch3',
    eveningChapterTitle: 'Bank Reconciliation Statement (BRS) & Rectification of Errors',
    eveningSubtopics: [
      'Causes of difference between Cash Book balance and Pass Book balance',
      'Preparation of BRS starting with Cash Book balance (Debit/Credit)',
      'Preparation of BRS starting with Pass Book balance / Overdraft',
      'Adjusted / Amended Cash Book method before preparing BRS',
      'Rectification of errors: Two-sided errors vs One-sided errors (Suspense Account)',
    ],
    eveningSmModule: 'Module 1, Ch 2 & Ch 3',
    eveningPageRange: 'Pages 2.45 - 3.35',
    eveningIllustrations: 'ICAI SM Illustrations 1 - 12 & Practical Questions 1 - 6',
    eveningRtpPyq: 'Nov 2024 RTP Q3, May 2024 Exam Q1(b)',
    eveningBareAct: 'Double Entry Rules & Bank Reconciliation Practice',
    eveningFramework: FOUNDATION_FRAMEWORKS.accountsPresentationMethod,
    eveningMemory: 'BRS Add/Less Direction Anchor (Debit balance = Favourable)',
  },

  // Block 2: Contract Act Consideration & Capacity (Morning) & TVM Mathematics (Evening)
  {
    morningPaperCode: 'Paper 2',
    morningPaperShortName: 'Law',
    morningChapterId: 'fnd_p2_ch2',
    morningChapterTitle: 'The Indian Contract Act, 1872: Consideration & Capacity to Contract',
    morningSubtopics: [
      'Definition of Consideration (Sec 2(d)) & Legal rules regarding valid consideration',
      'Doctrine of Privity of Contract & Exceptions (Trust, Family settlement, Acknowledgement)',
      'No consideration, no contract (Ex nudo pacto non oritur actio) & Exceptions (Sec 25)',
      'Capacity to contract: Minor agreements, Mohori Bibee v Dharmodas Ghose, Persons of unsound mind',
    ],
    morningSmModule: 'Module 1, Ch 2, Unit 2 & 3',
    morningPageRange: 'Pages 2.29 - 2.58',
    morningIllustrations: 'Case Studies: Chinnaya v Ramayya, Mohori Bibee',
    morningRtpPyq: 'Dec 2023 PYQ Q1(a), May 2024 RTP Q2',
    morningBareAct: 'Indian Contract Act 1872 Sec 10, 11, 25',
    morningFramework: FOUNDATION_FRAMEWORKS.businessLawFramework,
    morningMemory: 'Active Recall: 5 Exceptions to "No Consideration, No Contract"',

    eveningPaperCode: 'Paper 3',
    eveningPaperShortName: 'QA Maths',
    eveningChapterId: 'fnd_p3_ch4',
    eveningChapterTitle: 'Mathematics of Finance: Time Value of Money (TVM)',
    eveningSubtopics: [
      'Simple Interest vs Compound Interest & Effective Rate of Interest (E = (1+i)^n - 1)',
      'Future Value of Single Cash Flow & Compound Amount',
      'Annuity Regular vs Annuity Due (Future Value & Present Value)',
      'Perpetuity (PV = A/i) & Growing Perpetuity',
      'Applications: Sinking Fund, Loan Amortization Schedule, Net Present Value (NPV)',
    ],
    eveningSmModule: 'Module 1, Ch 4',
    eveningPageRange: 'Pages 4.1 - 4.48',
    eveningIllustrations: 'SM Exercises 4(A), 4(B), 4(C), 4(D) Calculator Shortcuts',
    eveningRtpPyq: 'Nov 2024 RTP Q31-Q45, June 2024 Exam TVM Questions',
    eveningBareAct: 'Calculator Steps: [1+i] [x] [=] ... [GT]',
    eveningFramework: FOUNDATION_FRAMEWORKS.qaFastCalculationMethod,
    eveningMemory: 'Formula Matrix: Annuity PV = A x [1 - (1+i)^-n] / i',
  },

  // Block 3: Free Consent & Void Agreements (Morning) & Inventories & Depreciation (Evening)
  {
    morningPaperCode: 'Paper 2',
    morningPaperShortName: 'Law',
    morningChapterId: 'fnd_p2_ch2',
    morningChapterTitle: 'The Indian Contract Act: Free Consent, Legality of Object & Void Agreements',
    morningSubtopics: [
      'Coercion (Sec 15) vs Undue Influence (Sec 16) with case examples',
      'Fraud (Sec 17) vs Misrepresentation (Sec 18) & Silence as Fraud',
      'Mistake of Fact vs Mistake of Law (Bilateral vs Unilateral mistake)',
      'Agreements opposed to public policy & Wagering agreements (Sec 30)',
      'Contingent Contracts (Sec 31-36) vs Quasi Contracts (Sec 68-72)',
    ],
    morningSmModule: 'Module 1, Ch 2, Unit 4 & 5',
    morningPageRange: 'Pages 2.59 - 2.95',
    morningIllustrations: 'Case Studies: Derry v Peek, Cundy v Lindsay',
    morningRtpPyq: 'Nov 2024 RTP Q2, June 2024 Exam Q3',
    morningBareAct: 'Indian Contract Act 1872 Sec 13-22, 28, 30',
    morningFramework: FOUNDATION_FRAMEWORKS.businessLawFramework,
    morningMemory: 'Contrast Grid: Coercion vs Undue Influence & Fraud vs Misrep',

    eveningPaperCode: 'Paper 1',
    eveningPaperShortName: 'Accounting',
    eveningChapterId: 'fnd_p1_ch4',
    eveningChapterTitle: 'Inventories Valuation & Depreciation Accounting',
    eveningSubtopics: [
      'Basis of Inventory Valuation: Cost vs Net Realizable Value (NRV) whichever is lower',
      'Inventory cost formulas: FIFO, Weighted Average Cost method',
      'Inventory Taking (Cut-off date procedures, physical count adjustments)',
      'Depreciation methods: Straight Line Method (SLM) vs Written Down Value (WDV)',
      'Change in method of depreciation (Prospective accounting)',
      'Disposal of asset & Provision for Depreciation Account',
    ],
    eveningSmModule: 'Module 1, Ch 4 & Ch 5',
    eveningPageRange: 'Pages 4.1 - 5.42',
    eveningIllustrations: 'SM Illustrations 1-10 on Physical Stocktaking & WDV',
    eveningRtpPyq: 'Nov 2024 RTP Q4, June 2024 PYQ Q2(b)',
    eveningBareAct: 'AS 2 (Valuation of Inventories) & AS 10 (PPE) Fundamentals',
    eveningFramework: FOUNDATION_FRAMEWORKS.accountsPresentationMethod,
    eveningMemory: 'Stock Valuation Reconciliation Table: Adjusted Purchases & Sales',
  },

  // Block 4: Sale of Goods Act (Morning) & Logical Reasoning (Evening)
  {
    morningPaperCode: 'Paper 2',
    morningPaperShortName: 'Law',
    morningChapterId: 'fnd_p2_ch3',
    morningChapterTitle: 'The Sale of Goods Act, 1930: Formation & Conditions/Warranties',
    morningSubtopics: [
      'Contract of Sale vs Agreement to Sell (Sec 4)',
      'Types of Goods: Existing, Specific, Ascertained, Generic, Future, Contingent',
      'Conditions vs Warranties (Sec 12) & When condition treated as warranty (Sec 13)',
      'Doctrine of Caveat Emptor (Buyer Beware) & 6 Critical Statutory Exceptions (Sec 16)',
    ],
    morningSmModule: 'Module 2, Ch 3, Unit 1 & 2',
    morningPageRange: 'Pages 3.1 - 3.32',
    morningIllustrations: 'Case Studies: Priest v Last, Grant v Australian Knitting Mills',
    morningRtpPyq: 'Nov 2024 RTP Q5, June 2024 Exam Q4(a)',
    morningBareAct: 'Sale of Goods Act 1930 Sec 4, 12-16',
    morningFramework: FOUNDATION_FRAMEWORKS.businessLawFramework,
    morningMemory: 'Caveat Emptor Acronym: F-I-T-S-S-F (Fitness, Merchantable, Sample, Title, Fraud)',

    eveningPaperCode: 'Paper 3',
    eveningPaperShortName: 'QA LR',
    eveningChapterId: 'fnd_p3_ch8',
    eveningChapterTitle: 'Logical Reasoning: Number Series, Direction Tests & Seating Arrangements',
    eveningSubtopics: [
      'Number series completion, missing terms, and odd-man-out identification',
      'Coding and Decoding patterns (Letter shifts, reverse alphabetical ranking)',
      'Direction sense tests (Cardinals N-S-E-W, angular turns, shadow concepts)',
      'Seating arrangements: Linear seating (North facing vs South facing)',
      'Circular seating arrangements (Facing center vs Facing outward)',
      'Blood relations: Family tree diagrams and coded relationship decoding',
    ],
    eveningSmModule: 'Module 2, Ch 9 - 12',
    eveningPageRange: 'Pages 9.1 - 12.35',
    eveningIllustrations: 'Comprehensive Exercise 9, 10, 11, 12 in ICAI SM',
    eveningRtpPyq: 'Nov 2024 RTP Q46-Q65, June 2024 LR Full Section',
    eveningBareAct: 'LR Elimination Grid & Cardinal Direction Compass',
    eveningFramework: FOUNDATION_FRAMEWORKS.qaFastCalculationMethod,
    eveningMemory: 'EJOTY (5-10-15-20-25) Alphabet Indexing Trick',
  },

  // Block 5: Sale of Goods & Unpaid Seller (Morning) & Final Accounts Sole Proprietor (Evening)
  {
    morningPaperCode: 'Paper 2',
    morningPaperShortName: 'Law',
    morningChapterId: 'fnd_p2_ch3',
    morningChapterTitle: 'The Sale of Goods Act, 1930: Transfer of Ownership & Unpaid Seller',
    morningSubtopics: [
      'Rules regarding transfer of property in goods (Sec 18-24)',
      'Nemo Dat Quod Non Habet (No one can give better title) & Exceptions',
      'Definition of Unpaid Seller (Sec 45) & Rights against goods (Lien, Stoppage in Transit, Resale)',
      'Right of stoppage in transit: Duration of transit & how stoppage is effected',
      'Rights of Unpaid Seller against the Buyer personally (Suit for price, damages, interest)',
    ],
    morningSmModule: 'Module 2, Ch 3, Unit 3 & 4',
    morningPageRange: 'Pages 3.33 - 3.65',
    morningIllustrations: 'Case Studies: Cundy v Lindsay, Folkes v King',
    morningRtpPyq: 'Nov 2024 RTP Q6, June 2024 Exam Q5',
    morningBareAct: 'Sale of Goods Act 1930 Sec 18-30, 45-54',
    morningFramework: FOUNDATION_FRAMEWORKS.businessLawFramework,
    morningMemory: 'Unpaid Seller 3 Rights against Goods: L-S-R (Lien, Stoppage, Resale)',

    eveningPaperCode: 'Paper 1',
    eveningPaperShortName: 'Accounting',
    eveningChapterId: 'fnd_p1_ch7',
    eveningChapterTitle: 'Preparation of Final Accounts of Sole Proprietors',
    eveningSubtopics: [
      'Preparation of Trading Account and Gross Profit determination',
      'Preparation of Profit and Loss Account and Operating vs Net Profit',
      'Closing entries & Year-end adjustments (Closing stock, Outstanding/Prepaid expenses)',
      'Provision for Doubtful Debts & Provision for Discount on Debtors computation',
      'Managerial commission calculation (Before vs After charging such commission)',
      'Preparation of Balance Sheet with marshalling of assets and liabilities',
    ],
    eveningSmModule: 'Module 2, Ch 7',
    eveningPageRange: 'Pages 7.1 - 7.55',
    eveningIllustrations: 'SM Comprehensive Illustrations 1 - 14',
    eveningRtpPyq: 'Nov 2024 RTP Q7, June 2024 Exam 15-Mark Problem',
    eveningBareAct: 'ICAI Guidance on Sole Proprietorship Financial Statements',
    eveningFramework: FOUNDATION_FRAMEWORKS.accountsPresentationMethod,
    eveningMemory: 'Provision for Doubtful Debts 4-Step Working Note (New PDD + Bad Debts - Old PDD)',
  },

  // Block 6: Partnership Act (Morning) & Statistics Central Tendency & Dispersion (Evening)
  {
    morningPaperCode: 'Paper 2',
    morningPaperShortName: 'Law',
    morningChapterId: 'fnd_p2_ch4',
    morningChapterTitle: 'The Indian Partnership Act, 1932: Nature & Relations of Partners',
    morningSubtopics: [
      'Definition of Partnership (Sec 4) & True test of partnership (Mutual Agency: Cox v Hickman)',
      'Partnership vs Co-ownership vs Joint Hindu Family vs Company',
      'Types of Partners: Active, Sleeping, Nominal, Partner by Estoppel/Holding out (Sec 28)',
      'Minor admitted to the benefits of partnership (Sec 30): Rights, liabilities, status on attaining majority',
      'Rights and duties of partners inter se & Implied authority of a partner (Sec 19-22)',
    ],
    morningSmModule: 'Module 2, Ch 4, Unit 1 & 2',
    morningPageRange: 'Pages 4.1 - 4.38',
    morningIllustrations: 'Landmark Case: Cox v Hickman',
    morningRtpPyq: 'Nov 2024 RTP Q7, June 2024 Exam Q3(b)',
    morningBareAct: 'Indian Partnership Act 1932 Sec 4, 6, 18-30',
    morningFramework: FOUNDATION_FRAMEWORKS.businessLawFramework,
    morningMemory: 'Mutual Agency Cardinal Rule: "Partner is both Principal and Agent"',

    eveningPaperCode: 'Paper 3',
    eveningPaperShortName: 'QA Stats',
    eveningChapterId: 'fnd_p3_ch10',
    eveningChapterTitle: 'Measures of Central Tendency and Dispersion',
    eveningSubtopics: [
      'Arithmetic Mean, Geometric Mean (GM), Harmonic Mean (HM) and AM >= GM >= HM relation',
      'Median, Mode, Quartiles, Deciles, Percentiles for grouped and continuous series',
      'Empirical relationship: Mode = 3 Median - 2 Mean',
      'Measures of Dispersion: Range, Quartile Deviation (Semi-Interquartile Range = (Q3-Q1)/2)',
      'Mean Deviation (MD) & Standard Deviation (SD / Root Mean Square Deviation)',
      'Properties of SD: Change of Origin vs Change of Scale (SD unaffected by shift of origin)',
      'Coefficient of Variation (CV = SD/Mean * 100) for consistency analysis',
    ],
    eveningSmModule: 'Module 2, Ch 14',
    eveningPageRange: 'Pages 14.1 - 14.62',
    eveningIllustrations: 'SM Exercises 14(A), 14(B), 14(C) Calculation shortcuts',
    eveningRtpPyq: 'Nov 2024 RTP Q66-Q80, June 2024 Stats Questions',
    eveningBareAct: 'Standard Deviation Formula & Scale Multiplier Rule: SD(y) = |b| * SD(x)',
    eveningFramework: FOUNDATION_FRAMEWORKS.qaFastCalculationMethod,
    eveningMemory: 'Properties of Dispersion Checklist: Origin No Effect, Scale Direct Effect',
  },

  // Block 7: Partnership Registration & Dissolution (Morning) & Partnership Accounts (Evening)
  {
    morningPaperCode: 'Paper 2',
    morningPaperShortName: 'Law',
    morningChapterId: 'fnd_p2_ch4',
    morningChapterTitle: 'The Indian Partnership Act, 1932: Registration & Dissolution of Firm',
    morningSubtopics: [
      'Registration of firms (Sec 58-59) & Effects of non-registration (Sec 69)',
      'Disabilities under Sec 69: Cannot sue third party, cannot claim set-off exceeding Rs 100',
      'Exceptions to non-registration disability',
      'Dissolution of firm vs Dissolution of partnership (Sec 39)',
      'Modes of dissolution: By agreement, Compulsory, Contingent, By notice, By Court (Sec 40-44)',
      'Settlement of partnership accounts on dissolution (Sec 48)',
    ],
    morningSmModule: 'Module 2, Ch 4, Unit 3',
    morningPageRange: 'Pages 4.39 - 4.65',
    morningIllustrations: 'Case Studies on Sec 69 disabilities and exceptions',
    morningRtpPyq: 'Nov 2024 RTP Q8, May 2024 Exam Q5(b)',
    morningBareAct: 'Indian Partnership Act 1932 Sec 39-48, 69',
    morningFramework: FOUNDATION_FRAMEWORKS.businessLawFramework,
    morningMemory: 'Sec 69 Three Disabilities: No Suit vs 3rd Party, No Suit between Partners, No Set-off >100',

    eveningPaperCode: 'Paper 1',
    eveningPaperShortName: 'Accounting',
    eveningChapterId: 'fnd_p1_ch10',
    eveningChapterTitle: 'Partnership Accounts: Admission, Retirement & Death of a Partner',
    eveningSubtopics: [
      'Profit sharing ratios: Sacrifice ratio & Gaining ratio computation',
      'Valuation & accounting treatment of Goodwill (AS 26 & Sacrificing/Gaining partner adjustment)',
      'Revaluation Account vs Memorandum Revaluation Account',
      'Adjustment of partners’ capitals based on new profit sharing ratio',
      'Retirement of partner: Settlement of retiring partner loan account',
      'Death of partner: Joint Life Policy (JLP) & Individual Life Policy, Profit till date of death',
    ],
    eveningSmModule: 'Module 2, Ch 10',
    eveningPageRange: 'Pages 10.1 - 10.70',
    eveningIllustrations: 'SM Comprehensive Illustrations on Admission cum Retirement',
    eveningRtpPyq: 'Nov 2024 RTP Q8, June 2024 15-Mark Partnership Question',
    eveningBareAct: 'AS 26 Intangible Assets (Goodwill not recorded unless consideration paid)',
    eveningFramework: FOUNDATION_FRAMEWORKS.accountsPresentationMethod,
    eveningMemory: 'Partnership Goodwill Adjustment Entry: Gaining Partners Dr. to Sacrificing Partners Cr.',
  },

  // Block 8: Companies Act 2013 (Morning) & Business Economics Demand & Supply (Evening)
  {
    morningPaperCode: 'Paper 2',
    morningPaperShortName: 'Law',
    morningChapterId: 'fnd_p2_ch6',
    morningChapterTitle: 'The Companies Act, 2013: Essential Features & Incorporation',
    morningSubtopics: [
      'Company definition (Sec 2(20)), Corporate Veil & Lifting of Corporate Veil',
      'Landmark Cases: Salomon v Salomon & Co Ltd, Lee v Lee\'s Air Farming Ltd',
      'Grounds for lifting corporate veil: Tax evasion (Sir Dinshaw Maneckjee Petit), Fraud/Sham company',
      'Types of companies: OPC (Sec 2(62)), Private (Sec 2(68)), Public (Sec 2(71)), Small (Sec 2(85)), Sec 8 Company',
      'Memorandum of Association (MoA) clauses & Doctrine of Ultra Vires',
      'Articles of Association (AoA) & Doctrine of Indoor Management (Royal British Bank v Turquand)',
    ],
    morningSmModule: 'Module 2, Ch 6',
    morningPageRange: 'Pages 6.1 - 6.45',
    morningIllustrations: 'Landmark Cases: Salomon, Turquand, Daimler Co Ltd',
    morningRtpPyq: 'Nov 2024 RTP Q9, June 2024 Exam Q6',
    morningBareAct: 'Companies Act 2013 Sec 2(62), 2(68), 2(71), 2(85), 4, 8, 399',
    morningFramework: FOUNDATION_FRAMEWORKS.businessLawFramework,
    morningMemory: 'Turquand Rule & 3 Exceptions: Suspicion of Irregularity, Forgery, Actual Knowledge',

    eveningPaperCode: 'Paper 4',
    eveningPaperShortName: 'Economics',
    eveningChapterId: 'fnd_p4_ch2',
    eveningChapterTitle: 'Theory of Demand, Supply & Consumer Behaviour',
    eveningSubtopics: [
      'Law of Demand, Demand Schedule & Factors determining Demand',
      'Price Elasticity of Demand: Percentage, Point, Arc, and Total Outlay Methods',
      'Income Elasticity (Normal, Inferior, Giffen goods) & Cross Elasticity (Substitutes vs Complements)',
      'Law of Diminishing Marginal Utility & Equi-Marginal Utility',
      'Indifference Curve analysis: Properties of IC, Marginal Rate of Substitution (MRS), Budget Line',
      'Consumer Equilibrium under IC approach (Tangency condition: MRSxy = Px/Py)',
      'Law of Supply, Elasticity of Supply, and Market Equilibrium price determination',
    ],
    eveningSmModule: 'Module 1, Ch 2',
    eveningPageRange: 'Pages 2.1 - 2.58',
    eveningIllustrations: 'SM Exercises 2(A), 2(B), 2(C) with Graph Interpretations',
    eveningRtpPyq: 'Nov 2024 RTP Q81-Q95, June 2024 Demand Elasticity MCQs',
    eveningBareAct: 'Microeconomic Consumer Theory Equations & Elasticity Rules',
    eveningFramework: FOUNDATION_FRAMEWORKS.economicsAnalyticalMethod,
    eveningMemory: 'Cross Elasticity Rule: Positive = Substitutes, Negative = Complements',
  },

  // Block 9: Negotiable Instruments Act (Morning) & Company Accounts Shares & Debentures (Evening)
  {
    morningPaperCode: 'Paper 2',
    morningPaperShortName: 'Law',
    morningChapterId: 'fnd_p2_ch7',
    morningChapterTitle: 'The Negotiable Instruments Act, 1881: Types, Negotiation & Dishonour',
    morningSubtopics: [
      'Meaning & Characteristics of Negotiable Instruments (Sec 13)',
      'Promissory Note (Sec 4) vs Bill of Exchange (Sec 5) vs Cheque (Sec 6)',
      'Holder (Sec 8) vs Holder in Due Course (HIDC - Sec 9) & Privileges of HIDC (Sec 36, 42, 43, 118)',
      'Negotiation (Sec 14), Types of Endorsements: Blank, Full, Restrictive, Conditional, Sans Recours',
      'Crossing of cheques: General (Sec 123) vs Special crossing (Sec 124) & Account Payee',
      'Dishonour of cheques for insufficiency of funds (Sec 138): Notice (30 days), Payment (15 days), Penalty',
    ],
    morningSmModule: 'Module 2, Ch 7',
    morningPageRange: 'Pages 7.1 - 7.42',
    morningIllustrations: 'Landmark cases on Sec 138 dishonour and HIDC status',
    morningRtpPyq: 'Nov 2024 RTP Q10, June 2024 Exam Q6(b)',
    morningBareAct: 'Negotiable Instruments Act 1881 Sec 4-10, 13, 15, 123, 138',
    morningFramework: FOUNDATION_FRAMEWORKS.businessLawFramework,
    morningMemory: 'Sec 138 Timeline: Notice in 30 days -> 15 days to pay -> File complaint in 1 month',

    eveningPaperCode: 'Paper 1',
    eveningPaperShortName: 'Accounting',
    eveningChapterId: 'fnd_p1_ch11',
    eveningChapterTitle: 'Company Accounts: Issue, Forfeiture & Re-issue of Shares & Debentures',
    eveningSubtopics: [
      'Types of share capital: Equity vs Preference shares',
      'Issue of shares at Par and at Premium (Sec 52 Securities Premium Account statutory uses)',
      'Pro-rata allotment in case of over-subscription & Calls-in-arrears / Calls-in-advance',
      'Forfeiture of shares issued at par vs issued at premium',
      'Re-issue of forfeited shares and transfer to Capital Reserve Account',
      'Issue of Debentures: As collateral security, redemption terms & discount on debentures written off',
    ],
    eveningSmModule: 'Module 2, Ch 11',
    eveningPageRange: 'Pages 11.1 - 11.68',
    eveningIllustrations: 'SM Pro-Rata & Forfeiture Comprehensive Table Illustrations 1-12',
    eveningRtpPyq: 'Nov 2024 RTP Q11, June 2024 Exam 15-Mark Share Capital Problem',
    eveningBareAct: 'Companies Act 2013 Sec 52(2) Permitted uses of Securities Premium',
    eveningFramework: FOUNDATION_FRAMEWORKS.accountsPresentationMethod,
    eveningMemory: 'Sec 52(2) 5 Uses: Bonus shares, Preliminary exp, Buyback, Premium on redemption, Commission/Discount',
  },

  // Block 10: LLP Act & Regulatory Framework (Morning) & Probability & Theoretical Distributions (Evening)
  {
    morningPaperCode: 'Paper 2',
    morningPaperShortName: 'Law',
    morningChapterId: 'fnd_p2_ch5',
    morningChapterTitle: 'The Limited Liability Partnership Act, 2008 & Indian Regulatory Framework',
    morningSubtopics: [
      'Meaning, Characteristics & Advantages of LLP (Body corporate, Perpetual succession, Separate entity)',
      'Designated Partners (Sec 7): Minimum 2 individuals, at least 1 resident in India',
      'Incorporation document & LLP Agreement (Sec 11, 23)',
      'Partner’s liability: Limited to agreed contribution, Exception: Unlimited liability in case of fraud (Sec 30)',
      'Overview of Indian Legal System: Ministry of Finance, MCA, RBI, SEBI, IRDAI, CCI regulatory roles',
    ],
    morningSmModule: 'Module 1, Ch 1 & Module 2, Ch 5',
    morningPageRange: 'Pages 1.1 - 1.20 & 5.1 - 5.35',
    morningIllustrations: 'Case scenarios on Designated partner qualifications and fraud liability',
    morningRtpPyq: 'Nov 2024 RTP Q12, June 2024 Exam Q2(c)',
    morningBareAct: 'LLP Act 2008 Sec 5, 6, 7, 11, 23, 30',
    morningFramework: FOUNDATION_FRAMEWORKS.businessLawFramework,
    morningMemory: 'LLP Key Numbers: Min 2 partners, No upper limit; Min 2 Designated Partners, 1 Resident',

    eveningPaperCode: 'Paper 3',
    eveningPaperShortName: 'QA Stats',
    eveningChapterId: 'fnd_p3_ch11',
    eveningChapterTitle: 'Probability Theory, Bayes Theorem & Theoretical Distributions',
    eveningSubtopics: [
      'Sample space, mutually exclusive, independent, and exhaustive events',
      'Classical vs Axiomatic Probability & Addition Theorem: P(A U B) = P(A) + P(B) - P(A n B)',
      'Conditional Probability P(A|B) & Multiplication Theorem: P(A n B) = P(B) * P(A|B)',
      'Bayes’ Theorem for revised/posterior probabilities',
      'Binomial Distribution: Mean = np, Variance = npq (Mean > Variance, uni/bimodal)',
      'Poisson Distribution: Parameter m, Mean = Variance = m, P(X=x) = (e^-m * m^x)/x!',
      'Normal Distribution: Bell-shaped, symmetric, Mean=Median=Mode, Area under curve (68%-95%-99.7%)',
    ],
    eveningSmModule: 'Module 2, Ch 15 & 16',
    eveningPageRange: 'Pages 15.1 - 16.48',
    eveningIllustrations: 'SM Exercises 15 & 16 with Z-Score Table lookups',
    eveningRtpPyq: 'Nov 2024 RTP Q81-Q95, June 2024 Exam Probability MCQs',
    eveningBareAct: 'Standard Normal Curve Z = (X - μ) / σ Properties',
    eveningFramework: FOUNDATION_FRAMEWORKS.qaFastCalculationMethod,
    eveningMemory: 'Normal Curve Area Rule: μ ± 1σ = 68.27%, μ ± 2σ = 95.45%, μ ± 3σ = 99.73%',
  },

  // Block 11: Business Economics Production & Markets (Morning) & NPO & Incomplete Records (Evening)
  {
    morningPaperCode: 'Paper 4',
    morningPaperShortName: 'Economics',
    morningChapterId: 'fnd_p4_ch3',
    morningChapterTitle: 'Production, Cost & Market Forms (Markets & Pricing)',
    morningSubtopics: [
      'Short-run Production Function & Law of Variable Proportions (3 Stages of Production)',
      'Long-run Production Function & Laws of Returns to Scale (Increasing, Constant, Diminishing)',
      'Short-run Cost Curves: TFC, TVC, TC, AFC, AVC, ATC, MC and their U-shape rationale',
      'Perfect Competition: Price taker, Horizontal demand curve (P = AR = MR), Equilibrium (MR = MC)',
      'Monopoly: Single seller, Downward sloping inelastic demand, Price discrimination (1st, 2nd, 3rd degree)',
      'Monopolistic Competition: Product differentiation, Selling costs, Excess capacity in long run',
      'Oligopoly: Few sellers, Interdependence, Kinked Demand Curve hypothesis (Paul Sweezy)',
    ],
    morningSmModule: 'Module 1, Ch 3 & Ch 4',
    morningPageRange: 'Pages 3.1 - 4.45',
    morningIllustrations: 'SM Exercises on Market Equilibrium and Kinked Demand Curve',
    morningRtpPyq: 'Nov 2024 RTP Q96-Q100, June 2024 Market Structure MCQs',
    morningBareAct: 'Microeconomic Cost & Revenue Curves Relationships (MC cuts AC at minimum)',
    morningFramework: FOUNDATION_FRAMEWORKS.economicsAnalyticalMethod,
    morningMemory: 'Market Spectrum Summary: Perfect (P=MC) -> Monopolistic -> Oligopoly (Kinked) -> Monopoly',

    eveningPaperCode: 'Paper 1',
    eveningPaperShortName: 'Accounting',
    eveningChapterId: 'fnd_p1_ch8',
    eveningChapterTitle: 'Financial Statements of Not-for-Profit Organisations (NPO) & Single Entry',
    eveningSubtopics: [
      'Receipts and Payments Account (Cash basis) vs Income and Expenditure Account (Accrual basis)',
      'Treatment of Subscriptions: Subscriptions received + Outstanding at end - Outstanding at beg',
      'Specific donations, General donations, Legacies, Entrance fees, and Life membership fees',
      'Preparation of Opening & Closing Balance Sheets for NPO with Capital/General Fund',
      'Accounts from Incomplete Records: Statement of Affairs method for finding Profit/Loss',
      'Conversion Method: Reconstructing Total Debtors, Total Creditors, and Cash/Bank accounts',
    ],
    eveningSmModule: 'Module 2, Ch 8 & Ch 9',
    eveningPageRange: 'Pages 8.1 - 9.48',
    eveningIllustrations: 'SM Comprehensive Subscription Account Ledger and Conversion illustrations',
    eveningRtpPyq: 'Nov 2024 RTP Q12, June 2024 Exam 10-Mark NPO Problem',
    eveningBareAct: 'ICAI Accounting Guidance on NPO Fund Based Accounting',
    eveningFramework: FOUNDATION_FRAMEWORKS.accountsPresentationMethod,
    eveningMemory: 'Subscription Ledger Format: Dr side (O/S Beg, Inc & Exp) | Cr side (Adv Beg, Bank, O/S End)',
  },

  // Block 12: Macroeconomics & Public Finance (Morning) & Correlation, Regression & Index Numbers (Evening)
  {
    morningPaperCode: 'Paper 4',
    morningPaperShortName: 'Economics',
    morningChapterId: 'fnd_p4_ch5',
    morningChapterTitle: 'National Income, Public Finance & Indian Economy',
    morningSubtopics: [
      'Concepts of National Income: GDP, GNP, NNP at Factor Cost vs Market Price',
      'Three methods of measuring National Income: Value Added (Output), Income, and Expenditure method',
      'Circular Flow of Income (Two-sector, Three-sector, Four-sector models)',
      'Keynesian Two-Sector model: Aggregate Demand, MPC, MPS, Investment Multiplier (K = 1 / (1 - MPC))',
      'Public Finance: Fiscal Policy instruments, Budget deficits (Fiscal Deficit, Revenue Deficit, Primary Deficit)',
      'Money Market: Quantitative & Qualitative credit controls of RBI (Repo, Reverse Repo, CRR, SLR)',
      'Post-1991 Economic Reforms: Liberalization, Privatization, Globalization (LPG), NITI Aayog',
    ],
    morningSmModule: 'Module 2, Ch 5 - 10',
    morningPageRange: 'Pages 5.1 - 10.50',
    morningIllustrations: 'SM Exercises on Investment Multiplier & GDP aggregates',
    morningRtpPyq: 'Nov 2024 RTP Q85-Q100, June 2024 Macroeconomics MCQs',
    morningBareAct: 'National Income Identities & Keynesian Consumption Function C = a + bY',
    morningFramework: FOUNDATION_FRAMEWORKS.economicsAnalyticalMethod,
    morningMemory: 'Multipliers: K = 1/(1-MPC) = 1/MPS; Balanced Budget Multiplier = 1',

    eveningPaperCode: 'Paper 3',
    eveningPaperShortName: 'QA Stats',
    eveningChapterId: 'fnd_p3_ch13',
    eveningChapterTitle: 'Correlation, Regression Analysis & Index Numbers',
    eveningSubtopics: [
      'Scatter diagram and Pearson\'s product moment correlation coefficient (r: -1 <= r <= 1)',
      'Properties of r: Independent of change of origin and scale',
      'Spearman’s rank correlation coefficient (R = 1 - (6 * Σd^2) / (n * (n^2 - 1)))',
      'Regression lines: Y on X (y - y_bar = byx * (x - x_bar)) and X on Y',
      'Properties of regression coefficients: r = ± sqrt(byx * bxy); both must have the same sign',
      'Index Numbers: Laspeyres (P01^L), Paasche (P01^P), Fisher’s Ideal Index (Geometric mean)',
      'Tests of adequacy: Time Reversal Test and Factor Reversal Test (Fisher satisfies both)',
    ],
    eveningSmModule: 'Module 2, Ch 17 & 18',
    eveningPageRange: 'Pages 17.1 - 18.35',
    eveningIllustrations: 'SM Exercises 17 & 18 with Fisher’s Ideal Index verification',
    eveningRtpPyq: 'Nov 2024 RTP Q85-Q100, June 2024 Correlation & Index Number MCQs',
    eveningBareAct: 'Regression Equations & Fisher Ideal Index Formula',
    eveningFramework: FOUNDATION_FRAMEWORKS.qaFastCalculationMethod,
    eveningMemory: 'Regression Rule: If byx > 1, then bxy must be < 1 because -1 <= r <= 1',
  },
];

export function generateFoundationRoadmapTillMay2027(
  startDateStr: string = '2026-10-26',
  examDateStr: string = '2027-05-01',
  portion: AttemptPortion = 'both'
): Record<string, DayPlan> {
  const result: Record<string, DayPlan> = {};
  const start = new Date(startDateStr);
  const examDate = new Date(`${examDateStr}T00:00:00`);

  const diffTime = Math.abs(examDate.getTime() - start.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let blocksToUse: any[] = CA_FOUNDATION_CURRICULUM_BLOCKS;
  if (portion === 'group1') {
    // Pure Module 1: Paper 1 (Accounting) + Paper 2 (Business Laws)
    blocksToUse = [
      CA_FOUNDATION_CURRICULUM_BLOCKS[0], // Law + Accounting Process
      CA_FOUNDATION_CURRICULUM_BLOCKS[2], // Law + BRS & Inventory
      CA_FOUNDATION_CURRICULUM_BLOCKS[4], // Law Sale of Goods + Final Accounts
      CA_FOUNDATION_CURRICULUM_BLOCKS[6], // Law Partnership + Partnership Accounts
      CA_FOUNDATION_CURRICULUM_BLOCKS[8], // Law Negotiable Instruments + Company Accounts Shares
      {
        ...CA_FOUNDATION_CURRICULUM_BLOCKS[7], // Morning Law Companies Act
        eveningPaperCode: CA_FOUNDATION_CURRICULUM_BLOCKS[10].eveningPaperCode,
        eveningPaperShortName: CA_FOUNDATION_CURRICULUM_BLOCKS[10].eveningPaperShortName,
        eveningChapterId: CA_FOUNDATION_CURRICULUM_BLOCKS[10].eveningChapterId,
        eveningChapterTitle: CA_FOUNDATION_CURRICULUM_BLOCKS[10].eveningChapterTitle,
        eveningSubtopics: CA_FOUNDATION_CURRICULUM_BLOCKS[10].eveningSubtopics,
        eveningSmModule: CA_FOUNDATION_CURRICULUM_BLOCKS[10].eveningSmModule,
        eveningPageRange: CA_FOUNDATION_CURRICULUM_BLOCKS[10].eveningPageRange,
        eveningIllustrations: CA_FOUNDATION_CURRICULUM_BLOCKS[10].eveningIllustrations,
        eveningRtpPyq: CA_FOUNDATION_CURRICULUM_BLOCKS[10].eveningRtpPyq,
        eveningBareAct: CA_FOUNDATION_CURRICULUM_BLOCKS[10].eveningBareAct,
        eveningFramework: CA_FOUNDATION_CURRICULUM_BLOCKS[10].eveningFramework,
        eveningMemory: CA_FOUNDATION_CURRICULUM_BLOCKS[10].eveningMemory,
      },
    ];
  } else if (portion === 'group2') {
    // Pure Module 2: Paper 3 (Quantitative Aptitude) + Paper 4 (Business Economics)
    blocksToUse = [
      {
        // Morning Economics (Demand & Supply) + Evening QA (Measures of Central Tendency)
        morningPaperCode: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningPaperCode,
        morningPaperShortName: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningPaperShortName,
        morningChapterId: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningChapterId,
        morningChapterTitle: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningChapterTitle,
        morningSubtopics: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningSubtopics,
        morningSmModule: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningSmModule,
        morningPageRange: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningPageRange,
        morningIllustrations: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningIllustrations,
        morningRtpPyq: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningRtpPyq,
        morningBareAct: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningBareAct,
        morningFramework: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningFramework,
        morningMemory: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningMemory,

        eveningPaperCode: CA_FOUNDATION_CURRICULUM_BLOCKS[5].eveningPaperCode,
        eveningPaperShortName: CA_FOUNDATION_CURRICULUM_BLOCKS[5].eveningPaperShortName,
        eveningChapterId: CA_FOUNDATION_CURRICULUM_BLOCKS[5].eveningChapterId,
        eveningChapterTitle: CA_FOUNDATION_CURRICULUM_BLOCKS[5].eveningChapterTitle,
        eveningSubtopics: CA_FOUNDATION_CURRICULUM_BLOCKS[5].eveningSubtopics,
        eveningSmModule: CA_FOUNDATION_CURRICULUM_BLOCKS[5].eveningSmModule,
        eveningPageRange: CA_FOUNDATION_CURRICULUM_BLOCKS[5].eveningPageRange,
        eveningIllustrations: CA_FOUNDATION_CURRICULUM_BLOCKS[5].eveningIllustrations,
        eveningRtpPyq: CA_FOUNDATION_CURRICULUM_BLOCKS[5].eveningRtpPyq,
        eveningBareAct: CA_FOUNDATION_CURRICULUM_BLOCKS[5].eveningBareAct,
        eveningFramework: CA_FOUNDATION_CURRICULUM_BLOCKS[5].eveningFramework,
        eveningMemory: CA_FOUNDATION_CURRICULUM_BLOCKS[5].eveningMemory,
      },
      {
        // Morning Economics (Production & Markets) + Evening QA (Probability & Distributions)
        morningPaperCode: CA_FOUNDATION_CURRICULUM_BLOCKS[10].morningPaperCode,
        morningPaperShortName: CA_FOUNDATION_CURRICULUM_BLOCKS[10].morningPaperShortName,
        morningChapterId: CA_FOUNDATION_CURRICULUM_BLOCKS[10].morningChapterId,
        morningChapterTitle: CA_FOUNDATION_CURRICULUM_BLOCKS[10].morningChapterTitle,
        morningSubtopics: CA_FOUNDATION_CURRICULUM_BLOCKS[10].morningSubtopics,
        morningSmModule: CA_FOUNDATION_CURRICULUM_BLOCKS[10].morningSmModule,
        morningPageRange: CA_FOUNDATION_CURRICULUM_BLOCKS[10].morningPageRange,
        morningIllustrations: CA_FOUNDATION_CURRICULUM_BLOCKS[10].morningIllustrations,
        morningRtpPyq: CA_FOUNDATION_CURRICULUM_BLOCKS[10].morningRtpPyq,
        morningBareAct: CA_FOUNDATION_CURRICULUM_BLOCKS[10].morningBareAct,
        morningFramework: CA_FOUNDATION_CURRICULUM_BLOCKS[10].morningFramework,
        morningMemory: CA_FOUNDATION_CURRICULUM_BLOCKS[10].morningMemory,

        eveningPaperCode: CA_FOUNDATION_CURRICULUM_BLOCKS[9].eveningPaperCode,
        eveningPaperShortName: CA_FOUNDATION_CURRICULUM_BLOCKS[9].eveningPaperShortName,
        eveningChapterId: CA_FOUNDATION_CURRICULUM_BLOCKS[9].eveningChapterId,
        eveningChapterTitle: CA_FOUNDATION_CURRICULUM_BLOCKS[9].eveningChapterTitle,
        eveningSubtopics: CA_FOUNDATION_CURRICULUM_BLOCKS[9].eveningSubtopics,
        eveningSmModule: CA_FOUNDATION_CURRICULUM_BLOCKS[9].eveningSmModule,
        eveningPageRange: CA_FOUNDATION_CURRICULUM_BLOCKS[9].eveningPageRange,
        eveningIllustrations: CA_FOUNDATION_CURRICULUM_BLOCKS[9].eveningIllustrations,
        eveningRtpPyq: CA_FOUNDATION_CURRICULUM_BLOCKS[9].eveningRtpPyq,
        eveningBareAct: CA_FOUNDATION_CURRICULUM_BLOCKS[9].eveningBareAct,
        eveningFramework: CA_FOUNDATION_CURRICULUM_BLOCKS[9].eveningFramework,
        eveningMemory: CA_FOUNDATION_CURRICULUM_BLOCKS[9].eveningMemory,
      },
      {
        // Morning Economics (National Income & Macro) + Evening QA (Correlation & Regression)
        morningPaperCode: CA_FOUNDATION_CURRICULUM_BLOCKS[11].morningPaperCode,
        morningPaperShortName: CA_FOUNDATION_CURRICULUM_BLOCKS[11].morningPaperShortName,
        morningChapterId: CA_FOUNDATION_CURRICULUM_BLOCKS[11].morningChapterId,
        morningChapterTitle: CA_FOUNDATION_CURRICULUM_BLOCKS[11].morningChapterTitle,
        morningSubtopics: CA_FOUNDATION_CURRICULUM_BLOCKS[11].morningSubtopics,
        morningSmModule: CA_FOUNDATION_CURRICULUM_BLOCKS[11].morningSmModule,
        morningPageRange: CA_FOUNDATION_CURRICULUM_BLOCKS[11].morningPageRange,
        morningIllustrations: CA_FOUNDATION_CURRICULUM_BLOCKS[11].morningIllustrations,
        morningRtpPyq: CA_FOUNDATION_CURRICULUM_BLOCKS[11].morningRtpPyq,
        morningBareAct: CA_FOUNDATION_CURRICULUM_BLOCKS[11].morningBareAct,
        morningFramework: CA_FOUNDATION_CURRICULUM_BLOCKS[11].morningFramework,
        morningMemory: CA_FOUNDATION_CURRICULUM_BLOCKS[11].morningMemory,

        eveningPaperCode: CA_FOUNDATION_CURRICULUM_BLOCKS[11].eveningPaperCode,
        eveningPaperShortName: CA_FOUNDATION_CURRICULUM_BLOCKS[11].eveningPaperShortName,
        eveningChapterId: CA_FOUNDATION_CURRICULUM_BLOCKS[11].eveningChapterId,
        eveningChapterTitle: CA_FOUNDATION_CURRICULUM_BLOCKS[11].eveningChapterTitle,
        eveningSubtopics: CA_FOUNDATION_CURRICULUM_BLOCKS[11].eveningSubtopics,
        eveningSmModule: CA_FOUNDATION_CURRICULUM_BLOCKS[11].eveningSmModule,
        eveningPageRange: CA_FOUNDATION_CURRICULUM_BLOCKS[11].eveningPageRange,
        eveningIllustrations: CA_FOUNDATION_CURRICULUM_BLOCKS[11].eveningIllustrations,
        eveningRtpPyq: CA_FOUNDATION_CURRICULUM_BLOCKS[11].eveningRtpPyq,
        eveningBareAct: CA_FOUNDATION_CURRICULUM_BLOCKS[11].eveningBareAct,
        eveningFramework: CA_FOUNDATION_CURRICULUM_BLOCKS[11].eveningFramework,
        eveningMemory: CA_FOUNDATION_CURRICULUM_BLOCKS[11].eveningMemory,
      },
      {
        // Morning Economics (Demand & Supply) + Evening QA (Ratio, Proportions & Logarithms)
        morningPaperCode: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningPaperCode,
        morningPaperShortName: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningPaperShortName,
        morningChapterId: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningChapterId,
        morningChapterTitle: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningChapterTitle,
        morningSubtopics: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningSubtopics,
        morningSmModule: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningSmModule,
        morningPageRange: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningPageRange,
        morningIllustrations: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningIllustrations,
        morningRtpPyq: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningRtpPyq,
        morningBareAct: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningBareAct,
        morningFramework: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningFramework,
        morningMemory: CA_FOUNDATION_CURRICULUM_BLOCKS[7].eveningMemory,

        eveningPaperCode: CA_FOUNDATION_CURRICULUM_BLOCKS[1].eveningPaperCode,
        eveningPaperShortName: CA_FOUNDATION_CURRICULUM_BLOCKS[1].eveningPaperShortName,
        eveningChapterId: CA_FOUNDATION_CURRICULUM_BLOCKS[1].eveningChapterId,
        eveningChapterTitle: CA_FOUNDATION_CURRICULUM_BLOCKS[1].eveningChapterTitle,
        eveningSubtopics: CA_FOUNDATION_CURRICULUM_BLOCKS[1].eveningSubtopics,
        eveningSmModule: CA_FOUNDATION_CURRICULUM_BLOCKS[1].eveningSmModule,
        eveningPageRange: CA_FOUNDATION_CURRICULUM_BLOCKS[1].eveningPageRange,
        eveningIllustrations: CA_FOUNDATION_CURRICULUM_BLOCKS[1].eveningIllustrations,
        eveningRtpPyq: CA_FOUNDATION_CURRICULUM_BLOCKS[1].eveningRtpPyq,
        eveningBareAct: CA_FOUNDATION_CURRICULUM_BLOCKS[1].eveningBareAct,
        eveningFramework: CA_FOUNDATION_CURRICULUM_BLOCKS[1].eveningFramework,
        eveningMemory: CA_FOUNDATION_CURRICULUM_BLOCKS[1].eveningMemory,
      },
    ];
  }

  const numCurriculumBlocks = blocksToUse.length;

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];
    const weekNumber = Math.floor(i / 7) + 1;

    let phase: DayPlan['phase'];
    if (i < 82) {
      phase = 'Phase 1: Foundation & ICAI SM';
    } else if (i < 141) {
      phase = 'Phase 2: R1 & RTPs/PYQ';
    } else if (i < 176) {
      phase = 'Phase 3: R2 & Mock Tests';
    } else {
      phase = 'Phase 4: Exam Marathon';
    }

    const blockIndex = i % numCurriculumBlocks;
    const b = blocksToUse[blockIndex];

    const morningLinks = generateTopicResources(
      b.morningPaperShortName,
      b.morningPaperCode,
      b.morningChapterTitle,
      b.morningSubtopics
    );

    const eveningLinks = generateTopicResources(
      b.eveningPaperShortName,
      b.eveningPaperCode,
      b.eveningChapterTitle,
      b.eveningSubtopics
    );

    const isPhase1 = phase.includes('Phase 1');
    const isPhase2 = phase.includes('Phase 2');
    const isPhase3 = phase.includes('Phase 3');

    let morningSubtopics = [...b.morningSubtopics];
    let eveningSubtopics = [...b.eveningSubtopics];

    if (isPhase2) {
      morningSubtopics = [
        `[R1 Focus] High-speed Bare Act recall: ${b.morningBareAct}`,
        `[RTP / PYQ Drill] ${b.morningRtpPyq}`,
        ...b.morningSubtopics.slice(0, 2),
      ];
      eveningSubtopics = [
        `[R1 Practical Test] Timed problem-solving under exam conditions`,
        `[ICAI SM Re-audit] Solve unmarked illustrations: ${b.eveningIllustrations}`,
        ...b.eveningSubtopics.slice(0, 2),
      ];
    } else if (isPhase3) {
      morningSubtopics = [
        `[R2 Super-Fast Review] Memory Flashcard drill for ${b.morningChapterTitle.slice(0, 25)}`,
        `[Mock Test Series 1] Full 100-mark paper presentation under 3-hour exam timer`,
        `[Key Mistake Log] Audit incorrect answers from past mock tests`,
      ];
      eveningSubtopics = [
        `[R2 Speed Run] 40 MCQs / Comprehensive practical question in 60 minutes`,
        `[Mock Test Series 2] Calculator speed and step-mark formatting test`,
        `[Formula Audit] Formulas, short notes, and adjustments summary`,
      ];
    } else if (!isPhase1) {
      // Phase 4: Final Exam Marathon
      morningSubtopics = [
        `[Final Marathon Day] 90-minute high-yield theory revision`,
        `[LDR - Last Day Revision] Highlighted provisions & section numbers`,
        `[Mental Rehearsal] Exam hall time allocation strategy`,
      ];
      eveningSubtopics = [
        `[Final Practical Marathon] Top 5 Category A comprehensive questions`,
        `[Formula Sheet Drill] Memorize essential formulas & calculator shortcuts`,
        `[Exam Readiness] Admit card, stationery, scientific calculator check`,
      ];
    }

    const morningTopic: ScheduledTopic = {
      id: `fnd_m_${dateStr}`,
      slot: 'morning',
      paperCode: b.morningPaperCode,
      paperShortName: b.morningPaperShortName,
      chapterId: b.morningChapterId,
      chapterTitle: b.morningChapterTitle,
      subtopics: morningSubtopics,
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
      links: morningLinks,
      framework: b.morningFramework,
      memoryTechnique: b.morningMemory,
      isCompleted: false,
    };

    const eveningTopic: ScheduledTopic = {
      id: `fnd_e_${dateStr}`,
      slot: 'evening',
      paperCode: b.eveningPaperCode,
      paperShortName: b.eveningPaperShortName,
      chapterId: b.eveningChapterId,
      chapterTitle: b.eveningChapterTitle,
      subtopics: eveningSubtopics,
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
      links: eveningLinks,
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

  return result;
}

export function generateInitialDailyFoundationSchedule(
  startDateStr: string = '2026-10-26',
  examDateStr: string = '2027-05-01',
  portion: AttemptPortion = 'both'
): Record<string, DayPlan> {
  return generateFoundationRoadmapTillMay2027(startDateStr, examDateStr, portion);
}
