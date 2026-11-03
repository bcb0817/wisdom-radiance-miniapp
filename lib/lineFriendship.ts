"use client";
import liff from "@line/liff";
export type FriendshipStatus="friend"|"not-friend"|"unknown";
// Reads only the account linked to this MINI App; never requests extra permissions.
export async function readLineFriendship():Promise<FriendshipStatus>{
 let timer:ReturnType<typeof setTimeout>|undefined;
 try{
  const result=await Promise.race([liff.getFriendship(),new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(Error("Friendship check timed out")),5000);})]);
  return result.friendFlag===true?"friend":result.friendFlag===false?"not-friend":"unknown";
 }catch{return "unknown";}finally{if(timer)clearTimeout(timer);}
}
export function lineInviteKey(){
 try{const sub=liff.getDecodedIDToken()?.sub;return sub?`wr-official-line-invite-v2:${sub}`:null;}catch{return null;}
}
