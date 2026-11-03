"use client";
import {useEffect,useRef} from "react";
const FRIEND_URL="https://line.me/R/ti/p/@429gonyu";
export default function OfficialLineInvite({onDismiss,compact=false}:{onDismiss?:()=>void;compact?:boolean}){
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(onDismiss&&!dialog.current?.open)dialog.current?.showModal();},[onDismiss]);
 if(compact)return <aside className="official-line-banner" aria-label="公式LINEのご案内"><div><strong>次回も迷わず、ここへ。</strong><p>公式LINEのメニューからいつでも開けます。</p></div><a href={FRIEND_URL} target="_blank" rel="noopener noreferrer">友だち追加 <span aria-hidden="true">↗</span></a></aside>;
 const content=<><p className="official-line-eyebrow">WISDOM RADIANCE 公式LINE</p><h2 id={onDismiss?"official-line-dialog-title":"official-line-title"}>次回も迷わず、ここへ。</h2><p>公式LINEを友だち追加すると、リッチメニューからいつでもWISDOM VOICEに戻れます。</p><p>新しい投稿のお知らせもLINEでお届けします。</p><a className="official-line-button" href={FRIEND_URL} onClick={()=>{if(onDismiss)dialog.current?.close();}} target="_blank" rel="noopener noreferrer">公式LINEを友だち追加する <span aria-hidden="true">↗</span></a>{onDismiss&&<button type="button" className="official-line-later" onClick={()=>dialog.current?.close()}>あとで・このまま利用する</button>}</>;
 if(onDismiss)return <dialog className="official-line-dialog" ref={dialog} aria-labelledby="official-line-dialog-title" onClose={onDismiss}>{content}</dialog>;
 return <section className="official-line-invite" aria-labelledby="official-line-title">{content}</section>;
}
