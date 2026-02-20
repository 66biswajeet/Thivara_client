"use client";
import ImageLink from "@/components/widgets/imageLink";
import { homeBannerSettings } from "@/data/sliderSetting/SliderSetting";
import { ImagePath, storageURL } from "@/utils/constants";
import { useEffect, useState } from "react";
import Slider from "react-slick";

const HomeSlider = ({ bannerData, height, width, sliderClass }) => {
  const videoType = ["mp4", "webm", "ogg"];
  const [customBanners, setCustomBanners] = useState(null);

  // Fetch store customization data
  useEffect(() => {
    const fetchCustomization = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await fetch(`${apiUrl}/api/store-customization`);
        const data = await response.json();

        if (data.success && data.data?.carousel_images?.length > 0) {
          // Convert store customization format to banner format
          const carouselBanners = {
            banners: data.data.carousel_images.map((img) => ({
              image_url: img.image,
              redirect_link: { link: img.link || "#" },
              status: 1,
            })),
          };
          setCustomBanners(carouselBanners);
        }
      } catch (error) {
        console.error("Failed to fetch store customization:", error);
      }
    };

    fetchCustomization();
  }, []);

  // Use custom banners if available, otherwise fall back to bannerData
  const displayBanners = customBanners || bannerData;

  return (
    <>
      <div className="position-relative">
        {displayBanners?.banners?.length > 1 ? (
          <Slider
            {...homeBannerSettings}
            className={sliderClass ? sliderClass : ""}
          >
            {displayBanners?.banners?.map((banner, index) => {
              if (
                videoType.includes(
                  banner &&
                    banner?.image_url &&
                    banner?.image_url?.substring(
                      banner?.image_url?.lastIndexOf(".") + 1,
                    ),
                )
              ) {
                return (
                  <div
                    className="slider-contain"
                    id="block"
                    style={{ width: "100%", position: "relative" }}
                    data-vide-bg="../assets/video/video.mp4"
                    data-vide-options="position: 0% 50%"
                  >
                    <div
                      style={{
                        position: "absolute",
                        zIndex: -1,
                        inset: "0px",
                        overflow: "hidden",
                        backgroundSize: "cover",
                        backgroundColor: "transparent",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "0% 50%",
                        backgroundImage: "none",
                      }}
                    >
                      <video
                        autoPlay
                        loop
                        muted
                        style={{
                          margin: "auto",
                          position: "absolute",
                          zIndex: "-1",
                          top: "50%",
                          left: " 0%",
                          transform: "translate(0%, -50%)",
                          visibility: "visible",
                          opacity: "1",
                          width: "1907px",
                          height: "auto",
                        }}
                      >
                        <source
                          src={storageURL + banner?.image_url}
                          type="video/mp4"
                        />
                      </video>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={index}>
                    {}
                    <ImageLink
                      imgUrl={banner}
                      placeholder={`${ImagePath}/banner.png`}
                      link={banner}
                      height={height}
                      width={width}
                      homeBanner={true}
                    />
                  </div>
                );
              }
            })}
          </Slider>
        ) : videoType.includes(
            (displayBanners?.banners?.[0] || displayBanners) &&
              (displayBanners?.banners?.[0]?.image_url ||
                displayBanners?.image_url) &&
              (displayBanners?.banners?.[0]?.image_url?.substring(
                displayBanners?.banners?.[0]?.image_url?.lastIndexOf(".") + 1,
              ) ||
                displayBanners?.image_url?.substring(
                  displayBanners?.image_url?.lastIndexOf(".") + 1,
                )),
          ) ? (
          <div
            className="slider-contain"
            id="block"
            data-vide-bg="../assets/video/video.mp4"
            data-vide-options="position: 0% 50%"
          >
            <div
              style={{
                position: "absolute",
                zIndex: -1,
                inset: "0px",
                overflow: "hidden",
                backgroundSize: "cover",
                backgroundColor: "transparent",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "0% 50%",
                backgroundImage: "none",
              }}
            >
              <video
                autoPlay
                loop
                muted
                style={{
                  margin: "auto",
                  position: "absolute",
                  zIndex: "-1",
                  top: "50%",
                  left: " 0%",
                  transform: "translate(0%, -50%)",
                  visibility: "visible",
                  opacity: "1",
                  width: "1907px",
                  height: "auto",
                }}
              >
                <source
                  src={
                    storageURL + displayBanners?.banners?.[0]?.image_url ||
                    displayBanners?.image_url
                  }
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
        ) : (
          <ImageLink
            imgUrl={displayBanners?.banners?.[0] || displayBanners}
            placeholder={`${ImagePath}/banner.png`}
            height={height}
            width={width}
          />
        )}
      </div>
    </>
  );
};

export default HomeSlider;
