import { TopicLinkReference } from '../types/ca-study';

/**
 * Strips bracketed phase prefixes from topic titles (e.g. "[R1 + RTP] Management & Administration" -> "Management & Administration")
 */
export function cleanTopicTitle(title: string): string {
  if (!title) return '';
  return title.replace(/^\[[^\]]+\]\s*/, '').trim();
}

/**
 * Returns top CA Intermediate faculty and institutes tailored for each specific subject
 */
export function getFacultyForPaper(paperShortName: string): {
  freeFaculty: string;
  paidFaculty: string;
  paidInstitute: string;
  bareActType: string;
} {
  const norm = (paperShortName || '').toLowerCase();

  if (norm.includes('law')) {
    return {
      freeFaculty: 'CA Shubham Singhal (The Ultimate CA)',
      paidFaculty: 'CA Shubham Singhal',
      paidInstitute: 'The Ultimate CA / Vsmart',
      bareActType: 'MCA Companies Act 2013 Bare Act',
    };
  }
  if (norm.includes('acc') || norm.includes('adv')) {
    return {
      freeFaculty: 'CA Nitin Goel / CA Parveen Sharma',
      paidFaculty: 'CA Parveen Sharma',
      paidInstitute: 'Aldine CA',
      bareActType: 'ICAI Accounting Standards (AS) Portal',
    };
  }
  if (norm.includes('tax') || norm.includes('dt') || norm.includes('gst')) {
    return {
      freeFaculty: 'CA Bhanwar Borana (DT) & CA Vishal Bhattad (GST)',
      paidFaculty: 'CA Bhanwar Borana (BB Virtuals)',
      paidInstitute: 'BB Virtuals / Vsmart',
      bareActType: 'Income Tax Act 1961 & CGST Act 2017',
    };
  }
  if (norm.includes('cost')) {
    return {
      freeFaculty: 'CA Rahul Garg / CA Namit Arora',
      paidFaculty: 'CA Rahul Garg',
      paidInstitute: 'RKG Institute / Edu91',
      bareActType: 'ICAI Costing Principles & CAS',
    };
  }
  if (norm.includes('audit')) {
    return {
      freeFaculty: 'CA Neeraj Arora / CA Rishabh Jain',
      paidFaculty: 'CA Neeraj Arora',
      paidInstitute: 'Edu91',
      bareActType: 'ICAI Standards on Auditing (SAs) Compendium',
    };
  }
  if (norm.includes('fm') || norm.includes('sm')) {
    return {
      freeFaculty: 'CA Swapnil Patni / CA Aaditya Jain',
      paidFaculty: 'CA Swapnil Patni',
      paidInstitute: 'SPC (Swapnil Patni Classes)',
      bareActType: 'Strategic Management Model Frameworks',
    };
  }

  return {
    freeFaculty: 'Top CA Faculty Marathon',
    paidFaculty: 'Leading Subject Specialist',
    paidInstitute: 'Premier CA Institute',
    bareActType: 'ICAI Official References',
  };
}

/**
 * Generates direct, redirectable Free and Paid study resources tailored specifically
 * to ANY given topic with the exact topic name in the resource title and URL query!
 */
