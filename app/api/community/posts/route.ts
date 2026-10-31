import {NextRequest,NextResponse} from "next/server";
import {listPosts} from "../../../../lib/community";
import {adminSupabase} from "../../../../lib/supabase/admin";
import {accountId,isAccountBlocked,sameOrigin} from "../../../../lib/accountSession";
import {communityTopics} from "../../../../lib/topics";
export async function GET(request:Request){try{return NextResponse.json(await listPosts(new URL(request.url).searchParams.get("topic")||undefined))}catch{return NextResponse.json({error:"投稿を読み込めませんでした"},{status:500})}}
export async function POST(r:NextRequest){try{
if(!sameOrigin(r))return NextResponse.json({error:"Invalid origin"},{status:403});
const userId=await accountId(r);if(!userId||!adminSupabase)return NextResponse.json({error:"マイページでプロフィールを準備してください"},{status:401});
if(await isAccountBlocked(userId))return NextResponse.json({error:"投稿を制限しています"},{status:403});
const b=await r.json();if(typeof b.title!=="string"||!b.title.trim()||b.title.length>100||typeof b.body!=="string"||!b.body.trim()||b.body.length>10000||!communityTopics.includes(b.topic))return NextResponse.json({error:"投稿内容を確認してください"},{status:400});
const {data:user}=await adminSupabase.from("users").select("display_name,age_range").eq("id",userId).single();
if(!user?.age_range)return NextResponse.json({error:"先にマイページで名前と年代を保存してください"},{status:400});
const {data,error}=await adminSupabase.from("community_posts").insert({user_id:userId,display_name:user.display_name,age_range:user.age_range,topic_slug:b.topic,title:b.title,body:b.body,status:"published"}).select("id,title,body,created_at").single();
if(error)throw error;return NextResponse.json({...data,displayName:user.display_name,ageRange:user.age_range,topic:b.topic,status:"published",createdAt:data.created_at,likes:0,comments:[]},{status:201});
}catch{return NextResponse.json({error:"投稿できませんでした。時間をおいてお試しください。"},{status:500})}}
