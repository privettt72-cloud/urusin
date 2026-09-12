import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.JOOBLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "JOOBLE_API_KEY belum dikonfigurasi" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);

    const keywords = searchParams.get("q") || "admin";
    const location = searchParams.get("location") || "Makassar";

    const response = await fetch(
      `https://id.jooble.org/api/${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords,
          location,
          page: 1,
          ResultOnPage: 20,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Gagal mengakses Jooble",
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Jooble API error:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil lowongan" },
      { status: 500 }
    );
  }
}