import { DayPlan, ScheduledTopic, TopicExecutionFramework, TopicLinkReference } from '../types/ca-study';
import { generateTopicResources } from '../utils/topicResources';

export const FRAMEWORKS: Record<string, TopicExecutionFramework> = {
  theory3Pass: {
    name: 'ICAI Law & Theory 3-Pass Method (90m)',
    description: 'Structured statutory retention framework ensuring technical legal provisions, keywords, and drafting are mastered.',
    steps: [
      'Pass 1 (25m): Concept & Statutory Provisions - Read bare act / ICAI SM text and underline operative legal conditions.',
      'Pass 2 (30m): Keyword Extraction & Section Mapping - Formulate active memory hooks for essential legal keywords, penalty clauses, and exceptions.',
      'Pass 3 (35m): Answer Drafting Practice - Draft at least 1-2 descriptive case scenarios in writing without referencing solutions.',
    ],
    proTip: 'In ICAI Law, marks are strictly awarded for legal headings, section references, facts of the case, and concluding advice.',
  },
  practical4Step: {
    name: 'ICAI 4-Step Working Note Method (210m)',
    description: 'The gold-standard numerical presentation framework for Advanced Accounting, Costing, and Financial Management.',
    steps: [
      'Step 1 (30m): Question Dissection & Format Outline - Read question twice, identify hidden adjustments, and prepare the main format framework.',
      'Step 2 (80m): Working Notes Formulation - Solve all working notes first with crystal-clear numbering (W.N. 1, W.N. 2). ICAI step-marking rewards working notes heavily.',
      'Step 3 (60m): Main Solution Compilation - Transfer calculated figures into the final Balance Sheet, Cost Sheet, or Income Statement.',
      'Step 4 (40m): ICAI RTP / PYQ Verification & Speed Audit - Solve 1 unseen past exam question from RTP/MTP to lock in speed.',
    ],
    proTip: 'Step-marking guarantees 7-8 out of 10 marks even if your final ledger has a minor arithmetic slip. Never leave working notes untidy.',
  },
  taxationDual: {
    name: 'Direct & Indirect Tax Dual Computation Method',
    description: 'Systematic tax calculation ensuring provisions, exemptions, and net tax liability are verified.',
    steps: [
      'Step 1 (30m): Statutory Criteria & Thresholds - Check applicability of Section 115BAC (Default Regime) vs Old Regime, residential status, and GST turnover limits.',
      'Step 2 (40m): Head-wise / Supply-wise Inclusions - Calculate Gross Total Income / Output Tax liability after statutory deductions and exemptions.',
      'Step 3 (50m): Relief, Set-off & ITC Set-Off Order - Apply Section 70/71 loss rules or Rule 88A GST Input Tax Credit utilization sequence (IGST -> CGST -> SGST).',
      'Step 4 (30m): Advance Tax / TDS / Interest under Sec 234A/B/C and final round-off under Sec 288A/B.',
    ],
    proTip: 'Always state the relevant section number in Income Tax (e.g., Sec 54, 80C, 194C) and notification dates for recent amendments.',
  },
  auditAssertions: {
    name: 'Auditing & Ethics SA Assertion Breakdown',
    description: 'Assertion-based auditing technique aligned with ICAI Standards on Auditing (SA 200 - SA 700).',
    steps: [
      'Step 1 (40m): Standard on Auditing (SA) Scope & Objective - Identify applicable SA (e.g. SA 315, SA 500, SA 505) and core auditor responsibilities.',
      'Step 2 (40m): Financial Statement Assertions - Map procedures to Completeness, Occurrence, Measurement, Valuation, and Rights & Obligations.',
      'Step 3 (45m): Audit Documentation & Audit Evidence - Detail specific audit procedures (Inquiry, Inspection, Observation, External Confirmation, Recalculation).',
      'Step 4 (25m): Audit Reporting Impact - State implications on Auditor\'s Opinion (Clean, Qualified, Adverse, or Disclaimer of Opinion under SA 705).',
    ],
    proTip: 'Use technical ICAI audit terminology: "Sufficient and appropriate audit evidence", "Material misstatement", "Professional skepticism".',
  },
};

