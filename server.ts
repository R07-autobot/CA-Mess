import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK server-side (User-Agent header required by AI Studio guidelines)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Comprehensive system prompt defining the CA Foundation, Intermediate & Final Mentor & Dashboard Copilot
const CA_ASSISTANT_SYSTEM_INSTRUCTION = `
You are the elite "ICAI Chartered Accountancy AI Copilot & Research Mentor", built specifically for CA Foundation, CA Intermediate & CA Final May 2027 aspirants.
Your user is an ambitious CA aspirant and working student adhering to the strict 5-hour daily protocol:
- Wake up: ~06:00 AM
- Morning Slot (1.5 Hours, 06:30 - 08:00 AM): High-focus Theory, Standards & Law:
  * CA Foundation: Business Laws (Contract Act 1872, Sale of Goods 1930, Partnership 1932, LLP 2008, Companies 2013, NI Act 1881), Business Economics.
  * CA Inter: Corporate & Other Laws, Direct/Indirect Tax provisions, Auditing Standards.
  * CA Final: Advanced Auditing & Professional Ethics (Code of Ethics, SAs), Direct Tax & International Taxation, Ind AS disclosures.
- Daytime Hours: 09:00 AM - 07:00 PM (Office/Articleship/College).
- Evening Slot (3.5 Hours, 20:00 - 00:00 / 8:00 PM - 12:00 AM): Heavy Practical & Numerical problem solving:
  * CA Foundation: Accounting (BRS, Inventory, Depreciation, Final Accounts, NPO, Partnership, Company Accounts), Quantitative Aptitude (Business Maths, Logical Reasoning, Statistics).
  * CA Inter: Advanced Accounting, Cost & Management Accounting, Financial Management (FM-SM).
  * CA Final: Financial Reporting (Ind AS 115, 116, 109, Business Combinations), Advanced Financial Management (AFM Forex, Derivatives, Portfolio), Indirect Tax Laws (GST & Customs).

You have dual core capabilities:
1. DASHBOARD COPILOT & NAVIGATION GUIDE:
- You know every feature of this planner:
  * "Course Stream Switcher": Seamlessly switches between CA Foundation, CA Intermediate, and CA Final anytime without losing progress.
  * "Free & Paid Courses Dropdown": Filters resources between Free Only (ICAI BoS, Live Virtual Classes, YouTube), Paid Only (Top Faculty Batches, Scanners, PrepCA Test Series), or All, plus a complete searchable Course Directory.
  * "Daily 5h Scheduler": Time-blocked schedule from 06:00 AM to midnight, with integrated 1.5h and 3.5h blocks, Pomodoro timer (25/5 or 50/10), and Deep Work mode.
  * "Daily Topic Blueprint": Day-by-day roadmap starting strictly on 26-Oct-26 till May 1, 2027 exam date covering all ICAI chapters, with tracking for spent minutes, interactive checkboxes/tick marks, top/bottom percentage progress bars, and clickable study references (ICAI SM, YouTube video links, scanners).
  * "Quick-Fire AI Flashcards": Generates 5-10 active-recall flashcards for any topic covering provisions, formulas, limits, and traps.
  * "ICAI Syllabus Tracker": All Papers of ICAI New Scheme (Foundation: 4 Papers; Inter: 6 Papers; Final: 6 Papers).
  * "Backlog Balancer": Auto-calculates deficit when days are missed and distributes catch-up hours across weekend slots so the user never burns out.
  * "Deep Work Session": Full-screen distraction-free timer with ambient soundscapes and notification suppression.
  * "Streaks & Heatmap": Tracks consistency, daily hours logged, and visual study heatmaps.
- When the user asks how to do something in the app, give crisp, actionable instructions and suggest navigation shortcuts (e.g. "Switch to Daily Topic Blueprint tab", "Click Backlog Balancer in the top header", "Start Deep Work session").

2. ICAI STUDY & WEB RESEARCH ENGINE:
- Help the student master concepts, solve doubts, remember sections/standards, and research real-time legal and syllabus updates.
- Grounded web search: Use web search grounding to fetch latest ICAI notifications, RTP/MTP announcements, case law citations, tax slabs under Finance Act, and statutory amendments for CA Foundation, Inter & Final.
- ICAI Answer Writing Protocol: When explaining law, auditing, or tax questions, structure answers according to the ICAI exam standard:
  (a) Relevant Legal Provision / Standard (e.g., Section of Companies Act 2013, Standard on Auditing SA, AS/Ind AS standard)
  (b) Analysis & Application to Facts
  (c) Conclusion & Practical Implication
- Memory & Mnemonics: Provide memory hooks, acrostics, and active-recall triggers for retention under working-professional constraints.

Tone: Authoritative, encouraging, structured, practical, and highly respectful of the student's limited 5-hour daily time constraint. Use bolding and bullet points for readability.
`;

