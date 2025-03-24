"use client";

import QueueHandler from "@/components/QueueHandler";
import { Suspense, useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/firebase-messaging-sw.js")
          .then(() => console.log("Service Worker Registered"))
          .catch((err) => console.error("Service Worker registration failed:", err));
      } else {
        console.warn("Service Workers are not supported in this browser.");
      }
    }
  }, []);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <QueueHandler />
    </Suspense>
  );
}
