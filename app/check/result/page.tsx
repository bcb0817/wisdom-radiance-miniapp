"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {useCheckSession} from "../../../components/check/CheckSession";
import {burdenMessages} from "../../../lib/checkScoring";
import {checkQuestions} from "../../../lib/checkQuestions";
import type {CheckResult} from "../../../lib/checkTypes";
import MedicalNotice from "../../../components/check/MedicalNotice";
import SymptomBars from "../../../components/check/SymptomBars";
import SimilarVoices from "../../../components/check/SimilarVoices";
import {trackCheck} from "../../../lib/checkAnalytics";
import {initializeLineSession} from "../../../lib/lineSessionClient";
export default function CheckResultPage(){
 const session=useCheckSession();
 const [result,setResult]=useState<CheckResult|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState(""),[canSave,setCanSave]=useState(false),[consent,setConsent]=useState(false),[saving,setSaving]=useState(false),[saved,setSaved]=useState(false);
 const viewed=useRef("");
 useEffect(()=>{
 const controller=new AbortController();
 const id=new URLSearchParams(window.location.search).get("id");
 if(id){
 fetch("/api/me/checks?id="+encodeURIComponent(id),{cache:"no-store",signal:controller.signal}).then(async r=>{if(!r.ok)throw Error("結果を表示できません。同じLINEアカウントで利用しているか確認してください。");return r.json()}).then(data=>{setResult(data);setSaved(true)}).catch(e=>{if(e.name!=="AbortError")setError(e.message)}).finally(()=>setLoading(false));
 }else{setResult(session.result);setSaved(Boolean(session.result?.id));setLoading(false)}
 const loadProfile=()=>fetch("/api/me/profile",{cache:"no-store",signal:controller.signal}).then(r=>r.ok?r.json():null).then(p=>setCanSave(p?.account_kind==="line")).catch(()=>{});
 void loadProfile();void initializeLineSession().then(()=>{if(!controller.signal.aborted)void loadProfile()});
 return ()=>controller.abort();
 },[session.result]);
 useEffect(()=>{if(!result)return;const key=result.id||result.created_at;if(viewed.current!==key){trackCheck("self_check_result_viewed",session.runId);viewed.current=key}},[result,session.runId]);
 const save=async()=>{
 if(!result||!consent||saving)return;setSaving(true);setError("");
 try{
 const r=await fetch("/api/me/checks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({answers:result.answers,age_range:result.age_range,awareness_level:result.awareness_level,consent:true,request_id:session.runId})});
 const data=await r.json();if(!r.ok)throw Error(data.error||"保存できませんでした。");
 setSaved(true);setResult({...result,id:data.id});session.setResult({...result,id:data.id});
 }catch(e){setError(e instanceof Error?e.message:"保存できませんでした。")}finally{setSaving(false)}
 };
 if(loading)return <main className="phone-shell"><section className="page-content check-page"><p role="status">結果を読み込み中…</p></section></main>;
 if(!result)return <main className="phone-shell"><section className="page-content check-page"><h1>チェック結果がありません</h1><p>{error||"保存していない結果は、再読み込みやタブを閉じると失われます。チェックを始めるか、マイページの保存履歴をご確認ください。"}</p><Link href="/check" className="check-primary">チェックを始める</Link><Link href="/mypage" className="check-secondary">マイページへ</Link><MedicalNotice/></section></main>;
 const topic=checkQuestions.find(q=>q.id===result.top_symptoms[0])?.topic||"その他";
 // No raw answers, scores, or awareness information in URLs.
 const share="/community/new?topic="+encodeURIComponent(topic)+"&from=self-check&checkRun="+encodeURIComponent(session.runId);
 return <main className="phone-shell"><section className="page-content check-page">
 <p className="eyebrow">YOUR REFLECTION</p><h1>今のあなたの変化</h1><p className="check-small">{new Date(result.created_at).toLocaleDateString("ja-JP",{timeZone:"Asia/Tokyo"})}の回答</p>
 <section className="check-summary"><h2>{burdenMessages[result.burden_level]}</h2><p>これらの症状は更年期だけが原因とは限りません。</p><p>このチェックは医療診断を行うものではありません。回答のつらさを整理する独自の目安で、病気の有無や重症度を判定するものではありません。</p><p>結果にかかわらず、症状が続く場合や気になることがある場合は、医療機関への相談も選択肢です。</p></section>
 <SymptomBars result={result}/><MedicalNotice prominent={result.needs_medical_info} runId={session.runId}/>
 <SimilarVoices top={result.top_symptoms} runId={session.runId}/>
 <section className="check-section"><h2>まだ聞きたいことがありますか？</h2><p>話せる範囲で大丈夫です。回答内容が自動で投稿されることはありません。</p><Link className="check-primary" href={share} onClick={()=>trackCheck("self_check_community_cta_clicked",session.runId)}>みんなに相談してみる</Link></section>
 <section className="check-section"><h2>この結果を残す</h2>{saved?<p role="status">マイページの「最近のゆらぎチェック」に保存されています。</p>:canSave?<><p>保存は任意です。年代・不調の捉え方・回答・集計結果・実施日を、本人確認済みのアカウントに紐づけて保存します。他の利用者には公開しません。氏名やLINE表示名は結果に保存しません。履歴はマイページから削除できます。</p><label className="check-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/>この内容を確認し、結果の保存に同意します</label><Link href="/privacy">プライバシーポリシーを確認</Link><button className="check-primary" disabled={!consent||saving} onClick={save}>{saving?"保存中…":"この結果を保存する"}</button></>:<p>ゲストの結果は保存されません。この画面のままご覧いただけますが、再読み込みやタブを閉じると失われます。履歴保存にはLINEで本人確認済みのアカウントが必要です。ゲストからLINEへの引き継ぎは現在未対応です。</p>}
 {error&&<p role="alert">{error}</p>}</section>
 <Link className="check-secondary" href="/check">また変化を感じたらチェックする</Link><Link href="/mypage" className="check-secondary">マイページへ</Link>
 </section></main>;
}
