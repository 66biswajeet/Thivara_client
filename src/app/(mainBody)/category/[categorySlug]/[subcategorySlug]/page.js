"use client";
import CategoryMainPage from "@/components/category";
import { useParams } from "next/navigation";

const SubcategoryPage = () => {
  const params = useParams();
  // Use the subcategorySlug for filtering products
  return <CategoryMainPage slug={params?.subcategorySlug} />;
};

export default SubcategoryPage;
