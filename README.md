# Vinyl Player — アーティスト紹介サイト

好きなアーティスト(Eve)の曲を、レコードプレイヤー風のUIで紹介するサイトです。
スクロールすると曲が切り替わり、背景がその曲のジャケット画像に変わります。再生ボタンで30秒試聴できます。

## 起動方法

```
npm install
npm run dev
```

## 使用技術

- Vite + React
- iTunes Search API(曲情報・ジャケット画像・試聴音源の取得)

## 構成

- `App.jsx` — 曲データの取得(useEffect + fetch)と、現在の曲・再生状態の管理(useState)
- `components/Disc.jsx` — 回転するレコード。現在の曲のジャケットを Props で受け取る
- `components/Backdrop.jsx` — 背景レイヤー。全曲のジャケットを重ねて現在の曲だけ表示
- `components/Jacket.jsx` — 背景1曲分(中央シャープ+端ぼかしの2層画像。再利用コンポーネント)
- `components/ScrollRail.jsx` — 透明なスクロール領域。スクロール位置から現在の曲を判定
- `components/Player.jsx` — 再生/停止ボタンと audio 要素の制御

## AIの活用について

(ここに自分の言葉で記載してください。例:「UIのアイデア出しとコードの雛形作成に Claude を使用し、デザイン調整や曲データの差し替えは自分で行いました」)
