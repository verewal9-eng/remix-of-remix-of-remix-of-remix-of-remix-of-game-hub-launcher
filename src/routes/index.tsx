import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { finalPrice, formatPrice, games } from "@/lib/games";
import { GameActions } from "@/components/GameActions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nebula — магазин игр с библиотекой и загрузками" },
      {
        name: "description",
        content:
          "Nebula: витрина игр со скидками, личная библиотека, установка и загрузка игр на ПК с прогрессом и паузой.",
      },
      { property: "og:title", content: "Nebula — магазин игр с библиотекой и загрузками" },
      {
        property: "og:description",
        content: "Покупайте игры, устанавливайте их и следите за прогрессом загрузки в библиотеке Nebula.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StorePage,
});

function StorePage() {
  const featured = games[0]!;
  const popular = games.slice(1, 5);
  const free = games[5]!;
  const news = games.slice(1, 4);

  return (
    <div className="grid gap-8 px-6 pb-8 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0">
        <h1 className="sr-only">Магазин игр Nebula</h1>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[18px]">
          <img
            src={featured.image}
            alt={`Обложка игры ${featured.title}`}
            className="h-[340px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/60" />
          <div className="absolute inset-0 flex flex-col justify-center px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              {featured.studio}
            </p>
            <h2 className="mt-3 max-w-[520px] font-display text-5xl font-bold uppercase leading-[0.95] tracking-wide text-white lg:text-6xl">
              {featured.title}
            </h2>
            <div className="mt-6 max-w-[280px]">
              <GameActions game={featured} />
            </div>
          </div>
          <div className="absolute right-8 top-7 flex items-center gap-2">
            <span className="h-1 w-8 rounded-full bg-white/90" />
            <span className="h-1 w-8 rounded-full bg-white/40" />
            <span className="h-1 w-8 rounded-full bg-white/40" />
          </div>
        </section>

        {/* Popular */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Популярное</h2>
            <div className="flex items-center gap-2">
              <button
                aria-label="Назад"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <button
                aria-label="Вперёд"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((game) => (
              <Link
                key={game.id}
                to="/game/$gameId"
                params={{ gameId: game.id }}
                className="group relative block overflow-hidden rounded-[14px]"
              >
                <img
                  src={game.image}
                  alt={`Обложка игры ${game.title}`}
                  className="h-[250px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                {game.discount > 0 && (
                  <span className="absolute left-3 top-3 rounded bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">
                    -{game.discount}%
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-base font-bold leading-tight text-white">
                    {game.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {formatPrice(finalPrice(game))}
                  </p>
                  {game.discount > 0 && (
                    <p className="text-[11px] text-white/50 line-through">{formatPrice(game.price)}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Right column */}
      <div className="flex min-w-0 flex-col gap-8">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Бесплатно</h2>
            <Link to="/library" className="text-xs text-muted-foreground hover:text-foreground">
              Все
            </Link>
          </div>
          <div className="overflow-hidden rounded-[14px] bg-surface">
            <div className="relative">
              <img
                src={free.image}
                alt={`Обложка игры ${free.title}`}
                className="h-[190px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-xs text-white/70">Бесплатно ещё</p>
                <div className="mt-1 flex items-end gap-5">
                  {[
                    ["8", "дней"],
                    ["15", "часов"],
                    ["43", "минуты"],
                  ].map(([value, label]) => (
                    <div key={label}>
                      <p className="font-display text-2xl font-bold leading-none text-white">{value}</p>
                      <p className="text-[10px] text-white/60">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link
              to="/game/$gameId"
              params={{ gameId: free.id }}
              className="block bg-primary py-3 text-center text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Играть сейчас
            </Link>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Новости</h2>
            <Link to="/library" className="text-xs text-muted-foreground hover:text-foreground">
              Все
            </Link>
          </div>
          <ul className="flex flex-col gap-4">
            {news.map((game) => (
              <li key={game.id} className="flex gap-3">
                <img
                  src={game.image}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight">{game.title}</p>
                  <p className="mt-1 line-clamp-3 text-[11px] leading-snug text-muted-foreground">
                    {game.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
