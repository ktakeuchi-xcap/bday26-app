// content.js
// 問題文・答え（コンテンツ）を定義するファイル。app.js（ロジック本体）には触れず、
// このファイルの値を書き換えるだけで謎の内容を差し替えられる。
// ラウンド1〜3のlocationRiddle（画像謎・答え＝家電の場所）は確定済み。画像は`assets/round{n}_quiz.png`。
// paperPuzzle（現地の紙に書かれた謎）・ラウンド4〜7・ランチ後謎以降はダミー値。

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
    // locationRiddle：画像謎を解いて正解の家電がある場所まで移動するステップ（アプリへの回答入力なし）
    // paperPuzzle：現地の紙に書かれた謎に回答するステップ（answerをアプリに入力）
    // ラウンド4〜7はBDAY26-017で追加する
    {
      id: "round1",
      locationRiddle: {
        image: "assets/round1_quiz.png",
        text: "画像の謎を解いて、正解の場所（家電）まで行こう。答え：冷蔵庫",
        hints: []
      },
      paperPuzzle: {
        text: "（ダミー）冷蔵庫のところに置かれている紙の謎",
        answer: "にがつついたち",
        hints: ["ヒント1（ダミー）", "ヒント2（ダミー）", "ヒント3（ダミー）"]
      }
    },
    {
      id: "round2",
      locationRiddle: {
        image: "assets/round2_quiz.png",
        text: "画像の謎を解いて、正解の場所（家電）まで行こう。答え：スピーカー",
        hints: []
      },
      paperPuzzle: {
        text: "（ダミー）スピーカーのところに置かれている紙の謎",
        answer: "（ダミー）",
        hints: []
      }
    },
    {
      id: "round3",
      locationRiddle: {
        image: "assets/round3_quiz.png",
        text: "画像の謎を解いて、正解の場所（家電）まで行こう。答え：レンジ",
        hints: []
      },
      paperPuzzle: {
        text: "（ダミー）レンジのところに置かれている紙の謎",
        answer: "（ダミー）",
        hints: []
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
    // 美術館後の自動分岐判定
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
  { key: "round2", label: "ラウンド2" },
  { key: "round3", label: "ラウンド3" },
  { key: "milestoneReveal", label: "ポスト発見" },
  { key: "dressCode", label: "着替え指示" },
  { key: "lunchRiddle", label: "ランチ後の謎" },
  { key: "museumGuide", label: "美術館鑑賞ガイド" },
  { key: "toPlantShop", label: "garage TOKYOへの謎" },
  { key: "toDinner", label: "安室への謎" },
  { key: "ending", label: "エンディング" }
];
