import {NextRequest,NextResponse} from "next/server";
import {adminSupabase} from "../../../../lib/supabase/admin";
import {accountId,readSession,sameOrigin,isAccountBlocked} from "../../../../lib/accountSession";
export async function GET(r:NextRequest){const id=await accountId(r);if(!id||!adminSupabase)return NextResponse.json({error:"プロフィールの準備が必要です"},{status:401});const {data,error}=await adminSupabase.from("users").select("display_name,age_range").eq("id",id).single();if(error)return NextResponse.json({error:"プロフィールを読み込めませんでした"},{status:500});return NextResponse.json({...data,account_kind:readSession(r)!.kind},{headers:{"Cache-Control":"no-store"}})}
export async function PUT(r:NextRequest){
if(!sameOrigin(r))return NextResponse.json({error:"許可されていない操作です"},{status:403});
const id=await accountId(r);if(!id||!adminSupabase)return NextResponse.json({error:"プロフィールの準備が必要です"},{status:401});
if(await isAccountBlocked(id))return NextResponse.json({error:"プロフィールの変更を制限しています"},{status:403});
const b=await r.json().catch(()=>null);const name=typeof b?.displayName==="string"?b.displayName.trim():"";const age=typeof b?.ageRange==="string"?b.ageRange.trim():"";
if(!name||name.length>30||!(/^(?:[1-9][0-9]?|1[01][0-9]|120)(?:歳)?$|^(?:10|20|30|40|50|60|70|80|90|100)代$/.test(age)))return NextResponse.json({error:"匿名の名前は30文字以内、年齢は1〜120歳または「40代」のように入力してください。"},{status:400});
const {data,error}=await adminSupabase.from("users").update({display_name:name,age_range:age}).eq("id",id).select("display_name,age_range").single();
if(error)return NextResponse.json({error:error.code==="23505"?"その名前は使われています。別の名前を入力してください。":"保存できませんでした。時間をおいてお試しください。"},{status:400});return NextResponse.json(data);
}
