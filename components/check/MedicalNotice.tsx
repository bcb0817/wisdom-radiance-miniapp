"use client";
import {trackCheck} from "../../lib/checkAnalytics";
export default function MedicalNotice({prominent=false,runId=""}:{prominent?:boolean;runId?:string}){
 return <aside className={"check-medical"+(prominent?" check-medical-prominent":"")}>
 <p><strong>このチェックは医療診断を行うものではありません。</strong></p>
 {prominent&&<><h2>医療機関へ相談する目安</h2><p>症状が強い、続いている、日常生活に支障がある場合は、婦人科など医療機関への相談も検討してください。</p></>}
 <p>突然の強い胸痛、意識がはっきりしない、激しい呼吸困難など急な重い症状がある場合は、チェックを続けず、結果に関係なく救急医療を利用してください。日本では緊急時は119です。</p>
 <a href="https://kakarikata.mhlw.go.jp/kakaritsuke/urgency.html" target="_blank" rel="noopener noreferrer" onClick={()=>trackCheck("self_check_medical_info_clicked",runId)}>救急受診の目安（厚生労働省・別タブ）</a>
 </aside>;
}
