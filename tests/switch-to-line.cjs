const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
const source=ts.transpileModule(fs.readFileSync('app/api/auth/line/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
let valid=true,found=true,verifiedCalls=0,sessionWrites=[];
const mod={exports:{}};
vm.runInNewContext(source,{exports:mod.exports,URLSearchParams,process:{env:{LINE_CHANNEL_ID:'test-channel'}},fetch:async()=>{verifiedCalls++;return {ok:valid,json:async()=>({iss:'https://access.line.me',aud:'test-channel',sub:'line-user'})}},require(id){
 if(id==='next/server')return {NextResponse:{json:(body,opts={})=>({body,status:opts.status||200,cookies:{set(){}}})}};
 if(id.endsWith('/accountSession'))return {readSession:r=>r.session,sameOrigin:r=>r.sameOrigin,anonymousName:()=> 'test',setSession:(res,id,kind)=>sessionWrites.push({id,kind})};
 if(id.endsWith('/supabase/admin'))return {adminSupabase:{from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:found?{id:'existing-line-account'}:null})})}),insert:()=>({select:()=>({single:async()=>({data:null})})})})}};
 throw Error(id);
}});
const api=mod.exports,req=(opts={})=>({sameOrigin:true,session:{kind:'guest'},json:async()=>({idToken:'test-token',...opts})});
(async()=>{
 assert.equal(api.GET(req()).body.guest,true);
 assert.equal((await api.POST(req())).status,409);assert.equal(verifiedCalls,0);
 assert.equal((await api.POST({...req({replaceGuest:true}),sameOrigin:false})).status,403);
 valid=false;assert.equal((await api.POST(req({replaceGuest:true}))).status,401);assert.equal(sessionWrites.length,0);
 valid=true;found=false;assert.equal((await api.POST(req({replaceGuest:true}))).status,503);assert.equal(sessionWrites.length,0);
 found=true;assert.equal((await api.POST(req({replaceGuest:true}))).status,200);assert.equal(sessionWrites.length,1);assert.equal(sessionWrites[0].id,'existing-line-account');assert.equal(sessionWrites[0].kind,'line');
 console.log('PASS: opt-in only; invalid token or unavailable LINE account preserves guest cookie; success replaces it');
})().catch(e=>{console.error(e);process.exitCode=1});
