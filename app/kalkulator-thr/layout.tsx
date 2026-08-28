
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalkulator THR Online",

  description:
    "Hitung estimasi Tunjangan Hari Raya (THR) berdasarkan gaji, tunjangan tetap, dan masa kerja dengan kalkulator THR Urusin. Perhitungan tersedia untuk masa kerja kurang dari 12 bulan maupun 12 bulan atau lebih.",

  keywords: [
    "kalkulator THR",
    "kalkulator THR online",
    "hitung THR",
    "cara menghitung THR",
    "perhitungan THR",
    "THR karyawan",
    "THR proporsional",
    "hitung THR berdasarkan masa kerja",
    "kalkulator tunjangan hari raya",
    "tunjangan hari raya",
  ],

  alternates: {
    canonical: "/kalkulator-thr",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://urusin.id/kalkulator-thr",
    siteName: "Urusin",
    title: "Kalkulator THR Online | Urusin",
    description:
      "Hitung estimasi THR berdasarkan gaji, tunjangan tetap, dan masa kerja dengan mudah.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kalkulator THR Online | Urusin",
    description:
      "Hitung estimasi Tunjangan Hari Raya berdasarkan penghasilan dan masa kerja.",
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

export default function KalkulatorThrLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

