
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalkulator Diskon Online",

  description:
    "Hitung harga setelah diskon, jumlah penghematan, dan harga akhir setelah pajak dengan kalkulator diskon Urusin. Cocok untuk menghitung harga promo dan belanja sehari-hari.",

  keywords: [
    "kalkulator diskon",
    "kalkulator diskon online",
    "hitung diskon",
    "cara menghitung diskon",
    "harga setelah diskon",
    "hitung harga diskon",
    "persentase diskon",
    "kalkulator promo",
    "kalkulator diskon pajak",
    "hitung harga setelah diskon dan pajak",
  ],

  alternates: {
    canonical: "/kalkulator-diskon",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://urusin.id/kalkulator-diskon",
    siteName: "Urusin",
    title: "Kalkulator Diskon Online | Urusin",
    description:
      "Hitung harga setelah diskon, jumlah penghematan, dan harga akhir setelah pajak dengan mudah.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kalkulator Diskon Online | Urusin",
    description:
      "Hitung diskon, harga setelah diskon, penghematan, dan pajak dengan mudah.",
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

export default function KalkulatorDiskonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

