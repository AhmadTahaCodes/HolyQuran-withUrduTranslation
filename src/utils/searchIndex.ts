import quranMeta from '../data/quran_meta.json';

export const TOTAL_PAGES = quranMeta.total_pages || 728;

export interface SurahMeta {
  id: number;
  name_arabic: string;
  name_english: string;
  name_translation: string;
  revelation_type: string;
  total_ayahs: number;
  start_page: number;
  end_page: number;
  juz_start: number;
}

export interface JuzMeta {
  juz_number: number;
  name_arabic: string;
  name_english: string;
  start_page: number;
  end_page: number;
  start_surah_id: number;
  start_ayah: number;
}

export interface AyahSearchResult {
  surah: SurahMeta;
  ayahNumber: number;
  calculatedPage: number;
}

// Remove Arabic Tashkeel / Harakat
export function stripArabicDiacritics(text: string): string {
  if (!text) return '';
  return text.replace(/[\u064B-\u065F\u0670\u0653-\u0655]/g, '');
}

// Normalize text for fuzzy/clean searching
export function normalizeSearchString(text: string): string {
  if (!text) return '';
  const noHarakat = stripArabicDiacritics(text);
  return noHarakat
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s]/gi, '') // Keep letters, numbers, Arabic, spaces
    .replace(/\s+/g, ' ')
    .trim();
}

// Strip prefix keywords from query
export function cleanSearchQuery(rawQuery: string): {
  cleaned: string;
  extractedNumber: number | null;
} {
  let cleaned = normalizeSearchString(rawQuery);
  let extractedNumber: number | null = null;

  // Check if query is prefix + number (e.g. "surah 18", "juz 30", "para 5", "page 120", "sipara 15", "p.50")
  const prefixMatch = rawQuery.match(/(?:surah|sura|juz|para|sipara|page|pg|p|chapter)\s*(\d+)/i);
  if (prefixMatch && prefixMatch[1]) {
    extractedNumber = parseInt(prefixMatch[1], 10);
  } else {
    const directNumMatch = cleaned.match(/^(\d+)$/);
    if (directNumMatch && directNumMatch[1]) {
      extractedNumber = parseInt(directNumMatch[1], 10);
    }
  }

  // Remove prefixes from text string
  cleaned = cleaned
    .replace(/^(surah|sura|juz|para|sipara|page|pg|p|chapter)\s*/i, '')
    .trim();

  return { cleaned, extractedNumber };
}

// Popular Surah phonetic aliases mapping for Pakistani/Urdu/Global readers
const SURAH_ALIASES: Record<string, number> = {
  'fatiha': 1, 'fatihah': 1, 'fateha': 1, 'opening': 1,
  'baqara': 2, 'baqarah': 2, 'bakra': 2, 'cow': 2,
  'imran': 3, 'amran': 3, 'ali imran': 3, 'aal e imran': 3,
  'nisa': 4, 'nisaa': 4, 'women': 4,
  'maidah': 5, 'maida': 5,
  'anam': 6, 'anaam': 6,
  'araf': 7,
  'anfal': 8,
  'tawbah': 9, 'tauba': 9, 'tawba': 9, 'tobah': 9, 'toba': 9, 'repentance': 9,
  'yunus': 10, 'jonah': 10,
  'hud': 11,
  'yusuf': 12, 'joseph': 12,
  'rad': 13,
  'ibrahim': 14,
  'hijr': 15,
  'nahl': 16,
  'isra': 17, 'night journey': 17, 'bani israel': 17, 'al bani israel': 17, 'israel': 17,
  'kahf': 18, 'khaf': 18, 'cave': 18,
  'maryam': 19, 'mary': 19,
  'taha': 20,
  'anbiya': 21,
  'hajj': 22,
  'muminun': 23, 'mominun': 23,
  'nur': 24, 'noor': 24,
  'furqan': 25,
  'shuara': 26,
  'naml': 27,
  'qasas': 28,
  'ankabut': 29,
  'rum': 30,
  'luqman': 31,
  'sajdah': 32, 'sajda': 32,
  'ahzab': 33,
  'saba': 34,
  'fatir': 35,
  'yasin': 36, 'yaseen': 36, 'ya sin': 36, 'yasin surah': 36,
  'saffat': 37,
  'sad': 38,
  'zumar': 39,
  'momin': 40, 'mumin': 40, 'moumin': 40, 'ghafir': 40,
  'ha meem sajida': 41, 'ha meem sajda': 41, 'hameemsajida': 41, 'fussilat': 41,
  'shura': 42,
  'zukhruf': 43,
  'dukhan': 44,
  'jathiyah': 45, 'jathiya': 45,
  'ahqaf': 46,
  'muhammad': 47,
  'fath': 48,
  'hujurat': 49,
  'qaf': 50,
  'dhariyat': 51,
  'tur': 52,
  'najm': 53,
  'qamar': 54,
  'rahman': 55, 'rehman': 55, 'ar rahman': 55,
  'waqiah': 56, 'waqia': 56, 'waqea': 56,
  'hadid': 57,
  'mujadila': 58,
  'hashr': 59,
  'mumtahanah': 60,
  'saff': 61,
  'jumuah': 62, 'jummah': 62,
  'munafiqun': 63,
  'taghabun': 64,
  'talaq': 65,
  'tahrim': 66,
  'mulk': 67, 'sovereignty': 67, 'tabarak': 67,
  'qalam': 68,
  'haqqah': 69,
  'maarij': 70,
  'nuh': 71, 'noah': 71,
  'jinn': 72,
  'muzzammil': 73,
  'muddaththir': 74,
  'qiyamah': 75,
  'insan': 76,
  'mursalat': 77,
  'naba': 78, 'nabaa': 78, 'amma': 78,
  'naziat': 79,
  'abasa': 80,
  'takwir': 81,
  'infitar': 82,
  'mutaffifin': 83,
  'inshiqaq': 84,
  'buruj': 85,
  'tariq': 86,
  'ala': 87,
  'ghashiyah': 88,
  'fajr': 89,
  'balad': 90,
  'shams': 91,
  'layl': 92,
  'duhaa': 93,
  'sharh': 94, 'inshirah': 94,
  'tin': 95,
  'alaq': 96, 'iqra': 96,
  'qadr': 97,
  'bayyinah': 98,
  'zalzalah': 99,
  'adiyat': 100,
  'qariah': 101,
  'takathur': 102,
  'asr': 103,
  'humazah': 104,
  'fil': 105,
  'quraysh': 106,
  'maun': 107,
  'kawthar': 108,
  'kafirun': 109,
  'nasr': 110,
  'lahab': 111, 'al lahab': 111, 'masad': 111,
  'ikhlas': 112, 'qul': 112,
  'falaq': 113,
  'nas': 114, 'naas': 114
};

