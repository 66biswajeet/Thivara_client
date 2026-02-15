"use client";
import Image from "next/image";
import PropTypes from "prop-types";

// Simple Cloudinary loader that requests the exact width we need.
// Expects NEXT_PUBLIC_CLOUDINARY_BASE like https://res.cloudinary.com/<cloud>/image/fetch
const cloudinaryLoader = ({ src, width, quality }) => {
  if (!src) return src;
  if (src.startsWith("http")) return src;
  const base = process.env.NEXT_PUBLIC_CLOUDINARY_BASE || "https://res.cloudinary.com/<your-cloud-name>/image/fetch";
  const q = quality || 75;
  // Use w_{width} transformation so Cloudinary returns optimised size
  return `${base}/q_${q},w_${Math.round(width)}/${src}`;
};

/**
 * CloudinaryImage
 * - `displayWidth` and `displayHeight` define the layout box used for CLS prevention
 * - The loader requests `w_{displayWidth}` from Cloudinary so the client doesn't download the original large file
 */
const CloudinaryImage = ({ src, alt = "", displayWidth = 250, displayHeight = 250, priority = false, sizes = `(max-width: 600px) 100vw, ${displayWidth}px`, className = "", style = {} }) => {
  return (
    <Image
      loader={({ src: _src, width }) => cloudinaryLoader({ src: _src || src, width: displayWidth })}
      src={src}
      alt={alt}
      width={displayWidth}
      height={displayHeight}
      priority={priority}
      sizes={sizes}
      className={className}
      style={style}
      decoding="async"
    />
  );
};

CloudinaryImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  displayWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  displayHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  priority: PropTypes.bool,
  sizes: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default CloudinaryImage;
