import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foto ke Teks Online Gratis (OCR)",

  description:
    "Ubah foto menjadi teks secara online dan gratis dengan OCR. Ambil teks dari gambar, salin hasilnya, edit, atau download sebagai TXT.",

  keywords: [
    "foto ke teks",
    "foto ke teks online",
    "ubah foto menjadi teks",
    "gambar ke teks",
    "gambar ke teks online",
    "ocr online",
    "ocr indonesia",
    "scan foto ke teks",
    "ambil teks dari foto",
    "convert foto ke teks",
    "image to text",
    "image to text online",
  ],

  alternates: {
    canonical: "/foto-ke-teks",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://www.urusin.biz.id/foto-ke-teks",
    siteName: "Urusin",
    title: "Foto ke Teks Online Gratis | Urusin",
    description:
      "Ambil teks dari foto atau gambar menggunakan OCR secara gratis dan langsung dari browser.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Foto ke Teks Online Gratis | Urusin",
    description:
      "Ubah foto menjadi teks menggunakan OCR secara gratis langsung dari browser.",
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

export default function FotoKeTeksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}