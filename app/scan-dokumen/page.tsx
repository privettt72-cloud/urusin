"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

type ScanMode = "color" | "gray" | "bw";

declare global {
  interface Window {
    cv: any;
  }
}

type Point = {
  x: number;
  y: number;
};

export default function ScanDokumenPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [mode, setMode] = useState<ScanMode>("color");
  const [isScanning, setIsScanning] = useState(false);
  const [opencvReady, setOpencvReady] = useState(false);
  const [error, setError] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (window.cv && window.cv.Mat) {
      setOpencvReady(true);
      return;
    }

    const script = document.createElement("script");

    script.src = "https://docs.opencv.org/4.x/opencv.js";
    script.async = true;

    script.onload = () => {
      const timer = window.setInterval(() => {
        if (window.cv && window.cv.Mat) {
          window.clearInterval(timer);
          setOpencvReady(true);
        }
      }, 100);

      window.setTimeout(() => {
        window.clearInterval(timer);

        if (!window.cv || !window.cv.Mat) {
          setError("Scanner gagal dimuat. Silakan refresh halaman.");
        }
      }, 15000);
    };

    script.onerror = () => {
      setError(
        "Scanner gagal dimuat. Periksa koneksi internet lalu coba lagi.",
      );
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = () =>
        reject(new Error("Gagal membaca gambar."));

      image.src = src;
    });
  };

  const distance = (a: Point, b: Point) => {
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  const orderPoints = (points: Point[]): Point[] => {
    const result = [...points];

    const sum = (p: Point) => p.x + p.y;
    const diff = (p: Point) => p.x - p.y;

    const topLeft = result.reduce((a, b) =>
      sum(a) < sum(b) ? a : b,
    );

    const bottomRight = result.reduce((a, b) =>
      sum(a) > sum(b) ? a : b,
    );

    const topRight = result.reduce((a, b) =>
      diff(a) > diff(b) ? a : b,
    );

    const bottomLeft = result.reduce((a, b) =>
      diff(a) < diff(b) ? a : b,
    );

    return [
      topLeft,
      topRight,
      bottomRight,
      bottomLeft,
    ];
  };

  const polygonArea = (points: Point[]) => {
    let area = 0;

    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];

      area +=
        current.x * next.y -
        next.x * current.y;
    }

    return Math.abs(area / 2);
  };

  const isReasonableQuadrilateral = (
    points: Point[],
    width: number,
    height: number,
  ) => {
    if (points.length !== 4) {
      return false;
    }

    const ordered = orderPoints(points);

    const [tl, tr, br, bl] = ordered;

    const top = distance(tl, tr);
    const right = distance(tr, br);
    const bottom = distance(bl, br);
    const left = distance(tl, bl);

    const avgWidth = (top + bottom) / 2;
    const avgHeight = (left + right) / 2;

    if (avgWidth < width * 0.2) {
      return false;
    }

    if (avgHeight < height * 0.2) {
      return false;
    }

    const area = polygonArea(ordered);
    const imageArea = width * height;

    if (area < imageArea * 0.12) {
      return false;
    }

    const maxSide =
      Math.max(top, right, bottom, left);

    const minSide =
      Math.min(top, right, bottom, left);

    if (minSide <= 0) {
      return false;
    }

    if (maxSide / minSide > 8) {
      return false;
    }

    return true;
  };

  const detectDocument = (
    source: any,
    detection: any,
  ): Point[] | null => {
    const cv = window.cv;

    const gray = new cv.Mat();
    const blur = new cv.Mat();

    cv.cvtColor(
      detection,
      gray,
      cv.COLOR_RGBA2GRAY,
    );

    cv.GaussianBlur(
      gray,
      blur,
      new cv.Size(5, 5),
      0,
      0,
      cv.BORDER_DEFAULT,
    );

    const candidates: Point[][] = [];

    /*
     * METODE 1
     * Canny dengan beberapa threshold.
     */
    const cannySettings = [
      [30, 100],
      [50, 150],
      [70, 180],
      [100, 200],
    ];

    for (const [low, high] of cannySettings) {
      const edges = new cv.Mat();

      cv.Canny(
        blur,
        edges,
        low,
        high,
      );

      const kernel =
        cv.getStructuringElement(
          cv.MORPH_RECT,
          new cv.Size(5, 5),
        );

      cv.morphologyEx(
        edges,
        edges,
        cv.MORPH_CLOSE,
        kernel,
      );

      kernel.delete();

      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();

      cv.findContours(
        edges,
        contours,
        hierarchy,
        cv.RETR_LIST,
        cv.CHAIN_APPROX_SIMPLE,
      );

      const imageArea =
        detection.cols * detection.rows;

      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);

        const area = cv.contourArea(contour);

        if (area < imageArea * 0.12) {
          contour.delete();
          continue;
        }

        const perimeter =
          cv.arcLength(contour, true);

        const approx = new cv.Mat();

        cv.approxPolyDP(
          contour,
          approx,
          0.015 * perimeter,
          true,
        );

        if (approx.rows === 4) {
          const points: Point[] = [];

          for (let j = 0; j < 4; j++) {
            points.push({
              x: approx.data32S[j * 2],
              y: approx.data32S[j * 2 + 1],
            });
          }

          if (
            isReasonableQuadrilateral(
              points,
              detection.cols,
              detection.rows,
            )
          ) {
            candidates.push(points);
          }
        }

        approx.delete();
        contour.delete();
      }

      edges.delete();
      contours.delete();
      hierarchy.delete();
    }

    /*
     * METODE 2
     * Threshold untuk dokumen putih
     * dengan background yang lebih gelap.
     */
    const threshold = new cv.Mat();

    cv.adaptiveThreshold(
      gray,
      threshold,
      255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY,
      31,
      10,
    );

    const inverted = new cv.Mat();

    cv.bitwise_not(
      threshold,
      inverted,
    );

    const contours2 = new cv.MatVector();
    const hierarchy2 = new cv.Mat();

    cv.findContours(
      inverted,
      contours2,
      hierarchy2,
      cv.RETR_LIST,
      cv.CHAIN_APPROX_SIMPLE,
    );

    const imageArea =
      detection.cols * detection.rows;

    for (let i = 0; i < contours2.size(); i++) {
      const contour = contours2.get(i);

      const area = cv.contourArea(contour);

      if (area < imageArea * 0.15) {
        contour.delete();
        continue;
      }

      const perimeter =
        cv.arcLength(contour, true);

      const approx = new cv.Mat();

      cv.approxPolyDP(
        contour,
        approx,
        0.02 * perimeter,
        true,
      );

      if (approx.rows === 4) {
        const points: Point[] = [];

        for (let j = 0; j < 4; j++) {
          points.push({
            x: approx.data32S[j * 2],
            y: approx.data32S[j * 2 + 1],
          });
        }

        if (
          isReasonableQuadrilateral(
            points,
            detection.cols,
            detection.rows,
          )
        ) {
          candidates.push(points);
        }
      }

      approx.delete();
      contour.delete();
    }

    threshold.delete();
    inverted.delete();
    contours2.delete();
    hierarchy2.delete();
    gray.delete();
    blur.delete();

    if (candidates.length === 0) {
      return null;
    }

    /*
     * Pilih kandidat terbesar.
     */
    let best = candidates[0];
    let bestArea = polygonArea(best);

    for (const candidate of candidates) {
      const area = polygonArea(candidate);

      if (area > bestArea) {
        best = candidate;
        bestArea = area;
      }
    }

    /*
     * Kembalikan koordinat dari gambar deteksi
     * ke gambar asli.
     */
    const scaleX =
      source.cols / detection.cols;

    const scaleY =
      source.rows / detection.rows;

    return best.map((point) => ({
      x: point.x * scaleX,
      y: point.y * scaleY,
    }));
  };

  const sharpen = (src: any) => {
    const cv = window.cv;

    const blurred = new cv.Mat();
    const result = new cv.Mat();

    cv.GaussianBlur(
      src,
      blurred,
      new cv.Size(0, 0),
      1.1,
      1.1,
      cv.BORDER_DEFAULT,
    );

    cv.addWeighted(
      src,
      1.65,
      blurred,
      -0.65,
      0,
      result,
    );

    blurred.delete();

    return result;
  };

  const processImage = async (
    sourceUrl: string,
    selectedMode: ScanMode,
  ) => {
    const cv = window.cv;

    const image = await loadImage(sourceUrl);

    /*
     * Pertahankan resolusi foto asli.
     */
    const sourceCanvas =
      document.createElement("canvas");

    sourceCanvas.width = image.naturalWidth;
    sourceCanvas.height = image.naturalHeight;

    const context =
      sourceCanvas.getContext("2d");

    if (!context) {
      throw new Error(
        "Canvas tidak tersedia.",
      );
    }

    context.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
    );

    const source =
      cv.imread(sourceCanvas);

    /*
     * Buat versi kecil khusus untuk
     * proses deteksi agar HP tidak berat.
     *
     * HASIL tetap menggunakan source asli.
     */
    const detection =
      new cv.Mat();

    const detectionMax = 1800;

    const scale = Math.min(
      1,
      detectionMax / source.cols,
      detectionMax / source.rows,
    );

    if (scale < 1) {
      cv.resize(
        source,
        detection,
        new cv.Size(
          Math.round(
            source.cols * scale,
          ),
          Math.round(
            source.rows * scale,
          ),
        ),
        0,
        0,
        cv.INTER_AREA,
      );
    } else {
      source.copyTo(detection);
    }

    /*
     * Cari 4 sudut dokumen.
     */
    const documentPoints =
      detectDocument(
        source,
        detection,
      );

    let output: any;

    if (documentPoints) {
      const ordered =
        orderPoints(documentPoints);

      const [tl, tr, br, bl] =
        ordered;

      /*
       * Hitung ukuran hasil berdasarkan
       * ukuran asli dokumen.
       */
      const widthTop =
        distance(tl, tr);

      const widthBottom =
        distance(bl, br);

      const heightLeft =
        distance(tl, bl);

      const heightRight =
        distance(tr, br);

      let targetWidth = Math.round(
        Math.max(
          widthTop,
          widthBottom,
        ),
      );

      let targetHeight = Math.round(
        Math.max(
          heightLeft,
          heightRight,
        ),
      );

      /*
       * Maksimum 3500px agar HP tidak
       * kehabisan memory.
       */
      const maxDimension = 3500;

      const outputScale = Math.min(
        1,
        maxDimension /
          Math.max(
            targetWidth,
            targetHeight,
          ),
      );

      targetWidth = Math.max(
        1,
        Math.round(
          targetWidth * outputScale,
        ),
      );

      targetHeight = Math.max(
        1,
        Math.round(
          targetHeight * outputScale,
        ),
      );

      const sourcePoints =
        cv.matFromArray(
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

      const destinationPoints =
        cv.matFromArray(
          4,
          1,
          cv.CV_32FC2,
          [
            0,
            0,
            targetWidth - 1,
            0,
            targetWidth - 1,
            targetHeight - 1,
            0,
            targetHeight - 1,
          ],
        );

      const transform =
        cv.getPerspectiveTransform(
          sourcePoints,
          destinationPoints,
        );

      const warped =
        new cv.Mat();

      /*
       * INTER_CUBIC menjaga tulisan lebih
       * tajam setelah perspective correction.
       */
      cv.warpPerspective(
        source,
        warped,
        transform,
        new cv.Size(
          targetWidth,
          targetHeight,
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

      sourcePoints.delete();
      destinationPoints.delete();
      transform.delete();
    } else {
      /*
       * Jika gagal mendeteksi dokumen,
       * gunakan foto asli daripada memotong
       * secara sembarangan.
       */
      output = source.clone();
    }

    /*
     * MODE GRAYSCALE
     */
    if (selectedMode === "gray") {
      const gray =
        new cv.Mat();

      cv.cvtColor(
        output,
        gray,
        cv.COLOR_RGBA2GRAY,
      );

      const clahe =
        new cv.CLAHE(
          2.0,
          new cv.Size(8, 8),
        );

      const enhanced =
        new cv.Mat();

      clahe.apply(
        gray,
        enhanced,
      );

      const sharp =
        sharpen(enhanced);

      /*
       * Ubah kembali ke RGBA.
       */
      const rgba =
        new cv.Mat();

      cv.cvtColor(
        sharp,
        rgba,
        cv.COLOR_GRAY2RGBA,
      );

      gray.delete();
      enhanced.delete();
      sharp.delete();
      clahe.delete();
      output.delete();

      output = rgba;
    }

    /*
     * MODE BLACK & WHITE
     */
    if (selectedMode === "bw") {
      const gray =
        new cv.Mat();

      cv.cvtColor(
        output,
        gray,
        cv.COLOR_RGBA2GRAY,
      );

      const clahe =
        new cv.CLAHE(
          2.5,
          new cv.Size(8, 8),
        );

      const enhanced =
        new cv.Mat();

      clahe.apply(
        gray,
        enhanced,
      );

      /*
       * Adaptive threshold.
       * Lebih bagus untuk tulisan pada
       * kertas dengan pencahayaan tidak rata.
       */
      const binary =
        new cv.Mat();

      cv.adaptiveThreshold(
        enhanced,
        binary,
        255,
        cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv.THRESH_BINARY,
        31,
        10,
      );

      /*
       * Sedikit bersihkan noise.
       */
      const kernel =
        cv.getStructuringElement(
          cv.MORPH_RECT,
          new cv.Size(2, 2),
        );

      const cleaned =
        new cv.Mat();

      cv.morphologyEx(
        binary,
        cleaned,
        cv.MORPH_OPEN,
        kernel,
      );

      const rgba =
        new cv.Mat();

      cv.cvtColor(
        cleaned,
        rgba,
        cv.COLOR_GRAY2RGBA,
      );

      gray.delete();
      enhanced.delete();
      binary.delete();
      cleaned.delete();
      kernel.delete();
      clahe.delete();
      output.delete();

      output = rgba;
    }

    /*
     * MODE WARNA
     */
    if (selectedMode === "color") {
      const sharp =
        sharpen(output);

      output.delete();

      output = sharp;
    }

    /*
     * Tampilkan hasil ke canvas.
     */
    const canvas =
      canvasRef.current ||
      document.createElement("canvas");

    canvas.width = output.cols;
    canvas.height = output.rows;

    cv.imshow(
      canvas,
      output,
    );

    /*
     * Gunakan JPEG kualitas tinggi.
     */
    const blob: Blob | null =
      await new Promise((resolve) => {
        canvas.toBlob(
          (value) => resolve(value),
          "image/jpeg",
          0.98,
        );
      });

    if (!blob) {
      source.delete();
      detection.delete();
      output.delete();

      throw new Error(
        "Gagal membuat file hasil.",
      );
    }

    /*
     * Blob URL lebih aman untuk
     * download dibanding data:image.
     */
    const url =
      URL.createObjectURL(blob);

    source.delete();
    detection.delete();
    output.delete();

    return url;
  };

  const handleUpload = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith("image/")
    ) {
      setError(
        "File harus berupa gambar.",
      );
      return;
    }

    setError("");

    if (imageUrl) {
      URL.revokeObjectURL(
        imageUrl,
      );
    }

    if (resultUrl) {
      URL.revokeObjectURL(
        resultUrl,
      );
    }

    const url =
      URL.createObjectURL(file);

    setImageUrl(url);
    setResultUrl("");

    event.target.value = "";
  };

  const handleScan = async () => {
    if (!imageUrl) {
      setError(
        "Silakan pilih foto dokumen terlebih dahulu.",
      );
      return;
    }

    if (!opencvReady) {
      setError(
        "Scanner masih dimuat. Tunggu sebentar.",
      );
      return;
    }

    setIsScanning(true);
    setError("");

    if (resultUrl) {
      URL.revokeObjectURL(
        resultUrl,
      );
      setResultUrl("");
    }

    try {
      const result =
        await processImage(
          imageUrl,
          mode,
        );

      setResultUrl(result);
    } catch (scanError) {
      console.error(
        scanError,
      );

      setError(
        "Gagal memproses dokumen. Coba foto dengan seluruh kertas terlihat dan pencahayaan lebih terang.",
      );
    } finally {
      setIsScanning(false);
    }
  };

  const downloadResult = async () => {
    if (!resultUrl) return;

    try {
      /*
       * Ambil Blob dari Object URL.
       */
      const response =
        await fetch(resultUrl);

      const blob =
        await response.blob();

      const blobUrl =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = blobUrl;
      link.download =
        "scan-dokumen.jpg";

      link.style.display = "none";

      document.body.appendChild(
        link,
      );

      link.click();

      link.remove();

      /*
       * Jangan revoke terlalu cepat.
       * Beberapa browser HP membutuhkan
       * sedikit waktu untuk memulai download.
       */
      window.setTimeout(() => {
        URL.revokeObjectURL(
          blobUrl,
        );
      }, 2000);
    } catch (error) {
      console.error(
        error,
      );

      /*
       * Fallback untuk browser yang
       * memblokir download otomatis.
       */
      window.open(
        resultUrl,
        "_blank",
      );
    }
  };

  const reset = () => {
    if (imageUrl) {
      URL.revokeObjectURL(
        imageUrl,
      );
    }

    if (resultUrl) {
      URL.revokeObjectURL(
        resultUrl,
      );
    }

    setImageUrl("");
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
              Deteksi batas dokumen secara otomatis,
              luruskan perspektif, pertajam tulisan,
              dan download hasil scan langsung dari
              browser.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  1. Pilih foto dokumen
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Pastikan seluruh bagian kertas dan
                  keempat sudutnya terlihat.
                </p>
              </div>

              <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 text-center transition hover:border-blue-400 hover:bg-blue-50">
                <div className="text-4xl">
                  📷
                </div>

                <div className="mt-3 text-sm font-semibold text-slate-800">
                  Pilih foto atau ambil foto
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  JPG, JPEG, PNG, atau WEBP
                </div>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  onChange={
                    handleUpload
                  }
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
                      Hapus
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-xl border bg-slate-100">
                    <img
                      src={imageUrl}
                      alt="Foto dokumen"
                      className="max-h-[650px] w-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  2. Pilih kualitas hasil
                </h2>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setMode("color")
                    }
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
                    onClick={() =>
                      setMode("gray")
                    }
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
                    onClick={() =>
                      setMode("bw")
                    }
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
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                  {error}
                </div>
              )}

              {resultUrl && (
                <div className="pt-4">
                  <div className="mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Hasil Scan
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Dokumen sudah dipotong mengikuti
                      batas kertas dan diproses dengan
                      kualitas tinggi.
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-xl border bg-slate-100">
                    <img
                      src={resultUrl}
                      alt="Hasil scan dokumen"
                      className="max-h-[850px] w-full object-contain"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={
                      downloadResult
                    }
                    className="mt-4 w-full rounded-xl bg-green-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    ⬇️ Download Hasil Scan
                  </button>

                  <p className="mt-2 text-center text-xs leading-5 text-slate-500">
                    Jika browser tidak langsung
                    mengunduh, hasil akan dibuka di
                    tab baru dan bisa disimpan dari sana.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">
              Tips mendapatkan hasil terbaik
            </h2>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>
                💡 Gunakan pencahayaan yang terang.
              </li>

              <li>
                📄 Letakkan kertas di permukaan yang
                kontras dengan warna kertas.
              </li>

              <li>
                📐 Pastikan keempat sudut dokumen
                terlihat.
              </li>

              <li>
                📱 Jangan terlalu dekat dengan kertas.
              </li>

              <li>
                ✋ Jangan sampai tangan menutupi garis
                pinggir dokumen.
              </li>

              <li>
                🔎 Untuk tulisan kecil gunakan foto
                beresolusi tinggi.
              </li>

              <li>
                ⚫ Gunakan B&W untuk surat dan dokumen
                teks.
              </li>
            </ul>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <p className="text-xs leading-5 text-slate-600">
                Pemrosesan gambar dilakukan langsung
                di browser. Foto tidak perlu di-upload
                ke server Urusin.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900">
              Scanner dokumen otomatis
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Urusin mencoba menemukan empat sisi
              dokumen secara otomatis. Setelah ditemukan,
              perspektif foto diperbaiki sehingga kertas
              terlihat lebih lurus dan rapi.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              Setelah proses pemotongan, gambar diproses
              dengan peningkatan kontras dan sharpening
              untuk membantu membuat tulisan lebih jelas.
            </p>

            <h3 className="mt-8 text-lg font-semibold text-slate-900">
              Apakah hasil mengikuti garis pinggir kertas?
            </h3>

            <p className="mt-2 leading-7 text-slate-600">
              Scanner mencoba mendeteksi empat sudut dan
              garis tepi dokumen. Jika berhasil, area di
              luar kertas akan dipotong dan perspektifnya
              diluruskan secara otomatis.
            </p>

            <h3 className="mt-8 text-lg font-semibold text-slate-900">
              Apakah foto dikirim ke server?
            </h3>

            <p className="mt-2 leading-7 text-slate-600">
              Tidak. Pemrosesan dilakukan langsung di
              perangkat melalui browser.
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