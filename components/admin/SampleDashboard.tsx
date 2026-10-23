"use client";

import { useState } from "react";
import styles from "./SampleDashboard.module.css";

const samples = {
  october: { label: "2026年10月1日〜23日", total: 128, tagged: 116, unclassified: 12,
    categories: [["睡眠・不眠",38],["気分のゆらぎ",31],["身体の変化",27],["人間関係",20],["その他",12]],
    tags: [["睡眠",46],["仕事への影響",34],["イライラ",29],["家族との関係",24]],
    ages: [["30代以下",12],["40代",47],["50代",55],["60代以上",10],["未入力",4]],
    weeks: [["1〜7日",28],["8〜14日",41],["15〜23日",59]] },
  september: { label: "2026年9月1日〜30日", total: 96, tagged: 88, unclassified: 8,
    categories: [["睡眠・不眠",25],["気分のゆらぎ",24],["身体の変化",21],["人間関係",18],["その他",8]],
    tags: [["睡眠",33],["仕事への影響",21],["イライラ",22],["家族との関係",19]],
    ages: [["30代以下",8],["40代",36],["50代",40],["60代以上",9],["未入力",3]],
    weeks: [["1〜7日",18],["8〜14日",22],["15〜21日",26],["22〜30日",30]] }
};

function Bars({ rows, total }: { rows: (string | number)[][]; total: number }) {
  return <div>{rows.map(([label, value]) => <div className={styles.barRow} key={label}>
    <div className={styles.barLabel}><span>{label}</span><span>{value}件 / {Math.round(Number(value)/total*100)}%</span></div>
    <div className={styles.track} aria-hidden="true"><div style={{ width: `${Number(value)/total*100}%` }} /></div>
  </div>)}</div>;
}

export default function SampleDashboard() {
  const [period, setPeriod] = useState<keyof typeof samples>("october");
  const [showTags, setShowTags] = useState(false);
  const data = samples[period];
  return <section className={styles.dashboard} aria-label="サンプル集計ダッシュボード">
    <span className={styles.badge}>サンプル・すべて架空データ</span>
    <h2>声から見える、いまの悩み</h2>
    <p>表示確認用の見本です。実際の投稿数ではありません。</p>
    <label className={styles.filter}>集計期間
      <select value={period} onChange={event => setPeriod(event.target.value as keyof typeof samples)}>
        {Object.entries(samples).map(([key, value]) => <option value={key} key={key}>{value.label}</option>)}
      </select>
    </label>
    <p className={styles.note}>対象：公開済み投稿のサンプル ／ 自動更新は未接続</p>
    <div className={styles.stats} aria-live="polite">
      {[["公開済み投稿",data.total],["タグ付け済み",data.tagged],["未分類の声",data.unclassified]].map(([label,value]) => <div key={label}><span>{label}</span><strong>{value}<small> 件</small></strong></div>)}
    </div>
    <div className={styles.panels}>
      <article><h3>ユーザーが選んだ悩み</h3><Bars rows={data.categories} total={data.total}/></article>
      <article><h3>投稿数の推移</h3><div className={styles.weeks}>{data.weeks.map(([label,n]) => <div key={label}><span>{n}件</span><div className={styles.column} style={{height:`${Number(n)/60*100}px`}} aria-hidden="true"/><span>{label}</span></div>)}</div><p className={styles.note}>期間ごとの投稿件数。月末の区間は日数が異なります。</p></article>
      <article><h3>自由記述から見えるテーマ</h3><p className={styles.note}>分析タグが付いた投稿の割合（複数タグ可）</p><Bars rows={data.tags} total={data.total}/><blockquote>「夜中に目が覚めて、仕事に集中できない」<br/><span className={styles.tag}>睡眠</span><span className={styles.tag}>仕事への影響</span></blockquote></article>
      <article><h3>年代別の投稿数</h3><table><thead><tr><th>年代</th><th>件数</th><th>割合</th></tr></thead><tbody>{data.ages.map(([age,n]) => <tr key={age}><td>{age}</td><td>{n}件</td><td>{Math.round(Number(n)/data.total*100)}%</td></tr>)}</tbody></table></article>
      <article className={styles.full}><h3>未分類の声を確認する</h3><p>「家族の介護と自分の体調管理を、どう両立したらいいか分からない」</p><p className={styles.note}>架空の記述例 ／ カテゴリ：その他</p><button type="button" aria-expanded={showTags} onClick={()=>setShowTags(!showTags)}>{showTags ? "候補を閉じる" : "分析タグの候補を見る"}</button>{showTags && <div><span className={styles.tag}>介護との両立</span><span className={styles.tag}>自分のケア</span><p className={styles.note}>固定のサンプル候補です。AI分析・データ保存は行いません。</p></div>}</article>
    </div>
    <p className={styles.note}>分析タグは複数付与のため、合計は投稿件数を超える場合があります。実際の投稿承認・通報確認は運営モデレーション画面から操作できます。</p>
  </section>;
}
