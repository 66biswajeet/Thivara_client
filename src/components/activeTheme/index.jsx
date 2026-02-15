"use client";
import request from "@/utils/axiosUtils";
import { ThemeAPI } from "@/utils/axiosUtils/API";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useContext } from "react";
import ThemeOptionContext from "@/context/themeOptionsContext";
import Loader from "@/layout/loader";

// Lazy-load theme pages to avoid bundling all themes on first paint
const Bag = dynamic(() => import("../themes/bag"), {
  loading: () => <Loader />,
});
const BeautyHomePage = dynamic(() => import("../themes/beauty"), {
  loading: () => <Loader />,
});
const BicycleHomePage = dynamic(() => import("../themes/bicycle"), {
  loading: () => <Loader />,
});
const BooksHomePage = dynamic(() => import("../themes/books"), {
  loading: () => <Loader />,
});
const Christmas = dynamic(() => import("../themes/christmas"), {
  loading: () => <Loader />,
});
const DigitalDownload = dynamic(() => import("../themes/digitalDownload"), {
  loading: () => <Loader />,
});
const ElectronicsOne = dynamic(
  () => import("../themes/electronics/electronicsOne"),
  { loading: () => <Loader /> }
);
const ElectronicsThree = dynamic(
  () => import("../themes/electronics/electronicsThree"),
  { loading: () => <Loader /> }
);
const ElectronicsTwo = dynamic(
  () => import("../themes/electronics/electronicsTwo"),
  { loading: () => <Loader /> }
);
const Fashion1 = dynamic(() => import("../themes/fashion/fashion1"), {
  loading: () => <Loader />,
});
const Fashion2 = dynamic(() => import("../themes/fashion/fashion2"), {
  loading: () => <Loader />,
});
const Fashion3 = dynamic(() => import("../themes/fashion/fashion3"), {
  loading: () => <Loader />,
});
const Fashion4 = dynamic(() => import("../themes/fashion/fashion4"), {
  loading: () => <Loader />,
});
const Fashion5 = dynamic(() => import("../themes/fashion/fashion5"), {
  loading: () => <Loader />,
});
const Fashion6 = dynamic(() => import("../themes/fashion/fashion6"), {
  loading: () => <Loader />,
});
const Fashion7 = dynamic(() => import("../themes/fashion/fashion7"), {
  loading: () => <Loader />,
});
const FlowerHomePage = dynamic(() => import("../themes/flower"), {
  loading: () => <Loader />,
});
const FullPage = dynamic(() => import("../themes/fullPage"), {
  loading: () => <Loader />,
});
const Furniture1 = dynamic(() => import("../themes/furniture/Furniture1"), {
  loading: () => <Loader />,
});
const Furniture2 = dynamic(() => import("../themes/furniture/Furniture2"), {
  loading: () => <Loader />,
});
const FurnitureDark = dynamic(
  () => import("../themes/furniture/FurnitureDark"),
  { loading: () => <Loader /> }
);
const Game = dynamic(() => import("../themes/game"), {
  loading: () => <Loader />,
});
const GogglesHomePage = dynamic(() => import("../themes/goggles"), {
  loading: () => <Loader />,
});
const Gradient = dynamic(() => import("../themes/gradient"), {
  loading: () => <Loader />,
});
const GymHomePage = dynamic(() => import("../themes/gym"), {
  loading: () => <Loader />,
});
const JewelleryThree = dynamic(
  () => import("../themes/jewellery/jewelleryThree"),
  { loading: () => <Loader /> }
);
const JewelleryTwo = dynamic(() => import("../themes/jewellery/jewelleryTwo"), {
  loading: () => <Loader />,
});
const JewelleryOne = dynamic(() => import("../themes/jewellery/jwelleryOne"), {
  loading: () => <Loader />,
});
const KidsHomePage = dynamic(() => import("../themes/kids"), {
  loading: () => <Loader />,
});
const MarijuanaHomePage = dynamic(() => import("../themes/marijuana"), {
  loading: () => <Loader />,
});
const MarketplaceFour = dynamic(
  () => import("../themes/marketplace/marketplaceFour"),
  { loading: () => <Loader /> }
);
const MarketplaceOne = dynamic(
  () => import("../themes/marketplace/marketplaceOne"),
  { loading: () => <Loader /> }
);
const MarketplaceThree = dynamic(
  () => import("../themes/marketplace/marketplaceThree"),
  { loading: () => <Loader /> }
);
const MarketplaceTwo = dynamic(
  () => import("../themes/marketplace/marketplaceTwo"),
  { loading: () => <Loader /> }
);
const Medical = dynamic(() => import("../themes/medical"), {
  loading: () => <Loader />,
});
const NurseryHomePage = dynamic(() => import("../themes/nursery"), {
  loading: () => <Loader />,
});
const Parallax = dynamic(() => import("../themes/parallax"), {
  loading: () => <Loader />,
});
const Perfume = dynamic(() => import("../themes/perfume"), {
  loading: () => <Loader />,
});
const PetsHomePage = dynamic(() => import("../themes/pets"), {
  loading: () => <Loader />,
});
const ShoesHomePage = dynamic(() => import("../themes/shoes"), {
  loading: () => <Loader />,
});
const SingleProduct = dynamic(() => import("../themes/singleProduct"), {
  loading: () => <Loader />,
});
const Surfboard = dynamic(() => import("../themes/surfBoard"), {
  loading: () => <Loader />,
});
const ToolsHomePage = dynamic(() => import("../themes/tools"), {
  loading: () => <Loader />,
});
const VegetablesFour = dynamic(
  () => import("../themes/vegetables/vegetablesFour"),
  { loading: () => <Loader /> }
);
const VegetablesOne = dynamic(
  () => import("../themes/vegetables/vegetablesOne"),
  { loading: () => <Loader /> }
);
const VegetablesThree = dynamic(
  () => import("../themes/vegetables/vegetablesThree"),
  { loading: () => <Loader /> }
);
const VegetablesTwo = dynamic(
  () => import("../themes/vegetables/vegetablesTwo"),
  { loading: () => <Loader /> }
);
const VideoHomePage = dynamic(() => import("../themes/video"), {
  loading: () => <Loader />,
});
const VideoSlider = dynamic(() => import("../themes/videoSlider"), {
  loading: () => <Loader />,
});
const Watch = dynamic(() => import("../themes/watch"), {
  loading: () => <Loader />,
});
const YogaHomePage = dynamic(() => import("../themes/yoga"), {
  loading: () => <Loader />,
});

