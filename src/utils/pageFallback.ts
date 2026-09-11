/**
 * Fallback page generator utility.
 * Generates dynamic SVG Data URLs for Quran pages (1-728) when physical WebP image assets
 * are not yet uploaded, allowing instant out-of-the-box demo testing.
 */
import quranMeta from '../data/quran_meta.json';

export interface PageMeta {
  pageNumber: number;
  surah: typeof quranMeta.surahs[0];
  juzNumber: number;
}

export function getPageMetadata(pageNumber: number): PageMeta {
  const totalPages = quranMeta.total_pages || 729;
  const page = Math.max(1, Math.min(totalPages, pageNumber));
  
  if (page === 1) {
    return {
      pageNumber: 1,
      surah: {
        id: 0,
        name_arabic: "غِلَافُ القُرْآنِ",
        name_english: "Quran Cover",
        name_translation: "The Holy Quran",
        revelation_type: "Frontispiece",
        total_ayahs: 0,
        start_page: 1,
        end_page: 1,
        juz_start: 1
      },
      juzNumber: 1
    };
  }

  // Find primary surah starting on or covering this page (matches user page index)
  const surah = quranMeta.surahs
    .slice()
    .reverse()
    .find(s => page >= s.start_page) || quranMeta.surahs[0];
  
  // Find juz starting on or covering this page
  const juz = quranMeta.juzs
    .slice()
    .reverse()
    .find(j => page >= j.start_page) || quranMeta.juzs[0];
  
  return {
    pageNumber: page,
    surah,
    juzNumber: juz.juz_number
  };
}

// Convert English digits to Arabic-Indic numerals
export function toArabicNumerals(num: number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(d => arabicDigits[parseInt(d, 10)] || d).join('');
}

export function generateFallbackPageDataUrl(pageNumber: number): string {
  const meta = getPageMetadata(pageNumber);
  const arabicPageStr = toArabicNumerals(pageNumber);
  const surahName = meta.surah.name_arabic;
  const juzNum = toArabicNumerals(meta.juzNumber);
  
  let verseText1 = "";
  let verseText2 = "";
  let verseText3 = "";

  if (pageNumber === 1) {
    verseText1 = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝١";
    verseText2 = "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ۝٢ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝٣ مَـٰلِكِ يَوْمِ ٱلدِّينِ ۝٤";
    verseText3 = "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝٥ ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ ۝٦ ٱلضَّآلِّينَ ۝٧";
  } else if (pageNumber === 2) {
    verseText1 = "الم ۝١ ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ ۝٢";
    verseText2 = "ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَـٰهُمْ يُنفِقُونَ ۝٣";
    verseText3 = "وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن قَبْلِكَ ۝٤";
  } else {
    const sampleAyahs = [
      "إِنَّ ٱلَّذِينَ كَفَرُوا۟ سَوَآءٌ عَلَيْهِمْ أَءَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ ۝٦",
      "خَتَمَ ٱللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ وَعَلَىٰ أَبْصَـٰرِهِمْ غِشَـٰوَةٌ ۝٧",
      "وَمِنَ ٱلنَّاسِ مَن يَقُولُ ءَامَنَّا بِٱللَّهِ وَبِٱلْيَوْمِ ٱلْـَٔاخِرِ وَمَا هُم بِمُؤْمِنِينَ ۝٨"
    ];
    verseText1 = sampleAyahs[(pageNumber - 1) % sampleAyahs.length];
    verseText2 = sampleAyahs[(pageNumber) % sampleAyahs.length];
    verseText3 = sampleAyahs[(pageNumber + 1) % sampleAyahs.length];
  }

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 1000" width="700" height="1000" style="background-color: #fffdf7;">
    <defs>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#d4af37" />
        <stop offset="50%" stop-color="#aa7c11" />
        <stop offset="100%" stop-color="#5b4006" />
      </linearGradient>
    </defs>

    <rect x="25" y="25" width="650" height="950" fill="none" stroke="url(#gold)" stroke-width="6" rx="4"/>
    <rect x="35" y="35" width="630" height="930" fill="none" stroke="#059669" stroke-width="1.5" rx="2"/>

    <rect x="50" y="55" width="600" height="40" fill="#fcf9ee" stroke="url(#gold)" stroke-width="1"/>
    
    <text x="75" y="80" font-family="'Amiri', 'Scheherazade New', serif" font-size="20" font-weight="bold" fill="#059669" text-anchor="start">
      سُورَةُ ${surahName}
    </text>

    <text x="625" y="80" font-family="'Amiri', 'Scheherazade New', serif" font-size="20" font-weight="bold" fill="#059669" text-anchor="end">
      الجُزْءُ ${juzNum}
    </text>

    <g transform="translate(60, 115)">
      <rect x="0" y="0" width="580" height="50" fill="#059669" rx="6"/>
      <text x="290" y="33" font-family="'Amiri', 'Scheherazade New', serif" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle">
        سُورَةُ ${surahName}
      </text>
    </g>

    <text x="350" y="210" font-family="'Amiri', 'Scheherazade New', serif" font-size="28" font-weight="bold" fill="#0f172a" text-anchor="middle">
      بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
    </text>

    <g transform="translate(350, 280)" font-family="'Amiri', 'Scheherazade New', serif" font-size="24" fill="#1e293b" text-anchor="middle">
      <text x="0" y="0">${verseText1}</text>
      <text x="0" y="70">${verseText2}</text>
      <text x="0" y="140">${verseText3}</text>
    </g>

    <g transform="translate(350, 935)">
      <circle cx="0" cy="0" r="22" fill="#059669" stroke="url(#gold)" stroke-width="2"/>
      <text x="0" y="7" font-family="'Amiri', 'Scheherazade New', serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">
        ${arabicPageStr}
      </text>
    </g>
  </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
