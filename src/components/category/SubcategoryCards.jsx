"use client";
import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import CategoryContext from "@/context/categoryContext";
import "./SubcategoryCards.scss";

const SubcategoryCards = ({ categorySlug }) => {
  const { categoryData } = useContext(CategoryContext);

  // Find the current category by slug
  const currentCategory = categoryData?.find(
    (cat) => cat.slug === categorySlug,
  );

  // Get subcategories
  const subcategories =
    currentCategory?.subcategories ||
    currentCategory?.children ||
    currentCategory?.sub_categories ||
    [];

  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <div className="subcategory-cards-wrapper">
      <div className="container-fluid">
        <h2 className="subcategory-title">Shop by Category</h2>
        <div className="subcategory-grid">
          {subcategories.map((subcat) => {
            const subcatId = subcat.id || subcat._id || subcat.slug;
            const subcatImage =
              subcat.category_image ||
              subcat.category_icon ||
              subcat.image ||
              "/assets/images/placeholder.png";
            const subcatName = subcat.name || subcat.title || "Category";
            const subcatSlug = subcat.slug || "";

            return (
              <Link
                key={subcatId}
                href={`/category/${categorySlug}/${subcatSlug}`}
                className="subcategory-card"
              >
                <div className="subcategory-card-image">
                  <Image
                    src={subcatImage}
                    alt={subcatName}
                    width={200}
                    height={200}
                    className="subcat-img"
                  />
                </div>
                <div className="subcategory-card-content">
                  <h3 className="subcategory-card-title">{subcatName}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubcategoryCards;
