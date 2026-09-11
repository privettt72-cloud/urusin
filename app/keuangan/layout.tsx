
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catat Keuangan Pribadi Online Gratis",
  description:
    "Catat pemasukan dan pengeluaran dengan mudah menggunakan pencatat keuangan online gratis dari Urusin. Pantau saldo dan transaksi harian tanpa login.",
  keywords: [
    "catat keuangan",
    "catatan keuangan",
    "pencatat keuangan",
    "catat pemasukan dan pengeluaran",
    "aplikasi catatan keuangan",
    "pencatat keuangan pribadi",
    "keuangan pribadi",
    "mengatur keuangan",
    "catat pengeluaran harian",
  ],
  alternates: {
    canonical: "https://www.urusin.biz.id/keuangan",
  },
  openGraph: {
    title: "Catat Keuangan Pribadi Online Gratis | Urusin",
    description:
      "Catat pemasukan dan pengeluaran, pantau saldo, dan kelola transaksi harian dengan mudah. Gratis tanpa login.",
    url: "https://www.urusin.biz.id/keuangan",
    siteName: "Urusin",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function KeuanganLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
