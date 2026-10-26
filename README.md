This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Login admin

Buat file `.env.local` di folder proyek, lalu isi variabel berikut. Gunakan kata sandi dan rahasia acak milik Anda sendiri; jangan commit file `.env.local`.

```env
ADMIN_EMAIL=alamat-email-admin
ADMIN_PASSWORD=kata-sandi-kuat
AUTH_SECRET=rahasia-acak-minimal-32-karakter
```

Buka `/login` untuk masuk. Sesi admin berlaku selama 8 jam. Database tetap menggunakan `DATABASE_URL` dan `DIRECT_URL` yang sudah ada di `.env`.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Pengiriman pengingat WhatsApp via Fonnte

Isi `FONNTE_TOKEN` di `.env.local` untuk lokal, lalu tambahkan variabel yang sama di Vercel (Production/Preview sesuai kebutuhan). Token tersedia dari dashboard Fonnte dan tidak boleh dimasukkan ke source code atau dibagikan. Hubungkan perangkat WhatsApp di Fonnte terlebih dahulu. Tombol **Kirim pesan** mengirimkan pengingat ke antrean Fonnte dari server; notifikasi berhasil berarti Fonnte menerima antrean, bukan konfirmasi bahwa penerima telah membaca pesan.
