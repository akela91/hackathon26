export type Lang = "hu" | "en";

export interface Dictionary {
  nav: {
    tagline: string;
    themeToLight: string;
    themeToDark: string;
    languageLabel: string;
  };
  librarySelector: {
    all: string;
    ariaLabel: string;
  };
  hero: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    statCheckouts: string;
    statPatrons: string;
    statTitles: string;
    scrollHint: string;
  };
  sections: {
    stats: { eyebrow: string; title: string; subtitle: string };
    monthly: { eyebrow: string; title: string; subtitle: string };
    authorRace: { eyebrow: string; title: string; subtitle: string };
    distribution: { eyebrow: string; title: string; subtitle: string };
    timeHeatmap: { eyebrow: string; title: string; subtitle: string };
    etoAge: { eyebrow: string; title: string; subtitle: string };
    geo: { eyebrow: string; title: string; subtitle: string };
    renewed: { eyebrow: string; title: string; subtitle: string };
    quiz: { eyebrow: string; title: string; subtitle: string };
  };
  stats: {
    totalCheckouts: string;
    totalValue: string;
    totalValueHint: string;
    activePatrons: string;
    totalRenewals: string;
    avgRenewalsHint: string;
    busiestMonth: string;
    busiestWeekday: string;
    busiestHour: string;
    checkoutsSuffix: string;
  };
  weekdays: string[];
  monthsShort: string[];
  docTypes: Record<string, string>;
  languages: Record<string, string>;
  etoClassShort: Record<string, string>;
  authorRace: {
    cumulativeUntil: string;
    play: string;
    pause: string;
    resetTitle: string;
    checkoutsSuffix: string;
  };
  distribution: {
    docTypesTitle: string;
    languagesTitle: string;
    totalLabel: string;
  };
  geo: {
    topCitiesTitle: string;
    topZipsTitle: string;
  };
  renewed: {
    intro: string;
  };
  etoAge: {
    ageRangeLabel: string;
    selectionTitle: string;
    selectionEmpty: string;
    checkoutsInRange: string;
    topCategoriesLabel: string;
    yearsSuffix: string;
    ofTotalSuffix: string;
  };
  quiz: {
    intro: {
      title: string;
      subtitle: string;
      round1Title: string;
      round1Desc: string;
      round2Title: string;
      round2Desc: string;
      cta: string;
    };
    book: {
      question: string;
      topBadge: string;
      notTopBadge: string;
      checkoutsSuffix: string;
      yes: string;
      no: string;
      scoreLabel: string;
    };
    author: {
      instruction: string;
      check: string;
      dragLabel: string;
    };
    result: {
      yourResult: string;
      accuracySuffix: string;
      books: string;
      authors: string;
      again: string;
      ranks: {
        master: string;
        enthusiast: string;
        beginner: string;
        first: string;
      };
    };
  };
  footer: {
    tagline: string;
    pipeline: string;
  };
  errors: {
    backendUnavailable: string;
    startBackendHint: string;
    loading: string;
  };
}

