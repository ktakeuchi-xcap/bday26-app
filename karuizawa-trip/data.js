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
      photo: "img/tsite.jpg",
      lead: "駅直結。話題の生ドーナツをテイクアウトして車へ。",
      tags: [["walk", "駅から徒歩1分"], ["bag", "テイクアウト"]],
      hours: "10:00〜",
      address: "長野県北佐久郡軽井沢町大字軽井沢字中谷地1178-1293", tel: "",
      move: { min: 1, mode: "walk", note: "駅直結" }
    },
    {
      id: "d1-hotchi", day: "d1", start: "11:50", end: "12:20", name: "軽井沢発地市庭", kind: "直売所",
      photo: "https://hotch-ichiba.com/wp-content/uploads/2024/06/OGP.webp",
      credit: ["軽井沢発地市庭 公式サイト", "https://hotch-ichiba.com/"],
      lead: "朝採れの霧下野菜や地元の名産品は、ここでまとめて買う。冷蔵品は保冷バッグへ。",
      tags: [["dog", "犬OK"], ["bag", "野菜・名産品"]],
      hours: "9:00〜17:00",
      address: "長野県北佐久郡軽井沢町発地2564-1", tel: "0267-45-0037",
      move: { min: 20, mode: "car" }
    },
    {
      id: "d1-mikuriya", day: "d1", start: "12:30", end: "14:00", name: "御厨", kind: "かまど炊きご飯・昼食",
      photo: "https://oggi.jp/wp-content/uploads/2018/10/mikuriya01.jpg",
      credit: ["Oggi.jp", "https://oggi.jp/127047"],
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
      tags: [["dog", "犬OK"], ["yen", "有料道路 500円目安（現金）"]],
      hours: "見学自由",
      address: "長野県北佐久郡軽井沢町長倉（白糸の滝）", tel: "0267-46-1337",
      telNote: "滝の入口の売店。カーナビの電話番号検索に使える",
      move: { min: 38, mode: "car", note: "中軽井沢 → 白糸ハイランドウェイ経由（有料）" }
    },
    {
      id: "d1-harunire", day: "d1", start: "15:45", end: "17:00", name: "ハルニレテラス", kind: "森の小さな街",
      photo: "img/harunire.jpg",
      lead: "川沿いのウッドデッキを散策。ハーベスト ナガイファームのジェラートでひと休み。17:00に出発してツルヤへ。",
      tags: [["dog", "デッキは犬OK"], ["clock", "17:00 出発"]],
      hours: "店舗により異なる（ジェラートは10:00〜18:00）",
      address: "長野県北佐久郡軽井沢町長倉2148", tel: "050-3537-3553",
      move: { min: 20, mode: "car" }
    },
    {
      id: "d1-tsuruya", day: "d1", start: "17:10", end: "17:40", name: "ツルヤ 軽井沢店", kind: "スーパー・ホテル飲みの買い出し",
      photo: "https://static.gltjp.com/glt/data/directory/14000/13780/20221005_060427_8d120795_w1920.webp",
      credit: ["Go! Local Travel（ツルヤ 軽井沢店）", "https://www.gltjp.com/ja/directory/item/13780/"],
      lead: "今夜のホテル飲み用のお酒・おつまみと、ジャムなどのお土産をまとめて買う。冷たい物は無料の氷か保冷バッグで。",
      tags: [["dog", "店内NG（車内か外で待機）"], ["bag", "お酒・おつまみ・お土産"]],
      hours: "9:30〜20:00",
      address: "長野県北佐久郡軽井沢町長倉2707", tel: "0267-46-1811",
      move: { min: 10, mode: "car" }
    },
    {
      id: "d1-hotel", day: "d1", start: "17:55", name: "REGINA RESORT 旧軽井沢", kind: "宿・チェックイン",
      photo: "https://www.regina-resorts.com/kyukaruizawa/images/ogp.jpg",
      credit: ["REGINA RESORT 旧軽井沢 公式サイト", "https://www.regina-resorts.com/kyukaruizawa/"],
      lead: "チェックインの期限は18:00。遅れそうなときは宿に電話を。夕食は懐石で、レストランは全席で愛犬同伴OK。夕食後はホテル飲み。",
      tags: [["dog", "全館ココアと一緒"], ["clock", "夕食 18:30（仮）"]],
      hours: "チェックイン 15:00〜18:00",
      address: "長野県北佐久郡軽井沢町軽井沢1323-510", tel: "0267-31-5586",
      move: { min: 15, mode: "car" },
      doneLabel: "チェックインした"
    },

    {
      id: "d2-checkout", day: "d2", start: "9:30", name: "REGINA RESORT 旧軽井沢", kind: "チェックアウト",
      photo: "https://www.regina-resorts.com/kyukaruizawa/images/ogp.jpg",
      credit: ["REGINA RESORT 旧軽井沢 公式サイト", "https://www.regina-resorts.com/kyukaruizawa/"],
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
      photo: "https://www.karuizawa-primavera.jp/pyrenees/img/top/02.jpeg",
      credit: ["軽井沢プリマヴェーラ 公式サイト", "https://www.karuizawa-primavera.jp/pyrenees/"],
      lead: "暖炉で焼く肉料理が名物。テラス席でココアと一緒に。",
      tags: [["dog", "テラス席"], ["alert", "要予約"]],
      hours: "ランチ 12:00〜14:30（LO）",
      address: "長野県北佐久郡軽井沢町軽井沢1181-8", tel: "0267-41-3339",
      move: { min: 5, mode: "car" }
    },
    {
      id: "d2-maruyama", day: "d2", start: "13:30", end: "14:15", name: "丸山珈琲 軽井沢バイパス店", kind: "カフェ・コーヒー豆",
      photo: "https://rurubu.jp/img_srw/andmore/images/0000714972/l_fL3DbCq32MmUq6NhSQZFHG8bveXbh21VLxaY2QvY.jpg",
      credit: ["るるぶ&more.", "https://rurubu.jp/andmore/article/23794"],
      lead: "ウッドデッキのテラス席でコーヒーとガレットをゆっくり。店舗限定の「モダンブレンド」の豆はお土産に。",
      tags: [["dog", "テラスは犬OK"], ["bag", "限定の豆"]],
      hours: "8:00〜19:00",
      address: "長野県北佐久郡軽井沢町長倉北原859-1", tel: "0267-41-6001",
      move: { min: 15, mode: "car" }
    },
    {
      id: "d2-station", day: "d2", start: "14:40", name: "軽井沢駅", kind: "お見送り",
      photo: "img/station.jpg",
      lead: "孝汰・萌愛は 15:00発 あさま（東京行き）。車組は車で帰路へ。",
      tags: [["train", "15:00 あさま 東京行き"], ["alert", "指定席を要予約"]],
      address: "長野県北佐久郡軽井沢町軽井沢1178", tel: "",
      move: { min: 12, mode: "car" },
      doneLabel: "見送った"
    }
  ],


  backups: [
    { when: "予定が押している", what: "10/16はハルニレテラスの滞在を短くして、ツルヤの後のチェックイン（期限18:00）に間に合わせる。間に合わないときは宿（0267-31-5586）に電話。10/17は丸山珈琲の滞在を短くして14:40に駅へ。" },
    { when: "ピレネーの予約が取れない", what: "万平ホテル カフェテラス（予約不可・屋外テラスに愛犬スペースあり・9:30〜18:00）。名物のアップルパイとロイヤルミルクティー。", photo: "img/mampei.jpg", address: "長野県北佐久郡軽井沢町軽井沢925", tel: "0267-42-1234" },
    { when: "雨で散策が難しい", what: "白糸の滝は展望スペースだけに短くし、ハルニレテラスの滞在を延ばす。雲場池は旧軽井沢銀座の滞在に振り替える。" },
    { when: "10/16にハルニレテラスで食事したい", what: "せきれい橋 川上庵（そば）、ベーカリー＆レストラン 沢村（いずれもテラス席あり）。" }
  ],

  credits: [
    { use: "軽井沢T-SITE", file: "260321 Karuizawa T-SITE Karuizawa Japan02s3.jpg", author: "663highland", license: "CC BY-SA 4.0" },
    { use: "表紙（雲場池の紅葉）", file: "Karuizawa - Karuizawa6410.jpg", author: "lumoplank", license: "CC0" },
    { use: "軽井沢駅", file: "Karuizawa sta04s3872.jpg", author: "663highland", license: "CC BY 2.5" },
    { use: "白糸の滝", file: "Karuizawa shiraito-no-taki03s3200.jpg", author: "663highland", license: "CC BY 2.5" },
    { use: "ハルニレテラス", file: "160730 Harunire Terrace Karuizawa Nagano pref Japan03n.jpg", author: "663highland", license: "CC BY 2.5" },
    { use: "雲場池", file: "Karuizawa - Karuizawa6434.jpg", author: "lumoplank", license: "CC0" },
    { use: "旧軽井沢銀座通り", file: "Old Karuizawa ginza04s3200.jpg", author: "663highland", license: "CC BY 2.5" },
    { use: "万平ホテル", file: "Exterior, Mampei Hotel - Karuizawa, Japan - DSC02107.JPG", author: "Daderot", license: "CC0" }
  ]
};
