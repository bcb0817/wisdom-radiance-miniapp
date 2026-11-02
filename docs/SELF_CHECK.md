# ゆらぎセルフチェック MVP

## 追加画面・入口

- ホーム上部CTA → `/check`（10項目＋年代＋awarenessのステップ形式）
- `/check/result`：総合メッセージ、上位最大5項目の横棒、医療案内、関連する声最大3件、相談CTA、任意保存、再チェック
- `/check/result?id=<uuid>`：本人の保存済み結果。APIでも所有者を確認する。
- `/check/examples/[id]`：該当する実投稿がない場合だけ使う「サンプル・架空の声」の詳細。コミュニティの41件には混ぜない。
- マイページ：最新3件の履歴、結果へのリンク、削除、再チェック。

## 変更ファイル

- 既存変更：`app/page.tsx`, `app/layout.tsx`, `app/mypage/page.tsx`, `app/community/new/page.tsx`
- 新規画面：`app/check/page.tsx`, `app/check/result/page.tsx`, `app/check/examples/[id]/page.tsx`
- 新規API：`app/api/me/checks/route.ts`
- UI：`app/check.css`, `components/check/{CheckIntro,CheckSession,CheckHistory,MedicalNotice,SimilarVoices,SymptomBars}.tsx`
- ロジック：`lib/{checkTypes,checkQuestions,checkScoring,checkRecommendations,checkDemoVoices,checkAnalytics}.ts`
- DB：`supabase/migrations/008_self_check_results.sql`
- テスト：`tests/self-check.cjs`

既存LIFF、Cookie認証、投稿・保存・ランキング・モデレーションは維持。返信は既存設定のOFFのまま。指定Dドライブが存在しなかったため、既存の `C:\Project\wisdom-radiance-miniapp` で作業した。

## 質問と集計

ほてり／発汗／冷え／動悸・息切れ／睡眠／イライラ／気分の落ち込み／頭痛・めまい・吐き気／疲れ・倦怠感／肩・腰・手足などの痛み。

回答は「特にない・少し気になる・かなり気になる・とてもつらい」の0〜3。各項目weight=1、合計0〜30。SMIの計算式や臨床的基準ではなく、医学的に検証されていない編集上の負担要約。スコアの数値、病名、確率は画面表示しない。

- high：合計15以上、または回答3が2項目以上。
- moderate：上記以外で合計5以上、または回答2以上が1項目以上。
- low：それ以外。
- 回答3が1つでもある場合、またはhighで医療相談案内を強調。
- 救急注意は負担レベルに関係なく常に表示。
- 上位項目は0を除外し、回答値降順。同点は質問順。最大5件。全0ならグラフに偽の症状を表示しない。
- 年代とawarenessは集計に加算しない。版は `reflection-v1`。サーバーが回答から再計算し、クライアントから送られたscoreやuser_idは使わない。

プロフィールの具体的年齢は年代に変換。40代・50代のように前半後半を判別できない場合は、推測せずユーザーに選択してもらう。プロフィールを自動更新しない。

## 似た人の声

上位3症状に対応する既存カテゴリ・タグ（4点）と本文の関連語（各1点）を、症状の順位で3/2/1倍して比較。重複を除き最大3件。年代の類似性や同じ病気を推定しない。

公開ユーザー投稿とExcel由来の41件を候補とする。Supabaseが利用不可でもExcelのデータから抽出。該当がなければ専用の架空例を明記して表示。症状がすべて0なら一般の体験談を表示し「似た人」と断定しない。sleep/fatigue/hot_flash/irritability/mood/dizziness/coldを含む全10項目に専用サンプルあり。

相談CTAは既存の日本語topicを渡す。回答本文を勝手に投稿へコピーしない。

## 保存・プライバシー

ゲスト：チェック・結果閲覧は可能。回答はReactメモリのみで、localStorage/Cookie/DBへ保存しない。再読み込みやタブ終了で消える。LIFF初期化完了をチェック操作の条件にしない。

