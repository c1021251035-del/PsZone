"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Gamepad2,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Calendar,
  Clock,
  User,
  Phone,
  Banknote,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  formatRupiah,
  formatTanggalDisplay,
  getHariIni,
  getMaxTanggal,
  hitungJamSelesai,
} from "@/lib/helpers";
import {
  getUnitsAktif,
  getSlotTersedia,
  createBooking,
} from "@/lib/actions/booking";
import { StepTransition, FadeUp, StaggerList, StaggerItem } from "@/components/motion";

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-background" />}>
      <BookingPageInner />
    </Suspense>
  );
}

type Unit = {
  id: string;
  nama: string;
  tipe: string;
  hargaPerJam: number;
  deskripsi: string | null;
};

type Slot = { jam: string; tersedia: boolean };

function BookingPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedUnitId = searchParams.get("unitId");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [units, setUnits] = useState<Unit[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);

  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedTanggal, setSelectedTanggal] = useState("");
  const [selectedJam, setSelectedJam] = useState("");
  const [durasi, setDurasi] = useState(1);
  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalHarga = selectedUnit ? selectedUnit.hargaPerJam * durasi : 0;
  const jamSelesai = selectedJam ? hitungJamSelesai(selectedJam, durasi) : "";

  useEffect(() => {
    getUnitsAktif().then((data) => {
      setUnits(data as Unit[]);
      if (preselectedUnitId) {
        const unit = data.find((u) => u.id === preselectedUnitId);
        if (unit) {
          setSelectedUnit(unit as Unit);
          setStep(2);
        }
      }
    });
  }, [preselectedUnitId]);

  useEffect(() => {
    if (selectedUnit && selectedTanggal) {
      setLoading(true);
      setSelectedJam("");
      getSlotTersedia(selectedUnit.id, selectedTanggal, durasi).then((data) => {
        setSlots(data as Slot[]);
        setLoading(false);
      });
    }
  }, [selectedUnit, selectedTanggal]);

  function validateStep3() {
    const errs: Record<string, string> = {};
    if (!nama.trim()) errs.nama = "Nama wajib diisi";
    if (!noHp.trim()) errs.noHp = "No. HP wajib diisi";
    else if (!/^[0-9+\-\s]{8,15}$/.test(noHp)) errs.noHp = "Format no. HP tidak valid";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validateStep3()) return;
    if (!selectedUnit || !selectedTanggal || !selectedJam) return;

    setSubmitting(true);
    try {
      const result = await createBooking({
        unitId: selectedUnit.id,
        tanggal: selectedTanggal,
        jamMulai: selectedJam,
        durasiJam: durasi,
        namaPelanggan: nama,
        noHp,
      });
      router.push(`/booking/${result.kodeBooking}`);
    } catch {
      toast.error("Terjadi kesalahan, coba lagi");
    } finally {
      setSubmitting(false);
    }
  }

  const ps5Units = units.filter((u) => u.tipe === "PS5");
  const ps4Units = units.filter((u) => u.tipe === "PS4");

  const stepLabels = ["Pilih Unit", "Waktu", "Data Diri"];

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

          {/* Step indicator */}
          <div className="flex items-center gap-1.5">
            {stepLabels.map((label, i) => {
              const s = i + 1;
              const done = step > s;
              const active = step === s;
              return (
                <div key={s} className="flex items-center gap-1.5">
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      done
                        ? "bg-primary/15 text-primary"
                        : active
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {done ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <span className="w-3 h-3 flex items-center justify-center text-[10px] font-bold">{s}</span>
                    )}
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className={`w-4 h-px ${step > s ? "bg-primary/40" : "bg-border/40"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8">

        <StepTransition stepKey={step}>

        {/* ── Step 1: Pilih Unit ───────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <FadeUp>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Pilih Unit</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {units.length} unit tersedia
              </p>
            </FadeUp>

            {units.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Gamepad2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Tidak ada unit aktif saat ini</p>
              </div>
            ) : (
              <>
                {ps5Units.length > 0 && (
                  <StaggerList className="space-y-3" delay={0.1}>
                    <StaggerItem>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 rounded-full bg-primary" />
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          PlayStation 5
                        </p>
                      </div>
                    </StaggerItem>
                    {ps5Units.map((unit) => (
                      <StaggerItem key={unit.id}>
                        <UnitSelectCard
                          unit={unit}
                          onSelect={() => { setSelectedUnit(unit); setStep(2); }}
                        />
                      </StaggerItem>
                    ))}
                  </StaggerList>
                )}
                {ps4Units.length > 0 && (
                  <StaggerList className="space-y-3" delay={0.2}>
                    <StaggerItem>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 rounded-full bg-muted-foreground/40" />
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          PlayStation 4
                        </p>
                      </div>
                    </StaggerItem>
                    {ps4Units.map((unit) => (
                      <StaggerItem key={unit.id}>
                        <UnitSelectCard
                          unit={unit}
                          onSelect={() => { setSelectedUnit(unit); setStep(2); }}
                        />
                      </StaggerItem>
                    ))}
                  </StaggerList>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Step 2: Waktu ────────────────────────────────────── */}
        {step === 2 && selectedUnit && (
          <div className="space-y-6">
            <FadeUp>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground tracking-tight">Pilih Waktu</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedUnit.nama} ({selectedUnit.tipe})
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground shrink-0"
                  onClick={() => { setStep(1); setSelectedTanggal(""); setSelectedJam(""); setSlots([]); }}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Ganti Unit
                </Button>
              </div>
            </FadeUp>

            {/* Selected unit chip */}
            <div className={`flex items-center gap-3 p-3.5 rounded-xl border ${
              selectedUnit.tipe === "PS5"
                ? "border-primary/30 bg-primary/6"
                : "border-border/60 bg-card/50"
            }`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                selectedUnit.tipe === "PS5" ? "bg-primary/15" : "bg-muted"
              }`}>
                <Gamepad2 className={`w-4 h-4 ${selectedUnit.tipe === "PS5" ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{selectedUnit.nama}</p>
                <p className="text-xs text-primary font-medium">{formatRupiah(selectedUnit.hargaPerJam)}/jam</p>
              </div>
              <Badge variant={selectedUnit.tipe === "PS5" ? "default" : "secondary"} className="text-[10px] font-bold">
                {selectedUnit.tipe}
              </Badge>
            </div>

            {/* Tanggal */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                Tanggal
              </Label>
              <Input
                type="date"
                value={selectedTanggal}
                min={getHariIni()}
                max={getMaxTanggal()}
                onChange={(e) => setSelectedTanggal(e.target.value)}
                className="bg-card/50 border-border/60 focus:border-primary/50 focus:ring-primary/20"
              />
            </div>

            {/* Slot */}
            {selectedTanggal && (
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  Jam Mulai
                  {loading && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
                </Label>
                {!loading && slots.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot.jam}
                        disabled={!slot.tersedia}
                        onClick={() => setSelectedJam(slot.jam)}
                        className={`py-2.5 rounded-xl text-xs font-medium text-center transition-all duration-150 ${
                          !slot.tersedia
                            ? "slot-taken"
                            : selectedJam === slot.jam
                            ? "slot-selected"
                            : "slot-available"
                        }`}
                      >
                        {slot.jam}
                      </button>
                    ))}
                  </div>
                )}
                {!loading && slots.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Tidak ada slot tersedia untuk tanggal ini
                  </p>
                )}
              </div>
            )}

            {/* Durasi */}
            {selectedJam && (
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  Durasi
                </Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDurasi(d)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border ${
                        durasi === d
                          ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                          : "border-border/60 bg-card/50 text-foreground hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      {d}j
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>Selesai pukul <span className="text-foreground font-medium">{jamSelesai}</span></span>
                  <span className="text-primary font-semibold">{formatRupiah(totalHarga)}</span>
                </div>
              </div>
            )}

            <Button
              className="w-full gap-2 shadow-lg shadow-primary/20 font-medium"
              disabled={!selectedTanggal || !selectedJam}
              onClick={() => setStep(3)}
            >
              Lanjut ke Data Diri
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* ── Step 3: Data Diri ────────────────────────────────── */}
        {step === 3 && selectedUnit && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Data Diri</h1>
                <p className="text-sm text-muted-foreground mt-1">Langkah terakhir sebelum konfirmasi</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground shrink-0"
                onClick={() => setStep(2)}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Kembali
              </Button>
            </div>

            {/* Ringkasan */}
            <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/40 bg-muted/20">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Ringkasan Booking
                </p>
              </div>
              <div className="divide-y divide-border/30">
                {[
                  { icon: Gamepad2, label: "Unit", value: `${selectedUnit.nama} (${selectedUnit.tipe})` },
                  { icon: Calendar, label: "Tanggal", value: formatTanggalDisplay(selectedTanggal) },
                  { icon: Clock, label: "Waktu", value: `${selectedJam} - ${jamSelesai} (${durasi} jam)` },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <row.icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground w-16 shrink-0">{row.label}</span>
                    <span className="text-sm font-medium text-foreground">{row.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-3 bg-primary/4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                      <Banknote className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">Total</span>
                  </div>
                  <span className="text-base font-bold text-primary">{formatRupiah(totalHarga)}</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama" className="text-sm font-medium flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  Nama Lengkap
                </Label>
                <Input
                  id="nama"
                  placeholder="Nama kamu"
                  value={nama}
                  onChange={(e) => { setNama(e.target.value); setErrors((p) => ({ ...p, nama: "" })); }}
                  className={`bg-card/50 border-border/60 focus:border-primary/50 focus:ring-primary/20 ${errors.nama ? "border-destructive" : ""}`}
                />
                {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="noHp" className="text-sm font-medium flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                  No. HP / WhatsApp
                </Label>
                <Input
                  id="noHp"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={noHp}
                  onChange={(e) => { setNoHp(e.target.value); setErrors((p) => ({ ...p, noHp: "" })); }}
                  className={`bg-card/50 border-border/60 focus:border-primary/50 focus:ring-primary/20 ${errors.noHp ? "border-destructive" : ""}`}
                />
                {errors.noHp && <p className="text-xs text-destructive">{errors.noHp}</p>}
              </div>
            </div>

            <Button
              className="w-full gap-2 shadow-lg shadow-primary/20 font-semibold"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {submitting ? "Memproses..." : "Konfirmasi Booking"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Pembayaran tunai di tempat saat datang
            </p>
          </div>
        )}

        </StepTransition>
      </main>
    </div>
  );
}

/* ── Unit Select Card ────────────────────────────────────── */
function UnitSelectCard({
  unit,
  onSelect,
}: {
  unit: Unit;
  onSelect: () => void;
}) {
  const isPS5 = unit.tipe === "PS5";
  return (
    <button
      onClick={onSelect}
      className={`group w-full text-left relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] ${
        isPS5
          ? "border-primary/25 bg-primary/4 hover:border-primary/50 hover:bg-primary/8 hover:shadow-lg hover:shadow-primary/10"
          : "border-border/50 bg-card/40 hover:border-border hover:bg-card/70 hover:shadow-md"
      }`}
    >
      {isPS5 && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      )}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          isPS5 ? "bg-primary/15" : "bg-muted"
        }`}>
          <Gamepad2 className={`w-5 h-5 ${isPS5 ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm text-foreground truncate">{unit.nama}</p>
            <Badge variant={isPS5 ? "default" : "secondary"} className="text-[10px] font-bold shrink-0">
              {unit.tipe}
            </Badge>
          </div>
          {unit.deskripsi && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{unit.deskripsi}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-foreground">{formatRupiah(unit.hargaPerJam)}</p>
          <p className="text-[10px] text-muted-foreground">per jam</p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>
    </button>
  );
}
