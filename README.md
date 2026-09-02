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
