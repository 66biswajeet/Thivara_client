import { NextResponse } from "next/server";

/**
 * Transform admin product data to client format
 */
function transformProduct(product) {
  if (!product) return null;
  const ADMIN_HOST = process.env.ADMIN_HOST || "http://localhost:3000";

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
    product_meta_image: product.product_meta_image,
    size_chart_image: product.size_chart_image,
    brand: product.brand,
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

export async function GET(_, { params }) {
  try {
    const productId = (await params).productId;

    // Check if this is a vendor product ID (ObjectId format - 24 hex chars) or slug
    const isObjectId = /^[a-fA-F0-9]{24}$/.test(productId);
    const isVendorProductSlug =
      productId.includes("-") && productId.length > 30;

    // Try to fetch from vendor-products API first for vendor products
    if (isObjectId || isVendorProductSlug) {
      try {
        const vendorProductUrl = isObjectId
          ? `http://localhost:3001/api/vendor-products?vendor_product_id=${productId}`
          : `http://localhost:3001/api/vendor-products?slug=${productId}`;

        const vendorProductResponse = await fetch(vendorProductUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (vendorProductResponse.ok) {
          const vendorData = await vendorProductResponse.json();
          // Handle both cases: single product object or array in data
          let vendorProduct = null;

          if (vendorData.id || vendorData.vendor_product_id) {
            // vendor-products API returned a single product object directly
            vendorProduct = vendorData;
          } else if (vendorData.data && Array.isArray(vendorData.data)) {
            // vendor-products API returned array in data field
            vendorProduct = isObjectId
              ? vendorData.data.find(
                  (p) =>
                    p.vendor_product_id?.toString() === productId ||
                    p.id?.toString() === productId,
                )
              : vendorData.data.find((p) => p.slug === productId);
          }

          if (vendorProduct) {
            console.log(
              "✅ Found vendor product:",
              vendorProduct.id,
              vendorProduct.vendor_name,
            );
            return NextResponse.json(vendorProduct);
          }
        }
      } catch (e) {
        console.log(
          "Not a vendor product, trying master product...",
          e.message,
        );
      }
    }

    // Fallback to master product - Determine whether productId is an ObjectId or a slug
    const isMasterObjectId = /^[a-fA-F0-9]{24}$/.test(productId);
    const ADMIN_HOST = process.env.ADMIN_HOST || "http://localhost:3000";
    const primaryUrl = isMasterObjectId
      ? `${ADMIN_HOST}/api/product/${productId}`
      : `${ADMIN_HOST}/api/product/slug/${productId}`;
    const fallbackUrl = isMasterObjectId
      ? `${ADMIN_HOST}/api/product/slug/${productId}`
      : `${ADMIN_HOST}/api/product/${productId}`;

    // Try primary URL first, then fallback URL if the first fails (covers slug vs id mismatches)
    let response = await fetch(primaryUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      // attempt fallback
      const fallbackResponse = await fetch(fallbackUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (fallbackResponse.ok) {
        response = fallbackResponse;
      } else {
        throw new Error(
          `Failed to fetch product from admin panel (tried ${primaryUrl} and ${fallbackUrl})`,
        );
      }
    }

    const data = await response.json();

    // Transform the product data
    const transformedProduct = data.data
      ? transformProduct(data.data)
      : transformProduct(data);

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, message: "Product not found" },
      { status: 404 },
    );
  }
}
