import axios from "axios";
import https from "https";

import ProductDetailContent from "@/components/productDetails";

export async function generateMetadata({ params }) {
  const p = await params;
  // treat the dynamic segment as the product id
  const productId = p?.productSlug;

  let productData = {};
  try {
    const res = await axios.get(
      `${process.env.API_PROD_URL}/product/${productId}`,
      {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      }
    );
    productData = res?.data || {};
  } catch (err) {
    productData = {};
  }

  return {
    title: productData?.meta_title || productData?.product_name || "Product",
    description: productData?.meta_description || "",
    images: [
      productData?.product_meta_image?.original_url ||
        productData?.product_thumbnail?.original_url ||
        "",
      [],
    ],
    openGraph: {},
  };
}

const ProductDetails = async ({ params }) => {
  const p = await params;
  const productId = p?.productSlug;

  return <ProductDetailContent productId={productId} />;
};

export default ProductDetails;
