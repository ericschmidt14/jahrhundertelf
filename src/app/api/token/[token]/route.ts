import { FCN_WEB_API } from "@/app/lib/constants";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const res = await fetch(`${FCN_WEB_API}/${token}`, {
    method: "GET",
    headers: {
      Accept: "*/*",
    },
    cache: "no-store",
  });
  const data = res.status === 200 ? await res.json() : await res.text();

  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const res = await fetch(`${FCN_WEB_API}/${token}`, {
    method: "DELETE",
    headers: {
      Accept: "*/*",
    },
  });
  const status = res.status;

  return Response.json(status);
}
