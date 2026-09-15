import { NextResponse } from "next/server";

const MODEL_URL =
  "https://2zaw1zher7hmyaq9.public.blob.vercel-storage.com/u2net.onnx";

export async function GET() {
  try {
    const response = await fetch(MODEL_URL, {
      cache: "force-cache",
    });

    if (!response.ok || !response.body) {
      return new NextResponse("Gagal mengambil model.", {
        status: 502,
      });
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Cache-Control": "public, max-age=2592000, immutable",
        "Content-Disposition": "inline; filename=\"u2net.onnx\"",
      },
    });
  } catch (error) {
    console.error("U2Net proxy error:", error);

    return new NextResponse("Gagal mengambil model.", {
      status: 500,
    });
  }
}