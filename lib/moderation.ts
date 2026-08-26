"use client";
const KEY="wisdom-radiance-blocked-users";
export function getBlockedUsers():string[]{if(typeof window==="undefined")return [];try{return JSON.parse(localStorage.getItem(KEY)||"[]") as string[]}catch{return []}}
export function blockUser(name:string){const list=getBlockedUsers();if(name&&!list.includes(name))localStorage.setItem(KEY,JSON.stringify([...list,name]))}
export function unblockUser(name:string){localStorage.setItem(KEY,JSON.stringify(getBlockedUsers().filter(x=>x!==name)))}
export function isBlocked(name:string){return getBlockedUsers().includes(name)}
