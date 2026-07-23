export type Lang = "hu" | "en" | "zh";

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
    yearSelectorLabel: string;
    allYears: string;
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
    selectedAgeLabel: string;
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
      round3Title: string;
      round3Desc: string;
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
    numbers: {
      instruction: string;
      questionCheckouts: string;
      questionPatrons: string;
      questionTitles: string;
      placeholder: string;
      submit: string;
      next: string;
      correct: string;
      incorrect: string;
      realValueLabel: string;
      scoreLabel: string;
    };
    result: {
      yourResult: string;
      accuracySuffix: string;
      books: string;
      authors: string;
      numbers: string;
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
      tagline: "Lapozzuk fel az évet!",
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
        "Lapozzuk fel az évet!",
      statCheckouts: "kölcsönzés",
      statPatrons: "olvasó",
      statTitles: "egyedi cím",
      scrollHint: "Görgess",
      yearSelectorLabel: "Évválasztó",
      allYears: "MIND",
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
        title: "Kvíz",
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
      ageRangeLabel: "Életkor",
      selectedAgeLabel: "Kiválasztott életkor",
      selectionTitle: "Amit ez a korosztály olvas",
      selectionEmpty: "Nincs adat ehhez az életkorhoz.",
      checkoutsInRange: "kölcsönzés ennél a korosztálynál",
      topCategoriesLabel: "Legnépszerűbb tudományterületek",
      yearsSuffix: "éves",
      ofTotalSuffix: "az összes kölcsönzés",
    },
    quiz: {
      intro: {
        title: "Mennyire ismered az adatokat?",
        subtitle:
          "Három kör vár rád: tippeld meg a népszerű könyveket, rendezd sorba a legolvasottabb szerzőket, majd találd el a nagy számokat!",
        round1Title: "1. kör",
        round1Desc: "TOP könyv vagy kakukktojás?",
        round2Title: "2. kör",
        round2Desc: "Szerzők sorba rendezése",
        round3Title: "3. kör",
        round3Desc: "Találd el a számot!",
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
      numbers: {
        instruction: "Tippeld meg a pontos számot! A valós érték ±10%-án belül talált tippnek számít.",
        questionCheckouts: "Hány kölcsönzés történt összesen?",
        questionPatrons: "Hány aktív olvasó kölcsönzött?",
        questionTitles: "Hány egyedi címet kölcsönöztek?",
        placeholder: "Írd be a tippedet…",
        submit: "Tippelek",
        next: "Következő",
        correct: "Talált! ±10%-on belül voltál.",
        incorrect: "Nem talált.",
        realValueLabel: "A valós szám",
        scoreLabel: "Pont",
      },
      result: {
        yourResult: "Az eredményed",
        accuracySuffix: "% pontosság",
        books: "Könyvek",
        authors: "Szerzők",
        numbers: "Számok",
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
      tagline: "Let's turn the Page on the Year!",
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
        "Let's turn the Page on the Year!",
      statCheckouts: "checkouts",
      statPatrons: "patrons",
      statTitles: "unique titles",
      scrollHint: "Scroll",
      yearSelectorLabel: "Year selector",
      allYears: "ALL",
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
        title: "Quiz",
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
      ageRangeLabel: "Age",
      selectedAgeLabel: "Selected age",
      selectionTitle: "What this age group reads",
      selectionEmpty: "No data for this age.",
      checkoutsInRange: "checkouts for this age group",
      topCategoriesLabel: "Top subject areas",
      yearsSuffix: "yrs",
      ofTotalSuffix: "of all checkouts",
    },
    quiz: {
      intro: {
        title: "How well do you know the data?",
        subtitle:
          "Three rounds await: guess the popular books, sort the most-read authors, then nail the big numbers!",
        round1Title: "Round 1",
        round1Desc: "Top book or decoy?",
        round2Title: "Round 2",
        round2Desc: "Sort the authors",
        round3Title: "Round 3",
        round3Desc: "Guess the number!",
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
      numbers: {
        instruction: "Guess the exact number! Within ±10% of the real value counts as a hit.",
        questionCheckouts: "How many checkouts happened in total?",
        questionPatrons: "How many active patrons checked out books?",
        questionTitles: "How many unique titles were checked out?",
        placeholder: "Type your guess…",
        submit: "Guess",
        next: "Next",
        correct: "Hit! You were within ±10%.",
        incorrect: "Missed it.",
        realValueLabel: "The real number",
        scoreLabel: "Score",
      },
      result: {
        yourResult: "Your result",
        accuracySuffix: "% accuracy",
        books: "Books",
        authors: "Authors",
        numbers: "Numbers",
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
  zh: {
    nav: {
      tagline: "翻开这一年的篇章！",
      themeToLight: "切换到浅色主题",
      themeToDark: "切换到深色主题",
      languageLabel: "语言",
    },
    librarySelector: {
      all: "全部",
      ariaLabel: "选择图书馆",
    },
    hero: {
      titleLine1: "图书馆",
      titleLine2: "年度回顾",
      subtitle:
        "翻开这一年的篇章！",
      statCheckouts: "借阅",
      statPatrons: "读者",
      statTitles: "独立书目",
      scrollHint: "向下滚动",
      yearSelectorLabel: "年份选择",
      allYears: "全部",
    },
    sections: {
      stats: {
        eyebrow: "年度数字",
        title: "总览",
        subtitle: "今年社区借阅的一切——一目了然。",
      },
      monthly: {
        eyebrow: "节奏",
        title: "这一年的走势",
        subtitle: "整个期间的月度借阅趋势。",
      },
      authorRace: {
        eyebrow: "竞赛",
        title: "作者竞速",
        subtitle: "点击播放，观看最受欢迎的作者如何逐月你追我赶。",
      },
      distribution: {
        eyebrow: "分布",
        title: "读什么，用什么语言？",
        subtitle: "借阅中的文献类型与语言。",
      },
      timeHeatmap: {
        eyebrow: "何时？",
        title: "图书馆的脉搏",
        subtitle: "按星期与小时划分的借阅量。颜色越暖代表越繁忙。",
      },
      etoAge: {
        eyebrow: "谁在读什么？",
        title: "年龄与主题选择",
        subtitle: "选择一个年龄，看看该年龄段最受欢迎的学科领域（UDC 主类）。",
      },
      geo: {
        eyebrow: "来自何处？",
        title: "读者地图",
        subtitle: "大多数读者来自哪里——按城市和邮政编码划分。",
      },
      renewed: {
        eyebrow: "最爱",
        title: "舍不得还的书",
        subtitle: "续借次数最多的图书。",
      },
      quiz: {
        eyebrow: "游戏",
        title: "测验",
        subtitle: "考考自己：你有多了解图书馆的数据？",
      },
    },
    stats: {
      totalCheckouts: "总借阅量",
      totalValue: "馆藏价值",
      totalValueHint: "所借馆藏的登记价值",
      activePatrons: "活跃读者",
      totalRenewals: "总续借次数",
      avgRenewalsHint: "平均 {{avg}} / 每次借阅",
      busiestMonth: "最繁忙的月份",
      busiestWeekday: "最繁忙的一天",
      busiestHour: "高峰时段",
      checkoutsSuffix: "次借阅",
    },
    weekdays: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
    monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    docTypes: {
      B: "图书",
      C: "音像 / CD",
      S: "期刊 / 丛书",
      M: "地图",
      D: "学位论文",
    },
    languages: {
      hun: "匈牙利语",
      ger: "德语",
      eng: "英语",
      fre: "法语",
      lat: "拉丁语",
      rus: "俄语",
      ita: "意大利语",
      spa: "西班牙语",
      mul: "多语种",
    },
    etoClassShort: {
      "0": "总类",
      "1": "哲学、心理学",
      "2": "宗教、神学",
      "3": "社会科学",
      "5": "自然科学",
      "6": "应用科学、医学",
      "7": "艺术、体育",
      "8": "语言、文学",
      "9": "历史、地理",
    },
    authorRace: {
      cumulativeUntil: "累计借阅（截至）：",
      play: "播放",
      pause: "暂停",
      resetTitle: "完整期间",
      checkoutsSuffix: "次借阅",
    },
    distribution: {
      docTypesTitle: "文献类型",
      languagesTitle: "语言",
      totalLabel: "文献",
    },
    geo: {
      topCitiesTitle: "热门城市",
      topZipsTitle: "热门邮编",
    },
    renewed: {
      intro: "这些书舍不得还——续借次数最多的图书。",
    },
    etoAge: {
      ageRangeLabel: "年龄",
      selectedAgeLabel: "所选年龄",
      selectionTitle: "该年龄段在读什么",
      selectionEmpty: "此年龄暂无数据。",
      checkoutsInRange: "次借阅（该年龄段）",
      topCategoriesLabel: "热门学科领域",
      yearsSuffix: "岁",
      ofTotalSuffix: "占全部借阅",
    },
    quiz: {
      intro: {
        title: "你有多了解这些数据？",
        subtitle: "三个回合：先猜热门图书，再给最热门的作者排序，最后猜猜大数字！",
        round1Title: "第一回合",
        round1Desc: "热门书还是干扰项？",
        round2Title: "第二回合",
        round2Desc: "给作者排序",
        round3Title: "第三回合",
        round3Desc: "猜猜这个数字！",
        cta: "开始吧！",
      },
      book: {
        question: "这本书是否位列最受欢迎的前 5 名？",
        topBadge: "曾是热门书",
        notTopBadge: "并非热门",
        checkoutsSuffix: "次借阅",
        yes: "是，热门书",
        no: "不是，干扰项",
        scoreLabel: "得分",
      },
      author: {
        instruction: "按借阅量从高到低给作者排序！拖动到对应位置。",
        check: "检查",
        dragLabel: "拖动以重新排序",
      },
      numbers: {
        instruction: "猜猜准确的数字！在真实值的 ±10% 以内就算猜中。",
        questionCheckouts: "总共发生了多少次借阅？",
        questionPatrons: "有多少活跃读者借过书？",
        questionTitles: "借阅了多少个不同的书名？",
        placeholder: "输入你的猜测…",
        submit: "提交",
        next: "下一题",
        correct: "猜中了！在 ±10% 范围内。",
        incorrect: "没猜中。",
        realValueLabel: "真实数字",
        scoreLabel: "得分",
      },
      result: {
        yourResult: "你的成绩",
        accuracySuffix: "% 准确率",
        books: "图书",
        authors: "作者",
        numbers: "数字",
        again: "再来一次",
        ranks: {
          master: "图书馆大师",
          enthusiast: "热心读者",
          beginner: "好奇的浏览者",
          first: "初次到访",
        },
      },
    },
    footer: {
      tagline: "图书馆年度回顾",
      pipeline: "预聚合数据 — 管线 (DuckDB) → FastAPI → Next.js",
    },
    errors: {
      backendUnavailable: "后端不可用",
      startBackendHint: "请从仓库根目录启动后端：",
      loading: "正在加载数据…",
    },
  },
};
