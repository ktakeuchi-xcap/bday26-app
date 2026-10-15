const T = window.TRIP;
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ---------- アイコン ----------
const ICON = {
  car: '<path d="M5 17h14M6.5 17v1.5M17.5 17v1.5M4 13l1.6-4.2A2 2 0 0 1 7.5 7.5h9a2 2 0 0 1 1.9 1.3L20 13v4H4v-4Zm0 0h16"/><circle cx="7.5" cy="14.5" r=".8"/><circle cx="16.5" cy="14.5" r=".8"/>',
  walk: '<circle cx="13" cy="4.5" r="1.6"/><path d="M10 21l2-6 2.5 2.5V21M8 12l2.5-4.5 3 1.5 1.5 3 2.5 1M10.5 7.5 9 12"/>',
  route: '<path d="M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M6 15V9.5A3.5 3.5 0 0 1 9.5 6H16M18 9v5.5a3.5 3.5 0 0 1-3.5 3.5H8"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  dog: '<path d="M7 4 5 9l2 1M17 4l2 5-2 1M7 10c0-3 2-5 5-5s5 2 5 5v4a5 5 0 0 1-10 0v-4Z"/><path d="M10 13h.01M14 13h.01M11 16.5h2"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  train: '<rect x="6" y="3.5" width="12" height="13" rx="3"/><path d="M6 11h12M9 20.5l1.5-4M15 20.5l-1.5-4M9.5 14h.01M14.5 14h.01"/>',
  bag: '<path d="M5.5 8h13l-1 12h-11l-1-12Z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>',
  yen: '<path d="m7 4 5 7 5-7M12 11v9M8 13h8M8 16.5h8"/>',
  alert: '<path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10v4.5M12 17.5h.01"/>',
  park: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M10 16.5v-9h3a2.5 2.5 0 0 1 0 5h-3"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>',
  phone: '<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z"/>'
};
const icon = (n) => `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n] || ""}</svg>`;

