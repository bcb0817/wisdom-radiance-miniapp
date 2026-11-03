const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
const source=ts.transpileModule(fs.readFileSync('lib/lineSessionClient.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
async function check({configured=true,loggedIn=true,token='test-token',status=200,initFails=false}={}){
 let requests=0;const mod={exports:{}};const liff={init:async()=>{if(initFails)throw Error('offline')},isLoggedIn:()=>loggedIn,getIDToken:()=>token};
 vm.runInNewContext(source,{exports:mod.exports,process:{env:{NEXT_PUBLIC_LIFF_ID:configured?'test-id':''}},require:()=>({default:liff}),fetch:async()=>{requests++;return {ok:status===200,status}}});
 const a=mod.exports.initializeLineSession(),b=mod.exports.initializeLineSession();assert.equal(a,b);return {authenticated:await a,requests};
}
(async()=>{
 assert.deepEqual(await check(),{authenticated:true,requests:1});
 for(const options of [{configured:false},{loggedIn:false},{token:null},{initFails:true}])assert.deepEqual(await check(options),{authenticated:false,requests:0});
 for(const status of [401,409,503])assert.deepEqual(await check({status}),{authenticated:false,requests:1});
 console.log('PASS: LINE invite trigger requires successful server auth; guest, conflict, missing config, offline and repeat initialization covered');
})().catch(e=>{console.error(e);process.exitCode=1});
