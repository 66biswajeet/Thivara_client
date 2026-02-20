import { NextResponse } from "next/server";

const ADMIN_HOST_FALLBACK = (
  process.env.ADMIN_HOST ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_MULTIKART_API ||
  "http://localhost:3000"
)
  // Remove any trailing `/api` portion if env was provided with it
  .replace(/\/api\/?$/, "")
  // Ensure no trailing slash
  .replace(/\/$/, "");

/**
 * Transform admin product data to client format
 */
function transformProduct(product) {
  if (!product) return null;

  // Helper to get image URL
  const getImageUrl = (imageObj) => {
    if (!imageObj) return null;
    return imageObj.original_url || imageObj.url || null;
  };

  // Normalize image values coming from admin panel. Admin may return:
  // - null
  // - an object with `original_url` or `url`
  // - a string path (e.g. "/uploads/abc.png") or full URL
  const ADMIN_HOST = ADMIN_HOST_FALLBACK;

  const normalizeImage = (img) => {
    if (!img) return null;
    if (typeof img === "string") {
      const raw = img;
      const url = raw.startsWith("http")
        ? raw
        : `${ADMIN_HOST}${raw.startsWith("/") ? "" : "/"}${raw}`;
      return { original_url: url };
    }
    if (typeof img === "object") {
      const url =
        img.original_url ||
        img.url ||
        img.path ||
        img.src ||
        img?.url?.href ||
        null;
      if (!url) return null;
      const finalUrl = url.startsWith("http")
        ? url
        : `${ADMIN_HOST}${url.startsWith("/") ? "" : "/"}${url}`;
      return { original_url: finalUrl };
    }
    return null;
  };

  // Admin may store media in `media` array (see example). Prefer media[].url when present.
  const primaryMedia = Array.isArray(product.media)
    ? product.media.find((m) => m.type === "image" && m.is_primary) ||
      product.media.find((m) => m.type === "image")
    : null;

  const normalizedThumbnail = normalizeImage(
    primaryMedia?.url || product.product_thumbnail || primaryMedia,
  );
  const normalizedGalleries =
    Array.isArray(product.product_galleries) && product.product_galleries.length
      ? product.product_galleries.map(normalizeImage).filter(Boolean)
      : Array.isArray(product.media)
        ? product.media
            .filter((m) => m.type === "image")
            .map((m) => normalizeImage(m.url || m))
            .filter(Boolean)
        : [];

  const normalizedVariations = Array.isArray(product.variations)
    ? product.variations.map((v) => ({
        ...v,
        variation_image: normalizeImage(v.variation_image),
      }))
    : [];

  return {
    id: product._id || product.id,
    name: product.product_name || product.name,
    short_description: product.short_description,
    description: product.description,
    type: product.type,
    unit: product.unit,
    weight: product.weight,
    quantity: product.quantity || 0,
    // Map admin `standard_price` (or fallback to product.price)
    price: Number.isFinite(parseFloat(product.standard_price))
      ? parseFloat(product.standard_price)
      : Number.isFinite(parseFloat(product.price))
        ? parseFloat(product.price)
        : 0,
    sale_price: Number.isFinite(parseFloat(product.sale_price))
      ? parseFloat(product.sale_price)
      : Number.isFinite(parseFloat(product.standard_price))
        ? parseFloat(product.standard_price)
        : Number.isFinite(parseFloat(product.price))
          ? parseFloat(product.price)
          : 0,
    discount: product.discount,
    is_featured: product.is_featured,
    shipping_days: product.shipping_days,
    is_cod: product.is_cod,
    is_free_shipping: product.is_free_shipping,
    is_sale_enable: product.is_sale_enable,
    is_return: product.is_return,
    is_trending: product.is_trending,
    is_approved: product.is_approved,
    is_external: product.is_external,
    external_url: product.external_url,
    external_button_text: product.external_button_text,
    sale_starts_at: product.sale_starts_at,
    sale_expired_at: product.sale_expired_at,
    sku: product.sku,
    is_random_related_products: product.is_random_related_products,
    stock_status: product.stock_status,
    meta_title: product.meta_title,
    meta_description: product.meta_description,
    estimated_delivery_text: product.estimated_delivery_text,
    return_policy_text: product.return_policy_text,
    safe_checkout: product.safe_checkout,
    secure_checkout: product.secure_checkout,
    social_share: product.social_share,
    encourage_order: product.encourage_order,
    encourage_view: product.encourage_view,
    slug: product.slug,
    status: product.status,
    store_id: product.store_id,
    created_by_id: product.created_by_id,
    tax_id: product.tax_id,
    preview_type: product.preview_type,
    product_type: product.product_type,
    separator: product.separator,
    is_licensable: product.is_licensable,
    license_type: product.license_type,
    preview_url: product.preview_url,
    watermark: product.watermark,
    watermark_position: product.watermark_position,
    brand_id: product.brand_id,
    watermark_image_id: product.watermark_image_id,
    wholesale_price_type: product.wholesale_price_type,
    is_licensekey_auto: product.is_licensekey_auto,
    preview_audio_file_id: product.preview_audio_file_id,
    preview_video_file_id: product.preview_video_file_id,
    deleted_at: product.deleted_at,
    created_at: product.created_at,
    updated_at: product.updated_at,
    orders_count: product.orders_count || 0,
    reviews_count: product.reviews_count || 0,
    can_review: product.can_review,
    order_amount: product.order_amount || 0,
    is_wishlist: product.is_wishlist,
    rating_count: product.rating_count,
    review_ratings: product.review_ratings || [0, 0, 0, 0, 0],
    related_products: product.related_products || [],
    cross_sell_products: product.cross_sell_products || [],
    wholesales: product.wholesales || [],
    variations: normalizedVariations,
    variation_galleries: product.variation_galleries || [],
    product_galleries: normalizedGalleries,
    product_thumbnail: normalizedThumbnail,
    product_thumbnail_id: product.product_thumbnail_id,
    product_meta_image: product.product_meta_image,
    size_chart_image: product.size_chart_image,
    brand: product.brand,
    // Map category_id from admin to client-friendly categories array
    categories: product.category_id
      ? [
          {
            id: product.category_id._id || product.category_id.id,
            name:
              product.category_id.name ||
              product.category_id.display_name ||
              null,
            path: product.category_id.path || [],
          },
        ]
      : product.categories || [],
    store: product.store,
    tags: product.tags || [],
    tax: product.tax,
    attributes: product.attributes || [],
  };
}

