"use client";
import Image from "next/image";
import PropTypes from "prop-types";

// Cloudinary loader for next/image
const cloudinaryLoader = ({ src, width, quality }) => {
  // If src already a full URL, return as-is
  if (!src) return src;
  if (src.startsWith("http")) return src;
  const base =
    process.env.NEXT_PUBLIC_CLOUDINARY_BASE ||
    "https://res.cloudinary.com/<your-cloud-name>/image/fetch";
  const q = quality || 75;
  // Use fetch-style URL so cloudinary can fetch remote images if needed
  return `${base}/q_${q},w_${width}/${src}`;
};

const CustomImage = ({
  src,
  alt,
  width,
  height,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className = "",
  style = {},
  fill = false,
}) => {
  // Enforce explicit width/height unless fill is used
  if (!fill && (!width || !height)) {
    console.warn(
      "CustomImage: width and height should be provided to avoid CLS. Use 'fill' if you need responsive container-based sizing."
    );
  }

  // If fill is requested, pass fill prop to next/image; otherwise use width/height
  return (
    <Image
      loader={cloudinaryLoader}
      src={src}
      alt={alt || ""}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      priority={priority}
      sizes={sizes}
      className={className}
      style={style}
      quality={75}
      // Let next/image handle decoding and modern formats
      decoding="async"
    />
  );
};

CustomImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  priority: PropTypes.bool,
  sizes: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  fill: PropTypes.bool,
};

export default CustomImage;
