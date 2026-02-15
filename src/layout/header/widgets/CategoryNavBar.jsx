"use client";
import { useContext, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import request from "@/utils/axiosUtils";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import ThemeOptionContext from "@/context/themeOptionsContext";
import { RiArrowDownSLine } from "react-icons/ri";
import Image from "next/image";
import { createPortal } from "react-dom";

const CategoryNavBar = () => {
  const { t } = useTranslation("common");
  const { themeOption } = useContext(ThemeOptionContext);

  // Fetch categories
  const { data: categories, isLoading } = useFetchQuery(
    ["menu-categories"],
    () => request({ url: "/menu-categories" }),
    {
      select: (res) => res.data.data || [],
      refetchOnWindowFocus: true,
    },
  );

  // Limit categories to display
  const displayCategories = categories?.slice(0, 10) || [];
  const hasMore = categories?.length > 10;

  // Floating dropdown state (renders via portal)
  const [floating, setFloating] = useState({
    visible: false,
    items: [],
    left: 0,
    top: 0,
  });
  const hoverTimeout = useRef();

  useEffect(() => {
    return () => clearTimeout(hoverTimeout.current);
  }, []);
  // Prepare portal element to avoid inline complex expression inside JSX
  const portalElement =
    typeof document !== "undefined" && floating.visible
      ? createPortal(
          <div
            className="category-dropdown floating-dropdown"
            style={{
              position: "fixed",
              left: floating.left + "px",
              top: floating.top + "px",
              transform: "translateX(-50%)",
            }}
            onMouseEnter={() => clearTimeout(hoverTimeout.current)}
            onMouseLeave={() => setFloating((f) => ({ ...f, visible: false }))}
          >
            <div className="category-dropdown-content">
              {floating.items.map((subcat) => {
                const subcatId = subcat.id || subcat._id || subcat.slug;
                return (
                  <Link
                    key={subcatId}
                    href={subcat.path || `/category/${subcat.slug}`}
                    className="category-dropdown-item"
                  >
                    {subcat.category_image ||
                    subcat.item_image ||
                    subcat.category_icon ||
                    subcat.image ? (
                      <Image
                        src={
                          subcat.category_image ||
                          subcat.item_image ||
                          subcat.category_icon ||
                          subcat.image
                        }
                        alt={subcat.name || subcat.title}
                        width={32}
                        height={32}
                        className="category-dropdown-icon"
                        unoptimized
                      />
                    ) : (
                      <div className="category-dropdown-icon-placeholder">
                        <span>
                          {(subcat.name || subcat.title || "C")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span>{subcat.name || subcat.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="category-navbar">
        <div className="category-navbar-wrapper">
          {isLoading ? (
            // Loading skeleton
            <div className="category-items skeleton">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="category-item-skeleton">
                  <div className="category-icon-skeleton"></div>
                  <div className="category-name-skeleton"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="category-items">
              {displayCategories.map((category) => {
                const children =
                  category.children ||
                  category.sub_categories ||
                  category.subcategories ||
                  category.child ||
                  category.items ||
                  [];
                const hasChildren =
                  Array.isArray(children) && children.length > 0;
                const categoryId = category.id || category._id || category.slug;
                return (
                  <div
                    key={categoryId}
                    className="category-item"
                    onMouseEnter={(e) => {
                      if (
                        typeof window !== "undefined" &&
                        window.innerWidth >= 768 &&
                        hasChildren
                      ) {
                        clearTimeout(hoverTimeout.current);
                        const rect = e.currentTarget.getBoundingClientRect();
                        setFloating({
                          visible: true,
                          items: children.slice(0, 12),
                          left: rect.left + rect.width / 2,
                          top: rect.bottom + window.scrollY,
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      hoverTimeout.current = setTimeout(
                        () => setFloating((f) => ({ ...f, visible: false })),
                        120,
                      );
                    }}
                  >
                    <Link
                      href={category.path || `/category/${category.slug}`}
                      className="category-link"
                      onClick={() =>
                        setFloating((f) => ({ ...f, visible: false }))
                      }
                    >
                      <div className="category-icon-wrapper">
                        {category.category_image ||
                        category.item_image ||
                        category.category_icon ||
                        category.image ? (
                          <Image
                            src={
                              category.category_image ||
                              category.item_image ||
                              category.category_icon ||
                              category.image
                            }
                            alt={category.name || category.title}
                            width={64}
                            height={64}
                            className="category-icon"
                            unoptimized
                            onError={(e) => {
                              console.error(
                                `Image failed to load for ${category.name}:`,
                                e.target.src,
                              );
                              e.target.style.display = "none";
                              e.target.parentElement.innerHTML = `<div class="category-icon-placeholder"><span class="category-icon-letter">${(category.name || "C").charAt(0).toUpperCase()}</span></div>`;
                            }}
                          />
                        ) : (
                          <div className="category-icon-placeholder">
                            <span className="category-icon-letter">
                              {(category.name || category.title || "C")
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="category-name">
                        {category.name || category.title}
                        {hasChildren && (
                          <RiArrowDownSLine className="dropdown-icon" />
                        )}
                      </span>
                    </Link>
                  </div>
                );
              })}

              {/* Debug: Log categories to console */}
              {typeof window !== "undefined" &&
                console.log("Categories data:", displayCategories)}

              {/* More dropdown if there are more categories */}
              {hasMore && (
                <div className="category-item category-more">
                  <div className="category-link">
                    <div className="category-icon-wrapper">
                      <div className="category-icon-placeholder">
                        <span className="category-icon-letter">•••</span>
                      </div>
                    </div>
                    <span className="category-name">
                      {t("More")}
                      <RiArrowDownSLine className="dropdown-icon" />
                    </span>
                  </div>

                  {/* More categories dropdown */}
                  <div className="category-dropdown category-dropdown-wide">
                    <div className="category-dropdown-content">
                      {categories.slice(10).map((category) => {
                        const categoryId =
                          category.id || category._id || category.slug;
                        return (
                          <Link
                            key={categoryId}
                            href={category.path || `/category/${category.slug}`}
                            className="category-dropdown-item"
                          >
                            {category.category_image ||
                            category.item_image ||
                            category.category_icon ||
                            category.image ? (
                              <Image
                                src={
                                  category.category_image ||
                                  category.item_image ||
                                  category.category_icon ||
                                  category.image
                                }
                                alt={category.name || category.title}
                                width={32}
                                height={32}
                                className="category-dropdown-icon"
                                unoptimized
                              />
                            ) : (
                              <div className="category-dropdown-icon-placeholder">
                                <span>
                                  {(category.name || category.title || "C")
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span>{category.name || category.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {portalElement}
    </>
  );
};

export default CategoryNavBar;
