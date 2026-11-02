import {COMMUNITY_REPLIES_ENABLED} from "../../lib/features";
import Link from "next/link";
import type {CommunityPost} from "../../lib/types";
import EmpathyButton from "./EmpathyButton";
export default function PostCard({post}:{post:CommunityPost}){
 return <article className="community-card"><Link href={`/community/${post.id}`} className="post-card-link"><div className="post-meta"><span className="avatar">{post.displayName.slice(0,1)}</span><span>{post.displayName}　{post.ageRange}</span><time>{post.createdAt}</time></div><div className="tags"><span>#{post.topic}</span></div><h2>{post.title}</h2><p>{post.body}</p></Link><div className="card-stats"><EmpathyButton postId={post.id} initialCount={post.likes}/>{COMMUNITY_REPLIES_ENABLED&&<span>返信 {post.comments.length}</span>}</div></article>;
}
