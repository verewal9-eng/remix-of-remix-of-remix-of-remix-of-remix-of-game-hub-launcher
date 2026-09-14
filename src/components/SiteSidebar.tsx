import { Link, useRouterState } from "@tanstack/react-router";
import { Folder, Hash, Home, LayoutGrid, Settings } from "lucide-react";
import { games } from "@/lib/games";

const nav = [
  { title: "Главная", to: "/", icon: Home },
  { title: "Категории", to: "/", icon: LayoutGrid },
  { title: "Библиотека", to: "/library", icon: Folder },
  { title: "Сообщество", to: "/", icon: Hash },
  { title: "Настройки", to: "/", icon: Settings },
] as const;

const friends = [
  { name: "Cujo", status: "В сети", color: "bg-success" },
  { name: "Unrealistic.-", status: "Отошёл", color: "bg-destructive" },
  { name: "4KALPHA", status: "Не беспокоить", color: "bg-accent" },
  { name: "ANTODAIDO", status: "Отошёл", color: "bg-destructive" },
  { name: "basicallyLEP", status: "Невидимка", color: "bg-muted-foreground" },
  { name: "codexxx0", status: "В сети", color: "bg-success" },
];

export function SiteSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <aside className="hidden w-[248px] shrink-0 flex-col bg-background pb-6 lg:flex">
      <Link to="/" className="flex items-center gap-3 px-6 pb-8 pt-7">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/50 font-display text-lg font-bold text-primary-foreground">
          N
        </span>
        <span className="font-display text-xl font-bold tracking-[0.12em]">NEBULA</span>
      </Link>

      <nav className="flex flex-col gap-1 pr-5">
        {nav.map((item, i) => {
          const active =
            i === 0 ? pathname === "/" : item.to === "/library" && pathname === "/library";
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              to={item.to}
              className={`flex items-center gap-4 rounded-r-full py-3.5 pl-6 pr-4 text-[15px] transition-colors ${
                active
                  ? "bg-foreground font-semibold text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="mx-6 mt-7 border-t border-border/70 pt-5">
        <ul className="flex flex-col gap-3.5">
          {friends.map((friend, i) => (
            <li key={friend.name} className="flex items-center justify-end gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold leading-tight">{friend.name}</p>
                <p className="flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground">
                  <span className={`h-1.5 w-1.5 rounded-full ${friend.color}`} aria-hidden />
                  {friend.status}
                </p>
              </div>
              <img
                src={games[i % games.length]!.image}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
