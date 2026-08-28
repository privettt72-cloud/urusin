
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalkulator Gaji Bersih Online",

  description:
    "Hitung estimasi gaji bersih dan pendapatan kotor dengan kalkulator gaji Urusin. Masukkan gaji pokok, tunjangan, lembur, bonus, dan potongan untuk melihat hasil perhitungan.",

  keywords: [
    "kalkulator gaji",
    "kalkulator gaji bersih",
    "kalkulator gaji online",
    "hitung gaji bersih",
    "hitung gaji",
    "kalkulator gaji karyawan",
    "kalkulator penghasilan",
    "hitung gaji setelah potongan",
    "gaji bersih",
    "gaji kotor",
  ],

  alternates: {
    canonical: "/kalkulator-gaji",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://urusin.id/kalkulator-gaji",
    siteName: "Urusin",
    title: "Kalkulator Gaji Bersih Online | Urusin",
    description:
      "Hitung estimasi gaji bersih berdasarkan gaji pokok, tunjangan, lembur, bonus, dan potongan dengan mudah.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kalkulator Gaji Bersih Online | Urusin",
    description:
      "Hitung gaji bersih dan pendapatan kotor dengan mudah menggunakan kalkulator gaji Urusin.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function KalkulatorGajiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

