
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat CV ATS Gratis Online untuk Lamaran Kerja | Urusin",

  description:
    "Buat CV ATS gratis online untuk lamaran kerja. Isi data diri, pendidikan, pengalaman, dan keahlian dengan mudah, lalu siapkan CV profesional dalam format A4 dan PDF.",

  keywords: [
    "buat CV ATS",
    "CV ATS gratis",
    "buat CV gratis",
    "CV ATS online",
    "buat CV online",
    "CV lamaran kerja",
    "CV profesional",
    "template CV ATS",
  ],

  alternates: {
    canonical: "https://www.urusin.biz.id/cv",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://www.urusin.biz.id/cv",
    siteName: "Urusin",
    title: "Buat CV ATS Gratis Online untuk Lamaran Kerja | Urusin",
    description:
      "Buat CV ATS gratis online untuk lamaran kerja. Isi data diri, pendidikan, pengalaman, dan keahlian, lalu siapkan CV profesional dalam format PDF.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Buat CV ATS Gratis Online | Urusin",
    description:
      "Buat CV ATS profesional secara gratis untuk kebutuhan lamaran kerja.",
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

