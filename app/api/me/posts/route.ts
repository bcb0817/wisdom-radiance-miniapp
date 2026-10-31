import {NextRequest,NextResponse} from "next/server";import {adminSupabase} from "../../../../lib/supabase/admin";
import {accountId} from "../../../../lib/accountSession";
export async function GET(r:NextRequest){const id=await accountId(r);if(!id||!adminSupabase)return NextResponse.json([]);const {data,error}=await adminSupabase.from("community_posts").select("id,title,body,topic_slug,created_at,status").eq("user_id",id).order("created_at",{ascending:false});if(error)return NextResponse.json({error:error.message},{status:500});return NextResponse.json(data||[])}
