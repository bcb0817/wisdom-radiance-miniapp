"use client";
import {initializeLineSession} from "./lineSessionClient";
let pending:Promise<void>|null=null;
export function ensureAccount(){
 if(!pending)pending=initializeLineSession().then(()=>fetch("/api/auth/guest",{method:"POST"})).then(async r=>{if(!r.ok){const b=await r.json();throw Error(b.error||"プロフィールを準備できませんでした")}}).finally(()=>{pending=null});
 return pending;
}
export async function accountFetch(url:string,options?:RequestInit){await ensureAccount();return fetch(url,options)}
