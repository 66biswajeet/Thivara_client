"use client";
import { useContext, useState } from "react";
import { RiArrowDownSLine, RiCloseLine } from "react-icons/ri";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import request from "@/utils/axiosUtils";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import ThemeOptionContext from "@/context/themeOptionsContext";

const CategorySidebar = () => {
  const { t } = useTranslation("common");
  const { categorySidebarOpen, setCategorySidebarOpen } =
    useContext(ThemeOptionContext);
  const [openCategories, setOpenCategories] = useState([]);

  // Fetch categories
  const { data: categories, isLoading } = useFetchQuery(
    ["menu-categories"],
    () => request({ url: "/menu-categories" }),
    {
      select: (res) => res.data.data || [],
      refetchOnWindowFocus: true,
    }
  );

  const toggleCategory = (categoryId) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const renderCategory = (category, level = 0) => {
    // Support multiple possible keys for nested categories returned by different APIs
    const children =
      category.children ||
      category.sub_categories ||
      category.subcategories ||
      category.child ||
      category.items ||
      [];
    const hasChildren = Array.isArray(children) && children.length > 0;
    const categoryId =
      category.id || category._id || category.slug || category.name;
    const isOpen = openCategories.includes(categoryId);

    return (
      <li key={categoryId} className={`category-item level-${level}`}>
        <div className="category-header">
          {category.path ? (
            <Link
              href={category.path}
              onClick={() => setCategorySidebarOpen(false)}
              className="category-link"
            >
              {category.name || category.title}
            </Link>
          ) : (
            <span className="category-link">
              {category.name || category.title}
            </span>
          )}
          {hasChildren && (
            <button
              className={`category-toggle ${isOpen ? "open" : ""}`}
              onClick={() => toggleCategory(categoryId)}
              aria-label="Toggle subcategories"
            >
              <RiArrowDownSLine />
            </button>
          )}
        </div>
        {hasChildren && (
          <ul className={`subcategory-list ${isOpen ? "open" : ""}`}>
            {children.map((child) => renderCategory(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`category-sidebar-backdrop ${
          categorySidebarOpen ? "show" : ""
        }`}
        onClick={() => setCategorySidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className={`category-sidebar ${categorySidebarOpen ? "open" : ""}`}>
        <div className="category-sidebar-header">
          <h3>{t("ShopByCategory")}</h3>
          <button
            className="close-btn"
            onClick={() => setCategorySidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <RiCloseLine />
          </button>
        </div>

        <div className="category-sidebar-body">
          {isLoading ? (
            <ul className="category-list skeleton">
              {[...Array(8)].map((_, i) => (
                <li key={i} className="skeleton-item">
                  <div className="skeleton-line"></div>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="category-list">
              {categories?.map((category) => renderCategory(category))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default CategorySidebar;