// AI Assistant Chat & Research API Route
app.post('/api/ai/assistant', async (req, res) => {
  try {
    const { 
      message, 
      history = [], 
      enableWebSearch = true, 
      mode = 'general',
      context = {} 
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message query is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        reply: `⚠️ **Gemini API Key Required**\n\nThe AI Copilot requires an active Gemini API key. Please check your **Settings > Secrets** panel in AI Studio to ensure your Gemini API key is configured.\n\nIn the meantime, you can explore all dashboard features:\n- **Daily 5h Scheduler**: Track your 06:30-08:00 AM and 20:00-00:00 study slots.\n- **Daily Topic Blueprint**: View your comprehensive roadmap till May 2027.\n- **Backlog Balancer**: Adjust your pace if you missed study hours.`,
        groundingSources: [],
      });
    }

    // Prepare contextual background for prompt
    let contextualNote = '';
    if (context && Object.keys(context).length > 0) {
      contextualNote = `\n[Current App State Context: Exam Date: May 1, 2027 | Current Active Tab: ${context.activeTab || 'scheduler'} | Target: 5.0h/day (1.5h morning + 3.5h evening) | Current Streak: ${context.streakCount || 0} days | Backlog Hours: ${context.backlogHours || 0}h | Today Morning Topic: ${context.todayMorningTopic || 'Theory/Law'} | Today Evening Topic: ${context.todayEveningTopic || 'Practical Problem Solving'}]\n`;
    }

    // Build contents array supporting conversation history
    const contents: any[] = [];

    // Add recent history if provided (up to last 6 turns to keep context fast and focused)
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-6);
      for (const turn of recentHistory) {
        if (turn.role === 'user' || turn.role === 'model') {
          contents.push({
            role: turn.role,
            parts: [{ text: turn.text || '' }],
          });
        }
      }
    }

    // Add current query with context
    contents.push({
      role: 'user',
      parts: [{ text: `${contextualNote}${message}` }],
    });

    // Configure model call with tools (Google Search grounding)
    const config: any = {
      systemInstruction: CA_ASSISTANT_SYSTEM_INSTRUCTION,
      temperature: 0.7,
    };

    // Enable Google Search grounding when requested or in research mode
    if (enableWebSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config,
    });

    const replyText = response.text || 'I could not generate an answer at this moment. Please rephrase your question.';

    // Extract search grounding metadata sources if available
    const groundingSources: { title: string; url: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (Array.isArray(chunks)) {
      for (const chunk of chunks) {
        if (chunk.web?.uri) {
          groundingSources.push({
            title: chunk.web.title || chunk.web.uri,
            url: chunk.web.uri,
          });
        }
      }
    }

    return res.json({
      reply: replyText,
      groundingSources,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/assistant:', error);
    const errorStr = String(error?.message || error || '');

    if (errorStr.includes('429') || errorStr.includes('quota') || errorStr.includes('RESOURCE_EXHAUSTED')) {
      return res.status(200).json({
        reply: `⏱️ **Gemini API Rate Limit / Quota Notice**\n\nThe temporary rate limit for the API key was reached. You can wait a moment and retry, or check the **Settings > Secrets** panel in AI Studio to select or update your API key.\n\n### 🧭 Dashboard & Study Quick Tips:\n- **Morning 1.5h (06:30 - 08:00 AM)**: High cognitive focus on Law & Audit standards. Always write out section names and penalty provisions.\n- **Evening 3.5h (20:00 - 00:00)**: Problem solving with ICAI SM & RTP. Do not look at answers before attempting calculations independently.\n- **Backlog Management**: If work hours ran late today, open the **Backlog Balancer** in the top bar to spread missed hours over the weekend without stress.`,
        groundingSources: [],
      });
    }

    const errorMessage = error?.message || 'Internal Server Error';
    return res.status(500).json({
      error: errorMessage,
      reply: `Sorry, I encountered an issue: ${errorMessage}. If this is a 403 or invalid API key issue, please check your key in the **Settings > Secrets** panel.`,
      groundingSources: [],
    });
  }
});

