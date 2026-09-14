import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  ChevronRight,
  Download,
  LibraryBig,
  Plus,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";

const genres = [
  ["Free To Play", "Multiplayer"],
  ["Ранний доступ", "Открытый мир"],
  ["Экшен", "Гонки"],
  ["Приключения", "RPG"],
  ["Казуальные", "Симуляторы"],
  ["Шутеры", "Спорт"],
  ["Файтинги", "Стратегии"],
  ["Хоррор", "Выживание"],
];

const navLink =
  "flex items-center gap-4 rounded-lg px-4 py-3 font-display text-base font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";
const navActive = { className: "bg-secondary text-foreground shadow-card" };

export function SiteSidebar() {
  return (
    <aside className="hidden w-[280px] shrink-0 flex-col border-r border-border/70 bg-surface/60 px-6 py-6 lg:flex">
      <Link to="/" className="flex items-center gap-3 pb-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 font-display text-lg font-bold text-primary">
          N
        </span>
        <span className="font-display text-2xl font-bold uppercase tracking-[0.18em]">Nebula</span>
      </Link>

      <div className="border-t border-border/70 pt-5">
        <nav className="space-y-1">
          <Link to="/" activeOptions={{ exact: true }} activeProps={navActive} className={navLink}>
            <ShoppingCart className="h-5 w-5" aria-hidden /> Магазин
          </Link>
          <Link to="/library" activeProps={navActive} className={navLink}>
            <LibraryBig className="h-5 w-5" aria-hidden /> Библиотека
          </Link>
          <span className={navLink}>
            <Users className="h-5 w-5" aria-hidden /> Сообщество
          </span>
          <span className={navLink}>
            <CalendarDays className="h-5 w-5" aria-hidden /> Новости
          </span>
          <span className={navLink}>
            <Settings className="h-5 w-5" aria-hidden /> Настройки
          </span>
        </nav>
      </div>

      <div className="mt-7 border-t border-border/70 pt-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Жанры
        </p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-muted-foreground">
          {genres.flat().map((genre) => (
            <span key={genre} className="cursor-pointer truncate transition-colors hover:text-foreground">
              {genre}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto space-y-3 pt-8">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-2/70 px-4 py-3 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" aria-hidden />
          <span className="font-semibold">Друзья и чат</span>
          <span className="ml-auto flex items-center gap-1 text-xs text-primary">
            12 онлайн <ChevronRight className="h-3 w-3" aria-hidden />
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-surface-2/70 p-4 text-center">
            <Plus className="mx-auto mb-2 h-5 w-5 text-muted-foreground" aria-hidden />
            <p className="text-xs font-semibold">Добавить игру</p>
            <p className="text-[11px] text-primary">Активировать</p>
          </div>
          <Link
            to="/library"
            className="rounded-lg border border-border bg-surface-2/70 p-4 text-center transition-colors hover:bg-secondary"
          >
            <Download className="mx-auto mb-2 h-5 w-5 text-muted-foreground" aria-hidden />
            <p className="text-xs font-semibold">Загрузки</p>
            <p className="text-[11px] text-primary">Управлять</p>
          </Link>
        </div>
      </div>
    </aside>
  );
}
