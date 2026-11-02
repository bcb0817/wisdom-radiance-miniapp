import Link from "next/link";
export default function CheckIntro(){return <section className="check-intro" aria-labelledby="check-intro-title">
 <p className="eyebrow">SELF CHECK</p><h2 id="check-intro-title">最近、こんな変化ありませんか？</h2>
 <p>疲れが抜けない・夜中に目が覚める・急に汗をかく・以前よりイライラする・気分が落ち込みやすい</p>
 <Link href="/check" className="check-primary">3分で今の“ゆらぎ”を整理する</Link>
 <p className="check-small">診断ではありません。今感じている変化を整理するための簡単なチェックです。</p>
 </section>}
