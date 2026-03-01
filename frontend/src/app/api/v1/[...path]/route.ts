import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, await params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, await params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, await params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, await params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, await params);
}

async function proxyRequest(
  request: NextRequest,
  { path }: { path: string[] },
) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.json(
      { error: "Backend URL not configured" },
      { status: 500 },
    );
  }

  const pathStr = path.join("/");
  const searchParams = request.nextUrl.search;
  const url = `${backendUrl}/api/v1/${pathStr}${searchParams}`;

  const cookieStore = await cookies();
  const allCookies = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const headers = new Headers(request.headers);
  headers.set("Cookie", allCookies);
  // Remove host header to avoid SSL/SNI issues
  headers.delete("host");

  try {
    const body =
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.arrayBuffer()
        : undefined;

    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
      // @ts-ignore - internal fetch options
      duplex: body ? "half" : undefined,
    });

    const data = await response.arrayBuffer();
    const responseHeaders = new Headers(response.headers);

    // Clean up response headers that might conflict with Next.js
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");
    responseHeaders.delete("transfer-encoding");

    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 },
    );
  }
}
