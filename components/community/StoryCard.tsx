import Link from "next/link";
import type {Story} from "../../lib/mockData";
import EmpathyButton from "./EmpathyButton";
export default function StoryCard({story:s}:{story:Story}){
 return <article className="community-card"><Link href={`/stories/${s.id}`} className="post-card-link"><div className="post-meta"><span className="avatar">{s.age}</span><span>{s.age}歳・{s.gender}</span></div><div className="tags">{s.tags.map(tag=><span key={tag}>#{tag}</span>)}</div><h2>{s.title}</h2><p>{s.intro}</p></Link><div className="card-stats"><EmpathyButton storyId={s.id}/></div></article>;
}
