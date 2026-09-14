import { createFileRoute, Link } from "@tanstack/react-router";
import { GameCard } from "@/components/GameCard";
import { GameActions } from "@/components/GameActions";
import { finalPrice, formatPrice, games } from "@/lib/games";

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
  const deals = games.filter((g) => g.discount > 0);

  return (
    <div className="px-5 pb-10">
      <h1 className="sr-only">Магазин игр Nebula</h1>

      <section className="overflow-hidden rounded-2xl surface-panel">
        <div className="grid gap-0 lg:grid-cols-[1.4fr_1fr]">
          <img
            src={featured.image}
            alt={`Обложка игры ${featured.title}`}
            width={1088}
            height={608}
            className="h-full w-full object-cover"
          />
          <div className="flex flex-col justify-center gap-4 p-6 lg:p-8">
            <span className="w-fit rounded bg-primary/15 px-2 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              Главное в магазине
            </span>
            <h2 className="font-display text-3xl font-bold lg:text-4xl">{featured.title}</h2>
            <p className="text-muted-foreground">{featured.description}</p>
            <div className="flex items-baseline gap-3">
              <span className="rounded bg-accent px-2 py-1 font-display font-bold text-accent-foreground">
                -{featured.discount}%
              </span>
              <span className="text-muted-foreground line-through">{formatPrice(featured.price)}</span>
              <span className="font-display text-2xl font-bold text-primary">
                {formatPrice(finalPrice(featured))}
              </span>
            </div>
            <GameActions game={featured} />
            <Link
              to="/game/$gameId"
              params={{ gameId: featured.id }}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Подробнее об игре →
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-bold">Специальные предложения</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-bold">Весь каталог</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
    </div>
  );
}
