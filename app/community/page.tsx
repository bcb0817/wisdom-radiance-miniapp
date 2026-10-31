"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {communityTopics} from "../../lib/mockCommunityData";
import {stories} from "../../lib/mockData";
import {getBlockedUsers} from "../../lib/moderation";
import {listPosts} from "../../lib/community";
import type {CommunityPost} from "../../lib/types";
import PostCard from "../../components/community/PostCard";
import SafetyNotice from "../../components/community/SafetyNotice";

export default function CommunityPage(){
  const [topic,setTopic]=useState("すべて");
  const [posts,setPosts]=useState<CommunityPost[]>([]);
  const [blocked,setBlocked]=useState<string[]>([]);
  const [loadError,setLoadError]=useState(false);
  useEffect(()=>{
    listPosts().then(setPosts).catch(()=>setLoadError(true));
    const initialTopic=new URLSearchParams(window.location.search).get("topic");
    if(initialTopic&&communityTopics.includes(initialTopic))setTopic(initialTopic);
    setBlocked(getBlockedUsers());
  },[]);
  // Filtering retains the original Excel row order; never sort this list.
  const visibleStories=stories.filter(s=>topic==="すべて"||s.topic===topic);
  const visiblePosts=posts.filter(p=>!blocked.includes(p.displayName)&&(topic==="すべて"||p.topic===topic));
  return <main className="phone-shell">
    <header className="page-header"><p>VOICES</p><h1>みんなの体験談</h1><span>日々感じている悩みやゆらぎを共有する場所です。</span></header>
    <section className="page-content">
      <SafetyNotice/>
      <div className="community-actions"><Link href="/community/new" className="primary-link">＋みんなに聞いてもらう</Link></div>
      <div className="topic-scroll"><button className={topic==="すべて"?"selected":""} onClick={()=>setTopic("すべて")}>すべて</button>{communityTopics.map(t=><button key={t} className={topic===t?"selected":""} onClick={()=>setTopic(t)}>{t}</button>)}</div>
      {loadError&&<p role="status">ユーザーからの投稿を読み込めませんでした。時間をおいて再度お試しください。</p>}
      {visiblePosts.length>0&&<section aria-label="ユーザーからの投稿"><h2>新しい投稿</h2><p className="result-count">{visiblePosts.length}件の投稿・新しい順</p><div className="post-list">{visiblePosts.map(p=><PostCard key={p.id} post={p}/>)}</div></section>}
      <p className="result-count">{visibleStories.length}件の体験談</p>
      <div className="post-list">{visibleStories.map(s=><Link key={s.id} href={`/stories/${s.id}`} className="community-card">
        <div className="post-meta"><span className="avatar">{s.age}</span><span>{s.age}歳・{s.gender}</span></div>
        <div className="tags">{s.tags.map(tag=><span key={tag}>#{tag}</span>)}</div>
        <h2>{s.title}</h2><p>{s.intro}</p>
      </Link>)}</div>
    </section>
  </main>;
}