export const dictionaries: Record<Lang, Dictionary> = {
  hu: {
    nav: {
      tagline: "Az évünk könyvekben",
      themeToLight: "Váltás világos témára",
      themeToDark: "Váltás sötét témára",
      languageLabel: "Nyelv",
    },
    librarySelector: {
      all: "Mind",
      ariaLabel: "Könyvtár kiválasztása",
    },
    hero: {
      titleLine1: "Library",
      titleLine2: "Wrapped",
      subtitle:
        "Az évünk könyvekben. Nézd meg, mit olvasott a közösség — statisztikák, animált chartok és egy játékos kvíz.",
      statCheckouts: "kölcsönzés",
      statPatrons: "olvasó",
      statTitles: "egyedi cím",
      scrollHint: "Görgess",
    },
    sections: {
      stats: {
        eyebrow: "Az év számokban",
        title: "A nagy összkép",
        subtitle: "Minden, amit a közösség idén kölcsönzött — egy pillantásra.",
      },
      monthly: {
        eyebrow: "Ritmus",
        title: "Így pörgött az év",
        subtitle: "Havi kölcsönzési trend a teljes időszakra.",
      },
      authorRace: {
        eyebrow: "Verseny",
        title: "Szerzők versenye",
        subtitle:
          "Nyomd meg a Lejátszást, és nézd, hogyan előzik egymást a legnépszerűbb szerzők hónapról hónapra.",
      },
      distribution: {
        eyebrow: "Megoszlás",
        title: "Mit és milyen nyelven?",
        subtitle: "Dokumentumtípusok és nyelvek a kölcsönzésekben.",
      },
      timeHeatmap: {
        eyebrow: "Mikor?",
        title: "A könyvtár pulzusa",
        subtitle:
          "Kölcsönzések a hét napjai és a nap órái szerint. A meleg mezők a csúcsidők.",
      },
      etoAge: {
        eyebrow: "Kik olvasnak mit?",
        title: "Életkor és témaválasztás",
        subtitle:
          "Válassz ki egy korosztályt, és nézd meg, mely tudományterületek (ETO főosztályok) a legnépszerűbbek náluk.",
      },
      geo: {
        eyebrow: "Honnan?",
        title: "Az olvasók térképe",
        subtitle:
          "Honnan érkeznek a legtöbben — települések és irányítószámok szerint.",
      },
      renewed: {
        eyebrow: "Kedvencek",
        title: "Nem adták vissza",
        subtitle: "A legtöbbször meghosszabbított könyvek.",
      },
      quiz: {
        eyebrow: "Játék",
        title: "Gamifikált kvíz",
        subtitle: "Teszteld magad: mennyire ismered a könyvtár adatait?",
      },
    },
    stats: {
      totalCheckouts: "Összes kölcsönzés",
      totalValue: "Kiváltott érték",
      totalValueHint: "a kölcsönzött állomány nyilvántartási értéke",
      activePatrons: "Aktív olvasó",
      totalRenewals: "Összes hosszabbítás",
      avgRenewalsHint: "átlag {{avg}} / kölcsönzés",
      busiestMonth: "Legpörgősebb hónap",
      busiestWeekday: "Legaktívabb nap",
      busiestHour: "Csúcsidő",
      checkoutsSuffix: "kölcsönzés",
    },
    weekdays: ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"],
    monthsShort: ["jan", "feb", "márc", "ápr", "máj", "jún", "júl", "aug", "szept", "okt", "nov", "dec"],
    docTypes: {
      B: "Könyv",
      C: "AV / CD",
      S: "Periodika / Sorozat",
      M: "Térkép",
      D: "Disszertáció",
    },
    languages: {
      hun: "magyar",
      ger: "német",
      eng: "angol",
      fre: "francia",
      lat: "latin",
      rus: "orosz",
      ita: "olasz",
      spa: "spanyol",
      mul: "többnyelvű",
    },
    etoClassShort: {
      "0": "Általános művek",
      "1": "Filozófia, Pszichológia",
      "2": "Vallás, Teológia",
      "3": "Társadalomtud.",
      "4": "Fenntartott",
      "5": "Természettud.",
      "6": "Alkalm. tud., Orvostud.",
      "7": "Művészet, Sport",
      "8": "Nyelv, Irodalom",
      "9": "Történelem, Földrajz",
    },
    authorRace: {
      cumulativeUntil: "Kumulált kölcsönzés eddig:",
      play: "Lejátszás",
      pause: "Szünet",
      resetTitle: "Teljes időszak",
      checkoutsSuffix: "kölcsönzés",
    },
    distribution: {
      docTypesTitle: "Dokumentumtípusok",
      languagesTitle: "Nyelvek",
      totalLabel: "Dokumentum",
    },
    geo: {
      topCitiesTitle: "Top települések",
      topZipsTitle: "Top irányítószámok",
    },
    renewed: {
      intro: "Ezeket a köteteket nem akarták visszaadni — a legtöbbször hosszabbított könyvek.",
    },
    etoAge: {
      ageRangeLabel: "Életkor tartomány",
      selectionTitle: "A kiválasztott korosztály olvasmányai",
      selectionEmpty: "Nincs adat ebben a tartományban.",
      checkoutsInRange: "kölcsönzés a tartományban",
      topCategoriesLabel: "Legnépszerűbb tudományterületek",
      yearsSuffix: "év",
      ofTotalSuffix: "az összes kölcsönzés",
    },
    quiz: {
      intro: {
        title: "Mennyire ismered az adatokat?",
        subtitle:
          "Két kör vár rád: előbb tippeld meg a népszerű könyveket, majd rendezd sorba a legolvasottabb szerzőket!",
        round1Title: "1. kör",
        round1Desc: "TOP könyv vagy kakukktojás?",
        round2Title: "2. kör",
        round2Desc: "Szerzők sorba rendezése",
        cta: "Kezdjük!",
      },
      book: {
        question: "Ez a könyv a TOP 5 legnépszerűbb közé tartozott?",
        topBadge: "TOP könyv volt",
        notTopBadge: "Nem volt top",
        checkoutsSuffix: "kölcsönzés",
        yes: "Igen, TOP volt",
        no: "Nem, kakukktojás",
        scoreLabel: "Pont",
      },
      author: {
        instruction:
          "Rendezd sorba a szerzőket a legtöbb kölcsönzéstől a legkevesebbig! Húzd a helyükre őket.",
        check: "Ellenőrzés",
        dragLabel: "Húzd az átrendezéshez",
      },
      result: {
        yourResult: "Az eredményed",
        accuracySuffix: "% pontosság",
        books: "Könyvek",
        authors: "Szerzők",
        again: "Újra",
        ranks: {
          master: "Könyvtár Nagymester",
          enthusiast: "Lelkes Olvasó",
          beginner: "Kezdő Böngésző",
          first: "Első Látogatás",
        },
      },
    },
    footer: {
      tagline: "Library Wrapped",
      pipeline: "Előre aggregált adatok — pipeline (DuckDB) → FastAPI → Next.js",
    },
    errors: {
      backendUnavailable: "Nem érhető el a backend",
      startBackendHint: "Indítsd el a backendet a repo gyökeréből:",
      loading: "Adatok betöltése…",
    },
  },
  en: {
    nav: {
      tagline: "Our year in books",
      themeToLight: "Switch to light theme",
      themeToDark: "Switch to dark theme",
      languageLabel: "Language",
    },
    librarySelector: {
      all: "All",
      ariaLabel: "Select library",
    },
    hero: {
      titleLine1: "Library",
      titleLine2: "Wrapped",
      subtitle:
        "Our year in books. See what the community read — stats, animated charts and a playful quiz.",
      statCheckouts: "checkouts",
      statPatrons: "patrons",
      statTitles: "unique titles",
      scrollHint: "Scroll",
    },
    sections: {
      stats: {
        eyebrow: "The year in numbers",
        title: "The big picture",
        subtitle: "Everything the community borrowed this year — at a glance.",
      },
      monthly: {
        eyebrow: "Rhythm",
        title: "How the year unfolded",
        subtitle: "Monthly checkout trend across the whole period.",
      },
      authorRace: {
        eyebrow: "Race",
        title: "The author race",
        subtitle:
          "Hit Play and watch the most popular authors overtake each other month by month.",
      },
      distribution: {
        eyebrow: "Breakdown",
        title: "What, and in which language?",
        subtitle: "Document types and languages across checkouts.",
      },
      timeHeatmap: {
        eyebrow: "When?",
        title: "The library's pulse",
        subtitle: "Checkouts by day of week and hour of day. Warmer cells mean peak times.",
      },
      etoAge: {
        eyebrow: "Who reads what?",
        title: "Age & subject choice",
        subtitle:
          "Pick an age range and see which subject areas (UDC main classes) are most popular within it.",
      },
      geo: {
        eyebrow: "Where from?",
        title: "The readers' map",
        subtitle: "Where most patrons come from — by city and postal code.",
      },
      renewed: {
        eyebrow: "Favorites",
        title: "They wouldn't give it back",
        subtitle: "The most renewed books.",
      },
      quiz: {
        eyebrow: "Play",
        title: "Gamified quiz",
        subtitle: "Test yourself: how well do you know the library data?",
      },
    },
    stats: {
      totalCheckouts: "Total checkouts",
      totalValue: "Total value",
      totalValueHint: "recorded value of the borrowed stock",
      activePatrons: "Active patrons",
      totalRenewals: "Total renewals",
      avgRenewalsHint: "avg {{avg}} / checkout",
      busiestMonth: "Busiest month",
      busiestWeekday: "Busiest day",
      busiestHour: "Peak hour",
      checkoutsSuffix: "checkouts",
    },
    weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    docTypes: {
      B: "Book",
      C: "AV / CD",
      S: "Periodical / Series",
      M: "Map",
      D: "Dissertation",
    },
    languages: {
      hun: "Hungarian",
      ger: "German",
      eng: "English",
      fre: "French",
      lat: "Latin",
      rus: "Russian",
      ita: "Italian",
      spa: "Spanish",
      mul: "Multilingual",
    },
    etoClassShort: {
      "0": "General works",
      "1": "Philosophy, Psychology",
      "2": "Religion, Theology",
      "3": "Social sciences",
      "4": "Reserved",
      "5": "Natural sciences",
      "6": "Applied sci., Medicine",
      "7": "Arts, Sports",
      "8": "Language, Literature",
      "9": "History, Geography",
    },
    authorRace: {
      cumulativeUntil: "Cumulative checkouts up to:",
      play: "Play",
      pause: "Pause",
      resetTitle: "Full period",
      checkoutsSuffix: "checkouts",
    },
    distribution: {
      docTypesTitle: "Document types",
      languagesTitle: "Languages",
      totalLabel: "Documents",
    },
    geo: {
      topCitiesTitle: "Top cities",
      topZipsTitle: "Top postal codes",
    },
    renewed: {
      intro: "These titles just wouldn't come back — the most renewed books.",
    },
    etoAge: {
      ageRangeLabel: "Age range",
      selectionTitle: "What this age group reads",
      selectionEmpty: "No data in this range.",
      checkoutsInRange: "checkouts in range",
      topCategoriesLabel: "Top subject areas",
      yearsSuffix: "yrs",
      ofTotalSuffix: "of all checkouts",
    },
    quiz: {
      intro: {
        title: "How well do you know the data?",
        subtitle:
          "Two rounds await: first guess the popular books, then sort the most-read authors!",
        round1Title: "Round 1",
        round1Desc: "Top book or decoy?",
        round2Title: "Round 2",
        round2Desc: "Sort the authors",
        cta: "Let's go!",
      },
      book: {
        question: "Was this book among the TOP 5 most popular?",
        topBadge: "Was a TOP book",
        notTopBadge: "Not a top pick",
        checkoutsSuffix: "checkouts",
        yes: "Yes, it was TOP",
        no: "No, it's a decoy",
        scoreLabel: "Score",
      },
      author: {
        instruction: "Sort the authors from most to least checkouts! Drag them into place.",
        check: "Check",
        dragLabel: "Drag to reorder",
      },
      result: {
        yourResult: "Your result",
        accuracySuffix: "% accuracy",
        books: "Books",
        authors: "Authors",
        again: "Again",
        ranks: {
          master: "Library Grandmaster",
          enthusiast: "Avid Reader",
          beginner: "Curious Browser",
          first: "First Visit",
        },
      },
    },
    footer: {
      tagline: "Library Wrapped",
      pipeline: "Pre-aggregated data — pipeline (DuckDB) → FastAPI → Next.js",
    },
    errors: {
      backendUnavailable: "Backend unavailable",
      startBackendHint: "Start the backend from the repo root:",
      loading: "Loading data…",
    },
  },
};
