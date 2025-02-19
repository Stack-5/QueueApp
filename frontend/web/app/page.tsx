"use client";

import LoadingComponent from "@/components/LoadingComponent";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <LoadingComponent />
    </Suspense>
  );
}
