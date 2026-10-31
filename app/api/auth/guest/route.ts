import {NextRequest,NextResponse} from "next/server";
import {adminSupabase} from "../../../../lib/supabase/admin";
import {accountId,anonymousName,readSession,sameOrigin,setSession} from "../../../../lib/accountSession";
export async function POST(r:NextRequest){
 if(!sameOrigin(r))return NextResponse.json({error:"許可されていない操作です"},{status:403});
 if(!adminSupabase)return NextResponse.json({error:"現在プロフィールを作成できません。時間をおいてお試しください。"},{status:503});
 const existing=await accountId(r);if(existing){const response=NextResponse.json({ok:true});setSession(response,existing,readSession(r)!.kind);return response}
 const {data,error}=await adminSupabase.from("users").insert({display_name:anonymousName()}).select("id").single();
 if(error)return NextResponse.json({error:"ゲストプロフィールを作成できませんでした"},{status:503});
 const response=NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store"}});setSession(response,data.id,"guest");return response;
}
