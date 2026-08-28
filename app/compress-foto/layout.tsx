
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress Foto Online Gratis",

  description:
    "Kompres foto secara online dan gratis dengan Urusin. Kurangi ukuran file JPG atau PNG dengan mudah untuk lamaran kerja, formulir, dokumen, dan kebutuhan online.",

  keywords: [
    "compress foto",
    "compress foto online",
    "compress foto gratis",
    "kompres foto",
    "kompres foto online",
    "kompres foto gratis",
    "perkecil ukuran foto",
    "perkecil ukuran file foto",
    "compress JPG",
    "compress PNG",
    "kompres JPG",
    "kompres PNG",
  ],

  alternates: {
    canonical: "/compress-foto",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://urusin.id/compress-foto",
    siteName: "Urusin",
    title: "Compress Foto Online Gratis | Urusin",
    description:
      "Kompres dan perkecil ukuran file foto dengan mudah. Proses langsung di perangkat tanpa perlu mengunggah foto ke server.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Compress Foto Online Gratis | Urusin",
    description:
      "Perkecil ukuran file JPG atau PNG dengan mudah dan cepat.",
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

export default function CompressFotoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

