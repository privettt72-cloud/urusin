
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Surat Lamaran Kerja Gratis",

  description:
    "Buat surat lamaran kerja profesional secara gratis dengan Urusin. Gunakan data CV untuk membuat surat lamaran yang rapi, personal, dan siap dicetak atau disimpan sebagai PDF.",

  keywords: [
    "surat lamaran kerja",
    "surat lamaran kerja gratis",
    "buat surat lamaran",
    "surat lamaran online",
    "contoh surat lamaran kerja",
    "surat lamaran profesional",
    "surat lamaran PDF",
    "lamaran kerja",
    "buat lamaran kerja",
  ],

  alternates: {
    canonical: "/surat-lamaran",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://www.urusin.biz.id/surat-lamaran",
    siteName: "Urusin",
    title: "Surat Lamaran Kerja Gratis | Urusin",
    description:
      "Buat surat lamaran kerja profesional berdasarkan data CV kamu. Rapi, mudah diedit, dan siap dicetak atau disimpan sebagai PDF.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Surat Lamaran Kerja Gratis | Urusin",
    description:
      "Buat surat lamaran kerja profesional dengan mudah berdasarkan data CV kamu.",
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

export default function SuratLamaranLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

