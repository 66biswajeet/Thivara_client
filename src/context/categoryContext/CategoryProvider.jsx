import React, { useEffect, useState } from "react";
import { CategoryAPI } from "@/utils/axiosUtils/API";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import multikartRequest from "@/utils/axiosUtils/multikartClient";
import CategoryContext from ".";
import { useRouter } from "next/navigation";

const CategoryProvider = (props) => {
  const router = useRouter();
  const [categoryAPIData, setCategoryAPIData] = useState({
    data: [],
    refetchCategory: "",
    params: {},
    categoryIsLoading: false,
  });
  const {
    data: categoryData,
    refetch,
    isLoading: categoryIsLoading,
  } = useFetchQuery(
    [CategoryAPI],
    () =>
      multikartRequest(
        {
          url: CategoryAPI,
          params: {
            ...categoryAPIData.params,
            status: 1,
            include_subcategories: true,
          },
        },
        router
      ),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      select: (response) => response?.data?.data || [],
    }
  );

  const filterCategory = (value) => {
    return categoryData?.filter((elem) => elem.type === value) || [];
  };

  useEffect(() => {
    refetch().catch((error) => {
      console.error("Failed to fetch categories:", error);
      setCategoryAPIData((prev) => ({
        ...prev,
        data: [],
        categoryIsLoading: false,
      }));
    });
  }, []);

  // Setting Data on Category variables
  useEffect(() => {
    if (categoryData) {
      setCategoryAPIData((prev) => ({
        ...prev,
        data: categoryData,
        categoryIsLoading: categoryIsLoading,
      }));
    }
  }, [categoryData]);

  return (
    <CategoryContext.Provider
      value={{
        ...props,
        categoryAPIData,
        setCategoryAPIData,
        filterCategory: filterCategory,
        categoryIsLoading,
        categoryData,
      }}
    >
      {props.children}
    </CategoryContext.Provider>
  );
};

export default CategoryProvider;
