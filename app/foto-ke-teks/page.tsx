"use client";

import { useState } from "react";
import { createWorker } from "tesseract.js";

export default function FotoKeTeksPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setError("");
    setText("");
    setCopied(false);
    setProgress(0);

    if (!selectedFile.type.startsWith("image/")) {
      setFile(null);
      setPreview("");
      setError("File harus berupa gambar.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null);
      setPreview("");
      setError("Ukuran gambar maksimal 10 MB.");
      return;
    }

    setFile(selectedFile);

    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
  };

  const recognizeText = async () => {
    if (!file) {
      setError("Pilih gambar terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setText("");
      setCopied(false);
      setProgress(0);

      const worker = await createWorker("ind");

      const result = await worker.recognize(file);

      setText(result.data.text);

      await worker.terminate();

      setProgress(100);
    } catch (error) {
      console.error("OCR error:", error);

      setError(
        "Gagal membaca teks dari gambar. Pastikan gambar cukup jelas dan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyText = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Teks tidak dapat disalin.");
    }
  };

  const downloadText = () => {
    if (!text) return;

    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "hasil-ocr.txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <a
            href="/"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Kembali ke Urusin
          </a>
        </div>

        <section className="text-center">
          <div className="mb-4 text-5xl">🔍</div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Foto ke Teks Online
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Ambil teks dari foto atau gambar secara gratis
            menggunakan OCR langsung dari browser.
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <label
            htmlFor="image-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-12 text-center transition hover:border-gray-500 hover:bg-gray-50"
          >
            <div className="text-4xl">🖼️</div>

            <div className="mt-4 text-lg font-semibold">
              Pilih gambar
            </div>

            <div className="mt-1 text-sm text-gray-500">
              JPG, PNG, atau WebP · Maksimal 10 MB
            </div>

            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {preview && (
            <div className="mt-6">
              <h2 className="font-semibold">
                Gambar yang dipilih
              </h2>

              <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3">
                <img
                  src={preview}
                  alt="Preview gambar untuk OCR"
                  className="mx-auto max-h-[500px] max-w-full object-contain"
                />
              </div>

              <button
                type="button"
                onClick={recognizeText}
                disabled={loading}
                className="mt-5 w-full rounded-xl bg-black px-5 py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {loading
                  ? "Membaca teks..."
                  : "🔍 Ambil Teks dari Gambar"}
              </button>

              {loading && (
                <div className="mt-4">
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-black transition-all"
                      style={{
                        width: `${Math.max(progress, 10)}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-center text-sm text-gray-500">
                    Sedang memproses gambar...
                  </p>
                </div>
              )}
            </div>
          )}

          {text && (
            <div className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">
                    Hasil OCR
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Periksa kembali hasil teks karena akurasi OCR
                    dapat berbeda tergantung kualitas gambar.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={copyText}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    {copied ? "✓ Tersalin" : "Salin Teks"}
                  </button>

                  <button
                    type="button"
                    onClick={downloadText}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    Download TXT
                  </button>
                </div>
              </div>

              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                className="mt-4 min-h-[300px] w-full resize-y rounded-xl border border-gray-300 p-4 text-sm leading-7 outline-none focus:border-gray-900"
                placeholder="Hasil teks akan muncul di sini..."
              />
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">
            Ubah Foto Menjadi Teks
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Foto ke Teks Urusin menggunakan teknologi OCR untuk
            mengenali tulisan pada gambar dan mengubahnya menjadi
            teks yang dapat disalin atau diedit.
          </p>

          <h2 className="mt-8 text-2xl font-bold">
            Cara Mengubah Foto Menjadi Teks
          </h2>

          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-7 text-gray-600">
            <li>
              Pilih foto atau gambar yang berisi teks.
            </li>
            <li>
              Klik tombol Ambil Teks dari Gambar.
            </li>
            <li>
              Tunggu proses OCR selesai.
            </li>
            <li>
              Periksa dan edit hasil teks jika diperlukan.
            </li>
            <li>
              Salin atau download hasilnya.
            </li>
          </ol>

          <h2 className="mt-8 text-2xl font-bold">
            Tips Agar Hasil OCR Lebih Akurat
          </h2>

          <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-gray-600">
            <li>
              Gunakan gambar dengan tulisan yang jelas.
            </li>
            <li>
              Hindari gambar yang terlalu buram.
            </li>
            <li>
              Pastikan pencahayaan cukup.
            </li>
            <li>
              Usahakan tulisan tidak miring.
            </li>
          </ul>

          <h2 className="mt-8 text-2xl font-bold">
            Pertanyaan yang Sering Ditanyakan
          </h2>

          <div className="mt-4 space-y-5">
            <div>
              <h3 className="font-semibold">
                Apakah Foto ke Teks di Urusin gratis?
              </h3>

              <p className="mt-1 text-gray-600">
                Ya. Tool ini dapat digunakan secara gratis.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Apakah foto saya diupload ke server?
              </h3>

              <p className="mt-1 text-gray-600">
                Proses OCR dilakukan di browser menggunakan
                Tesseract.js. Gambar tidak perlu dikirim ke server
                Urusin untuk diproses.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Apakah hasil OCR selalu akurat?
              </h3>

              <p className="mt-1 text-gray-600">
                Tidak selalu. Hasil sangat dipengaruhi oleh
                kualitas gambar, ukuran teks, pencahayaan, dan
                jenis tulisan. Karena itu hasil OCR sebaiknya
                diperiksa kembali.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}