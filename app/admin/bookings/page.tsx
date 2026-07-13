"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Loader2, Ban, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { formatRupiah, formatTanggalSingkat, getHariIni } from "@/lib/helpers";
import { getAllBookings, cancelBooking, getAllUnits } from "@/lib/actions/admin";

type Booking = {
  id: string;
  kodeBooking: string;
  namaPelanggan: string;
  noHp: string;
  tanggal: Date;
  jamMulai: string;
  jamSelesai: string;
  durasiJam: number;
  totalHarga: number;
  status: string;
  unit: { id: string; nama: string; tipe: string };
};

type Unit = { id: string; nama: string; tipe: string };

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const [tanggalDari, setTanggalDari] = useState(getHariIni());
  const [tanggalSampai, setTanggalSampai] = useState(getHariIni());
  const [filterUnit, setFilterUnit] = useState("SEMUA");
  const [filterStatus, setFilterStatus] = useState("SEMUA");

  function handleFilterUnit(value: string | null) {
    setFilterUnit(value ?? "SEMUA");
  }
  function handleFilterStatus(value: string | null) {
    setFilterStatus(value ?? "SEMUA");
  }

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllBookings({
        tanggalDari,
        tanggalSampai,
        unitId: filterUnit,
        status: filterStatus,
      });
      setBookings(data as Booking[]);
    } finally {
      setLoading(false);
    }
  }, [tanggalDari, tanggalSampai, filterUnit, filterStatus]);

  useEffect(() => {
    getAllUnits().then((data) => setUnits(data as Unit[]));
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  async function handleCancel() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await cancelBooking(cancelTarget.id);
      toast.success("Booking berhasil dibatalkan");
      setCancelTarget(null);
      loadBookings();
    } catch {
      toast.error("Gagal membatalkan booking");
    } finally {
      setCancelling(false);
    }
  }

  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
  const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;

  return (
    <div className="p-6 space-y-6 max-w-6xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Booking</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Kelola semua booking</p>
      </div>

      {/* Filter */}
      <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border/40 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Filter</p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Dari</label>
              <Input
                type="date"
                value={tanggalDari}
                onChange={(e) => setTanggalDari(e.target.value)}
                className="bg-background/50 border-border/60 text-sm h-9"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Sampai</label>
              <Input
                type="date"
                value={tanggalSampai}
                onChange={(e) => setTanggalSampai(e.target.value)}
                className="bg-background/50 border-border/60 text-sm h-9"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Unit</label>
              <Select value={filterUnit} onValueChange={handleFilterUnit}>
                <SelectTrigger className="bg-background/50 border-border/60 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEMUA">Semua Unit</SelectItem>
                  {units.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.nama} ({u.tipe})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Status</label>
              <Select value={filterStatus} onValueChange={handleFilterStatus}>
                <SelectTrigger className="bg-background/50 border-border/60 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEMUA">Semua Status</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary badges */}
      {!loading && bookings.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground">{bookings.length} booking</span>
          {confirmed > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/25">
              <span className="w-1 h-1 rounded-full bg-green-400" />
              {confirmed} confirmed
            </span>
          )}
          {cancelled > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-destructive/15 text-destructive border border-destructive/25">
              <span className="w-1 h-1 rounded-full bg-destructive" />
              {cancelled} cancelled
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Memuat data...</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Tidak ada booking ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20">
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-2.5">Kode</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2.5">Nama</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2.5 hidden sm:table-cell">Unit</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2.5 hidden md:table-cell">Tanggal</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2.5 hidden md:table-cell">Waktu</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2.5 hidden lg:table-cell">Total</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2.5">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-muted/15 transition-colors">
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-primary font-medium">{booking.kodeBooking}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div>
                        <p className="text-sm text-foreground font-medium">{booking.namaPelanggan}</p>
                        <p className="text-xs text-muted-foreground">{booking.noHp}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">{booking.unit.nama}</span>
                        <Badge variant={booking.unit.tipe === "PS5" ? "default" : "secondary"} className="text-[9px] font-bold px-1">
                          {booking.unit.tipe}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">{formatTanggalSingkat(booking.tanggal)}</span>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">{booking.jamMulai} - {booking.jamSelesai}</span>
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell">
                      <span className="text-sm font-semibold text-foreground tabular-nums">{formatRupiah(booking.totalHarga)}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-500/15 text-green-400 border border-green-500/25"
                          : "bg-destructive/15 text-destructive border border-destructive/25"
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${booking.status === "CONFIRMED" ? "bg-green-400" : "bg-destructive"}`} />
                        {booking.status === "CONFIRMED" ? "Confirmed" : "Cancelled"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {booking.status === "CONFIRMED" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setCancelTarget(booking)}
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cancel dialog */}
      <Dialog open={!!cancelTarget} onOpenChange={(o) => !o && setCancelTarget(null)}>
        <DialogContent className="bg-card border-border/60">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-destructive/40 to-transparent" />
          <DialogHeader>
            <DialogTitle className="text-foreground">Batalkan Booking</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Batalkan booking{" "}
            <span className="font-mono text-primary font-medium">{cancelTarget?.kodeBooking}</span>{" "}
            atas nama{" "}
            <span className="text-foreground font-medium">{cancelTarget?.namaPelanggan}</span>?
            Slot akan kembali tersedia.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" className="border-border/60" onClick={() => setCancelTarget(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleCancel}
              disabled={cancelling}
              className="gap-2"
            >
              {cancelling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {cancelling ? "Membatalkan..." : "Ya, Batalkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
