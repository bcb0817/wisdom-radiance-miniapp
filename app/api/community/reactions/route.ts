import {NextRequest,NextResponse} from "next/server";
import {adminSupabase} from "../../../../lib/supabase/admin";
import {accountId,isAccountBlocked,sameOrigin} from "../../../../lib/accountSession";
import {stories} from "../../../../lib/mockData";
export const dynamic="force-dynamic";
type Target={id:string;table:"story_reactions"|"community_reactions";column:"story_id"|"post_id"};
function target(body:any):Target|null{
 if(!body||Boolean(body.storyId)===Boolean(body.postId))return null;
 if(typeof body.storyId==="string"&&stories.some(s=>s.id===body.storyId))return {id:body.storyId,table:"story_reactions",column:"story_id"};
 if(typeof body.postId==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.postId))return {id:body.postId,table:"community_reactions",column:"post_id"};
 return null;
}
async function visible(t:Target){
 if(t.column==="story_id")return true;
 const {data,error}=await adminSupabase!.from("community_posts").select("id,display_name").eq("id",t.id).eq("status","published").maybeSingle();
 if(error)throw error;if(!data)return false;
 const blocks=await adminSupabase!.from("moderation_blocks").select("id").eq("display_name",data.display_name).limit(1);
 if(blocks.error)throw blocks.error;return !blocks.data?.length;
}
async function state(t:Target,userId:string|null){
 let countQuery=adminSupabase!.from(t.table).select("user_id",{count:"exact",head:true}).eq(t.column,t.id);
 if(t.column==="post_id")countQuery=countQuery.eq("reaction_type","like");
 const total=await countQuery;if(total.error)throw total.error;let liked=false;
 if(userId){let ownQuery=adminSupabase!.from(t.table).select("user_id").eq(t.column,t.id).eq("user_id",userId);if(t.column==="post_id")ownQuery=ownQuery.eq("reaction_type","like");const own=await ownQuery.maybeSingle();if(own.error)throw own.error;liked=!!own.data;}
 return NextResponse.json({count:total.count||0,liked},{headers:{"Cache-Control":"private, no-store"}});
}
export async function GET(r:NextRequest){try{
 const t=target(Object.fromEntries(r.nextUrl.searchParams));if(!t)return NextResponse.json({error:"投稿を確認してください"},{status:400});
 if(!adminSupabase)return NextResponse.json({error:"現在、共感を利用できません。時間をおいてお試しください。"},{status:503});
 if(!await visible(t))return NextResponse.json({error:"投稿が見つかりません"},{status:404});
 return await state(t,await accountId(r));
}catch{return NextResponse.json({error:"共感を読み込めませんでした"},{status:500});}}
async function change(r:NextRequest,remove:boolean){try{
 if(!sameOrigin(r))return NextResponse.json({error:"Invalid origin"},{status:403});
 if(!adminSupabase)return NextResponse.json({error:"現在、共感を保存できません"},{status:503});
 const userId=await accountId(r);if(!userId)return NextResponse.json({error:"プロフィールの準備が必要です"},{status:401});
 const t=target(await r.json().catch(()=>null));if(!t)return NextResponse.json({error:"投稿を確認してください"},{status:400});
 if(await isAccountBlocked(userId))return NextResponse.json({error:"ご利用を制限しています"},{status:403});
 if(!await visible(t))return NextResponse.json({error:"投稿が見つかりません"},{status:404});
 let result;
 if(remove){let query=adminSupabase.from(t.table).delete().eq(t.column,t.id).eq("user_id",userId);if(t.column==="post_id")query=query.eq("reaction_type","like");result=await query;}
 else result=await adminSupabase.from(t.table).upsert({[t.column]:t.id,user_id:userId,...(t.column==="post_id"?{reaction_type:"like"}:{})},{onConflict:t.column==="post_id"?"post_id,user_id,reaction_type":"user_id,story_id",ignoreDuplicates:true});
 if(result.error)throw result.error;return await state(t,userId);
}catch{return NextResponse.json({error:"共感を保存できませんでした。もう一度お試しください。"},{status:500});}}
export async function POST(r:NextRequest){return change(r,false);}
export async function DELETE(r:NextRequest){return change(r,true);}