// Filter Surahs with alias matching, ID matching, and normalized search
export function searchSurahs(query: string, allSurahs: SurahMeta[]): SurahMeta[] {
  if (!query.trim()) return allSurahs;

  const { cleaned, extractedNumber } = cleanSearchQuery(query);

  return allSurahs.filter(s => {
    // Exact ID match
    if (extractedNumber !== null && s.id === extractedNumber) return true;

    // Direct string matches
    const nameEng = normalizeSearchString(s.name_english);
    const nameTrans = normalizeSearchString(s.name_translation);
    const nameArab = normalizeSearchString(s.name_arabic);

    if (nameEng.includes(cleaned) || nameTrans.includes(cleaned) || nameArab.includes(cleaned)) {
      return true;
    }

    // Alias check
    const matchedSurahId = SURAH_ALIASES[cleaned];
    if (matchedSurahId && matchedSurahId === s.id) {
      return true;
    }

    return false;
  }).sort((a, b) => {
    // Prioritize exact ID or prefix match
    if (extractedNumber !== null) {
      if (a.id === extractedNumber) return -1;
      if (b.id === extractedNumber) return 1;
    }
    return a.id - b.id;
  });
}

// Filter Juz with number extraction and normalized search
export function searchJuzs(query: string, allJuzs: JuzMeta[]): JuzMeta[] {
  if (!query.trim()) return allJuzs;

  const { cleaned, extractedNumber } = cleanSearchQuery(query);

  return allJuzs.filter(j => {
    if (extractedNumber !== null && j.juz_number === extractedNumber) return true;

    const nameEng = normalizeSearchString(j.name_english);
    const nameArab = normalizeSearchString(j.name_arabic);

    if (nameEng.includes(cleaned) || nameArab.includes(cleaned)) {
      return true;
    }

    return false;
  }).sort((a, b) => {
    if (extractedNumber !== null) {
      if (a.juz_number === extractedNumber) return -1;
      if (b.juz_number === extractedNumber) return 1;
    }
    return a.juz_number - b.juz_number;
  });
}

// Direct Page Number search validator
export function parseDirectPageNumber(query: string): number | null {
  const { extractedNumber } = cleanSearchQuery(query);
  if (extractedNumber !== null && extractedNumber >= 1 && extractedNumber <= TOTAL_PAGES) {
    return extractedNumber;
  }
  return null;
}

// Parse Ayah Query (e.g. "2:255", "18:10", "36:58", "yasin 58", "baqarah 255")
export function parseAyahQuery(query: string, allSurahs: SurahMeta[]): AyahSearchResult | null {
  const raw = query.trim();
  if (!raw) return null;

  // Pattern 1: "2:255", "18:10", "36:58"
  const colonMatch = raw.match(/^(\d{1,3})\s*:\s*(\d{1,3})$/);
  if (colonMatch) {
    const surahId = parseInt(colonMatch[1], 10);
    const ayahNum = parseInt(colonMatch[2], 10);
    const surah = allSurahs.find(s => s.id === surahId);
    if (surah) {
      const validAyah = Math.max(1, Math.min(surah.total_ayahs, ayahNum));
      const pageRange = surah.end_page - surah.start_page;
      const pageOffset = surah.total_ayahs > 1 ? Math.floor(((validAyah - 1) / (surah.total_ayahs - 1)) * pageRange) : 0;
      const calculatedPage = Math.min(surah.end_page, surah.start_page + pageOffset);
      return { surah, ayahNumber: validAyah, calculatedPage };
    }
  }

  // Pattern 2: "yasin 58", "baqarah 255", "kahf 10", "surah 2 ayah 255", "s2 a255"
  const textAyahMatch = raw.match(/^(.*?)\s*(?:ayah|aya|v|verse|:|\s)\s*(\d{1,3})$/i);
  if (textAyahMatch) {
    const surahPart = textAyahMatch[1].trim();
    const ayahNum = parseInt(textAyahMatch[2], 10);
    const matchedSurahs = searchSurahs(surahPart, allSurahs);
    if (matchedSurahs.length > 0) {
      const surah = matchedSurahs[0];
      const validAyah = Math.max(1, Math.min(surah.total_ayahs, ayahNum));
      const pageRange = surah.end_page - surah.start_page;
      const pageOffset = surah.total_ayahs > 1 ? Math.floor(((validAyah - 1) / (surah.total_ayahs - 1)) * pageRange) : 0;
      const calculatedPage = Math.min(surah.end_page, surah.start_page + pageOffset);
      return { surah, ayahNumber: validAyah, calculatedPage };
    }
  }

  return null;
}
