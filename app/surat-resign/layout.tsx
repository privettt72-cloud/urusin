
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Surat Resign Profesional Gratis",

  description:
    "Buat surat resign atau surat pengunduran diri yang profesional secara gratis dengan Urusin. Isi data perusahaan, jabatan, tanggal resign, dan alasan pengunduran diri, lalu cetak atau simpan sebagai PDF.",

  keywords: [
    "surat resign",
    "surat resign kerja",
    "surat pengunduran diri",
    "surat pengunduran diri kerja",
    "surat resign profesional",
    "surat resign gratis",
    "buat surat resign",
    "contoh surat resign",
    "surat resign PDF",
    "surat pengunduran diri PDF",
  ],

  alternates: {
    canonical: "/surat-resign",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://urusin.id/surat-resign",
    siteName: "Urusin",
    title: "Surat Resign Profesional Gratis | Urusin",
    description:
      "Buat surat pengunduran diri yang rapi dan profesional dengan mudah. Lengkapi data perusahaan, jabatan, tanggal resign, dan alasan pengunduran diri.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Surat Resign Profesional Gratis | Urusin",
    description:
      "Buat surat resign profesional dengan mudah dan siap dicetak.",
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

export default function SuratResignLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

