// app.js
// アプリのロジック本体。問題文・答え（CONTENT／ARCHIVE_INDEX）はcontent.jsに分離してあるため、
// このファイルは基本的に触らずに済む設計にしている（BDAY26-010設計方針）。

const STORAGE_KEY = "bday26_progress";

const DEFAULT_STATE = {
  currentScreen: "kickoff",
  currentRoundIndex: 0,
  roundStep: "location",
  lunchRiddleStep: "answer",
  lunchQuizShowArtwork: false,
  lunchQuizSelectedOption: null,
  lunchQuizAnswered: false,
  lunchQuizCorrect: false,
  branchChoice: null,
  hintLevelByStep: {},
  hintsCollapsedByStep: {},
  venueStepIndex: 0,
  branchDinnerHintShown: false,
  gameCompleted: false
};

// ---- 永続化 ----
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch (e) {
    return { ...DEFAULT_STATE };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return { ...DEFAULT_STATE };
}

// ---- 共通ロジック ----
function normalize(s) {
  return String(s).trim().toLowerCase()
    .replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60)); // カタカナ→ひらがな
}

function checkAnswer(input, correctAnswer) {
  return normalize(input) === normalize(correctAnswer);
}

function decideBranch(cutoffTimeStr) {
  const now = new Date();
  const [cutoffHour, cutoffMinute] = cutoffTimeStr.split(":").map(Number);
  const cutoff = new Date(now);
  cutoff.setHours(cutoffHour, cutoffMinute, 0, 0);
  return now < cutoff ? "plant" : "direct";
}

// ---- 画面遷移 ----
let state = loadState();

function transition(patch) {
  state = { ...state, ...patch };
  saveState(state);
  render();
}

// 画面（ページ）単位の履歴。ヒント開示等、画面が変わらない更新はtransition()を直接使い、
// 履歴には積まない。goto()で画面が変わる操作だけを1ページとして記録する。
// リロードしても履歴が消えないよう、localStorageに永続化する。
const NAV_STORAGE_KEY = "bday26_navstacks";

function loadNavStacks() {
  try {
    const raw = localStorage.getItem(NAV_STORAGE_KEY);
    if (!raw) return { backStack: [], forwardStack: [] };
    const parsed = JSON.parse(raw);
    return { backStack: parsed.backStack || [], forwardStack: parsed.forwardStack || [] };
  } catch (e) {
    return { backStack: [], forwardStack: [] };
  }
}

function saveNavStacks() {
  localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify({ backStack, forwardStack }));
}

let { backStack, forwardStack } = loadNavStacks();

function goto(screen, extra = {}) {
  backStack.push(state);
  forwardStack = [];
  saveNavStacks();
  transition({ currentScreen: screen, ...extra });
  window.scrollTo(0, 0);
}

function goBack() {
  if (backStack.length === 0) return;
  forwardStack.push(state);
  state = backStack.pop();
  saveState(state);
  saveNavStacks();
  render();
  window.scrollTo(0, 0);
}

function goForward() {
  if (forwardStack.length === 0) return;
  backStack.push(state);
  state = forwardStack.pop();
  saveState(state);
  saveNavStacks();
  render();
  window.scrollTo(0, 0);
}

// ---- 各画面のレンダリング ----
const app = document.getElementById("app");

function render() {
  app.classList.remove("fade-in");
  app.innerHTML = "";
  renderNavBar();
  const screen = state.currentScreen;
  const renderers = {
    kickoff: renderKickoff,
    round: renderRound,
    postDiscovery: renderPostDiscovery,
    venueGuide: renderVenueGuide,
    lunchIntro: renderLunchIntro,
    plantIntro: renderPlantIntro,
    dinnerIntro: renderDinnerIntro,
    lunchRiddle: renderLunchRiddle,
    museumTicket: renderMuseumTicket,
    museumGuideList: renderMuseumGuideList,
    museumGuideDetail: renderMuseumGuideDetail,
    branchPlant: renderBranchPlant,
    branchDinner: renderBranchDinner,
    dinnerVenue: renderDinnerVenue,
    ending: renderEnding,
    archiveList: renderArchiveList,
    archiveDetail: renderArchiveDetail
  };
  (renderers[screen] || renderUnknown)();
  // 画面切り替え時に軽くフェードインさせる（クロスフェード演出）
  void app.offsetWidth; // 強制リフローでアニメーションを再始動させる
  requestAnimationFrame(() => app.classList.add("fade-in"));
}

