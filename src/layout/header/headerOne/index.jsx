"use client";
import ThemeOptionContext from "@/context/themeOptionsContext";
import { useHeaderScroll } from "@/utils/hooks/HeaderScroll";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import AccountContext from "@/context/accountContext";
import {
  RiHeartLine,
  RiMenuLine,
  RiUserLine,
  RiApps2Line,
  RiShoppingCartLine,
  RiArrowDownSLine,
  RiStore2Line,
  RiMoreFill,
} from "react-icons/ri";
import { Button, Col, Container, Row } from "reactstrap";
import HeaderCart from "../widgets/headerCart";
import HeaderLogo from "../widgets/HeaderLogo";
import HeaderSearchbar from "../widgets/headerSearchbar";
import MainHeaderMenu from "../widgets/mainHeaderMenu";
import TopBar from "../widgets/TopBar";
import CategorySidebar from "../widgets/CategorySidebar";
import CategoryNavBar from "../widgets/CategoryNavBar";
import { useTranslation } from "react-i18next";
import { Href } from "@/utils/constants";
import "./modern-header.scss";
import "./flipkart-header.scss";
import "../widgets/CategoryNavBar.scss";

const HeaderOne = () => {
  const {
    themeOption,
    setOpenAuthModal,
    openAuthModal,
    mobileSideBar,
    setMobileSideBar,
    setCategorySidebarOpen,
  } = useContext(ThemeOptionContext);
  const UpScroll = useHeaderScroll(false);
  const { t } = useTranslation("common");
  const router = useRouter();
  const { accountData, authToken } = useContext(AccountContext);
  const isAuthenticated = Boolean(authToken || accountData);
  const handleProfileClick = (path) => {
    isAuthenticated
      ? router.push("/account/dashboard")
      : setOpenAuthModal(true);
  };
  const handleWishlistClick = () => {
    isAuthenticated ? router.push("/wishlist") : setOpenAuthModal(true);
  };

  return (
    <>
      <CategorySidebar />
      <header
        className={`flipkart-header ${
          themeOption?.header?.sticky_header_enable && UpScroll
            ? "sticky fixed"
            : ""
        }`}
      >
        {themeOption?.header?.page_top_bar_enable && <TopBar />}
        <div className="flipkart-main-header">
          <Container fluid>
            <div className="flipkart-header-content">
              {/* Logo Section */}
              <div className="flipkart-logo-section">
                <HeaderLogo />
              </div>

              {/* Search Bar - Flipkart Style */}
              <div className="flipkart-search-section">
                <HeaderSearchbar fullSearch={true} />
              </div>

              {/* Right Actions - Flipkart Style */}
              <div className="flipkart-actions">
                {/* Login Button */}
                <button
                  className="flipkart-login-btn"
                  onClick={handleProfileClick}
                >
                  <RiUserLine className="btn-icon" />
                  <span>{isAuthenticated ? t("Account") : t("Login")}</span>
                  <RiArrowDownSLine className="dropdown-icon" />
                </button>

                {/* Cart Button */}
                <Link href="/cart" className="flipkart-cart-btn">
                  <RiShoppingCartLine className="btn-icon" />
                  <span>{t("Cart")}</span>
                </Link>

                {/* Become a Seller Button */}
                <Link href="/seller/dashboard" className="flipkart-seller-btn">
                  <RiStore2Line className="btn-icon" />
                  <span>{t("BecomeSeller")}</span>
                </Link>

                {/* More Menu */}
                <button className="flipkart-more-btn">
                  <RiMoreFill />
                </button>
              </div>

              {/* Mobile Header */}
              <div className="flipkart-mobile-header d-lg-none">
                <button
                  className="mobile-menu-btn"
                  onClick={() => setCategorySidebarOpen(true)}
                >
                  <RiApps2Line />
                </button>
                <div className="mobile-logo">
                  <HeaderLogo />
                </div>
                <div className="mobile-actions">
                  <Link
                    href={isAuthenticated ? "/wishlist" : Href}
                    onClick={handleWishlistClick}
                  >
                    <RiHeartLine />
                  </Link>
                  <HeaderCart />
                  <Link
                    href={isAuthenticated ? "/account/dashboard" : Href}
                    onClick={handleProfileClick}
                  >
                    <RiUserLine />
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="flipkart-mobile-search d-lg-none">
              <HeaderSearchbar fullSearch={true} />
            </div>
          </Container>
        </div>
      </header>
      {/* Category Navigation Bar */}
      <CategoryNavBar />
    </>
  );
};

export default HeaderOne;
