// A backend/cache JSON-ök TypeScript szerződései.

export interface YearStat {
  year: string;
  checkouts: number;
  value_huf: number;
}

export interface LibraryStat {
  library: string;
  checkouts: number;
  value_huf: number;
  patrons: number;
}

export interface LabeledCount {
  code?: string;
  label?: string;
  language?: string;
  checkouts: number;
}

export interface RenewedBook {
  title: string;
  author: string | null;
  isbn?: string | null;
  total_renewals: number;
  checkouts: number;
}

export interface MonthCount {
  month: string;
  checkouts: number;
}

export interface Summary {
  generated_at: string;
  dataset: string;
  total_checkouts: number;
  total_value_huf: number;
  unique_patrons: number;
  unique_titles: number;
  total_renewals: number;
  avg_renewals: number;
  libraries: string[];
  by_year: YearStat[];
  by_library: LibraryStat[];
  by_doc_type: LabeledCount[];
  by_language: LabeledCount[];
  top_renewed_books: RenewedBook[];
  most_active_period: {
    busiest_month: { month: string; checkouts: number } | null;
    busiest_weekday: { weekday: number; checkouts: number; label: string } | null;
    busiest_hour: { hour: number; checkouts: number } | null;
  };
  monthly_checkouts: MonthCount[];
}

export interface AuthorSeries {
  author: string;
  total: number;
  data: number[];
}

export interface AuthorsMonthly {
  months: string[];
  authors: AuthorSeries[];
}

export interface QuizBook {
  title: string;
  author: string | null;
  record_id?: string | null;
  isbn?: string | null;
  checkouts: number;
}

export interface QuizAuthor {
  author: string;
  checkouts: number;
}

export interface QuizData {
  book_quiz: {
    top_books: QuizBook[];
    decoys: QuizBook[];
  };
  author_quiz: {
    top_authors: QuizAuthor[];
  };
}

export interface HeatmapTime {
  weekdays: string[];
  hours: number[];
  matrix: number[][];
  max: number;
  apex_series: { name: string; data: { x: string; y: number }[] }[];
}

export interface GeoRow {
  zip?: string;
  city: string;
  checkouts: number;
  patrons: number;
}

export interface HeatmapGeo {
  by_zip: GeoRow[];
  by_city: GeoRow[];
}

export interface Heatmaps {
  time: HeatmapTime;
  geo: HeatmapGeo;
}

export interface EtoAgeHeatmap {
  age_buckets: string[];
  age_bucket_starts: number[];
  bucket_size: number;
  eto_classes: string[];
  eto_labels: Record<string, string>;
  matrix: number[][];
  max: number;
}

export interface AppData {
  summary: Summary;
  authors: AuthorsMonthly;
  quiz: QuizData;
  heatmaps: Heatmaps;
  etoAge: EtoAgeHeatmap;
}