function renderNavBar() {
  if (backStack.length === 0 && forwardStack.length === 0) return;
  const bar = el("div", { className: "navbar" });
  if (backStack.length > 0) {
    // 美術館鑑賞ガイド（一覧・詳細）からの「戻る」は、館内を何度行き来していても、
    // 実際の履歴を1つずつ遡って直前の入場チケット画面まで移動する
    const isLiveMuseumGuide =
      (state.currentScreen === "museumGuideList" || state.currentScreen === "museumGuideDetail") &&
      !state.viewingFromArchive;
    const onBackClick = isLiveMuseumGuide ? goBackToMuseumTicket : goBack;
    bar.appendChild(el("button", { text: "← 1ページ戻る", className: "nav", onClick: onBackClick }));
  }
  if (forwardStack.length > 0) {
    bar.appendChild(el("button", { text: "1ページ進む →", className: "nav", onClick: goForward }));
  }
  app.appendChild(bar);
}

// backStackを実際の履歴として1段ずつ遡り、直前の入場チケット画面まで移動する。
function goBackToMuseumTicket() {
  while (backStack.length > 0) {
    forwardStack.push(state);
    state = backStack.pop();
    if (state.currentScreen === "museumTicket") {
      break;
    }
  }
  saveState(state);
  saveNavStacks();
  render();
  window.scrollTo(0, 0);
}

function el(tag, opts = {}, children = []) {
  const node = document.createElement(tag);
  if (opts.text) node.textContent = opts.text;
  if (opts.html) node.innerHTML = opts.html;
  if (opts.onClick) node.addEventListener("click", opts.onClick);
  if (opts.className) node.className = opts.className;
  children.forEach((c) => node.appendChild(c));
  return node;
}

// 正解時の演出。アニメーション表示後にonDoneを実行して画面遷移する。
function showCorrectAnimation(onDone) {
  const overlay = el("div", { className: "correct-overlay", text: "正解！" });
  document.body.appendChild(overlay);
  setTimeout(() => {
    overlay.remove();
    onDone();
  }, 900);
}

// 正解演出のみを表示し、自動では次の画面へ遷移しない版。
// 演出が終わった後、呼び出し側で「次へ」ボタンを表示して手動で進めてもらう。
function showCorrectOverlayOnly() {
  const overlay = el("div", { className: "correct-overlay", text: "正解！" });
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 900);
}

function renderUnknown() {
  app.appendChild(el("p", { text: `未知の画面です: ${state.currentScreen}` }));
}

// テキストを1行ずつ、ピン留め（position:sticky）した同じ位置でフェードイン/アウトさせる共通演出。
// lines：本文の行（配列）。finalLine：最後に表示する要素（本文と同じ見た目でフェード対象に含む）。
// extraButtons：ガイド同様、スクロールし切った時だけ表示するボタン（.scroll-final-btnを自動付与）。
function renderScrollStory(lines, finalLine, extraButtons = []) {
  const allLines = [...lines.map((text) => el("p", { className: "kickoff-line", text })), finalLine];
  finalLine.classList.add("kickoff-line");

  const wrapper = el("div", { className: "kickoff-wrapper" });
  wrapper.style.height = `${allLines.length * 100}vh`;

  const pin = el("div", { className: "kickoff-pin" });
  allLines.forEach((line) => pin.appendChild(line));

  const guide = el("p", { className: "kickoff-scroll-guide", text: "↓ スクロール" });
  pin.appendChild(guide);

  extraButtons.forEach((btn) => {
    btn.classList.add("scroll-final-btn");
    pin.appendChild(btn);
  });

  wrapper.appendChild(pin);
  app.appendChild(wrapper);

  function onScroll() {
    const viewportHeight = window.innerHeight;
    const rect = wrapper.getBoundingClientRect();
    const maxScroll = wrapper.offsetHeight - viewportHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), maxScroll);
    const index = Math.min(allLines.length - 1, Math.floor(scrolled / viewportHeight));
    const atEnd = scrolled >= maxScroll - 1;

    allLines.forEach((line, i) => line.classList.toggle("in-view", i === index));
    guide.style.display = atEnd ? "none" : "block";
    extraButtons.forEach((btn) => {
      btn.style.display = atEnd ? "block" : "none";
    });
  }
  window.addEventListener("scroll", onScroll);
  onScroll();
}

