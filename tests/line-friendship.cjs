const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
const source=ts.transpileModule(fs.readFileSync('lib/lineFriendship.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
function setup({flag=true,error=false,sub='line-user-a',pending=false}={}){
 const mod={exports:{}};let calls=0;
 const liff={getFriendship:()=>{calls++;if(pending)return new Promise(()=>{});return error?Promise.reject(Error('missing profile scope')):Promise.resolve({friendFlag:flag});},getDecodedIDToken:()=>sub?{sub}:null};
 vm.runInNewContext(source,{exports:mod.exports,require:()=>({default:liff}),setTimeout:(fn)=>setTimeout(fn,5),clearTimeout});
 return {api:mod.exports,calls:()=>calls};
}
(async()=>{
 assert.equal(await setup({flag:true}).api.readLineFriendship(),'friend');
 assert.equal(await setup({flag:false}).api.readLineFriendship(),'not-friend');
 assert.equal(await setup({error:true}).api.readLineFriendship(),'unknown');
 assert.equal(await setup({flag:undefined,error:true}).api.readLineFriendship(),'unknown');
 assert.equal(await setup({pending:true}).api.readLineFriendship(),'unknown');
 const a=setup({sub:'a'}),b=setup({sub:'b'});assert.notEqual(a.api.lineInviteKey(),b.api.lineInviteKey());
 assert.equal(setup({sub:null}).api.lineInviteKey(),null);
 console.log('PASS: added/unadded/blocked mapping, API failure and timeout stay unknown, account-specific dismissal keys');
})().catch(e=>{console.error(e);process.exitCode=1});
