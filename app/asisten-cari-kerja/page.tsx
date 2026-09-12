"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type ApplicationStatus =
| "Tersimpan"
| "Sudah Lamar"
| "Menunggu"
| "Interview"
| "Diterima"
| "Ditolak";

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
applicationStatus?: ApplicationStatus;
applicationDate?: string;
followUpDate?: string;
followUpNote?: string;
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

const SAVED_JOBS_STORAGE_KEY = "urusin-saved-jobs";

function cleanSnippet(text: string) {
return text
.replace(/<[^>]*>/g, " ")
.replace(/ /g, " ")
.replace(/&/g, "&")
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

function getTodayDate() {
const today = new Date();

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

return `${year}-${month}-${day}`;
}

function getFollowUpStatus(date: string) {
if (!date) return "none";

const today = getTodayDate();

if (date < today) return "overdue";
if (date === today) return "today";

return "upcoming";
}

export default function AsistenCariKerjaPage() {
const [keyword, setKeyword] = useState("");
const [location, setLocation] = useState("");

const [showPositionMenu, setShowPositionMenu] = useState(false);
const [showCityMenu, setShowCityMenu] = useState(false);

const [jobs, setJobs] = useState<Job[]>([]);
const [totalCount, setTotalCount] = useState(0);

const [savedJobs, setSavedJobs] = useState<Job[]>([]);
const [savedJobsLoaded, setSavedJobsLoaded] = useState(false);

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

  if (
    cityRef.current &&
    !cityRef.current.contains(target)
  ) {
    setShowCityMenu(false);
  }
}

document.addEventListener("mousedown", handleClickOutside);

return () => {
  document.removeEventListener(
    "mousedown",
    handleClickOutside
  );
};


}, []);

// Load lowongan tersimpan
useEffect(() => {
try {
const saved = localStorage.getItem(
SAVED_JOBS_STORAGE_KEY
);


  if (saved) {
    const parsed = JSON.parse(saved);

    if (Array.isArray(parsed)) {
      setSavedJobs(parsed);
    }
  }
} catch (error) {
  console.error(
    "Gagal membaca lowongan tersimpan:",
    error
  );
} finally {
  setSavedJobsLoaded(true);
}


}, []);

// Simpan lowongan ke localStorage
useEffect(() => {
if (!savedJobsLoaded) return;


try {
  localStorage.setItem(
    SAVED_JOBS_STORAGE_KEY,
    JSON.stringify(savedJobs)
  );
} catch (error) {
  console.error(
    "Gagal menyimpan lowongan:",
    error
  );
}


}, [savedJobs, savedJobsLoaded]);

function choosePosition(position: string) {
setKeyword(position);
setShowPositionMenu(false);
}

function chooseCity(city: string) {
setLocation(city);
setShowCityMenu(false);
}

function isJobSaved(job: Job) {
return savedJobs.some(
(savedJob) => savedJob.id === job.id
);
}

function toggleSavedJob(job: Job) {
setSavedJobs((current) => {
const alreadySaved = current.some(
(savedJob) => savedJob.id === job.id
);


  if (alreadySaved) {
    return current.filter(
      (savedJob) => savedJob.id !== job.id
    );
  }

  return [job, ...current];
});


}

function updateApplicationStatus(
jobId: number,
status: ApplicationStatus
) {
setSavedJobs((current) =>
current.map((job) =>
job.id === jobId
? {
...job,
applicationStatus: status,
}
: job
)

);


}

function updateApplicationDate(
jobId: number,
date: string
) {
setSavedJobs((current) =>
current.map((job) =>
job.id === jobId
? {
...job,
applicationDate: date,
}
: job
)
);
}

function updateFollowUpDate(
jobId: number,
date: string
) {
setSavedJobs((current) =>
current.map((job) =>
job.id === jobId
? {
...job,
followUpDate: date,
}
: job
)
);
}

function updateFollowUpNote(
jobId: number,
note: string
) {
setSavedJobs((current) =>
current.map((job) =>
job.id === jobId
? {
...job,
followUpNote: note,
}
: job
)
);
}

