import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foto ke PDF Online Gratis",
  description:
    "Gabungkan foto JPG, JPEG, dan PNG menjadi satu PDF secara online gratis. Atur urutan foto dan buat PDF langsung dari browser tanpa login.",
  keywords: [
    "foto ke pdf",
    "jpg ke pdf",
    "png ke pdf",
    "ubah foto ke pdf",
    "gabungkan foto jadi pdf",
    "gambar ke pdf",
    "buat pdf dari foto",
  ],
  alternates: {
    canonical: "https://www.urusin.biz.id/foto-ke-pdf",
  },
  openGraph: {
    title: "Foto ke PDF Online Gratis | Urusin",
    description:
      "Gabungkan beberapa foto menjadi satu file PDF secara gratis tanpa login.",
    url: "https://www.urusin.biz.id/foto-ke-pdf",
    siteName: "Urusin",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FotoKePdfLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}