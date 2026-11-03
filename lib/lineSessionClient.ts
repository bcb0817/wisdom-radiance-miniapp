"use client";
import liff from "@line/liff";
let initialization:Promise<boolean>|null=null;
// Resolve true only after the server has established a LINE account session.
export function initializeLineSession(){
 if(!initialization)initialization=(async()=>{
  const id=process.env.NEXT_PUBLIC_LIFF_ID;if(!id)return false;
  try{
   await liff.init({liffId:id});
   if(liff.isLoggedIn()){
    const idToken=liff.getIDToken();
    if(idToken){const response=await fetch("/api/auth/line",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({idToken})});return response.ok;}
   }
  }catch{ /* A guest can still use the standalone web app. */ }
  return false;
 })();
 return initialization;
}
