import {checkQuestions} from "./checkQuestions";
import {stories} from "./mockData";
import {checkDemoVoices} from "./checkDemoVoices";
import type {SymptomId,Voice} from "./checkTypes";
export const excelVoices:Voice[]=stories.map(s=>({id:s.id,title:s.title,body:s.intro,topic:s.topic,tags:s.tags,age:s.age+"歳",href:"/stories/"+s.id}));
export function recommendVoices(top:SymptomId[],community:Voice[]=[]):Voice[]{
 if(!top.length)return excelVoices.slice(0,3);
 const questions=top.slice(0,3).map(id=>checkQuestions.find(q=>q.id===id)!);
 const candidates=[...community,...excelVoices];
 const seen=new Set<string>();
 const matches=candidates.filter(v=>{if(seen.has(v.href))return false;seen.add(v.href);return true}).map(v=>{
 const text=[v.title,v.body,...v.tags].join(" ");
 const score=questions.reduce((sum,q,i)=>sum+(3-i)*((q.topic!=="その他"&&(v.topic===q.topic||v.tags.includes(q.topic))?4:0)+q.keywords.filter(k=>text.includes(k)).length),0);
 return {v,score};
 }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,3).map(x=>x.v);
 return matches.length?matches:top.slice(0,3).map(id=>checkDemoVoices.find(v=>v.id==="sample-"+id)!).filter(Boolean);
}
