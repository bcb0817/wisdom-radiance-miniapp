"use client";
import {createContext,useCallback,useContext,useEffect,useRef,useState} from "react";
import {usePathname} from "next/navigation";
import {initializeLineSession} from "../lib/lineSessionClient";
import {readLineFriendship,lineInviteKey,type FriendshipStatus} from "../lib/lineFriendship";
import OfficialLineInvite from "./OfficialLineInvite";
type Status=FriendshipStatus|"loading"|"guest";
const FriendshipContext=createContext<Status>("loading");
export function useLineFriendship(){return useContext(FriendshipContext);}
export default function LiffInitializer({children}:{children:React.ReactNode}){
 const [status,setStatus]=useState<Status>("loading"),[show,setShow]=useState(false);
 const path=usePathname(),dismissed=useRef(false),prompted=useRef(false),key=useRef<string|null>(null);
 useEffect(()=>{
  let active=true,authenticated=false,sequence=0;
  const refresh=async()=>{if(!authenticated||document.visibilityState==="hidden")return;const current=++sequence;const next=await readLineFriendship();if(!active||current!==sequence)return;setStatus(next);if(next==="friend")setShow(false);if(next==="not-friend"&&!dismissed.current&&!prompted.current){prompted.current=true;setShow(true);}};
  initializeLineSession().then(async ok=>{
   if(!active)return;authenticated=ok;
   if(!ok){setStatus("guest");return;}
   key.current=lineInviteKey();
   try{dismissed.current=!!key.current&&localStorage.getItem(key.current)==="1";}catch{/* Keep the invitation optional when storage is unavailable. */}
   await refresh();
  });
  const onReturn=()=>{void refresh();};
  window.addEventListener("focus",onReturn);document.addEventListener("visibilitychange",onReturn);
  return()=>{active=false;sequence++;window.removeEventListener("focus",onReturn);document.removeEventListener("visibilitychange",onReturn);};
 },[]);
 const dismiss=useCallback(()=>{setShow(false);dismissed.current=true;try{if(key.current)localStorage.setItem(key.current,"1");}catch{/* Dismiss for this visit even without storage. */}},[]);
 const excluded=path.startsWith("/admin")||path==="/privacy"||path==="/terms";
 return <FriendshipContext.Provider value={status}>{children}{show&&!excluded&&<OfficialLineInvite onDismiss={dismiss}/>}</FriendshipContext.Provider>;
}
