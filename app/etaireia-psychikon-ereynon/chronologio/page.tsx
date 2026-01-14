import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Χρονολόγιο Εταιρείας Ψυχικών Ερευνών",
  description:
    "Δες τη χρονολογική εξέλιξη των ερευνών και δημοσιεύσεων της Εταιρείας Ψυχικών Ερευνών μέσα από ένα οριζόντιο χρονολόγιο.",
  alternates: {
    canonical: "https://haunted.gr/chronologia/etaireia-psychikon-ereynon",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChronologioPage() {
  redirect("/chronologia/etaireia-psychikon-ereynon");
}
