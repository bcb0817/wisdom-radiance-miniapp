import {NextRequest,NextResponse} from "next/server";
import {adminSupabase} from "../../../../lib/supabase/admin";
import {accountId,readSession,sameOrigin,isAccountBlocked} from "../../../../lib/accountSession";
import {parseCheckInput,scoreCheck,SCORING_VERSION} from "../../../../lib/checkScoring";
export const dynamic="force-dynamic";
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const fields="id,age_range,awareness_level,total_score,burden_level,top_symptoms,answers,created_at,scoring_version";
function json(body:unknown,status=200){return NextResponse.json(body,{status,headers:{"Cache-Control":"private, no-store"}})}
async function lineUser(r:NextRequest){
 if(readSession(r)?.kind!=="line"||!adminSupabase)return null;
 const id=await accountId(r);if(!id)return null;
 const {data,error}=await adminSupabase.from("users").select("line_user_id").eq("id",id).maybeSingle();
 return !error&&data?.line_user_id?id:null;
}
function publicResult(row:any){return {...row,needs_medical_info:scoreCheck(row.answers).needs_medical_info}}
export async function GET(r:NextRequest){
 try{
 const user=await lineUser(r);if(!user||!adminSupabase)return json({error:"LINEでの本人確認が必要です"},401);
 const id=r.nextUrl.searchParams.get("id");
 if(id){if(!uuid.test(id))return json({error:"結果が見つかりません"},404);
 const {data,error}=await adminSupabase.from("self_check_results").select(fields).eq("user_id",user).eq("id",id).maybeSingle();
 if(error)return json({error:"履歴を読み込めませんでした"},503);if(!data)return json({error:"結果が見つかりません"},404);
 return json(publicResult(data));
 }
 const {data,error}=await adminSupabase.from("self_check_results").select(fields).eq("user_id",user).order("created_at",{ascending:false}).limit(3);
 return error?json({error:"履歴を読み込めませんでした"},503):json((data||[]).map(publicResult));
 }catch{return json({error:"履歴を読み込めませんでした"},503)}
}
export async function POST(r:NextRequest){
 if(!sameOrigin(r))return json({error:"許可されていない操作です"},403);
 try{
 const user=await lineUser(r);if(!user||!adminSupabase)return json({error:"ゲストの結果は保存できません。LINEでの本人確認が必要です"},401);
 if(await isAccountBlocked(user))return json({error:"保存を制限しています"},403);
 const body=await r.json().catch(()=>null),input=parseCheckInput(body);
 if(!input||body.consent!==true||typeof body.request_id!=="string"||!uuid.test(body.request_id))return json({error:"回答と保存への同意を確認してください"},400);
 // Derive all scores server-side; never trust client user_id, score, or date.
 const score=scoreCheck(input.answers);
 const {data,error}=await adminSupabase.from("self_check_results").insert({user_id:user,...input,total_score:score.total_score,burden_level:score.burden_level,top_symptoms:score.top_symptoms,scoring_version:SCORING_VERSION,consent_version:"self-check-v1",request_id:body.request_id}).select("id").single();
 if(error?.code==="23505"){
 const existing=await adminSupabase.from("self_check_results").select("id").eq("user_id",user).eq("request_id",body.request_id).maybeSingle();
 return existing.data?json(existing.data):json({error:"保存できませんでした"},503);
 }
 return error?json({error:"保存できませんでした。結果はこの画面で引き続きご覧いただけます。"},503):json(data,201);
 }catch{return json({error:"保存できませんでした。時間をおいてお試しください。"},503)}
}
export async function DELETE(r:NextRequest){
 if(!sameOrigin(r))return json({error:"許可されていない操作です"},403);
 try{
 const user=await lineUser(r);if(!user||!adminSupabase)return json({error:"LINEでの本人確認が必要です"},401);
 const body=await r.json().catch(()=>null);if(typeof body?.id!=="string"||!uuid.test(body.id))return json({error:"対象が不正です"},400);
 const {error}=await adminSupabase.from("self_check_results").delete().eq("user_id",user).eq("id",body.id);
 return error?json({error:"削除できませんでした"},503):json({ok:true});
 }catch{return json({error:"削除できませんでした"},503)}
}
