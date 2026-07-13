import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Gamepad2,
  Calendar,
  Clock,
  User,
  Phone,
  Banknote,
  ArrowRight,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBookingByKode } from "@/lib/actions/booking";
import { formatRupiah, formatTanggalDisplay } from "@/lib/helpers";
import { ScaleIn, FadeUp, ConfirmationStagger, ConfirmationItem } from "@/components/motion";

export default async function KonfirmasiPage({
  params,
}: {
  params: Promise<{ kode: string }>;
}) {
  const { kode } = await params;
  const booking = await getBookingByKode(kode);

  if (!booking) notFound();

  const isConfirmed = booking.status === "CONFIRMED";

  const detailRows = [
    {
      icon: Gamepad2,
      label: "Unit",
      value: `${booking.unit.nama} (${booking.unit.tipe})`,
      accent: false,
    },
    {
      icon: Calendar,
      label: "Tanggal",
      value: formatTanggalDisplay(booking.tanggal),
      accent: false,
    },
    {
      icon: Clock,
      label: "Waktu",
      value: `${booking.jamMulai} - ${booking.jamSelesai} (${booking.durasiJam} jam)`,
      accent: false,
    },
    {
      icon: User,
      label: "Nama",
      value: booking.namaPelanggan,
      accent: false,
    },
    {
      icon: Phone,
      label: "No. HP",
      value: booking.noHp,
      accent: false,
    },
    {
      icon: Banknote,
      label: "Total",
      value: formatRupiah(booking.totalHarga),
      accent: true,
    },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">

      {/* ── Nav ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <Gamepad2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
              PSZone
            </span>
          </Link>
          <Badge
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              isConfirmed
                ? "bg-green-500/15 text-green-400 border border-green-500/30"
                : "bg-destructive/15 text-destructive border border-destructive/30"
            }`}
          >
            {isConfirmed ? "Confirmed" : "Cancelled"}
          </Badge>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">

        {/* ── Success header ───────────────────────────────────── */}
        <ScaleIn className="text-center mb-8">
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
            isConfirmed
              ? "bg-green-500/15 ring-4 ring-green-500/10"
              : "bg-destructive/15 ring-4 ring-destructive/10"
          }`}>
            <CheckCircle2
              className={`w-8 h-8 ${isConfirmed ? "text-green-400" : "text-destructive"}`}
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">
            {isConfirmed ? "Booking Berhasil!" : "Booking Dibatalkan"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isConfirmed
              ? "Simpan kode booking di bawah untuk ditunjukkan ke admin"
              : "Booking ini telah dibatalkan"}
          </p>
        </ScaleIn>

        <ConfirmationStagger>

        {/* ── Kode booking card ────────────────────────────────── */}
        {isConfirmed && (
          <ConfirmationItem>
            <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-primary/5 p-6 mb-6 text-center">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-primary/3 to-transparent pointer-events-none" />
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">
                Kode Booking
              </p>
              <p className="text-3xl font-bold tracking-[0.15em] text-primary font-mono mb-1">
                {booking.kodeBooking}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Tunjukkan kode ini kepada admin saat datang
              </p>
            </div>
          </ConfirmationItem>
        )}

        {/* ── Detail rows ──────────────────────────────────────── */}
        <ConfirmationItem>
          <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden mb-6">
            <div className="px-4 py-3 border-b border-border/40 bg-muted/20">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Detail Booking
              </p>
            </div>
            <div className="divide-y divide-border/30">
              {detailRows.map((row) => (
                <div
                  key={row.label}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    row.accent ? "bg-primary/4" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      row.accent ? "bg-primary/15" : "bg-muted/50"
                    }`}
                  >
                    <row.icon
                      className={`w-3.5 h-3.5 ${
                        row.accent ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-14 shrink-0">
                    {row.label}
                  </span>
                  <span
                    className={`text-sm flex-1 ${
                      row.accent
                        ? "font-bold text-primary text-right"
                      : "font-medium text-foreground"
                  }`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        </ConfirmationItem>

        {/* ── Info box ─────────────────────────────────────────── */}
        {isConfirmed && (
          <ConfirmationItem>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/6 p-4 mb-6">
              <p className="text-xs font-semibold text-amber-400 mb-2">
                Catatan Penting
              </p>
              <ul className="space-y-1.5">
                {[
                  "Tunjukkan kode booking kepada admin saat datang",
                  "Pembayaran dilakukan tunai di tempat",
                  "Datang tepat waktu sesuai jam yang dipesan",
                ].map((note) => (
                  <li key={note} className="flex items-start gap-2 text-xs text-amber-300/80">
                    <span className="mt-0.5 w-1 h-1 rounded-full bg-amber-400/60 shrink-0" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </ConfirmationItem>
        )}

        {/* ── CTA ──────────────────────────────────────────────── */}
        <ConfirmationItem>
          <Link href="/booking">
            <Button variant="outline" className="w-full gap-2 border-border/60 hover:border-primary/40 hover:text-primary">
              Booking Lagi
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </ConfirmationItem>

        </ConfirmationStagger>

      </main>
    </div>
  );
}
