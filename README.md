# Wisdom Radiance LINE MINI App

## LIFF URL

- Development: https://miniapp.line.me/2011371701-XW8rQVc3
- Review: https://miniapp.line.me/2011371702-cxRCW4By
- Production: https://miniapp.line.me/2011371704-Dwbl8R0d
- Web access: https://wisdom-radiance-miniapp-nu.vercel.app/

環境ごとのLIFF IDは `NEXT_PUBLIC_LIFF_ID` で切り替えます。開発・審査・本番の各Vercel環境に、それぞれ対応するIDを設定してください。

## Local setup

`.env.local` にSupabase、LINE認証、管理画面用の環境変数を設定してから、`npm run dev` を実行します。

LINE外の通常ブラウザでは閲覧を利用でき、LINE内ではLIFFのLINEユーザー情報を使って匿名プロフィール、投稿、返信を紐付けます。LINEの表示名は公開名として使用しません。

## Pixel 11確認チェックリスト

1. LINEアプリ内で開発用LIFF URLを開く
2. Wisdom Radianceが表示される
3. 初回起動で匿名プロフィールを作成する
4. 2回目の起動で同じプロフィールが復元される
5. 「みんなに聞いてもらう」から投稿する
6. 投稿が管理者確認待ちになることを確認する
7. 管理画面で公開後、「みんなの声」に表示される
8. 投稿へ返信する
9. マイページに本人の投稿・返信・保存が表示される
10. 公式LINEの友だち追加導線を確認する

## ホーム画面と共感

ホームは添付の画面案に沿ったコンパクトなUIで、悩み別の入口、最近の公開投稿1件、匿名投稿の導線を表示します。新しい投稿がない場合や読み込みに失敗した場合は、既存の体験談を元の順序で紹介します。ブロックした表示名は新着から除外します。セルフチェックはホームに表示しません（既存の `/check` は維持）。

コミュニティのユーザー投稿と取り込み済みのExcel体験談の両方に、共感ボタン、件数、本人の共感状態の復元、取り消しを追加しています。ホーム・一覧・詳細に表示します。ユーザー投稿は既存の community_reactions、Excel体験談は supabase/migrations/009_story_reactions.sql の story_reactions を使用します。体験談の共感を有効にするにはマイグレーションを適用し、サーバー環境の SUPABASE_SERVICE_ROLE_KEY を設定してください。未設定や読み込みエラー時は、共感ボタンを無効にし、件数を「—」で表示します。

`NEXT_PUBLIC_LIFF_ID` を設定すると、ホームにLINEで開く・リンクをコピーする導線が表示されます。環境ごとのIDを必ず使用してください。共有リンクは `https://miniapp.line.me/{LIFF ID}` です。LINE内かつAPIが利用可能な場合のみ、公式のホーム画面追加機能を表示します。本番での利用には認証済みミニアプリが必要です（未認証でも開発用チャネルでテスト可能）。

外部のゲストとLINEのアカウントを自動統合する変更は行っていません。LINEに紐づいたプロフィールの再利用には同じLINEアカウントでミニアプリを開いてください。ゲストのデータは元のブラウザに残ります。

検証: `node tests/community-reactions.cjs`、`node tests/account-session.cjs`、`node tests/story-saves.cjs`、`npx tsc --noEmit`、`npm run build`。

公式仕様: https://developers.line.biz/ja/docs/line-mini-app/develop/add-to-home-screen/ 、https://developers.line.biz/ja/docs/line-mini-app/develop/permanent-links/



## 公式LINEへの友だち追加案内

LINE認証後に LIFF の getFriendship() で連携先の友だち状態を確認し、未追加・ブロック中の利用者に案内ダイアログを表示します。追加済みの場合はダイアログもホームの案内も表示しません。案内は任意で閉じられ、友だち追加を必須にしません。閉じた記録は同じブラウザ内でLINEアカウント別に保存します。LINEから戻った時に友だち状態を再取得します。

未ログイン、profileスコープ不足、APIエラー・タイムアウト時には友だち状態を断定せず、自動ダイアログを表示しません。ホーム最上部の短い案内から、いつでも公式LINE（https://line.me/R/ti/p/@429gonyu）を開けます。友だち追加済みか確認できない環境では、この入口は表示されます。LINE標準の認可画面自体の文言や配置は変更しません。

認証成功の判定は `node tests/line-session.cjs`、友だち状態とAPI失敗時の扱いは `node tests/line-friendship.cjs` で検証できます。

