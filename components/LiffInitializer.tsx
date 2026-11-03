"use client";
import {useCallback,useEffect,useState} from "react";
import {usePathname} from "next/navigation";
import {initializeLineSession} from "../lib/lineSessionClient";
import OfficialLineInvite from "./OfficialLineInvite";
const KEY="wr-official-line-invite-dismissed-v1";
export default function LiffInitializer(){
 const [show,setShow]=useState(false);
 const path=usePathname();
 useEffect(()=>{let active=true;initializeLineSession().then(authenticated=>{if(!active||!authenticated)return;try{if(localStorage.getItem(KEY)==="1")return;}catch{/* The invitation still works when storage is unavailable. */}setShow(true);});return()=>{active=false;};},[]);
 const dismiss=useCallback(()=>{setShow(false);try{localStorage.setItem(KEY,"1");}catch{/* Dismiss for this visit even without storage. */}},[]);
 if(!show||path.startsWith("/admin")||path==="/privacy"||path==="/terms")return null;
 return <OfficialLineInvite onDismiss={dismiss}/>;
}
