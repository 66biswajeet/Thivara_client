import request from "@/utils/axiosUtils";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import { useState } from "react";
import MenuList from "./MenuList";

const MainHeaderMenu = () => {
  const [isOpen, setIsOpen] = useState([]);

  // Fetch dynamic categories from admin panel
  const { data: headerMenu, isLoading } = useFetchQuery(
    ["menu-categories"],
    () => request({ url: "/menu-categories" }),
    {
      select: (res) => {
        const categories = res.data.data || [];
        return categories.map((item) => ({
          ...item,
          class: "0",
        }));
      },
      refetchOnWindowFocus: true,
    }
  );

  return (
    <>
      {isLoading ? (
        <ul className="skeleton-menu navbar-nav">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      ) : (
        <ul className="navbar-nav">
          {headerMenu?.slice(0, 4).map((menu, i) => (
            <MenuList
              menu={menu}
              key={i}
              customClass={`${!menu?.path ? "dropdown" : ""} nav-item `}
              level={0}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          ))}
        </ul>
      )}
    </>
  );
};

export default MainHeaderMenu;
