import { nanoid } from "nanoid";
import { format, parse, addHours, isAfter, isBefore } from "date-fns";

/**
 * Generate kode booking unik: PS + 6 karakter alfanumerik uppercase
 */
export function generateKodeBooking(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let kode = "PS";
  for (let i = 0; i < 6; i++) {
    kode += chars[Math.floor(Math.random() * chars.length)];
  }
  return kode;
}

/**
 * Format rupiah: 50000 -> "Rp 50.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format jam: "10:00" -> "10.00"
 */
export function formatJam(jam: string): string {
  return jam.replace(":", ".");
}

/**
 * Generate slot jam dari jam buka sampai jam tutup
 * Contoh: jamBuka="10:00", jamTutup="23:00", maxDurasi=4
 * Slot: ["10:00", "11:00", ..., "19:00"] (sampai jamTutup - minDurasi)
 */
export function generateSlotJam(
  jamBuka: string,
  jamTutup: string,
  minDurasi: number = 1
): string[] {
  const slots: string[] = [];
  const [bukaH, bukaM] = jamBuka.split(":").map(Number);
  const [tutupH, tutupM] = jamTutup.split(":").map(Number);

  const bukaTotal = bukaH * 60 + bukaM;
  const tutupTotal = tutupH * 60 + tutupM;
  const batasAkhir = tutupTotal - minDurasi * 60;

  for (let menit = bukaTotal; menit <= batasAkhir; menit += 60) {
    const h = Math.floor(menit / 60);
    const m = menit % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }

  return slots;
}

/**
 * Hitung jam selesai dari jam mulai + durasi
 * Contoh: jamMulai="10:00", durasi=2 -> "12:00"
 */
export function hitungJamSelesai(jamMulai: string, durasi: number): string {
  const [h, m] = jamMulai.split(":").map(Number);
  const selesaiH = h + durasi;
  return `${String(selesaiH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Cek apakah dua rentang jam overlap
 */
export function isOverlap(
  mulai1: string,
  selesai1: string,
  mulai2: string,
  selesai2: string
): boolean {
  const toMinutes = (jam: string) => {
    const [h, m] = jam.split(":").map(Number);
    return h * 60 + m;
  };

  const m1 = toMinutes(mulai1);
  const s1 = toMinutes(selesai1);
  const m2 = toMinutes(mulai2);
  const s2 = toMinutes(selesai2);

  return m1 < s2 && s1 > m2;
}

/**
 * Validasi nomor HP Indonesia
 */
export function isValidNoHp(noHp: string): boolean {
  return /^(\+62|62|0)[0-9]{8,12}$/.test(noHp.replace(/[\s-]/g, ""));
}

/**
 * Format tanggal untuk display: "2026-07-13" -> "Minggu, 13 Juli 2026"
 */
export function formatTanggalDisplay(tanggal: string | Date): string {
  const date = typeof tanggal === "string" ? new Date(tanggal) : tanggal;
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

/**
 * Format tanggal singkat: "2026-07-13" -> "13 Jul 2026"
 */
export function formatTanggalSingkat(tanggal: string | Date): string {
  const date = typeof tanggal === "string" ? new Date(tanggal) : tanggal;
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

/**
 * Konversi tanggal ke string YYYY-MM-DD
 */
export function toDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Ambil tanggal hari ini dalam format YYYY-MM-DD
 */
export function getHariIni(): string {
  return toDateString(new Date());
}

/**
 * Ambil tanggal maksimal booking (hari ini + 7 hari)
 */
export function getMaxTanggal(): string {
  const max = new Date();
  max.setDate(max.getDate() + 7);
  return toDateString(max);
}
