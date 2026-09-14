import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { GameActions } from "@/components/GameActions";
import { finalPrice, formatPrice, getGame } from "@/lib/games";

export const Route = createFileRoute("/game/$gameId")({
  loader: ({ params }) => {
    const game = getGame(params.gameId);
    if (!game) throw notFound();
    return { title: game.title, description: game.description };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title} — Nebula` : "Игра — Nebula";
    const description = loaderData?.description ?? "Страница игры в магазине Nebula.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: GamePage,
});

function GamePage() {
  const { gameId } = Route.useParams();
  const game = getGame(gameId);
  if (!game) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Назад в магазин
      </Link>
      <h1 className="mt-3 font-display text-4xl font-bold">{game.title}</h1>
      <p className="text-sm text-muted-foreground">{game.studio}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <img
          src={game.image}
          alt={`Обложка игры ${game.title}`}
          width={1088}
          height={608}
          className="w-full rounded-xl object-cover shadow-card"
        />

        <aside className="space-y-4 rounded-xl surface-panel p-6">
          <p className="text-sm text-muted-foreground">{game.description}</p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Отзывы</dt>
              <dd>{game.rating}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Размер</dt>
              <dd>{game.sizeGb} ГБ</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Цена</dt>
              <dd className="font-display font-bold text-primary">
                {formatPrice(finalPrice(game))}
              </dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-1.5">
            {game.tags.map((tag) => (
              <span key={tag} className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
          <GameActions game={game} />
        </aside>
      </div>
    </div>
  );
}
