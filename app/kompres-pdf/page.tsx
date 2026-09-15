"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function KompresPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setError("");
    setCompressedSize(0);

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setOriginalSize(0);
      setError("File harus berupa PDF.");
      return;
    }

    try {
      const bytes = await selectedFile.arrayBuffer();

      const pdf = await PDFDocument.load(bytes);

      if (pdf.getPageCount() === 0) {
        throw new Error("PDF kosong");
      }

      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
    } catch {
      setFile(null);
      setOriginalSize(0);
      setError(
        "PDF tidak dapat dibaca. Pastikan file PDF valid."
      );
    }
  };

  const compressPdf = async () => {
    if (!file) {
      setError("Pilih file PDF terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCompressedSize(0);

      const bytes = await file.arrayBuffer();

      const pdf = await PDFDocument.load(bytes);

      const outputBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const blob = new Blob(
        [new Uint8Array(outputBytes).buffer],
        {
          type: "application/pdf",
        }
      );

      setCompressedSize(blob.size);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "hasil-kompres-pdf.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch {
      setError(
        "Gagal mengompres PDF. Silakan coba file PDF lainnya."
      );
    } finally {
      setLoading(false);
    }
  };

  const compressionPercentage =
    originalSize > 0 && compressedSize > 0
      ? Math.max(
          0,
          Math.round(
            ((originalSize - compressedSize) / originalSize) * 100
          )
        )
      : 0;

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-gray-900">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <a
            href="/"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Kembali ke Urusin
          </a>
        </div>

        <section className="text-center">
          <div className="mb-4 text-5xl">🗜️</div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Kompres PDF Online
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Perkecil ukuran file PDF secara gratis dan proses
            langsung di browser tanpa mengupload file ke server.
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <label
            htmlFor="pdf-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-12 text-center transition hover:border-gray-500 hover:bg-gray-50"
          >
            <div className="text-4xl">📄</div>

            <div className="mt-4 text-lg font-semibold">
              Pilih file PDF
            </div>

            <div className="mt-1 text-sm text-gray-500">
              Klik untuk memilih PDF dari perangkat
            </div>

            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {file && (
            <div className="mt-6">
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="font-semibold break-all">
                  {file.name}
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  Ukuran awal: {formatSize(originalSize)}
                </div>
              </div>

              <button
                type="button"
                onClick={compressPdf}
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-black px-5 py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {loading
                  ? "Mengompres PDF..."
                  : "🗜️ Kompres & Download PDF"}
              </button>

              {compressedSize > 0 && (
                <div className="mt-6 rounded-xl border border-gray-200 p-5">
                  <h2 className="font-semibold">
                    Hasil Kompresi
                  </h2>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="text-sm text-gray-500">
                        Ukuran awal
                      </div>

                      <div className="mt-1 font-semibold">
                        {formatSize(originalSize)}
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="text-sm text-gray-500">
                        Ukuran hasil
                      </div>

                      <div className="mt-1 font-semibold">
                        {formatSize(compressedSize)}
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="text-sm text-gray-500">
                        Pengurangan
                      </div>

                      <div className="mt-1 font-semibold">
                        {compressionPercentage}%
                      </div>
                    </div>
                  </div>

                  {compressedSize >= originalSize && (
                    <p className="mt-4 text-sm text-gray-500">
                      PDF ini sudah cukup optimal sehingga ukuran
                      hasil belum tentu lebih kecil dari file asli.
                    </p>
                  )}

                  {compressedSize < originalSize && (
                    <p className="mt-4 text-sm text-gray-600">
                      PDF berhasil dioptimalkan dan file hasil
                      sudah diunduh ke perangkat kamu.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">
            Kompres PDF Gratis Tanpa Upload
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Kompres PDF Urusin membantu mengoptimalkan ukuran
            file PDF langsung dari browser. Cocok untuk dokumen
            kerja, tugas, laporan, formulir, dan berbagai
            kebutuhan administrasi.
          </p>

          <h2 className="mt-8 text-2xl font-bold">
            Cara Mengecilkan Ukuran PDF
          </h2>

          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-7 text-gray-600">
            <li>
              Pilih file PDF dari perangkat.
            </li>
            <li>
              Tunggu file selesai dibaca.
            </li>
            <li>
              Klik tombol Kompres & Download PDF.
            </li>
            <li>
              File PDF hasil optimasi akan langsung diunduh.
            </li>
          </ol>

          <h2 className="mt-8 text-2xl font-bold">
            Aman dan Diproses di Browser
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            File PDF diproses langsung di browser sehingga tidak
            perlu dikirim ke server untuk proses kompresi.
          </p>

          <h2 className="mt-8 text-2xl font-bold">
            Pertanyaan yang Sering Ditanyakan
          </h2>

          <div className="mt-4 space-y-5">
            <div>
              <h3 className="font-semibold">
                Apakah Kompres PDF di Urusin gratis?
              </h3>

              <p className="mt-1 text-gray-600">
                Ya. Tool Kompres PDF dapat digunakan secara gratis.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Apakah PDF saya diupload ke server?
              </h3>

              <p className="mt-1 text-gray-600">
                Tidak. Proses dilakukan langsung di browser.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Apakah semua PDF pasti menjadi lebih kecil?
              </h3>

              <p className="mt-1 text-gray-600">
                Tidak selalu. PDF yang sudah teroptimasi
                sebelumnya bisa memiliki ukuran yang sama atau
                bahkan sedikit lebih besar setelah diproses.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}