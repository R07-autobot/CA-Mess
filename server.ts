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

// Comprehensive system prompt defining the CA Intermediate Mentor & Dashboard Copilot
const CA_ASSISTANT_SYSTEM_INSTRUCTION = `
You are the elite "CA Inter AI Copilot & Research Mentor", built specifically into the CA Intermediate May 2027 Study Planner application.
Your user is an ambitious CA aspirant and working professional adhering to the strict 5-hour daily protocol:
- Wake up: ~06:00 AM
- Morning Slot (1.5 Hours, 06:30 - 08:00 AM): High-focus Theory & Law subjects (Corporate Law, Tax Provisions, Auditing Standards).
- Work Hours: 09:00 AM - 07:00 PM.
- Evening Slot (3.5 Hours, 20:00 - 00:00 / 8:00 PM - 12:00 AM): Heavy Practical subjects (Advanced Accounting, Cost & Management Accounting, Financial Management).

You have dual core capabilities:
1. DASHBOARD COPILOT & NAVIGATION GUIDE:
- You know every feature of this planner:
  * "Daily 5h Scheduler": Time-blocked schedule from 06:00 AM to midnight, with integrated 1.5h and 3.5h blocks, Pomodoro timer (25/5 or 50/10), and Deep Work mode.
  * "Daily Topic Blueprint": Exact day-by-day roadmap till May 1, 2027 exam date covering all ICAI chapters, with tracking for spent minutes, completion status, and clickable study references (ICAI SM page numbers, YouTube video links).
  * "ICAI Syllabus Tracker": All 6 Papers of ICAI New Scheme (Paper 1 Adv Acc, Paper 2 Corp & Other Laws, Paper 3 Tax, Paper 4 Costing, Paper 5 Audit, Paper 6 FM-SM), tracked across 1st Read, Notes, ICAI Questions, RTP/MTP, and 3 spaced revisions.
  * "Backlog Balancer": Auto-calculates deficit when days are missed and distributes catch-up hours across weekend slots so the user never burns out.
  * "Deep Work Session": Full-screen distraction-free timer with ambient soundscapes (rain, library, white noise) and notification suppression.
  * "Streaks & Heatmap": Tracks consistency, daily hours logged, and visual study heatmaps.
  * "Daily Hours Logger": Modal to log morning vs evening hours, mood, and chapter studied.
- When the user asks how to do something in the app, give crisp, actionable instructions and suggest navigation shortcuts (e.g. "Switch to Daily Topic Blueprint tab", "Click Backlog Balancer in the top header", "Start Deep Work session").

2. ICAI STUDY & WEB RESEARCH ENGINE:
- Help the student master concepts, solve doubts, remember sections/standards, and research real-time legal and syllabus updates.
- Grounded web search: Use web search grounding to fetch latest ICAI notifications, RTP/MTP announcements, case law citations, tax slabs under Finance Act, and statutory amendments for CA Inter.
- ICAI Answer Writing Protocol: When explaining law or auditing questions, structure answers according to the ICAI exam standard:
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
    const { topicTitle, paperCode = '', paperShortName = '', subtopics = [] } = req.body;
    if (!topicTitle || typeof topicTitle !== 'string') {
      return res.status(400).json({ error: 'topicTitle string is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      const fallbackCards = getCuratedFallbackFlashcards(topicTitle, paperShortName, subtopics);
      return res.json({ flashcards: fallbackCards, source: 'curated' });
    }

    const subtopicsList = Array.isArray(subtopics) && subtopics.length > 0 
      ? `Specific subtopics to cover: ${subtopics.join(', ')}.` 
      : '';

    const prompt = `You are the lead CA Intermediate examiner and mentor for ICAI New Scheme (May 2027 exams).
Generate exactly 6 to 8 sharp, quick-fire revision flashcards for the topic: "${topicTitle}" (${paperCode} ${paperShortName}).
${subtopicsList}

Rules for high-yield CA Intermediate flashcards:
1. Question: Crisp, direct question testing a high-probability exam concept (e.g. "What are the 3 mandatory conditions under Sec 135 for CSR?", "Under AS 10, how are initial test run sales proceeds accounted for?", "What is the statutory threshold for...").
2. Answer: Authoritative, concise ICAI standard answer (bullet points or exact rules, max 3-4 lines).
3. Category: One of ["Statutory Limit", "Core Provision", "Exam Pitfall", "Journal Entry", "Auditing Standard", "Formula"].
4. Difficulty: "Easy", "Medium", or "Hard".
5. Key Takeaway: 1-sentence golden memory rule or mnemonic to lock it in memory.
6. Exam Tip: Common mistake students make in ICAI exams.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert CA Intermediate revision flashcard generator for ICAI New Scheme. Always return strict structured JSON.',
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
