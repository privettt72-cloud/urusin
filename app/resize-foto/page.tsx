"use client";

import { useEffect, useRef, useState } from "react";

type Preset = {
  id: string;
  name: string;
  width: number;
  height: number;
  description: string;
};

const presets: Preset[] = [
  {
    id: "3x4",
    name: "3 × 4",
    width: 3,
    height: 4,
    description: "Pas foto 3×4",
  },
  {
    id: "4x6",
    name: "4 × 6",
    width: 4,
    height: 6,
    description: "Pas foto 4×6",
  },
  {
    id: "2x3",
    name: "2 × 3",
    width: 2,
    height: 3,
    description: "Pas foto 2×3",
  },
  {
    id: "custom",
    name: "Custom",
    width: 1,
    height: 1,
    description: "Ukuran sendiri",
  },
];

export default function ResizeFotoPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("3x4");
  const [customWidth, setCustomWidth] = useState(300);
  const [customHeight, setCustomHeight] = useState(400);
  const [quality, setQuality] = useState(0.9);
  const [format, setFormat] = useState<"jpeg" | "png">("jpeg");
  const [zoom, setZoom] = useState(1);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  // ========================================
  // UPLOAD
  // ========================================

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("Silakan pilih file gambar.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran foto maksimal 10 MB.");
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      setImage(img);
      setPreviewUrl(url);
      setFileName(file.name);
      setZoom(1);
      setPositionX(0);
      setPositionY(0);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      alert("Foto tidak dapat dibaca.");
    };

    img.src = url;
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  // ========================================
  // PRESET
  // ========================================

  const activePreset = presets.find(
    (item) => item.id === selectedPreset
  );

  const outputWidth =
    selectedPreset === "custom"
      ? customWidth
      : (activePreset?.width || 3) * 100;

  const outputHeight =
    selectedPreset === "custom"
      ? customHeight
      : (activePreset?.height || 4) * 100;

  // ========================================
  // CANVAS
  // ========================================

  function drawCanvas() {
    if (!image || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const canvasWidth = 600;
    const canvasHeight =
      canvasWidth * (outputHeight / outputWidth);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    const imageRatio =
      image.width / image.height;

    const canvasRatio =
      canvas.width / canvas.height;

    let drawWidth: number;
    let drawHeight: number;

    if (imageRatio > canvasRatio) {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imageRatio;
    } else {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imageRatio;
    }

    drawWidth *= zoom;
    drawHeight *= zoom;

    const x =
      (canvas.width - drawWidth) / 2 +
      positionX;

    const y =
      (canvas.height - drawHeight) / 2 +
      positionY;

    ctx.save();

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      x,
      y,
      drawWidth,
      drawHeight
    );

    ctx.restore();
  }

  useEffect(() => {
    drawCanvas();
  }, [
    image,
    selectedPreset,
    customWidth,
    customHeight,
    zoom,
    positionX,
    positionY,
  ]);

  // ========================================
  // DOWNLOAD
  // ========================================

  function downloadImage() {
    if (!image || !canvasRef.current) {
      alert("Upload foto terlebih dahulu.");
      return;
    }

    setProcessing(true);

    setTimeout(() => {
      const sourceCanvas = canvasRef.current;

      if (!sourceCanvas) {
        setProcessing(false);
        return;
      }

      const canvas = document.createElement("canvas");

      canvas.width = outputWidth;
      canvas.height = outputHeight;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setProcessing(false);
        return;
      }

      ctx.fillStyle = "#ffffff";

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const imageRatio =
        image.width / image.height;

      const canvasRatio =
        canvas.width / canvas.height;

      let drawWidth: number;
      let drawHeight: number;

      if (imageRatio > canvasRatio) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imageRatio;
      } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imageRatio;
      }

      drawWidth *= zoom;
      drawHeight *= zoom;

      const previewWidth = 600;

      const previewHeight =
        previewWidth *
        (outputHeight / outputWidth);

      const scale =
        canvas.width / previewWidth;

      const x =
        (canvas.width - drawWidth) / 2 +
        positionX * scale;

      const y =
        (canvas.height - drawHeight) / 2 +
        positionY *
          (canvas.height / previewHeight);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        x,
        y,
        drawWidth,
        drawHeight
      );

      const mime =
        format === "png"
          ? "image/png"
          : "image/jpeg";

      const dataUrl =
        canvas.toDataURL(
          mime,
          quality
        );

      const link =
        document.createElement("a");

      const cleanName =
        fileName
          .replace(/\.[^/.]+$/, "")
          .replace(/[^a-zA-Z0-9-_]/g, "-");

      link.download =
        `${cleanName || "foto"}-${selectedPreset}.${format}`;

      link.href = dataUrl;
      link.click();

      setProcessing(false);
    }, 300);
  }

  // ========================================
  // DRAG
  // ========================================

  function startDrag(event: React.MouseEvent) {
    if (!image) return;

    setDragging(true);

    setLastMouse({
      x: event.clientX,
      y: event.clientY,
    });
  }

  function moveDrag(event: React.MouseEvent) {
    if (!dragging) return;

    const dx =
      event.clientX - lastMouse.x;

    const dy =
      event.clientY - lastMouse.y;

    setPositionX(
      (value) => value + dx
    );

    setPositionY(
      (value) => value + dy
    );

    setLastMouse({
      x: event.clientX,
      y: event.clientY,
    });
  }

  function stopDrag() {
    setDragging(false);
  }

  // ========================================
  // RESET
  // ========================================

  function resetPosition() {
    setZoom(1);
    setPositionX(0);
    setPositionY(0);
  }

  function removeImage() {
    setImage(null);
    setPreviewUrl("");
    setFileName("");
    setZoom(1);
    setPositionX(0);
    setPositionY(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // ========================================
  // UI
  // ========================================

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }
      `}</style>

      <main className="min-h-screen bg-slate-100 text-slate-900">
        {/* HEADER */}
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            <a
              href="/"
              className="text-2xl font-black"
            >
              Urusin
              <span className="text-blue-600">
                .
              </span>
            </a>

            <a
              href="/"
              className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
            >
              ← Kembali
            </a>
          </div>
        </header>

        {/* HERO */}
        <section className="mx-auto max-w-7xl px-5 pb-7 pt-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-full bg-purple-50 px-3 py-1 text-sm font-bold text-purple-600">
                📸 Urusin Tools
              </div>

              <h1 className="text-3xl font-black md:text-4xl">
                Resize Foto 3×4, 4×6, dan 2×3 Online
              </h1>

              <p className="mt-2 max-w-2xl text-slate-600">
                Ubah ukuran foto menjadi pas foto
                2×3, 3×4, atau 4×6 secara online.
                Atur posisi dan ukuran foto, lalu
                download hasilnya dalam format JPG
                atau PNG secara gratis.
              </p>
            </div>

            {image && (
              <button
                onClick={downloadImage}
                disabled={processing}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-bold text-white shadow-lg hover:-translate-y-0.5 disabled:opacity-60"
              >
                {processing
                  ? "⏳ Memproses..."
                  : "⬇️ Download Foto"}
              </button>
            )}
          </div>
        </section>

        {/* CONTENT */}
        <div className="mx-auto grid max-w-7xl gap-7 px-5 pb-20 lg:grid-cols-[380px_1fr]">
          {/* LEFT */}
          <div className="space-y-5">
            {/* UPLOAD */}
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-black">
                📷 Upload Foto
              </h2>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onFileChange}
                className="hidden"
              />

              {!image ? (
                <button
                  onClick={openFilePicker}
                  className="w-full rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center transition hover:border-purple-400 hover:bg-purple-50"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                    📷
                  </div>

                  <div className="font-bold">
                    Klik untuk upload foto
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    JPG, PNG, atau WebP
                    <br />
                    Maksimal 10 MB
                  </p>
                </button>
              ) : (
                <div>
                  <div className="mb-3 overflow-hidden rounded-xl bg-slate-100 p-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-xl">
                        🖼️
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">
                          {fileName}
                        </p>

                        <p className="text-xs text-slate-500">
                          Foto berhasil diupload
                        </p>
                      </div>

                      <button
                        onClick={removeImage}
                        className="rounded-lg px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={openFilePicker}
                    className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-bold hover:bg-slate-50"
                  >
                    🔄 Ganti Foto
                  </button>
                </div>
              )}
            </section>

            {/* UKURAN */}
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-2 text-lg font-black">
                📐 Pilih Ukuran
              </h2>

              <p className="mb-4 text-sm text-slate-500">
                Pilih ukuran foto yang kamu perlukan.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() =>
                      setSelectedPreset(
                        preset.id
                      )
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      selectedPreset === preset.id
                        ? "border-purple-500 bg-purple-50 ring-2 ring-purple-100"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black">
                        {preset.name}
                      </span>

                      {selectedPreset ===
                        preset.id && (
                        <span className="text-purple-600">
                          ✓
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>

              {selectedPreset === "custom" && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-xs font-bold">
                      Lebar (px)
                    </label>

                    <input
                      type="number"
                      min="50"
                      max="3000"
                      value={customWidth}
                      onChange={(e) =>
                        setCustomWidth(
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold">
                      Tinggi (px)
                    </label>

                    <input
                      type="number"
                      min="50"
                      max="3000"
                      value={customHeight}
                      onChange={(e) =>
                        setCustomHeight(
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* ZOOM */}
            {image && (
              <section className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black">
                      🎯 Atur Foto
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Geser foto untuk mengatur posisi.
                    </p>
                  </div>

                  <button
                    onClick={resetPosition}
                    className="text-xs font-bold text-purple-600 hover:underline"
                  >
                    Reset
                  </button>
                </div>

                <label className="mb-2 block text-sm font-bold">
                  Zoom{" "}
                  <span className="font-normal text-slate-500">
                    {zoom.toFixed(1)}×
                  </span>
                </label>

                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) =>
                    setZoom(
                      Number(e.target.value)
                    )
                  }
                  className="w-full"
                />
              </section>
            )}

            {/* KUALITAS */}
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-black">
                ⚙️ Pengaturan
              </h2>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-bold">
                  Format
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      setFormat("jpeg")
                    }
                    className={`rounded-xl border py-2.5 text-sm font-bold ${
                      format === "jpeg"
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-slate-200"
                    }`}
                  >
                    JPG
                  </button>

                  <button
                    onClick={() =>
                      setFormat("png")
                    }
                    className={`rounded-xl border py-2.5 text-sm font-bold ${
                      format === "png"
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-slate-200"
                    }`}
                  >
                    PNG
                  </button>
                </div>
              </div>

              {format === "jpeg" && (
                <div>
                  <div className="mb-2 flex justify-between">
                    <label className="text-sm font-bold">
                      Kualitas
                    </label>

                    <span className="text-sm font-bold text-purple-600">
                      {Math.round(
                        quality * 100
                      )}
                      %
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0.3"
                    max="1"
                    step="0.05"
                    value={quality}
                    onChange={(e) =>
                      setQuality(
                        Number(e.target.value)
                      )
                    }
                    className="w-full"
                  />

                  <div className="mt-2 flex justify-between text-[11px] text-slate-400">
                    <span>File kecil</span>
                    <span>Kualitas tinggi</span>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">
                  Preview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {outputWidth} × {outputHeight} px
                </p>
              </div>

              {image && (
                <div className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600">
                  ✓ Siap diproses
                </div>
              )}
            </div>

            {/* PREVIEW AREA */}
            <div className="flex min-h-[650px] items-center justify-center overflow-hidden rounded-2xl bg-slate-900 p-6 shadow-xl">
              {!image ? (
                <div className="text-center text-white">
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-4xl">
                    📸
                  </div>

                  <h3 className="text-xl font-black">
                    Belum ada foto
                  </h3>

                  <p className="mt-2 max-w-sm text-sm text-slate-400">
                    Upload foto untuk melihat
                    hasil resize di sini.
                  </p>
                </div>
              ) : (
                <div
                  className="relative max-h-[600px] max-w-full overflow-hidden rounded-xl bg-white shadow-2xl"
                  onMouseDown={startDrag}
                  onMouseMove={moveDrag}
                  onMouseUp={stopDrag}
                  onMouseLeave={stopDrag}
                  style={{
                    cursor: dragging
                      ? "grabbing"
                      : "grab",
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    className="block max-h-[600px] max-w-full"
                  />

                  <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center">
                    <span className="rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-medium text-white">
                      Geser foto untuk mengatur posisi
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* DOWNLOAD */}
            {image && (
              <div className="mt-4 rounded-2xl border border-purple-100 bg-purple-50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-black">
                      Foto sudah siap 🎉
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      {outputWidth} × {outputHeight} px •{" "}
                      {format.toUpperCase()}
                    </p>
                  </div>

                  <button
                    onClick={downloadImage}
                    disabled={processing}
                    className="rounded-xl bg-purple-600 px-6 py-3 font-bold text-white shadow-lg hover:bg-purple-700 disabled:opacity-60"
                  >
                    {processing
                      ? "⏳ Memproses..."
                      : "⬇️ Download"}
                  </button>
                </div>
              </div>
            )}

            {/* INFO */}
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Info
                icon="🔒"
                title="Privasi"
                text="Foto diproses langsung di browser."
              />

              <Info
                icon="⚡"
                title="Cepat"
                text="Tidak perlu menunggu upload server."
              />

              <Info
                icon="📱"
                title="Praktis"
                text="Bisa digunakan dari HP maupun komputer."
              />
            </div>
          </section>
        </div>

        {/* ========================================
            SEO CONTENT
        ======================================== */}

        <section className="mx-auto max-w-5xl px-5 pb-20">
          <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-black md:text-3xl">
              Resize Foto 3×4, 4×6, dan 2×3 Online
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Ubah ukuran foto menjadi pas foto 2×3,
              3×4, atau 4×6 dengan mudah menggunakan
              tool resize foto online dari Urusin.
              Kamu cukup memilih foto, menentukan ukuran
              yang dibutuhkan, mengatur posisi foto,
              kemudian download hasilnya.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              Tool ini dapat digunakan untuk berbagai
              kebutuhan dokumen dan administrasi.
              Foto dapat diproses langsung dari browser
              tanpa perlu diunggah ke server.
            </p>

            <h2 className="mt-8 text-2xl font-black">
              Pilihan Ukuran Pas Foto
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="text-lg font-black">
                  Pas Foto 2×3
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Pilih ukuran 2×3 untuk membuat pas foto
                  dengan rasio 2 banding 3 sesuai kebutuhan
                  dokumen.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="text-lg font-black">
                  Pas Foto 3×4
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Ukuran 3×4 merupakan salah satu ukuran
                  pas foto yang umum digunakan untuk berbagai
                  kebutuhan administrasi dan dokumen.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="text-lg font-black">
                  Pas Foto 4×6
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Gunakan pilihan 4×6 jika membutuhkan
                  pas foto dengan ukuran yang lebih besar
                  dan rasio 4 banding 6.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="text-lg font-black">
                  Ukuran Custom
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Jika ukuran yang dibutuhkan tidak tersedia
                  pada pilihan preset, gunakan mode Custom
                  untuk menentukan lebar dan tinggi foto
                  sendiri dalam pixel.
                </p>
              </div>
            </div>

            <h2 className="mt-10 text-2xl font-black">
              Cara Mengubah Ukuran Foto
            </h2>

            <ol className="mt-5 space-y-3 text-slate-600">
              <li>
                <strong>1. Upload foto.</strong>{" "}
                Pilih foto JPG, PNG, atau WebP dari HP
                maupun komputer.
              </li>

              <li>
                <strong>2. Pilih ukuran.</strong>{" "}
                Tentukan ukuran 2×3, 3×4, 4×6, atau
                gunakan ukuran Custom.
              </li>

              <li>
                <strong>3. Atur posisi foto.</strong>{" "}
                Geser foto dan gunakan pengaturan zoom
                untuk mendapatkan posisi yang sesuai.
              </li>

              <li>
                <strong>4. Pilih format.</strong>{" "}
                Kamu dapat menyimpan hasil dalam format
                JPG atau PNG.
              </li>

              <li>
                <strong>5. Download.</strong>{" "}
                Setelah selesai, download foto hasil resize
                langsung ke perangkat kamu.
              </li>
            </ol>

            <h2 className="mt-10 text-2xl font-black">
              Pertanyaan yang Sering Ditanyakan
            </h2>

            <div className="mt-5 divide-y divide-slate-200 rounded-xl border border-slate-200">
              <Faq
                question="Apakah resize foto di Urusin gratis?"
                answer="Ya. Tool resize foto Urusin dapat digunakan secara gratis untuk mengubah ukuran foto menjadi 2×3, 3×4, 4×6, atau ukuran custom."
              />

              <Faq
                question="Bisa ubah foto menjadi ukuran 3×4?"
                answer="Bisa. Upload foto, pilih ukuran 3×4, lalu atur posisi dan zoom foto sebelum mendownload hasilnya."
              />

              <Faq
                question="Bisa ubah foto menjadi ukuran 2×3?"
                answer="Bisa. Pilih preset 2×3 setelah mengupload foto. Kamu juga dapat mengatur posisi foto sebelum menyimpan hasilnya."
              />

              <Faq
                question="Bisa resize foto menjadi 4×6?"
                answer="Bisa. Pilih ukuran 4×6 pada bagian Pilih Ukuran, kemudian atur foto dan download hasilnya."
              />

              <Faq
                question="Apakah foto saya diupload ke server?"
                answer="Tidak. Foto diproses langsung di browser sehingga foto tidak perlu dikirim ke server untuk diproses."
              />

              <Faq
                question="Format foto apa yang bisa digunakan?"
                answer="Urusin mendukung foto dalam format JPG, PNG, dan WebP dengan ukuran file maksimal 10 MB."
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

// ========================================
// INFO CARD
// ========================================

function Info({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-2 text-2xl">
        {icon}
      </div>

      <h3 className="font-bold">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}

// ========================================
// FAQ
// ========================================

function Faq({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="p-5">
      <h3 className="font-bold text-slate-900">
        {question}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {answer}
      </p>
    </div>
  );
}