import { z } from "zod";

export const bookingSchema = z.object({
  unitId: z.string().min(1, "Pilih unit PS terlebih dahulu"),
  tanggal: z.string().min(1, "Pilih tanggal terlebih dahulu"),
  jamMulai: z.string().min(1, "Pilih slot jam terlebih dahulu"),
  durasiJam: z
    .number()
    .min(1, "Durasi minimal 1 jam")
    .max(4, "Durasi maksimal 4 jam"),
  namaPelanggan: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama terlalu panjang"),
  noHp: z
    .string()
    .regex(
      /^(\+62|62|0)[0-9]{8,12}$/,
      "Format nomor HP tidak valid (contoh: 08123456789)"
    ),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const unitSchema = z.object({
  nama: z.string().min(1, "Nama unit wajib diisi").max(50, "Nama terlalu panjang"),
  tipe: z.enum(["PS4", "PS5"], { error: "Pilih tipe unit" }),
  hargaPerJam: z
    .number()
    .min(1000, "Harga minimal Rp 1.000")
    .max(1000000, "Harga terlalu besar"),
  deskripsi: z.string().max(200, "Deskripsi terlalu panjang").optional(),
});

export type UnitInput = z.infer<typeof unitSchema>;

export const settingSchema = z.object({
  jamBuka: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format jam tidak valid"),
  jamTutup: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format jam tidak valid"),
});

export const passwordSchema = z
  .object({
    passwordLama: z.string().min(1, "Password lama wajib diisi"),
    passwordBaru: z.string().min(6, "Password baru minimal 6 karakter"),
    konfirmasiPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.passwordBaru === data.konfirmasiPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["konfirmasiPassword"],
  });
