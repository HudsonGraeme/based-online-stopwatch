import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import localforage from 'localforage';

const resources = {
  en: {
    translation: {
      // Navigation
      "Stopwatch": "Stopwatch",
      "Countdown": "Countdown",
      "Race Timers": "Race Timers",
      "Classroom Timers": "Classroom Timers",
      "Holiday Timers": "Holiday Timers",
      "Random Name Pickers": "Random Name Pickers",
      "Random Number Generators": "Random Number Generators",
      "Sensory Timers": "Sensory Timers",
      "Clocks": "Clocks",
      "Exam Timers": "Exam Timers",
      "Chance Games": "Chance Games",
      "Group Generators": "Group Generators",
      "Presentation Timers": "Presentation Timers",
      "Tally Counters": "Tally Counters",
      
      // Common
      "Start": "Start",
      "Stop": "Stop",
      "Reset": "Reset",
      "Lap": "Lap",
      "Go Home": "Go Home",
      "Reload": "Reload",
      "Go Fullscreen": "Go Fullscreen",
      "Exit Fullscreen": "Exit Fullscreen",
      "Language": "Language",
      "Coming soon...": "Coming soon...",
      
      // Timer specific
      "Based Online Stopwatch": "Based Online Stopwatch",
      "Based Online Stopwatch - Free Online Timer & Stopwatch Tools": "Based Online Stopwatch - Free Online Timer & Stopwatch Tools",
      "Free online stopwatch, countdown timer, and time tracking tools. Perfect for classrooms, presentations, races, and productivity. No ads, no downloads required.": "Free online stopwatch, countdown timer, and time tracking tools. Perfect for classrooms, presentations, races, and productivity. No ads, no downloads required."
    }
  },
  es: {
    translation: {
      // Navigation
      "Stopwatch": "Cronómetro",
      "Countdown": "Cuenta Regresiva",
      "Race Timers": "Cronómetros de Carrera",
      "Classroom Timers": "Cronómetros de Aula",
      "Holiday Timers": "Cronómetros de Vacaciones",
      "Random Name Pickers": "Seleccionador de Nombres",
      "Random Number Generators": "Generador de Números",
      "Sensory Timers": "Cronómetros Sensoriales",
      "Clocks": "Relojes",
      "Exam Timers": "Cronómetros de Examen",
      "Chance Games": "Juegos de Azar",
      "Group Generators": "Generador de Grupos",
      "Presentation Timers": "Cronómetros de Presentación",
      "Tally Counters": "Contadores",
      
      // Common
      "Start": "Iniciar",
      "Stop": "Detener",
      "Reset": "Reiniciar",
      "Lap": "Vuelta",
      "Go Home": "Ir al Inicio",
      "Reload": "Recargar",
      "Go Fullscreen": "Pantalla Completa",
      "Exit Fullscreen": "Salir de Pantalla Completa",
      "Language": "Idioma",
      "Coming soon...": "Próximamente...",
      
      // Timer specific
      "Based Online Stopwatch": "Cronómetro Online Basado"
    }
  },
  fr: {
    translation: {
      // Navigation
      "Stopwatch": "Chronomètre",
      "Countdown": "Compte à Rebours",
      "Race Timers": "Chronos de Course",
      "Classroom Timers": "Chronos de Classe",
      "Holiday Timers": "Chronos de Vacances",
      "Random Name Pickers": "Sélecteur de Noms",
      "Random Number Generators": "Générateur de Nombres",
      "Sensory Timers": "Chronos Sensoriels",
      "Clocks": "Horloges",
      "Exam Timers": "Chronos d'Examen",
      "Chance Games": "Jeux de Hasard",
      "Group Generators": "Générateur de Groupes",
      "Presentation Timers": "Chronos de Présentation",
      "Tally Counters": "Compteurs",
      
      // Common
      "Start": "Commencer",
      "Stop": "Arrêter",
      "Reset": "Réinitialiser",
      "Lap": "Tour",
      "Go Home": "Accueil",
      "Reload": "Recharger",
      "Go Fullscreen": "Plein Écran",
      "Exit Fullscreen": "Quitter Plein Écran",
      "Language": "Langue",
      "Coming soon...": "Bientôt disponible...",
      
      // Timer specific
      "Based Online Stopwatch": "Chronomètre Online Basé"
    }
  },
  de: {
    translation: {
      // Navigation
      "Stopwatch": "Stoppuhr",
      "Countdown": "Countdown",
      "Race Timers": "Rennzeiten",
      "Classroom Timers": "Klassenzeiten",
      "Holiday Timers": "Feiertagszeiten",
      "Random Name Pickers": "Zufallsnamenwähler",
      "Random Number Generators": "Zufallszahlengenerator",
      "Sensory Timers": "Sensorische Zeiten",
      "Clocks": "Uhren",
      "Exam Timers": "Prüfungszeiten",
      "Chance Games": "Glücksspiele",
      "Group Generators": "Gruppengenerator",
      "Presentation Timers": "Präsentationszeiten",
      "Tally Counters": "Zähler",
      
      // Common
      "Start": "Start",
      "Stop": "Stop",
      "Reset": "Zurücksetzen",
      "Lap": "Runde",
      "Go Home": "Startseite",
      "Reload": "Neu laden",
      "Go Fullscreen": "Vollbild",
      "Exit Fullscreen": "Vollbild beenden",
      "Language": "Sprache",
      "Coming soon...": "Demnächst...",
      
      // Timer specific
      "Based Online Stopwatch": "Based Online Stoppuhr"
    }
  },
  it: {
    translation: {
      // Navigation
      "Stopwatch": "Cronometro",
      "Countdown": "Conto alla Rovescia",
      "Race Timers": "Timer di Gara",
      "Classroom Timers": "Timer per Aula",
      "Holiday Timers": "Timer per Vacanze",
      "Random Name Pickers": "Selettore di Nomi",
      "Random Number Generators": "Generatore di Numeri",
      "Sensory Timers": "Timer Sensoriali",
      "Clocks": "Orologi",
      "Exam Timers": "Timer per Esami",
      "Chance Games": "Giochi d'Azzardo",
      "Group Generators": "Generatore di Gruppi",
      "Presentation Timers": "Timer per Presentazioni",
      "Tally Counters": "Contatori",
      
      // Common
      "Start": "Avvia",
      "Stop": "Stop",
      "Reset": "Reimposta",
      "Lap": "Giro",
      "Go Home": "Vai alla Home",
      "Reload": "Ricarica",
      "Go Fullscreen": "Schermo Intero",
      "Exit Fullscreen": "Esci da Schermo Intero",
      "Language": "Lingua",
      "Coming soon...": "Prossimamente...",
      
      // Timer specific
      "Based Online Stopwatch": "Cronometro Online Basato"
    }
  },
  pt: {
    translation: {
      // Navigation
      "Stopwatch": "Cronômetro",
      "Countdown": "Contagem Regressiva",
      "Race Timers": "Cronômetros de Corrida",
      "Classroom Timers": "Cronômetros de Aula",
      "Holiday Timers": "Cronômetros de Feriado",
      "Random Name Pickers": "Seletor de Nomes",
      "Random Number Generators": "Gerador de Números",
      "Sensory Timers": "Cronômetros Sensoriais",
      "Clocks": "Relógios",
      "Exam Timers": "Cronômetros de Exame",
      "Chance Games": "Jogos de Azar",
      "Group Generators": "Gerador de Grupos",
      "Presentation Timers": "Cronômetros de Apresentação",
      "Tally Counters": "Contadores",
      
      // Common
      "Start": "Iniciar",
      "Stop": "Parar",
      "Reset": "Resetar",
      "Lap": "Volta",
      "Go Home": "Ir para Início",
      "Reload": "Recarregar",
      "Go Fullscreen": "Tela Cheia",
      "Exit Fullscreen": "Sair da Tela Cheia",
      "Language": "Idioma",
      "Coming soon...": "Em breve...",
      
      // Timer specific
      "Based Online Stopwatch": "Cronômetro Online Baseado"
    }
  },
  zh: {
    translation: {
      // Navigation
      "Stopwatch": "秒表",
      "Countdown": "倒计时",
      "Race Timers": "比赛计时器",
      "Classroom Timers": "课堂计时器",
      "Holiday Timers": "节日计时器",
      "Random Name Pickers": "随机姓名选择器",
      "Random Number Generators": "随机数生成器",
      "Sensory Timers": "感官计时器",
      "Clocks": "时钟",
      "Exam Timers": "考试计时器",
      "Chance Games": "机会游戏",
      "Group Generators": "组生成器",
      "Presentation Timers": "演示计时器",
      "Tally Counters": "计数器",
      
      // Common
      "Start": "开始",
      "Stop": "停止",
      "Reset": "重置",
      "Lap": "圈",
      "Go Home": "回到首页",
      "Reload": "重新加载",
      "Go Fullscreen": "全屏",
      "Exit Fullscreen": "退出全屏",
      "Language": "语言",
      "Coming soon...": "即将推出...",
      
      // Timer specific
      "Based Online Stopwatch": "基础在线秒表"
    }
  },
  ja: {
    translation: {
      // Navigation
      "Stopwatch": "ストップウォッチ",
      "Countdown": "カウントダウン",
      "Race Timers": "レースタイマー",
      "Classroom Timers": "教室タイマー",
      "Holiday Timers": "休日タイマー",
      "Random Name Pickers": "ランダム名前選択",
      "Random Number Generators": "乱数生成器",
      "Sensory Timers": "感覚タイマー",
      "Clocks": "時計",
      "Exam Timers": "試験タイマー",
      "Chance Games": "チャンスゲーム",
      "Group Generators": "グループ生成器",
      "Presentation Timers": "プレゼンタイマー",
      "Tally Counters": "カウンター",
      
      // Common
      "Start": "開始",
      "Stop": "停止",
      "Reset": "リセット",
      "Lap": "ラップ",
      "Go Home": "ホームに戻る",
      "Reload": "再読み込み",
      "Go Fullscreen": "フルスクリーン",
      "Exit Fullscreen": "フルスクリーン終了",
      "Language": "言語",
      "Coming soon...": "近日公開...",
      
      // Timer specific
      "Based Online Stopwatch": "ベースオンラインストップウォッチ"
    }
  },
  ko: {
    translation: {
      // Navigation
      "Stopwatch": "스톱워치",
      "Countdown": "카운트다운",
      "Race Timers": "경주 타이머",
      "Classroom Timers": "교실 타이머",
      "Holiday Timers": "휴일 타이머",
      "Random Name Pickers": "무작위 이름 선택",
      "Random Number Generators": "난수 생성기",
      "Sensory Timers": "감각 타이머",
      "Clocks": "시계",
      "Exam Timers": "시험 타이머",
      "Chance Games": "기회 게임",
      "Group Generators": "그룹 생성기",
      "Presentation Timers": "프레젠테이션 타이머",
      "Tally Counters": "카운터",
      
      // Common
      "Start": "시작",
      "Stop": "정지",
      "Reset": "재설정",
      "Lap": "랩",
      "Go Home": "홈으로",
      "Reload": "새로고침",
      "Go Fullscreen": "전체화면",
      "Exit Fullscreen": "전체화면 종료",
      "Language": "언어",
      "Coming soon...": "곧 출시...",
      
      // Timer specific
      "Based Online Stopwatch": "베이스 온라인 스톱워치"
    }
  },
  ru: {
    translation: {
      // Navigation
      "Stopwatch": "Секундомер",
      "Countdown": "Обратный отсчет",
      "Race Timers": "Гоночные таймеры",
      "Classroom Timers": "Классные таймеры",
      "Holiday Timers": "Праздничные таймеры",
      "Random Name Pickers": "Выбор имён",
      "Random Number Generators": "Генератор чисел",
      "Sensory Timers": "Сенсорные таймеры",
      "Clocks": "Часы",
      "Exam Timers": "Экзаменационные таймеры",
      "Chance Games": "Игры удачи",
      "Group Generators": "Генератор групп",
      "Presentation Timers": "Презентационные таймеры",
      "Tally Counters": "Счетчики",
      
      // Common
      "Start": "Старт",
      "Stop": "Стоп",
      "Reset": "Сброс",
      "Lap": "Круг",
      "Go Home": "На главную",
      "Reload": "Перезагрузить",
      "Go Fullscreen": "Во весь экран",
      "Exit Fullscreen": "Выйти из полноэкранного режима",
      "Language": "Язык",
      "Coming soon...": "Скоро...",
      
      // Timer specific
      "Based Online Stopwatch": "Базовый онлайн секундомер"
    }
  },
  ar: {
    translation: {
      // Navigation
      "Stopwatch": "ساعة إيقاف",
      "Countdown": "العد التنازلي",
      "Race Timers": "مؤقتات السباق",
      "Classroom Timers": "مؤقتات الفصل",
      "Holiday Timers": "مؤقتات العطلة",
      "Random Name Pickers": "منتقي الأسماء",
      "Random Number Generators": "مولد الأرقام",
      "Sensory Timers": "المؤقتات الحسية",
      "Clocks": "الساعات",
      "Exam Timers": "مؤقتات الامتحان",
      "Chance Games": "ألعاب الحظ",
      "Group Generators": "مولد المجموعات",
      "Presentation Timers": "مؤقتات العرض",
      "Tally Counters": "العدادات",
      
      // Common
      "Start": "ابدأ",
      "Stop": "توقف",
      "Reset": "إعادة تعيين",
      "Lap": "لفة",
      "Go Home": "الصفحة الرئيسية",
      "Reload": "إعادة تحميل",
      "Go Fullscreen": "شاشة كاملة",
      "Exit Fullscreen": "خروج من الشاشة الكاملة",
      "Language": "اللغة",
      "Coming soon...": "قريباً...",
      
      // Timer specific
      "Based Online Stopwatch": "ساعة الإيقاف الأساسية"
    }
  },
  hi: {
    translation: {
      // Navigation
      "Stopwatch": "स्टॉपवॉच",
      "Countdown": "काउंटडाउन",
      "Race Timers": "रेस टाइमर",
      "Classroom Timers": "कक्षा टाइमर",
      "Holiday Timers": "छुट्टी टाइमर",
      "Random Name Pickers": "नाम चुनने वाला",
      "Random Number Generators": "संख्या जनरेटर",
      "Sensory Timers": "संवेदी टाइमर",
      "Clocks": "घड़ियां",
      "Exam Timers": "परीक्षा टाइमर",
      "Chance Games": "मौका खेल",
      "Group Generators": "समूह जनरेटर",
      "Presentation Timers": "प्रस्तुति टाइमर",
      "Tally Counters": "काउंटर",
      
      // Common
      "Start": "शुरू",
      "Stop": "रोकें",
      "Reset": "रीसेट",
      "Lap": "लैप",
      "Go Home": "होम जाएं",
      "Reload": "पुनः लोड",
      "Go Fullscreen": "पूर्ण स्क्रीन",
      "Exit Fullscreen": "पूर्ण स्क्रीन से बाहर निकलें",
      "Language": "भाषा",
      "Coming soon...": "जल्द आ रहा है...",
      
      // Timer specific
      "Based Online Stopwatch": "आधारित ऑनलाइन स्टॉपवॉच"
    }
  }
};

const initI18n = async () => {
  let savedLanguage;
  try {
    savedLanguage = await localforage.getItem<string>('language');
  } catch (error) {
    console.error('Error loading saved language:', error);
  }

  const detectedLanguage = navigator.language.split('-')[0];
  const supportedLanguages = Object.keys(resources);
  const defaultLanguage = supportedLanguages.includes(detectedLanguage) ? detectedLanguage : 'en';
  
  return i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage || defaultLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      }
    });
};

export const changeLanguage = async (language: string) => {
  try {
    await localforage.setItem('language', language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error('Error saving language preference:', error);
  }
};

export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
];

export { initI18n };
export default i18n;