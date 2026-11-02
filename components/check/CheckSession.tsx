"use client";
import {createContext,useContext,useState} from "react";
import type {CheckResult} from "../../lib/checkTypes";
type State={result:CheckResult|null;runId:string;setResult:(r:CheckResult|null)=>void;setRunId:(id:string)=>void};
const Context=createContext<State|null>(null);
export function CheckSessionProvider({children}:{children:React.ReactNode}){
 const [result,setResult]=useState<CheckResult|null>(null),[runId,setRunId]=useState("");
 return <Context.Provider value={{result,setResult,runId,setRunId}}>{children}</Context.Provider>;
}
export function useCheckSession(){const context=useContext(Context);if(!context)throw Error("Missing check session");return context}
