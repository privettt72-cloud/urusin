
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convert Foto JPG, PNG, WebP Online Gratis",
  description:
    "Convert foto JPG, PNG, dan WebP secara online gratis. Ubah format foto langsung di browser tanpa upload ke server.",
  keywords: [
    "convert foto",
    "convert foto online",
    "convert JPG ke PNG",
    "convert PNG ke JPG",
    "convert JPG ke WebP",
    "convert WebP ke JPG",
    "ubah format foto",
    "konversi foto",
    "convert gambar",
  ],
  alternates: {
    canonical: "/convert-foto",
  },
  openGraph: {
    title: "Convert Foto JPG, PNG, WebP Online Gratis",
    description:
      "Ubah foto JPG, PNG, dan WebP ke format yang kamu butuhkan secara gratis langsung dari browser.",
    url: "https://www.urusin.biz.id/convert-foto",
    siteName: "Urusin",
    type: "website",
    locale: "id_ID",
  },
};

export default function ConvertFotoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

