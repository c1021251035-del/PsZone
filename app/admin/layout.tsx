"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Calendar,
  Gamepad2,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Booking", icon: Calendar },
  { href: "/admin/units", label: "Unit PS", icon: Gamepad2 },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [status, pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
            <Gamepad2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight text-sidebar-foreground">PSZone</p>
            <p className="text-[10px] text-muted-foreground leading-tight">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-primary/15 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("w-4 h-4 shrink-0", active ? "text-primary" : "")} />
              {item.label}
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          Lihat Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-sidebar border-r border-sidebar-border">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl h-14 flex items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <Gamepad2 className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">
              {navItems.find((n) =>
                n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)
              )?.label ?? "Admin"}
            </span>
          </div>
          <div className="w-9" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
