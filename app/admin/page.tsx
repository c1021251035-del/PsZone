import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDashboardStats } from "@/lib/actions/admin";
import { Calendar, Gamepad2, Clock, TrendingUp, ChevronRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatTanggalDisplay } from "@/lib/helpers";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const stats = await getDashboardStats();

  const kpiCards = [
    {
      label: "Booking Hari Ini",
      value: stats.totalBookingHariIni,
      icon: Calendar,
      accent: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      label: "Unit Aktif",
      value: stats.unitAktif,
      icon: Gamepad2,
      accent: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      label: "Slot Terisi",
      value: `${stats.slotTerisi}j`,
      icon: Clock,
      accent: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      label: "Slot Kosong",
      value: `${stats.slotKosong}j`,
      icon: TrendingUp,
      accent: "text-muted-foreground",
      bg: "bg-muted/50",
      border: "border-border/40",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Ringkasan operasional hari ini</p>
        </div>
        <Link href="/admin/bookings">
          <Button variant="outline" size="sm" className="gap-1.5 border-border/60 hover:border-primary/40 hover:text-primary">
            Semua Booking
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <div
            key={kpi.label}
            className={`relative overflow-hidden rounded-2xl border bg-card/50 p-5 ${kpi.border}`}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="flex items-start justify-between mb-4">
              <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-4.5 h-4.5 ${kpi.accent}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground tabular-nums mb-1">
              {kpi.value}
            </p>
            <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/40 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Booking Hari Ini</p>
          <Link href="/admin/bookings">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-primary h-7">
              Lihat Semua
              <ChevronRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>

        {stats.bookingHariIni.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Belum ada booking hari ini</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20">
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-2.5">Kode</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2.5">Nama</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2.5 hidden sm:table-cell">Unit</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2.5 hidden md:table-cell">Waktu</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2.5 hidden md:table-cell">Total</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {stats.bookingHariIni.map(
                  (booking: {
                    id: string;
                    kodeBooking: string;
                    namaPelanggan: string;
                    jamMulai: string;
                    jamSelesai: string;
                    totalHarga: number;
                    status: string;
                    unit: { nama: string; tipe: string };
                  }) => (
                    <tr key={booking.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3">
                        <span className="font-mono text-xs text-primary font-medium">
                          {booking.kodeBooking}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-sm text-foreground font-medium">{booking.namaPelanggan}</span>
                      </td>
                      <td className="px-3 py-3 hidden sm:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {booking.unit.nama}
                        </span>
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {booking.jamMulai} - {booking.jamSelesai}
                        </span>
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        <span className="text-sm font-semibold text-foreground tabular-nums">
                          {formatRupiah(booking.totalHarga)}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
                            booking.status === "CONFIRMED"
                              ? "bg-green-500/15 text-green-400 border border-green-500/25"
                              : "bg-destructive/15 text-destructive border border-destructive/25"
                          }`}
                        >
                          <span className={`w-1 h-1 rounded-full ${
                            booking.status === "CONFIRMED" ? "bg-green-400" : "bg-destructive"
                          }`} />
                          {booking.status === "CONFIRMED" ? "Confirmed" : "Cancelled"}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
