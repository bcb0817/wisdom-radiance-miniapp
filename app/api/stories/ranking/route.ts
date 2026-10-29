import {NextResponse} from "next/server";
import {adminSupabase} from "../../../../lib/supabase/admin";
import {stories} from "../../../../lib/mockData";
export const dynamic="force-dynamic";
export async function GET(){
  if(!adminSupabase)return NextResponse.json({error:"Ranking unavailable"},{status:503});
  const {data,error}=await adminSupabase.rpc("weekly_story_ranking");
  if(error)return NextResponse.json({error:"Ranking unavailable"},{status:503});
  const ids=new Set(stories.map(s=>s.id));
  const items=(data||[]).filter((r:{story_id:string})=>ids.has(r.story_id)).slice(0,6);
  return NextResponse.json({items},{headers:{"Cache-Control":"no-store"}});
}
