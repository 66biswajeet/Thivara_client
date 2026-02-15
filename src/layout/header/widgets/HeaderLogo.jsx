import SettingContext from "@/context/settingContext";
import ThemeOptionContext from "@/context/themeOptionsContext";
import { ImagePath } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const HeaderLogo = ({ extraClass }) => {
  const { settingData } = useContext(SettingContext);
  const { themeOption } = useContext(ThemeOptionContext);
  const [logo, setLogo] = useState("");
  const path = useSearchParams();
  const theme = path.get("theme");

  useEffect(() => {
    let logo = themeOption?.logo?.header_logo;
    if (theme) {
      if (
        theme == "fashion_one" ||
        theme == "tools" ||
        theme == "left_sidebar"
      ) {
        logo = { original_url: `${ImagePath}/icon/logo/12.png` };
      } else if (theme == "full_page") {
        logo = { original_url: `${ImagePath}/icon/logo/2.png` };
      } else if (theme == "fashion_two") {
        logo = { original_url: `${ImagePath}/icon/logo/12.png` };
      } else if (theme == "video") {
        logo = { original_url: `${ImagePath}/icon/logo/12.png` };
      } else if (theme == "game") {
        logo = { original_url: `${ImagePath}/icon/logo/44.png` };
      } else if (theme == "fashion_three") {
        logo = { original_url: `${ImagePath}/icon/logo/39.png` };
      } else if (theme == "yoga") {
        logo = { original_url: `${ImagePath}/icon/logo/41.png` };
      } else if (theme == "watch") {
        logo = { original_url: `${ImagePath}/icon/logo/40.png` };
      } else if (theme == "vegetables_one") {
        logo = { original_url: `${ImagePath}/icon/logo/12.png` };
      } else if (theme == "fashion_four") {
        logo = { original_url: `${ImagePath}/icon/logo/10.png` };
      } else if (theme == "fashion_five") {
        logo = { original_url: `${ImagePath}/icon/logo/46.png` };
      } else if (theme == "jewellery_one") {
        logo = { original_url: `${ImagePath}/icon/logo/f14.png` };
      } else if (theme == "fashion_six") {
        logo = { original_url: `${ImagePath}/icon/logo/30.png` };
      } else if (theme == "fashion_seven") {
        logo = { original_url: `${ImagePath}/icon/logo/f12.png` };
      } else if (
        theme == "furniture_one" ||
        theme == "furniture_two" ||
        theme == "jewellery_two" ||
        theme == "jewellery_three"
      ) {
        logo = { original_url: `${ImagePath}/icon/logo/1.png` };
      } else if (theme == "furniture_dark") {
        logo = { original_url: `${ImagePath}/icon/logo/f8.png` };
      } else if (theme == "electronics_one") {
        logo = { original_url: `${ImagePath}/icon/logo/3.png` };
      } else if (theme == "electronics_two") {
        logo = { original_url: `${ImagePath}/icon/logo/5.png` };
      } else if (theme == "electronics_three" || theme == "marketplace_three") {
        logo = { original_url: `${ImagePath}/icon/logo/29.png` };
      } else if (theme == "marketplace_one") {
        logo = { original_url: `${ImagePath}/icon/logo/18.png` };
      } else if (theme == "marketplace_two" || theme == "marketplace_four") {
        logo = { original_url: `${ImagePath}/icon/logo/f11.png` };
      } else if (theme == "vegetables_two" || theme == "vegetables_three") {
        logo = { original_url: `${ImagePath}/icon/logo/7.png` };
      } else if (theme == "vegetables_four") {
        logo = { original_url: `${ImagePath}/icon/logo/18.png` };
      } else if (theme == "bag" || theme == "beauty") {
        logo = { original_url: `${ImagePath}/icon/logo/logo.png` };
      } else if (theme == "medical") {
        logo = { original_url: `${ImagePath}/icon/logo/22.png` };
      } else if (theme == "perfume") {
        logo = { original_url: `${ImagePath}/icon/logo/34.png` };
      } else if (theme == "marijuana") {
        logo = { original_url: `${ImagePath}/icon/logo/15.png` };
      } else if (theme == "christmas") {
        logo = { original_url: `${ImagePath}/icon/logo/f5.png` };
      } else if (theme == "bicycle") {
        logo = { original_url: `${ImagePath}/icon/logo/42.png` };
      } else if (theme == "shoes") {
        logo = { original_url: `${ImagePath}/icon/logo/48.png` };
      } else if (theme == "flower") {
        logo = { original_url: `${ImagePath}/icon/logo/6.png` };
      } else if (theme == "kids") {
        logo = { original_url: `${ImagePath}/icon/logo/6.png` };
      } else if (theme == "books") {
        logo = { original_url: `${ImagePath}/icon/logo/35.png` };
      } else if (theme == "goggles") {
        logo = { original_url: `${ImagePath}/icon/logo/4.png` };
      } else if (theme == "gym") {
        logo = { original_url: `${ImagePath}/icon/logo/43.png` };
      } else if (theme == "video_slider") {
        logo = { original_url: `${ImagePath}/icon/logo/17.png` };
      } else if (theme == "pets") {
        logo = { original_url: `${ImagePath}/icon/logo/35.png` };
      } else if (theme == "nursery") {
        logo = { original_url: `${ImagePath}/icon/logo/7.png` };
      } else if (theme == "gradient") {
        logo = { original_url: `${ImagePath}/icon/logo/36.png` };
      } else if (theme == "parallax") {
        logo = { original_url: `${ImagePath}/icon/logo/36.png` };
      } else if (theme == "digital_download") {
        logo = { original_url: `${ImagePath}/icon/logo/45.png` };
      } else if (theme == "surfboard") {
        logo = { original_url: `${ImagePath}/icon/logo/47.png` };
      } else if (theme == "single_product") {
        logo = { original_url: `${ImagePath}/icon/logo/f20.png` };
      }
    }
    // If no logo configured, fall back to project logo 'thivara.png' placed in public assets
    if (!logo || !logo?.original_url) {
      setLogo({ original_url: `${ImagePath}/icon/logo/thivara.png` });
    } else {
      setLogo(logo);
    }
  }, [theme, themeOption?.logo?.header_logo]);
  return (
    <>
      <Link href="/" className={`${extraClass ? extraClass : ""}`}>
        {/* Use configured logo if available, fall back handled in state */}
        <Image
          className="img-fluid header-logo-img"
          src={`${ImagePath}/icon/logo/thivara.png`}
          height={44}
          width={173}
          alt={
            settingData?.general?.site_name
              ? settingData?.general?.site_name
              : "multikart-logo"
          }
          unoptimized
        />
      </Link>
    </>
  );
};

export default HeaderLogo;