// Ringkasan status lamaran
const statusCounts = {
Tersimpan: savedJobs.filter(
(job) =>
!job.applicationStatus ||
job.applicationStatus === "Tersimpan"
).length,

"Sudah Lamar": savedJobs.filter(
  (job) => job.applicationStatus === "Sudah Lamar"
).length,

Menunggu: savedJobs.filter(
  (job) => job.applicationStatus === "Menunggu"
).length,

Interview: savedJobs.filter(
  (job) => job.applicationStatus === "Interview"
).length,

Diterima: savedJobs.filter(
  (job) => job.applicationStatus === "Diterima"
).length,

Ditolak: savedJobs.filter(
  (job) => job.applicationStatus === "Ditolak"
).length,


};

const followUpJobs = savedJobs.filter(
(job) =>
job.followUpDate &&
job.applicationStatus !== "Diterima" &&
job.applicationStatus !== "Ditolak"
);

const overdueFollowUps = followUpJobs.filter(
(job) => getFollowUpStatus(job.followUpDate || "") === "overdue"
);

const todayFollowUps = followUpJobs.filter(
(job) => getFollowUpStatus(job.followUpDate || "") === "today"
);

const upcomingFollowUps = followUpJobs.filter(
(job) => getFollowUpStatus(job.followUpDate || "") === "upcoming"
);

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

  setJobs(
    Array.isArray(data.jobs)
      ? data.jobs
      : []
  );

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

