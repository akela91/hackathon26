"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { API_URL } from "./api";

export interface Manifest {
  generated_at: string;
  dataset: string;
  total_checkouts: number;
  libraries: string[];
  scopes: string[];
}

interface LibraryContextValue {
  manifest: Manifest | null;
  /** "ALL" vagy pontosan egy könyvtár kódja – sosem több egyszerre. */
  selectedLibrary: string;
  setSelectedLibrary: (lib: string) => void;
  loading: boolean;
  error: string | null;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

const STORAGE_KEY = "lw-library";

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [selectedLibrary, setSelectedLibraryState] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setSelectedLibraryState(saved);

    fetch(`${API_URL}/api/manifest`, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`API hiba (${r.status})`);
        return r.json() as Promise<Manifest>;
      })
      .then((m) => {
        setManifest(m);
        // Ha a mentett könyvtár már nem szerepel a manifestben, essünk vissza "ALL"-ra.
        if (saved && saved !== "ALL" && !m.libraries.includes(saved)) {
          setSelectedLibraryState("ALL");
        }
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function setSelectedLibrary(lib: string) {
    setSelectedLibraryState(lib);
    localStorage.setItem(STORAGE_KEY, lib);
  }

  return (
    <LibraryContext.Provider
      value={{ manifest, selectedLibrary, setSelectedLibrary, loading, error }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
  return ctx;
}
