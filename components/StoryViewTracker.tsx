"use client";
import {useEffect} from "react";
export default function StoryViewTracker({storyId}:{storyId:string}){
  useEffect(()=>{
    // Short dwell avoids counting link prefetches and accidental immediate visits.
    const timer=setTimeout(()=>{
      void fetch("/api/stories/views",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({storyId}),keepalive:true}).catch(()=>{});
    },1500);
    return ()=>clearTimeout(timer);
  },[storyId]);
  return null;
}