// Quick AI module endpoints: Mnemonic generator & Section Breakdown
app.post('/api/ai/quick-tool', async (req, res) => {
  try {
    const { toolType, topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        result: 'Gemini API Key is not configured. Please check Settings > Secrets.',
      });
    }

    let prompt = '';
    if (toolType === 'mnemonic') {
      prompt = `Provide an unforgettable mnemonic or memory hook for the following CA Intermediate topic: "${topic}". Include an acrostic, a visual mental image, and 3 key points to remember under exam pressure.`;
    } else if (toolType === 'section_breakdown') {
      prompt = `Give an authoritative ICAI-oriented breakdown of the law section, accounting standard, or tax provision: "${topic}". Include: (1) Official section/standard title, (2) Core legal criteria & thresholds, (3) Key exceptions/penalties, (4) Common ICAI exam trap.`;
    } else if (toolType === 'case_law_format') {
      prompt = `Draft an ICAI 3-step model answer framework for a scenario based on: "${topic}". 1. Relevant Law & Provision. 2. Analysis of Situation. 3. Final Conclusion.`;
    } else {
      prompt = `Explain this CA Intermediate topic simply with an exam-oriented tip: "${topic}".`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: CA_ASSISTANT_SYSTEM_INSTRUCTION,
        temperature: 0.6,
      },
    });

    return res.json({ result: response.text || '' });
  } catch (error: any) {
    console.error('Error in /api/ai/quick-tool:', error);
    const errorStr = String(error?.message || error || '');
    if (errorStr.includes('429') || errorStr.includes('quota') || errorStr.includes('RESOURCE_EXHAUSTED')) {
      return res.status(200).json({
        result: `⏱️ **API Quota Notice**: The rate limit was temporarily reached. Please retry in a moment, or verify your API key in **Settings > Secrets**.\n\nMemory Tip: For "${req.body?.topic || 'your topic'}", create an acronym using the first letters of each condition and link each letter to a vivid visual scene.`,
      });
    }
    return res.status(500).json({ error: error?.message || 'Failed to generate tool output' });
  }
});

