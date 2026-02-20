import ProductIdsContext from "@/context/productIdsContext";
import { Href, storageURL } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";

const ImageLink = ({
  classes = {},
  imgUrl,
  placeholder,
  link,
  height,
  width,
  homeBanner = true,
  // old prop name: bgImg, some callers use bgImage — accept both
  bgImg = false,
  bgImage: bgImageProp = false,
}) => {
  const [bgImage, setBgImage] = useState(bgImg || bgImageProp);
  // debug log to help diagnose missing banner images
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("ImageLink imgUrl:", imgUrl, "placeholder:", placeholder);
  }

  // Resolve image source: allow absolute URLs (Cloudinary) or prepend storageURL for relative paths
  const resolveSrc = (imagePath) => {
    if (!imagePath) return imagePath;
    try {
      if (
        String(imagePath).startsWith("http") ||
        String(imagePath).startsWith("//")
      ) {
        return imagePath;
      }
    } catch (e) {
      // ignore
    }
    return storageURL + imagePath;
  };
  const { filteredProduct } = useContext(ProductIdsContext);
  const redirectToProduct = (productId) => {
    const product = filteredProduct.find((elem) => elem?.id == productId);
    return product ? `product/${product.id || product.slug}` : null;
  };

  const productRoute =
    imgUrl?.redirect_link?.link_type === "product"
      ? redirectToProduct(imgUrl?.redirect_link?.link)
      : null;

  return (
    <>
      {imgUrl?.redirect_link?.link_type === "external_url" ? (
        <Link
          className="h-100"
          href={imgUrl?.redirect_link?.link || "/"}
          target="_blank"
        >
          {bgImage ? (
            <div
              className={`bg-size ${classes}`}
              style={{
                backgroundImage: `url(${imgUrl?.image_url ? resolveSrc(imgUrl?.image_url) : placeholder})`,
              }}
            ></div>
          ) : (
            <Image
              src={
                imgUrl?.image_url ? resolveSrc(imgUrl?.image_url) : placeholder
              }
              className="bg-img w-100 img-fluid"
              alt="banner"
              height={height}
              width={width}
              unoptimized
            />
          )}
        </Link>
      ) : imgUrl?.redirect_link?.link_type === "collection" && !homeBanner ? (
        <Link
          className="h-100"
          href={imgUrl?.redirect_link?.link || Href}
          target="_blank"
        >
          {bgImage ? (
            <div
              className={`bg-size ${classes}`}
              style={{
                backgroundImage: `url(${imgUrl?.image_url ? resolveSrc(imgUrl?.image_url) : placeholder})`,
              }}
            ></div>
          ) : (
            <Image
              src={
                imgUrl?.image_url ? resolveSrc(imgUrl?.image_url) : placeholder
              }
              className="bg-img w-100 img-fluid"
              alt="banner"
              height={height}
              width={width}
              unoptimized
            />
          )}
        </Link>
      ) : imgUrl?.redirect_link?.link_type === "collection" && homeBanner ? (
        <Link
          className="h-100"
          href={
            imgUrl?.redirect_link?.link
              ? `/category/${imgUrl?.redirect_link?.link}`
              : Href
          }
        >
          {bgImage ? (
            <div
              className={`bg-size ${classes}`}
              style={{
                backgroundImage:
                  "url(" +
                  (imgUrl?.image_url
                    ? storageURL + imgUrl?.image_url
                    : placeholder) +
                  ")",
              }}
            ></div>
          ) : (
            <Image
              src={
                imgUrl?.image_url ? storageURL + imgUrl?.image_url : placeholder
              }
              className="bg-img w-100 img-fluid"
              alt="banner"
              height={height}
              width={width}
              unoptimized
            />
          )}
        </Link>
      ) : imgUrl?.redirect_link?.link_type === "product" && productRoute ? (
        <Link className="h-100" href={`/${productRoute}`}>
          {bgImage ? (
            <div
              className={`bg-size ${classes}`}
              style={{
                backgroundImage: `url(${imgUrl?.image_url ? resolveSrc(imgUrl?.image_url) : placeholder})`,
              }}
            ></div>
          ) : (
            <Image
              src={
                imgUrl?.image_url ? storageURL + imgUrl?.image_url : placeholder
              }
              className="bg-img w-100 img-fluid"
              alt="banner"
              height={height}
              width={width}
              unoptimized
            />
          )}
        </Link>
      ) : bgImage ? (
        <div
          className={`bg-size ${classes}`}
          style={{
            backgroundImage: `url(${
              imgUrl?.image_url ? storageURL + imgUrl?.image_url : placeholder
            }`,
          }}
        ></div>
      ) : (
        (imgUrl?.image_url || placeholder) && (
          <Image
            src={
              imgUrl?.image_url ? resolveSrc(imgUrl?.image_url) : placeholder
            }
            className="bg-img w-100 img-fluid"
            alt="banner"
            height={height}
            width={width}
            unoptimized
          />
        )
      )}
    </>
  );
};

export default ImageLink;