const ActiveTheme = () => {
  const { data, isLoading } = useFetchQuery(
    [ThemeAPI],
    () => request({ url: ThemeAPI }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      select: (res) => res?.data.data,
    }
  );
  const search = useSearchParams();
  const themeBySlug = search.get("theme");
  const activeTheme = data?.find((elem) => elem.status === 1);
  const { isLoading: themeLoading } = useContext(ThemeOptionContext);

  const checkActive = {
    fashion_one: <Fashion1 />,
    fashion_two: <Fashion2 />,
    fashion_three: <Fashion3 />,
    fashion_four: <Fashion4 />,
    fashion_five: <Fashion5 />,
    fashion_six: <Fashion6 />,
    fashion_seven: <Fashion7 />,
    furniture_one: <Furniture1 />,
    furniture_two: <Furniture2 />,
    furniture_dark: <FurnitureDark />,
    electronics_one: <ElectronicsOne />,
    electronics_two: <ElectronicsTwo />,
    electronics_three: <ElectronicsThree />,
    vegetables_one: <VegetablesOne />,
    vegetables_two: <VegetablesTwo />,
    vegetables_three: <VegetablesThree />,
    vegetables_four: <VegetablesFour />,
    marketplace_one: <MarketplaceOne />,
    marketplace_two: <MarketplaceTwo />,
    marketplace_three: <MarketplaceThree />,
    marketplace_four: <MarketplaceFour />,
    jewellery_one: <JewelleryOne />,
    jewellery_two: <JewelleryTwo />,
    jewellery_three: <JewelleryThree />,
    parallax: <Parallax />,
    game: <Game />,
    gym: <GymHomePage />,
    flower: <FlowerHomePage />,
    gradient: <Gradient />,
    bicycle: <BicycleHomePage />,
    goggles: <GogglesHomePage />,
    nursery: <NurseryHomePage />,
    christmas: <Christmas />,
    kids: <KidsHomePage />,
    yoga: <YogaHomePage />,
    pets: <PetsHomePage />,
    full_page: <FullPage />,
    tools: <ToolsHomePage />,
    perfume: <Perfume />,
    video: <VideoHomePage />,
    marijuana: <MarijuanaHomePage />,
    bag: <Bag />,
    watch: <Watch />,
    shoes: <ShoesHomePage />,
    beauty: <BeautyHomePage />,
    video_slider: <VideoSlider />,
    surfboard: <Surfboard />,
    medical: <Medical />,
    books: <BooksHomePage />,
    single_product: <SingleProduct />,
    digital_download: <DigitalDownload />,
  };

  if (themeLoading) return <Loader />;
  return themeBySlug
    ? checkActive[themeBySlug]
    : checkActive[activeTheme?.slug];
};

export default ActiveTheme;
