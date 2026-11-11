/* =====================================================
   Nerazzurri fan site — shared script (all 4 pages)
   Needs js/data.js loaded first.
   ===================================================== */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const euro = (n) => "€" + n.toFixed(2);

  /* ---------- Mobile menu ---------- */
  const toggle = $(".menu-toggle");
  const links = $(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Match helpers ---------- */
  const MATCH_LENGTH_MS = 2 * 60 * 60 * 1000; // treat a game as "finished" 2h after kick-off
  const sorted = [...MATCHES].sort((a, b) => new Date(a.date) - new Date(b.date));
  const isPast = (m) => new Date(m.date).getTime() + MATCH_LENGTH_MS < Date.now();
  const nextMatch = () => sorted.find((m) => !isPast(m));

  const fmtDay = (d) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const fmtYear = (d) => d.getFullYear();
  const fmtTime = (d) => d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  /* ---------- Matches page ---------- */
  const list = $("#matchList");
  if (list) {
    let filter = "all";
    const draw = () => {
      const next = nextMatch();
      const rows = sorted.filter((m) => filter === "all" || (filter === "upcoming" ? !isPast(m) : isPast(m)));
      list.innerHTML = rows.length
        ? rows.map((m) => {
            const d = new Date(m.date);
            const past = isPast(m);
            const homeName = m.home ? "Inter" : m.opp;
            const awayName = m.home ? m.opp : "Inter";
            const box = past
              ? (m.score ? `<div class="score">${m.score[0]} – ${m.score[1]}</div>` : `<div class="score tbc">FT</div>`)
              : `<div class="score">${fmtTime(d)}</div>`;
            const isNext = next && next.id === m.id;
            return `
            <article class="match">
              <div class="when">${fmtDay(d)}<small>${fmtYear(d)}</small></div>
              <div class="t home ${m.home ? "us" : ""}">${homeName}</div>
              ${box}
              <div class="t ${m.home ? "" : "us"}">${awayName}</div>
              <span class="badge ${isNext ? "next" : ""}">${isNext ? "Next match" : m.round}</span>
            </article>`;
          }).join("")
        : `<p class="empty">No matches to show.</p>`;
    };
    $$(".chip[data-filter]").forEach((btn) =>
      btn.addEventListener("click", () => {
        $$(".chip[data-filter]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        filter = btn.dataset.filter;
        draw();
      })
    );
    // open on "upcoming" if there is anything upcoming
    if (nextMatch()) {
      filter = "upcoming";
      $$(".chip[data-filter]").forEach((b) => b.classList.toggle("active", b.dataset.filter === "upcoming"));
    }
    draw();
  }

  /* ---------- Home: next match + countdown ---------- */
  const banner = $("#nextMatch");
  if (banner) {
    const m = nextMatch();
    if (!m) {
      banner.innerHTML = `<div style="grid-column:1/-1"><h3>Season break</h3><p class="next-meta">No upcoming fixtures in the calendar — check back soon.</p></div>`;
    } else {
      const d = new Date(m.date);
      const homeName = m.home ? "Inter" : m.opp;
      const awayName = m.home ? m.opp : "Inter";
      banner.innerHTML = `
        <div><div class="team">${homeName}</div></div>
        <div><div class="vs">VS</div></div>
        <div><div class="team">${awayName}</div></div>
        <div style="grid-column:1/-1">
          <div class="next-meta">${m.comp} · ${m.round} · ${fmtDay(d)} ${fmtYear(d)}, ${fmtTime(d)} (your local time)</div>
        </div>
        <div class="countdown" id="countdown">
          <div><b data-u="d">--</b><small>Days</small></div>
          <div><b data-u="h">--</b><small>Hours</small></div>
          <div><b data-u="m">--</b><small>Min</small></div>
          <div><b data-u="s">--</b><small>Sec</small></div>
        </div>`;
      const tick = () => {
        let diff = Math.max(0, d - Date.now());
        const parts = {
          d: Math.floor(diff / 864e5),
          h: Math.floor((diff % 864e5) / 36e5),
          m: Math.floor((diff % 36e5) / 6e4),
          s: Math.floor((diff % 6e4) / 1e3)
        };
        for (const k in parts) {
          const el = $(`[data-u="${k}"]`, banner);
          if (el) el.textContent = String(parts[k]).padStart(2, "0");
        }
      };
      tick();
      setInterval(tick, 1000);
    }
  }

  /* ---------- Animated counters ---------- */
  const counters = $$("[data-count]");
  if (counters.length) {
    const run = (el) => {
      const target = +el.dataset.count;
      if (target > 1500) { el.textContent = target; return; } // years: no animation
      let n = 0;
      const step = Math.max(1, Math.round(target / 30));
      const t = setInterval(() => {
        n = Math.min(target, n + step);
        el.textContent = n;
        if (n >= target) clearInterval(t);
      }, 40);
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.4 });
      counters.forEach((c) => io.observe(c));
    } else counters.forEach(run);
  }

  /* ---------- History timeline reveal ---------- */
  const items = $$(".tl-item");
  if (items.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); } });
      }, { threshold: 0.2 });
      items.forEach((i) => io.observe(i));
    } else items.forEach((i) => i.classList.add("show"));
  }

  /* ---------- Kit artwork (inline SVG, no images needed) ---------- */
  function kitSvg(k) {
    const id = "clip-" + k.id + "-" + Math.random().toString(36).slice(2, 7);
    const body = "M60 20 L90 12 Q100 28 110 12 L140 20 L192 56 L170 98 L148 84 L148 206 Q100 216 52 206 L52 84 L30 98 L8 56 Z";
    let pat = "";
    if (k.pattern === "stripes") {
      const w = k.stripeW || 16;
      for (let x = 0, i = 0; x < 200; x += w, i++) if (i % 2) pat += `<rect x="${x}" y="0" width="${w}" height="230" fill="${k.c2}"/>`;
    } else if (k.pattern === "hoops") {
      for (let y = 0, i = 0; y < 230; y += 24, i++) if (i % 2) pat += `<rect x="0" y="${y}" width="200" height="24" fill="${k.c2}"/>`;
    } else if (k.pattern === "band") {
      pat = `<polygon points="0,70 0,112 200,196 200,154" fill="${k.c2}"/>`;
    }
    return `
    <svg viewBox="0 0 200 224" role="img" aria-label="${k.name}">
      <defs><clipPath id="${id}"><path d="${body}"/></clipPath></defs>
      <g clip-path="url(#${id})">
        <rect width="200" height="230" fill="${k.c1}"/>${pat}
      </g>
      <path d="${body}" fill="none" stroke="${k.trim}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M90 12 Q100 34 110 12" fill="none" stroke="${k.trim}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="130" cy="62" r="11" fill="none" stroke="${k.trim}" stroke-width="2"/>
      <text x="130" y="66" text-anchor="middle" font-size="9" fill="${k.trim}" font-family="Oswald, sans-serif">IM</text>
    </svg>`;
  }

  /* ---------- Cart (localStorage) ---------- */
  const SIZES = ["S", "M", "L", "XL"];
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("inter-cart") || "[]"); } catch (e) { cart = []; }
  const saveCart = () => { try { localStorage.setItem("inter-cart", JSON.stringify(cart)); } catch (e) {} };
  const kitById = (id) => KITS.find((k) => k.id === id);

  const drawer = $("#drawer");
  const drawerBg = $("#drawerBg");
  const toast = $("#toast");
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => toast.classList.remove("show"), 2200);
  };
  const openDrawer = (open) => {
    if (!drawer) return;
    drawer.classList.toggle("open", open);
    drawerBg.classList.toggle("open", open);
  };

  function renderCart() {
    const count = cart.reduce((n, l) => n + l.qty, 0);
    $$(".cart-count").forEach((el) => (el.textContent = count));
    const box = $("#drawerItems");
    if (!box) return;
    if (!cart.length) {
      box.innerHTML = `<p class="empty">Your basket is empty.<br>Forza Inter!</p>`;
    } else {
      box.innerHTML = cart.map((l, i) => {
        const k = kitById(l.id);
        return `
        <div class="cart-line">
          <div><strong>${k.name}</strong><br><small>Size ${l.size}</small>
            <div class="qty">
              <button data-act="dec" data-i="${i}" aria-label="Decrease">−</button>
              <span>${l.qty}</span>
              <button data-act="inc" data-i="${i}" aria-label="Increase">+</button>
            </div>
          </div>
          <div class="price" style="font-size:1.1rem">${euro(k.price * l.qty)}</div>
        </div>`;
      }).join("");
    }
    const total = cart.reduce((s, l) => s + kitById(l.id).price * l.qty, 0);
    const t = $("#cartTotal");
    if (t) t.textContent = euro(total);
  }

  function addToCart(id, size) {
    const line = cart.find((l) => l.id === id && l.size === size);
    if (line) line.qty++;
    else cart.push({ id, size, qty: 1 });
    saveCart();
    renderCart();
    showToast(kitById(id).name + " (" + size + ") added to basket");
  }

  /* ---------- Render kit cards ---------- */
  function renderKits(selector, limit, shop) {
    const el = $(selector);
    if (!el) return;
    const items = limit ? KITS.slice(0, limit) : KITS;
    el.innerHTML = items.map((k) => `
      <article class="kit-card" data-id="${k.id}">
        <div class="kit-visual">${kitSvg(k)}</div>
        <div class="kit-body">
          <span class="kit-tag">${k.tag}</span>
          <h3>${k.name}</h3>
          <p>${k.desc}</p>
          ${shop ? `<div class="sizes">${SIZES.map((s) => `<button class="size ${s === "M" ? "active" : ""}" data-size="${s}">${s}</button>`).join("")}</div>` : ""}
          <div class="kit-row">
            <span class="price">${euro(k.price)}</span>
            ${shop
              ? `<button class="btn small" data-add="${k.id}">Add to basket</button>`
              : `<a class="btn small ghost" href="store.html">View</a>`}
          </div>
        </div>
      </article>`).join("");

    if (shop) {
      el.addEventListener("click", (e) => {
        const sizeBtn = e.target.closest(".size");
        if (sizeBtn) {
          $$(".size", sizeBtn.parentElement).forEach((b) => b.classList.remove("active"));
          sizeBtn.classList.add("active");
          return;
        }
        const add = e.target.closest("[data-add]");
        if (add) {
          const card = add.closest(".kit-card");
          const size = $(".size.active", card).dataset.size;
          addToCart(add.dataset.add, size);
        }
      });
    }
  }
  renderKits("#featuredKits", 3, false);
  renderKits("#kitGrid", 0, true);

  /* ---------- Cart UI wiring ---------- */
  const cartBtn = $("#cartBtn");
  if (cartBtn) cartBtn.addEventListener("click", () => openDrawer(true));
  if (drawerBg) drawerBg.addEventListener("click", () => openDrawer(false));
  const closeBtn = $("#drawerClose");
  if (closeBtn) closeBtn.addEventListener("click", () => openDrawer(false));
  const itemsBox = $("#drawerItems");
  if (itemsBox) {
    itemsBox.addEventListener("click", (e) => {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      const i = +b.dataset.i;
      cart[i].qty += b.dataset.act === "inc" ? 1 : -1;
      if (cart[i].qty <= 0) cart.splice(i, 1);
      saveCart();
      renderCart();
    });
  }
  const checkout = $("#checkout");
  if (checkout) {
    checkout.addEventListener("click", () => {
      if (!cart.length) return showToast("Your basket is empty");
      showToast("Demo store — checkout isn't connected");
    });
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") openDrawer(false); });
  renderCart();
})();
