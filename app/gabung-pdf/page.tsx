"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

type PdfFile = {
  id: string;
  file: File;
};

export default function GabungPdfPage() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) return;

    setError("");

    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (validFiles.length !== selectedFiles.length) {
      setError("Semua file harus berupa PDF.");
    }

    const newFiles: PdfFile[] = validFiles.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      file,
    }));

    setFiles((current) => [...current, ...newFiles]);

    event.target.value = "";
  };

  const removeFile = (id: string) => {
    setFiles((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;

    setFiles((current) => {
      const updated = [...current];
      [updated[index - 1], updated[index]] = [
        updated[index],
        updated[index - 1],
      ];
      return updated;
    });
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;

    setFiles((current) => {
      const updated = [...current];
      [updated[index], updated[index + 1]] = [
        updated[index + 1],
        updated[index],
      ];
      return updated;
    });
  };

  const mergePdf = async () => {
    if (files.length < 2) {
      setError("Pilih minimal 2 file PDF untuk digabungkan.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const bytes = await item.file.arrayBuffer();

        const sourcePdf = await PDFDocument.load(bytes);

        const pages = await mergedPdf.copyPages(
          sourcePdf,
          sourcePdf.getPageIndices()
        );

        pages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      const outputBytes = await mergedPdf.save();

      const blob = new Blob(
        [new Uint8Array(outputBytes).buffer],
        {
          type: "application/pdf",
        }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "hasil-gabung-pdf.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch {
      setError(
        "Gagal menggabungkan PDF. Pastikan semua file PDF valid."
      );
    } finally {
      setLoading(false);
    }
  };

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
          <div className="mb-4 text-5xl">🔗</div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Gabung PDF Online
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Gabungkan beberapa file PDF menjadi satu dokumen
            secara gratis. Atur urutan file sebelum digabungkan.
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
              Kamu dapat memilih beberapa PDF sekaligus
            </div>

            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf,.pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">
                    File PDF
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {files.length} file dipilih
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {files.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">
                        {item.file.name}
                      </div>

                      <div className="mt-1 text-xs text-gray-500">
                        {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Pindah ke atas"
                      >
                        ↑
                      </button>

                      <button
                        type="button"
                        onClick={() => moveDown(index)}
                        disabled={index === files.length - 1}
                        className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Pindah ke bawah"
                      >
                        ↓
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFile(item.id)}
                        className="rounded-lg border border-red-200 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50"
                        aria-label="Hapus file"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={mergePdf}
                disabled={loading || files.length < 2}
                className="mt-6 w-full rounded-xl bg-black px-5 py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {loading
                  ? "Menggabungkan PDF..."
                  : "🔗 Gabungkan & Download PDF"}
              </button>

              {files.length < 2 && (
                <p className="mt-3 text-center text-sm text-gray-500">
                  Pilih minimal 2 file PDF untuk melanjutkan.
                </p>
              )}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">
            Gabung PDF Gratis Tanpa Upload
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Dengan Gabung PDF Urusin, kamu dapat menggabungkan
            beberapa dokumen PDF menjadi satu file. Kamu juga
            dapat mengatur urutan dokumen sebelum proses
            penggabungan.
          </p>

          <h2 className="mt-8 text-2xl font-bold">
            Cara Menggabungkan PDF
          </h2>

          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-7 text-gray-600">
            <li>
              Pilih dua atau lebih file PDF.
            </li>
            <li>
              Atur urutan file menggunakan tombol ↑ dan ↓.
            </li>
            <li>
              Hapus file yang tidak diperlukan jika ada.
            </li>
            <li>
              Klik Gabungkan & Download PDF.
            </li>
          </ol>

          <h2 className="mt-8 text-2xl font-bold">
            Aman dan Diproses di Browser
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Proses penggabungan PDF dilakukan langsung di browser.
            File tidak perlu dikirim ke server.
          </p>

          <h2 className="mt-8 text-2xl font-bold">
            Pertanyaan yang Sering Ditanyakan
          </h2>

          <div className="mt-4 space-y-5">
            <div>
              <h3 className="font-semibold">
                Apakah Gabung PDF di Urusin gratis?
              </h3>

              <p className="mt-1 text-gray-600">
                Ya. Tool ini dapat digunakan secara gratis.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Berapa file PDF yang bisa digabungkan?
              </h3>

              <p className="mt-1 text-gray-600">
                Kamu dapat memilih beberapa file PDF sekaligus.
                Jumlah yang dapat diproses bergantung pada
                kemampuan perangkat dan ukuran file.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Apakah urutan halaman bisa diatur?
              </h3>

              <p className="mt-1 text-gray-600">
                Bisa. Urutan file dapat diubah sebelum PDF
                digabungkan.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}