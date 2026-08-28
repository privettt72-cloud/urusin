
"use client";

import { useEffect, useRef, useState } from "react";

export default function CompressFotoPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [quality, setQuality] = useState(0.7);
  const [maxWidth, setMaxWidth] = useState(1600);
  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [processing, setProcessing] = useState(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 KB";

    const kb = bytes / 1024;

    if (kb < 1024) {
      return `${kb.toFixed(0)} KB`;
    }

    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      alert("Silakan pilih file gambar.");
      return;
    }

    if (selectedFile.size > 20 * 1024 * 1024) {
      alert("Ukuran foto maksimal 20 MB.");
      return;
    }

    setFile(selectedFile);
    setResultUrl("");
    setResultSize(0);

    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const compressImage = () => {
    if (!file) {
      alert("Upload foto terlebih dahulu.");
      return;
    }

    setProcessing(true);

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        const ratio = maxWidth / width;

        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setProcessing(false);
        URL.revokeObjectURL(objectUrl);
        return;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        img,
        0,
        0,
        width,
        height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setProcessing(false);
            URL.revokeObjectURL(objectUrl);
            return;
          }

          const url = URL.createObjectURL(blob);

          setResultUrl(url);
          setResultSize(blob.size);
          setProcessing(false);

          URL.revokeObjectURL(objectUrl);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      setProcessing(false);
      URL.revokeObjectURL(objectUrl);
      alert("Foto tidak dapat diproses.");
    };

    img.src = objectUrl;
  };

  const downloadImage = () => {
    if (!resultUrl) return;

    const link = document.createElement("a");

    const originalName =
      file?.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-") ||
      "foto";

    link.download = `${originalName}-compressed.jpg`;
    link.href = resultUrl;

    link.click();
  };

  const removeFile = () => {
    setFile(null);
    setPreview("");
    setResultUrl("");
    setResultSize(0);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
    };
  }, []);

  const reduction =
    file && resultSize
      ? Math.max(
          0,
          Math.round(
            ((file.size - resultSize) /
              file.size) *
              100
          )
        )
      : 0;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">

      {/* HEADER */}

      <header className="border-b bg-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">

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

      <section className="mx-auto max-w-6xl px-5 pb-8 pt-10">

        <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">
          🗜️ Urusin Tools
        </div>

        <h1 className="text-3xl font-black md:text-4xl">
          Compress Foto
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          Kecilkan ukuran file foto tanpa
          proses yang rumit. Cocok untuk
          upload lamaran kerja, formulir,
          dokumen, dan kebutuhan online.
        </p>

      </section>


      {/* CONTENT */}

      <div className="mx-auto grid max-w-6xl gap-7 px-5 pb-20 lg:grid-cols-[380px_1fr]">

        {/* SETTINGS */}

        <div className="space-y-5">

          {/* UPLOAD */}

          <section className="rounded-2xl bg-white p-5 shadow-sm">

            <h2 className="mb-4 text-lg font-black">
              📷 Pilih Foto
            </h2>

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleChange}
              className="hidden"
            />

            {!file ? (

              <button
                onClick={() =>
                  inputRef.current?.click()
                }
                className="w-full rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center hover:border-blue-400 hover:bg-blue-50"
              >

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                  🖼️
                </div>

                <div className="font-bold">
                  Klik untuk upload foto
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  JPG, PNG, atau WebP
                  <br />
                  Maksimal 20 MB
                </p>

              </button>

            ) : (

              <div className="space-y-3">

                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl">
                      🖼️
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-bold">
                        {file.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {formatBytes(file.size)}
                      </p>

                    </div>

                  </div>

                </div>

                <div className="grid grid-cols-2 gap-2">

                  <button
                    onClick={() =>
                      inputRef.current?.click()
                    }
                    className="rounded-xl border border-slate-200 py-2.5 text-sm font-bold hover:bg-slate-50"
                  >
                    🔄 Ganti
                  </button>

                  <button
                    onClick={removeFile}
                    className="rounded-xl border border-red-100 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50"
                  >
                    🗑️ Hapus
                  </button>

                </div>

              </div>

            )}

          </section>


          {/* QUALITY */}

          <section className="rounded-2xl bg-white p-5 shadow-sm">

            <h2 className="mb-1 text-lg font-black">
              ⚙️ Pengaturan
            </h2>

            <p className="mb-5 text-xs text-slate-500">
              Semakin tinggi kualitas,
              semakin besar ukuran file.
            </p>

            <div className="mb-6">

              <div className="mb-2 flex justify-between">

                <label className="text-sm font-bold">
                  Kualitas
                </label>

                <span className="font-bold text-blue-600">
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


            <div>

              <label className="mb-2 block text-sm font-bold">
                Lebar maksimal
              </label>

              <select
                value={maxWidth}
                onChange={(e) =>
                  setMaxWidth(
                    Number(e.target.value)
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value={800}>
                  800 px
                </option>

                <option value={1200}>
                  1200 px
                </option>

                <option value={1600}>
                  1600 px
                </option>

                <option value={2000}>
                  2000 px
                </option>

                <option value={3000}>
                  3000 px
                </option>
              </select>

            </div>

          </section>


          {/* BUTTON */}

          <button
            onClick={compressImage}
            disabled={!file || processing}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-black text-white shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing
              ? "⏳ Mengompres Foto..."
              : "✨ Kompres Foto"}
          </button>

        </div>


        {/* PREVIEW */}

        <section>

          <div className="mb-4">

            <h2 className="text-xl font-black">
              Preview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Bandingkan ukuran sebelum
              dan sesudah dikompres.
            </p>

          </div>


          <div className="grid gap-5 md:grid-cols-2">

            {/* ORIGINAL */}

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

              <div className="border-b px-5 py-4">

                <h3 className="font-black">
                  Foto Asli
                </h3>

                {file && (
                  <p className="mt-1 text-xs text-slate-500">
                    {formatBytes(file.size)}
                  </p>
                )}

              </div>

              <div className="flex min-h-[420px] items-center justify-center bg-slate-900 p-5">

                {preview ? (

                  <img
                    src={preview}
                    alt="Foto asli"
                    className="max-h-[390px] max-w-full rounded-lg object-contain shadow-xl"
                  />

                ) : (

                  <div className="text-center text-slate-500">

                    <div className="mb-3 text-4xl">
                      📷
                    </div>

                    <p className="text-sm">
                      Belum ada foto
                    </p>

                  </div>

                )}

              </div>

            </div>


            {/* RESULT */}

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

              <div className="border-b px-5 py-4">

                <h3 className="font-black">
                  Hasil Kompres
                </h3>

                {resultSize > 0 && (
                  <p className="mt-1 text-xs font-bold text-green-600">
                    {formatBytes(resultSize)}
                  </p>
                )}

              </div>

              <div className="flex min-h-[420px] items-center justify-center bg-slate-900 p-5">

                {resultUrl ? (

                  <img
                    src={resultUrl}
                    alt="Hasil kompres"
                    className="max-h-[390px] max-w-full rounded-lg object-contain shadow-xl"
                  />

                ) : (

                  <div className="text-center text-slate-500">

                    <div className="mb-3 text-4xl">
                      🗜️
                    </div>

                    <p className="text-sm">
                      Hasil akan muncul di sini
                    </p>

                  </div>

                )}

              </div>

            </div>

          </div>


          {/* RESULT INFO */}

          {resultUrl && (

            <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <div className="mb-1 font-black text-green-800">
                    🎉 Foto berhasil dikompres
                  </div>

                  <p className="text-sm text-green-700">

                    {formatBytes(file?.size || 0)}
                    {" → "}
                    {formatBytes(resultSize)}

                    {reduction > 0 && (
                      <span className="ml-2 font-black">
                        ({reduction}% lebih kecil)
                      </span>
                    )}

                  </p>

                </div>

                <button
                  onClick={downloadImage}
                  className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white shadow hover:bg-green-700"
                >
                  ⬇️ Download JPG
                </button>

              </div>

            </div>

          )}


          {/* BENEFITS */}

          <div className="mt-5 grid gap-4 sm:grid-cols-3">

            <Info
              icon="🔒"
              title="Privasi"
              text="Foto diproses langsung di perangkat kamu."
            />

            <Info
              icon="⚡"
              title="Cepat"
              text="Tidak perlu menunggu upload ke server."
            />

            <Info
              icon="📱"
              title="Praktis"
              text="Bisa digunakan melalui HP maupun komputer."
            />

          </div>

        </section>

      </div>

    </main>
  );
}

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

