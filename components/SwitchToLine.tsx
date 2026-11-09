"use client";
import {useEffect,useState} from "react";
import liff from "@line/liff";
import {ensureAccount} from "../lib/guestClient";

export default function SwitchToLine(){
 const [visible,setVisible]=useState(false),[confirm,setConfirm]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState("");
 useEffect(()=>{
  let active=true;
  ensureAccount().then(async()=>{
   if(!active||!process.env.NEXT_PUBLIC_LIFF_ID)return;
   let inLine=/(?:^|\s)Line\//i.test(navigator.userAgent);
   try{inLine=inLine||liff.isInClient();}catch{/* Keep the LINE browser fallback. */}
   if(!inLine)return;
   const r=await fetch("/api/auth/line",{cache:"no-store"});
   if(r.ok&& (await r.json()).guest===true&&active)setVisible(true);
  }).catch(()=>{});
  return ()=>{active=false;};
 },[]);
 if(!visible)return null;
 async function switchAccount(){
  if(busy)return;
  setBusy(true);setError("");
  try{
   const idToken=liff.getIDToken();
   if(!idToken)throw Error("LINE認証を確認できません。ミニアプリを開き直してお試しください。");
   const r=await fetch("/api/auth/line",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({idToken,replaceGuest:true})});
   if(!r.ok)throw Error((await r.json().catch(()=>null))?.error||"LINEへの切り替えに失敗しました。");
   window.location.reload();
  }catch(e){setError(e instanceof Error?e.message:"切り替えに失敗しました。");setBusy(false);}
 }
 return <section aria-labelledby="switch-line-title"><h2 id="switch-line-title">LINEアカウントで利用する</h2>{confirm?<><p>現在のゲスト利用を終了します。公開済みの投稿は残りますが、以前のマイページには戻れなくなり、投稿履歴や保存した体験談は引き継がれません。</p><button type="button" className="primary-button" disabled={busy} onClick={switchAccount}>{busy?"LINE認証を確認中…":"ゲスト利用を終了してLINEに切り替える"}</button><button type="button" className="like-button" disabled={busy} onClick={()=>{setConfirm(false);setError("");}}>キャンセル</button>{error&&<p role="alert">{error}</p>}</>:<><p>現在はゲストとして利用しています。</p><button type="button" className="like-button" onClick={()=>setConfirm(true)}>LINE認証に切り替える</button></>}</section>;
}
