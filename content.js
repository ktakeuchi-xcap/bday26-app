// content.js
// 問題文・答え（コンテンツ）を定義するファイル。app.js（ロジック本体）には触れず、
// このファイルの値を書き換えるだけで謎の内容を差し替えられる。
// 現時点はBDAY26-012〜015（作問）が未完了のため、すべてダミー値。
// BDAY26-017でラウンド2〜7を追加し、BDAY26-018でランチ後謎・美術館ガイドの
// 実データを、BDAY26-019で分岐謎・エンディングの実データを流し込む。

const CONTENT = {
  kickoff: {
    // 9/18夜のキックオフ画面。BDAY26-012で確定
    screens: [
      "Happy 30th Birthday, 萌愛",
      "明日、萌愛の知らないところで\nひとつの企画が動き出します。\n\nタイトルは──\n「30歳、はじまりの一日」"
    ],
    countdownTargetISO: "2026-09-19T09:00:00+09:00"
  },
  rounds: [
    // ラウンド1のみ（動作確認用の最小構成）。BDAY26-017で2〜7を追加する
    {
      id: "round1",
      locationRiddle: {
        text: "（ダミー）行ってきますの前も、ただいまの後も、必ず立ち寄る、玄関にある小さな家。さて、どこでしょう？",
        hints: ["ヒント1（ダミー）", "ヒント2（ダミー）", "ヒント3（ダミー）"]
      },
      paperPuzzle: {
        answer: "にがつついたち",
        hints: ["ヒント1（ダミー）", "ヒント2（ダミー）", "ヒント3（ダミー）"]
      }
    }
  ],
  milestoneReveal: {
    // ラウンド最終到達後の発見演出。BDAY26-012で確定
    text: "（ダミー）ポストの中に、招待状風のカードが入っています。「本日12:00　たまさか（丸の内）にてご昼食をご用意しております」"
  },
  dressCode: {
    // 着替え指示・完了画面。BDAY26-012で確定
    instructionText: "（ダミー）今日のランチは、少し特別な場所をご用意しています。お出かけ用の、きちんとした服に着替えてもらえますか？",
    completedText: "（ダミー）素敵です。準備、できましたね。それでは、行ってらっしゃい。"
  },
  lunchRiddle: {
    // ランチ後、美術館へ誘導する謎。BDAY26-013で確定
    text: "（ダミー）赤レンガのクラシックな洋館。この建物があるのはどこでしょう？",
    answer: "三菱一号館美術館",
    hints: ["ヒント1（ダミー）", "ヒント2（ダミー）", "ヒント3（ダミー）"]
  },
  museumGuide: {
    // 美術館鑑賞ガイド。BDAY26-014で確定。動作確認用に2作品のみ
    works: [
      { id: "work1", title: "（ダミー）作品名1", comment: "（ダミー）鑑賞コメント1" },
      { id: "work2", title: "（ダミー）作品名2", comment: "（ダミー）鑑賞コメント2" }
    ]
  },
  timeCheck: {
    // 美術館後の自動分岐判定。2026-09-09竹内FBにより確定
    cutoffTime: "17:00"
  },
  branchRiddles: {
    // 美術館後の分岐謎。BDAY26-015で確定
    toPlantShop: {
      text: "（ダミー）植物と暮らすことをコンセプトにしたお店。東京駅直結のあるビルの中にあります。ビルの名前は？",
      answer: "丸ビル",
      hints: []
    },
    toDinner: {
      text: "（ダミー）東京で育ち、沖縄で腕を磨き、地元・人形町に凱旋してきたシェフのお店。お店の名前は？",
      answer: "安室",
      hints: []
    }
  },
  ending: {
    // 安室到着時のエンドロール。BDAY26-015で確定
    text: "（ダミー）今日という日を、ここまで一緒に楽しんでくれてありがとう。"
  }
};

// 画面一覧（アーカイブ）の表示順・ラベル定義
const ARCHIVE_INDEX = [
  { key: "kickoff", label: "キックオフ" },
  { key: "round1", label: "ラウンド1" },
  { key: "milestoneReveal", label: "ポスト発見" },
  { key: "dressCode", label: "着替え指示" },
  { key: "lunchRiddle", label: "ランチ後の謎" },
  { key: "museumGuide", label: "美術館鑑賞ガイド" },
  { key: "toPlantShop", label: "garage TOKYOへの謎" },
  { key: "toDinner", label: "安室への謎" },
  { key: "ending", label: "エンディング" }
];
