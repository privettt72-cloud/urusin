import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scan Dokumen Online Gratis",
  description:
    "Scan dokumen dari foto secara online gratis. Deteksi dokumen otomatis, luruskan perspektif, dan download hasil scan langsung dari browser.",
  keywords: [
    "scan dokumen",
    "scan dokumen online",
    "scan foto jadi dokumen",
    "scanner online",
    "scan kertas",
    "scan dokumen gratis",
  ],
  alternates: {
    canonical: "https://www.urusin.biz.id/scan-dokumen",
  },
  openGraph: {
    title: "Scan Dokumen Online Gratis | Urusin",
    description:
      "Ubah foto dokumen menjadi hasil scan yang lebih rapi langsung dari browser.",
    url: "https://www.urusin.biz.id/scan-dokumen",
    siteName: "Urusin",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ScanDokumenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}