LINE：署名済み `wr_account` のkind=line、usersとの対応、line_user_idの存在をサーバー確認。チェック後の同意チェックをONにした場合のみ保存。プロフィール名・LINE表示名・メール等は結果へコピーしない。

`self_check_results`：id,user_id,request_id,age_range,awareness_level,total_score,burden_level,top_symptoms,answers,scoring_version,consent_version,consented_at,created_at。user_idは保存時必須（ゲストは保存しないため）。user_id/request_id一意制約で再送の重複を抑制。

RLS有効、anon/authenticatedのテーブル直接権限なし。service_roleでのみアクセス。GET/DELETEの全クエリに所有者条件を付与。回答の個数・型・範囲・選択肢・同意・リクエストIDを検証。変更APIは同一Origin必須。履歴レスポンスはprivate,no-store。削除は本人の指定結果のみ。一般管理者APIには健康履歴を追加していない。

本番Supabaseにmigration008を適用済み。検証結果：public_access=false / direct_user_access=false / server_save=true。実際の健康回答はテスト保存していない。

## イベント

既存の分析送信基盤がないため、`trackCheck` が `wisdom:self-check` CustomEventを発行する拡張点を用意。外部サービスへの送信は未接続。データはイベント名、ランダムrunId、質問番号、版だけ。回答値・症状名・年代・awareness・LINE識別子はイベントに含めない。

- self_check_started
- self_check_answered
- self_check_completed
- self_check_result_viewed
- self_check_similar_voice_clicked
- self_check_community_cta_clicked
- self_check_medical_info_clicked
- self_check_community_posted（相談の実投稿成功時）

相談遷移にはrunIdを引き継ぐ。再訪・日を跨ぐ計測、集計ダッシュボード、ゲストのawareness集計は未実装。awarenessは同意済みのLINE保存結果にのみ残るため、全利用者を代表する割合ではない。

## 確認結果と手順

実行済み：npm install、npm run build、node tests/self-check.cjs、既存account-session/story-savesテスト。TypeScript/build成功。

自動テスト：未回答・不正値、スコア境界、単独の強い症状、全0、年齢変換、7カテゴリの推薦、ゲスト拒否、所有者条件、同意、集計改ざん防止、再送、削除。

ブラウザ確認：ホームCTA、10問、戻ると回答保持、年代・awarenessの未選択制御、high結果、横棒、関連Excel詳細への遷移、相談カテゴリ「不眠」の自動入力、ゲストの保存不可、再読み込みでの結果なし案内。既存PC中央スマホ幅のレイアウト確認。実スマホとLINE実機は未確認。

実機での残りの確認：

1. LINEの本人確認が完了したアカウントで/checkを開き、10項目＋年代＋awarenessに回答する。
2. 保存同意OFFで保存不可、ONで1件保存できることを確認する。
3. マイページの最新3件から同じ結果を開く。別アカウントでは見えないことを確認する。
4. 自分の履歴を削除し、再取得できないことを確認する。
5. 通常Webブラウザでは保存を要求されず結果まで進めることを確認する。

## 残課題

- LINE実機の保存〜履歴までのE2E、iOS/Androidのタップ・戻る挙動。
- 公開前の医療専門家による質問・集計・文言の監修。これは診断尺度ではない。
- 健康関連情報の利用目的・保存期間・事業分析への利用を含むプライバシーポリシーの運営レビュー。現MVPでは任意の本人用履歴保存だけ。
- 既存依存関係のnpm audit警告（全体6件、critical1/high4/moderate1）。今回は破壊的な一括更新をしていない。公開システムとして別途セキュリティ更新が必要。
- ゲストからLINEへのアカウント引き継ぎは既存どおり未対応。

## 医療案内の参考（診断根拠ではない）

- NHS: https://www.nhs.uk/conditions/menopause-and-perimenopause/symptoms/
- 厚生労働省「こんな時は迷わず119へ」: https://kakarikata.mhlw.go.jp/kakaritsuke/urgency.html

質問・独自集計をこれらの機関が承認したものとは表記しない。
