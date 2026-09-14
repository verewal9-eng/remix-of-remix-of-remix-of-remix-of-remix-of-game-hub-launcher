import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Bell, ChevronDown, CircleDollarSign, Image, MessageSquare, Search } from "lucide-react";
import { useLibrary } from "@/lib/library";

export function SiteHeader() {
  const router = useRouter();
  const { entries } = useLibrary();
  const downloading = Object.values(entries).filter((e) => e.status === "downloading").length;

  return (
    <header className="flex items-center gap-3 px-5 py-4">
      <button
        aria-label="Назад"
        onClick={() => router.history.back()}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
      </button>
      <button
        aria-label="Вперёд"
        onClick={() => router.history.forward()}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowRight className="h-4 w-4" aria-hidden />
      </button>

      <label className="relative hidden min-w-0 flex-1 max-w-md sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          placeholder="Поиск"
          aria-label="Поиск по Nebula"
          className="h-9 w-full rounded-full bg-surface-2 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
      </label>

      <Link
        to="/library"
        className="rounded-full bg-accent/15 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/25"
      >
        Желаемое
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden items-center gap-2 rounded-full bg-surface-2 px-3 py-2 text-sm text-muted-foreground sm:flex">
          <Bell className="h-4 w-4" aria-hidden /> {downloading || 4}
        </span>
        <span className="hidden items-center gap-2 rounded-full bg-surface-2 px-3 py-2 text-sm text-muted-foreground sm:flex">
          <MessageSquare className="h-4 w-4" aria-hidden /> 6
        </span>
        <span className="hidden h-9 w-9 items-center justify-center rounded-full bg-success/20 text-success sm:flex">
          <CircleDollarSign className="h-4 w-4" aria-hidden />
        </span>
        <span className="flex items-center gap-2 rounded-full bg-surface-2 py-1 pl-1 pr-3 text-sm">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-display text-xs font-bold text-primary-foreground">
            A
          </span>
          Игрок
          <ChevronDown className="h-3 w-3 text-muted-foreground" aria-hidden />
        </span>
        <span className="hidden h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-muted-foreground xl:flex">
          <Image className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </header>
  );
}
