import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ error: "SSO is disabled for this deployment." }, { status: 404 });
}

export function POST() {
  return NextResponse.json({ error: "SSO is disabled for this deployment." }, { status: 404 });
}
