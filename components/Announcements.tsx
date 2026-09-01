"use client";
import {useEffect,useState} from "react";
export default function Announcements(){const [items,setItems]=useState<any[]>([]);useEffect(()=>{fetch("/api/announcements").then(r=>r.ok?r.json():[]).then(setItems).catch(()=>{})},[]);if(!items.length)return null;return <section className="safety-notice"><strong>管理者からのお知らせ</strong>{items.map(item=><div key={item.id}><p><b>{item.title}</b></p><p>{item.body}</p></div>)}</section>}
