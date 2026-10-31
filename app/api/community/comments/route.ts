import {NextRequest,NextResponse} from "next/server";
import {adminSupabase} from "../../../../lib/supabase/admin";
import {accountId,sameOrigin,isAccountBlocked} from "../../../../lib/accountSession";
export async function POST(r:NextRequest){try{
 if(!sameOrigin(r))return NextResponse.json({error:"Invalid origin"},{status:403});
 const id=await accountId(r);if(!id||!adminSupabase)return NextResponse.json({error:"マイページでプロフィールを準備してください"},{status:401});
 if(await isAccountBlocked(id))return NextResponse.json({error:"投稿を制限しています"},{status:403});
 const b=await r.json();if(typeof b.body!=="string"||!b.body.trim()||b.body.length>5000)return NextResponse.json({error:"返信は1〜5000文字で入力してください"},{status:400});
 const {data:post}=await adminSupabase.from("community_posts").select("id").eq("id",b.postId).eq("status","published").maybeSingle();if(!post)return NextResponse.json({error:"返信できる投稿が見つかりません"},{status:404});
 const {data:user}=await adminSupabase.from("users").select("display_name").eq("id",id).single();if(!user)throw Error();
 const {data,error}=await adminSupabase.from("community_comments").insert({post_id:post.id,user_id:id,display_name:user.display_name,body:b.body,status:"pending"}).select("id").single();if(error)throw error;
 return NextResponse.json({id:data.id,pending:true},{status:201});
}catch{return NextResponse.json({error:"返信できませんでした"},{status:500})}}
