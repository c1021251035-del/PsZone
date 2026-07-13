"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const settings = await prisma.setting.findMany();
  const map: Record<string, string> = {};
  settings.forEach((s: { key: string; value: string }) => (map[s.key] = s.value));
  return {
    jamBuka: map.jamBuka ?? "10:00",
    jamTutup: map.jamTutup ?? "23:00",
  };
}

export async function updateSettings(data: {
  jamBuka: string;
  jamTutup: string;
}) {
  await Promise.all([
    prisma.setting.upsert({
      where: { key: "jamBuka" },
      update: { value: data.jamBuka },
      create: { key: "jamBuka", value: data.jamBuka },
    }),
    prisma.setting.upsert({
      where: { key: "jamTutup" },
      update: { value: data.jamTutup },
      create: { key: "jamTutup", value: data.jamTutup },
    }),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function getAllBookings(filters?: {
  tanggalDari?: string;
  tanggalSampai?: string;
  unitId?: string;
  status?: string;
}) {
  const where: Record<string, unknown> = {};

  if (filters?.status && filters.status !== "SEMUA") {
    where.status = filters.status;
  }
  if (filters?.unitId && filters.unitId !== "SEMUA") {
    where.unitId = filters.unitId;
  }
  if (filters?.tanggalDari || filters?.tanggalSampai) {
    where.tanggal = {
      ...(filters.tanggalDari && { gte: new Date(filters.tanggalDari) }),
      ...(filters.tanggalSampai && { lte: new Date(filters.tanggalSampai) }),
    };
  }

  return prisma.booking.findMany({
    where,
    include: { unit: true },
    orderBy: { tanggal: "desc" },
  });
}

export async function getAllUnits() {
  return prisma.unit.findMany({
    orderBy: { nama: "asc" },
  });
}

export async function cancelBooking(id: string) {
  const booking = await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  return booking;
}

export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [totalBookingHariIni, unitAktif, bookingHariIni, settings] =
    await Promise.all([
      prisma.booking.count({
        where: {
          tanggal: { gte: today, lt: tomorrow },
          status: "CONFIRMED",
        },
      }),
      prisma.unit.count({ where: { status: "AKTIF" } }),
      prisma.booking.findMany({
        where: {
          tanggal: { gte: today, lt: tomorrow },
          status: "CONFIRMED",
        },
        include: { unit: true },
        orderBy: { jamMulai: "asc" },
      }),
      prisma.setting.findMany({
        where: { key: { in: ["jamBuka", "jamTutup"] } },
      }),
    ]);

  const settingMap: Record<string, string> = {};
  settings.forEach((s: { key: string; value: string }) => (settingMap[s.key] = s.value));
  const jamBuka = parseInt(settingMap.jamBuka?.split(":")[0] ?? "10");
  const jamTutup = parseInt(settingMap.jamTutup?.split(":")[0] ?? "23");
  const totalJamPerUnit = jamTutup - jamBuka;

  const slotTerisi = bookingHariIni.reduce((sum: number, b: { durasiJam: number }) => sum + b.durasiJam, 0);
  const slotKosong = Math.max(
    0,
    totalJamPerUnit * unitAktif - slotTerisi
  );

  return {
    totalBookingHariIni,
    unitAktif,
    slotTerisi,
    slotKosong,
    bookingHariIni,
  };
}
