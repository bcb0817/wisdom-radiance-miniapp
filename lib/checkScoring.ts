import {ageRanges, awarenessOptions, checkQuestions} from "./checkQuestions";
import type {Answers, CheckInput, CheckScore, BurdenLevel} from "./checkTypes";
// Editorial burden summary, NOT SMI, a validated medical scale, or a diagnosis.
// Equal weights avoid asserting unsupported medical importance of one symptom.
export const SCORING_VERSION="reflection-v1";
export const burdenMessages:Record<BurdenLevel,string>={
 low:"回答では、気になる変化は少なめです。",
 moderate:"いくつか気になる変化があります。",
 high:"強く気になる変化が重なっています。"
};
export function parseCheckInput(value:unknown):CheckInput|null {
 if(!value||typeof value!=="object")return null;
 const v=value as Record<string,unknown>;
 if(!(ageRanges as readonly unknown[]).includes(v.age_range)||!awarenessOptions.some(o=>o.value===v.awareness_level))return null;
 const answers=v.answers;
 if(!answers||typeof answers!=="object"||Array.isArray(answers)||Object.keys(answers).length!==10)return null;
 if(!checkQuestions.every(q=>{const a=(answers as Record<string,unknown>)[q.id];return typeof a==="number"&&Number.isInteger(a)&&a>=0&&a<=3}))return null;
 return {age_range:v.age_range as string,awareness_level:v.awareness_level as string,answers:Object.fromEntries(checkQuestions.map(q=>[q.id,(answers as Answers)[q.id]])) as Answers};
}
export function scoreCheck(answers:Answers):CheckScore {
 const ranked=checkQuestions.map((q,i)=>({...q,value:answers[q.id],order:i})).sort((a,b)=>b.value-a.value||a.order-b.order);
 const total_score=ranked.reduce((sum,q)=>sum+q.value*q.weight,0);
 const severe=ranked.filter(q=>q.value===3).length;
 const burden_level:BurdenLevel=total_score>=15||severe>=2?"high":total_score>=5||ranked.some(q=>q.value>=2)?"moderate":"low";
 return {total_score,burden_level,top_symptoms:ranked.filter(q=>q.value>0).slice(0,5).map(q=>q.id),needs_medical_info:burden_level==="high"||ranked.some(q=>q.value===3)};
}
