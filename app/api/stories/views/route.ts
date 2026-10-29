import {randomUUID} from "node:crypto";
import {NextRequest,NextResponse} from "next/server";
import {adminSupabase} from "../../../../lib/supabase/admin";
import {stories} from "../../../../lib/mockData";

export async function POST(request:NextRequest){
  if(request.headers.get("origin")!==request.nextUrl.origin)return NextResponse.json({error:"Invalid origin"},{status:403});
  const input=await request.json().catch(()=>null);
  if(!stories.some(s=>s.id===input?.storyId))return NextResponse.json({error:"Unknown story"},{status:400});
  if(!adminSupabase)return NextResponse.json({error:"Tracking unavailable"},{status:503});
  const existing=request.cookies.get("wr_story_visitor")?.value;
  const visitor=existing&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(existing)?existing:randomUUID();
  const day=new Date(Date.now()+9*60*60*1000).toISOString().slice(0,10);
  const {error}=await adminSupabase.from("story_daily_views").upsert({story_id:input.storyId,view_day:day,visitor_id:visitor},{onConflict:"story_id,view_day,visitor_id",ignoreDuplicates:true});
  if(error)return NextResponse.json({error:"Tracking unavailable"},{status:503});
  const response=NextResponse.json({ok:true});
  response.headers.set("Cache-Control","no-store");
  response.cookies.set("wr_story_visitor",visitor,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:60*60*24*7});
  return response;
}
