
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat CV ATS Gratis",

  description:
    "Buat CV ATS profesional secara gratis dengan Urusin. Isi data diri, pendidikan, pengalaman kerja, dan keahlian. Lihat preview CV A4 secara langsung dan siapkan CV untuk melamar kerja.",

  keywords: [
    "buat CV ATS",
    "CV ATS gratis",
    "buat CV gratis",
    "CV profesional",
    "CV online",
    "template CV ATS",
    "contoh CV ATS",
    "buat CV lamaran kerja",
    "CV lamaran kerja",
    "CV ATS online",
  ],

  alternates: {
    canonical:  "https://www.urusin.biz.id/cv",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://www.urusin.biz.id/cv", 
    siteName: "Urusin",
    title: "Buat CV ATS Gratis | Urusin",
    description:
      "Buat CV ATS profesional secara gratis dengan Urusin. Lengkapi data diri, pendidikan, pengalaman kerja, dan keahlian dengan mudah.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Buat CV ATS Gratis | Urusin",
    description:
      "Buat CV ATS profesional secara gratis dengan Urusin.",
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

export default function CVLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