// Helper to provide high-yield fallback flashcards if API key is unconfigured or rate limited
function getCuratedFallbackFlashcards(
  topicTitle: string,
  paperShortName?: string,
  subtopics: string[] = []
) {
  const titleLower = (topicTitle || '').toLowerCase();
  const subtopicsText = subtopics.join('; ');

  // CA Foundation: Indian Contract Act 1872 & Business Laws
  if (titleLower.includes('contract act') || titleLower.includes('offer') || titleLower.includes('consideration') || titleLower.includes('sale of goods') || titleLower.includes('negotiable')) {
    return [
      {
        id: 'fc-fnd-law-1',
        question: 'Under Section 10 of Indian Contract Act 1872, what are the essential elements of a valid contract?',
        answer: '1. Agreement (Offer + Acceptance with consensus ad idem)\n2. Free Consent (Sec 14: No coercion, undue influence, fraud, misrepresentation, mistake)\n3. Competency of Parties (Sec 11: Major, sound mind, not disqualified)\n4. Lawful Consideration & Lawful Object (Sec 23)\n5. Not expressly declared void (Sec 24-30)\n6. Intention to create legal relationship (Balfour v Balfour).',
        category: 'Core Legal Principles',
        difficulty: 'Medium',
        keyTakeaway: 'All contracts are agreements, but all agreements are not contracts (Sec 10 filter).',
        examTip: 'Cite Balfour v Balfour for social/domestic agreements lacking intention to create legal relations.',
      },
      {
        id: 'fc-fnd-law-2',
        question: 'What is the doctrine of "Privity of Consideration" vs "Privity of Contract"?',
        answer: '• Privity of Consideration: In India, consideration may move from the promisee OR any other third person (Chinnaya v Ramayya). Hence, stranger to consideration CAN sue!\n• Privity of Contract: A stranger to a contract cannot sue (Dunlop Pneumatic Tyre v Selfridge). Exception: Trust, Family settlement, Acknowledgement of debt.',
        category: 'Landmark Precedent',
        difficulty: 'Hard',
        keyTakeaway: 'Stranger to Consideration CAN sue; Stranger to Contract CANNOT sue (subject to exceptions).',
        examTip: 'Landmark case: Chinnaya v Ramayya (Consideration moved from mother, yet daughter was liable to maternal aunt).',
      },
      {
        id: 'fc-fnd-law-3',
        question: 'Under Section 138 of Negotiable Instruments Act 1881, what are the conditions for cheque dishonour penalty?',
        answer: '1. Cheque presented within validity (3 months from date of issue).\n2. Demand notice in writing sent by payee within 30 days of receiving return memo.\n3. Drawer fails to make payment within 15 days of receipt of notice.\nPenalty: Imprisonment up to 2 years, or fine up to twice the cheque amount, or both.',
        category: 'Statutory Timelines',
        difficulty: 'Hard',
        keyTakeaway: '30-day notice -> 15 days to pay -> 1 month to file complaint before Magistrate.',
        examTip: 'Offence under Sec 138 is compoundable and bailable.',
      },
    ];
  }

  // CA Foundation: Quantitative Aptitude - Time Value of Money (TVM) & Maths
  if (titleLower.includes('time value of money') || titleLower.includes('tvm') || titleLower.includes('annuity') || titleLower.includes('perpetuity') || titleLower.includes('maths')) {
    return [
      {
        id: 'fc-fnd-tvm-1',
        question: 'What is the formula for Effective Rate of Interest (E) compounded m times a year?',
        answer: 'E = (1 + i/m)^m - 1\nwhere i = nominal annual interest rate, and m = number of conversion periods per year (e.g. m=4 for quarterly, m=12 for monthly).',
        category: 'TVM Formula',
        difficulty: 'Medium',
        keyTakeaway: 'Effective rate is always strictly higher than nominal rate whenever compounding occurs more than once a year.',
        examTip: 'Calculator shortcut: (1 + i/m) [x] [=] (m-1 times) [-] 1 [x] 100.',
      },
      {
        id: 'fc-fnd-tvm-2',
        question: 'What is the Present Value formula for an Annuity Regular vs Annuity Due vs Perpetuity?',
        answer: '• PV (Annuity Regular) = A × [1 - (1+i)^-n] / i\n• PV (Annuity Due) = PV (Regular) × (1 + i)\n• PV (Perpetuity) = A / i\n• PV (Growing Perpetuity) = A / (i - g)',
        category: 'Calculator & Formulas',
        difficulty: 'Hard',
        keyTakeaway: 'Annuity Due payments happen at BEGINNING of period, so multiply by (1+i). Perpetuity has n -> infinity.',
        examTip: 'On Casio/Citizen calculator: 1 ÷ (1+i) [=] [=] ... n times [GT] × A gives PV of Annuity Regular directly!',
      },
    ];
  }

  // CA Foundation: Accounting (BRS, Rectification, Inventory)
  if (titleLower.includes('bank reconciliation') || titleLower.includes('brs') || titleLower.includes('rectification') || titleLower.includes('single entry') || titleLower.includes('consignment')) {
    return [
      {
        id: 'fc-fnd-acc-1',
        question: 'In Bank Reconciliation Statement (BRS), why is an "Adjusted Cash Book" prepared first before BRS?',
        answer: 'Adjusted Cash Book is prepared to record genuine transactions and errors that occurred in the Cash Book itself (e.g., Bank charges debited by bank, direct customer deposits, interest credited, unrecorded standing orders, errors in Cash Book casting). Only timing differences (cheques issued not presented, cheques deposited not credited) go into the final BRS.',
        category: 'Accounting Protocol',
        difficulty: 'Medium',
        keyTakeaway: 'Cash book errors & bank advices are adjusted in Cash Book first; only uncleared/unpresented cheques go into BRS.',
        examTip: 'If question asks for Adjusted Cash Book, never put "Cheques issued but not presented" in the Cash Book.',
      },
      {
        id: 'fc-fnd-acc-2',
        question: 'What is the rule of Inventory Valuation under AS 2 and ICAI Foundation Framework?',
        answer: 'Inventories must be valued at Lower of Cost or Net Realizable Value (NRV).\n• Cost = Purchase cost + Conversion costs + Other costs incurred in bringing inventories to their present location and condition.\n• NRV = Estimated selling price in ordinary course of business less estimated completion & selling costs.',
        category: 'Valuation Standard',
        difficulty: 'Easy',
        keyTakeaway: 'Prudence principle: Recognize potential losses immediately (NRV < Cost), but never anticipatory profits.',
        examTip: 'Compare Cost and NRV item-by-item (individual basis), not global basket basis.',
      },
    ];
  }

  // Domain-specific tailored card collections
  if (titleLower.includes('incorporation') || titleLower.includes('preliminary') || titleLower.includes('sec 1-22') || titleLower.includes('company')) {
    return [
      {
        id: 'fc-law-1',
        question: 'Under Section 3(1), what are the minimum number of subscribers required for Public, Private, and OPC?',
        answer: '• Public Company: 7 or more persons\n• Private Company: 2 or more persons\n• One Person Company (OPC): 1 person (natural person, Indian citizen whether resident or not).',
        category: 'Statutory Threshold',
        difficulty: 'Easy',
        keyTakeaway: 'Formula: 7 (Public) > 2 (Private) > 1 (OPC).',
        examTip: 'Remember: In OPC, non-resident Indian citizens are now permitted to incorporate and be nominees.',
      },
      {
        id: 'fc-law-2',
        question: 'What is the "Doctrine of Indoor Management" and what landmark case established it?',
        answer: 'Established in Royal British Bank v. Turquand. Outsiders dealing with a company are assumed to have checked public documents (MOA/AOA), but are NOT bound to inquire whether internal procedural requirements were satisfied by the company.',
        category: 'Case Law Principle',
        difficulty: 'Medium',
        keyTakeaway: 'Protection to innocent outsiders against company internal irregularities.',
        examTip: 'Exceptions: Knowledge of irregularity, Suspicion of irregularity, and Forgery (Ruben v Great Fingall).',
      },
      {
        id: 'fc-law-3',
        question: 'What is the legal effect of a "Certificate of Incorporation" under Section 9?',
        answer: 'It is conclusive evidence that all registration requirements of the Act have been complied with and that the company is legally born from that date, having perpetual succession and a separate legal entity.',
        category: 'Core Provision',
        difficulty: 'Medium',
        keyTakeaway: 'Certificate of Incorporation is unimpeachable birth certificate of the company.',
        examTip: 'Even if objects are ultra vires or signatures forged, incorporation stands valid until wound up (Moosa Goolam Ariff case).',
      },
      {
        id: 'fc-law-4',
        question: 'Under Section 8 (Non-profit Companies), what are the 3 mandatory conditions to get a license?',
        answer: '1. Promotion of commerce, art, science, sports, education, research, charity, or protection of environment.\n2. Intends to apply its profits only to promote its objects.\n3. Prohibits payment of any dividend to its members.',
        category: 'Section 8 Provision',
        difficulty: 'Medium',
        keyTakeaway: 'No dividend allowed ever; all surplus reinvested into objects.',
        examTip: 'ICAI loves testing: Can a partnership firm be a member of Section 8 company? YES, under Sec 8(3).',
      },
      {
        id: 'fc-law-5',
        question: 'What is SPICe+ (INC-32) and what integrated services does Part B provide?',
        answer: 'Single integrated web form for incorporation. Part A: Name Reservation (RUN). Part B: Incorporation, PAN, TAN, EPFO, ESIC, Professional Tax, Bank Account opening, and GSTIN registration.',
        category: 'Procedural Compliance',
        difficulty: 'Hard',
        keyTakeaway: 'One-stop electronic filing integrating MCA with Tax and Labor authorities.',
        examTip: 'AGILE-PRO-S (INC-35) mandatory attachment for bank account, EPFO, and GST registration.',
      },
      {
        id: 'fc-law-6',
        question: 'Under Section 4(5), for how long is an approved company name reserved for a new company vs existing company changing name?',
        answer: '• New Company: 20 days from date of approval.\n• Existing Company changing name: 60 days from date of approval.',
        category: 'Statutory Timeline',
        difficulty: 'Hard',
        keyTakeaway: '20 days for newborn; 60 days for renaming existing company.',
        examTip: 'Extension available on payment of specified fees (up to 40/60 days for new companies).',
      },
    ];
  }

  if (titleLower.includes('overheads') || titleLower.includes('costing') || titleLower.includes('machine hour')) {
    return [
      {
        id: 'fc-cost-1',
        question: 'How is Under-absorption or Over-absorption of overheads calculated?',
        answer: 'Under/Over-Absorption = Actual Overheads Incurred - Overheads Absorbed (where Absorbed = Actual Base × Predetermined Absorption Rate).',
        category: 'Formula & Concept',
        difficulty: 'Medium',
        keyTakeaway: 'Incurred > Absorbed = Under-absorption (Debit). Incurred < Absorbed = Over-absorption (Credit).',
        examTip: 'Always check if Predetermined Rate is based on Normal Capacity, not Actual Capacity.',
      },
      {
        id: 'fc-cost-2',
        question: 'What is the treatment of Under/Over-absorption if due to abnormal reasons (e.g. strike, machinery breakdown)?',
        answer: 'The entire abnormal under/over-absorbed amount is debited or credited directly to Costing Profit & Loss Account; NEVER charged to production cost or supplementary rate.',
        category: 'Exam Pitfall',
        difficulty: 'Medium',
        keyTakeaway: 'Abnormal goes straight to Costing P&L!',
        examTip: 'Supplementary rate is only applied when under/over-absorption is due to normal causes (miscalculation or price level changes).',
      },
      {
        id: 'fc-cost-3',
        question: 'What are the 3 bases to distribute under/over-absorption using Supplementary Rate?',
        answer: 'Supplementary rate is distributed over:\n1. Cost of Goods Sold (COGS)\n2. Finished Goods Inventory\n3. Work-in-Progress (WIP) Inventory\nprorated on the basis of equivalent overhead content or total cost.',
        category: 'ICAI Exam Standard',
        difficulty: 'Hard',
        keyTakeaway: 'Prorate across COGS + FG + WIP using equivalent units or value.',
        examTip: 'Do not allocate to raw materials inventory!',
      },
      {
        id: 'fc-cost-4',
        question: 'How is Machine Hour Rate computed for standing charges vs running charges?',
        answer: '• Standing Charges (Rent, Supervisor, Lighting): Fixed per period ÷ Total effective machine hours.\n• Running Charges (Power, Depreciation, Repairs): Computed directly per hour basis (e.g. Power units/hr × cost/unit).',
        category: 'Calculation Protocol',
        difficulty: 'Easy',
        keyTakeaway: 'Standing is period-allocated; Running is operational consumption.',
        examTip: 'Deduct setup time from gross hours unless setup time is treated as productive.',
      },
      {
        id: 'fc-cost-5',
        question: 'In secondary overhead redistribution, when is Simultaneous Equation Method vs Step-Ladder Method used?',
        answer: '• Simultaneous Equation: Used when service departments render reciprocal services to each other (Dept A serves B, and Dept B serves A).\n• Step-Ladder: Used when services are rendered non-reciprocally or in single cascade sequence.',
        category: 'Methods Comparison',
        difficulty: 'Hard',
        keyTakeaway: 'Reciprocal mutual services = Simultaneous equations / Repeated distribution.',
        examTip: 'Write equations clearly: S1 = Own Cost + % of S2; S2 = Own Cost + % of S1.',
      },
    ];
  }

  // CA Final: Ind AS 115 / 116 / Financial Instruments
  if (titleLower.includes('ind as 115') || titleLower.includes('revenue from contract') || titleLower.includes('ind as 116') || titleLower.includes('leases') || titleLower.includes('ind as 109') || titleLower.includes('financial reporting')) {
    return [
      {
        id: 'fc-indas-1',
        question: 'Under Ind AS 115, what are the 5 Steps in the Revenue Recognition Model?',
        answer: '1. Identify the contract with the customer.\n2. Identify the separate performance obligations (PO) in the contract.\n3. Determine the transaction price.\n4. Allocate the transaction price to POs based on standalone selling prices (SSP).\n5. Recognize revenue when/as the entity satisfies each PO.',
        category: 'Core Framework',
        difficulty: 'Easy',
        keyTakeaway: '5-Step Golden Mantra: Contract -> PO -> Price -> Allocate -> Recognize.',
        examTip: 'Remember: Variable consideration is estimated using Expected Value or Most Likely Amount, subject to the constraint.',
      },
      {
        id: 'fc-indas-2',
        question: 'Under Ind AS 116, how is the initial measurement of Lease Liability and Right-of-Use (ROU) Asset computed by a lessee?',
        answer: '• Lease Liability = Present Value (PV) of unpaid lease payments discounted at the Interest Rate Implicit in Lease (or lessee incremental borrowing rate).\n• ROU Asset = Initial Lease Liability + Lease payments made at/before commencement + Initial Direct Costs + Estimated dismantling/restoration costs - Lease incentives received.',
        category: 'Journal Entry & Valuation',
        difficulty: 'Hard',
        keyTakeaway: 'ROU Asset includes upfront payments, initial direct costs, and restoration provisions.',
        examTip: 'Depreciate ROU Asset over lease term or useful life (if title transfers or purchase option reasonably certain).',
      },
      {
        id: 'fc-indas-3',
        question: 'Under Ind AS 109, what are the two criteria for a financial asset to be measured at Amortised Cost?',
        answer: '1. Business Model Test: The objective is to hold financial assets in order to collect contractual cash flows.\n2. SPPI Test: Contractual terms give rise on specified dates to cash flows that are Solely Payments of Principal and Interest.',
        category: 'Classification Standard',
        difficulty: 'Medium',
        keyTakeaway: 'Passes SPPI + Held to Collect = Amortised Cost.',
        examTip: 'If SPPI fails, the asset MUST be classified at FVTPL (Fair Value through Profit or Loss).',
      },
      {
        id: 'fc-indas-4',
        question: 'Under Ind AS 103 (Business Combinations), how is Goodwill / Gain on Bargain Purchase computed?',
        answer: 'Goodwill = Purchase Consideration transferred + Non-Controlling Interest (NCI) at fair value or proportionate net assets + Fair value of previously held interest - Fair value of Net Identifiable Assets acquired.',
        category: 'Calculation Protocol',
        difficulty: 'Hard',
        keyTakeaway: 'Goodwill is tested annually for impairment; Gain on Bargain Purchase is credited to OCI / Capital Reserve.',
        examTip: 'Acquisition-related transaction costs (advisory, legal) are expensed in P&L, NOT capitalized to Goodwill.',
      },
    ];
  }

  // CA Final: Advanced Financial Management (AFM Forex / Derivatives / Portfolio)
  if (titleLower.includes('forex') || titleLower.includes('currency') || titleLower.includes('derivatives') || titleLower.includes('afm') || titleLower.includes('portfolio')) {
    return [
      {
        id: 'fc-afm-1',
        question: 'What is Interest Rate Parity (IRP) formula for forward rate quotation?',
        answer: 'Forward Rate / Spot Rate = (1 + Rh) / (1 + Rf)\nwhere Rh = Home currency interest rate, Rf = Foreign currency interest rate for the period.',
        category: 'Formula & Calculation',
        difficulty: 'Medium',
        keyTakeaway: 'High interest rate currency trades at a forward discount; low interest rate trades at forward premium.',
        examTip: 'If IRP does not hold, Covered Interest Arbitrage (CIA) opportunity exists. Borrow low, convert spot, invest high, lock forward.',
      },
      {
        id: 'fc-afm-2',
        question: 'How is Money Market Hedge executed for an impending Foreign Currency Inflow (Receivable)?',
        answer: '1. Borrow foreign currency now at foreign borrowing rate (PV of receivable).\n2. Convert borrowed foreign currency to home currency immediately at Spot Bid rate.\n3. Invest home currency in local money market till maturity.\n4. When customer pays receivable, use it to pay off the foreign bank loan.',
        category: 'Hedging Strategy',
        difficulty: 'Hard',
        keyTakeaway: 'Receivable: Borrow foreign -> Spot sell -> Invest home. Payable: Borrow home -> Spot buy -> Invest foreign.',
        examTip: 'Always compare net realization from Money Market Hedge with Forward Contract rate and Option Hedge.',
      },
      {
        id: 'fc-afm-3',
        question: 'What is the formula for Capital Asset Pricing Model (CAPM) and Beta calculation?',
        answer: '• Ke = Rf + β × (Rm - Rf), where (Rm - Rf) is Equity Risk Premium.\n• Beta (β) = Cov(i, m) / Var(m) = [r(i,m) × σ(i)] / σ(m).',
        category: 'Valuation & Risk',
        difficulty: 'Medium',
        keyTakeaway: 'Beta measures systematic, non-diversifiable market risk.',
        examTip: 'Unlevered Beta = Levered Beta / [1 + (1 - Tax Rate) × (Debt / Equity)].',
      },
    ];
  }

  // CA Final: Advanced Auditing & Professional Ethics (SAs, Code of Ethics)
  if (titleLower.includes('ethics') || titleLower.includes('clause') || titleLower.includes('sa ') || titleLower.includes('auditing standard') || titleLower.includes('audit')) {
    return [
      {
        id: 'fc-audit-1',
        question: 'Under Clause 6, Part I, First Schedule to CA Act, what is the rule regarding soliciting professional work or advertisement?',
        answer: 'A member in practice shall be guilty of professional misconduct if he solicits clients or professional work, directly or indirectly, by circular, advertisement, personal communication, or interview.\nExceptions: Responding to tenders satisfying ICAI guidelines, writing books/articles, or ICAI job portal.',
        category: 'Professional Ethics',
        difficulty: 'Medium',
        keyTakeaway: 'No direct or indirect solicitation; tenders allowed only with specified minimum criteria.',
        examTip: 'Mention: "Council Guidelines regarding Website and Social Media: Only pull mode allowed, push mode prohibited".',
      },
      {
        id: 'fc-audit-2',
        question: 'Under SA 701, what are Key Audit Matters (KAM) and who are they mandatory for?',
        answer: 'Matters that, in the auditor’s professional judgment, were of most significance in the audit of financial statements of current period, selected from matters communicated with TCWG (Those Charged with Governance).\nMandatory for audits of complete sets of general purpose financial statements of listed entities.',
        category: 'Auditing Standard',
        difficulty: 'Medium',
        keyTakeaway: 'KAM is required for listed entities; chosen from matters discussed with TCWG.',
        examTip: 'KAM does NOT substitute for modified opinion under SA 705 or Material Uncertainty Related to Going Concern under SA 570.',
      },
      {
        id: 'fc-audit-3',
        question: 'Under SA 240, what are the auditor’s responsibilities relating to fraud in an audit?',
        answer: 'Maintain professional skepticism throughout the audit. Primary responsibility for prevention and detection rests with TCWG and management. Auditor must identify and assess RMM due to fraud, design appropriate responses, and report under Section 143(12) via Form ADT-4 to Central Govt if fraud >= ₹1 Crore.',
        category: 'Fraud Reporting',
        difficulty: 'Hard',
        keyTakeaway: 'Fraud >= ₹1 Crore -> ADT-4 to Central Government within specified statutory deadlines.',
        examTip: 'Mention the two types of intentional misstatements: Fraudulent Financial Reporting & Misappropriation of Assets.',
      },
    ];
  }

  // Default smart dynamic cards generated from subtopics and topic title
  const cards: any[] = [];
  const baseSubtopics = subtopics.length > 0 ? subtopics : [
    `${topicTitle} - Core Legal/Conceptual Framework`,
    `${topicTitle} - Statutory Limits & Thresholds`,
    `${topicTitle} - ICAI Exam Traps & Tricky Scenarios`,
    `${topicTitle} - Journal Entries & Calculation Steps`,
    `${topicTitle} - Practical Case Application & RTP Trends`,
    `${topicTitle} - Summary & Spaced Repetition Formula`,
  ];

  baseSubtopics.slice(0, 7).forEach((sub, idx) => {
    cards.push({
      id: `fc-gen-${idx + 1}`,
      question: `Key Exam Drill on "${sub}": What are the core criteria and exam standards tested by ICAI?`,
      answer: `For ${sub}, master the exact statutory rule, computational steps, and ICAI study material illustration. Ensure compliance with latest ICAI New Scheme guidance note, verify debit/credit rules, and check threshold applicability.`,
      category: idx % 2 === 0 ? 'Core Provision' : 'Statutory Limit',
      difficulty: idx === 0 ? 'Easy' : idx % 2 === 0 ? 'Medium' : 'Hard',
      keyTakeaway: `Key Takeaway: Always reference the specific provision and calculate intermediate working notes explicitly.`,
      examTip: `Common ICAI Pitfall: Forgetting to state the relevant Section/AS/SA standard before giving the final answer.`,
    });
  });

  return cards;
}