export function generateTopicResources(
  paperShortName: string,
  paperCode: string,
  rawChapterTitle: string,
  subtopics: string[] = []
): TopicLinkReference[] {
  const cleanTitle = cleanTopicTitle(rawChapterTitle);
  const faculty = getFacultyForPaper(paperShortName);
  const subjectLabel = paperShortName || paperCode || 'CA Inter';

  // Specific query keywords for search redirects
  const primarySubtopic = subtopics && subtopics.length > 0 ? subtopics[0].replace(/^(Section \d+:|AS \d+:|SA \d+:)/, '').trim() : '';
  const searchCore = encodeURIComponent(`CA Inter ${subjectLabel} ${cleanTitle}`);
  const youtubeSearchCore = encodeURIComponent(`CA Inter ${subjectLabel} ${cleanTitle} ${faculty.paidFaculty} marathon revision`);
  const bareActSearchCore = encodeURIComponent(`${faculty.bareActType} ${cleanTitle}`);
  const bookSearchCore = encodeURIComponent(`Taxmann Cracker CA Inter ${subjectLabel} ${cleanTitle} Scanner`);
  const testSearchCore = encodeURIComponent(`CA Test Series ${subjectLabel} ${cleanTitle} Chapter Test`);

  return [
    // ----------------------------------------------------
    // 1. FREE RESOURCES (ICAI SM, YouTube Marathon, Bare Act)
    // ----------------------------------------------------
    {
      id: `link_free_sm_${Math.random().toString(36).substring(2, 8)}`,
      title: `${cleanTitle} - ICAI BoS Official Study Material PDF`,
      type: 'icai_sm',
      costType: 'free',
      provider: 'ICAI BoS Knowledge Portal',
      url: `https://www.google.com/search?q=${searchCore}+ICAI+BoS+Study+Material+PDF`,
      priceNote: 'Free Official ICAI Study Material',
    },
    {
      id: `link_free_yt_${Math.random().toString(36).substring(2, 8)}`,
      title: `${cleanTitle} - Free Full Revision Lecture (${faculty.freeFaculty.split('(')[0].trim()})`,
      type: 'youtube',
      costType: 'free',
      provider: faculty.freeFaculty,
      url: `https://www.youtube.com/results?search_query=${youtubeSearchCore}`,
      videoId: `yt_${cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20)}`,
      priceNote: 'Free High-Yield YouTube Revision',
    },
    {
      id: `link_free_bare_${Math.random().toString(36).substring(2, 8)}`,
      title: `${cleanTitle} - Statutory Provisions & Standards Reference`,
      type: 'bare_act',
      costType: 'free',
      provider: faculty.bareActType,
      url: `https://www.google.com/search?q=${bareActSearchCore}`,
      priceNote: 'Free Statutory Reference',
    },

    // ----------------------------------------------------
    // 2. PAID RESOURCES (Faculty Batches, Taxmann Scanners, Test Series)
    // ----------------------------------------------------
    {
      id: `link_paid_batch_${Math.random().toString(36).substring(2, 8)}`,
      title: `${cleanTitle} - Video Batch (${faculty.paidFaculty})`,
      type: 'paid_batch',
      costType: 'paid',
      provider: faculty.paidInstitute,
      url: `https://www.google.com/search?q=${searchCore}+${encodeURIComponent(faculty.paidFaculty)}+Video+Batch`,
      priceNote: 'Paid Fast-Track / Regular Batch (~₹4,500 - ₹6,500)',
    },
    {
      id: `link_paid_book_${Math.random().toString(36).substring(2, 8)}`,
      title: `${cleanTitle} - Taxmann CRACKER Past 10-Yr Exam Scanner`,
      type: 'paid_book',
      costType: 'paid',
      provider: 'Taxmann Publications',
      url: `https://www.google.com/search?q=${bookSearchCore}`,
      priceNote: 'Paid Physical Question Bank (~₹650)',
    },
    {
      id: `link_paid_test_${Math.random().toString(36).substring(2, 8)}`,
      title: `${cleanTitle} - Evaluated Chapter-wise Simulation Test`,
      type: 'test_series',
      costType: 'paid',
      provider: 'CA Test Series / PrepCA',
      url: `https://www.google.com/search?q=${testSearchCore}`,
      priceNote: 'Paid Evaluated Test with Feedback (~₹1,200)',
    },
  ];
}

/**
 * Returns a 1-click redirectable search URL for any subtopic
 */
export function getSubtopicRedirectUrl(
  paperShortName: string,
  subtopic: string,
  type: 'youtube' | 'google' | 'icai_sm'
): string {
  const query = encodeURIComponent(`CA Inter ${paperShortName} ${subtopic}`);
  if (type === 'youtube') {
    return `https://www.youtube.com/results?search_query=${query}+concept`;
  }
  if (type === 'icai_sm') {
    return `https://www.google.com/search?q=${query}+ICAI+BoS+Study+Material+PDF`;
  }
  return `https://www.google.com/search?q=${query}`;
}
