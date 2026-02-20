import { NextResponse } from "next/server";
import { setCorsHeaders, handleCorsPreFlight } from "@/lib/cors";

/**
 * Transform categories into menu format
 */
function transformCategoriesToMenu(categories) {
  return categories.map((category, index) => {
    const hasChildren =
      category.subcategories && category.subcategories.length > 0;

    return {
      id: category.id,
      title: category.name,
      sort: index.toString(),
      link_type: hasChildren ? "sub" : "link",
      is_target_blank: 0,
      mega_menu: 0,
      mega_menu_type: "simple",
      slug: category.slug,
      type: null,
      path: hasChildren ? null : `/collection?category=${category.slug}`,
      badge_text: null,
      badge_color: null,
      content_item: null,
      item_image_id: null,
      banner_image_id: null,
      set_page_link: null,
      parent_id: null,
      created_by_id: "1",
      created_at: category.created_at,
      product_ids: [],
      blog_ids: [],
      item_image: category.category_image || null,
      banner_image: null,
      child: hasChildren
        ? transformCategoriesToMenu(category.subcategories)
        : [],
    };
  });
}

export async function OPTIONS(request) {
  return handleCorsPreFlight(request);
}

export async function GET(request) {
  try {
    // Fetch categories from admin panel with tree structure
<<<<<<< HEAD
    const ADMIN_HOST =
      process.env.ADMIN_HOST ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_MULTIKART_API ||
      new URL(request.url).origin ||
      "http://localhost:3000";

    const adminApiUrl = `${ADMIN_HOST.replace(/\/$/, "")}/api/category?type=product&include_subcategories=true&status=1`;
=======
    const ADMIN_HOST = process.env.ADMIN_HOST || "http://localhost:3000";
    const adminApiUrl = `${ADMIN_HOST}/api/category?type=product&include_subcategories=true&status=1`;
>>>>>>> c3a63f2119f5fda8178f83991f69e378b1a87159

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

    if (!data.success || !data.data) {
      throw new Error("Invalid response from admin panel");
    }

    // Transform categories to menu format
    const menuItems = transformCategoriesToMenu(data.data);

    // Return in the expected menu format
    const response_obj = NextResponse.json({
      current_page: 1,
      data: menuItems,
      first_page_url: null,
      from: 1,
      last_page: 1,
      last_page_url: null,
      links: [],
      next_page_url: null,
      path: null,
      per_page: menuItems.length,
      prev_page_url: null,
      to: menuItems.length,
      total: menuItems.length,
    });
    return setCorsHeaders(response_obj);
  } catch (error) {
    console.error("Error fetching menu categories:", error);
    const error_response = NextResponse.json(
      {
        success: false,
        message: "Failed to fetch menu categories",
        error: error.message,
      },
      { status: 500 },
    );
    return setCorsHeaders(error_response);
  }
}
