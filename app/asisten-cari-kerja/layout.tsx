import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cari Lowongan Kerja Online",
  description:
    "Cari lowongan kerja berdasarkan posisi dan kota. Temukan pekerjaan terbaru dan lanjutkan ke sumber lowongan.",
  keywords: [
    "lowongan kerja",
    "cari kerja",
    "cari lowongan kerja",
    "lowongan kerja terbaru",
    "loker",
    "loker Indonesia",
    "lowongan kerja Makassar",
  ],
  alternates: {
    canonical:
      "https://www.urusin.biz.id/asisten-cari-kerja",
  },
  openGraph: {
    title: "Cari Lowongan Kerja Online | Urusin",
    description:
      "Cari lowongan kerja berdasarkan posisi dan kota dengan Asisten Cari Kerja Urusin.",
    url: "https://www.urusin.biz.id/asisten-cari-kerja",
    siteName: "Urusin",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AsistenCariKerjaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}