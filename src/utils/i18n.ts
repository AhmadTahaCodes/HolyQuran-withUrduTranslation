export type Language = 'en' | 'ur';

export interface Translations {
  appName: string;
  appSubtitle: string;
  home: string;
  read: string;
  index: string;
  search: string;
  bookmarks: string;
  settings: string;
  offline: string;
  continueReading: string;
  page: string;
  ofPages: string;
  juz: string;
  surah: string;
  manzil: string;
  viewAllSurahs: string;
  quickJump: string;
  totalSurahs: string;
  totalJuz: string;
  savedPins: string;
  installApp: string;
  installedNotice: string;
  theme: string;
  themeDark: string;
  themeSepia: string;
  themeLight: string;
  viewMode: string;
  viewSingle: string;
  viewDual: string;
  viewContinuous: string;
  zoom: string;
  resetZoom: string;
  bookmarkThisPage: string;
  close: string;
  jump: string;
  searchPlaceholder: string;
  noResults: string;
  zenMode: string;
  exitZenMode: string;
  greeting: string;
  welcome: string;
  downloadMushaf: string;
  pagesCached: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "The Holy Quran",
    appSubtitle: "With Urdu Translation",
    home: "Home",
    read: "Read",
    index: "Index",
    search: "Search",
    bookmarks: "Bookmarks",
    settings: "Settings",
    offline: "Offline",
    continueReading: "Continue Reading",
    page: "Page",
    ofPages: "of",
    juz: "Juz",
    surah: "Surah",
    manzil: "Manzil",
    viewAllSurahs: "View All 114 Surahs",
    quickJump: "Quick Jump Surahs",
    totalSurahs: "114 Surahs",
    totalJuz: "30 Juz / Para",
    savedPins: "Saved Pins",
    installApp: "Install App",
    installedNotice: "App installed on home screen",
    theme: "Theme",
    themeDark: "Dark Midnight",
    themeSepia: "Warm Parchment",
    themeLight: "Light Classic",
    viewMode: "View Mode",
    viewSingle: "Single Page",
    viewDual: "Dual Spread",
    viewContinuous: "Continuous",
    zoom: "Zoom",
    resetZoom: "Reset",
    bookmarkThisPage: "Bookmark Page",
    close: "Close",
    jump: "Jump",
    searchPlaceholder: "Search Surah, Juz, Ayah (e.g. 2:255, Yasin), or Page 1-729...",
    noResults: "No results found",
    zenMode: "Full Screen Mode",
    exitZenMode: "Tap to exit full screen",
    greeting: "السَّلَامُ عَلَيْكُمْ",
    welcome: "Welcome",
    downloadMushaf: "Download Complete Quran for Offline",
    pagesCached: "Pages saved offline"
  },
  ur: {
    appName: "القرآن الکریم",
    appSubtitle: "اردو ترجمہ کے ساتھ",
    home: "صفحہ اول",
    read: "تلاوت",
    index: "فہرست",
    search: "تلاش",
    bookmarks: "محفوظ شدہ",
    settings: "ترتیبات",
    offline: "آف لائن",
    continueReading: "تلاوت جاری رکھیں",
    page: "صفحہ",
    ofPages: "از",
    juz: "پارہ",
    surah: "سورت",
    manzil: "منزل",
    viewAllSurahs: "تمام ۱۱۴ سورتیں",
    quickJump: "منتخب سورتیں",
    totalSurahs: "۱۱۴ سورتیں",
    totalJuz: "۳۰ پارے",
    savedPins: "محفوظ نشانات",
    installApp: "ایپ انسٹال کریں",
    installedNotice: "ایپ ہوم اسکرین پر موجود ہے",
    theme: "رنگ و انداز",
    themeDark: "رات (تاریک)",
    themeSepia: "کاغذی (زعفرانی)",
    themeLight: "دن (روشن)",
    viewMode: "طرزِ مطالعہ",
    viewSingle: "ایک صفحہ",
    viewDual: "دو صفحات",
    viewContinuous: "مسلسل اسکرول",
    zoom: "زوم",
    resetZoom: "اصل سائز",
    bookmarkThisPage: "نشان لگائیں",
    close: "بند کریں",
    jump: "جائیں",
    searchPlaceholder: "سورت، پارہ، آیت یا صفحہ نمبر تلاش کریں...",
    noResults: "کوئی نتیجہ نہیں ملا",
    zenMode: "مکمل اسکرین",
    exitZenMode: "فل اسکرین بند کرنے کے لیے ٹیپ کریں",
    greeting: "السَّلَامُ عَلَيْكُمْ",
    welcome: "خوش آمدید",
    downloadMushaf: "مکمل قرآن آف لائن محفوظ کریں",
    pagesCached: "صفحات آف لائن محفوظ ہیں"
  }
};
