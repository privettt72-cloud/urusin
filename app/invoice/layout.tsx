
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Invoice Online Gratis",
  description:
    "Buat invoice online gratis untuk bisnis, freelance, jasa, dan UMKM. Isi data pelanggan, barang atau jasa, diskon, dan pajak, lalu simpan sebagai PDF tanpa login.",
  keywords: [
    "buat invoice online",
    "invoice online gratis",
    "buat invoice gratis",
    "template invoice",
    "invoice UMKM",
    "invoice freelance",
    "invoice bisnis",
    "invoice jasa",
  ],
  alternates: {
    canonical: "https://www.urusin.biz.id/invoice",
  },
  openGraph: {
    title: "Buat Invoice Online Gratis | Urusin",
    description:
      "Buat invoice profesional untuk bisnis, freelance, jasa, dan UMKM. Gratis tanpa login dan bisa disimpan sebagai PDF.",
    url: "https://www.urusin.biz.id/invoice",
    siteName: "Urusin",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function InvoiceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

