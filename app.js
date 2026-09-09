// app.js
// アプリのロジック本体。問題文・答え（CONTENT／ARCHIVE_INDEX）はcontent.jsに分離してあるため、
// このファイルは基本的に触らずに済む設計にしている（BDAY26-010設計方針）。

const STORAGE_KEY = "bday26_progress";

const DEFAULT_STATE = {
  currentScreen: "kickoff",
  currentRoundIndex: 0,
  branchChoice: null,
  hintLevelByStep: {},
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

function goto(screen, extra = {}) {
  transition({ currentScreen: screen, ...extra });
}

// ---- 各画面のレンダリング ----
const app = document.getElementById("app");

function render() {
  app.innerHTML = "";
  const screen = state.currentScreen;
  const renderers = {
    kickoff: renderKickoff,
    round: renderRound,
    milestoneReveal: renderMilestoneReveal,
    dressCode: renderDressCode,
    lunchRiddle: renderLunchRiddle,
    museumGuideList: renderMuseumGuideList,
    museumGuideDetail: renderMuseumGuideDetail,
    branchPlant: renderBranchPlant,
    branchDinner: renderBranchDinner,
    ending: renderEnding,
    archiveList: renderArchiveList,
    archiveDetail: renderArchiveDetail
  };
  (renderers[screen] || renderUnknown)();
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

function renderUnknown() {
  app.appendChild(el("p", { text: `未知の画面です: ${state.currentScreen}` }));
}

function renderKickoff() {
  const target = new Date(CONTENT.kickoff.countdownTargetISO);
  const now = new Date();

  if (now >= target) {
    // カウントダウンが既に終わっている場合はそのままラウンド開始へ
    goto("round", { currentRoundIndex: 0 });
    return;
  }

  CONTENT.kickoff.screens.forEach((text) => {
    app.appendChild(el("p", { text }));
  });

  const countdownEl = el("p", { className: "countdown" });
  app.appendChild(countdownEl);

  function updateCountdown() {
    const diff = target - new Date();
    if (diff <= 0) {
      goto("round", { currentRoundIndex: 0 });
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    countdownEl.textContent = `開始まで あと ${h}時間${m}分${s}秒`;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 動作確認用の隠しボタン。カウントダウンを待たずに進める。
  // 目立たない見た目にしてあるが、本番公開前（BDAY26-020）には削除・無効化を検討すること
  app.appendChild(el("button", {
    text: "・",
    className: "debug-skip",
    onClick: () => goto("round", { currentRoundIndex: 0 })
  }));
}

function renderRound() {
  const round = CONTENT.rounds[state.currentRoundIndex];
  if (!round) {
    goto("milestoneReveal");
    return;
  }

  app.appendChild(el("h2", { text: `ラウンド${state.currentRoundIndex + 1}` }));
  app.appendChild(el("p", { text: round.locationRiddle.text }));
  app.appendChild(renderHints(round.id, round.locationRiddle.hints));

  const input = document.createElement("input");
  input.placeholder = "合言葉を入力";
  const feedback = el("p", { className: "feedback" });

  const button = el("button", {
    text: "決定",
    onClick: () => {
      if (checkAnswer(input.value, round.paperPuzzle.answer)) {
        const isLast = state.currentRoundIndex >= CONTENT.rounds.length - 1;
        if (isLast) {
          goto("milestoneReveal");
        } else {
          goto("round", { currentRoundIndex: state.currentRoundIndex + 1 });
        }
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

  for (let i = 0; i < level; i++) {
    container.appendChild(el("p", { text: `ヒント${i + 1}: ${hints[i]}` }));
  }

  if (level < hints.length) {
    container.appendChild(el("button", {
      text: "ヒントを見る",
      onClick: () => {
        const hintLevelByStep = { ...state.hintLevelByStep, [stepId]: level + 1 };
        transition({ hintLevelByStep });
      }
    }));
  }
  return container;
}

function renderMilestoneReveal() {
  app.appendChild(el("p", { text: CONTENT.milestoneReveal.text }));
  app.appendChild(el("button", { text: "次へ", onClick: () => goto("dressCode") }));
}

function renderDressCode() {
  app.appendChild(el("p", { text: CONTENT.dressCode.instructionText }));
  app.appendChild(el("button", {
    text: "着替えました",
    onClick: () => {
      app.innerHTML = "";
      app.appendChild(el("p", { text: CONTENT.dressCode.completedText }));
      app.appendChild(el("button", { text: "（ランチ後にここを開く）次へ", onClick: () => goto("lunchRiddle") }));
    }
  }));
}

function renderLunchRiddle() {
  app.appendChild(el("p", { text: CONTENT.lunchRiddle.text }));
  app.appendChild(renderHints("lunchRiddle", CONTENT.lunchRiddle.hints));
  const input = document.createElement("input");
  input.placeholder = "合言葉を入力";
  const feedback = el("p", { className: "feedback" });
  app.appendChild(input);
  app.appendChild(el("button", {
    text: "決定",
    onClick: () => {
      if (checkAnswer(input.value, CONTENT.lunchRiddle.answer)) {
        goto("museumGuideList");
      } else {
        feedback.textContent = "ちがうみたい。もう一度！";
      }
    }
  }));
  app.appendChild(feedback);
}

function renderMuseumGuideList() {
  app.appendChild(el("h2", { text: "美術館鑑賞ガイド" }));
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
      text: "次へ（全部見ていなくてもOK）",
      onClick: () => {
        const branch = decideBranch(CONTENT.timeCheck.cutoffTime);
        goto(branch === "plant" ? "branchPlant" : "branchDinner", { branchChoice: branch });
      }
    }));
  }
}

function renderMuseumGuideDetail() {
  const work = CONTENT.museumGuide.works.find((w) => w.id === state.currentWorkId) || CONTENT.museumGuide.works[0];
  app.appendChild(el("h2", { text: work.title }));
  app.appendChild(el("p", { text: work.comment }));
  // viewingFromArchiveはmuseumGuideListへ戻る際に引き継ぐ（次へボタンの表示切り替えのため）
  app.appendChild(el("button", { text: "一覧に戻る", onClick: () => goto("museumGuideList", { viewingFromArchive: state.viewingFromArchive }) }));
}

function renderBranchPlant() {
  app.appendChild(el("p", { text: CONTENT.branchRiddles.toPlantShop.text }));
  const input = document.createElement("input");
  input.placeholder = "合言葉を入力";
  const feedback = el("p", { className: "feedback" });
  app.appendChild(input);
  app.appendChild(el("button", {
    text: "決定",
    onClick: () => {
      if (checkAnswer(input.value, CONTENT.branchRiddles.toPlantShop.answer)) {
        goto("branchDinner");
      } else {
        feedback.textContent = "ちがうみたい。もう一度！";
      }
    }
  }));
  app.appendChild(feedback);
}

function renderBranchDinner() {
  app.appendChild(el("p", { text: CONTENT.branchRiddles.toDinner.text }));
  const input = document.createElement("input");
  input.placeholder = "合言葉を入力";
  const feedback = el("p", { className: "feedback" });
  app.appendChild(input);
  app.appendChild(el("button", {
    text: "決定",
    onClick: () => {
      if (checkAnswer(input.value, CONTENT.branchRiddles.toDinner.answer)) {
        goto("ending", { gameCompleted: true });
      } else {
        feedback.textContent = "ちがうみたい。もう一度！";
      }
    }
  }));
  app.appendChild(feedback);
}

function renderEnding() {
  // gameCompletedはここに遷移してくる呼び出し元（goto("ending", { gameCompleted: true })）で
  // 既にセットされている想定。render内でtransition()を呼ぶとrender()の再帰呼び出しになるため行わない
  app.appendChild(el("p", { text: CONTENT.ending.text }));
  app.appendChild(el("button", { text: "画面一覧を見る", onClick: () => goto("archiveList") }));
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
        render();
      }
    }
  }));
}

function renderArchiveDetail() {
  const key = state.currentArchiveKey;
  let text = "（内容なし）";
  if (key === "kickoff") text = CONTENT.kickoff.screens.join("\n");
  else if (key === "round1") text = CONTENT.rounds[0].locationRiddle.text;
  else if (key === "milestoneReveal") text = CONTENT.milestoneReveal.text;
  else if (key === "dressCode") text = CONTENT.dressCode.instructionText;
  else if (key === "lunchRiddle") text = CONTENT.lunchRiddle.text;
  // museumGuideはrenderArchiveListからmuseumGuideListへ直接遷移するため、ここには来ない
  else if (key === "toPlantShop") text = CONTENT.branchRiddles.toPlantShop.text;
  else if (key === "toDinner") text = CONTENT.branchRiddles.toDinner.text;
  else if (key === "ending") text = CONTENT.ending.text;

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
