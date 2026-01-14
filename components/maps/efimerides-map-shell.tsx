"use client";

import dynamic from "next/dynamic";

import type { MapArticle, SubcategoryOption } from "@/lib/maps";

const EfimeridesInteractiveMap = dynamic(
  () => import("./efimerides-map").then((mod) => mod.EfimeridesInteractiveMap),
  { ssr: false },
);

type EfimeridesMapShellProps = {
  articles: MapArticle[];
  subcategories: SubcategoryOption[];
};

export function EfimeridesMapShell(props: EfimeridesMapShellProps) {
  return <EfimeridesInteractiveMap {...props} />;
}
