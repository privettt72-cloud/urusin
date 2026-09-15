"use client";

import { useEffect, useState } from "react";
import {
  remove,
  newSession,
} from "@bunnio/rembg-web";

type BackgroundOption = {
  name: string;
  value: string;
};

const backgrounds: BackgroundOption[] = [
  {
    name: "Transparan",
    value: "transparent",
  },
  {
    name: "Putih",
    value: "#ffffff",
  },
  {
    name: "Merah",
    value: "#ff0000",
  },
  {
    name: "Biru",
    value: "#0000ff",
  },
];

const U2NET_MODEL_URL =
  "https://2zaw1zher7hmyaq9.public.blob.vercel-storage.com/u2net.onnx";


export default function GantiBackgroundPage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState("");
  const [removedImage, setRemovedImage] = useState("");
  const [selectedBackground, setSelectedBackground] =
    useState("transparent");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (originalPreview) {
        URL.revokeObjectURL(originalPreview);
      }

      if (removedImage) {
        URL.revokeObjectURL(removedImage);
      }
    };
  }, [originalPreview, removedImage]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setError("");
    setRemovedImage("");
    setProgress(0);
    setStatus("");

    if (!selectedFile.type.startsWith("image/")) {
      setFile(null);
      setOriginalPreview("");
      setError("File harus berupa gambar.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null);
      setOriginalPreview("");
      setError("Ukuran gambar maksimal 10 MB.");
      return;
    }

    if (originalPreview) {
      URL.revokeObjectURL(originalPreview);
    }

    const previewUrl = URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setOriginalPreview(previewUrl);
  };

  const removeBackground = async () => {
    if (!file) {
      setError("Pilih foto terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setRemovedImage("");
      setProgress(0);
      setStatus("Menyiapkan AI...");

     const session = await newSession("u2net_custom", {
      modelPath: U2NET_MODEL_URL,
    }); 
 
    const result = await remove(file, {  
     session,
     postProcessMask: true,
     onProgress: (info) => {
      setProgress(info.progress);
      setStatus(info.message);
    },
   });
      
      setError(
        "Gagal menghapus background. Coba gunakan foto yang lebih jelas atau ukuran file yang lebih kecil."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = async () => {
    if (!removedImage) return;

    try {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          setError("Browser tidak mendukung proses gambar.");
          return;
        }

        if (selectedBackground !== "transparent") {
          ctx.fillStyle = selectedBackground;
          ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
          );
        }

        ctx.drawImage(image, 0, 0);

        const link = document.createElement("a");

        link.href = canvas.toDataURL(
          selectedBackground === "transparent"
            ? "image/png"
            : "image/jpeg",
          0.95
        );

        link.download =
          selectedBackground === "transparent"
            ? "hasil-background-transparan.png"
            : "hasil-ganti-background.jpg";

        document.body.appendChild(link);
        link.click();
        link.remove();
      };

      image.src = removedImage;
    } catch {
      setError("Gagal mengunduh gambar.");
    }
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
          <div className="mb-4 text-5xl">🎨</div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ganti Background Foto Online
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Hapus background foto secara otomatis dan ganti
            dengan warna putih, merah, biru, atau transparan.
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <label
            htmlFor="image-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-12 text-center transition hover:border-gray-500 hover:bg-gray-50"
          >
            <div className="text-4xl">🖼️</div>

            <div className="mt-4 text-lg font-semibold">
              Pilih foto
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

          {originalPreview && (
            <div className="mt-6">
              <h2 className="font-semibold">
                Foto yang dipilih
              </h2>

              <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3">
                <img
                  src={originalPreview}
                  alt="Foto yang dipilih"
                  className="mx-auto max-h-[500px] max-w-full object-contain"
                />
              </div>

              <button
                type="button"
                onClick={removeBackground}
                disabled={loading}
                className="mt-5 w-full rounded-xl bg-black px-5 py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {loading
                  ? "Memproses..."
                  : "🎨 Hapus Background"}
              </button>

              {loading && (
                <div className="mt-4">
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-black transition-all"
                      style={{
                        width: `${Math.max(progress, 5)}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-center text-sm text-gray-500">
                    {status || "Sedang memproses..."}
                  </p>
                </div>
              )}
            </div>
          )}

          {removedImage && (
            <div className="mt-8">
              <h2 className="font-semibold">
                Pilih Background
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {backgrounds.map((background) => {
                  const selected =
                    selectedBackground === background.value;

                  return (
                    <button
                      key={background.value}
                      type="button"
                      onClick={() =>
                        setSelectedBackground(background.value)
                      }
                      className={`rounded-xl border-2 px-4 py-4 text-sm font-semibold transition ${
                        selected
                          ? "border-gray-900 bg-gray-100"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div
                        className="mx-auto mb-2 h-8 w-8 rounded-full border border-gray-300"
                        style={{
                          background:
                            background.value === "transparent"
                              ? "linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%)"
                              : background.value,
                          backgroundSize:
                            background.value === "transparent"
                              ? "12px 12px"
                              : undefined,
                          backgroundPosition:
                            background.value === "transparent"
                              ? "0 0, 0 6px, 6px -6px, -6px 0px"
                              : undefined,
                        }}
                      />

                      {background.name}
                    </button>
                  );
                })}
              </div>

              <div
                className="mt-6 overflow-hidden rounded-xl border border-gray-200 p-4"
                style={{
                  background:
                    selectedBackground === "transparent"
                      ? "linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)"
                      : selectedBackground,
                  backgroundSize:
                    selectedBackground === "transparent"
                      ? "20px 20px"
                      : undefined,
                  backgroundPosition:
                    selectedBackground === "transparent"
                      ? "0 0, 0 10px, 10px -10px, -10px 0px"
                      : undefined,
                }}
              >
                <img
                  src={removedImage}
                  alt="Hasil foto tanpa background"
                  className="mx-auto max-h-[600px] max-w-full object-contain"
                />
              </div>

              <button
                type="button"
                onClick={downloadResult}
                className="mt-5 w-full rounded-xl bg-black px-5 py-3.5 font-semibold text-white transition hover:bg-gray-800"
              >
                ⬇️ Download Foto
              </button>
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">
            Ganti Background Foto Online Gratis
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Ganti Background Foto Urusin membantu menghapus
            background dari foto secara otomatis menggunakan
            teknologi AI yang berjalan langsung di browser.
            Setelah background dihapus, kamu dapat memilih
            warna background baru sesuai kebutuhan.
          </p>

          <h2 className="mt-8 text-2xl font-bold">
            Ganti Background untuk Pas Foto
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Tool ini dapat digunakan untuk menyiapkan foto
            dengan background putih, merah, atau biru. Cocok
            untuk kebutuhan pas foto, dokumen, administrasi,
            lamaran kerja, dan berbagai keperluan lainnya.
          </p>

          <h2 className="mt-8 text-2xl font-bold">
            Cara Mengganti Background Foto
          </h2>

          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-7 text-gray-600">
            <li>Pilih foto dari perangkat.</li>
            <li>Klik Hapus Background.</li>
            <li>Tunggu proses AI selesai.</li>
            <li>Pilih warna background yang diinginkan.</li>
            <li>Klik Download Foto.</li>
          </ol>

          <h2 className="mt-8 text-2xl font-bold">
            Diproses Langsung di Browser
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Proses penghapusan background dilakukan langsung
            pada browser menggunakan model AI. Foto tidak perlu
            dikirim ke server Urusin untuk diproses.
          </p>

          <h2 className="mt-8 text-2xl font-bold">
            Pertanyaan yang Sering Ditanyakan
          </h2>

          <div className="mt-4 space-y-5">
            <div>
              <h3 className="font-semibold">
                Apakah ganti background foto gratis?
              </h3>

              <p className="mt-1 text-gray-600">
                Ya. Tool ini dapat digunakan secara gratis.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Apakah bisa membuat background merah?
              </h3>

              <p className="mt-1 text-gray-600">
                Bisa. Kamu dapat memilih background putih,
                merah, biru, atau transparan.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Apakah foto saya diupload ke server?
              </h3>

              <p className="mt-1 text-gray-600">
                Tidak. Proses penghapusan background dilakukan
                langsung di browser.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Apakah hasil penghapusan background selalu
                sempurna?
              </h3>

              <p className="mt-1 text-gray-600">
                Tidak selalu. Hasil dapat berbeda tergantung
                kualitas foto, pencahayaan, posisi objek, dan
                kompleksitas background.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}