export const CURRICULUM_BLOCKS = [
  // Block 1: Corporate Law & Adv Accounts
  {
    morningPaperCode: 'Paper 2',
    morningPaperShortName: 'Law',
    morningChapterId: 'p2_ch6',
    morningChapterTitle: 'Management & Administration (Sec 88 - 122)',
    morningSubtopics: [
      'Section 96: Annual General Meeting (AGM) statutory timelines, extension by RoC',
      'Section 101 & 102: Length of notice (21 clear days) & Explanatory Statement',
      'Section 103: Quorum rules for Public Company (5, 15, 30) vs Private Company (2)',
      'Section 105: Proxies, rights, restrictions, and deposit of proxy forms 48 hours prior',
    ],
    morningSmModule: 'ICAI SM Module 2 (Companies Act 2013)',
    morningPageRange: 'Pages 7.8 – 7.34',
    morningIllustrations: 'Illustrations 1 to 5 & Test Your Knowledge Questions 1-4',
    morningRtpPyq: 'RTP Nov 2025 Case Scenario 2 & Past Exam May 2024 Q2(a)',
    morningBareAct: 'Companies Act 2013 Sec 96, 101, 102, 103, 105',
    morningFramework: FRAMEWORKS.theory3Pass,
    morningMemory: 'Ebbinghaus Day 1: Write down 21 clear days calculation & quorum table from memory.',
    morningLinks: [
      // FREE RESOURCES
      {
        id: 'link_m1_f1',
        title: 'ICAI BoS Knowledge Portal: Law Module 2 PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI Official (BoS)',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'link_m1_f2',
        title: 'YouTube: Management & Administration (Sec 88-122) Full Revision',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Shubham Singhal (The Ultimate CA)',
        url: 'https://www.youtube.com/results?search_query=CA+Inter+Law+Management+and+Administration+AGM+Notice+ICAI+Shubham+Singhal',
        videoId: 'CA_Inter_Law_Sec96',
        priceNote: 'Free YouTube Lecture',
      },
      {
        id: 'link_m1_f3',
        title: 'MCA e-Bare Act: Companies Act 2013 (Sec 96, 101, 103, 105)',
        type: 'bare_act' as const,
        costType: 'free' as const,
        provider: 'Ministry of Corporate Affairs',
        url: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html',
        priceNote: 'Free Official Statute',
      },
      // PAID RESOURCES
      {
        id: 'link_m1_p1',
        title: 'CA Inter Corporate Law Fast-Track / Regular Video Batch',
        type: 'paid_batch' as const,
        costType: 'paid' as const,
        provider: 'The Ultimate CA (CA Shubham Singhal)',
        url: 'https://www.google.com/search?q=CA+Inter+Corporate+Law+Shubham+Singhal+Batch',
        priceNote: 'Paid Video Batch (~₹4,500)',
      },
      {
        id: 'link_m1_p2',
        title: 'Taxmann CRACKER Corporate & Other Laws Scanner & Exam Questions',
        type: 'paid_book' as const,
        costType: 'paid' as const,
        provider: 'Taxmann Publications',
        url: 'https://www.google.com/search?q=Taxmann+Cracker+CA+Inter+Corporate+and+Other+Laws',
        priceNote: 'Paid Physical Book (~₹650)',
      },
      {
        id: 'link_m1_p3',
        title: 'CA Test Series: Law Chapter-wise Evaluated Mock Test',
        type: 'test_series' as const,
        costType: 'paid' as const,
        provider: 'CA Test Series / PrepCA',
        url: 'https://www.google.com/search?q=CA+Test+Series+Inter+Law+evaluated',
        priceNote: 'Paid Evaluated Test Series',
      },
    ],

    eveningPaperCode: 'Paper 1',
    eveningPaperShortName: 'Adv Accounts',
    eveningChapterId: 'p1_ch2',
    eveningChapterTitle: 'AS 1 & AS 2: Disclosure of Policies & Inventory Valuation',
    eveningSubtopics: [
      'AS 2: Cost of purchase, conversion costs, and excluded costs (storage, abnormal waste, admin)',
      'Net Realizable Value (NRV) determination for raw materials vs finished goods',
      'Joint products and by-product cost allocation techniques',
      'AS 1: Fundamental accounting assumptions & disclosure of accounting changes',
    ],
    eveningSmModule: 'ICAI SM Module 1 (Accounting Standards)',
    eveningPageRange: 'Pages 2.12 – 2.45',
    eveningIllustrations: 'Illustrations 3, 5, 8, 9 & 12 (NRV comparison problems)',
    eveningRtpPyq: 'RTP May 2025 AS 2 Question 1(a) (5 Marks)',
    eveningBareAct: 'Accounting Standard (AS) 2 & AS 1 framework',
    eveningFramework: FRAMEWORKS.practical4Step,
    eveningMemory: 'Formula sheet: Raw material written down to replacement cost ONLY if finished product is sold below cost.',
    eveningLinks: [
      // FREE RESOURCES
      {
        id: 'link_e1_f1',
        title: 'ICAI BoS Knowledge Portal: AS 2 Notes & Module PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI Official (BoS)',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'link_e1_f2',
        title: 'YouTube: AS 2 Inventory Valuation Full Numerical Marathon',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Nitin Goel / PW CA Wallah',
        url: 'https://www.youtube.com/results?search_query=AS+2+Valuation+of+Inventories+CA+Inter+Advanced+Accounting+Nitin+Goel',
        videoId: 'AS2_Inventory_Valuation',
        priceNote: 'Free YouTube Lecture',
      },
      {
        id: 'link_e1_f3',
        title: 'ICAI RTP & Suggested Answers AS 2 Compilation',
        type: 'notes' as const,
        costType: 'free' as const,
        provider: 'ICAI BoS Portal',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Solved Questions',
      },
      // PAID RESOURCES
      {
        id: 'link_e1_p1',
        title: 'CA Inter Advanced Accounting Regular / Fast-Track Batch',
        type: 'paid_batch' as const,
        costType: 'paid' as const,
        provider: 'Aldine CA (CA Parveen Sharma) / PW (CA Nitin Goel)',
        url: 'https://www.google.com/search?q=Parveen+Sharma+Aldine+CA+Inter+Advanced+Accounts',
        priceNote: 'Paid Video Batch (~₹7,000)',
      },
      {
        id: 'link_e1_p2',
        title: 'Taxmann CRACKER Advanced Accounting with AS Practical Solutions',
        type: 'paid_book' as const,
        costType: 'paid' as const,
        provider: 'Taxmann Publications (CA Ravi Kanth Miriyala)',
        url: 'https://www.google.com/search?q=Taxmann+Cracker+Advanced+Accounting+CA+Inter',
        priceNote: 'Paid Physical Book (~₹750)',
      },
      {
        id: 'link_e1_p3',
        title: 'PrepCA / CA Test Series: Advanced Accounts Evaluated Test Series',
        type: 'test_series' as const,
        costType: 'paid' as const,
        provider: 'PrepCA Mentorship',
        url: 'https://www.google.com/search?q=PrepCA+Advanced+Accounting+Test+Series',
        priceNote: 'Paid Chapter Test Series',
      },
    ],
  },

  // Block 2: Corporate Law Voting & Costing Material
  {
    morningPaperCode: 'Paper 2',
    morningPaperShortName: 'Law',
    morningChapterId: 'p2_ch6',
    morningChapterTitle: 'Management & Administration: Voting, Postal Ballot & Resolutions',
    morningSubtopics: [
      'Section 106 to 109: Voting by show of hands & poll demanded',
      'Section 110: Postal Ballot - mandatory items & electronic voting procedure (Sec 108)',
      'Section 114: Ordinary vs Special Resolutions - 3x votes in favour criteria',
      'Section 117 & 118: Filing of resolutions (MGT-14) within 30 days & Minutes book custody',
    ],
    morningSmModule: 'ICAI SM Module 2 (Companies Act 2013)',
    morningPageRange: 'Pages 7.35 – 7.62',
    morningIllustrations: 'Illustrations 6 to 10 & Case Studies 1-3',
    morningRtpPyq: 'RTP Nov 2024 Q2(b) Special Resolutions threshold',
    morningBareAct: 'Companies Act 2013 Sec 108, 110, 114, 117, 118',
    morningFramework: FRAMEWORKS.theory3Pass,
    morningMemory: 'Flashcard Rule: MGT-14 must be filed within 30 days of passing special resolution.',
    morningLinks: [
      // FREE
      {
        id: 'link_m2_f1',
        title: 'ICAI BoS: Resolutions & Meetings Notes PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI Official (BoS)',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'link_m2_f2',
        title: 'YouTube: Postal Ballot & e-Voting Sec 108/110 Explained',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Harsh Gupta',
        url: 'https://www.youtube.com/results?search_query=Sec+108+110+Postal+Ballot+CA+Inter+Law+Harsh+Gupta',
        priceNote: 'Free YouTube Lecture',
      },
      // PAID
      {
        id: 'link_m2_p1',
        title: 'CA Harsh Gupta Compact Batch / Fast-Track Lectures',
        type: 'paid_batch' as const,
        costType: 'paid' as const,
        provider: 'Harsh Gupta Classes',
        url: 'https://www.google.com/search?q=CA+Harsh+Gupta+Law+Fast+Track',
        priceNote: 'Paid Video Batch (~₹4,000)',
      },
      {
        id: 'link_m2_p2',
        title: 'Paduka / Suchitra Scanner: Corporate and Other Laws',
        type: 'paid_book' as const,
        costType: 'paid' as const,
        provider: 'Paduka Publications',
        url: 'https://www.google.com/search?q=Paduka+Scanner+CA+Inter+Law',
        priceNote: 'Paid Physical Book (~₹600)',
      },
    ],

    eveningPaperCode: 'Paper 4',
    eveningPaperShortName: 'Costing',
    eveningChapterId: 'p4_ch2',
    eveningChapterTitle: 'Material Cost (EOQ, Stock Levels & Stores Ledger)',
    eveningSubtopics: [
      'Economic Order Quantity (EOQ) formula √((2AO)/C) & price discount evaluation tables',
      'Re-order level (ROL), Minimum level, Maximum level, Average stock level & Danger level',
      'ABC Analysis, VED, FSN classification & Inventory turnover ratios',
      'Valuation of receipts, returns, normal vs abnormal loss in Stores Ledger (FIFO/Weighted Avg)',
    ],
    eveningSmModule: 'ICAI SM Module 1 (Cost & Management Accounting)',
    eveningPageRange: 'Pages 2.5 – 2.38',
    eveningIllustrations: 'Illustrations 4, 7, 11, 14 & TYU Practical Problems 2, 5, 8',
    eveningRtpPyq: 'Past Exam Nov 2023 Q1(b) (5 Marks) & RTP May 2026',
    eveningBareAct: 'Cost Accounting Standard (CAS) 6 - Material Cost',
    eveningFramework: FRAMEWORKS.practical4Step,
    eveningMemory: 'Formula check: ROL = Max Consumption * Max Reorder Period; Min Level = ROL - (Avg * Avg).',
    eveningLinks: [
      // FREE
      {
        id: 'link_e2_f1',
        title: 'ICAI BoS: Costing Material Module PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI Official (BoS)',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'link_e2_f2',
        title: 'YouTube: EOQ & Stock Levels Comprehensive Problems',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Pranav Popat / CA Namit Arora',
        url: 'https://www.youtube.com/results?search_query=Costing+Material+EOQ+stock+levels+CA+Inter+Pranav+Popat',
        priceNote: 'Free YouTube Lecture',
      },
      // PAID
      {
        id: 'link_e2_p1',
        title: 'CA Inter Cost & Management Accounting Regular Video Batch',
        type: 'paid_batch' as const,
        costType: 'paid' as const,
        provider: 'CA Rahul Garg / CA Namit Arora',
        url: 'https://www.google.com/search?q=CA+Rahul+Garg+Costing+Inter+batch',
        priceNote: 'Paid Video Batch (~₹6,500)',
      },
      {
        id: 'link_e2_p2',
        title: 'Taxmann CRACKER: Cost & Management Accounting Scanner',
        type: 'paid_book' as const,
        costType: 'paid' as const,
        provider: 'Taxmann Publications',
        url: 'https://www.google.com/search?q=Taxmann+Cracker+Costing+CA+Inter',
        priceNote: 'Paid Physical Book (~₹700)',
      },
    ],
  },

  // Block 3: Income Tax Residential Status & FM Ratio Analysis
  {
    morningPaperCode: 'Paper 3',
    morningPaperShortName: 'Taxation (DT)',
    morningChapterId: 'p3_ch1',
    morningChapterTitle: 'DT: Residential Status & Scope of Total Income (Sec 6)',
    morningSubtopics: [
      'Section 6(1): Basic conditions for Individuals (182 days / 60 days + 365 days) & 3 Exceptions',
      'Section 6(6): Resident and Ordinarily Resident (ROR) vs Resident but Not Ordinarily Resident (RNOR)',
      'Section 6(1A): Deemed resident provision for Indian citizens with income > ₹15 Lakhs',
      'Section 5: Scope of Total Income matrix for ROR, RNOR, and Non-Resident (NR)',
    ],
    morningSmModule: 'ICAI SM Module 1 (Income Tax Law)',
    morningPageRange: 'Pages 2.3 – 2.38',
    morningIllustrations: 'Illustrations 1 to 8 & Comprehensive Case Scenarios',
    morningRtpPyq: 'Past Exam Nov 2024 Q1(c) & RTP Nov 2025 Section 6(1A)',
    morningBareAct: 'Income Tax Act 1961 Section 5, 6(1), 6(1A), 6(6), 9(1)',
    morningFramework: FRAMEWORKS.taxationDual,
    morningMemory: 'Active Recall: Write the 3 categories where 60 days is replaced by 182 days under Sec 6(1).',
    morningLinks: [
      // FREE
      {
        id: 'link_m3_f1',
        title: 'ICAI BoS: Income Tax Residential Status SM PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI Official (BoS)',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'link_m3_f2',
        title: 'YouTube: Residential Status Sec 6 & Scope of Income ICAI Illustrations',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Vijay Sarda / CA Bhanwar Borana',
        url: 'https://www.youtube.com/results?search_query=Residential+Status+CA+Inter+Income+Tax+Section+6+Vijay+Sarda',
        priceNote: 'Free YouTube Lecture',
      },
      // PAID
      {
        id: 'link_m3_p1',
        title: 'BB Virtuals: Direct Tax Compact & Fast-Track Batch',
        type: 'paid_batch' as const,
        costType: 'paid' as const,
        provider: 'BB Virtuals (CA Bhanwar Borana)',
        url: 'https://www.google.com/search?q=Bhanwar+Borana+BB+Virtuals+CA+Inter+DT+Batch',
        priceNote: 'Paid Video Batch (~₹6,000)',
      },
      {
        id: 'link_m3_p2',
        title: 'BB Virtuals DT Compact Book & Practice Compiler (Aarohan)',
        type: 'paid_book' as const,
        costType: 'paid' as const,
        provider: 'BB Virtuals (CA Bhanwar Borana)',
        url: 'https://www.google.com/search?q=Bhanwar+Borana+Compact+Book+Compiler+CA+Inter',
        priceNote: 'Paid Physical Book (~₹800)',
      },
    ],

    eveningPaperCode: 'Paper 6',
    eveningPaperShortName: 'FM & SM',
    eveningChapterId: 'p6_ch3',
    eveningChapterTitle: 'FM: Financial Analysis and Planning: Ratio Analysis',
    eveningSubtopics: [
      'Liquidity Ratios: Current, Quick, Cash Ratio, Defensive Interval Ratio',
      'Solvency & Leverage Ratios: Debt-Equity, Debt to Total Assets, Interest Coverage, DSCR',
      'Turnover / Activity Ratios: Inventory Turnover, Debtor Turnover & Collection Period',
      'DuPont Analysis: 3-point and 5-point decomposition of Return on Equity (ROE)',
    ],
    eveningSmModule: 'ICAI SM Module 1 (Financial Management)',
    eveningPageRange: 'Pages 3.5 – 3.48',
    eveningIllustrations: 'Illustrations 5, 8, 12, 16 & Practical Problem 4 (Reverse Balance Sheet)',
    eveningRtpPyq: 'Past Exam May 2024 Q3(a) (10 Marks) Comprehensive Balance Sheet from Ratios',
    eveningBareAct: 'Financial Ratio Analysis Framework',
    eveningFramework: FRAMEWORKS.practical4Step,
    eveningMemory: 'Reverse Balance Sheet: Always calculate Net Worth and Current Assets first from GP & Quick ratio.',
    eveningLinks: [
      // FREE
      {
        id: 'link_e3_f1',
        title: 'ICAI BoS: Ratio Analysis Module PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI Official (BoS)',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'link_e3_f2',
        title: 'YouTube: Reverse Balance Sheet from Ratios 10 Marks ICAI PYQ',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Namit Arora',
        url: 'https://www.youtube.com/results?search_query=Ratio+Analysis+Reverse+Balance+Sheet+CA+Inter+FM+Namit+Arora',
        priceNote: 'Free YouTube Lecture',
      },
      // PAID
      {
        id: 'link_e3_p1',
        title: 'CA Inter FM-SM Complete Exam-Oriented Batch',
        type: 'paid_batch' as const,
        costType: 'paid' as const,
        provider: 'Swapnil Patni Classes / CA Namit Arora',
        url: 'https://www.google.com/search?q=CA+Namit+Arora+FM+SM+Batch',
        priceNote: 'Paid Video Batch (~₹6,000)',
      },
      {
        id: 'link_e3_p2',
        title: 'Taxmann CRACKER: Financial Management & Strategic Management',
        type: 'paid_book' as const,
        costType: 'paid' as const,
        provider: 'Taxmann Publications',
        url: 'https://www.google.com/search?q=Taxmann+Cracker+FM+SM+CA+Inter',
        priceNote: 'Paid Physical Book (~₹750)',
      },
    ],
  },

  // Block 4: Corporate Law Share Capital & Adv Accounts AS 10 (PPE)
  {
    morningPaperCode: 'Paper 2',
    morningPaperShortName: 'Law',
    morningChapterId: 'p2_ch3',
    morningChapterTitle: 'Share Capital and Debentures (Sec 43 – 72)',
    morningSubtopics: [
      'Section 43 & 48: Types of share capital & Variation of shareholders rights',
      'Section 52 & 53: Application of Securities Premium & Prohibition on discount',
      'Section 54: Sweat Equity Shares - conditions, valuation by registered valuer & lock-in',
      'Section 55: Redemption of Preference shares (CRR creation out of divisible profits)',
    ],
    morningSmModule: 'ICAI SM Module 1 (Companies Act 2013)',
    morningPageRange: 'Pages 4.5 – 4.35',
    morningIllustrations: 'Illustrations 2 to 7 & Practical Scenarios 1-4',
    morningRtpPyq: 'RTP Nov 2025 Section 52(2) Permissible Usages of Securities Premium',
    morningBareAct: 'Companies Act 2013 Sec 43, 52, 53, 54, 55',
    morningFramework: FRAMEWORKS.theory3Pass,
    morningMemory: 'Mnemonic for Sec 52(2) Securities Premium: B-P-P-P-B (Bonus, Prelim, Premium, Purchase buyback).',
    morningLinks: [
      // FREE
      {
        id: 'link_m4_f1',
        title: 'ICAI BoS: Share Capital & Debentures Notes PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI Official (BoS)',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'link_m4_f2',
        title: 'YouTube: Share Capital & Debentures Sec 43-72 Quick Revision',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Ankita Patni / CA Shubham Singhal',
        url: 'https://www.youtube.com/results?search_query=Share+Capital+and+Debentures+CA+Inter+Law+Shubham+Singhal',
        priceNote: 'Free YouTube Lecture',
      },
      // PAID
      {
        id: 'link_m4_p1',
        title: 'The Ultimate CA: Corporate Law Regular Batch + Colorful Notes',
        type: 'paid_batch' as const,
        costType: 'paid' as const,
        provider: 'CA Shubham Singhal',
        url: 'https://www.google.com/search?q=Shubham+Singhal+Corporate+Law+Notes+Batch',
        priceNote: 'Paid Video Batch (~₹4,500)',
      },
      {
        id: 'link_m4_p2',
        title: 'Paduka Practice Manual & Scanner: Corporate Laws',
        type: 'paid_book' as const,
        costType: 'paid' as const,
        provider: 'Paduka Publications',
        url: 'https://www.google.com/search?q=Paduka+Scanner+CA+Inter+Law',
        priceNote: 'Paid Physical Book (~₹650)',
      },
    ],

    eveningPaperCode: 'Paper 1',
    eveningPaperShortName: 'Adv Accounts',
    eveningChapterId: 'p1_ch3',
    eveningChapterTitle: 'AS 10: Property, Plant and Equipment (PPE)',
    eveningSubtopics: [
      'Initial measurement: Purchase price, directly attributable costs, and dismantling liability',
      'Subsequent costs: Day-to-day servicing vs replacement of parts & major inspection',
      'Component Accounting: Mandatory separate depreciation of significant parts with differing lives',
      'Revaluation Model vs Cost Model journal entries & Revaluation Surplus treatment',
    ],
    eveningSmModule: 'ICAI SM Module 1 (Accounting Standards)',
    eveningPageRange: 'Pages 2.50 – 2.92',
    eveningIllustrations: 'Illustrations 7, 10, 13, 17, 21 (Decommissioning & Component depreciation)',
    eveningRtpPyq: 'Past Exam May 2024 Q1(a) (5 Marks) & RTP May 2025 Q1',
    eveningBareAct: 'Accounting Standard (AS) 10 (Revised) Property, Plant and Equipment',
    eveningFramework: FRAMEWORKS.practical4Step,
    eveningMemory: 'Decommissioning provision is added to asset cost at initial PV, unwinding of discount is finance cost.',
    eveningLinks: [
      // FREE
      {
        id: 'link_e4_f1',
        title: 'ICAI BoS: AS 10 PPE Study Material PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI Official (BoS)',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'link_e4_f2',
        title: 'YouTube: AS 10 PPE Full Concept & Illustrations Marathon',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Nitin Goel / PW CA Wallah',
        url: 'https://www.youtube.com/results?search_query=AS+10+Property+Plant+and+Equipment+CA+Inter+Advanced+Accounting+Nitin+Goel',
        priceNote: 'Free YouTube Lecture',
      },
      // PAID
      {
        id: 'link_e4_p1',
        title: 'Aldine CA (CA Parveen Sharma) Advanced Accounts PenDrive Batch',
        type: 'paid_batch' as const,
        costType: 'paid' as const,
        provider: 'Aldine CA (CA Parveen Sharma)',
        url: 'https://www.google.com/search?q=Parveen+Sharma+Aldine+CA+Inter+Advanced+Accounts',
        priceNote: 'Paid Video Batch (~₹7,500)',
      },
      {
        id: 'link_e4_p2',
        title: 'Accounting Standards Made Easy (AS Book)',
        type: 'paid_book' as const,
        costType: 'paid' as const,
        provider: 'CA Ravi Kanth Miriyala (Bharat Law House)',
        url: 'https://www.google.com/search?q=Ravi+Kanth+Miriyala+Accounting+Standards+CA+Inter',
        priceNote: 'Paid Physical Book (~₹700)',
      },
    ],
  },

  // Block 5: DT Salaries Allowances & Costing Labour Incentives
  {
    morningPaperCode: 'Paper 3',
    morningPaperShortName: 'Taxation (DT)',
    morningChapterId: 'p3_ch2',
    morningChapterTitle: 'DT: Salaries (Head 1) - Allowances & Perquisites',
    morningSubtopics: [
      'House Rent Allowance (HRA) exemption under Sec 10(13A) & Rule 2A formula',
      'Children education, hostel allowance & transport allowance rules under Sec 10(14)',
      'Valuation of Rent-Free Accommodation (RFA) under Rule 3 for Govt vs Private employees',
      'Motor car perquisite valuation & Interest-free/concessional loan perquisite (SBI rate)',
    ],
    morningSmModule: 'ICAI SM Module 1 (Income Tax Law)',
    morningPageRange: 'Pages 3.10 – 3.52',
    morningIllustrations: 'Illustrations 6, 8, 11, 14 & 18 (RFA & HRA calculation)',
    morningRtpPyq: 'Past Exam Nov 2023 Q1(a) (14 Marks) Comprehensive Salary Problem',
    morningBareAct: 'Income Tax Act 1961 Sec 15, 16, 17 & Rules',
    morningFramework: FRAMEWORKS.taxationDual,
    morningMemory: 'HRA formula: Min of: (1) Actual, (2) Rent paid - 10% Salary, (3) 50% (Metro) or 40% (Non-Metro).',
    morningLinks: [
      // FREE
      {
        id: 'link_m5_f1',
        title: 'ICAI BoS: Salaries Chapter Module 1 PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI Official (BoS)',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'link_m5_f2',
        title: 'YouTube: Salaries Allowances & Perquisites Rule 3 Tricks',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Bhanwar Borana / CA Vijay Sarda',
        url: 'https://www.youtube.com/results?search_query=Salaries+Perquisites+Allowances+HRA+RFA+CA+Inter+Income+Tax+Bhanwar+Borana',
        priceNote: 'Free YouTube Lecture',
      },
      // PAID
      {
        id: 'link_m5_p1',
        title: 'BB Virtuals: Income Tax Regular / Booster Class',
        type: 'paid_batch' as const,
        costType: 'paid' as const,
        provider: 'CA Bhanwar Borana (BB Virtuals)',
        url: 'https://www.google.com/search?q=Bhanwar+Borana+Income+Tax+CA+Inter+Batch',
        priceNote: 'Paid Video Batch (~₹6,500)',
      },
      {
        id: 'link_m5_p2',
        title: 'Taxmann Direct Tax Laws with Practical Numerical Questions',
        type: 'paid_book' as const,
        costType: 'paid' as const,
        provider: 'Taxmann Publications (CA Vinod K. Singhania)',
        url: 'https://www.google.com/search?q=Taxmann+Direct+Tax+Students+Guide+Singhania',
        priceNote: 'Paid Physical Book (~₹850)',
      },
    ],

    eveningPaperCode: 'Paper 4',
    eveningPaperShortName: 'Costing',
    eveningChapterId: 'p4_ch3',
    eveningChapterTitle: 'Employee Cost (Labour Turnover & Incentive Schemes)',
    eveningSubtopics: [
      'Labour Turnover Measurement: Separation Method, Replacement Method, Flux Method',
      'Time Rate vs Piece Rate system & Differential Piece Rate (Taylor & Merrick plans)',
      'Halsey Premium Scheme (50% time saved bonus) vs Rowan Scheme formula',
      'Treatment of Idle Time (Normal vs Abnormal) and Overtime Premium in Cost Accounts',
    ],
    eveningSmModule: 'ICAI SM Module 1 (Costing)',
    eveningPageRange: 'Pages 3.5 – 3.35',
    eveningIllustrations: 'Illustrations 3, 5, 8, 10 & Practical Problem 3 (Rowan vs Halsey bonus)',
    eveningRtpPyq: 'RTP Nov 2024 Q3(b) (5 Marks) Rowan vs Halsey wage rate equalization',
    eveningBareAct: 'Cost Accounting Standard (CAS) 7 - Employee Cost',
    eveningFramework: FRAMEWORKS.practical4Step,
    eveningMemory: 'Rowan Bonus = (Time Saved / Time Allowed) * Time Taken * Hourly Rate. Total earnings = Basic + Bonus.',
    eveningLinks: [
      // FREE
      {
        id: 'link_e5_f1',
        title: 'ICAI BoS: Employee Costing PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI Official (BoS)',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'link_e5_f2',
        title: 'YouTube: Labour Costing Rowan & Halsey Incentive Schemes',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Rahul Garg / CA Nitin Guru',
        url: 'https://www.youtube.com/results?search_query=Costing+Labour+Rowan+Halsey+Incentives+CA+Inter+Rahul+Garg',
        priceNote: 'Free YouTube Lecture',
      },
      // PAID
      {
        id: 'link_e5_p1',
        title: 'CA Nitin Guru / CA Rahul Garg Costing Video Course',
        type: 'paid_batch' as const,
        costType: 'paid' as const,
        provider: 'Edu91 / Rahul Garg Classes',
        url: 'https://www.google.com/search?q=Nitin+Guru+Costing+CA+Inter',
        priceNote: 'Paid Video Batch (~₹5,500)',
      },
      {
        id: 'link_e5_p2',
        title: 'Taxmann CRACKER: Cost & Management Accounting',
        type: 'paid_book' as const,
        costType: 'paid' as const,
        provider: 'Taxmann Publications',
        url: 'https://www.google.com/search?q=Taxmann+Cracker+Costing+CA+Inter',
        priceNote: 'Paid Physical Book (~₹700)',
      },
    ],
  },

  // Block 6: Auditing SQC 1 / SA 200 & FM Cost of Capital (WACC)
  {
    morningPaperCode: 'Paper 5',
    morningPaperShortName: 'Audit & Ethics',
    morningChapterId: 'p5_ch1',
    morningChapterTitle: 'Nature, Scope & Ethics: SQC 1, SA 200 & SA 210',
    morningSubtopics: [
      'SA 200: Overall Objectives of the Independent Auditor & Reasonable Assurance',
      'Inherent Limitations of an Audit (Nature of reporting, procedures, cost/benefit balance)',
      'Professional Skepticism & Professional Judgment definition and application examples',
      'SA 210: Agreeing the Terms of Audit Engagements & Preconditions for an Audit',
    ],
    morningSmModule: 'ICAI SM Module 1 (Auditing and Ethics)',
    morningPageRange: 'Pages 1.4 – 1.38',
    morningIllustrations: 'Concept Review Questions 1-6 & Case Scenarios 1-3',
    morningRtpPyq: 'RTP May 2026 Q1(a) (5 Marks) & Past Exam May 2024 Q1(a)',
    morningBareAct: 'SQC 1, SA 200, SA 210',
    morningFramework: FRAMEWORKS.auditAssertions,
    morningMemory: 'SQC 1 Elements Mnemonic: L-E-A-H-E-M (Leadership, Ethics, Acceptance, HR, Engagement, Monitoring).',
    morningLinks: [
      // FREE
      {
        id: 'link_m6_f1',
        title: 'ICAI BoS: Auditing & Ethics Module 1 PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI Official (BoS)',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'link_m6_f2',
        title: 'YouTube: SA 200 & SQC 1 Masterclass for CA Inter',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Neeraj Arora (Edu91)',
        url: 'https://www.youtube.com/results?search_query=SA+200+SQC+1+CA+Inter+Audit+Ethics+Neeraj+Arora',
        priceNote: 'Free YouTube Lecture',
      },
      // PAID
      {
        id: 'link_m6_p1',
        title: 'Edu91 (CA Neeraj Arora) Audit Guru Fast-Track / Regular Batch',
        type: 'paid_batch' as const,
        costType: 'paid' as const,
        provider: 'Edu91 (CA Neeraj Arora)',
        url: 'https://www.google.com/search?q=Neeraj+Arora+Audit+Guru+Edu91',
        priceNote: 'Paid Video Batch (~₹4,500)',
      },
      {
        id: 'link_m6_p2',
        title: 'Taxmann CRACKER: Auditing & Ethics with Detailed Point-wise Answers',
        type: 'paid_book' as const,
        costType: 'paid' as const,
        provider: 'Taxmann (CA Pankaj Garg)',
        url: 'https://www.google.com/search?q=Pankaj+Garg+Taxmann+Cracker+Audit+CA+Inter',
        priceNote: 'Paid Physical Book (~₹680)',
      },
    ],

    eveningPaperCode: 'Paper 6',
    eveningPaperShortName: 'FM & SM',
    eveningChapterId: 'p6_ch4',
    eveningChapterTitle: 'FM: Cost of Capital (Ke, Kd, Kp, Kr & WACC)',
    eveningSubtopics: [
      'Cost of Redeemable Debt (Kd) post-tax approximation formula [I(1-t) + (RV-NP)/n] / [(RV+NP)/2]',
      'Cost of Preference Shares (Kp) with flotation costs & redemption premium amortization',
      'Cost of Equity (Ke): Dividend Growth Model (Gordon) & CAPM (Rf + β(Rm - Rf))',
      'Weighted Average Cost of Capital (WACC): Book Value weights vs Market Value weights',
    ],
    eveningSmModule: 'ICAI SM Module 1 (Financial Management)',
    eveningPageRange: 'Pages 4.5 – 4.45',
    eveningIllustrations: 'Illustrations 6, 9, 13, 17, 21 (Comprehensive WACC market value weights)',
    eveningRtpPyq: 'Past Exam Nov 2024 Q2(a) (10 Marks) & RTP Nov 2025 Q4',
    eveningBareAct: 'Cost of Capital Computation Principles',
    eveningFramework: FRAMEWORKS.practical4Step,
    eveningMemory: 'In WACC Market Value weights: Retained earnings are already subsumed inside Equity market capitalization.',
    eveningLinks: [
      // FREE
      {
        id: 'link_e6_f1',
        title: 'ICAI BoS: Cost of Capital Module PDF',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI Official (BoS)',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official Study Material',
      },
      {
        id: 'link_e6_f2',
        title: 'YouTube: Cost of Capital WACC Complete ICAI Questions',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Namit Arora / CA Pranav Popat',
        url: 'https://www.youtube.com/results?search_query=Cost+of+Capital+WACC+CA+Inter+FM+Namit+Arora',
        priceNote: 'Free YouTube Lecture',
      },
      // PAID
      {
        id: 'link_e6_p1',
        title: 'CA Namit Arora / Swapnil Patni FM-SM Exam Booster Course',
        type: 'paid_batch' as const,
        costType: 'paid' as const,
        provider: 'Swapnil Patni Classes',
        url: 'https://www.google.com/search?q=Swapnil+Patni+FM+SM+CA+Inter+batch',
        priceNote: 'Paid Video Batch (~₹5,500)',
      },
      {
        id: 'link_e6_p2',
        title: 'Taxmann CRACKER: FM & SM with Formula Charts',
        type: 'paid_book' as const,
        costType: 'paid' as const,
        provider: 'Taxmann Publications',
        url: 'https://www.google.com/search?q=Taxmann+Cracker+FM+SM+CA+Inter',
        priceNote: 'Paid Physical Book (~₹750)',
      },
    ],
  },

  // Block 7: Accounts of Companies & AS 10 PPE / AS 16 Borrowing Costs
  {
    morningPaperCode: 'Paper 2',
    morningPaperShortName: 'Law',
    morningChapterId: 'p2_ch8',
    morningChapterTitle: 'Accounts of Companies & CSR (Sec 128 - 138)',
    morningSubtopics: [
      'Section 128: Books of account to be kept by company, accrual basis & double entry',
      'Section 129: Financial Statements, true and fair view, Schedule III compliance',
      'Section 135: Corporate Social Responsibility (CSR) threshold criteria & 2% spending formula',
      'Section 134: Board Report statutory disclosures, director responsibility statement',
    ],
    morningSmModule: 'ICAI SM Module 2 (Companies Act 2013)',
    morningPageRange: 'Pages 9.4 – 9.42',
    morningIllustrations: 'Illustrations 1 to 6 & Practical Case Scenarios',
    morningRtpPyq: 'Past Exam Nov 2024 CSR Question 4(a)',
    morningBareAct: 'Companies Act 2013 Sec 128, 129, 134, 135',
    morningFramework: FRAMEWORKS.theory3Pass,
    morningMemory: 'CSR Threshold formula: Net Worth >= 500 Cr OR Turnover >= 1000 Cr OR Net Profit >= 5 Cr.',
    morningLinks: [],

    eveningPaperCode: 'Paper 1',
    eveningPaperShortName: 'Adv Accounts',
    eveningChapterId: 'p1_ch3',
    eveningChapterTitle: 'AS 10: Property, Plant and Equipment & AS 16 Borrowing Costs',
    eveningSubtopics: [
      'AS 10: Initial measurement, capitalized dismantling costs & exchange of assets',
      'Revaluation model vs Cost model, treatment of revaluation reserve on disposal',
      'Component depreciation method & revision of useful life',
      'AS 16: Qualifying asset criteria, specific vs general borrowing capitalization rate',
    ],
    eveningSmModule: 'ICAI SM Module 1 (Accounting Standards)',
    eveningPageRange: 'Pages 3.10 – 3.55',
    eveningIllustrations: 'Illustrations 4, 7, 11, 15 & Comprehensive past questions',
    eveningRtpPyq: 'RTP Nov 2025 AS 10 Question 1(a)',
    eveningBareAct: 'Accounting Standard 10 & 16',
    eveningFramework: FRAMEWORKS.practical4Step,
    eveningMemory: 'Capitalization of borrowing costs ceases when substantially all activities necessary to prepare qualifying asset are complete.',
    eveningLinks: [],
  },

  // Block 8: Taxation PGBP & Costing Overheads / ABC Costing
  {
    morningPaperCode: 'Paper 3',
    morningPaperShortName: 'Taxation',
    morningChapterId: 'p3_ch4',
    morningChapterTitle: 'DT: Profits and Gains of Business or Profession (PGBP - Head 3)',
    morningSubtopics: [
      'Section 32: Depreciation block of assets rules & Additional Depreciation @ 20%',
      'Section 35: Scientific research expenditure deduction provisions',
      'Section 40(a)(ia) & 40A(3): TDS non-compliance disallowance (30%) & Cash payment limit (Rs 10,000)',
      'Section 44AD / 44ADA: Presumptive taxation scheme for small businesses & professionals',
    ],
    morningSmModule: 'ICAI SM Module 1 (Income Tax Law)',
    morningPageRange: 'Pages 4.80 – 4.140',
    morningIllustrations: 'Comprehensive Business Income Computation Questions 3-8',
    morningRtpPyq: 'Past Exam May 2025 PGBP Case Question 1',
    morningBareAct: 'Income Tax Act 1961 Sec 28 to 44DB',
    morningFramework: FRAMEWORKS.taxationDual,
    morningMemory: 'Depreciation Block: Opening WDV + Additions - Sales proceeds. Half rate if asset acquired and used < 180 days.',
    morningLinks: [],

    eveningPaperCode: 'Paper 4',
    eveningPaperShortName: 'Costing',
    eveningChapterId: 'p4_ch4',
    eveningChapterTitle: 'Overheads & Activity Based Costing (ABC Costing)',
    eveningSubtopics: [
      'Primary & Secondary apportionment of overheads (Repeated Distribution & Simultaneous Equation)',
      'Computation of Machine Hour Rate (Standing charges vs Running charges)',
      'Under/Over Absorption of overheads treatment (Supplementary rate vs Costing P&L)',
      'ABC Costing: Resource cost drivers vs Activity cost drivers & Cost Pool calculation',
    ],
    eveningSmModule: 'ICAI SM Module 1 (Cost Accounting)',
    eveningPageRange: 'Pages 4.10 – 4.60',
    eveningIllustrations: 'Illustrations 5, 8, 12, 17 (Machine hour rate & ABC comparison)',
    eveningRtpPyq: 'RTP May 2025 ABC Costing Question 3',
    eveningBareAct: 'CAS 3 (Overheads) & CAS 22',
    eveningFramework: FRAMEWORKS.practical4Step,
    eveningMemory: 'Under/Over absorption due to normal reasons goes to Cost of Sales, abnormal goes straight to Costing P&L.',
    eveningLinks: [],
  },

  // Block 9: Audit Risk Assessment SA 315 & FM Capital Budgeting
  {
    morningPaperCode: 'Paper 5',
    morningPaperShortName: 'Audit & Ethics',
    morningChapterId: 'p5_ch3',
    morningChapterTitle: 'Risk Assessment & Internal Control: SA 315 & SA 330',
    morningSubtopics: [
      'SA 315: Identifying and Assessing the Risks of Material Misstatement',
      'Components of Internal Control (Control Environment, Risk Assessment, Information System, Monitoring)',
      'Tests of Controls (ToC) vs Substantive Procedures',
      'SA 330: The Auditor’s Responses to Assessed Risks',
    ],
    morningSmModule: 'ICAI SM Module 1 (Auditing and Ethics)',
    morningPageRange: 'Pages 3.5 – 3.48',
    morningIllustrations: 'Scenario-based Internal Control evaluation cases',
    morningRtpPyq: 'Past Exam Nov 2024 SA 315 Question 3(b)',
    morningBareAct: 'SA 315 & SA 330',
    morningFramework: FRAMEWORKS.auditAssertions,
    memoryTechnique: 'Control Risk x Inherent Risk = Risk of Material Misstatement (RMM). Detection risk must be reduced to an acceptably low level.',
    morningMemory: 'RMM = Inherent Risk x Control Risk. Audit Risk = RMM x Detection Risk.',
    morningLinks: [],

    eveningPaperCode: 'Paper 6',
    eveningPaperShortName: 'FM & SM',
    eveningChapterId: 'p6_ch7',
    eveningChapterTitle: 'FM: Investment Decisions - Capital Budgeting (NPV, IRR & PI)',
    eveningSubtopics: [
      'Calculation of Net Present Value (NPV) with working capital recovery & salvage value',
      'Internal Rate of Return (IRR) interpolation formula: L + [NPV(L) / (NPV(L) - NPV(H))] * (H - L)',
      'Profitability Index (PI) for project rationing under capital constraints',
      'Discounted Payback Period vs Traditional Payback Period',
    ],
    eveningSmModule: 'ICAI SM Module 2 (Financial Management)',
    eveningPageRange: 'Pages 7.8 – 7.62',
    eveningIllustrations: 'Illustrations 5, 9, 14, 19 & Complex Replacement Decision Problems',
    eveningRtpPyq: 'Past Exam May 2024 Capital Budgeting Question 3(a)',
    eveningBareAct: 'Capital Budgeting Discounted Cash Flow Techniques',
    eveningFramework: FRAMEWORKS.practical4Step,
    eveningMemory: 'When NPV and IRR conflict in mutually exclusive projects, always accept the project with higher positive NPV (wealth maximization).',
    eveningLinks: [],
  },

  // Block 10: Law Audit & Auditors & Adv Accounts Buyback / Reconstruction
  {
    morningPaperCode: 'Paper 2',
    morningPaperShortName: 'Law',
    morningChapterId: 'p2_ch9',
    morningChapterTitle: 'Audit and Auditors (Sec 139 to 148)',
    morningSubtopics: [
      'Section 139: Appointment of statutory auditor (Tenure of 5 consecutive years, rotation rules)',
      'Section 140: Removal, resignation of auditor and giving of special notice',
      'Section 141: Qualifications, disqualifications and ceiling limit on audit engagements (20 audits)',
      'Section 148: Central Government power to specify audit of cost records',
    ],
    morningSmModule: 'ICAI SM Module 2 (Companies Act 2013)',
    morningPageRange: 'Pages 10.4 – 10.36',
    morningIllustrations: 'Illustrations 1 to 5 & TYK Disqualification Questions',
    morningRtpPyq: 'RTP Nov 2025 Auditor Disqualification Question 2',
    morningBareAct: 'Companies Act 2013 Sec 139, 140, 141, 142, 143, 148',
    morningFramework: FRAMEWORKS.theory3Pass,
    morningMemory: 'Indebtedness disqualification limit: Relative indebtedness exceeding Rs 5,00,000 disqualifies the auditor under Sec 141(3)(d).',
    morningLinks: [],

    eveningPaperCode: 'Paper 1',
    eveningPaperShortName: 'Adv Accounts',
    eveningChapterId: 'p1_ch10',
    eveningChapterTitle: 'Buyback of Securities & Internal Reconstruction of Companies',
    eveningSubtopics: [
      'Section 68: Buyback condition tests (Resource test, Share outstanding test, Debt-equity test 2:1)',
      'Accounting entries for Buyback of Equity Shares using Free Reserves and Securities Premium',
      'Internal Reconstruction: Capital Reduction Account accounting & scheme entries',
      'Surrender of shares by creditors and conversion into equity',
    ],
    eveningSmModule: 'ICAI SM Module 3 (Advanced Accounting)',
    eveningPageRange: 'Pages 10.5 – 10.45',
    eveningIllustrations: 'Illustrations 2, 4, 6 (Comprehensive Capital Reduction balance sheet)',
    eveningRtpPyq: 'Past Exam May 2024 Reconstruction Question 2(b)',
    eveningBareAct: 'Companies Act 2013 Sec 68 & Accounting Standards',
    eveningFramework: FRAMEWORKS.practical4Step,
    eveningMemory: 'Credit balance left in Capital Reduction Account on completion of scheme must be transferred to Capital Reserve Account.',
    eveningLinks: [],
  },

  // Block 11: Sunday Spaced Repetition Buffer & Interleaved Testing
  {
    morningPaperCode: 'Paper 2 & 5',
    morningPaperShortName: 'Theory Buffer',
    morningChapterId: 'p2_ch6',
    morningChapterTitle: 'Sunday Spaced Repetition: Company Law & Audit Recall Test',
    morningSubtopics: [
      'Write from memory 4 past descriptive questions on Sec 96 AGM, Sec 103 Quorum & Sec 114 Resolutions',
      'Speed recall test: SA 200 Inherent Limitations & Professional Skepticism (15m strict timer)',
      'Section number flashcard verification (Sec 43, 52, 54, 55, 96, 101, 103, 105, 114)',
    ],
    morningSmModule: 'ICAI Suggested Answers & Past 5 Exam Papers',
    morningPageRange: 'Selected Past Papers 2023 - 2025',
    morningIllustrations: 'Full 16 Marks descriptive writing test',
    morningRtpPyq: 'ICAI Suggested Answers May 2024 Exam Paper',
    morningBareAct: 'Companies Act 2013 & SAs',
    morningFramework: FRAMEWORKS.theory3Pass,
    morningMemory: 'Sunday Spaced Retrieval: Do not look at answers until you have written 2 full pages by hand.',
    morningLinks: [
      // FREE
      {
        id: 'link_m7_f1',
        title: 'ICAI BoS: Past Exam Question Papers with Suggested Answers',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI Official (BoS)',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Past Papers & Solutions',
      },
      {
        id: 'link_m7_f2',
        title: 'YouTube: How to Present Law & Audit Answers in ICAI Exams',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Exam Guidance / Topper Analysis',
        url: 'https://www.youtube.com/results?search_query=How+to+write+Law+and+Audit+answers+ICAI+CA+Inter+presentation+tips',
        priceNote: 'Free Strategy Guide',
      },
      // PAID
      {
        id: 'link_m7_p1',
        title: 'CA Test Series: Full 100-Marks Evaluated Simulation Test',
        type: 'test_series' as const,
        costType: 'paid' as const,
        provider: 'CA Test Series',
        url: 'https://www.google.com/search?q=CA+Test+Series+Full+Syllabus+Mock+Test',
        priceNote: 'Paid Evaluated Test (~₹1,500/subject)',
      },
      {
        id: 'link_m7_p2',
        title: 'Taxmann Scanner / Cracker Combo Pack for Group 1 & Group 2',
        type: 'paid_book' as const,
        costType: 'paid' as const,
        provider: 'Taxmann Publications',
        url: 'https://www.google.com/search?q=Taxmann+Cracker+Combo+Pack+CA+Inter',
        priceNote: 'Paid Physical Compilers (~₹2,400)',
      },
    ],

    eveningPaperCode: 'Paper 1 & 4',
    eveningPaperShortName: 'Practical Buffer',
    eveningChapterId: 'p1_ch3',
    eveningChapterTitle: 'Sunday Numerical Marathon: AS 10 & Costing Material Decisions',
    eveningSubtopics: [
      'Solve 3 comprehensive past exam problems on AS 10 Property, Plant & Equipment (Full Working Notes)',
      'Solve 2 multi-tiered EOQ price discount decision tables without reference book',
      'Verify working note formatting, step numbering, and disclosure presentation',
    ],
    eveningSmModule: 'ICAI Compilation of Past 5 Examination Papers',
    eveningPageRange: 'Exam Papers 2022 to 2025',
    eveningIllustrations: 'Questions 1(a), 2(b), 4(a) under timed conditions',
    eveningRtpPyq: 'RTP Compilation 2024 - 2025',
    eveningBareAct: 'AS 10 & CAS 6',
    eveningFramework: FRAMEWORKS.practical4Step,
    eveningMemory: 'Practical Interleaving: Switching between AS 10 ledger and Costing EOQ reinforces mathematical agility.',
    eveningLinks: [
      // FREE
      {
        id: 'link_e7_f1',
        title: 'ICAI BoS: RTP & MTP Question Compilations',
        type: 'icai_sm' as const,
        costType: 'free' as const,
        provider: 'ICAI Official (BoS)',
        url: 'https://www.icai.org/post/bos-knowledge-portal',
        priceNote: 'Free Official MTP/RTP Compilation',
      },
      {
        id: 'link_e7_f2',
        title: 'YouTube: Top 5 Tricky Problems in AS 10 & Costing',
        type: 'youtube' as const,
        costType: 'free' as const,
        provider: 'CA Wallah / Unacademy CA',
        url: 'https://www.youtube.com/results?search_query=Top+Tricky+Illustrations+AS+10+Costing+CA+Inter',
        priceNote: 'Free YouTube Lecture',
      },
      // PAID
      {
        id: 'link_e7_p1',
        title: 'PrepCA: Advanced Accounts & Costing Timed Simulation Test',
        type: 'test_series' as const,
        costType: 'paid' as const,
        provider: 'PrepCA Mentorship',
        url: 'https://www.google.com/search?q=PrepCA+Evaluated+Test+Series+Inter',
        priceNote: 'Paid Evaluated Test Series',
      },
      {
        id: 'link_e7_p2',
        title: 'ICAI Past 10 Attempts Suggested Answers Physical Compiler Book',
        type: 'paid_book' as const,
        costType: 'paid' as const,
        provider: 'Suchitra Publications',
        url: 'https://www.google.com/search?q=Suchitra+Scanner+CA+Inter+Group+1+and+2',
        priceNote: 'Paid Physical Book (~₹1,200)',
      },
    ],
  },
];

