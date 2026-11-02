import type {CSSProperties} from "react";
export type VoiceIconName="leaf"|"heart"|"cloud"|"waves"|"moon"|"bolt"|"drop"|"body"|"more"|"pen"|"home"|"star"|"plus"|"user";
const paths:Record<VoiceIconName,React.ReactNode>={
 leaf:<><path d="M5 20C3 9 10 4 20 3c0 10-5 17-15 17Z"/><path d="m4 21 11-12"/></>,
 heart:<path d="M20.8 4.9a5.5 5.5 0 0 0-7.8 0L12 6l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.3a5.5 5.5 0 0 0 0-7.8Z"/>,
 cloud:<path d="M6 18a4 4 0 0 1-.5-8A6.5 6.5 0 0 1 18 8a5 5 0 0 1 0 10Z"/>,
 waves:<><path d="M2 6c3-5 5 5 9 0s6 5 11 0M2 12c3-5 5 5 9 0s6 5 11 0M2 18c3-5 5 5 9 0s6 5 11 0"/></>,
 moon:<path d="M20 16A9 9 0 0 1 8 4a9 9 0 1 0 12 12Z"/>,
 bolt:<path d="m13 2-9 12h7l-1 8 10-13h-8Z"/>,
 drop:<path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z"/>,
 body:<><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 3v4m6-4v4M9 12v5m6-5v5m-6-3h6"/></>,
 more:<><circle cx="4" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="20" cy="12" r="1"/></>,
 pen:<><path d="m4 16 12-12 4 4L8 20l-5 1Z"/><path d="m13 7 4 4M4 16l4 4"/></>,
 home:<><path d="m3 11 9-8 9 8M5 10v11h14V10"/><path d="M9 21v-7h6v7"/></>,
 star:<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>,
 plus:<path d="M12 4v16M4 12h16"/>,
 user:<circle cx="12" cy="12" r="9"/>
};
export default function VoiceIcon({name,className,style}:{name:VoiceIconName;className?:string;style?:CSSProperties}){return <svg className={className} style={style} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;}
