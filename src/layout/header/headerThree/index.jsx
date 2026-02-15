"use client";

import CategoryContext from "@/context/categoryContext";
import ThemeOptionContext from "@/context/themeOptionsContext";
import { Href } from "@/utils/constants";
import { useHeaderScroll } from "@/utils/hooks/HeaderScroll";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import AccountContext from "@/context/accountContext";
import { useTranslation } from "react-i18next";
import { RiHeartLine, RiMenuLine, RiUserLine } from "react-icons/ri";
import { Button, Col, Container, Row } from "reactstrap";
import HeaderCart from "../widgets/headerCart";
import HeaderLogo from "../widgets/HeaderLogo";
import HeaderSearchbar from "../widgets/headerSearchbar";
import MainHeaderMenu from "../widgets/mainHeaderMenu";
import TopBar from "../widgets/TopBar";
import Link from "next/link";

const HeaderThree = () => {
  const { themeOption, setMobileSideBar, mobileSideBar, setOpenAuthModal } =
    useContext(ThemeOptionContext);
  const { t } = useTranslation("common");
  const { categoryAPIData } = useContext(CategoryContext);
  const [activeCategory, setActiveCategory] = useState("Beauty");
  const router = useRouter();
  const { accountData, authToken } = useContext(AccountContext);
  const isAuthenticated = Boolean(authToken || accountData);
  const handleProfileClick = (path) => {
    isAuthenticated
      ? router.push("/account/dashboard")
      : setOpenAuthModal(true);
  };
  const UpScroll = useHeaderScroll(false);

  const filterCategoryData = (categoryData, categoryIds) => {
    if (!categoryData || !categoryIds) {
      return [];
    }

    const filteredCategories = [];
    const filteredSubCategoryIds = new Set(categoryIds);

    const filterCategory = (category) => {
      if (filteredSubCategoryIds.has(category.id)) {
        filteredCategories.push(category);
      }
      if (category.subcategories) {
        category.subcategories.forEach((subcategory) => {
          filterCategory(subcategory);
        });
        return;
      }
    };
    categoryData.forEach(filterCategory);
    return filteredCategories;
  };

  const mainCategories = filterCategoryData(
    categoryAPIData?.data,
    themeOption?.header?.category_ids
  );

  const handleWishlistClick = () => {
    isAuthenticated ? router.push("/wishlist") : setOpenAuthModal(true);
  };
  return (
    <>
      <header
        className={`header-style-1 ${
          themeOption?.header?.sticky_header_enable && UpScroll
            ? "sticky fixed"
            : ""
        }`}
      >
      {themeOption?.header?.page_top_bar_enable && <TopBar />}
      <div className="bg-light-xl">
        <Container>
          <Row>
            <Col sm="12">
              <div className="main-menu">
                <div className="menu-left">
                  <div
                    className="toggle-nav"
                    onClick={() => setMobileSideBar(!mobileSideBar)}
                  >
                    <RiMenuLine className="sidebar-bar" />
                  </div>
                  <div className="brand-logo me-lg-4 me-0">
                    <HeaderLogo />
                  </div>
                  <nav className="navbar navbar-expand-sm navbar-light pe-0 d-none d-lg-block">
                    <button className="navbar-toggler" type="button">
                      <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
                      className="collapse navbar-collapse"
                      id="navbarSupportedContent"
                    >
                      <ul className="navbar-nav category-nav me-auto pt-0">
                        {mainCategories?.map((category) => (
                          <li
                            key={category.id}
                            className={`nav-item has-sub ${
                              activeCategory == category.name ? "active" : ""
                            }`}
                            onClick={() => setActiveCategory(category.name)}
                          >
                            <a className="nav-link" href={Href}>
                              {category.name}
                            </a>
                            {category.subcategories && category.subcategories.length > 0 && (
                              <ul className="category-dropdown">
                                {category.subcategories.map((sub) => (
                                  <li key={sub.id} className="dropdown-item">
                                    <Link href={`/category/${sub.slug}`}>{sub.name}</Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </nav>
                </div>
                <div className="menu-right pull-right">
                  <div>
                    <div className="icon-nav">
                      <ul>
                        <li className="onhover-div">
                          <HeaderSearchbar />
                        </li>
                        <li className="onhover-div">
                          <Link
                            href={isAuthenticated ? "/wishlist" : Href}
                            onClick={handleWishlistClick}
                          >
                            <RiHeartLine />
                          </Link>
                        </li>
                        <li className="onhover-div">
                          <HeaderCart />
                        </li>
                        <li className="onhover-div">
                          <Link
                            href={isAuthenticated ? "/account/dashboard" : Href}
                            onClick={handleProfileClick}
                          >
                            <RiUserLine />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="border-top-cls">
        <Container>
          <ul className="sm pixelstrap sm-horizontal">
            <div className="classic-header main-navbar">
              <div id="mainnav">
                <div className="header-nav-middle">
                  <div className="main-nav navbar navbar-expand-xl navbar-light navbar-sticky">
                    <div
                      className={`offcanvas offcanvas-collapse order-xl-2 ${
                        mobileSideBar ? "show" : ""
                      } `}
                    >
                      <div className="offcanvas-header navbar-shadow">
                        <h5>{t("Menu")}</h5>
                        <Button
                          close
                          className="lead"
                          id="toggle_menu_btn"
                          type="button"
                          onClick={() => setMobileSideBar(false)}
                        >
                          <div>
                            <i className="ri-close-fill"></i>
                          </div>
                        </Button>
                      </div>
                      <div className="offcanvas-body">
                        <MainHeaderMenu />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ul>
        </Container>
      </div>
      </header>
      <style jsx global>{`
        .navbar-nav .nav-item.has-sub {
          position: relative;
        }
        .navbar-nav .category-dropdown {
          display: none;
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          min-width: 220px;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 6px 18px rgba(3, 8, 14, 0.08);
          padding: 8px 0;
          list-style: none;
          z-index: 1200;
        }
        .navbar-nav .category-dropdown .dropdown-item {
          padding: 10px 18px;
        }
        .navbar-nav .category-dropdown .dropdown-item a {
          color: #222222;
          text-decoration: none;
          display: block;
        }
        .navbar-nav .category-dropdown .dropdown-item:hover a {
          color: #0d6efd;
        }
        .navbar-nav .nav-item.has-sub:hover > .category-dropdown {
          display: block;
        }
        /* keep dropdown responsive on smaller screens */
        @media (max-width: 991px) {
          .navbar-nav .category-dropdown {
            position: static;
            box-shadow: none;
            background: transparent;
            padding: 0;
          }
          .navbar-nav .category-dropdown .dropdown-item {
            padding: 8px 12px;
          }
        }
      `}</style>
    </>
  );
};

export default HeaderThree;
