-- CreateEnum
CREATE TYPE "StatusKamar" AS ENUM ('TERISI', 'KOSONG');

-- CreateEnum
CREATE TYPE "StatusPenghuni" AS ENUM ('AKTIF', 'NONAKTIF');

-- CreateEnum
CREATE TYPE "StatusPembayaran" AS ENUM ('LUNAS', 'MENUNGGAK', 'BELUM_BAYAR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kamar" (
    "id" TEXT NOT NULL,
    "nomorKamar" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "status" "StatusKamar" NOT NULL DEFAULT 'KOSONG',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kamar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penghuni" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "tanggalMasuk" TIMESTAMP(3) NOT NULL,
    "tanggalKeluar" TIMESTAMP(3),
    "status" "StatusPenghuni" NOT NULL DEFAULT 'AKTIF',
    "kamarId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Penghuni_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pembayaran" (
    "id" TEXT NOT NULL,
    "penghuniId" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "tanggalBayar" TIMESTAMP(3),
    "jatuhTempo" TIMESTAMP(3) NOT NULL,
    "status" "StatusPembayaran" NOT NULL DEFAULT 'BELUM_BAYAR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Kamar_nomorKamar_key" ON "Kamar"("nomorKamar");

-- AddForeignKey
ALTER TABLE "Penghuni" ADD CONSTRAINT "Penghuni_kamarId_fkey" FOREIGN KEY ("kamarId") REFERENCES "Kamar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pembayaran" ADD CONSTRAINT "Pembayaran_penghuniId_fkey" FOREIGN KEY ("penghuniId") REFERENCES "Penghuni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