// ---------- 時刻 ----------
const params = new URLSearchParams(location.search);
const now = () => (params.get("now") ? new Date(params.get("now")) : new Date());
const dayOf = (id) => T.days.find((d) => d.id === id);
const at = (stop, key = "start") => {
  const [h, m] = (stop[key] || stop.start).split(":").map(Number);
  const d = new Date(dayOf(stop.day).date + "T00:00:00");
  d.setHours(h, m, 0, 0);
  return d;
};
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const hm = (d) => `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
const routeUrl = (s) =>
  "https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=" +
  encodeURIComponent(s.address.replace(/（.*?）/g, "") + " " + s.name);

// ---------- 状態（チェック） ----------
const LS = { checks: "kz26.checks", me: "kz26.me", room: "kz26.room" };
const read = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

let checks = read(LS.checks, {});
// 表示確認用：?done=id1,id2 で、その予定をチェック済みとして表示する（保存はしない）
const preview = params.has("done");
if (preview) checks = Object.fromEntries(params.get("done").split(",").filter(Boolean).map((id) => [id, { by: "まり子", at: now().getTime() - 600000 }]));
let me = read(LS.me, null);
let remote = null; // { set(id, val) }

const hashRoom = new URLSearchParams(location.hash.slice(1)).get("r");
if (hashRoom) write(LS.room, hashRoom);
const room = hashRoom || read(LS.room, null);

async function connect() {
  const cfg = window.TRIP_FIREBASE;
  const el = $("#sync");
  if (!cfg || !room || preview) return;
  try {
    const base = "https://www.gstatic.com/firebasejs/10.12.2/";
    const { initializeApp } = await import(base + "firebase-app.js");
    const fs = await import(base + "firebase-firestore.js");
    const app = initializeApp(cfg);
    const db = fs.initializeFirestore(app, { localCache: fs.persistentLocalCache() });
    const ref = fs.doc(db, "trips", room);
    fs.onSnapshot(ref, { includeMetadataChanges: true }, (snap) => {
      checks = (snap.exists() && snap.data().checks) || {};
      write(LS.checks, checks);
      const pending = snap.metadata.hasPendingWrites;
      el.className = "sync " + (snap.metadata.fromCache && !navigator.onLine ? "off" : "on");
      el.textContent = pending ? "送信待ち（電波が戻ると送られます）" : navigator.onLine ? "全員のチェックを共有中" : "オフライン（電波が戻ると同期します）";
      render();
    }, () => { el.className = "sync off"; el.textContent = "共有に接続できません（この端末のみに記録中）"; });
    remote = {
      set: (id, val) =>
        val
          ? fs.setDoc(ref, { checks: { [id]: val } }, { merge: true })
          : fs.updateDoc(ref, { ["checks." + id]: fs.deleteField() })
    };
    addEventListener("online", render);
    addEventListener("offline", render);
  } catch (e) {
    el.className = "sync off";
    el.textContent = "共有に接続できません（この端末のみに記録中）";
  }
}

function toggle(id) {
  if (!me) return askName(() => toggle(id));
  const val = checks[id] ? null : { by: me, at: Date.now() };
  if (val) checks[id] = val; else delete checks[id];
  if (!preview) write(LS.checks, checks);
  render();
  if (remote) remote.set(id, val).catch(() => toast("共有に失敗しました。この端末には記録済みです"));
  if (val && T.stops.some((s) => s.id === id)) {
    const n = nextStop();
    toast(n ? `次は ${n.name}（${n.start}）` : "おつかれさまでした！");
  }
}

function askName(then) {
  const sheet = $("#sheet");
  $("#names").innerHTML = T.members.map((m) => `<button class="btn" data-name="${esc(m)}">${esc(m)}</button>`).join("");
  sheet.classList.add("show");
  sheet.onclick = (e) => {
    const b = e.target.closest("[data-name]");
    if (b) { me = b.dataset.name; write(LS.me, me); }
    if (b || e.target === sheet) { sheet.classList.remove("show"); renderMe(); if (b && then) then(); }
  };
}

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

// ---------- 次の行き先 ----------
function nextStop() {
  const today = ymd(now());
  // 2日目に入ったら、1日目のチェック漏れは対象外にする
  const pool = today >= T.days[1].date ? T.stops.filter((s) => s.day === "d2") : T.stops;
  return pool.find((s) => !checks[s.id]) || null;
}
const after = (s) => {
  const i = T.stops.indexOf(s);
  return T.stops.slice(i + 1).find((x) => x.day === s.day) || null;
};

function statusOf(s) {
  const n = now();
  if (ymd(n) !== dayOf(s.day).date) return null;
  const start = at(s), end = at(s, s.end ? "end" : "start");
  const mins = Math.round((n - start) / 60000);
  const over = Math.round((n - end) / 60000);
  if (mins < -5) return { live: false, text: `あと${-mins}分で予定時刻`, late: false };
  if (over > 60) return { live: true, text: "予定の時刻を過ぎています", late: true, help: true };
  if (over > 15) return { live: true, text: `予定より${over}分押し`, late: true, help: true };
  if (over > 5) return { live: true, text: `予定より${over}分押し`, late: true };
  return { live: true, text: "予定どおり", late: false };
}

// ---------- 描画 ----------
const copyBtn = (text, label = "コピー") => `<button class="copy" data-copy="${esc(text)}">${label}</button>`;
function naviBlock(s) {
  const rows = [];
  if (s.address) rows.push(`<div class="navi-row"><span class="lbl">住所</span><span class="val">${esc(s.address)}</span>${copyBtn(s.address.replace(/（.*?）/g, ""))}</div>`);
  if (s.tel) rows.push(`<div class="navi-row"><span class="lbl">電話</span><span class="val num">${esc(s.tel)}${s.telNote ? `<span class="note">${esc(s.telNote)}</span>` : ""}</span>${copyBtn(s.tel.replace(/-/g, ""))}</div>`);
  if (s.parking) rows.push(`<div class="navi-row"><span class="lbl">駐車</span><span class="val">${esc(s.parking)}</span></div>`);
  return rows.length ? `<div class="navi" aria-label="カーナビ用の情報">${rows.join("")}</div>` : "";
}
// 外部サイトの写真が読めないときは、色面のカードに切り替える
const media = (s) =>
  `<div class="media"><img src="${s.photo}" alt="${esc(s.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"
    onerror="this.parentNode.outerHTML='<div class=&quot;glyph ink&quot; aria-hidden=&quot;true&quot;><span>${esc(s.name[0])}</span></div>'">${
    s.credit ? `<a class="credit" href="${s.credit[1]}" target="_blank" rel="noopener">画像：${esc(s.credit[0])}</a>` : ""}</div>`;

function stopCard(s, next) {
  const c = checks[s.id];
  const state = c ? "is-done" : s === next ? "is-next" : "";
  const by = c ? `<p class="by">${icon("check")} ${esc(c.by)} ・ ${hm(new Date(c.at))}</p>` : "";
  const label = s.doneLabel || "出発した";
  return `
  <li class="stop ${state} ${c ? "" : "reveal"}" id="${s.id}">
    <span class="pin" aria-hidden="true"></span>
    <article class="card">
      ${media(s)}
      <div class="card-body">
        <div><div class="time">${s.start}${s.end ? `<span class="to"> – ${s.end}</span>` : ""}</div></div>
        <div>
          <h3 class="name">${esc(s.name)}</h3>
          <p class="kind">${esc(s.kind)}</p>
        </div>
        <p class="lead">${esc(s.lead)}</p>
        <ul class="tags">${(s.tags || []).map(([k, t]) => `<li class="tag ${k}">${icon(k)}${esc(t)}</li>`).join("")}</ul>
        ${naviBlock(s)}
        ${s.hours ? `<details class="more"><summary>営業時間</summary><dl><dt>時間</dt><dd>${esc(s.hours)}</dd></dl></details>` : ""}
        <div class="actions">
          <a class="btn route-btn" href="${routeUrl(s)}" target="_blank" rel="noopener">${icon("route")}ルート</a>
          <button class="btn ${c ? "" : s === next ? "primary" : ""}" data-check="${s.id}" aria-pressed="${!!c}">${c ? "取り消す" : icon("check") + label}</button>
        </div>
        ${by}
      </div>
    </article>
  </li>`;
}

function moveRow(s) {
  if (!s.move) return "";
  const m = s.move;
  return `<li class="move"><span class="dot">${icon(m.mode === "walk" ? "walk" : "car")}</span>${m.mode === "walk" ? "徒歩" : "車"} 約<b>${m.min}</b>分<a href="${routeUrl(s)}" target="_blank" rel="noopener">ルート →</a>${m.note ? `<span class="mnote">${esc(m.note)}</span>` : ""}</li>`;
}

let activeDay = null;
function renderDays(next) {
  const today = ymd(now());
  if (!activeDay) activeDay = (T.days.find((d) => d.date === today) || (today > T.days[1].date ? T.days[1] : T.days[0])).id;
  $("#tabs").innerHTML = T.days
    .map((d) => `<button class="tab" role="tab" aria-selected="${d.id === activeDay}" data-day="${d.id}"><span class="d">${d.label}</span>${d.dow}</button>`)
    .join("");
  $("#days").innerHTML = T.days
    .filter((d) => d.id === activeDay)
    .map((d) => `
      <section aria-label="${d.label}の予定">
        <div class="day-head"><h2>${esc(d.title)}</h2><p>${d.label}（${d.dow}）・${T.stops.filter((s) => s.day === d.id).length}か所</p></div>
        <ol class="timeline">${T.stops.filter((s) => s.day === d.id).map((s) => moveRow(s) + stopCard(s, next)).join("")}</ol>
      </section>`)
    .join("");
}

function renderNow(next) {
  const box = $("#now");
  const dock = $("#dock");
  if (!next) {
    box.innerHTML = `<div class="now-done"><p class="now-name">すべての予定が完了しました</p><p class="now-meta">おつかれさまでした。気をつけて帰ってください。</p></div>`;
    dock.innerHTML = "";
    return;
  }
  const st = statusOf(next);
  const live = st && st.live;
  const nx = after(next);
  const moveTxt = next.move ? `${next.move.mode === "walk" ? "徒歩" : "車で"}約${next.move.min}分` : "";
  box.innerHTML = `
    <div class="now-head">
      <span class="badge">${live ? "NOW" : "NEXT"}</span>
      ${st ? `<span class="status ${st.late ? "late" : ""}">${esc(st.text)}${st.help ? `・<a href="#help">困ったとき</a>` : ""}</span>` : `<span class="status">${dayOf(next.day).label}（${dayOf(next.day).dow}）</span>`}
    </div>
    <div class="now-title"><span class="now-time">${next.start}</span><span class="now-name">${esc(next.name)}</span></div>
    <p class="now-meta">${esc(next.kind)}${moveTxt ? `・前の場所から${moveTxt}` : ""}</p>
    ${naviBlock(next)}
    <div class="actions" style="margin-top:12px">
      <a class="btn" href="${routeUrl(next)}" target="_blank" rel="noopener">${icon("route")}ルートを開く</a>
      <button class="btn primary" data-check="${next.id}">${icon("check")}${esc(next.doneLabel || "出発した")}</button>
    </div>
    ${nx ? `<p class="now-after">このあと：${nx.start} ${esc(nx.name)}</p>` : ""}`;
  dock.innerHTML = `
    <div class="dock-inner">
      <div class="dock-txt" data-jump="${next.id}"><div class="l">${live ? "NOW" : "NEXT"}</div><div class="t"><span>${next.start}</span>${esc(next.name)}</div></div>
      <a class="btn" href="${routeUrl(next)}" target="_blank" rel="noopener" aria-label="ルートを開く">${icon("route")}</a>
      <button class="btn primary" data-check="${next.id}" aria-label="${esc(next.doneLabel || "出発した")}">${icon("check")}</button>
    </div>`;
}

function renderStatic() {
  document.title = T.title;
  $("#eyebrow").textContent = T.subtitle;
  $("#title").textContent = T.title;
  $("#backups").innerHTML = T.backups
    .map((b) => `<details class="backup"><summary>${esc(b.when)}</summary><div class="b">${b.photo ? `<img src="${b.photo}" alt="" loading="lazy">` : ""}${esc(b.what)}${b.address ? naviBlock({ address: b.address, tel: b.tel }) : ""}</div></details>`)
    .join("");
  const external = [...new Map(T.stops.filter((s) => s.credit).map((s) => [s.credit[0], s.credit])).values()];
  $("#credits").innerHTML = `写真<ul>${external.map(([n, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(n)}</a></li>`).join("")}${T.credits
    .map((c) => `<li>${esc(c.use)}：<a href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(c.file.replace(/ /g, "_"))}" target="_blank" rel="noopener">${esc(c.file)}</a>（${esc(c.author)}／${c.license === "CC0" ? "CC0" : `<a href="https://creativecommons.org/licenses/${c.license.includes("SA") ? "by-sa/4.0" : "by/2.5"}/deed.ja" target="_blank" rel="noopener">${esc(c.license)}</a>`}・Wikimedia Commons）</li>`)
    .join("")}</ul>`;
}

function renderMe() {
  $("#me-line").innerHTML = me ? `あなた：${esc(me)}　<button id="me-change">変更</button>` : "";
}

function render() {
  const next = nextStop();
  renderNow(next);
  renderDays(next);
}

// ---------- 操作 ----------
document.addEventListener("click", async (e) => {
  const chk = e.target.closest("[data-check]");
  if (chk) return toggle(chk.dataset.check);
  const tab = e.target.closest("[data-day]");
  if (tab) { activeDay = tab.dataset.day; render(); return; }
  const cp = e.target.closest("[data-copy]");
  if (cp) {
    try {
      await navigator.clipboard.writeText(cp.dataset.copy);
    } catch {
      const ta = Object.assign(document.createElement("textarea"), { value: cp.dataset.copy });
      document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    cp.classList.add("ok"); cp.textContent = "コピー済";
    setTimeout(() => { cp.classList.remove("ok"); cp.textContent = "コピー"; }, 1600);
    return;
  }
  const jump = e.target.closest("[data-jump]");
  if (jump) {
    const s = T.stops.find((x) => x.id === jump.dataset.jump);
    if (s && s.day !== activeDay) { activeDay = s.day; render(); }
    document.getElementById(jump.dataset.jump)?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  if (e.target.id === "me-change") askName();
});

// いま／つぎ カードが見えなくなったら下部バーを出す
new IntersectionObserver(([en]) => {
  const d = $("#dock");
  const show = !en.isIntersecting && en.boundingClientRect.top < 0;
  d.classList.toggle("show", show);
  d.setAttribute("aria-hidden", String(!show));
}).observe($("#now"));

renderStatic();
renderMe();
render();
setInterval(() => renderNow(nextStop()), 60000);
connect();
