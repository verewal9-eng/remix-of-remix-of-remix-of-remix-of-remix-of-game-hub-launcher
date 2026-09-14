import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GameActions } from "@/components/GameActions";
import { games } from "@/lib/games";
import { useLibrary } from "@/lib/library";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Моя библиотека — Nebula" },
      {
        name: "description",
        content: "Библиотека Nebula: установленные игры, очередь загрузок, пауза, удаление и запуск.",
      },
      { property: "og:title", content: "Моя библиотека — Nebula" },
      {
        property: "og:description",
        content: "Управляйте установленными играми и загрузками в библиотеке Nebula.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LibraryPage,
});

const statusLabel: Record<string, string> = {
  owned: "Не установлена",
  downloading: "Загружается",
  paused: "На паузе",
  installed: "Установлена",
};

function LibraryPage() {
  const { entries, ready } = useLibrary();
  const [query, setQuery] = useState("");

  const owned = games.filter((g) => entries[g.id]);
  const filtered = owned.filter((g) => g.title.toLowerCase().includes(query.toLowerCase()));
  const selected = filtered[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold">Моя библиотека</h1>
      <p className="mt-1 text-muted-foreground">
        Устанавливайте игры, ставьте загрузку на паузу и запускайте их одной кнопкой.
      </p>

      {!ready ? null : owned.length === 0 ? (
        <div className="mt-10 rounded-xl surface-panel p-10 text-center">
          <p className="text-muted-foreground">В библиотеке пока пусто.</p>
          <Link
            to="/"
            className="mt-4 inline-flex rounded-md bg-primary px-5 py-2 font-display text-sm font-semibold uppercase text-primary-foreground hover:opacity-90"
          >
            Перейти в магазин
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-xl surface-panel p-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по библиотеке"
              aria-label="Поиск по библиотеке"
              className="mb-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <ul className="space-y-1">
              {filtered.map((game) => {
                const entry = entries[game.id]!;
                return (
                  <li key={game.id}>
                    <Link
                      to="/game/$gameId"
                      params={{ gameId: game.id }}
                      className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-secondary"
                    >
                      <img
                        src={game.image}
                        alt=""
                        loading="lazy"
                        width={1088}
                        height={608}
                        className="h-10 w-16 rounded object-cover"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{game.title}</span>
                        <span className="block text-xs text-muted-foreground">
                          {statusLabel[entry.status]}
                          {entry.status === "downloading" ? ` · ${Math.floor(entry.progress)}%` : ""}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="space-y-5">
            {selected && (
              <div className="overflow-hidden rounded-xl surface-panel">
                <img
                  src={selected.image}
                  alt={`Обложка игры ${selected.title}`}
                  width={1088}
                  height={608}
                  className="h-64 w-full object-cover"
                />
                <div className="space-y-4 p-6">
                  <h2 className="font-display text-2xl font-bold">{selected.title}</h2>
                  <p className="text-sm text-muted-foreground">{selected.description}</p>
                  <GameActions game={selected} />
                </div>
              </div>
            )}

            <div className="rounded-xl surface-panel p-5">
              <h2 className="mb-4 font-display text-xl font-bold">Загрузки и установки</h2>
              <ul className="space-y-5">
                {filtered.map((game) => (
                  <li key={game.id} className="flex flex-col gap-3 border-b border-border pb-5 last:border-0 last:pb-0 sm:flex-row sm:items-center">
                    <img
                      src={game.image}
                      alt=""
                      loading="lazy"
                      width={1088}
                      height={608}
                      className="h-16 w-28 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-semibold">{game.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {game.studio} · {game.sizeGb} ГБ
                      </p>
                    </div>
                    <div className="w-full sm:w-80">
                      <GameActions game={game} compact />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
