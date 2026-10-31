"use client";
import {useEffect,useState} from "react";
import {accountFetch} from "../lib/guestClient";
export default function SaveStoryButton({storyId,postId}:{storyId?:string;postId?:string}){
 const [saved,setSaved]=useState(false),[busy,setBusy]=useState(true),[ready,setReady]=useState(false),[error,setError]=useState("");
 useEffect(()=>{
 let active=true;setBusy(true);setReady(false);setError("");setSaved(false);
 accountFetch("/api/me/saves",{cache:"no-store"}).then(async r=>{
 if(!r.ok)throw Error("保存状態を確認できませんでした。ページを再読み込みしてください。");
 const rows=await r.json();if(active){setSaved(rows.some((s:any)=>storyId?s.story_id===storyId:s.post_id===postId));setReady(true)}
 }).catch(e=>{if(active)setError(e.message)}).finally(()=>{if(active)setBusy(false)});
 return ()=>{active=false};
 },[storyId,postId]);
 const toggle=async()=>{
 setBusy(true);setError("");
 try{
 const r=await accountFetch("/api/me/saves",{method:saved?"DELETE":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(storyId?{storyId}:{postId})});
 if(!r.ok){const b=await r.json();throw Error(b.error||"保存できませんでした。")}
 setSaved(!saved);
 }catch(e){setError(e instanceof Error?e.message:"通信に失敗しました。再度お試しください。")}finally{setBusy(false)}
 };
 return <div><button type="button" className="like-button" disabled={busy||!ready} aria-pressed={saved} onClick={toggle}>{busy?"確認中…":saved?"保存済み・解除する":"体験談を保存する"}</button>{error&&<p role="alert">{error}</p>}</div>;
}
