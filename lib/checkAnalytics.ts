"use client";
export type CheckEvent="self_check_started"|"self_check_answered"|"self_check_completed"|"self_check_result_viewed"|"self_check_similar_voice_clicked"|"self_check_community_cta_clicked"|"self_check_medical_info_clicked"|"self_check_community_posted";
// Integration hook only: no external transport and no health/profile fields.
// A future analytics adapter can listen for this event after appropriate consent.
export function trackCheck(event:CheckEvent,runId:string,step?:number){
 if(typeof window==="undefined")return;
 window.dispatchEvent(new CustomEvent("wisdom:self-check",{detail:{event,runId,...(Number.isInteger(step)?{step}:{}),version:1}}));
}
