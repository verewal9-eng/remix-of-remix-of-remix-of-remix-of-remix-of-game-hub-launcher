import { Link } from "@tanstack/react-router";
import { Bell, Copy, Search, ShoppingCart } from "lucide-react";
import { games } from "@/lib/games";
import { useLibrary } from "@/lib/library";

export function SiteHeader() {
  const { entries } = useLibrary();
  const downloading = Object.values(entries).filter((e) => e.status === "downloading").length;

  return (
    <header className="flex items-center justify-end gap-6 px-6 pb-6 pt-7">
      <button
        aria-label="Поиск"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-surface-2"
      >
        <Search className="h-[18px] w-[18px]" aria-hidden />
      </button>

      <div className="flex items-center gap-5">
        <Link to="/library" aria-label="Корзина" className="relative text-foreground/90 hover:text-foreground">
          <ShoppingCart className="h-[22px] w-[22px]" aria-hidden />
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {Object.keys(entries).length || 3}
          </span>
        </Link>
        <span className="relative text-foreground/90">
          <Bell className="h-[22px] w-[22px]" aria-hidden />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent" aria-hidden />
        </span>
        <span className="relative text-foreground/90">
          <Copy className="h-[22px] w-[22px]" aria-hidden />
          {downloading > 0 && (
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-success" aria-hidden />
          )}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold leading-tight">Desmond Miles</p>
          <p className="flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden /> В сети
          </p>
        </div>
        <img
          src={games[0]!.image}
          alt="Ваш аватар"
          className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
        />
      </div>
    </header>
  );
}
