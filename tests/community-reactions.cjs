const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
let user='user-a',origin=true,visible=true,blocked=false,likes=new Set(),storyLikes=new Set(),fail=false;
const postId='11111111-1111-4111-8111-111111111111';
const db={from(table){let filters={},head=false,op='',value;const q={select(c,o){head=!!o?.head;return q},eq(k,v){filters[k]=v;return q},limit(){return q},upsert(v){op='upsert';value=v;return q},delete(){op='delete';return q},maybeSingle(){return q},then(resolve,reject){if(fail)return Promise.resolve({error:Error('db')}).then(resolve,reject);if(table==='community_posts')return Promise.resolve({data:visible?{id:postId,display_name:'author'}:null}).then(resolve,reject);if(table==='moderation_blocks')return Promise.resolve({data:[]}).then(resolve,reject);const entries=table==='story_reactions'?storyLikes:likes;if(op==='upsert')entries.add(value.user_id);if(op==='delete')entries.delete(filters.user_id);return Promise.resolve({error:null,count:entries.size,data:head?null:entries.has(filters.user_id)?{id:'reaction'}:null}).then(resolve,reject)}};return q}};
const mod={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('app/api/community/reactions/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{exports:mod.exports,require(id){if(id==='next/server')return {NextResponse:{json:(body,o={})=>({body,status:o.status||200,headers:o.headers})}};if(id.endsWith('/mockData'))return {stories:[{id:'voice-excel-4'}]};if(id.endsWith('/admin'))return {adminSupabase:db};if(id.endsWith('/accountSession'))return {accountId:async()=>user,isAccountBlocked:async()=>blocked,sameOrigin:()=>origin};throw Error(id)}});
const api=mod.exports,req=(body={postId})=>({json:async()=>body,nextUrl:new URL('https://example.com/api/community/reactions?postId='+postId)});
(async()=>{
 assert.equal(JSON.stringify((await api.GET(req())).body),JSON.stringify({count:0,liked:false}));
 await api.POST(req({postId,userId:'attacker'}));await api.POST(req());assert.equal(likes.size,1);assert(likes.has('user-a'));
 assert.equal(JSON.stringify((await api.GET(req())).body),JSON.stringify({count:1,liked:true}));
 user='user-b';assert.equal((await api.GET(req())).body.liked,false);await api.DELETE(req());assert.equal(likes.size,1);
 user='user-a';await api.DELETE(req());assert.equal(likes.size,0);
 assert.equal((await api.POST(req(null))).status,400);assert.equal((await api.POST(req({postId:'bad'}))).status,400);
 visible=false;assert.equal((await api.POST(req())).status,404);assert.equal((await api.GET(req())).status,404);visible=true;
 blocked=true;assert.equal((await api.POST(req())).status,403);blocked=false;
 origin=false;assert.equal((await api.DELETE(req())).status,403);origin=true;
 user=null;assert.equal((await api.POST(req())).status,401);assert.equal((await api.GET(req())).status,200);
 user='user-a';await api.POST(req({storyId:'voice-excel-4'}));await api.POST(req({storyId:'voice-excel-4'}));assert.equal(storyLikes.size,1);assert.equal(likes.size,0);assert.equal((await api.POST(req({storyId:'missing'}))).status,400);assert.equal((await api.POST(req({storyId:'voice-excel-4',postId}))).status,400);const storyReq=req();storyReq.nextUrl=new URL('https://example.com/api/community/reactions?storyId=voice-excel-4');assert.equal((await api.GET(storyReq)).body.liked,true);await api.DELETE(req({storyId:'voice-excel-4'}));assert.equal(storyLikes.size,0);fail=true;assert.equal((await api.GET(req())).status,500);
 console.log('PASS: empathy count, reload state, duplicate prevention, identity isolation, removal, visibility, block, origin, validation and database errors');
})().catch(e=>{console.error(e);process.exitCode=1});


