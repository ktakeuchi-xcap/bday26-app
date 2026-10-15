// 軽井沢旅行（2026/10/16〜17）の行程データ
window.TRIP = {
  title: "軽井沢、秋の二日間",
  subtitle: "Karuizawa Autumn Trip",
  members: ["信一", "まり子", "孝汰", "萌愛", "瞭平"],
  dog: "ココア",
  days: [
    { id: "d1", date: "2026-10-16", label: "10/16", dow: "金", title: "紅葉と森をめぐる日" },
    { id: "d2", date: "2026-10-17", label: "10/17", dow: "土", title: "旧軽井沢を歩いて帰る日" }
  ],

  // move: この予定の「前」の移動（前の予定からここまで）
  stops: [
    {
      id: "d1-station", day: "d1", start: "11:02", name: "軽井沢駅", kind: "到着",
      photo: "img/station.jpg",
      lead: "孝汰・萌愛が新幹線で到着。北口で車組（信一・まり子・瞭平・ココア）と合流。",
      tags: [["train", "東京 9:44 → 軽井沢 11:02"]],
      address: "長野県北佐久郡軽井沢町軽井沢1178", tel: "",
      doneLabel: "合流した"
    },
    {
      id: "d1-tsite", day: "d1", start: "11:05", end: "11:25", name: "軽井沢T-SITE", kind: "I'm donut?",
      glyph: "D", tone: "gold",
      lead: "駅直結。話題の生ドーナツをテイクアウトして車へ。",
      tags: [["walk", "駅から徒歩1分"], ["bag", "テイクアウト"]],
      hours: "10:00〜",
      address: "長野県北佐久郡軽井沢町大字軽井沢字中谷地1178-1293", tel: "",
      move: { min: 1, mode: "walk", note: "駅直結" }
    },
    {
      id: "d1-hotchi", day: "d1", start: "11:50", end: "12:20", name: "軽井沢発地市庭", kind: "直売所",
      glyph: "市", tone: "moss",
      lead: "朝採れの霧下野菜や地元の名産品は、ここでまとめて買う。",
      tags: [["dog", "犬OK"], ["bag", "野菜・名産品"]],
      hours: "9:00〜17:00",
      address: "長野県北佐久郡軽井沢町発地2564-1", tel: "0267-45-0037",
      move: { min: 20, mode: "car" }
    },
    {
      id: "d1-mikuriya", day: "d1", start: "12:30", end: "14:00", name: "御厨", kind: "かまど炊きご飯・昼食",
      glyph: "厨", tone: "maple",
      lead: "かまど炊きのご飯と信州の御膳。テラス席でココアと一緒に。屋外なので上着を持って。",
      tags: [["check", "予約済 5名＋ココア"], ["dog", "テラス席"]],
      hours: "7:15〜15:00（LO 14:15）",
      address: "長野県北佐久郡軽井沢町発地2127", tel: "0267-41-6741",
      move: { min: 3, mode: "car" }
    },
    {
      id: "d1-shiraito", day: "d1", start: "14:40", end: "15:25", name: "白糸の滝", kind: "滝・散策",
      photo: "img/shiraito.jpg",
      lead: "幅約70mの岩肌から湧き水が糸のように流れ落ちる。遊歩道をココアと散策。",
      tags: [["dog", "犬OK"], ["yen", "有料道路 500円目安"]],
      hours: "見学自由",
      address: "長野県北佐久郡軽井沢町長倉（白糸の滝）", tel: "0267-46-1337",
      telNote: "滝の入口の売店。カーナビの電話番号検索に使える",
      move: { min: 38, mode: "car", note: "中軽井沢 → 白糸ハイランドウェイ経由（有料）" }
    },
    {
      id: "d1-harunire", day: "d1", start: "15:45", end: "17:00", name: "ハルニレテラス", kind: "森の小さな街",
      photo: "img/harunire.jpg",
      lead: "川沿いのウッドデッキを散策。ハーベスト ナガイファームのジェラートでひと休み。17:00に出発すると日没（17:09頃）すぐに宿に着く。",
      tags: [["dog", "デッキは犬OK"], ["clock", "17:00 出発"]],
      hours: "店舗により異なる（ジェラートは10:00〜18:00）",
      address: "長野県北佐久郡軽井沢町長倉2148", tel: "050-3537-3553",
      move: { min: 20, mode: "car" }
    },
    {
      id: "d1-hotel", day: "d1", start: "17:10", name: "REGINA RESORT 旧軽井沢", kind: "宿・チェックイン",
      glyph: "宿", tone: "ink",
      lead: "チェックインは18:00まで。夕食は懐石で、レストランは全席で愛犬同伴OK。",
      tags: [["dog", "全館ココアと一緒"], ["clock", "夕食 18:30（仮）"]],
      hours: "チェックイン 15:00〜18:00",
      address: "長野県北佐久郡軽井沢町軽井沢1323-510", tel: "0267-31-5586",
      move: { min: 10, mode: "car" },
      doneLabel: "チェックインした"
    },

    {
      id: "d2-checkout", day: "d2", start: "9:30", name: "REGINA RESORT 旧軽井沢", kind: "チェックアウト",
      glyph: "宿", tone: "ink",
      lead: "朝食は8:00（仮）。荷物を車に積んで出発（チェックアウトの期限は11:00）。",
      tags: [["clock", "朝食 8:00（仮）"]],
      address: "長野県北佐久郡軽井沢町軽井沢1323-510", tel: "0267-31-5586"
    },
    {
      id: "d2-kumoba", day: "d2", start: "9:40", end: "10:20", name: "雲場池", kind: "池・散策",
      photo: "img/kumoba.jpg",
      lead: "水面に紅葉が映る「スワンレイク」。池の周りを1周（約20分）。朝のうちは人が少ない。",
      tags: [["dog", "リードで散策OK"], ["park", "専用駐車場なし"]],
      hours: "散策自由・無料",
      address: "長野県北佐久郡軽井沢町軽井沢（雲場池）", tel: "",
      parking: "専用駐車場はないため、六本辻周辺のコインパーキングを利用",
      move: { min: 5, mode: "car" }
    },
    {
      id: "d2-ginza", day: "d2", start: "10:30", end: "11:50", name: "旧軽井沢銀座通り", kind: "散策・お土産",
      photo: "img/ginza.jpg",
      lead: "老舗のパン屋・ジャム・雑貨の並ぶ通り。入口のAPPLE PIE labでアップルパイを買う。",
      tags: [["dog", "通りは犬OK（店内は店ごと）"], ["bag", "アップルパイ"]],
      address: "長野県北佐久郡軽井沢町大字軽井沢763-1（旧軽井沢駐車場）", tel: "",
      parking: "旧軽井沢駐車場（50台・通りまで徒歩4分）。満車ならキノコ軽井沢銀座パーキング（軽井沢856-1・150台）",
      move: { min: 5, mode: "car" }
    },
    {
      id: "d2-pyrenees", day: "d2", start: "12:00", end: "13:15", name: "ピレネー", kind: "暖炉のビストロ・昼食",
      glyph: "P", tone: "maple",
      lead: "暖炉で焼く肉料理が名物。テラス席でココアと一緒に。",
      tags: [["dog", "テラス席"], ["alert", "要予約"]],
      hours: "ランチ 12:00〜14:30（LO）",
      address: "長野県北佐久郡軽井沢町軽井沢1181-8", tel: "0267-41-3339",
      move: { min: 5, mode: "car" }
    },
    {
      id: "d2-tsuruya", day: "d2", start: "13:30", end: "14:05", name: "ツルヤ 軽井沢店", kind: "スーパー・お土産",
      glyph: "ツ", tone: "moss",
      lead: "ジャム・ドリンク・おつまみなどの一般的なお土産はここで。冷蔵品は無料の氷か保冷バッグで。",
      tags: [["dog", "店内NG（車内か外で待機）"], ["bag", "お土産"]],
      hours: "9:30〜20:00",
      address: "長野県北佐久郡軽井沢町長倉2707", tel: "0267-46-1811",
      move: { min: 15, mode: "car" }
    },
    {
      id: "d2-maruyama", day: "d2", start: "14:10", end: "14:25", name: "丸山珈琲 軽井沢バイパス店", kind: "コーヒー豆",
      glyph: "丸", tone: "gold",
      lead: "店舗限定の「モダンブレンド」の豆を買い、コーヒーをテイクアウト。押していたら飛ばして駅へ。",
      tags: [["dog", "テラスは犬OK"], ["bag", "限定の豆"]],
      hours: "8:00〜19:00",
      address: "長野県北佐久郡軽井沢町長倉北原859-1", tel: "0267-41-6001",
      move: { min: 4, mode: "car" }
    },
    {
      id: "d2-station", day: "d2", start: "14:40", name: "軽井沢駅", kind: "お見送り",
      photo: "img/station.jpg",
      lead: "孝汰・萌愛は 15:00発 あさま（東京行き）。車組は車で帰路へ。",
      tags: [["train", "15:00 あさま 東京行き"]],
      address: "長野県北佐久郡軽井沢町軽井沢1178", tel: "",
      move: { min: 12, mode: "car" },
      doneLabel: "見送った"
    }
  ],

  prep: [
    { id: "p-pyrenees", text: "ピレネーを予約（10/17 12:00・大人5名＋犬1匹・テラス席）", sub: "0267-41-3339" },
    { id: "p-train", text: "帰りの新幹線の指定席（10/17 15:00発 あさま・2席）" },
    { id: "p-meal", text: "宿の夕食・朝食の時刻を確認", sub: "0267-31-5586" },
    { id: "p-warm", text: "上着・ひざ掛け（御厨のテラス席・夕方の冷え込み用）" },
    { id: "p-cool", text: "保冷バッグ（発地市庭・ツルヤの冷蔵品用）" },
    { id: "p-cocoa", text: "ココアの用品（リード・水・おやつ・トイレ用品）" },
    { id: "p-cash", text: "現金（白糸ハイランドウェイの通行料・駐車場）" }
  ],

  backups: [
    { when: "予定が押している", what: "10/16はハルニレテラスの滞在を短くして17:00の出発を守る。10/17は丸山珈琲を飛ばし、ツルヤから駅へ直行（約13分）。" },
    { when: "ピレネーの予約が取れない", what: "万平ホテル カフェテラス（予約不可・屋外テラスに愛犬スペースあり・9:30〜18:00）。名物のアップルパイとロイヤルミルクティー。", photo: "img/mampei.jpg", address: "長野県北佐久郡軽井沢町軽井沢925", tel: "0267-42-1234" },
    { when: "雨で散策が難しい", what: "白糸の滝は展望スペースだけに短くし、ハルニレテラスの滞在を延ばす。雲場池は旧軽井沢銀座の滞在に振り替える。" },
    { when: "10/16にハルニレテラスで食事したい", what: "せきれい橋 川上庵（そば）、ベーカリー＆レストラン 沢村（いずれもテラス席あり）。" }
  ],

  credits: [
    { use: "表紙（雲場池の紅葉）", file: "Karuizawa - Karuizawa6410.jpg", author: "lumoplank", license: "CC0" },
    { use: "軽井沢駅", file: "Karuizawa sta04s3872.jpg", author: "663highland", license: "CC BY 2.5" },
    { use: "白糸の滝", file: "Karuizawa shiraito-no-taki03s3200.jpg", author: "663highland", license: "CC BY 2.5" },
    { use: "ハルニレテラス", file: "160730 Harunire Terrace Karuizawa Nagano pref Japan03n.jpg", author: "663highland", license: "CC BY 2.5" },
    { use: "雲場池", file: "Karuizawa - Karuizawa6434.jpg", author: "lumoplank", license: "CC0" },
    { use: "旧軽井沢銀座通り", file: "Old Karuizawa ginza04s3200.jpg", author: "663highland", license: "CC BY 2.5" },
    { use: "万平ホテル", file: "Exterior, Mampei Hotel - Karuizawa, Japan - DSC02107.JPG", author: "Daderot", license: "CC0" }
  ]
};
