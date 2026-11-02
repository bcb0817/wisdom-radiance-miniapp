"use client";
import {useEffect,useState} from "react";
import liff from "@line/liff";
import {initializeLineSession} from "../lib/lineSessionClient";
export default function HomeAccess(){
 const [available,setAvailable]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const id=process.env.NEXT_PUBLIC_LIFF_ID;
 const miniUrl=id?`https://miniapp.line.me/${id}`:null;
 useEffect(()=>{let active=true;initializeLineSession().then(()=>{if(active&&id)setAvailable(liff.isInClient()&&liff.isApiAvailable("createShortcutOnHomeScreen"));}).catch(()=>{});return()=>{active=false;};},[id]);
 async function add(){if(!miniUrl||busy)return;setBusy(true);setMessage("");try{await liff.createShortcutOnHomeScreen({url:miniUrl});setMessage("表示された案内に沿って、ホーム画面に追加してください。");}catch{setMessage("この環境では追加できませんでした。LINEのメニューからもご確認ください。");}finally{setBusy(false);}}
 async function copy(){if(!miniUrl)return;try{await navigator.clipboard.writeText(miniUrl);setMessage("リンクをコピーしました。");}catch{setMessage("下の「LINEで開く」リンクを長押ししてコピーしてください。");}}
 if(!miniUrl)return null;
 return <section className="home-access" aria-labelledby="access-heading"><h2 id="access-heading">また、ここで会えるように</h2><p>LINEで開くリンクを保存しておくと、いつでも声を読みに来られます。</p><div className="access-actions">{available&&<button type="button" disabled={busy} onClick={add}>{busy?"準備中…":"ホーム画面に追加"}</button>}<a href={miniUrl}>LINEで開く</a><button type="button" onClick={copy}>リンクをコピー</button></div><p className="access-note">同じLINEアカウントで開くと、LINEに紐づいたプロフィールを利用できます。ブラウザのゲストプロフィールとは別になります。</p>{message&&<p role="status">{message}</p>}</section>;
}
