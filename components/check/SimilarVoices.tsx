"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {recommendVoices} from "../../lib/checkRecommendations";
import type {SymptomId,Voice} from "../../lib/checkTypes";
import {trackCheck} from "../../lib/checkAnalytics";
export default function SimilarVoices({top,runId}:{top:SymptomId[];runId:string}){
 const [community,setCommunity]=useState<Voice[]>([]);
 useEffect(()=>{const controller=new AbortController();fetch("/api/community/posts",{signal:controller.signal,cache:"no-store"}).then(r=>r.ok?r.json():[]).then(rows=>{
 if(!Array.isArray(rows))return;setCommunity(rows.filter(p=>typeof p.id==="string"&&typeof p.title==="string").map(p=>({id:p.id,title:p.title,body:p.body||"",topic:p.topic,tags:[p.topic],age:p.ageRange||"年代未設定",href:"/community/"+p.id})));
 }).catch(()=>{});return ()=>controller.abort()},[]);
 const voices=recommendVoices(top,community);
 return <section className="check-section"><h2>{top.length?"あなたと似た人の声":"みんなの声を読んでみる"}</h2>
 <p className="check-small">回答に関連するテーマの声です。同じ原因・病気・年代を示すものではありません。</p>
 <div className="post-list">{voices.map(v=><Link className="community-card" href={v.href} key={v.href} onClick={()=>trackCheck("self_check_similar_voice_clicked",runId)}>
 <span>{v.sample?"サンプル・架空の声":v.age}</span><div className="tags">{v.tags.map(t=><span key={t}>#{t}</span>)}</div><h3>{v.title}</h3><p>{v.body}</p><span className="check-read">声を読む</span>
 </Link>)}</div></section>;
}
