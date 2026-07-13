"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getAllUnits() {
  return prisma.unit.findMany({
    orderBy: [{ tipe: "desc" }, { nama: "asc" }],
  });
}

export async function createUnit(data: {
  nama: string;
  tipe: "PS4" | "PS5";
  hargaPerJam: number;
  deskripsi?: string;
}) {
  const unit = await prisma.unit.create({ data });
  revalidatePath("/admin/units");
  revalidatePath("/");
  return unit;
}

export async function updateUnit(
  id: string,
  data: {
    nama?: string;
    tipe?: "PS4" | "PS5";
    hargaPerJam?: number;
    deskripsi?: string;
  }
) {
  const unit = await prisma.unit.update({ where: { id }, data });
  revalidatePath("/admin/units");
  revalidatePath("/");
  return unit;
}

export async function toggleUnitStatus(id: string) {
  const unit = await prisma.unit.findUnique({ where: { id } });
  if (!unit) throw new Error("Unit tidak ditemukan");

  const updated = await prisma.unit.update({
    where: { id },
    data: { status: unit.status === "AKTIF" ? "NONAKTIF" : "AKTIF" },
  });
  revalidatePath("/admin/units");
  revalidatePath("/");
  return updated;
}
