"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Job = {
  id: number;
  title: string;
  location: string;
  snippet: string;
  salary: string;
  source: string;
  type: string;
  link: string;
  company: string;
  updated: string;
};

const popularPositions = [
  "Admin",
  "Kasir",
  "Sales",
  "Driver",
  "Staff Gudang",
  "Customer Service",
  "Marketing",
  "Programmer",
  "Operator",
  "Accounting",
];

const popularCities = [
  "Makassar",
  "Jakarta",
  "Surabaya",
  "Bandung",
  "Medan",
  "Semarang",
  "Yogyakarta",
  "Denpasar",
];

function cleanSnippet(text: string) {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "";
  }
}

export default function AsistenCariKerjaPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const [showPositionMenu, setShowPositionMenu] = useState(false);
  const [showCityMenu, setShowCityMenu] = useState(false);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const positionRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        positionRef.current &&
        !positionRef.current.contains(target)
      ) {
        setShowPositionMenu(false);
      }

      if (cityRef.current && !cityRef.current.contains(target)) {
        setShowCityMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function choosePosition(position: string) {
    setKeyword(position);
    setShowPositionMenu(false);
  }

  function chooseCity(city: string) {
    setLocation(city);
    setShowCityMenu(false);
  }

  async function searchJobs(event?: FormEvent) {
    event?.preventDefault();

    const q = keyword.trim();
    const loc = location.trim();

    if (!q) {
      setError("Pilih atau masukkan posisi pekerjaan.");
      return;
    }

    if (!loc) {
      setError("Pilih atau masukkan kota/lokasi.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const response = await fetch(
        `/api/jobs?q=${encodeURIComponent(
          q
        )}&location=${encodeURIComponent(loc)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Gagal mengambil lowongan."
        );
      }

      setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.error(err);

      setJobs([]);
      setTotalCount(0);
      setError(
        "Gagal mengambil lowongan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              💼 Asisten Cari Kerja
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Cari lowongan kerja dengan mudah
            </h1>

            <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
              Cari pekerjaan berdasarkan posisi dan kota yang
              kamu inginkan.
            </p>
          </div>

          {/* SEARCH */}
          <form
            onSubmit={searchJobs}
            className="mx-auto mt-8 max-w-5xl"
          >
            <div className="rounded-2xl border bg-white p-3 shadow-lg">
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                {/* POSITION */}
                <div
                  ref={positionRef}
                  className="relative"
                >
                  <label
                    htmlFor="keyword"
                    className="mb-1.5 block px-1 text-xs font-semibold text-slate-500"
                  >
                    POSISI / PEKERJAAN
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      🔎
                    </span>

                    <input
                      id="keyword"
                      value={keyword}
                      onChange={(e) => {
                        setKeyword(e.target.value);
                        setShowPositionMenu(true);
                      }}
                      onFocus={() =>
                        setShowPositionMenu(true)
                      }
                      placeholder="Contoh: Kasir"
                      autoComplete="off"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPositionMenu(
                          !showPositionMenu
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-200"
                      aria-label="Pilih posisi"
                    >
                      ▼
                    </button>
                  </div>

                  {showPositionMenu && (
                    <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-xl border bg-white shadow-xl">
                      <div className="border-b px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Posisi populer
                        </p>
                      </div>

                      <div className="max-h-72 overflow-y-auto p-2">
                        {popularPositions
                          .filter((position) =>
                            position
                              .toLowerCase()
                              .includes(
                                keyword.toLowerCase()
                              )
                          )
                          .map((position) => (
                            <button
                              key={position}
                              type="button"
                              onClick={() =>
                                choosePosition(position)
                              }
                              className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm hover:bg-blue-50 hover:text-blue-700"
                            >
                              🔎
                              <span className="ml-3">
                                {position}
                              </span>
                            </button>
                          ))}

                        {popularPositions.filter(
                          (position) =>
                            position
                              .toLowerCase()
                              .includes(
                                keyword.toLowerCase()
                              )
                        ).length === 0 && (
                          <div className="px-3 py-4 text-sm text-slate-500">
                            Tekan Enter untuk mencari:
                            <strong className="ml-1 text-slate-700">
                              {keyword}
                            </strong>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* CITY */}
                <div
                  ref={cityRef}
                  className="relative"
                >
                  <label
                    htmlFor="location"
                    className="mb-1.5 block px-1 text-xs font-semibold text-slate-500"
                  >
                    KOTA / LOKASI
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      📍
                    </span>

                    <input
                      id="location"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setShowCityMenu(true);
                      }}
                      onFocus={() =>
                        setShowCityMenu(true)
                      }
                      placeholder="Contoh: Makassar"
                      autoComplete="off"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowCityMenu(!showCityMenu)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-200"
                      aria-label="Pilih kota"
                    >
                      ▼
                    </button>
                  </div>

                  {showCityMenu && (
                    <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-xl border bg-white shadow-xl">
                      <div className="border-b px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Kota populer
                        </p>
                      </div>

                      <div className="max-h-72 overflow-y-auto p-2">
                        {popularCities
                          .filter((city) =>
                            city
                              .toLowerCase()
                              .includes(
                                location.toLowerCase()
                              )
                          )
                          .map((city) => (
                            <button
                              key={city}
                              type="button"
                              onClick={() =>
                                chooseCity(city)
                              }
                              className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm hover:bg-blue-50 hover:text-blue-700"
                            >
                              📍
                              <span className="ml-3">
                                {city}
                              </span>
                            </button>
                          ))}

                        {popularCities.filter(
                          (city) =>
                            city
                              .toLowerCase()
                              .includes(
                                location.toLowerCase()
                              )
                        ).length === 0 && (
                          <div className="px-3 py-4 text-sm text-slate-500">
                            Tekan Enter untuk mencari:
                            <strong className="ml-1 text-slate-700">
                              {location}
                            </strong>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* SEARCH BUTTON */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 md:h-[48px]"
                  >
                    {loading ? "Mencari..." : "🔍 Cari Lowongan"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* RESULTS */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <div className="text-3xl">🔎</div>

            <p className="mt-3 font-semibold">
              Sedang mencari lowongan...
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Kami sedang mencari pekerjaan yang sesuai.
            </p>
          </div>
        )}

        {!loading && searched && !error && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold sm:text-2xl">
                {totalCount.toLocaleString("id-ID")} lowongan
                ditemukan
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Untuk posisi{" "}
                <strong className="text-slate-700">
                  {keyword}
                </strong>{" "}
                di{" "}
                <strong className="text-slate-700">
                  {location}
                </strong>
              </p>
            </div>

            {jobs.length === 0 ? (
              <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
                <div className="text-4xl">😕</div>

                <h3 className="mt-3 font-semibold">
                  Lowongan tidak ditemukan
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Coba posisi atau kota yang berbeda.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <article
                    key={job.id}
                    className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-slate-900">
                          {job.title}
                        </h3>

                        <p className="mt-1 font-medium text-slate-700">
                          {job.company || "Perusahaan"}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          {job.location && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                              📍 {job.location}
                            </span>
                          )}

                          {job.type && (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                              💼 {job.type}
                            </span>
                          )}

                          {job.salary && (
                            <span className="rounded-full bg-green-50 px-3 py-1 text-green-700">
                              💰 {job.salary}
                            </span>
                          )}
                        </div>

                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                          {cleanSnippet(job.snippet)}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                        <a
                          href={job.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          Lihat Lowongan →
                        </a>

                        {job.updated && (
                          <span className="text-xs text-slate-400">
                            Diperbarui{" "}
                            {formatDate(job.updated)}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {!loading && !searched && (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">💼</div>

            <h2 className="mt-4 text-xl font-bold">
              Temukan pekerjaan berikutnya
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Pilih posisi dan kota yang kamu inginkan,
              lalu mulai mencari lowongan.
            </p>
          </div>
        )}
      </section>

      {/* INFO */}
      <section className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold">
            Cari lowongan kerja dengan Urusin
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Asisten Cari Kerja Urusin membantu pencari kerja
            menemukan lowongan berdasarkan posisi dan lokasi.
            Untuk saat ini, kamu dapat mencari lowongan dan
            melanjutkan ke sumber lowongan untuk melihat detail
            serta proses lamaran.
          </p>
        </div>
      </section>
    </main>
  );
}