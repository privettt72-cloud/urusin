
"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const formatLabels: Record<OutputFormat, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WebP",
};

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function ConvertFotoPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [outputFormat, setOutputFormat] =
    useState<OutputFormat>("image/jpeg");
  const [quality, setQuality] = useState(85);
  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  function validateFile(selectedFile: File) {
    if (!allowedTypes.includes(selectedFile.type)) {
      return "Format file harus JPG, PNG, atau WebP.";
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      return "Ukuran file maksimal 10 MB.";
    }

    return "";
  }

  function loadFile(selectedFile: File) {
    setError("");
    setResultUrl("");
    setResultSize(0);

    const validationError = validateFile(selectedFile);

    if (validationError) {
      setFile(null);
      setPreviewUrl("");
      setError(validationError);
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const url = URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setPreviewUrl(url);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      loadFile(selectedFile);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      loadFile(droppedFile);
    }
  }

  async function convertImage() {
    if (!file || !previewUrl || !canvasRef.current) {
      return;
    }

    setError("");
    setIsConverting(true);

    try {
      const image = new Image();

      image.onload = () => {
        const canvas = canvasRef.current;

        if (!canvas) {
          setIsConverting(false);
          return;
        }

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const context = canvas.getContext("2d");

        if (!context) {
          setError("Browser tidak mendukung proses konversi gambar.");
          setIsConverting(false);
          return;
        }

        /*
         * JPG tidak mendukung transparansi.
         * Gunakan background putih supaya area transparan
         * tidak berubah menjadi hitam.
         */
        if (outputFormat === "image/jpeg") {
          context.fillStyle = "#ffffff";
          context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
          );
        }

        context.drawImage(
          image,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const mimeQuality =
          outputFormat === "image/png"
            ? undefined
            : quality / 100;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setError("Foto gagal dikonversi.");
              setIsConverting(false);
              return;
            }

            if (resultUrl) {
              URL.revokeObjectURL(resultUrl);
            }

            const url = URL.createObjectURL(blob);

            setResultUrl(url);
            setResultSize(blob.size);
            setIsConverting(false);
          },
          outputFormat,
          mimeQuality
        );
      };

      image.onerror = () => {
        setError("Foto tidak dapat dibaca oleh browser.");
        setIsConverting(false);
      };

      image.src = previewUrl;
    } catch {
      setError("Terjadi kesalahan saat mengkonversi foto.");
      setIsConverting(false);
    }
  }

  function downloadResult() {
    if (!resultUrl || !file) {
      return;
    }

    const originalName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-");

    const extension =
      outputFormat === "image/jpeg"
        ? "jpg"
        : outputFormat === "image/png"
          ? "png"
          : "webp";

    const link = document.createElement("a");

    link.href = resultUrl;
    link.download = `${originalName}-converted.${extension}`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function resetTool() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }

    setFile(null);
    setPreviewUrl("");
    setResultUrl("");
    setResultSize(0);
    setError("");
    setIsConverting(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function formatBytes(bytes: number) {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">

          <a
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            Urusin
            <span className="text-blue-600">.</span>
          </a>

          <a
            href="/#tools"
            className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
          >
            Semua Tools
          </a>

        </div>
      </header>


      {/* CONTENT */}

      <section className="mx-auto max-w-5xl px-5 py-10 md:py-16">

        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-4 inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            🖼️ Tool Foto
          </div>

          <h1 className="text-3xl font-black tracking-tight md:text-5xl">
            Convert Foto Online
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Ubah foto JPG, PNG, atau WebP ke format yang
            kamu butuhkan secara gratis langsung dari browser.
          </p>

        </div>


        {/* TOOL */}

        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">

          {!file ? (

            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition md:p-16 ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
              }`}
            >

              <div className="text-5xl">
                🖼️
              </div>

              <h2 className="mt-5 text-xl font-black">
                Pilih atau tarik foto ke sini
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                JPG, PNG, atau WebP • Maksimal 10 MB
              </p>

              <button
                type="button"
                className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
              >
                Pilih Foto
              </button>

              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

            </div>

          ) : (

            <div>

              {/* PREVIEW */}

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">

                <div className="flex min-h-[280px] items-center justify-center p-4">

                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview foto"
                      className="max-h-[420px] max-w-full object-contain"
                    />
                  )}

                </div>

              </div>


              {/* FILE INFO */}

              <div className="mt-4 rounded-xl bg-slate-50 p-4">

                <div className="flex flex-wrap items-center justify-between gap-3">

                  <div>
                    <p className="font-bold">
                      {file.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatBytes(file.size)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={resetTool}
                    className="rounded-lg px-3 py-2 text-sm font-bold text-slate-500 hover:bg-white hover:text-slate-900"
                  >
                    Ganti Foto
                  </button>

                </div>

              </div>


              {/* OPTIONS */}

              <div className="mt-6 grid gap-5 md:grid-cols-2">

                <div>

                  <label
                    htmlFor="output-format"
                    className="mb-2 block text-sm font-black"
                  >
                    Format Tujuan
                  </label>

                  <select
                    id="output-format"
                    value={outputFormat}
                    onChange={(event) => {
                      setOutputFormat(
                        event.target.value as OutputFormat
                      );
                      setResultUrl("");
                      setResultSize(0);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-blue-500"
                  >
                    <option value="image/jpeg">
                      JPG
                    </option>

                    <option value="image/png">
                      PNG
                    </option>

                    <option value="image/webp">
                      WebP
                    </option>
                  </select>

                </div>


                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="quality"
                      className="text-sm font-black"
                    >
                      Kualitas
                    </label>

                    <span className="text-sm font-bold text-blue-600">
                      {quality}%
                    </span>

                  </div>

                  <input
                    id="quality"
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={quality}
                    onChange={(event) => {
                      setQuality(Number(event.target.value));
                      setResultUrl("");
                      setResultSize(0);
                    }}
                    disabled={outputFormat === "image/png"}
                    className="w-full accent-blue-600"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Kualitas tidak digunakan untuk PNG.
                  </p>

                </div>

              </div>


              {/* ACTION */}

              <button
                type="button"
                onClick={convertImage}
                disabled={isConverting}
                className="mt-7 w-full rounded-xl bg-blue-600 px-5 py-4 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isConverting
                  ? "Mengkonversi..."
                  : `Convert ke ${formatLabels[outputFormat]}`}
              </button>


              {/* RESULT */}

              {resultUrl && (

                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="font-black text-emerald-800">
                        Foto berhasil dikonversi
                      </p>

                      <p className="mt-1 text-sm text-emerald-700">
                        Format {formatLabels[outputFormat]} •{" "}
                        {formatBytes(resultSize)}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={downloadResult}
                      className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
                    >
                      Download Foto
                    </button>

                  </div>

                </div>

              )}

              <button
                type="button"
                onClick={resetTool}
                className="mt-4 w-full rounded-xl px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                Mulai Lagi
              </button>

            </div>

          )}


          {error && (

            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>

          )}

          <canvas
            ref={canvasRef}
            className="hidden"
          />

        </div>


        {/* SEO CONTENT */}

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl bg-white p-6 shadow-sm md:p-8">

          <h2 className="text-2xl font-black">
            Convert JPG, PNG, dan WebP Online
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Convert Foto Urusin dapat digunakan untuk mengubah
            format gambar JPG, PNG, dan WebP langsung dari browser.
            Kamu dapat memilih format tujuan dan mengatur kualitas
            gambar sebelum mendownload hasilnya.
          </p>

          <h2 className="mt-10 text-2xl font-black">
            Cara Convert Foto
          </h2>

          <ol className="mt-4 space-y-3 leading-7 text-slate-600">
            <li>
              <strong>1. Pilih foto.</strong> Upload foto JPG,
              PNG, atau WebP.
            </li>

            <li>
              <strong>2. Pilih format.</strong> Tentukan apakah
              hasil ingin disimpan sebagai JPG, PNG, atau WebP.
            </li>

            <li>
              <strong>3. Atur kualitas.</strong> Untuk JPG dan
              WebP, kualitas dapat disesuaikan sesuai kebutuhan.
            </li>

            <li>
              <strong>4. Convert foto.</strong> Klik tombol
              Convert untuk memproses gambar.
            </li>

            <li>
              <strong>5. Download.</strong> Simpan hasil foto
              ke perangkat.
            </li>
          </ol>

          <h2 className="mt-10 text-2xl font-black">
            Apakah Foto Diupload ke Server?
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Tidak. Proses konversi dilakukan langsung di browser
            menggunakan Canvas API. Foto tidak perlu dikirim ke
            server untuk dikonversi.
          </p>

          <h2 className="mt-10 text-2xl font-black">
            Format yang Didukung
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">

            <div className="rounded-xl border border-slate-200 p-5">
              <h3 className="font-black">
                JPG
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Cocok untuk foto dengan ukuran file yang relatif
                kecil.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-5">
              <h3 className="font-black">
                PNG
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Cocok untuk gambar yang membutuhkan transparansi
                dan kualitas tanpa kompresi lossy.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-5">
              <h3 className="font-black">
                WebP
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Format gambar modern yang dapat menghasilkan file
                lebih kecil dengan kualitas yang baik.
              </p>
            </div>

          </div>

          <h2 className="mt-10 text-2xl font-black">
            Pertanyaan yang Sering Ditanyakan
          </h2>

          <div className="mt-5 divide-y divide-slate-200 rounded-xl border border-slate-200">

            <Faq
              question="Apakah bisa convert JPG ke PNG?"
              answer="Bisa. Upload foto JPG, pilih PNG sebagai format tujuan, lalu klik Convert."
            />

            <Faq
              question="Apakah bisa convert PNG ke JPG?"
              answer="Bisa. Pilih PNG sebagai foto sumber dan JPG sebagai format tujuan. Area transparan pada gambar akan menggunakan background putih."
            />

            <Faq
              question="Apakah bisa convert JPG ke WebP?"
              answer="Bisa. Upload foto JPG, pilih WebP, atur kualitas jika diperlukan, kemudian download hasilnya."
            />

            <Faq
              question="Apakah bisa convert WebP ke JPG?"
              answer="Bisa. Upload foto WebP dan pilih JPG sebagai format tujuan."
            />

            <Faq
              question="Apakah Convert Foto gratis?"
              answer="Ya. Tool Convert Foto Urusin dapat digunakan secara gratis."
            />

            <Faq
              question="Apakah foto saya disimpan di server?"
              answer="Tidak. Proses konversi dilakukan langsung di browser sehingga foto tidak perlu dikirim ke server."
            />

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto max-w-5xl px-5 py-8">

          <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">

            <a
              href="/"
              className="font-black text-slate-900"
            >
              Urusin<span className="text-blue-600">.</span>
            </a>

            <span>
              © 2026 Urusin. Semua hak dilindungi.
            </span>

          </div>

        </div>

      </footer>

    </main>
  );
}


function Faq({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group p-5">
      <summary className="cursor-pointer list-none font-bold">
        <div className="flex items-center justify-between gap-4">
          <span>{question}</span>

          <span className="shrink-0 text-slate-400 transition group-open:rotate-45">
            +
          </span>
        </div>
      </summary>

      <p className="mt-3 pr-6 text-sm leading-6 text-slate-500">
        {answer}
      </p>
    </details>
  );
}

