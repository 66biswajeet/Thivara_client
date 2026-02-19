import { NextResponse } from "next/server";

/**
 * Transform vendor product data to client format
 */
function transformVendorProduct(product) {
  if (!product) return null;

  // Helper to normalize image values
  const ADMIN_HOST = process.env.ADMIN_HOST || "http://localhost:3000";

  const normalizeImage = (img) => {
    if (!img) return null;
    if (typeof img === "string") {
      const url = img.startsWith("http")
        ? img
        : `${ADMIN_HOST}${img.startsWith("/") ? "" : "/"}${img}`;
      return { original_url: url };
    }
    if (typeof img === "object") {
      const url = img.original_url || img.url || img.path || img.src || null;
      if (!url) return null;
      const finalUrl = url.startsWith("http")
        ? url
        : `${ADMIN_HOST}${url.startsWith("/") ? "" : "/"}${url}`;
      return { original_url: finalUrl };
    }
    return null;
  };

  // Normalize media array
  const normalizedThumbnail = normalizeImage(product.product_thumbnail);
  const normalizedGalleries = Array.isArray(product.product_galleries)
    ? product.product_galleries.map(normalizeImage).filter(Boolean)
    : Array.isArray(product.media)
      ? product.media.map((m) => normalizeImage(m.url || m)).filter(Boolean)
      : [];

  return {
    id: product.id || product._id,
    master_product_id: product.master_product_id,
    vendor_product_id: product.vendor_product_id,
    name: product.product_name || product.name,
    short_description: product.short_description,
    description: product.description,
    type: product.type,
    sku: product.sku,

    // Vendor-specific pricing
    price: Number.isFinite(parseFloat(product.price))
      ? parseFloat(product.price)
      : 0,
    sale_price: Number.isFinite(parseFloat(product.price))
      ? parseFloat(product.price)
      : 0,
    base_price: Number.isFinite(parseFloat(product.base_price))
      ? parseFloat(product.base_price)
      : 0,
    floor_price: Number.isFinite(parseFloat(product.floor_price))
      ? parseFloat(product.floor_price)
      : 0,

    // Stock and availability
    quantity: product.stock_quantity || 0,
    stock_quantity: product.stock_quantity || 0,
    stock_status: product.stock_status,

    // Vendor information
    vendor_id: product.vendor_id,
    vendor_name: product.vendor_name,
    vendor_email: product.vendor_email,

    // Product details
    condition: product.condition,
    shipping_info: product.shipping_info,
    shipping_weight: product.shipping_weight,
    dimensions: product.dimensions,

    // Images
    product_thumbnail: normalizedThumbnail,
    product_galleries: normalizedGalleries,

    // Categories and brand
    categories: product.category_id
      ? [
          {
            id: product.category_id._id || product.category_id.id,
            name:
              product.category_id.name ||
              product.category_id.display_name ||
              null,
            slug: product.category_id.slug,
            path: product.category_id.path || [],
          },
        ]
      : product.categories || [],
    brand: product.brand_id
      ? {
          id: product.brand_id._id || product.brand_id.id,
          name: product.brand_id.name,
        }
      : product.brand,
    brand_id: product.brand_id,

    // Other attributes
    slug: product.slug,
    status: product.status || 1,
    is_active: product.is_active,
    attribute_values: product.attribute_values || [],
    variant_values: product.variant_values || [],
    selected_variants: product.selected_variants || {},
    type: product.type || "simple", // Ensure type is set (default to simple)

    // Metadata
    created_at: product.created_at,
    updated_at: product.updated_at,

    // Default values for client compatibility
    is_featured: false,
    is_trending: false,
    is_sale_enable: false,
    orders_count: 0,
    reviews_count: 0,
    rating_count: null,
    review_ratings: [0, 0, 0, 0, 0],
    related_products: [],
    cross_sell_products: [],
    tags: [],
    variations: [],
  };
}

export async function GET(request) {
  try {
    const searchParams = request?.nextUrl?.searchParams;
    const queryString = searchParams.toString();
    const slug = searchParams.get("slug");

    console.log("📦 Client Vendor Products API - Params:", queryString);

    // Forward request to admin panel vendor-products API
    const adminApiUrl = `http://localhost:3000/api/vendor-products${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(adminApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      console.error(
        "❌ Admin vendor-products API error:",
        response.status,
        response.statusText,
      );
      return NextResponse.json(
        { success: false, message: "Failed to fetch vendor products" },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Transform the products array
    if (data.data && Array.isArray(data.data)) {
      data.data = data.data.map(transformVendorProduct);
    }

    console.log(`✅ Returning ${data.data?.length || 0} vendor products`);

    // If requesting a specific product by slug or vendor_product_id, return just that product
    const vendorProductId = searchParams.get("vendor_product_id");
    if ((slug || vendorProductId) && data.data?.length > 0) {
      const product = slug
        ? data.data.find((p) => p.slug === slug)
        : data.data.find(
            (p) =>
              p.vendor_product_id?.toString() === vendorProductId ||
              p.id?.toString() === vendorProductId,
          );

      if (product) {
        console.log(
          "✅ Returning single vendor product:",
          product.id,
          product.vendor_name,
        );
        return NextResponse.json(product);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Client vendor-products API error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