function renderKickoff() {
  const target = new Date(CONTENT.kickoff.countdownTargetISO);
  const countdownEl = el("p", { className: "countdown" });

  function updateCountdown() {
    const diff = target - new Date();
    if (diff <= 0) {
      countdownEl.textContent = "まもなく始まります";
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    countdownEl.textContent = `開始まで あと ${h}時間${m}分${s}秒`;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  const restartBtn = el("button", {
    text: "はじめから",
    className: "kickoff-restart",
    onClick: () => window.scrollTo({ top: 0, behavior: "smooth" })
  });
  const nextBtn = el("button", {
    text: "次へ進む",
    className: "kickoff-next",
    onClick: () => goto("round", { currentRoundIndex: 0 })
  });

  renderScrollStory(CONTENT.kickoff.screens, countdownEl, [restartBtn, nextBtn]);
}

// ポスト発見〜着替え指示の統合画面。キックオフと同じピン留めスクロール演出。
function renderPostDiscovery() {
  const dressBtn = el("button", {
    text: "着替えました",
    className: "kickoff-next",
    onClick: () => goto("venueGuide")
  });
  renderScrollStory(CONTENT.postDiscovery.screens, el("div"), [dressBtn]);
}

// 会場への行き方：1枚ずつカードを表示し、「完了」を押すと次のStepのカードが下からせり上がる。
function renderVenueGuide() {
  app.appendChild(el("h2", { text: "会場への行き方" }));

  const cards = [...CONTENT.venueGuide.steps, CONTENT.venueGuide.venueName];
  const index = state.venueStepIndex || 0;
  const isLast = index >= cards.length - 1;

  app.appendChild(el("p", { className: "progress-label", text: `${index + 1} / ${cards.length}` }));

  const card = el("div", { className: "venue-card" });
  card.appendChild(el("div", {
    className: "venue-card-badge" + (isLast ? " venue-card-badge-goal" : ""),
    text: isLast ? "🍽" : String(index + 1)
  }));
  card.appendChild(el("p", {
    className: "venue-card-text",
    text: isLast ? `ランチ：${cards[index]}` : cards[index]
  }));
  app.appendChild(card);

  const buttonRow = el("div", { className: "venue-nav-row" });
  const backBtn = el("button", {
    text: "戻る",
    className: "venue-nav-back",
    onClick: () => transition({ venueStepIndex: Math.max(0, index - 1) })
  });
  backBtn.disabled = index === 0;
  buttonRow.appendChild(backBtn);
  buttonRow.appendChild(el("button", {
    text: isLast ? "ランチを食べ終わった！" : "次へ",
    className: "venue-nav-next",
    onClick: () => {
      if (isLast) {
        goto("lunchIntro");
      } else {
        transition({ venueStepIndex: index + 1 });
      }
    }
  }));
  app.appendChild(buttonRow);
}

// ランチ後、次のイベント（美術館）への導入メッセージ。キックオフと同じピン留めスクロール演出。
function renderLunchIntro() {
  const nextBtn = el("button", { text: "次へ", className: "kickoff-next", onClick: () => goto("lunchRiddle") });
  renderScrollStory(CONTENT.lunchIntro.screens, el("div"), [nextBtn]);
}

// 美術館鑑賞ガイド後、garage TOKYOへの導入メッセージ（17:00より前の分岐）。キックオフと同じピン留めスクロール演出。
function renderPlantIntro() {
  const nextBtn = el("button", { text: "次へ", className: "kickoff-next", onClick: () => goto("branchPlant") });
  renderScrollStory(CONTENT.plantIntro.screens, el("div"), [nextBtn]);
}

// 美術館鑑賞ガイド後、ディナー（安室）への導入メッセージ（17:00以降の分岐）。キックオフと同じピン留めスクロール演出。
function renderDinnerIntro() {
  const nextBtn = el("button", { text: "次へ", className: "kickoff-next", onClick: () => goto("branchDinner") });
  renderScrollStory(CONTENT.dinnerIntro.screens, el("div"), [nextBtn]);
}

function renderRound() {
  const round = CONTENT.rounds[state.currentRoundIndex];
  if (!round) {
    goto("postDiscovery");
    return;
  }
  if ((state.roundStep || "location") === "location") {
    renderRoundLocation(round);
  } else {
    renderRoundPaper(round);
  }
}

// 宝探しパートの進捗バー。1ラウンド＝画像謎＋紙の謎の2問として、全ラウンド数×2問中の現在位置を表示する。
function renderTreasureHuntProgress(stepOffset) {
  const total = CONTENT.rounds.length * 2;
  const current = state.currentRoundIndex * 2 + stepOffset;
  const bar = el("div", { className: "progress" });
  const fill = el("div", { className: "progress-fill" });
  fill.style.width = `${(current / total) * 100}%`;
  bar.appendChild(fill);
  const label = el("p", { className: "progress-label", text: `第${current}問 / 全${total}問` });
  const wrapper = el("div", {}, [bar, label]);
  return wrapper;
}

// 家電（家の中の場所）を示す謎画像を見て、正解の場所まで移動するステップ。
// この謎自体はアプリへの回答入力を行わない（現地の紙に書かれた別の謎に回答する）。
function renderRoundLocation(round) {
  app.appendChild(renderTreasureHuntProgress(1));
  app.appendChild(el("h2", { text: `ラウンド${state.currentRoundIndex + 1}` }));
  if (round.locationRiddle.image) {
    const img = document.createElement("img");
    img.src = round.locationRiddle.image;
    img.alt = "謎の画像";
    app.appendChild(img);
  }
  app.appendChild(el("p", { text: round.locationRiddle.text }));
  app.appendChild(renderHints(`${round.id}_location`, round.locationRiddle.hints));
  app.appendChild(el("button", {
    text: "次へ（正解の場所に着いたら）",
    onClick: () => goto("round", { roundStep: "paper" })
  }));
}

// 現地の紙に書かれた謎に回答するステップ。
function renderRoundPaper(round) {
  app.appendChild(renderTreasureHuntProgress(2));
  app.appendChild(el("h2", { text: `ラウンド${state.currentRoundIndex + 1}：紙の謎` }));
  app.appendChild(el("p", { text: round.paperPuzzle.text }));
  app.appendChild(renderHints(`${round.id}_paper`, round.paperPuzzle.hints));

  const input = document.createElement("input");
  input.placeholder = "合言葉を入力";
  const feedback = el("p", { className: "feedback" });

  const button = el("button", {
    text: "決定",
    onClick: () => {
      if (checkAnswer(input.value, round.paperPuzzle.answer)) {
        showCorrectAnimation(() => {
          const isLast = state.currentRoundIndex >= CONTENT.rounds.length - 1;
          if (isLast) {
            goto("postDiscovery");
          } else {
            goto("round", { currentRoundIndex: state.currentRoundIndex + 1, roundStep: "location" });
          }
        });
      } else {
        feedback.textContent = "ちがうみたい。もう一度！";
      }
    }
  });

  app.appendChild(input);
  app.appendChild(button);
  app.appendChild(feedback);
}

function renderHints(stepId, hints) {
  const container = el("div", { className: "hints" });
  const level = state.hintLevelByStep[stepId] || 0;
  const collapsed = !!state.hintsCollapsedByStep[stepId];

  if (level > 0) {
    if (!collapsed) {
      for (let i = 0; i < level; i++) {
        container.appendChild(el("p", { text: `ヒント${i + 1}: ${hints[i]}` }));
      }
    }
    // 表示済みのヒントを隠す／もう一度表示するトグル
    container.appendChild(el("button", {
      text: collapsed ? "ヒントをもう一度見る" : "ヒントを隠す",
      className: "hint-toggle",
      onClick: () => {
        const hintsCollapsedByStep = { ...state.hintsCollapsedByStep, [stepId]: !collapsed };
        transition({ hintsCollapsedByStep });
      }
    }));
  }

  if (level < hints.length) {
    container.appendChild(el("button", {
      text: "ヒントを見る",
      onClick: () => {
        const hintLevelByStep = { ...state.hintLevelByStep, [stepId]: level + 1 };
        // 新しいヒントを開示する際は、隠している状態を解除して表示する
        const hintsCollapsedByStep = { ...state.hintsCollapsedByStep, [stepId]: false };
        transition({ hintLevelByStep, hintsCollapsedByStep });
      }
    }));
  }
  return container;
}

function renderLunchRiddle() {
  if (state.lunchRiddleStep === "map") {
    renderLunchRiddleMap();
    return;
  }

  const options = CONTENT.lunchRiddle.options;
  const showArtwork = !!state.lunchQuizShowArtwork;
  const selectedId = state.lunchQuizSelectedOption;
  const answered = !!state.lunchQuizAnswered;

  app.appendChild(el("p", { text: CONTENT.lunchRiddle.questionText }));

  const grid = el("div", { className: "quiz-grid" });
  options.forEach((opt) => {
    const card = el("div", { className: "quiz-option" + (selectedId === opt.id ? " selected" : "") });
    const img = document.createElement("img");
    img.src = showArtwork ? opt.artwork : opt.portrait;
    img.alt = opt.id;
    card.appendChild(img);
    card.appendChild(el("p", { className: "quiz-option-label", text: opt.id }));
    if (state.lunchQuizCorrect) {
      card.appendChild(el("p", { className: "quiz-option-name", text: opt.fullName }));
    }
    card.addEventListener("click", () => {
      transition({ lunchQuizSelectedOption: opt.id });
    });
    grid.appendChild(card);
  });
  app.appendChild(grid);

  app.appendChild(el("button", {
    text: showArtwork ? "画家の顔写真を表示する" : "代表的な作品は...？",
    onClick: () => transition({ lunchQuizShowArtwork: !showArtwork })
  }));

  if (state.lunchQuizCorrect) {
    // 正解演出は既に表示済み。ここでは手動で次へ進むボタンのみ表示する
    app.appendChild(el("button", {
      text: "次へ",
      onClick: () => goto("lunchRiddle", { lunchRiddleStep: "map" })
    }));
    return;
  }

  const submitBtn = el("button", {
    text: "回答する",
    onClick: () => {
      if (selectedId === CONTENT.lunchRiddle.correctOptionId) {
        transition({ lunchQuizAnswered: true, lunchQuizCorrect: true });
        showCorrectOverlayOnly();
      } else {
        transition({ lunchQuizAnswered: true });
      }
    }
  });
  submitBtn.disabled = !selectedId;
  app.appendChild(submitBtn);

  if (answered && selectedId !== CONTENT.lunchRiddle.correctOptionId) {
    app.appendChild(el("p", { className: "feedback", text: "ちがうみたい。もう一度！" }));
  }
}

// 正解後、行き先（三菱一号館美術館）のGoogle Mapを開くリンクを表示する。
function renderLunchRiddleMap() {
  app.appendChild(el("p", { text: "正解！このリンクから地図を開いて向かいましょう。" }));
  const link = document.createElement("a");
  link.href = CONTENT.lunchRiddle.mapUrl;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "地図を開く";
  link.className = "link";
  app.appendChild(link);
  app.appendChild(el("button", {
    text: "美術館に着いたら次へ",
    onClick: () => goto("museumTicket")
  }));
}

// 入場チケット画面：開催概要とQRコードを表示する。
function renderMuseumTicket() {
  const t = CONTENT.museumTicket;
  app.appendChild(el("h2", { text: "入場チケット" }));

  const ticketImg = document.createElement("img");
  ticketImg.src = t.ticketImage;
  ticketImg.alt = "開催概要";
  app.appendChild(ticketImg);

  app.appendChild(el("p", { text: "入場時にこのQRコードを提示してね⬇️" }));
  const qrImg = document.createElement("img");
  qrImg.src = t.qrImage;
  qrImg.alt = "入場用QRコード";
  qrImg.className = "ticket-qr";
  app.appendChild(qrImg);

  app.appendChild(el("button", {
    text: state.viewingFromArchive ? "画面一覧に戻る" : "次へ",
    onClick: () => {
      if (state.viewingFromArchive) {
        goto("archiveList", { viewingFromArchive: false });
      } else {
        goto("museumGuideList");
      }
    }
  }));
}

function renderMuseumGuideList() {
  app.appendChild(el("h2", { text: "美術館鑑賞ガイド（モネとルドン）" }));
  CONTENT.museumGuide.works.forEach((work) => {
    app.appendChild(el("p", {
      text: work.title,
      className: "link",
      onClick: () => goto("museumGuideDetail", { currentWorkId: work.id })
    }));
  });

  if (state.viewingFromArchive) {
    // 画面一覧（アーカイブ）経由で開いた場合は、分岐判定を行わず一覧に戻るだけにする
    app.appendChild(el("button", {
      text: "画面一覧に戻る",
      onClick: () => goto("archiveList", { viewingFromArchive: false })
    }));
  } else {
    app.appendChild(el("button", {
      text: "次へ",
      onClick: () => {
        const branch = decideBranch(CONTENT.timeCheck.cutoffTime);
        goto(branch === "plant" ? "plantIntro" : "dinnerIntro", { branchChoice: branch });
      }
    }));
  }
}

function renderMuseumGuideDetail() {
  const work = CONTENT.museumGuide.works.find((w) => w.id === state.currentWorkId) || CONTENT.museumGuide.works[0];
  app.appendChild(el("h2", { text: work.title }));
  app.appendChild(el("p", { className: "progress-label", text: `${work.artist}／${work.year}・${work.technique}` }));
  app.appendChild(el("p", { text: work.comment }));
  // viewingFromArchiveはmuseumGuideListへ戻る際に引き継ぐ（次へボタンの表示切り替えのため）
  app.appendChild(el("button", { text: "一覧に戻る", onClick: () => goto("museumGuideList", { viewingFromArchive: state.viewingFromArchive }) }));
}

// garage TOKYOへの案内（謎なし）。地図を開いて、着いたら次へ進む。
function renderBranchPlant() {
  app.appendChild(el("p", { text: CONTENT.plantShopGuide.text }));
  const link = document.createElement("a");
  link.href = CONTENT.plantShopGuide.mapUrl;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "地図を開く";
  link.className = "link map-link-button";
  app.appendChild(link);
  app.appendChild(el("button", {
    text: "植物を買えた！",
    // 「この建物を探せ！」の直前には常にディナー前の導入メッセージを挟む
    onClick: () => goto("dinnerIntro")
  }));
}

// 安室（人形町）への案内（謎なし）。建物の画像と地図を表示し、着いたらエンディングへ。
function renderBranchDinner() {
  app.appendChild(el("p", { text: CONTENT.toDinnerGuide.text }));

  const img = document.createElement("img");
  img.src = CONTENT.toDinnerGuide.image;
  img.alt = "建物の画像";
  app.appendChild(img);

  const link = document.createElement("a");
  link.href = CONTENT.toDinnerGuide.mapUrl;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "ここをタップして、会場があるエリアを表示";
  link.className = "link map-link-button";
  app.appendChild(link);

  if (state.branchDinnerHintShown) {
    const hintLink = document.createElement("a");
    hintLink.href = CONTENT.toDinnerGuide.hintMapUrl;
    hintLink.target = "_blank";
    hintLink.rel = "noopener";
    hintLink.textContent = "ヒントの地図を開く";
    hintLink.className = "link map-link-button";
    app.appendChild(hintLink);

    app.appendChild(el("button", {
      text: "ヒントを隠す",
      onClick: () => transition({ branchDinnerHintShown: false })
    }));
  } else {
    app.appendChild(el("button", {
      text: "ヒント",
      onClick: () => transition({ branchDinnerHintShown: true })
    }));
  }

  app.appendChild(el("button", {
    text: "着いたら次へ",
    onClick: () => goto("dinnerVenue")
  }));
}

// ディナー会場到着画面。会場への行き方の最終カードと同じデザインの単一カード表示。
function renderDinnerVenue() {
  const card = el("div", { className: "venue-card" });
  card.appendChild(el("div", { className: "venue-card-badge venue-card-badge-goal", text: "🍽" }));
  card.appendChild(el("p", { className: "venue-card-text", text: "ディナー：安室 人形町" }));
  app.appendChild(card);

  app.appendChild(el("button", {
    text: "いただきます！",
    onClick: () => goto("ending", { gameCompleted: true })
  }));
}

function renderEnding() {
  // gameCompletedはここに遷移してくる呼び出し元（goto("ending", { gameCompleted: true })）で
  // 既にセットされている想定。render内でtransition()を呼ぶとrender()の再帰呼び出しになるため行わない
  const nextBtn = el("button", { text: "画面一覧を見る", className: "kickoff-next", onClick: () => goto("archiveList") });
  renderScrollStory(CONTENT.ending.screens, el("div"), [nextBtn]);
}

function renderArchiveList() {
  if (!state.gameCompleted) {
    app.appendChild(el("p", { text: "まだ見られません。" }));
    return;
  }
  app.appendChild(el("h2", { text: "画面一覧" }));
  ARCHIVE_INDEX.forEach((item) => {
    app.appendChild(el("p", {
      text: item.label,
      className: "link",
      onClick: () => {
        if (item.key === "museumGuide") {
          // 美術館鑑賞ガイドはクリア前と同じ一覧⇔作品詳細の画面をそのまま再利用する
          goto("museumGuideList", { viewingFromArchive: true });
        } else if (item.key === "museumTicket") {
          // 入場チケットもクリア前と同じ画面をそのまま再利用する
          goto("museumTicket", { viewingFromArchive: true });
        } else {
          goto("archiveDetail", { currentArchiveKey: item.key });
        }
      }
    }));
  });

  app.appendChild(el("button", {
    text: "最初からやり直す",
    className: "danger",
    onClick: () => {
      if (confirm("最初からやり直しますか？進行状況がすべて消えます。")) {
        state = resetState();
        backStack = [];
        forwardStack = [];
        saveNavStacks();
        render();
      }
    }
  }));
}

function renderArchiveDetail() {
  const key = state.currentArchiveKey;
  let text = "（内容なし）";
  if (key === "kickoff") text = CONTENT.kickoff.screens.join("\n");
  else if (/^round\d+$/.test(key)) {
    const round = CONTENT.rounds.find((r) => r.id === key);
    if (round) text = `${round.locationRiddle.text}\n\n（紙の謎）${round.paperPuzzle.text}`;
  }
  else if (key === "postDiscovery") text = CONTENT.postDiscovery.screens.join("\n");
  else if (key === "venueGuide") {
    text = `${CONTENT.venueGuide.steps.map((s, i) => `Step ${i + 1}：${s}`).join("\n")}\nランチ：${CONTENT.venueGuide.venueName}`;
  }
  else if (key === "lunchIntro") text = CONTENT.lunchIntro.screens.join("\n");
  else if (key === "plantIntro") text = CONTENT.plantIntro.screens.join("\n");
  else if (key === "dinnerIntro") text = CONTENT.dinnerIntro.screens.join("\n");
  else if (key === "lunchRiddle") {
    text = `${CONTENT.lunchRiddle.questionText}\n${CONTENT.lunchRiddle.options.map((o) => `${o.id}. ${o.name}`).join(" / ")}`;
  }
  // museumGuideはrenderArchiveListからmuseumGuideListへ直接遷移するため、ここには来ない
  else if (key === "toPlantShop") text = CONTENT.plantShopGuide.text;
  else if (key === "toDinner") text = CONTENT.toDinnerGuide.text;
  else if (key === "dinnerVenue") text = "ディナー：安室 人形町";
  else if (key === "ending") text = CONTENT.ending.screens.join("\n");

  app.appendChild(el("p", { text }));
  app.appendChild(el("button", { text: "一覧に戻る", onClick: () => goto("archiveList") }));
}

// ---- 起動処理 ----
function init() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("reset") === "1") {
    state = resetState();
  }
  render();
}

init();
