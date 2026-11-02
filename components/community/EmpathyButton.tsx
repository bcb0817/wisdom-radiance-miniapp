"use client";
import {useEffect,useState} from "react";
import {initializeLineSession} from "../../lib/lineSessionClient";
import {accountFetch} from "../../lib/guestClient";
export default function EmpathyButton({postId,storyId,initialCount=0}:{postId?:string;storyId?:string;initialCount?:number}){
 const [count,setCount]=useState(initialCount),[liked,setLiked]=useState(false),[busy,setBusy]=useState(true),[ready,setReady]=useState(false),[error,setError]=useState("");
 useEffect(()=>{
  let active=true;setBusy(true);setReady(false);setError("");setCount(initialCount);setLiked(false);
  const query=new URLSearchParams(storyId?{storyId}:{postId:postId||""});
  initializeLineSession().then(()=>fetch(`/api/community/reactions?${query}`,{cache:"no-store"})).then(async r=>{const data=await r.json();if(!r.ok)throw Error(data.error);if(active){setCount(data.count);setLiked(data.liked);setReady(true);}}).catch(e=>{if(active)setError(e instanceof Error?e.message:"共感を読み込めませんでした。");}).finally(()=>{if(active)setBusy(false);});
  return ()=>{active=false;};
 },[postId,storyId,initialCount]);
 async function toggle(){
  if(busy||!ready)return;setBusy(true);setError("");
  try{const r=await accountFetch("/api/community/reactions",{method:liked?"DELETE":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(storyId?{storyId}:{postId})});const data=await r.json();if(!r.ok)throw Error(data.error);setCount(data.count);setLiked(data.liked);}
  catch(e){setError(e instanceof Error?e.message:"共感を保存できませんでした。");}finally{setBusy(false);}
 }
 return <div className="empathy-control"><button type="button" className="empathy-button" aria-pressed={liked} aria-busy={busy} aria-label={`${liked?"共感を取り消す":"共感する"}${ready?` ${count}件`:""}`} disabled={busy||!ready} onClick={toggle}><span aria-hidden="true">{liked?"♥":"♡"}</span> {liked?"共感しました":"共感する"}<span className="empathy-count">{ready?count:"—"}</span></button>{error&&<p className="form-error" role="alert">{error}</p>}</div>;
}

