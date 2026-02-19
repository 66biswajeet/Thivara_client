import coupon from "./coupon.json";
import { NextResponse } from "next/server";
import { setCorsHeaders, handleCorsPreFlight } from "@/lib/cors";

export async function OPTIONS(request) {
  return handleCorsPreFlight(request);
}

export async function GET() {
  const response = NextResponse.json(coupon);
  return setCorsHeaders(response);
}
