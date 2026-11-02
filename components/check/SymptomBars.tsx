import {checkQuestions,answerLabels} from "../../lib/checkQuestions";
import type {CheckResult} from "../../lib/checkTypes";
export default function SymptomBars({result}:{result:CheckResult}){
 return <section className="check-section"><h2>今、特に気になっている変化</h2>
 {!result.top_symptoms.length?<p>今回の回答では、特に気になる項目はありませんでした。今後の変化も、ご自身の感覚を大切にしてください。</p>:<>
 <p>あなたの回答では、{result.top_symptoms.slice(0,2).map(id=>checkQuestions.find(q=>q.id===id)!.label).join("・")}に関する項目が目立ちました。</p>
 <ul className="check-bars">{result.top_symptoms.map(id=>{const q=checkQuestions.find(q=>q.id===id)!;const value=result.answers[id];return <li key={id}><div><span>{q.label}</span><span>{answerLabels[value]}</span></div><div className="check-bar" aria-hidden="true"><span style={{width:(value/3*100)+"%"}}/></div></li>})}</ul></>}
 </section>;
}
