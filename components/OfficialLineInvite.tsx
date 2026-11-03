"use client";
import {useEffect,useRef} from "react";
const FRIEND_URL="https://line.me/R/ti/p/@429gonyu";
export default function OfficialLineInvite({onDismiss}:{onDismiss?:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(onDismiss&&!dialog.current?.open)dialog.current?.showModal();},[onDismiss]);
 const content=<><p className="official-line-eyebrow">WISDOM RADIANCE 公式LINE</p><h2 id={onDismiss?"official-line-dialog-title":"official-line-title"}>また、ここでお会いできるように</h2><p>WISDOM RADIANCEの公式LINEを友だち追加すると、リッチメニューからいつでもWISDOM VOICEにアクセスできます。</p><p>新しい投稿のお知らせもLINEでお届けしています。</p><a className="official-line-button" href={FRIEND_URL} onClick={()=>{if(onDismiss)dialog.current?.close();}} target="_blank" rel="noopener noreferrer">公式LINEを友だち追加する <span aria-hidden="true">↗</span></a>{onDismiss&&<button type="button" className="official-line-later" onClick={()=>dialog.current?.close()}>あとで</button>}</>;
 if(onDismiss)return <dialog className="official-line-dialog" ref={dialog} aria-labelledby="official-line-dialog-title" onClose={onDismiss}>{content}</dialog>;
 return <section className="official-line-invite" aria-labelledby="official-line-title">{content}</section>;
}