/**
 * Generates the full practical day-by-day plan covering EVERY SINGLE DAY
 * from start date up to May 1, 2027 (~191 days), scientifically sequenced
 * according to human memory retention and spaced repetition principles!
 */
export function generateFullRoadmapTillMay2027(
  startDateStr: string = '2026-10-26',
  examDateStr: string = '2027-05-01'
): Record<string, DayPlan> {
  const result: Record<string, DayPlan> = {};
  const start = new Date(startDateStr);
  const exam = new Date(`${examDateStr}T00:00:00`);

  // Calculate total days between start and exam
  const diffTime = Math.max(1, exam.getTime() - start.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  for (let i = 0; i < totalDays; i++) {
    const curDate = new Date(start);
    curDate.setDate(start.getDate() + i);
    const dateStr = curDate.toISOString().split('T')[0];

    const dayNumber = i + 1;
    const weekNumber = Math.floor(i / 7) + 1;
    const isSunday = curDate.getDay() === 0;

    // Phase determination
    // Phase 1: Days 1 to 101 (Oct 22 to Jan 31) - Foundation & 100% ICAI SM Coverage
    // Phase 2: Days 102 to 154 (Feb 1 to Mar 25) - Revision 1 + RTPs & Past 5 Years PYQs
    // Phase 3: Days 155 to 185 (Mar 26 to Apr 25) - Revision 2 + ICAI MTPs under 2-5 PM Simulation
    // Phase 4: Days 186 to end (Apr 26 to May 1) - 1.5-Day Exam Marathon Simulation
    let phase: DayPlan['phase'] = 'Phase 1: Foundation & ICAI SM';
    if (i >= 185) {
      phase = 'Phase 4: Exam Marathon';
    } else if (i >= 154) {
      phase = 'Phase 3: R2 & Mock Tests';
    } else if (i >= 101) {
      phase = 'Phase 2: R1 & RTPs/PYQ';
    }

    // Pick block template based on day sequence and whether it is a Sunday spaced repetition day
    let template = CURRICULUM_BLOCKS[i % (CURRICULUM_BLOCKS.length - 1)];
    if (isSunday) {
      // Use block 7 (Sunday Spaced Repetition Buffer)
      template = CURRICULUM_BLOCKS[CURRICULUM_BLOCKS.length - 1];
    }

    // Customize topic titles according to the active phase
    let phaseMorningPrefix = '';
    let phaseEveningPrefix = '';
    if (phase === 'Phase 2: R1 & RTPs/PYQ') {
      phaseMorningPrefix = '[R1 + RTP] ';
      phaseEveningPrefix = '[R1 + Past 5 Yr PYQ] ';
    } else if (phase === 'Phase 3: R2 & Mock Tests') {
      phaseMorningPrefix = '[R2 Mock Drill] ';
      phaseEveningPrefix = '[R2 Speed Test] ';
    } else if (phase === 'Phase 4: Exam Marathon') {
      phaseMorningPrefix = '[1.5-Day Marathon Polish] ';
      phaseEveningPrefix = '[Exam Day Formula Sheet] ';
    }

    const morningTopic: ScheduledTopic = {
      id: `m_${dateStr}`,
      slot: 'morning',
      paperCode: template.morningPaperCode,
      paperShortName: template.morningPaperShortName,
      chapterId: template.morningChapterId,
      chapterTitle: `${phaseMorningPrefix}${template.morningChapterTitle}`,
      subtopics: template.morningSubtopics,
      allocatedMinutes: 90,
      spentMinutes: i === 0 ? 90 : 0,
      resources: {
        icaiSmModule: template.morningSmModule,
        pageRange: template.morningPageRange,
        illustrations: template.morningIllustrations,
        rtpPyqRef: template.morningRtpPyq,
        bareActOrStd: template.morningBareAct,
      },
      links: generateTopicResources(
        template.morningPaperShortName,
        template.morningPaperCode,
        `${phaseMorningPrefix}${template.morningChapterTitle}`,
        template.morningSubtopics
      ),
      framework: template.morningFramework,
      memoryTechnique: template.morningMemory,
      isCompleted: i < 0,
    };

    const eveningTopic: ScheduledTopic = {
      id: `e_${dateStr}`,
      slot: 'evening',
      paperCode: template.eveningPaperCode,
      paperShortName: template.eveningPaperShortName,
      chapterId: template.eveningChapterId,
      chapterTitle: `${phaseEveningPrefix}${template.eveningChapterTitle}`,
      subtopics: template.eveningSubtopics,
      allocatedMinutes: 210,
      spentMinutes: i === 0 ? 60 : 0,
      resources: {
        icaiSmModule: template.eveningSmModule,
        pageRange: template.eveningPageRange,
        illustrations: template.eveningIllustrations,
        rtpPyqRef: template.eveningRtpPyq,
        bareActOrStd: template.eveningBareAct,
      },
      links: generateTopicResources(
        template.eveningPaperShortName,
        template.eveningPaperCode,
        `${phaseEveningPrefix}${template.eveningChapterTitle}`,
        template.eveningSubtopics
      ),
      framework: template.eveningFramework,
      memoryTechnique: template.eveningMemory,
      isCompleted: false,
    };

    result[dateStr] = {
      dayNumber,
      date: dateStr,
      phase,
      weekNumber,
      summaryTarget: `${template.morningPaperShortName} + ${template.eveningPaperShortName}: ${template.morningChapterTitle.split(':')[0]}`,
      status: i === 0 ? 'in_progress' : i < 0 ? 'completed' : 'upcoming',
      morningTopic,
      eveningTopic,
    };
  }

  return result;
}

export function generateInitialDailySchedule(startDateStr?: string): Record<string, DayPlan> {
  return generateFullRoadmapTillMay2027(startDateStr || '2026-10-26', '2027-05-01');
}
