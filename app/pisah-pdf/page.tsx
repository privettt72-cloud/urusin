"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PisahPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setError("");
    setSelectedPages([]);

    if (selectedFile.type !== "application/pdf") {
      setError("File harus berupa PDF.");
      return;
    }

    try {
      const bytes = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      setFile(selectedFile);
      setPageCount(pdf.getPageCount());
    } catch {
      setFile(null);
      setPageCount(0);
      setError("PDF tidak dapat dibaca. Pastikan file PDF valid.");
    }
  };

  const togglePage = (pageNumber: number) => {
    setSelectedPages((current) =>
      current.includes(pageNumber)
        ? current.filter((page) => page !== pageNumber)
        : [...current, pageNumber].sort((a, b) => a - b)
    );
  };

  const selectAllPages = () => {
    setSelectedPages(
      Array.from({ length: pageCount }, (_, index) => index + 1)
    );
  };

  const clearPages = () => {
    setSelectedPages([]);
  };

  const splitPdf = async () => {
    if (!file || selectedPages.length === 0) {
      setError("Pilih minimal satu halaman terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const bytes = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(bytes);
      const newPdf = await PDFDocument.create();

      const pageIndexes = selectedPages.map((page) => page - 1);

      const copiedPages = await newPdf.copyPages(
        sourcePdf,
        pageIndexes
      );

      copiedPages.forEach((page) => {
        newPdf.addPage(page);
      });

      const outputBytes = await newPdf.save();

      const blob = new Blob(
        [new Uint8Array(outputBytes).buffer],
        {
          type: "application/pdf",
        }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "hasil-pisah-pdf.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch {
      setError("Gagal membuat PDF baru. Silakan coba lagi.");
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
          <div className="mb-4 text-5xl">✂️</div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pisah PDF Online
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Pilih halaman tertentu dari file PDF dan buat PDF baru
            secara gratis. Semua proses dilakukan langsung di browser.
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

          {file && pageCount > 0 && (
            <div className="mt-6">
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="font-semibold">
                  {file.name}
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  {pageCount} halaman
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">
                    Pilih halaman
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {selectedPages.length} halaman dipilih
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllPages}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    Pilih Semua
                  </button>

                  <button
                    type="button"
                    onClick={clearPages}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    Hapus Pilihan
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                {Array.from(
                  { length: pageCount },
                  (_, index) => index + 1
                ).map((pageNumber) => {
                  const selected =
                    selectedPages.includes(pageNumber);

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => togglePage(pageNumber)}
                      className={`rounded-xl border-2 px-4 py-6 text-center transition ${
                        selected
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 bg-white hover:border-gray-400"
                      }`}
                    >
                      <div className="text-2xl">
                        📄
                      </div>

                      <div className="mt-2 text-sm font-semibold">
                        Halaman {pageNumber}
                      </div>

                      {selected && (
                        <div className="mt-1 text-xs">
                          ✓ Dipilih
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={splitPdf}
                disabled={
                  loading || selectedPages.length === 0
                }
                className="mt-7 w-full rounded-xl bg-black px-5 py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {loading
                  ? "Membuat PDF..."
                  : "✂️ Pisahkan & Download PDF"}
              </button>
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">
            Pisah PDF Gratis Tanpa Upload
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Dengan Pisah PDF Urusin, kamu dapat memilih halaman
            tertentu dari dokumen PDF dan membuat file PDF baru.
            Cocok untuk mengambil beberapa halaman dari dokumen,
            laporan, tugas, atau berkas administrasi.
          </p>

          <h2 className="mt-8 text-2xl font-bold">
            Cara Memisahkan PDF
          </h2>

          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-7 text-gray-600">
            <li>
              Pilih file PDF dari perangkat.
            </li>
            <li>
              Pilih halaman yang ingin dipisahkan.
            </li>
            <li>
              Klik tombol Pisahkan & Download PDF.
            </li>
            <li>
              PDF baru akan langsung diunduh.
            </li>
          </ol>

          <h2 className="mt-8 text-2xl font-bold">
            Aman dan Diproses di Browser
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Proses pemisahan PDF dilakukan langsung di browser
            menggunakan perangkat kamu. File PDF tidak perlu
            dikirim ke server untuk diproses.
          </p>

          <h2 className="mt-8 text-2xl font-bold">
            Pertanyaan yang Sering Ditanyakan
          </h2>

          <div className="mt-4 space-y-5">
            <div>
              <h3 className="font-semibold">
                Apakah Pisah PDF di Urusin gratis?
              </h3>

              <p className="mt-1 text-gray-600">
                Ya. Tool ini dapat digunakan secara gratis.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Apakah bisa memilih beberapa halaman?
              </h3>

              <p className="mt-1 text-gray-600">
                Bisa. Kamu dapat memilih satu atau beberapa
                halaman sekaligus.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Apakah file PDF saya diupload?
              </h3>

              <p className="mt-1 text-gray-600">
                Tidak. Proses dilakukan langsung di browser.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}