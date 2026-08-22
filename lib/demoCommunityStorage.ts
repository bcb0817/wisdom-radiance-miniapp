"use client";
import type {CommunityPost} from "./types";
const KEY="wisdom-radiance-community-posts";
export function getDemoPosts():CommunityPost[]{if(typeof window==="undefined")return [];try{return JSON.parse(localStorage.getItem(KEY)||"[]") as CommunityPost[]}catch{return []}}
export function saveDemoPost(post:CommunityPost){const posts=getDemoPosts().filter(p=>p.id!==post.id);localStorage.setItem(KEY,JSON.stringify([post,...posts]))}
export function getDemoPost(id:string){return getDemoPosts().find(p=>p.id===id)}
