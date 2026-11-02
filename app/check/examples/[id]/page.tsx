import Link from "next/link";
import {notFound} from "next/navigation";
import {checkDemoVoices} from "../../../../lib/checkDemoVoices";
import MedicalNotice from "../../../../components/check/MedicalNotice";
export default function CheckExample({params}:{params:{id:string}}){
 const voice=checkDemoVoices.find(v=>v.id==="sample-"+params.id);if(!voice)notFound();
 return <main className="phone-shell"><section className="page-content check-page"><Link href="/check/result" className="back-link">結果へ戻る</Link><p className="eyebrow">サンプル・架空の声</p><h1>{voice.title}</h1><p>実際の利用者の投稿ではありません。該当する声がまだ少ないテーマの表示例です。</p><article className="post-detail"><p className="detail-body">{voice.body}</p></article><Link className="check-secondary" href="/community">みんなの体験談を読む</Link><MedicalNotice/></section></main>;
}
