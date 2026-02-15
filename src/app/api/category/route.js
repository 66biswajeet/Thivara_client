import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Forward all query parameters to the admin panel API
    const queryString = searchParams.toString();
    const adminApiUrl = `http://localhost:3000/api/category${
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
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