// AI Quick-Fire Flashcards Generator API Route
app.post('/api/ai/flashcards', async (req, res) => {
  try {
    const { topicTitle, paperCode = '', paperShortName = '', subtopics = [], courseLevel } = req.body;
    if (!topicTitle || typeof topicTitle !== 'string') {
      return res.status(400).json({ error: 'topicTitle string is required' });
    }

    const isFinal = courseLevel === 'final' || paperCode.toLowerCase().includes('final') || topicTitle.toLowerCase().includes('ind as');
    const examLevelName = isFinal ? 'CA Final' : 'CA Intermediate';

    if (!process.env.GEMINI_API_KEY) {
      const fallbackCards = getCuratedFallbackFlashcards(topicTitle, paperShortName, subtopics);
      return res.json({ flashcards: fallbackCards, source: 'curated' });
    }

    const subtopicsList = Array.isArray(subtopics) && subtopics.length > 0 
      ? `Specific subtopics to cover: ${subtopics.join(', ')}.` 
      : '';

    const prompt = `You are the lead ${examLevelName} examiner and mentor for ICAI New Scheme (May 2027 exams).
Generate exactly 6 to 8 sharp, quick-fire revision flashcards for the topic: "${topicTitle}" (${paperCode} ${paperShortName}).
${subtopicsList}

Rules for high-yield ${examLevelName} flashcards:
1. Question: Crisp, direct question testing a high-probability exam concept (e.g. for Final: Ind AS disclosures, Forex formulas, SAs, Code of Ethics clauses; for Inter: AS standards, Company Law sections, GST rules).
2. Answer: Authoritative, concise ICAI standard answer (bullet points or exact rules, max 3-4 lines).
3. Category: One of ["Statutory Limit", "Core Provision", "Exam Pitfall", "Journal Entry", "Auditing Standard", "Formula", "Code of Ethics"].
4. Difficulty: "Easy", "Medium", or "Hard".
5. Key Takeaway: 1-sentence golden memory rule or mnemonic to lock it in memory.
6. Exam Tip: Common mistake students make in ICAI exams.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an expert ${examLevelName} revision flashcard generator for ICAI New Scheme. Always return strict structured JSON.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              answer: { type: Type.STRING },
              category: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              keyTakeaway: { type: Type.STRING },
              examTip: { type: Type.STRING },
            },
            required: ['question', 'answer', 'category', 'difficulty', 'keyTakeaway'],
          },
        },
        temperature: 0.5,
      },
    });

    let rawText = response.text || '[]';
    let flashcards: any[] = [];
    try {
      flashcards = JSON.parse(rawText);
      flashcards = flashcards.map((c: any, idx: number) => ({
        id: c.id || `card-${Date.now()}-${idx}`,
        question: c.question,
        answer: c.answer,
        category: c.category || 'Core Concept',
        difficulty: c.difficulty || 'Medium',
        keyTakeaway: c.keyTakeaway || '',
        examTip: c.examTip || '',
      }));
    } catch (parseErr) {
      console.warn('Failed to parse AI flashcard response as JSON:', rawText);
      flashcards = getCuratedFallbackFlashcards(topicTitle, paperShortName, subtopics);
    }

    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      flashcards = getCuratedFallbackFlashcards(topicTitle, paperShortName, subtopics);
    }

    return res.json({ flashcards, source: 'ai' });
  } catch (error: any) {
    console.error('Error in /api/ai/flashcards:', error);
    const fallbackCards = getCuratedFallbackFlashcards(
      req.body?.topicTitle || 'CA Topic',
      req.body?.paperShortName,
      req.body?.subtopics
    );
    return res.json({ flashcards: fallbackCards, source: 'curated_fallback' });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CA Study Planner Server] running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
