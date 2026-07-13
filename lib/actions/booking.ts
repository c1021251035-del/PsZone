"use server";

import { prisma } from "@/lib/db";
import { generateKodeBooking, hitungJamSelesai, isOverlap } from "@/lib/helpers";
import { revalidatePath } from "next/cache";

export async function getUnitsAktif() {
  return prisma.unit.findMany({
    where: { status: "AKTIF" },
    orderBy: [{ tipe: "desc" }, { nama: "asc" }],
  });
}

export async function getSlotTersedia(
  unitId: string,
  tanggal: string,
  durasi: number
) {
  const [setting, bookings] = await Promise.all([
    prisma.setting.findMany({ where: { key: { in: ["jamBuka", "jamTutup"] } } }),
    prisma.booking.findMany({
      where: {
        unitId,
        tanggal: new Date(tanggal),
        status: "CONFIRMED",
      },
      select: { jamMulai: true, jamSelesai: true },
    }),
  ]);

  const settingMap: Record<string, string> = {};
  setting.forEach((s: { key: string; value: string }) => (settingMap[s.key] = s.value));
  const jamBuka = settingMap.jamBuka ?? "10:00";
  const jamTutup = settingMap.jamTutup ?? "23:00";

  const [bukaH] = jamBuka.split(":").map(Number);
  const [tutupH] = jamTutup.split(":").map(Number);

  const slots: { jam: string; tersedia: boolean }[] = [];
  for (let h = bukaH; h <= tutupH - durasi; h++) {
    const jam = `${String(h).padStart(2, "0")}:00`;
    const jamSelesai = hitungJamSelesai(jam, durasi);
    const overlap = bookings.some((b: { jamMulai: string; jamSelesai: string }) =>
      isOverlap(jam, jamSelesai, b.jamMulai, b.jamSelesai)
    );
    slots.push({ jam, tersedia: !overlap });
  }
  return slots;
}

export async function createBooking(data: {
  unitId: string;
  tanggal: string;
  jamMulai: string;
  durasiJam: number;
  namaPelanggan: string;
  noHp: string;
}) {
  const unit = await prisma.unit.findUnique({ where: { id: data.unitId } });
  if (!unit) throw new Error("Unit tidak ditemukan");

  const jamSelesai = hitungJamSelesai(data.jamMulai, data.durasiJam);
  const totalHarga = unit.hargaPerJam * data.durasiJam;

  // Cek overlap sekali lagi sebelum simpan
  const existing = await prisma.booking.findFirst({
    where: {
      unitId: data.unitId,
      tanggal: new Date(data.tanggal),
      status: "CONFIRMED",
      OR: [
        {
          jamMulai: { lt: jamSelesai },
          jamSelesai: { gt: data.jamMulai },
        },
      ],
    },
  });

  if (existing) throw new Error("Slot sudah tidak tersedia");

  // Generate kode unik
  let kodeBooking = generateKodeBooking();
  let attempts = 0;
  while (attempts < 10) {
    const exists = await prisma.booking.findUnique({ where: { kodeBooking } });
    if (!exists) break;
    kodeBooking = generateKodeBooking();
    attempts++;
  }

  const booking = await prisma.booking.create({
    data: {
      kodeBooking,
      unitId: data.unitId,
      namaPelanggan: data.namaPelanggan,
      noHp: data.noHp,
      tanggal: new Date(data.tanggal),
      jamMulai: data.jamMulai,
      jamSelesai,
      durasiJam: data.durasiJam,
      totalHarga,
      status: "CONFIRMED",
    },
    include: { unit: true },
  });

  revalidatePath("/");
  return booking;
}

export async function getBookingByKode(kode: string) {
  return prisma.booking.findUnique({
    where: { kodeBooking: kode },
    include: { unit: true },
  });
}