return ( <main className="min-h-screen bg-slate-50 text-slate-900">
{/* HERO */} <section className="border-b bg-white"> <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"> <div className="mx-auto max-w-3xl text-center"> <div className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
💼 Asisten Cari Kerja </div>


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
                {loading
                  ? "Mencari..."
                  : "🔍 Cari Lowongan"}
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
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

            {savedJobs.length > 0 && (
              <div className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                ❤️ {savedJobs.length} tersimpan
              </div>
            )}
          </div>
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

                    <button
                      type="button"
                      onClick={() =>
                        toggleSavedJob(job)
                      }
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        isJobSaved(job)
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {isJobSaved(job)
                        ? "❤️ Tersimpan"
                        : "♡ Simpan"}
                    </button>

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

        {savedJobs.length > 0 && (
          <p className="mt-4 text-sm font-semibold text-red-600">
            ❤️ {savedJobs.length} lowongan tersimpan
          </p>
        )}
      </div>
    )}
  </section>

  {/* SAVED JOBS */}
  {savedJobs.length > 0 && (
    <section className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold sm:text-2xl">
            ❤️ Lowongan Tersimpan
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Lowongan yang kamu simpan tersimpan di perangkat
            ini.
          </p>
        </div>

        {/* RINGKASAN STATUS */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-2xl border bg-slate-50 p-4">
            <div className="text-2xl">🔖</div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {statusCounts.Tersimpan}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              Tersimpan
            </p>
          </div>

          <div className="rounded-2xl border bg-blue-50 p-4">
            <div className="text-2xl">📨</div>
            <p className="mt-2 text-2xl font-bold text-blue-700">
              {statusCounts["Sudah Lamar"]}
            </p>
            <p className="text-xs font-semibold text-blue-600">
              Sudah Lamar
            </p>
          </div>

          <div className="rounded-2xl border bg-yellow-50 p-4">
            <div className="text-2xl">⏳</div>
            <p className="mt-2 text-2xl font-bold text-yellow-700">
              {statusCounts.Menunggu}
            </p>
            <p className="text-xs font-semibold text-yellow-600">
              Menunggu
            </p>
          </div>

          <div className="rounded-2xl border bg-purple-50 p-4">
            <div className="text-2xl">🎤</div>
            <p className="mt-2 text-2xl font-bold text-purple-700">
              {statusCounts.Interview}
            </p>
            <p className="text-xs font-semibold text-purple-600">
              Interview
            </p>
          </div>

          <div className="rounded-2xl border bg-green-50 p-4">
            <div className="text-2xl">🎉</div>
            <p className="mt-2 text-2xl font-bold text-green-700">
              {statusCounts.Diterima}
            </p>
            <p className="text-xs font-semibold text-green-600">
              Diterima
            </p>
          </div>

          <div className="rounded-2xl border bg-red-50 p-4">
            <div className="text-2xl">❌</div>
            <p className="mt-2 text-2xl font-bold text-red-700">
              {statusCounts.Ditolak}
            </p>
            <p className="text-xs font-semibold text-red-600">
              Ditolak
            </p>
          </div>
        </div>

        {/* RINGKASAN FOLLOW-UP */}
        {followUpJobs.length > 0 && (
          <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔔</span>
                  <h3 className="font-bold text-orange-900">
                    Reminder Follow-up Lamaran
                  </h3>
                </div>

                <p className="mt-1 text-sm text-orange-800">
                  {overdueFollowUps.length > 0 && (
                    <>
                      <strong>
                        {overdueFollowUps.length}
                      </strong>{" "}
                      terlambat
                    </>
                  )}

                  {todayFollowUps.length > 0 && (
                    <>
                      {overdueFollowUps.length > 0 && " • "}
                      <strong>
                        {todayFollowUps.length}
                      </strong>{" "}
                      perlu follow-up hari ini
                    </>
                  )}

                  {upcomingFollowUps.length > 0 && (
                    <>
                      {(overdueFollowUps.length > 0 ||
                        todayFollowUps.length > 0) &&
                        " • "}
                      <strong>
                        {upcomingFollowUps.length}
                      </strong>{" "}
                      akan datang
                    </>
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-white px-4 py-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-orange-700">
                  {followUpJobs.length}
                </p>
                <p className="text-xs font-semibold text-orange-600">
                  Total Reminder
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {savedJobs.map((job) => {
            const cvParams = new URLSearchParams({
              job: job.title,
              company: job.company || "",
              location: job.location || "",
            }).toString();

            const letterParams = new URLSearchParams({
              job: job.title,
              company: job.company || "",
              location: job.location || "",
            }).toString();

            const followUpStatus = getFollowUpStatus(
              job.followUpDate || ""
            );

            return (
              <article
                key={job.id}
                className="rounded-2xl border bg-slate-50 p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-slate-900">
                      {job.title}
                    </h3>

                    <p className="mt-1 font-medium text-slate-700">
                      {job.company || "Perusahaan"}
                    </p>

                    <div className="mt-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          job.applicationStatus === "Diterima"
                            ? "bg-green-50 text-green-700"
                            : job.applicationStatus === "Ditolak"
                            ? "bg-red-50 text-red-700"
                            : job.applicationStatus === "Interview"
                            ? "bg-purple-50 text-purple-700"
                            : job.applicationStatus === "Sudah Lamar"
                            ? "bg-blue-50 text-blue-700"
                            : job.applicationStatus === "Menunggu"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {job.applicationStatus || "Tersimpan"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {job.location && (
                        <span className="rounded-full bg-white px-3 py-1 text-slate-600">
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

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
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

                    {/* BUAT CV & SURAT LAMARAN */}
                    <div className="grid w-full grid-cols-2 gap-2 sm:w-auto">
                      <a
                        href={`/cv?${cvParams}`}
                        className="rounded-xl bg-slate-100 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                      >
                        📄 Buat CV
                      </a>

                      <a
                        href={`/surat-lamaran?${letterParams}`}
                        className="rounded-xl bg-blue-50 px-4 py-2.5 text-center text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        ✉️ Surat Lamaran
                      </a>
                    </div>

                    {/* STATUS LAMARAN */}
                    <div className="w-full sm:w-auto">
                      <label
                        htmlFor={`status-saved-${job.id}`}
                        className="mb-1.5 block text-xs font-semibold text-slate-500"
                      >
                        STATUS LAMARAN
                      </label>

                      <select
                        id={`status-saved-${job.id}`}
                        value={
                          job.applicationStatus ||
                          "Tersimpan"
                        }
                        onChange={(e) =>
                          updateApplicationStatus(
                            job.id,
                            e.target
                              .value as ApplicationStatus
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-44"
                      >
                        <option value="Tersimpan">
                          🔖 Tersimpan
                        </option>

                        <option value="Sudah Lamar">
                          📨 Sudah Lamar
                        </option>

                        <option value="Menunggu">
                          ⏳ Menunggu
                        </option>

                        <option value="Interview">
                          🎤 Interview
                        </option>

                        <option value="Diterima">
                          🎉 Diterima
                        </option>

                        <option value="Ditolak">
                          ❌ Ditolak
                        </option>
                      </select>
                    </div>

                    {/* REMINDER FOLLOW-UP */}
                    <div className="w-full rounded-2xl border border-orange-200 bg-orange-50 p-4 sm:w-auto sm:min-w-[280px]">
                      <div className="mb-3">
                        <p className="text-sm font-bold text-orange-900">
                          🔔 Reminder Follow-up
                        </p>

                        <p className="mt-1 text-xs text-orange-700">
                          Atur kapan kamu ingin follow-up
                          perusahaan.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {/* TANGGAL LAMAR */}
                        <div>
                          <label
                            htmlFor={`application-date-${job.id}`}
                            className="mb-1.5 block text-xs font-semibold text-orange-900"
                          >
                            📅 TANGGAL LAMAR
                          </label>

                          <input
                            id={`application-date-${job.id}`}
                            type="date"
                            value={
                              job.applicationDate || ""
                            }
                            onChange={(e) =>
                              updateApplicationDate(
                                job.id,
                                e.target.value
                              )
                            }
                            className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                          />
                        </div>

                        {/* TANGGAL FOLLOW-UP */}
                        <div>
                          <label
                            htmlFor={`follow-up-date-${job.id}`}
                            className="mb-1.5 block text-xs font-semibold text-orange-900"
                          >
                            🔔 TANGGAL FOLLOW-UP
                          </label>

                          <input
                            id={`follow-up-date-${job.id}`}
                            type="date"
                            value={
                              job.followUpDate || ""
                            }
                            onChange={(e) =>
                              updateFollowUpDate(
                                job.id,
                                e.target.value
                              )
                            }
                            className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                          />
                        </div>

                        {/* STATUS REMINDER */}
                        {job.followUpDate && (
                          <div>
                            {followUpStatus ===
                              "overdue" && (
                              <div className="rounded-xl bg-red-100 px-3 py-2.5 text-xs font-semibold text-red-700">
                                ⚠️ Follow-up terlambat —{" "}
                                {formatDate(
                                  job.followUpDate
                                )}
                              </div>
                            )}

                            {followUpStatus ===
                              "today" && (
                              <div className="rounded-xl bg-yellow-100 px-3 py-2.5 text-xs font-semibold text-yellow-800">
                                🔔 Hari ini waktunya
                                follow-up!
                              </div>
                            )}

                            {followUpStatus ===
                              "upcoming" && (
                              <div className="rounded-xl bg-green-100 px-3 py-2.5 text-xs font-semibold text-green-700">
                                📅 Follow-up{" "}
                                {formatDate(
                                  job.followUpDate
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* CATATAN */}
                        <div>
                          <label
                            htmlFor={`follow-up-note-${job.id}`}
                            className="mb-1.5 block text-xs font-semibold text-orange-900"
                          >
                            📝 CATATAN
                          </label>

                          <textarea
                            id={`follow-up-note-${job.id}`}
                            value={
                              job.followUpNote || ""
                            }
                            onChange={(e) =>
                              updateFollowUpNote(
                                job.id,
                                e.target.value
                              )
                            }
                            placeholder="Contoh: Hubungi HR lewat WhatsApp..."
                            rows={2}
                            className="w-full resize-none rounded-xl border border-orange-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        toggleSavedJob(job)
                      }
                      className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Hapus dari Simpanan
                    </button>

                    {job.updated && (
                      <span className="text-xs text-slate-400">
                        Diperbarui{" "}
                        {formatDate(job.updated)}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  )}

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
