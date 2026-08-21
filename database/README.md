# Wisdom Radiance ローカルDB

`wisdom_radiance.db` はSQLite形式の開発用DBです。

テーブル：

- `survey_responses`：アンケート回答を原文JSON付きで保存
- `survey_questions`：アンケートごとの質問項目
- `stories`：アプリで表示する体験談
- `topics`：症状・悩みテーマ

本番のSupabase接続はまだ行わず、MVPのデータ置き場として利用します。
