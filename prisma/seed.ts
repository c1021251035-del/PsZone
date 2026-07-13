import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed admin
  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", passwordHash },
  });
  console.log("Admin created: admin / admin123");

  // Seed settings
  await Promise.all([
    prisma.setting.upsert({
      where: { key: "jamBuka" },
      update: {},
      create: { key: "jamBuka", value: "10:00" },
    }),
    prisma.setting.upsert({
      where: { key: "jamTutup" },
      update: {},
      create: { key: "jamTutup", value: "23:00" },
    }),
  ]);
  console.log("Settings seeded: jamBuka=10:00, jamTutup=23:00");

  // Seed units
  const units = [
    { nama: "PS5 #1", tipe: "PS5" as const, hargaPerJam: 15000, deskripsi: "TV 65 inch OLED, 2 controller DualSense" },
    { nama: "PS5 #2", tipe: "PS5" as const, hargaPerJam: 15000, deskripsi: "TV 55 inch 4K, 2 controller DualSense" },
    { nama: "PS4 #1", tipe: "PS4" as const, hargaPerJam: 10000, deskripsi: "TV 43 inch Full HD, 2 controller DS4" },
    { nama: "PS4 #2", tipe: "PS4" as const, hargaPerJam: 10000, deskripsi: "TV 43 inch Full HD, 2 controller DS4" },
  ];

  for (const unit of units) {
    await prisma.unit.upsert({
      where: { id: unit.nama },
      update: {},
      create: unit,
    }).catch(async () => {
      // Jika upsert by id gagal, cek by nama
      const existing = await prisma.unit.findFirst({ where: { nama: unit.nama } });
      if (!existing) {
        await prisma.unit.create({ data: unit });
      }
    });
  }
  console.log("Units seeded: 2x PS5, 2x PS4");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
