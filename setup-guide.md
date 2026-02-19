# Google スプレッドシート連携 セットアップガイド

このガイドでは、参加申込みフォームの回答を Google スプレッドシートに自動保存する方法を説明します。

---

## ステップ 1: Google スプレッドシートを作成

1. [Google スプレッドシート](https://sheets.google.com) にアクセス
2. 「空白のスプレッドシート」を作成
3. **1行目（ヘッダー）** に以下を入力：

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| タイムスタンプ | お名前 | 参加区分 | 小中学生の人数 | 幼児の人数 | 交通手段 | 桑名駅ピックアップ | アレルギー | アレルギー詳細 | お住まいエリア | お酒 | 手伝い可能内容 | 自由コメント |

> 💡 参加区分は複数選択可（例：「大人、小中学生」）で保存されます。

## ステップ 2: Google Apps Script を設定

1. スプレッドシートのメニューから **「拡張機能」→「Apps Script」** を選択
2. エディタに以下のコードを貼り付け（既存コードは全部消してOK）：

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp,      // A: タイムスタンプ
    data.name,           // B: お名前
    data.category,       // C: 参加区分（複数選択：大人、小中学生 など）
    data.studentCount,   // D: 小中学生の人数
    data.infantCount,    // E: 幼児の人数
    data.transport,      // F: 交通手段
    data.pickup,         // G: 桑名駅ピックアップ
    data.allergy,        // H: アレルギー
    data.allergyText,    // I: アレルギー詳細
    data.area,           // J: お住まいエリア
    data.drinking,       // K: お酒
    data.help,           // L: 手伝い可能内容
    data.comments        // M: 自由コメント
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. **Ctrl + S** で保存（プロジェクト名は何でもOK）

## ステップ 3: ウェブアプリとしてデプロイ

1. 右上の **「デプロイ」→「新しいデプロイ」** をクリック
2. 歯車アイコン ⚙️ → **「ウェブアプリ」** を選択
3. 設定：
   - **説明**: `参加申込みフォーム`
   - **実行するユーザー**: `自分`
   - **アクセスできるユーザー**: `全員`
4. **「デプロイ」** をクリック
5. アクセスを承認（Googleアカウントの認証画面が出ます）
6. 表示された **ウェブアプリURL** をコピー

> ⚠️ **既にデプロイ済みの場合**：「デプロイ」→「デプロイを管理」→ 鉛筆アイコン ✏️ → バージョンを **「新しいバージョン」** に変更 →「デプロイ」で更新できます。URLは変わりません。

## ステップ 4: フォームにURLを設定

`script.js` を開き、以下の行を見つけてURLを貼り付け：

```javascript
// 変更前
const SCRIPT_URL = '';

// 変更後（例）
const SCRIPT_URL = 'https://script.google.com/macros/s/xxxxx/exec';
```

---

## 完了！🎉

これでフォームから送信されたデータが自動的にスプレッドシートに保存されます。

## GitHub Pages で公開する方法

1. GitHubにリポジトリを作成（または既存のリポジトリを使用）
2. `index.html`、`style.css`、`script.js` をアップロード
3. **Settings → Pages → Source** で `main` ブランチを選択
4. 数分後にURLが表示されます → このURLをLINEなどで共有！
