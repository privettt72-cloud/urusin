
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalkulator Cicilan Online",

  description:
    "Hitung estimasi cicilan per bulan, total bunga, total cicilan, dan total pembayaran berdasarkan harga barang, DP, tenor, dan bunga dengan kalkulator cicilan Urusin.",

  keywords: [
    "kalkulator cicilan",
    "kalkulator cicilan online",
    "hitung cicilan",
    "hitung cicilan per bulan",
    "kalkulator kredit",
    "kalkulator pinjaman",
    "kalkulator cicilan kredit",
    "kalkulator bunga flat",
    "hitung bunga cicilan",
    "hitung cicilan per bulan",
    "kalkulator DP",
    "kalkulator tenor",
  ],

  alternates: {
    canonical: "/kalkulator-cicilan",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://urusin.id/kalkulator-cicilan",
    siteName: "Urusin",
    title: "Kalkulator Cicilan Online | Urusin",
    description:
      "Hitung estimasi cicilan per bulan, total bunga, dan total pembayaran berdasarkan harga, DP, tenor, dan bunga.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kalkulator Cicilan Online | Urusin",
    description:
      "Hitung estimasi cicilan per bulan dan total pembayaran dengan mudah.",
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

export default function KalkulatorCicilanLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

