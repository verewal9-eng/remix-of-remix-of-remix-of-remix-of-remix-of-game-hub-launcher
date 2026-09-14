import { Link } from "@tanstack/react-router";
import { Gamepad2, Library, Store } from "lucide-react";
import { useLibrary } from "@/lib/library";

export function SiteHeader() {
  const { entries } = useLibrary();
  const downloading = Object.values(entries).filter((e) => e.status === "downloading").length;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Gamepad2 className="h-6 w-6 text-primary" aria-hidden />
          <span className="font-display text-xl font-bold uppercase tracking-widest text-gradient-brand">
            Nebula
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wide">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-secondary text-foreground" }}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Store className="h-4 w-4" aria-hidden /> Магазин
          </Link>
          <Link
            to="/library"
            activeProps={{ className: "bg-secondary text-foreground" }}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Library className="h-4 w-4" aria-hidden /> Библиотека
            {downloading > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] text-primary-foreground">
                {downloading}
              </span>
            )}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:block">Игрок</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-display text-sm font-bold text-primary">
            NB
          </div>
        </div>
      </div>
    </header>
  );
}
