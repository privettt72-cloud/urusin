"use client";

import { ChangeEvent, useMemo, useState } from "react";
import jsPDF from "jspdf";

type PhotoItem = {
  id: string;
  file: File;
  preview: string;
};

export default function FotoKePdfPage() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fileName, setFileName] = useState("foto-gabungan");

  const totalSize = useMemo(() => {
    return photos.reduce((total, photo) => total + photo.file.size, 0);
  }, [photos]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
    );

    const newPhotos = validFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((current) => [...current, ...newPhotos]);

    event.target.value = "";
  };

  const removePhoto = (id: string) => {
    setPhotos((current) => {
      const photo = current.find((item) => item.id === id);

      if (photo) {
        URL.revokeObjectURL(photo.preview);
      }

      return current.filter((item) => item.id !== id);
    });
  };

  const movePhoto = (index: number, direction: "up" | "down") => {
    setPhotos((current) => {
      const newPhotos = [...current];

      const targetIndex =
        direction === "up" ? index - 1 : index + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= newPhotos.length
      ) {
        return current;
      }

      [newPhotos[index], newPhotos[targetIndex]] = [
        newPhotos[targetIndex],
        newPhotos[index],
      ];

      return newPhotos;
    });
  };

  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = URL.createObjectURL(file);
    });
  };

  const generatePdf = async () => {
    if (photos.length === 0) return;

    setIsGenerating(true);

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;

      for (let i = 0; i < photos.length; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const image = await loadImage(photos[i].file);

        const imageWidth = image.naturalWidth;
        const imageHeight = image.naturalHeight;

        const ratio = Math.min(
          maxWidth / imageWidth,
          maxHeight / imageHeight,
        );

        const width = imageWidth * ratio;
        const height = imageHeight * ratio;

        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas tidak tersedia.");
        }

        canvas.width = imageWidth;
        canvas.height = imageHeight;

        context.drawImage(
          image,
          0,
          0,
          imageWidth,
          imageHeight,
        );

        const imageData = canvas.toDataURL("image/jpeg", 0.92);

        pdf.addImage(
          imageData,
          "JPEG",
          x,
          y,
          width,
          height,
        );

        URL.revokeObjectURL(image.src);
      }

      const cleanName =
        fileName.trim().replace(/[^a-zA-Z0-9-_]/g, "-") ||
        "foto-gabungan";

      pdf.save(`${cleanName}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Gagal membuat PDF. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const clearAll = () => {
    photos.forEach((photo) => {
      URL.revokeObjectURL(photo.preview);
    });

    setPhotos([]);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">📄</div>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Foto ke PDF Online
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Gabungkan foto JPG, JPEG, dan PNG menjadi satu file PDF
            secara gratis tanpa login.
          </p>
        </div>

        {/* Upload */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <label
            htmlFor="photo-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 px-6 py-12 text-center transition hover:border-blue-500 hover:bg-blue-50"
          >
            <div className="mb-3 text-4xl">📷</div>

            <div className="text-lg font-semibold text-gray-900">
              Pilih foto
            </div>

            <p className="mt-1 text-sm text-gray-500">
              JPG, JPEG, atau PNG • Bisa pilih beberapa foto
            </p>

            <span className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">
              Pilih Foto
            </span>

            <input
              id="photo-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </section>

        {/* Photos */}
        {photos.length > 0 && (
          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Foto yang dipilih
                </h2>

                <p className="text-sm text-gray-500">
                  {photos.length} foto • {formatSize(totalSize)}
                </p>
              </div>

              <button
                type="button"
                onClick={clearAll}
                className="text-sm font-semibold text-red-600 hover:text-red-700"
              >
                Hapus Semua
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                >
                  <div className="relative aspect-[4/3] bg-gray-100">
                    <img
                      src={photo.preview}
                      alt={photo.file.name}
                      className="h-full w-full object-contain"
                    />

                    <span className="absolute left-2 top-2 rounded-lg bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                  </div>

                  <div className="p-3">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {photo.file.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {formatSize(photo.file.size)}
                    </p>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          movePhoto(index, "up")
                        }
                        disabled={index === 0}
                        className="flex-1 rounded-lg border border-gray-300 px-2 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ↑
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          movePhoto(index, "down")
                        }
                        disabled={index === photos.length - 1}
                        className="flex-1 rounded-lg border border-gray-300 px-2 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ↓
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          removePhoto(photo.id)
                        }
                        className="flex-1 rounded-lg border border-red-200 px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* File name */}
            <div className="mt-6">
              <label
                htmlFor="file-name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Nama file PDF
              </label>

              <input
                id="file-name"
                type="text"
                value={fileName}
                onChange={(event) =>
                  setFileName(event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="foto-gabungan"
              />
            </div>

            {/* Generate */}
            <button
              type="button"
              onClick={generatePdf}
              disabled={isGenerating}
              className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating
                ? "Sedang Membuat PDF..."
                : `📄 Gabungkan ${photos.length} Foto Jadi PDF`}
            </button>
          </section>
        )}

        {/* SEO */}
        <section className="mt-10 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Foto ke PDF Online Gratis
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            Foto ke PDF dari Urusin membantu kamu menggabungkan
            beberapa foto menjadi satu file PDF dengan mudah. Kamu
            bisa memilih foto JPG, JPEG, atau PNG, mengatur urutannya,
            lalu membuat file PDF langsung dari browser.
          </p>

          <h3 className="mt-7 text-xl font-bold text-gray-900">
            Cara mengubah foto menjadi PDF
          </h3>

          <ol className="mt-4 list-decimal space-y-2 pl-5 text-gray-600">
            <li>Pilih satu atau beberapa foto.</li>
            <li>Atur urutan foto jika diperlukan.</li>
            <li>Masukkan nama file PDF.</li>
            <li>Klik tombol Gabungkan Foto Jadi PDF.</li>
            <li>File PDF akan otomatis tersimpan.</li>
          </ol>

          <h3 className="mt-7 text-xl font-bold text-gray-900">
            Bisa digunakan untuk apa?
          </h3>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-600">
            <li>Menggabungkan foto dokumen menjadi PDF.</li>
            <li>Membuat PDF dari foto tugas.</li>
            <li>Menggabungkan foto untuk keperluan administrasi.</li>
            <li>Membuat satu PDF dari beberapa gambar.</li>
            <li>Mengubah JPG atau PNG menjadi PDF.</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900">
            FAQ Foto ke PDF
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <h3 className="font-semibold text-gray-900">
                Apakah Foto ke PDF gratis?
              </h3>
              <p className="mt-1 text-gray-600">
                Ya. Tool ini dapat digunakan secara gratis tanpa
                perlu login.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Apakah bisa menggabungkan banyak foto?
              </h3>
              <p className="mt-1 text-gray-600">
                Bisa. Kamu dapat memilih beberapa foto sekaligus
                dan menggabungkannya menjadi satu file PDF.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Apakah foto saya diupload ke server?
              </h3>
              <p className="mt-1 text-gray-600">
                Tidak. Proses pembuatan PDF dilakukan langsung
                di browser perangkat kamu.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Format foto apa yang didukung?
              </h3>
              <p className="mt-1 text-gray-600">
                Tool ini mendukung JPG, JPEG, dan PNG.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-10 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Urusin. Biar urusanmu beres.
        </footer>
      </div>
    </main>
  );
}