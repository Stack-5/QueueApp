(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{2721:(e,r,t)=>{Promise.resolve().then(t.bind(t,8468))},8468:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>l});var o=t(5155),n=t(2651),a=t(3205),s=t(7684),i=t(6046),c=t(2115);let u=()=>{let e=(0,i.useSearchParams)(),r=(0,i.useRouter)(),[t,u]=(0,c.useState)(!1);return(0,c.useEffect)(()=>{(async()=>{let t=e.get("token"),o=localStorage.getItem("token"),i=t||o;if(t&&localStorage.setItem("token",t),!i){console.warn("[processInitialQueueInformation] No token found. Redirecting to 401."),r.replace("/error/unauthorized");return}console.log("tokenContainer",i);try{let e={Authorization:"Bearer ".concat(i)};await n.A.get("".concat("https://neu-43k5gfcwva-uc.a.run.app","/queue/notify-on-initial-mount"),{headers:e}),await n.A.get("".concat("https://neu-43k5gfcwva-uc.a.run.app","/queue/verify-on-mount"),{headers:e});let t=(0,s.s)(i);switch(console.log("[processQueueInformation] Valid token found:",t),u(!0),t.type){case"queue-form":console.log("[QueueInit] Redirecting to /form."),r.replace("/form");break;case"queue-status":console.log("[QueueInit] Redirecting to /queue-status."),r.replace("/queue-status");break;case"permission":try{let t=await n.A.get("".concat("https://neu-43k5gfcwva-uc.a.run.app","/queue/get-valid-token-for-queue-access"),{headers:e}),o=t.data.token;201===t.status&&o?(localStorage.setItem("token",o),console.log("[QueueInit] Permission upgraded to queue-form. Redirecting to /form."),r.replace("/form")):(console.warn("[QueueInit] Failed to upgrade permission token."),r.replace("/error/unauthorized"))}catch(e){console.error("[QueueInit] Error fetching form access token:",e),r.replace("/error/unauthorized")}break;default:console.warn("[processQueueInformation] Unknown token type. Redirecting to 401."),r.replace("/error/unauthorized")}}catch(e){if((0,a.F0)(e)){var c,l,d;console.error("[processQueueInformation] Axios error:",null===(c=e.response)||void 0===c?void 0:c.data.message),(null===(l=e.response)||void 0===l?void 0:l.status)===401||(null===(d=e.response)||void 0===d?void 0:d.status)===403?(localStorage.removeItem("token"),r.replace("/error/unauthorized")):r.replace("/error/internal-server-error")}}})()},[]),(0,o.jsxs)("div",{className:"flex flex-col justify-center items-center h-screen text-center px-6 transition-opacity duration-500 ".concat(t?"opacity-0":"opacity-100"),children:[(0,o.jsx)("div",{className:"w-12 h-12 border-4 border-gray-300 border-t-[#FFBF00] rounded-full animate-spin mb-6"}),(0,o.jsx)("h2",{className:"text-xl font-semibold text-gray-700",children:"Fetching your queue..."}),(0,o.jsx)("p",{className:"text-sm text-gray-500 mt-2",children:"Please wait while we get your spot in line."})]})};function l(){return(0,c.useEffect)(()=>{"serviceWorker"in navigator?navigator.serviceWorker.register("/firebase-messaging-sw.js").then(()=>console.log("Service Worker Registered")).catch(e=>console.error("Service Worker registration failed:",e)):console.warn("Service Workers are not supported in this browser.")},[]),(0,o.jsx)(c.Suspense,{fallback:(0,o.jsx)("p",{children:"Loading..."}),children:(0,o.jsx)(u,{})})}}},e=>{var r=r=>e(e.s=r);e.O(0,[451,441,517,358],()=>r(2721)),_N_E=e.O()}]);