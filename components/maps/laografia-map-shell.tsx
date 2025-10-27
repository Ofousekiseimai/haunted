"use client";

import dynamic from "next/dynamic";

import type { MapArticle, SubcategoryOption } from "@/lib/maps";

const LaografiaInteractiveMap = dynamic(
  () => import("./laografia-map").then((mod) => mod.LaografiaInteractiveMap),
  { ssr: false },
);

type LaografiaMapShellProps = {
  articles: MapArticle[];
  subcategories: SubcategoryOption[];
  initialSubcategory?: string;
};

export function LaografiaMapShell(props: LaografiaMapShellProps) {
  return <LaografiaInteractiveMap {...props} />;
}
