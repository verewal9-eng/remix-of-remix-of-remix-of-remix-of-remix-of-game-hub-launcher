import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { games, getGame } from "@/lib/games";

export type EntryStatus = "owned" | "downloading" | "paused" | "installed";

export type LibraryEntry = {
  id: string;
  status: EntryStatus;
  progress: number; // 0..100
  speedMbs: number;
  lastPlayed?: string;
  hoursPlayed: number;
};

type LibraryState = Record<string, LibraryEntry>;

const STORAGE_KEY = "nebula-library-v1";

type Ctx = {
  entries: LibraryState;
  ready: boolean;
  own: (id: string) => void;
  install: (id: string) => void;
  pause: (id: string) => void;
  resume: (id: string) => void;
  cancel: (id: string) => void;
  uninstall: (id: string) => void;
  play: (id: string) => void;
  downloadToPc: (id: string) => void;
};

const LibraryContext = createContext<Ctx | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<LibraryState>({});
  const [ready, setReady] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw) as LibraryState);
    } catch {
      /* ignore corrupted storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* storage full or unavailable */
    }
  }, [entries, ready]);

  // Download tick
  useEffect(() => {
    if (!ready) return;
    timer.current = setInterval(() => {
      setEntries((prev) => {
        let changed = false;
        const next: LibraryState = { ...prev };
        for (const entry of Object.values(prev)) {
          if (entry.status !== "downloading") continue;
          const game = getGame(entry.id);
          if (!game) continue;
          const speed = 18 + Math.random() * 42; // MB/s
          const step = (speed / (game.sizeGb * 1024)) * 100 * 0.5;
          const progress = Math.min(100, entry.progress + step);
          next[entry.id] = {
            ...entry,
            progress,
            speedMbs: Math.round(speed),
            status: progress >= 100 ? "installed" : "downloading",
          };
          changed = true;
        }
        return changed ? next : prev;
      });
    }, 500);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [ready]);

  const upsert = useCallback((id: string, patch: Partial<LibraryEntry>) => {
    setEntries((prev) => {
      const base: LibraryEntry = prev[id] ?? {
        id,
        status: "owned",
        progress: 0,
        speedMbs: 0,
        hoursPlayed: 0,
      };
      return { ...prev, [id]: { ...base, ...patch } };
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      entries,
      ready,
      own: (id) => upsert(id, { status: "owned" }),
      install: (id) => upsert(id, { status: "downloading" }),
      pause: (id) => upsert(id, { status: "paused", speedMbs: 0 }),
      resume: (id) => upsert(id, { status: "downloading" }),
      cancel: (id) => upsert(id, { status: "owned", progress: 0, speedMbs: 0 }),
      uninstall: (id) => upsert(id, { status: "owned", progress: 0, speedMbs: 0 }),
      play: (id) =>
        upsert(id, {
          lastPlayed: new Date().toISOString(),
          hoursPlayed: (entries[id]?.hoursPlayed ?? 0) + 0.5,
        }),
      downloadToPc: (id) => {
        const game = getGame(id);
        if (!game || typeof window === "undefined") return;
        const content = [
          `# ${game.title} — установщик Nebula`,
          `Студия: ${game.studio}`,
          `Размер сборки: ${game.sizeGb} ГБ`,
          `Идентификатор: ${game.id}`,
          `Дата загрузки: ${new Date().toLocaleString("ru-RU")}`,
          "",
          "Это демонстрационный файл витрины. Запустите его через клиент Nebula.",
        ].join("\n");
        const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = `${game.fileName}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      },
    }),
    [entries, ready, upsert],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside LibraryProvider");
  return ctx;
}

export function useOwnedGames() {
  const { entries } = useLibrary();
  return games.filter((g) => entries[g.id]);
}
