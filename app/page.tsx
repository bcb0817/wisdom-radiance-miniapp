"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {listPosts} from "../lib/community";
import {stories} from "../lib/mockData";
import {getBlockedUsers} from "../lib/moderation";
import type {CommunityPost} from "../lib/types";
import PostCard from "../components/community/PostCard";
import StoryCard from "../components/community/StoryCard";
import VoiceIcon,{type VoiceIconName} from "../components/VoiceIcon";

import OfficialLineBanner from "../components/OfficialLineBanner";
import HomeAccess from "../components/HomeAccess";
const topics:{label:string;icon:VoiceIconName;color:string}[]=[
 {label:"戸惑い・不安",icon:"heart",color:"#cf7f83"},{label:"気分の落ち込み",icon:"cloud",color:"#82afad"},
 {label:"疲れ・倦怠感",icon:"waves",color:"#82afb2"},{label:"不眠",icon:"moon",color:"#a397cd"},
 {label:"イライラ・怒り",icon:"bolt",color:"#e9b453"},{label:"ほてり・発汗",icon:"drop",color:"#d7887a"},
 {label:"体重・体型の変化",icon:"body",color:"#b7b875"},{label:"その他",icon:"more",color:"#7d9b98"}
];
export default function Home(){
 const [posts,setPosts]=useState<CommunityPost[]>([]),[loading,setLoading]=useState(true),[loadError,setLoadError]=useState(false);
 useEffect(()=>{let active=true;listPosts().then(rows=>{if(active){const blocked=getBlockedUsers();setPosts(rows.filter(p=>!blocked.includes(p.displayName)).slice(0,6));}}).catch(()=>{if(active)setLoadError(true);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[]);
 const post=posts[0],olderPosts=posts.slice(1);
 const fallback=stories[0];
 return <main className="phone-shell home-page">
  <header className="page-header home-header"><h1>WISDOM VOICE</h1><p>「私だけじゃなかった」と思える場所。</p></header>
  <div className="page-content home-content">
   <OfficialLineBanner/>
   <section aria-labelledby="topics-heading"><h2 id="topics-heading" className="home-section-title"><VoiceIcon name="leaf"/>気になるゆらぎから探す</h2><div className="topic-grid">{topics.map(t=><Link href={`/community?topic=${encodeURIComponent(t.label)}`} key={t.label}><VoiceIcon name={t.icon} style={{color:t.color}}/><span>{t.label}</span></Link>)}</div></section>
   <section aria-labelledby="recent-heading"><h2 id="recent-heading" className="home-section-title">最近届いた声</h2>
    {loading?<p className="lead" role="status">声を読み込んでいます…</p>:post?<PostCard post={post}/>:<StoryCard story={fallback}/>}
   </section>
   <Link href="/community/new" className="home-post-cta"><VoiceIcon name="pen"/><span><strong>あなたの声も聞かせてください</strong><small>匿名で投稿できます</small></span><svg className="cta-rays" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><path d="M7 15 10 5M14 19 21 11M19 25 29 22" fill="none" stroke="#edc477" strokeWidth="2.5" strokeLinecap="round"/></svg></Link>

   {!loading&&olderPosts.length>0&&<section aria-labelledby="older-voices-heading"><h2 id="older-voices-heading" className="home-section-title">これまでに届いた声</h2><div className="post-list">{olderPosts.map(p=><PostCard key={p.id} post={p}/>)}</div><Link href="/community" className="home-all-voices">みんなの体験談をもっと見る →</Link></section>}
   {loadError&&<p className="lead" role="status">新しい投稿を読み込めませんでした。時間をおいて再度お試しください。</p>}
   <details className="home-more"><summary>リンク・ご利用について</summary><HomeAccess/></details>
  </div>

 </main>;
}
