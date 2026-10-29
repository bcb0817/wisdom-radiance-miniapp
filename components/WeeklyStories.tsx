"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {stories} from "../lib/mockData";
export default function WeeklyStories(){
  const [items,setItems]=useState<{story_id:string;views:number}[]>([]);
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{
    let active=true;
    async function refresh(){try{const r=await fetch("/api/stories/ranking",{cache:"no-store"});if(!r.ok)throw Error();const data=await r.json();if(active)setItems(data.items);}catch{if(active)setItems([]);}finally{if(active)setLoaded(true);}}
    void refresh();const timer=setInterval(refresh,60000);
    return ()=>{active=false;clearInterval(timer)};
  },[]);
  const ranked=items.flatMap(item=>{const story=stories.find(s=>s.id===item.story_id);return story?[story]:[]});
  const shown=ranked.length?ranked:stories.slice(0,6);
  return <section aria-label="週間ランキング"><h2>{ranked.length?"今週よく読まれている体験談":"みんなの体験談"}</h2>
    <p className="lead">{ranked.length?"今週（月曜〜日曜・日本時間）の閲覧数順。随時更新。":loaded?"週間ランキングは閲覧データが集まり次第表示します。":"週間ランキングを読み込んでいます。"}</p>
    <div className="post-list">{shown.map((s,i)=><Link className="community-card" key={s.id} href={`/stories/${s.id}`}>
      {ranked.length>0&&<strong>{i+1}位</strong>}<div className="post-meta"><span>{s.age}歳・{s.gender}</span></div><h2>{s.title}</h2><p>{s.intro}</p>
    </Link>)}</div></section>;
}
