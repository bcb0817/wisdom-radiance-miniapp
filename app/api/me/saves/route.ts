import {NextRequest,NextResponse} from "next/server";
import {adminSupabase} from "../../../../lib/supabase/admin";
import {accountId,sameOrigin} from "../../../../lib/accountSession";
import {stories} from "../../../../lib/mockData";
export const dynamic="force-dynamic";
const fail=()=>NextResponse.json({error:"保存情報を取得・更新できませんでした。再度お試しください。"},{status:500});
export async function GET(r:NextRequest){
 const userId=await accountId(r);if(!userId||!adminSupabase)return NextResponse.json([]);
 const [posts,excel]=await Promise.all([
 adminSupabase.from("community_saves").select("post_id,created_at,community_posts(id,title,status)").eq("user_id",userId),
 adminSupabase.from("story_saves").select("story_id,created_at").eq("user_id",userId)]);
 if(posts.error||excel.error)return fail();
 const rows=[
 ...(posts.data||[]).flatMap((s:any)=>{const p=Array.isArray(s.community_posts)?s.community_posts[0]:s.community_posts;return p?.status==="published"?[{...s,id:s.post_id,title:p.title,href:`/community/${s.post_id}`}]:[]}),
 ...(excel.data||[]).flatMap(s=>{const p=stories.find(x=>x.id===s.story_id);return p?[{...s,id:s.story_id,title:p.title,href:`/stories/${p.id}`}]:[]})
 ].sort((a,b)=>b.created_at.localeCompare(a.created_at));
 return NextResponse.json(rows,{headers:{"Cache-Control":"private, no-store"}});
}
async function mutate(r:NextRequest,remove:boolean){
 if(!sameOrigin(r))return NextResponse.json({error:"Invalid origin"},{status:403});
 const userId=await accountId(r);if(!userId||!adminSupabase)return NextResponse.json({error:"プロフィールの準備が必要です"},{status:401});
 const body=await r.json().catch(()=>null);
 if(!body||Boolean(body.storyId)===Boolean(body.postId))return NextResponse.json({error:"保存対象が不正です"},{status:400});
 const isStory=Boolean(body.storyId),id=isStory?body.storyId:body.postId;
 if(typeof id!=="string"||(isStory?!stories.some(s=>s.id===id):!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)))return NextResponse.json({error:"保存対象が不正です"},{status:400});
 if(!remove&&!isStory){
 const {data,error}=await adminSupabase.from("community_posts").select("id").eq("id",id).eq("status","published").maybeSingle();
 if(error)return fail();if(!data)return NextResponse.json({error:"公開中の投稿のみ保存できます"},{status:404});
 }
 const table=isStory?"story_saves":"community_saves",column=isStory?"story_id":"post_id";
 const {error}=remove?await adminSupabase.from(table).delete().eq("user_id",userId).eq(column,id):await adminSupabase.from(table).upsert({user_id:userId,[column]:id},{onConflict:`user_id,${column}`,ignoreDuplicates:true});
 return error?fail():NextResponse.json({ok:true});
}
export function POST(r:NextRequest){return mutate(r,false)}
export function DELETE(r:NextRequest){return mutate(r,true)}
