import {NextRequest,NextResponse} from "next/server";
import {adminSupabase} from "../../../../../lib/supabase/admin";
import {accountId} from "../../../../../lib/accountSession";
export const dynamic="force-dynamic";
export async function GET(r:NextRequest,{params}:{params:{id:string}}){
 if(!adminSupabase)return NextResponse.json({error:"現在読み込めません"},{status:503});
 const {data:p,error}=await adminSupabase.from("community_posts").select("*,community_comments(*)").eq("id",params.id).maybeSingle();
 if(error||!p||p.status==="deleted")return NextResponse.json({error:"投稿が見つかりません"},{status:404});
 const owner=await accountId(r);if(p.status!=="published"&&(!owner||p.user_id!==owner))return NextResponse.json({error:"投稿が見つかりません"},{status:404});
 return NextResponse.json({id:p.id,displayName:p.display_name,ageRange:p.age_range,topic:p.topic_slug,title:p.title,body:p.body,status:p.status,createdAt:p.created_at,likes:0,comments:(p.community_comments||[]).filter((c:any)=>c.status==="published").map((c:any)=>({id:c.id,displayName:c.display_name,body:c.body,createdAt:c.created_at}))},{headers:{"Cache-Control":"no-store"}});
}
