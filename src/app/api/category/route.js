import { NextResponse } from "next/server";
import { setCorsHeaders, handleCorsPreFlight } from "@/lib/cors";

export async function OPTIONS(request) {
  return handleCorsPreFlight(request);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Forward all query parameters to the admin panel API
    const queryString = searchParams.toString();
    const ADMIN_HOST = process.env.ADMIN_HOST || "http://localhost:3000";
    const adminApiUrl = `${ADMIN_HOST}/api/category${
      queryString ? `?${queryString}` : ""
    }`;

    // Fetch categories from admin panel
    const response = await fetch(adminApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories from admin panel");
    }

    const data = await response.json();
    const response_obj = NextResponse.json(data);
    return setCorsHeaders(response_obj);
  } catch (error) {
    console.error("Error fetching categories:", error);
    const error_response = NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
    return setCorsHeaders(error_response);
  }
}
