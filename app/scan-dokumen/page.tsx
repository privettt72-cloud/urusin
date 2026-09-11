"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

type ScanMode = "color" | "gray" | "bw";

declare global {
  interface Window {
    cv: any;
  }
}

export default function ScanDokumenPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [mode, setMode] = useState<ScanMode>("color");
  const [isScanning, setIsScanning] = useState(false);
  const [opencvReady, setOpencvReady] = useState(false);
  const [error, setError] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (window.cv) {
      setOpencvReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://docs.opencv.org/4.x/opencv.js";
    script.async = true;

    script.onload = () => {
      const checkOpenCV = setInterval(() => {
        if (window.cv && window.cv.Mat) {
          clearInterval(checkOpenCV);
          setOpencvReady(true);
        }
      }, 100);

      setTimeout(() => clearInterval(checkOpenCV), 15000);
    };

    script.onerror = () => {
      setError("OpenCV gagal dimuat. Periksa koneksi internet.");
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
      setError("File harus berupa gambar.");
      return;
    }

    setError("");
    setResultUrl("");

    const url = URL.createObjectURL(file);

    setImageUrl((oldUrl) => {
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      return url;
    });

    event.target.value = "";
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = reject;

      image.src = src;
    });
  };

  const orderPoints = (points: any[]) => {
    const sorted = [...points];

    const sum = (p: any) => p.x + p.y;
    const diff = (p: any) => p.x - p.y;

    const topLeft = sorted.reduce((a, b) =>
      sum(a) < sum(b) ? a : b,
    );

    const bottomRight = sorted.reduce((a, b) =>
      sum(a) > sum(b) ? a : b,
    );

    const topRight = sorted.reduce((a, b) =>
      diff(a) > diff(b) ? a : b,
    );

    const bottomLeft = sorted.reduce((a, b) =>
      diff(a) < diff(b) ? a : b,
    );

    return [topLeft, topRight, bottomRight, bottomLeft];
  };

  const distance = (a: any, b: any) => {
    return Math.sqrt(
      Math.pow(a.x - b.x, 2) +
        Math.pow(a.y - b.y, 2),
    );
  };

  const applySharpen = (src: any) => {
    const cv = window.cv;

    const blurred = new cv.Mat();
    const sharpened = new cv.Mat();

    // Unsharp masking:
    // hasil = original * 1.5 - blur * 0.5
    cv.GaussianBlur(
      src,
      blurred,
      new cv.Size(0, 0),
      1.2,
      1.2,
      cv.BORDER_DEFAULT,
    );

    cv.addWeighted(
      src,
      1.5,
      blurred,
      -0.5,
      0,
      sharpened,
    );

    blurred.delete();

    return sharpened;
  };

  const processImage = async (
    sourceUrl: string,
    selectedMode: ScanMode,
  ) => {
    const cv = window.cv;

    const image = await loadImage(sourceUrl);

    /*
     * Jangan mengecilkan gambar.
     *
     * Ini penting supaya tulisan kecil tidak kehilangan detail.
     */
    const sourceCanvas = document.createElement("canvas");

    sourceCanvas.width = image.naturalWidth;
    sourceCanvas.height = image.naturalHeight;

    const sourceContext = sourceCanvas.getContext("2d");

    if (!sourceContext) {
      throw new Error("Canvas tidak tersedia.");
    }

    sourceContext.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
    );

    const source = cv.imread(sourceCanvas);

    /*
     * Untuk deteksi dokumen kita boleh menggunakan
     * gambar yang lebih kecil agar proses contour cepat.
     *
     * Tapi hasil akhirnya tetap menggunakan source
     * dengan resolusi asli.
     */
    const detection = new cv.Mat();

    const detectionScale = Math.min(
      1,
      1400 / source.cols,
    );

    if (detectionScale < 1) {
      cv.resize(
        source,
        detection,
        new cv.Size(
          Math.round(source.cols * detectionScale),
          Math.round(source.rows * detectionScale),
        ),
        0,
        0,
        cv.INTER_AREA,
      );
    } else {
      source.copyTo(detection);
    }

    const gray = new cv.Mat();
    const blurred = new cv.Mat();
    const edges = new cv.Mat();

    cv.cvtColor(
      detection,
      gray,
      cv.COLOR_RGBA2GRAY,
    );

    cv.GaussianBlur(
      gray,
      blurred,
      new cv.Size(5, 5),
      0,
      0,
      cv.BORDER_DEFAULT,
    );

    cv.Canny(
      blurred,
      edges,
      50,
      150,
    );

    /*
     * Sedikit dilasi supaya garis tepi dokumen
     * lebih mudah terhubung.
     */
    const kernel = cv.getStructuringElement(
      cv.MORPH_RECT,
      new cv.Size(3, 3),
    );

    cv.dilate(
      edges,
      edges,
      kernel,
    );

    kernel.delete();

    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();

    cv.findContours(
      edges,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE,
    );

    let bestContour = null;
    let bestArea = 0;
    let bestApprox = null;

    const imageArea =
      detection.cols * detection.rows;

    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i);

      const area = cv.contourArea(contour);

      if (area < imageArea * 0.15) {
        contour.delete();
        continue;
      }

      const perimeter = cv.arcLength(
        contour,
        true,
      );

      const approx = new cv.Mat();

      cv.approxPolyDP(
        contour,
        approx,
        0.02 * perimeter,
        true,
      );

      if (
        approx.rows === 4 &&
        area > bestArea
      ) {
        if (bestApprox) {
          bestApprox.delete();
        }

        bestContour = contour;
        bestApprox = approx;
        bestArea = area;
      } else {
        approx.delete();
        contour.delete();
      }
    }

    let output: any;

    if (
      bestApprox &&
      bestApprox.rows === 4
    ) {
      /*
       * Ambil titik dari gambar deteksi,
       * kemudian kembalikan ke koordinat gambar asli.
       */
      const points = [];

      for (let i = 0; i < 4; i++) {
        const x =
          bestApprox.data32S[i * 2] /
          detectionScale;

        const y =
          bestApprox.data32S[i * 2 + 1] /
          detectionScale;

        points.push({ x, y });
      }

      const ordered = orderPoints(points);

      const [tl, tr, br, bl] = ordered;

      const widthTop = distance(tl, tr);
      const widthBottom = distance(bl, br);

      const heightLeft = distance(tl, bl);
      const heightRight = distance(tr, br);

      const targetWidth = Math.round(
        Math.max(widthTop, widthBottom),
      );

      const targetHeight = Math.round(
        Math.max(heightLeft, heightRight),
      );

      /*
       * Batasi ukuran maksimum hanya jika
       * gambar sangat ekstrem besar.
       *
       * 3000 px masih cukup tinggi untuk
       * mempertahankan tulisan kecil.
       */
      const maxOutputDimension = 3000;

      const scale = Math.min(
        1,
        maxOutputDimension /
          Math.max(targetWidth, targetHeight),
      );

      const finalWidth = Math.max(
        1,
        Math.round(targetWidth * scale),
      );

      const finalHeight = Math.max(
        1,
        Math.round(targetHeight * scale),
      );

      const srcPoints = cv.matFromArray(
        4,
        1,
        cv.CV_32FC2,
        [
          tl.x,
          tl.y,
          tr.x,
          tr.y,
          br.x,
          br.y,
          bl.x,
          bl.y,
        ],
      );

      const dstPoints = cv.matFromArray(
        4,
        1,
        cv.CV_32FC2,
        [
          0,
          0,
          finalWidth - 1,
          0,
          finalWidth - 1,
          finalHeight - 1,
          0,
          finalHeight - 1,
        ],
      );

      const transform =
        cv.getPerspectiveTransform(
          srcPoints,
          dstPoints,
        );

      const warped = new cv.Mat();

      cv.warpPerspective(
        source,
        warped,
        transform,
        new cv.Size(
          finalWidth,
          finalHeight,
        ),
        cv.INTER_CUBIC,
        cv.BORDER_CONSTANT,
        new cv.Scalar(
          255,
          255,
          255,
          255,
        ),
      );

      output = warped;

      srcPoints.delete();
      dstPoints.delete();
      transform.delete();
    } else {
      /*
       * Jika dokumen tidak terdeteksi,
       * jangan melakukan transformasi paksa.
       */
      output = source.clone();
    }

    /*
     * MODE GRAYSCALE
     */
    if (selectedMode === "gray") {
      const grayOutput = new cv.Mat();

      cv.cvtColor(
        output,
        grayOutput,
        cv.COLOR_RGBA2GRAY,
      );

      /*
       * CLAHE meningkatkan kontras tulisan
       * tanpa terlalu menghancurkan background.
       */
      const clahe = new cv.CLAHE(
        2.2,
        new cv.Size(8, 8),
      );

      const enhanced = new cv.Mat();

      clahe.apply(
        grayOutput,
        enhanced,
      );

      clahe.delete();
      grayOutput.delete();

      const sharpened =
        applySharpen(enhanced);

      enhanced.delete();
      output.delete();

      output = sharpened;
    }

    /*
     * MODE HITAM PUTIH
     *
     * Adaptive threshold jauh lebih bagus
     * untuk dokumen yang pencahayaannya tidak rata.
     */
    if (selectedMode === "bw") {
      const grayOutput = new cv.Mat();

      cv.cvtColor(
        output,
        grayOutput,
        cv.COLOR_RGBA2GRAY,
      );

      const enhanced = new cv.Mat();

      const clahe = new cv.CLAHE(
        2.5,
        new cv.Size(8, 8),
      );

      clahe.apply(
        grayOutput,
        enhanced,
      );

      const binary = new cv.Mat();

      cv.adaptiveThreshold(
        enhanced,
        binary,
        255,
        cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv.THRESH_BINARY,
        31,
        11,
      );

      /*
       * Sedikit morphological open untuk
       * mengurangi noise kecil.
       */
      const morphKernel =
        cv.getStructuringElement(
          cv.MORPH_RECT,
          new cv.Size(2, 2),
        );

      const cleaned = new cv.Mat();

      cv.morphologyEx(
        binary,
        cleaned,
        cv.MORPH_OPEN,
        morphKernel,
      );

      /*
       * Kembalikan ke RGBA supaya
       * cv.imshow mudah digunakan.
       */
      const rgba = new cv.Mat();

      cv.cvtColor(
        cleaned,
        rgba,
        cv.COLOR_GRAY2RGBA,
      );

      morphKernel.delete();
      cleaned.delete();
      binary.delete();
      enhanced.delete();
      grayOutput.delete();
      clahe.delete();

      output.delete();

      output = rgba;
    }

    /*
     * MODE COLOR
     *
     * Tetap beri sedikit sharpening
     * agar tulisan tidak terlalu lembut setelah
     * perspective correction.
     */
    if (selectedMode === "color") {
      const sharpened =
        applySharpen(output);

      output.delete();

      output = sharpened;
    }

    const canvas =
      canvasRef.current ||
      document.createElement("canvas");

    canvas.width = output.cols;
    canvas.height = output.rows;

    cv.imshow(canvas, output);

    /*
     * JPEG kualitas tinggi.
     * Tidak menggunakan 0.8 / 0.9 karena
     * teks kecil mudah rusak akibat kompresi.
     */
    const result = canvas.toDataURL(
      "image/jpeg",
      0.98,
    );

    /*
     * Bersihkan memory OpenCV.
     */
    source.delete();
    detection.delete();
    gray.delete();
    blurred.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();

    if (bestContour) {
      bestContour.delete();
    }

    if (bestApprox) {
      bestApprox.delete();
    }

    output.delete();

    return result;
  };

  const handleScan = async () => {
    if (!imageUrl) {
      setError("Silakan pilih foto dokumen terlebih dahulu.");
      return;
    }

    if (!opencvReady) {
      setError(
        "Scanner sedang dimuat. Tunggu sebentar lalu coba lagi.",
      );
      return;
    }

    setIsScanning(true);
    setError("");

    try {
      const result = await processImage(
        imageUrl,
        mode,
      );

      setResultUrl(result);
    } catch (scanError) {
      console.error(scanError);

      setError(
        "Gagal memproses dokumen. Coba gunakan foto yang lebih terang dan tidak terlalu miring.",
      );
    } finally {
      setIsScanning(false);
    }
  };

  const downloadResult = () => {
    if (!resultUrl) return;

    const link = document.createElement("a");

    link.href = resultUrl;
    link.download = "scan-dokumen.jpg";

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const reset = () => {
    setResultUrl("");
    setError("");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              📷 Scan Dokumen
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Scan Dokumen Online Gratis
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Ubah foto dokumen menjadi hasil scan yang
              lebih rapi, lurus, tajam, dan mudah dibaca
              langsung dari browser.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  1. Pilih foto dokumen
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Gunakan foto dengan pencahayaan cukup dan
                  dokumen terlihat jelas.
                </p>
              </div>

              <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 text-center transition hover:border-blue-400 hover:bg-blue-50">
                <div className="text-4xl">📷</div>

                <div className="mt-3 text-sm font-semibold text-slate-800">
                  Pilih foto atau ambil foto
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  JPG, JPEG, PNG
                </div>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>

              {imageUrl && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">
                      Foto asli
                    </h3>

                    <button
                      type="button"
                      onClick={reset}
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Hapus hasil
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-xl border bg-slate-100">
                    <img
                      src={imageUrl}
                      alt="Foto dokumen"
                      className="max-h-[600px] w-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  2. Pilih hasil scan
                </h2>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("color")}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                      mode === "color"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    🎨 Warna
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("gray")}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                      mode === "gray"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    🌫️ Abu-abu
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("bw")}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                      mode === "bw"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    ⚫ B&W
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleScan}
                disabled={
                  !imageUrl ||
                  !opencvReady ||
                  isScanning
                }
                className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isScanning
                  ? "Memproses dokumen..."
                  : !opencvReady
                    ? "Menyiapkan scanner..."
                    : "Scan Dokumen"}
              </button>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {resultUrl && (
                <div className="pt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Hasil Scan
                    </h2>

                    <button
                      type="button"
                      onClick={downloadResult}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                    >
                      Download JPG
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-xl border bg-slate-100">
                    <img
                      src={resultUrl}
                      alt="Hasil scan dokumen"
                      className="max-h-[800px] w-full object-contain"
                    />
                  </div>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Hasil diproses langsung di browser.
                    Foto tidak perlu dikirim ke server Urusin.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">
              Tips hasil lebih jelas
            </h2>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>
                💡 Gunakan pencahayaan yang terang dan
                merata.
              </li>

              <li>
                📄 Pastikan seluruh bagian kertas masuk
                ke dalam foto.
              </li>

              <li>
                📱 Jangan terlalu dekat agar keempat sudut
                dokumen terlihat.
              </li>

              <li>
                ✋ Hindari tangan atau benda lain menutupi
                tulisan.
              </li>

              <li>
                🔎 Untuk tulisan kecil, gunakan foto dengan
                resolusi tinggi.
              </li>

              <li>
                ⚫ Gunakan mode B&W untuk dokumen teks
                seperti surat dan formulir.
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-t bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900">
              Scan dokumen lebih tajam dan mudah dibaca
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Scan Dokumen Urusin menggunakan pemrosesan
              gambar langsung di browser untuk mendeteksi
              area kertas, memperbaiki perspektif, meningkatkan
              kontras, dan mempertajam tulisan.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              Untuk dokumen seperti surat, formulir, nota,
              kuitansi, dan tugas sekolah, mode B&W dapat
              membantu membuat tulisan terlihat lebih tegas.
            </p>

            <h3 className="mt-8 text-lg font-semibold text-slate-900">
              Apakah foto dikirim ke server?
            </h3>

            <p className="mt-2 leading-7 text-slate-600">
              Tidak. Pemrosesan gambar dilakukan langsung
              di browser pada perangkat kamu. Hasil scan
              dibuat di perangkat sebelum di-download.
            </p>

            <h3 className="mt-8 text-lg font-semibold text-slate-900">
              Apa yang dilakukan scanner secara otomatis?
            </h3>

            <p className="mt-2 leading-7 text-slate-600">
              Scanner mencoba menemukan batas dokumen,
              meluruskan perspektif, mempertahankan resolusi
              tinggi, meningkatkan kontras, dan mempertajam
              hasil agar tulisan lebih mudah dibaca.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-8 text-center text-sm text-slate-500 sm:px-6">
          © {new Date().getFullYear()} Urusin. Biar urusanmu beres.
        </div>
      </footer>

      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </main>
  );
}