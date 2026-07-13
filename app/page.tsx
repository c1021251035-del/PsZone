import Link from "next/link";
import { Gamepad2, Clock, MapPin, ChevronRight, Zap, Shield, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { formatRupiah } from "@/lib/helpers";
import { FadeUp, FadeIn, StaggerList, StaggerItem, HoverCard } from "@/components/motion";
import { PSControllerAnimation } from "@/components/ps-controller-animation";

async function getUnitsAktif() {
  try {
    const units = await prisma.unit.findMany({
      where: { status: "AKTIF" },
      orderBy: [{ tipe: "desc" }, { nama: "asc" }],
    });
    return units;
  } catch {
    return [];
  }
}

async function getSetting() {
  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: ["jamBuka", "jamTutup"] } },
    });
    const map: Record<string, string> = {};
    settings.forEach((s: { key: string; value: string }) => (map[s.key] = s.value));
    return { jamBuka: map.jamBuka ?? "10:00", jamTutup: map.jamTutup ?? "23:00" };
  } catch {
    return { jamBuka: "10:00", jamTutup: "23:00" };
  }
}

export default async function HomePage() {
  const [units, setting] = await Promise.all([getUnitsAktif(), getSetting()]);
  const ps5Units = units.filter((u) => u.tipe === "PS5");
  const ps4Units = units.filter((u) => u.tipe === "PS4");

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">

      {/* ── Navigation ───────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <Gamepad2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-base tracking-tight text-foreground">PSZone</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Buka {setting.jamBuka} - {setting.jamTutup}
            </div>
            <Link href="/booking">
              <Button size="sm" className="gap-1.5 shadow-lg shadow-primary/20 font-medium">
                Booking Sekarang
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-border/40">
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/6 blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/4 blur-[100px]" />
          </div>

          <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left: Copy */}
              <div className="space-y-7">
                <FadeUp delay={0.05}>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    PS5 &amp; PS4 tersedia sekarang
                  </div>
                </FadeUp>

                <FadeUp delay={0.12}>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-foreground">
                    Gaming Premium,{" "}
                    <span className="text-gradient-teal">Booking Mudah</span>
                  </h1>
                </FadeUp>

                <FadeUp delay={0.2}>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-[44ch]">
                    Sesi PS5 &amp; PS4 berkualitas tinggi. Pilih unit, tentukan waktu, konfirmasi
                    dalam hitungan detik.
                  </p>
                </FadeUp>

                <FadeUp delay={0.28}>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/booking">
                      <Button size="lg" className="gap-2 shadow-xl shadow-primary/25 font-semibold w-full sm:w-auto">
                        Booking Sekarang
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
                      <Clock className="w-4 h-4 text-primary" />
                      Buka {setting.jamBuka} - {setting.jamTutup} WIB
                    </div>
                  </div>
                </FadeUp>

                {/* Stats row */}
                <FadeUp delay={0.36}>
                  <div className="flex items-center gap-6 pt-2">
                    <div>
                      <p className="text-2xl font-bold text-foreground tabular-nums">{units.length}</p>
                      <p className="text-xs text-muted-foreground">Unit Tersedia</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div>
                      <p className="text-2xl font-bold text-foreground tabular-nums">{ps5Units.length}</p>
                      <p className="text-xs text-muted-foreground">Unit PS5</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div>
                      <p className="text-2xl font-bold text-foreground tabular-nums">{ps4Units.length}</p>
                      <p className="text-xs text-muted-foreground">Unit PS4</p>
                    </div>
                  </div>
                </FadeUp>
              </div>

              {/* Right: PS Controller Animation */}
              <div className="hidden lg:flex items-center justify-center">
                <PSControllerAnimation />
              </div>
            </div>
          </div>
        </section>

        {/* ── Features bento ───────────────────────────────────── */}
        <section className="border-b border-border/40 py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-4" delay={0.1}>

              {/* Feature 1 — large */}
              <StaggerItem className="md:col-span-2">
                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-8 group h-full">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  <div className="w-12 h-12 rounded-2xl bg-primary/12 flex items-center justify-center mb-5">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Booking Instan</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[36ch]">
                    Pilih unit, tanggal, dan jam. Kode booking langsung dikirim tanpa daftar akun.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                    Mulai booking <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </StaggerItem>

              {/* Feature 2 */}
              <StaggerItem>
                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 h-full">
                  <div className="w-10 h-10 rounded-xl bg-green-500/12 flex items-center justify-center mb-4">
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1.5">Slot Terjamin</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Slot yang sudah di-booking dikunci otomatis. Tidak ada double-booking.
                  </p>
                </div>
              </StaggerItem>

              {/* Feature 3 */}
              <StaggerItem>
                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 h-full">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/12 flex items-center justify-center mb-4">
                    <Star className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1.5">PS5 &amp; PS4</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Pilih sesuai budget. PS5 untuk pengalaman terkini, PS4 tetap premium.
                  </p>
                </div>
              </StaggerItem>

              {/* Feature 4 — large */}
              <StaggerItem className="md:col-span-2">
                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-8 group h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/4 to-transparent pointer-events-none" />
                  <div className="w-12 h-12 rounded-2xl bg-primary/12 flex items-center justify-center mb-5">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Jam Operasional Fleksibel</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[36ch]">
                    Buka setiap hari dari jam {setting.jamBuka} hingga {setting.jamTutup} WIB. Pesan lebih awal untuk slot favorit.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary">
                      {setting.jamBuka} - {setting.jamTutup} WIB
                    </span>
                  </div>
                </div>
              </StaggerItem>

            </StaggerList>
          </div>
        </section>

        {/* ── Unit listing ─────────────────────────────────────── */}
        {units.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-6">
              <FadeUp className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2">
                  Pilih Unit
                </h2>
                <p className="text-sm text-muted-foreground">
                  {units.length} unit aktif siap digunakan
                </p>
              </FadeUp>

              {/* PS5 section */}
              {ps5Units.length > 0 && (
                <div className="mb-10">
                  <FadeIn delay={0.1}>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-1.5 h-5 rounded-full bg-primary" />
                      <h3 className="font-bold text-foreground">PlayStation 5</h3>
                      <Badge variant="default" className="text-[10px] font-bold">PS5</Badge>
                    </div>
                  </FadeIn>
                  <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" delay={0.15}>
                    {ps5Units.map((unit) => (
                      <StaggerItem key={unit.id}>
                        <HoverCard>
                          <UnitCard unit={unit} />
                        </HoverCard>
                      </StaggerItem>
                    ))}
                  </StaggerList>
                </div>
              )}

              {/* PS4 section */}
              {ps4Units.length > 0 && (
                <div>
                  <FadeIn delay={0.1}>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-1.5 h-5 rounded-full bg-muted-foreground/40" />
                      <h3 className="font-bold text-foreground">PlayStation 4</h3>
                      <Badge variant="secondary" className="text-[10px] font-bold">PS4</Badge>
                    </div>
                  </FadeIn>
                  <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" delay={0.2}>
                    {ps4Units.map((unit) => (
                      <StaggerItem key={unit.id}>
                        <HoverCard>
                          <UnitCard unit={unit} />
                        </HoverCard>
                      </StaggerItem>
                    ))}
                  </StaggerList>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── CTA bottom ───────────────────────────────────────── */}
        <section className="border-t border-border/40 py-16">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <FadeUp>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-3">
                Siap main sekarang?
              </h2>
              <p className="text-sm text-muted-foreground mb-7">
                Booking hanya butuh 1 menit. Tidak perlu daftar akun.
              </p>
              <Link href="/booking">
                <Button size="lg" className="gap-2 shadow-xl shadow-primary/25 font-semibold">
                  Booking Sekarang
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </FadeUp>
          </div>
        </section>

      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-border/40 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <Gamepad2 className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">PSZone</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Booking PS5 &amp; PS4 online. Buka {setting.jamBuka} - {setting.jamTutup} WIB.
          </p>
        </div>
      </footer>

    </div>
  );
}

/* ── Unit Card Component ─────────────────────────────────── */
type UnitCardProps = {
  unit: {
    id: string;
    nama: string;
    tipe: string;
    hargaPerJam: number;
    deskripsi: string | null;
  };
};

function UnitCard({ unit }: UnitCardProps) {
  const isPS5 = unit.tipe === "PS5";
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
        isPS5
          ? "border-primary/30 bg-gradient-to-br from-primary/6 to-transparent hover:border-primary/50 hover:shadow-primary/10"
          : "border-border/60 bg-card/50 hover:border-border hover:shadow-foreground/5"
      }`}
    >
      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-px ${
          isPS5
            ? "bg-gradient-to-r from-transparent via-primary/70 to-transparent"
            : "bg-gradient-to-r from-transparent via-border to-transparent"
        }`}
      />

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isPS5 ? "bg-primary/15" : "bg-muted"
              }`}
            >
              <Gamepad2 className={`w-4.5 h-4.5 ${isPS5 ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">{unit.nama}</p>
              {unit.deskripsi && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{unit.deskripsi}</p>
              )}
            </div>
          </div>
          <Badge
            variant={isPS5 ? "default" : "secondary"}
            className="text-[10px] font-bold shrink-0 px-1.5"
          >
            {unit.tipe}
          </Badge>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground mb-0.5 uppercase tracking-wide font-medium">Per jam</p>
            <p className="text-lg font-bold text-foreground tabular-nums">
              {formatRupiah(unit.hargaPerJam)}
            </p>
          </div>
          <Link href={`/booking?unitId=${unit.id}`}>
            <Button
              size="sm"
              variant={isPS5 ? "default" : "outline"}
              className={`gap-1.5 text-xs font-medium transition-all ${
                isPS5
                  ? "shadow-md shadow-primary/20"
                  : "group-hover:border-primary/40 group-hover:text-primary"
              }`}
            >
              Booking
              <ChevronRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
