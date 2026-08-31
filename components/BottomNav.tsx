"use client";
import Link from "next/link"; import {usePathname} from "next/navigation";
const items=[['/','⌂','ホーム'],['/community','✦','みんなの体験談'],['/community/new','→ ＋','みんなに聞いてもらう'],['/mypage','○','マイページ']];
export default function BottomNav(){const path=usePathname(); return <nav className="bottom-nav">{items.map(([href,icon,label])=>{const active=href==='/'?path==='/':path.startsWith(href); return <Link key={href} href={href} className={active?'active':''}><span>{icon}</span><small>{label}</small></Link>})}</nav>}
