"use client";

import { useQueueContext } from "@/context/QueueContext";
import { useRouter } from "next/navigation";

const FormPage = () => {
  //put the home component here
  const {token} = useQueueContext();
  const router = useRouter();
  console.log("token in form", token);
  if(!token?.trim()) router.replace("/error/unauthorized")
  return(
    <div>
      <h1>Put the HomeComponent Here</h1>
    </div>
  )
}


export default FormPage;