"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {checkQuestions,ageRanges,awarenessOptions,answerLabels,initialAgeRange} from "../../lib/checkQuestions";
import {parseCheckInput,scoreCheck,SCORING_VERSION} from "../../lib/checkScoring";
import type {Answer,Answers} from "../../lib/checkTypes";
import {trackCheck} from "../../lib/checkAnalytics";
import {useCheckSession} from "../../components/check/CheckSession";
import MedicalNotice from "../../components/check/MedicalNotice";
import {initializeLineSession} from "../../lib/lineSessionClient";
export default function CheckPage(){
 const router=useRouter(),session=useCheckSession();
 const [step,setStep]=useState(-1),[answers,setAnswers]=useState<Partial<Answers>>({}),[age,setAge]=useState(""),[awareness,setAwareness]=useState(""),[error,setError]=useState("");
 const changedAge=useRef(false),heading=useRef<HTMLHeadingElement>(null),lock=useRef(false);
 useEffect(()=>{const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),3000);
 // Optional existing identity only. Never create a guest or wait for LIFF to do the check.
 const loadProfile=()=>fetch("/api/me/profile",{cache:"no-store",signal:controller.signal}).then(r=>r.ok?r.json():null).then(p=>{if(p&&!changedAge.current)setAge(initialAgeRange(p.age_range))}).catch(()=>{});
 void loadProfile();void initializeLineSession().then(()=>{if(!controller.signal.aborted)void loadProfile()});
 return ()=>{clearTimeout(timer);controller.abort()};
 },[]);
 useEffect(()=>{lock.current=false;heading.current?.focus()},[step]);
 const start=()=>{session.setResult(null);const id=crypto.randomUUID();session.setRunId(id);trackCheck("self_check_started",id);setStep(0)};
 const answer=(value:Answer)=>{if(lock.current)return;lock.current=true;setAnswers(a=>({...a,[checkQuestions[step].id]:value}));trackCheck("self_check_answered",session.runId,step+1);setStep(step+1)};
 const finish=()=>{
 const input=parseCheckInput({answers,age_range:age,awareness_level:awareness});
 if(!input){setError("年代とすべての回答を確認してください。");return}
 session.setResult({...input,...scoreCheck(input.answers),scoring_version:SCORING_VERSION,created_at:new Date().toISOString()});
 trackCheck("self_check_completed",session.runId);router.push("/check/result");
 };
 return <main className="phone-shell"><section className="page-content check-page">
 <Link href="/" className="back-link">ホームへ戻る</Link><p className="eyebrow">SELF CHECK</p>
 {step===-1?<><h1>今の“ゆらぎ”を整理する</h1><p>ここ2週間ほどを振り返って、今のあなたに近い答えを選んでください。</p><p>変化について10問と、年代・不調の捉え方について2問。目安は約3分です。</p><p>回答はこの画面内で一時的に扱います。ゲストの回答はサーバーに保存しません。再読み込みやタブを閉じると、保存していない結果は失われます。</p><button className="check-primary" onClick={start}>チェックを始める</button></>:<>
 <div className="check-progress"><span>{step<10?"変化のチェック "+(step+1)+" / 10":step===10?"あと2項目：年代":"最後の項目：不調の捉え方"}</span><progress aria-label="全12項目の進捗" max={12} value={step}/></div>
 {step<10?<><h1 ref={heading} tabIndex={-1}>{checkQuestions[step].question}</h1><p className="check-small">ここ2週間ほどの感覚で選んでください。</p>
 <div className="check-options" key={step}>{answerLabels.map((label,i)=><button key={label} type="button" className="check-option" aria-pressed={answers[checkQuestions[step].id]===i} onClick={()=>answer(i as Answer)}>{label}</button>)}</div></>
 :step===10?<><h1 ref={heading} tabIndex={-1}>年代を教えてください</h1><p>この回答で、マイページのプロフィールは変更されません。年代は集計の補足情報として扱い、負担レベルには使いません。</p><div className="check-options">{ageRanges.map(a=><button className="check-option" aria-pressed={age===a} key={a} onClick={()=>{changedAge.current=true;setAge(a)}}>{a}</button>)}</div><button className="check-primary" disabled={!age} onClick={()=>setStep(11)}>次へ</button></>
 :<><h1 ref={heading} tabIndex={-1}>今感じている不調について、「更年期かもしれない」と思ったことはありますか？</h1><p>この回答は、変化の集計や負担レベルには加算しません。</p><div className="check-options">{awarenessOptions.map(o=><button className="check-option" aria-pressed={awareness===o.value} key={o.value} onClick={()=>setAwareness(o.value)}>{o.label}</button>)}</div><button className="check-primary" disabled={!awareness} onClick={finish}>今の変化を見てみる</button>{error&&<p role="alert">{error}</p>}</>}
 <button type="button" className="check-secondary" onClick={()=>setStep(step-1)}>戻る</button></>}
 <MedicalNotice runId={session.runId}/>
 </section></main>;
}
