"use client";
import {useEffect} from "react";import liff from "@line/liff";
export default function LiffInitializer(){useEffect(()=>{const id=process.env.NEXT_PUBLIC_LIFF_ID;if(!id)return;liff.init({liffId:id}).then(async()=>{if(liff.isLoggedIn()){const token=liff.getIDToken();if(token)await fetch("/api/auth/line",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({idToken:token})})}}).catch(()=>{})},[]);return null}
