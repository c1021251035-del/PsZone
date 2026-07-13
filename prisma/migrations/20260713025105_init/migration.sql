-- CreateEnum
CREATE TYPE "TipeUnit" AS ENUM ('PS4', 'PS5');

-- CreateEnum
CREATE TYPE "StatusUnit" AS ENUM ('AKTIF', 'NONAKTIF');

-- CreateEnum
CREATE TYPE "StatusBooking" AS ENUM ('CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tipe" "TipeUnit" NOT NULL,
    "hargaPerJam" INTEGER NOT NULL,
    "deskripsi" TEXT,
    "status" "StatusUnit" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "kodeBooking" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "namaPelanggan" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "jamMulai" TEXT NOT NULL,
    "jamSelesai" TEXT NOT NULL,
    "durasiJam" INTEGER NOT NULL,
    "totalHarga" INTEGER NOT NULL,
    "status" "StatusBooking" NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookings_kodeBooking_key" ON "bookings"("kodeBooking");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
