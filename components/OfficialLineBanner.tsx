"use client";
import {useLineFriendship} from "./LiffInitializer";
import OfficialLineInvite from "./OfficialLineInvite";
export default function OfficialLineBanner(){
 const status=useLineFriendship();
 if(status==="loading"||status==="friend")return null;
 return <OfficialLineInvite compact/>;
}
