"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    cv: any;
  }
}

type Mode = "original" | "gray" | "bw";

export default function ScanDokumenPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [mode, setMode] = useState<Mode>("original");
  const [processing, setProcessing] = useState(false);
  const [opencvReady, setOpencvReady] = useState(false);
  const [message, setMessage] = useState(
    "Pilih foto dokumen untuk mulai scan.",
  );

  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (window.cv) {
      setOpencvReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://docs.opencv.org/4.x/opencv.js";
    script.async = true;

    script.onload = () => {
      const checkOpenCV = () => {
        if (window.cv) {
          setOpencvReady(true);
        } else {
          setTimeout(checkOpenCV, 100);
        }
      };

      checkOpenCV();
    };

    script.onerror = () => {
      setMessage("Gagal memuat sistem scan. Silakan refresh halaman.");
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("File harus berupa gambar.");
      return;
    }

    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }

    const url = URL.createObjectURL(file);

    setImageUrl(url);
    setResultUrl("");
    setMessage("Foto berhasil dimuat. Tekan Scan Dokumen.");
    event.target.value = "";
  };

  const orderPoints = (points: { x: number; y: number }[]) => {
    const sorted = [...points];

    const topLeft = sorted.reduce((prev, current) =>
      prev.x + prev.y < current.x + current.y ? prev : current,
    );

    const bottomRight = sorted.reduce((prev, current) =>
      prev.x + prev.y > current.x + current.y ? prev : current,
    );

    const topRight = sorted.reduce((prev, current) =>
      prev.x - prev.y > current.x - current.y ? prev : current,
    );

    const bottomLeft = sorted.reduce((prev, current) =>
      prev.x - prev.y < current.x - current.y ? prev : current,
    );

    return [topLeft, topRight, bottomRight, bottomLeft];
  };

  const distance = (
    a: { x: number; y: number },
    b: { x: number; y: number },
  ) => {
    return Math.sqrt(
      Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2),
    );
  };

  const scanDocument = async () => {
    if (!imageUrl || !imageRef.current) {
      setMessage("Pilih foto dokumen terlebih dahulu.");
      return;
    }

    if (!opencvReady || !window.cv) {
      setMessage("Sistem scan masih dimuat. Coba lagi sebentar.");
      return;
    }

    setProcessing(true);
    setMessage("Mendeteksi dokumen...");

    try {
      const cv = window.cv;
      const image = imageRef.current;

      const source = cv.imread(image);

      // Batasi ukuran pemrosesan agar tetap ringan di HP.
      const maxWidth = 1600;

      let working = source;

      if (source.cols > maxWidth) {
        const scale = maxWidth / source.cols;
        const resized = new cv.Mat();

        cv.resize(
          source,
          resized,
          new cv.Size(
            Math.round(source.cols * scale),
            Math.round(source.rows * scale),
          ),
          0,
          0,
          cv.INTER_AREA,
        );

        working = resized;
      }

      const gray = new cv.Mat();
      const blurred = new cv.Mat();
      const edges = new cv.Mat();

      cv.cvtColor(working, gray, cv.COLOR_RGBA2GRAY);

      cv.GaussianBlur(
        gray,
        blurred,
        new cv.Size(5, 5),
        0,
        0,
        cv.BORDER_DEFAULT,
      );

      cv.Canny(blurred, edges, 50, 150);

      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();

      cv.findContours(
        edges,
        contours,
        hierarchy,
        cv.RETR_LIST,
        cv.CHAIN_APPROX_SIMPLE,
      );

      const imageArea = working.cols * working.rows;

      let bestContour: any = null;
      let bestArea = 0;

      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const area = cv.contourArea(contour);

        if (area < imageArea * 0.15) {
          contour.delete();
          continue;
        }

        const perimeter = cv.arcLength(contour, true);
        const approx = new cv.Mat();

        cv.approxPolyDP(
          contour,
          approx,
          0.02 * perimeter,
          true,
        );

        if (approx.rows === 4 && area > bestArea) {
          if (bestContour) {
            bestContour.delete();
          }

          bestContour = approx;
          bestArea = area;
        } else {
          approx.delete();
        }

        contour.delete();
      }

      let output: any;

      if (bestContour) {
        const points: { x: number; y: number }[] = [];

        for (let i = 0; i < 4; i++) {
          points.push({
            x: bestContour.intPtr(i, 0)[0],
            y: bestContour.intPtr(i, 0)[1],
          });
        }

        const ordered = orderPoints(points);

        const [topLeft, topRight, bottomRight, bottomLeft] =
          ordered;

        const widthTop = distance(topLeft, topRight);
        const widthBottom = distance(bottomLeft, bottomRight);

        const heightLeft = distance(topLeft, bottomLeft);
        const heightRight = distance(topRight, bottomRight);

        const outputWidth = Math.max(
          Math.round(widthTop),
          Math.round(widthBottom),
        );

        const outputHeight = Math.max(
          Math.round(heightLeft),
          Math.round(heightRight),
        );

        const srcPoints = cv.matFromArray(
          4,
          1,
          cv.CV_32FC2,
          [
            topLeft.x,
            topLeft.y,
            topRight.x,
            topRight.y,
            bottomRight.x,
            bottomRight.y,
            bottomLeft.x,
            bottomLeft.y,
          ],
        );

        const dstPoints = cv.matFromArray(
          4,
          1,
          cv.CV_32FC2,
          [
            0,
            0,
            outputWidth - 1,
            0,
            outputWidth - 1,
            outputHeight - 1,
            0,
            outputHeight - 1,
          ],
        );

        const matrix = cv.getPerspectiveTransform(
          srcPoints,
          dstPoints,
        );

        output = new cv.Mat();

        cv.warpPerspective(
          working,
          output,
          matrix,
          new cv.Size(outputWidth, outputHeight),
          cv.INTER_LINEAR,
          cv.BORDER_CONSTANT,
          new cv.Scalar(),
        );

        srcPoints.delete();
        dstPoints.delete();
        matrix.delete();

        setMessage("Dokumen berhasil dideteksi otomatis.");
      } else {
        // Kalau sudut dokumen tidak ditemukan,
        // gunakan foto asli agar pengguna tetap mendapatkan hasil.
        output = working.clone();

        setMessage(
          "Batas dokumen tidak ditemukan. Foto asli digunakan.",
        );
      }

      if (mode === "gray" || mode === "bw") {
        const grayOutput = new cv.Mat();

        cv.cvtColor(
          output,
          grayOutput,
          cv.COLOR_RGBA2GRAY,
        );

        if (mode === "gray") {
          output.delete();
          output = grayOutput;
        } else {
          const threshold = new cv.Mat();

          cv.adaptiveThreshold(
            grayOutput,
            threshold,
            255,
            cv.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv.THRESH_BINARY,
            21,
            10,
          );

          grayOutput.delete();
          output.delete();

          output = threshold;
        }
      }

      // Sedikit peningkatan kontras.
      if (mode !== "original") {
        const enhanced = new cv.Mat();

        if (output.channels() === 1) {
          cv.equalizeHist(output, enhanced);
          output.delete();
          output = enhanced;
        }
      }

      const canvas = document.createElement("canvas");

      cv.imshow(canvas, output);

      const newResultUrl = canvas.toDataURL(
        "image/jpeg",
        0.92,
      );

      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }

      setResultUrl(newResultUrl);

      source.delete();
      if (working !== source) working.delete();
      gray.delete();
      blurred.delete();
      edges.delete();
      contours.delete();
      hierarchy.delete();

      if (bestContour) {
        bestContour.delete();
      }

      output.delete();
    } catch (error) {
      console.error(error);
      setMessage(
        "Gagal memproses foto. Coba gunakan foto dokumen yang lebih jelas.",
      );
    } finally {
      setProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultUrl) return;

    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = "scan-dokumen.jpg";
    link.click();
  };

  const reset = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    setImageUrl("");
    setResultUrl("");
    setMessage("Pilih foto dokumen untuk mulai scan.");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex rounded-2xl bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            📷 Scan Dokumen
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Scan Dokumen Online Gratis
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Ubah foto dokumen menjadi hasil scan yang lebih rapi
            langsung dari browser. Batas dokumen dideteksi secara
            otomatis.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">
          {!imageUrl ? (
            <label className="flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-blue-400 hover:bg-blue-50">
              <div className="mb-4 text-5xl">📄</div>

              <div className="text-lg font-bold text-slate-900">
                Pilih foto dokumen
              </div>

              <div className="mt-2 text-sm text-slate-500">
                JPG atau PNG
              </div>

              <span className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
                Pilih Foto
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                capture="environment"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl bg-slate-100">
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Foto dokumen"
                  className="mx-auto max-h-[600px] w-auto max-w-full object-contain"
                />
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-slate-700">
                  Mode hasil scan
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: "original" as Mode,
                      label: "Original",
                    },
                    {
                      id: "gray" as Mode,
                      label: "Grayscale",
                    },
                    {
                      id: "bw" as Mode,
                      label: "Hitam Putih",
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMode(item.id)}
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                        mode === item.id
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={scanDocument}
                  disabled={processing || !opencvReady}
                  className="flex-1 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processing
                    ? "Memproses..."
                    : !opencvReady
                      ? "Menyiapkan Scanner..."
                      : "🔍 Scan Dokumen"}
                </button>

                <button
                  type="button"
                  onClick={reset}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Ganti Foto
                </button>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                {message}
              </div>
            </div>
          )}

          {resultUrl && (
            <div className="mt-8 border-t border-slate-200 pt-8">
              <h2 className="text-xl font-bold text-slate-900">
                Hasil Scan
              </h2>

              <div className="mt-4 overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={resultUrl}
                  alt="Hasil scan dokumen"
                  className="mx-auto max-h-[700px] w-auto max-w-full object-contain"
                />
              </div>

              <button
                type="button"
                onClick={downloadResult}
                className="mt-5 w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                ⬇️ Download Hasil Scan
              </button>
            </div>
          )}
        </div>

        <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">
            Cara Scan Dokumen
          </h2>

          <ol className="mt-5 space-y-4 text-slate-600">
            <li>
              <strong className="text-slate-900">1. Foto dokumen</strong>
              <br />
              Letakkan dokumen di permukaan yang cukup kontras.
            </li>

            <li>
              <strong className="text-slate-900">2. Upload foto</strong>
              <br />
              Pilih foto dari HP atau komputer.
            </li>

            <li>
              <strong className="text-slate-900">3. Scan otomatis</strong>
              <br />
              Urusin mencoba mendeteksi batas kertas dan
              meluruskan perspektifnya.
            </li>

            <li>
              <strong className="text-slate-900">4. Download</strong>
              <br />
              Simpan hasil scan ke perangkat.
            </li>
          </ol>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">
            Privasi
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Foto diproses langsung di browser. Urusin tidak perlu
            mengunggah foto dokumen ke server untuk proses scan.
          </p>
        </section>
      </section>
    </main>
  );
}