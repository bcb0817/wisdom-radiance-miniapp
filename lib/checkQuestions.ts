import type {SymptomId} from "./checkTypes";
export const ageRanges = ["30代以下","40〜44歳","45〜49歳","50〜54歳","55〜59歳","60歳以上"] as const;
export const awarenessOptions = [
 {value:"aware",label:"更年期によるものだと思っている"},
 {value:"maybe",label:"もしかしたら更年期かもしれないと思う"},
 {value:"unlikely",label:"あまりそう思っていない"},
 {value:"never",label:"今まで考えたことがなかった"}
] as const;
export const answerLabels = ["特にない","少し気になる","かなり気になる","とてもつらい"] as const;
export const checkQuestions: {id:SymptomId;label:string;question:string;weight:number;topic:string;keywords:string[]}[] = [
 {id:"hot_flash",label:"ほてり",question:"最近、急に顔や上半身が熱くなることはありますか？",weight:1,topic:"ほてり・発汗",keywords:["ほてり","ホットフラッシュ"]},
 {id:"sweating",label:"発汗",question:"暑さや運動に関係なく、急に汗をかいたり寝汗が気になったりしますか？",weight:1,topic:"ほてり・発汗",keywords:["発汗","汗"]},
 {id:"cold",label:"冷え",question:"手足や腰などが冷えて、つらいと感じることはありますか？",weight:1,topic:"その他",keywords:["冷え","冷たい","冷える"]},
 {id:"palpitations",label:"動悸・息切れ",question:"心臓がドキドキしたり、以前より息切れしやすいと感じたりしますか？",weight:1,topic:"その他",keywords:["動悸","息切れ","ドキドキ"]},
 {id:"sleep",label:"睡眠",question:"最近、夜中に目が覚めたり、寝つきにくかったりすることはありますか？",weight:1,topic:"不眠",keywords:["不眠","睡眠","眠","目が覚め"]},
 {id:"irritability",label:"イライラ",question:"以前よりイライラしたり、怒りっぽくなったと感じますか？",weight:1,topic:"イライラ・怒り",keywords:["イライラ","怒り"]},
 {id:"mood",label:"気分の落ち込み",question:"気持ちが沈んだり、何かをする気力がわきにくかったりしますか？",weight:1,topic:"気分の落ち込み",keywords:["落ち込","落ち込み","気持ちが沈","気力"]},
 {id:"dizziness",label:"頭痛・めまい・吐き気",question:"頭が痛い、ふらつく、めまいや吐き気がすることはありますか？",weight:1,topic:"その他",keywords:["頭痛","めまい","ふらつ","吐き気"]},
 {id:"fatigue",label:"疲れ・倦怠感",question:"疲れが抜けにくい、体がだるいと感じることはありますか？",weight:1,topic:"疲れ・倦怠感",keywords:["疲れ","倦怠","だる"]},
 {id:"pain",label:"肩・腰・手足などの痛み",question:"肩や腰、手足などのこりや痛みが気になりますか？",weight:1,topic:"その他",keywords:["肩","腰","痛み","関節"]}
];
export function initialAgeRange(value:unknown):string {
 if(typeof value!=="string")return "";
 if((ageRanges as readonly string[]).includes(value))return value;
 const decade=/^(\d+)代$/.exec(value.trim());
 if(decade){const age=Number(decade[1]);return age<=30?"30代以下":age>=60?"60歳以上":""}
 const exact=/^(\d{1,3})(?:歳)?$/.exec(value.trim());
 if(!exact)return "";
 const age=Number(exact[1]);if(age<1||age>120)return "";
 return age<40?ageRanges[0]:age<45?ageRanges[1]:age<50?ageRanges[2]:age<55?ageRanges[3]:age<60?ageRanges[4]:ageRanges[5];
}
