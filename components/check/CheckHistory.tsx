"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {burdenMessages} from "../../lib/checkScoring";
import {checkQuestions} from "../../lib/checkQuestions";
import type {CheckResult} from "../../lib/checkTypes";
import {initializeLineSession} from "../../lib/lineSessionClient";
export default function CheckHistory(){
 const [rows,setRows]=useState<CheckResult[]>([]),[error,setError]=useState(""),[loading,setLoading]=useState(true),[deleting,setDeleting]=useState("");
 useEffect(()=>{const controller=new AbortController();const load=()=>fetch("/api/me/checks",{cache:"no-store",signal:controller.signal}).then(async r=>{if(r.status===401)return [];if(!r.ok)throw Error("チェック履歴を読み込めませんでした。時間をおいて再読み込みしてください。");return r.json()}).then(setRows).catch(e=>{if(e.name!=="AbortError")setError(e.message)}).finally(()=>setLoading(false));void load();void initializeLineSession().then(()=>{if(!controller.signal.aborted)void load()});return ()=>controller.abort()},[]);
 const remove=async(id:string)=>{if(!window.confirm("このチェック結果を削除しますか？削除後は戻せません。"))return;setDeleting(id);setError("");try{const r=await fetch("/api/me/checks",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});if(!r.ok)throw Error("削除できませんでした。");setRows(rows.filter(x=>x.id!==id))}catch(e){setError(e instanceof Error?e.message:"削除できませんでした。")}finally{setDeleting("")}};
 return <section className="check-history"><h2>最近のゆらぎチェック</h2>{loading?<p role="status">履歴を読み込み中…</p>:rows.length?rows.map(r=><article key={r.id}>
 <Link href={"/check/result?id="+r.id}><strong>{new Date(r.created_at).toLocaleDateString("ja-JP",{timeZone:"Asia/Tokyo"})}</strong><p>{r.top_symptoms.map(id=>checkQuestions.find(q=>q.id===id)?.label).join("・")||"気になる変化なし"}</p><p>{burdenMessages[r.burden_level]}</p><span>結果を見る</span></Link>
 <button className="check-secondary" disabled={Boolean(deleting)} onClick={()=>remove(r.id!)}>{deleting===r.id?"削除中…":"この履歴を削除"}</button>
 </article>):!error&&<p>LINEで本人確認し、保存に同意した結果を最新3件表示します。ゲスト利用・未保存の場合、履歴は残りません。</p>}
 {error&&<p role="alert">{error}</p>}<Link href="/check" className="check-secondary">また変化を感じたらチェックする</Link></section>;
}
