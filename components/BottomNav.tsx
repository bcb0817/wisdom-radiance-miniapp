"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import VoiceIcon,{type VoiceIconName} from "./VoiceIcon";
const items:{href:string;icon:VoiceIconName;label:string}[]=[{href:"/",icon:"home",label:"ホーム"},{href:"/community",icon:"star",label:"みんなの体験談"},{href:"/community/new",icon:"plus",label:"みんなに聞いてもらう"},{href:"/mypage",icon:"user",label:"マイページ"}];
export default function BottomNav(){const path=usePathname();return <nav className="bottom-nav" aria-label="メインメニュー">{items.map(({href,icon,label})=>{const active=href==="/"?path==="/":href==="/community"?path==="/community"||path.startsWith("/community/")&&path!=="/community/new":path.startsWith(href);return <Link key={href} href={href} className={active?"active":""} aria-current={active?"page":undefined}><VoiceIcon name={icon}/><small>{label}</small></Link>;})}</nav>;}


