"use client";
import liff from "@line/liff";
let initialization:Promise<void>|null=null;
export function initializeLineSession(){
 if(!initialization)initialization=(async()=>{
  const id=process.env.NEXT_PUBLIC_LIFF_ID;if(!id)return;
  try{
   await liff.init({liffId:id});
   if(liff.isLoggedIn()){
    const idToken=liff.getIDToken();
    if(idToken){const response=await fetch("/api/auth/line",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({idToken})});if(!response.ok&&response.status!==409)throw Error("LINE認証を確認できませんでした");}
   }
  }catch{ /* A guest can still use the standalone web app. */ }
 })();
 return initialization;
}
