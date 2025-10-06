# Singer-Writer / Novelist — GitHub Pages Starter

このリポジトリは、個人の **歌い手 & 小説家** 向けのシンプルな公式サイトのスターターです。  
静的サイトなので **GitHub Pages** でそのまま公開できます。

## セットアップ

1. このフォルダ一式を GitHub の新規リポジトリにアップロード
2. GitHub のリポジトリ設定 → Pages → Branch を `main` / `/ (root)` に設定
3. 数十秒後、公開URLが発行されます（`https://<username>.github.io/<repo>/`）

## カスタマイズ

- `data/works.json` … ニュース、楽曲、作品、スケジュールを編集
- `index.html` … プロフィール文、リンク、埋め込みIDを変更
- `styles/style.css` … 色・フォント・レイアウトを調整
- `assets/` … 画像・音源を追加（サムネは 1280x720 推奨）

## 連絡フォーム

Netlify Forms など静的フォームと併用する場合、`<form netlify>` 属性を残したまま Netlify にデプロイすれば動作します。GitHub Pagesのみではメール送信は動作しないため、外部サービスを利用してください（Formspreeなど）。

## ライセンス

MIT（ただし画像・音源等のクリエイティブ素材は除く）
