"use client";

import { useQueueContext } from "@/context/QueueContext";
import { useRouter } from "next/navigation";
import HomeComponent from "@/components/HomeComponent";
import { useEffect } from "react";

const FormPage = () => {
  const { token } = useQueueContext();
  const router = useRouter();

  useEffect(() => {
    if (!token?.trim()) {
      router.replace("/error/unauthorized");
    }
  }, [token, router]);

  return <HomeComponent />;
};

export default FormPage;