export async function GET(request) {
  try {
    const searchParams = request?.nextUrl?.searchParams;
    const productId = searchParams.get("id");

    // If 'id' query param is present, try multiple admin endpoints to locate the single product
    if (productId) {
      const isObjectId = /^[a-fA-F0-9]{24}$/.test(productId);

      // Try a series of admin endpoints in order until one returns OK
      const tryEndpoints = [];
      const baseAdmin = ADMIN_HOST_FALLBACK.replace(/\/$/, "");
      // path style: /api/product/:id
      tryEndpoints.push(`${baseAdmin}/api/product/${productId}`);
      // slug path: /api/product/slug/:slug
      tryEndpoints.push(`${baseAdmin}/api/product/slug/${productId}`);
      // query style: /api/product?id=...
      tryEndpoints.push(`${baseAdmin}/api/product?id=${productId}`);
      // query style slug param (some APIs use slug=)
      tryEndpoints.push(`${baseAdmin}/api/product?slug=${productId}`);

      let response = null;
      let lastErrorBody = null;

      for (const url of tryEndpoints) {
        try {
          const res = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          });
          if (res.ok) {
            response = res;
            console.debug(
              `[product API] successful fetch: ${url} status=${res.status}`,
            );
            break;
          } else {
            const text = await res.text().catch(() => "");
            lastErrorBody = `status=${res.status} body=${text}`;
            console.debug(
              `[product API] fetch failed: ${url} ${lastErrorBody}`,
            );
          }
        } catch (e) {
          console.debug(`[product API] fetch error for ${url}: ${e.message}`);
        }
      }

      if (!response) {
        console.debug(
          `[product API] all attempts failed for id=${productId}. lastError=${lastErrorBody}`,
        );
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 },
        );
      }

      // parse response JSON and normalize
      const data = await response.json();

      // Admin may return the product in multiple shapes:
      // - { data: { ...product } }
      // - { data: [ product ] } (list response)
      // - { ...product }
      // - { product: { ... } }
      let productSource = null;
      if (data == null) {
        productSource = null;
      } else if (data.product) {
        productSource = data.product;
      } else if (data.data && Array.isArray(data.data)) {
        // If the admin returned an array, prefer the item that matches the requested id
        if (productId) {
          const found = data.data.find(
            (itm) =>
              itm &&
              (itm._id === productId ||
                itm.id === productId ||
                itm.slug === productId),
          );
          productSource = found || (data.data.length ? data.data[0] : null);
        } else {
          productSource = data.data.length ? data.data[0] : null;
        }
      } else if (data.data && typeof data.data === "object") {
        productSource = data.data;
      } else {
        productSource = data;
      }

      if (!productSource) {
        console.debug(
          `[product API] no product object found in admin response for id=${productId}`,
          data,
        );
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 },
        );
      }

      const transformedProduct = transformProduct(productSource);
      return NextResponse.json(transformedProduct);
    }

    // Otherwise, fetch product list
    const queryString = searchParams.toString();
    const adminApiUrl = `${ADMIN_HOST_FALLBACK.replace(/\/$/, "")}/api/product${
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
      throw new Error("Failed to fetch products from admin panel");
    }

    const data = await response.json();

    // Transform the products data
    if (data.data && Array.isArray(data.data)) {
      data.data = data.data.map(transformProduct);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
        // include message to aid debugging in deployment logs / client (non-sensitive)
        error: error?.message || String(error),
        data: [],
      },
      { status: 500 },
    );
  }
}
