import {createHmac,randomBytes,timingSafeEqual} from "node:crypto";
import {NextRequest,NextResponse} from "next/server";
import {adminSupabase} from "./supabase/admin";
const COOKIE="wr_account";
const TTL=60*60*24*180;
type Session={id:string;kind:"guest"|"line";expires:number};
function signature(payload:string){const secret=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!secret)throw Error("認証設定が不足しています");return createHmac("sha256",secret).update("wr-account-v1:"+payload).digest("base64url")}
export function readSession(r:NextRequest):Session|null{
  try{const raw=r.cookies.get(COOKIE)?.value;if(!raw)return null;const [payload,sig,...extra]=raw.split(".");if(!payload||!sig||extra.length)return null;const expected=Buffer.from(signature(payload));const actual=Buffer.from(sig);if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return null;const s=JSON.parse(Buffer.from(payload,"base64url").toString());return typeof s.id==="string"&&/^[0-9a-f-]{36}$/i.test(s.id)&&(s.kind==="guest"||s.kind==="line")&&s.expires>Date.now()?s:null}catch{return null}
}
export function setSession(response:NextResponse,id:string,kind:Session["kind"]){const payload=Buffer.from(JSON.stringify({id,kind,expires:Date.now()+TTL*1000})).toString("base64url");response.cookies.set(COOKIE,payload+"."+signature(payload),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:TTL});}
export async function accountId(r:NextRequest){const session=readSession(r);if(!session||!adminSupabase)return null;const {data,error}=await adminSupabase.from("users").select("id").eq("id",session.id).maybeSingle();return error?null:data?.id||null}
export function sameOrigin(r:NextRequest){return r.headers.get("origin")===r.nextUrl.origin}
export function anonymousName(){return "ゲスト"+randomBytes(8).toString("hex")}
export async function isAccountBlocked(id:string){if(!adminSupabase)return true;const {data:user,error:userError}=await adminSupabase.from("users").select("display_name,is_blocked").eq("id",id).single();if(userError||!user)throw Error("利用状態を確認できませんでした");if(user.is_blocked)return true;const {data,error}=await adminSupabase.from("moderation_blocks").select("id").eq("display_name",user.display_name).limit(1);if(error)throw Error("利用状態を確認できませんでした");return !!data?.length}
