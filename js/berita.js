/* Filter sektor + pencarian + paginasi untuk halaman Berita & Sektor */
(function () {
  "use strict";
  var grid = document.getElementById("news-grid");
  if (!grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll(".bcard"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".sector-chip"));
  var input = document.getElementById("news-q");
  var result = document.getElementById("news-result");
  var empty = document.getElementById("news-empty");
  var nav = document.getElementById("news-pagination");
  var info = document.getElementById("pagination-info");
  var btnWrap = document.getElementById("pagination-nav");
  var perPage = parseInt(grid.getAttribute("data-per-page"), 10) || 9;
  var valid = chips.map(function (c) { return c.getAttribute("data-sektor"); });
  var names = {};
  chips.forEach(function (c) { names[c.getAttribute("data-sektor")] = c.firstChild.textContent.trim(); });

  var params = new URLSearchParams(location.search);
  var state = {
    sektor: valid.indexOf(params.get("sektor")) > -1 ? params.get("sektor") : "semua",
    q: (params.get("q") || "").trim(),
    page: parseInt(params.get("halaman"), 10) || 1
  };
  if (input) input.value = state.q;

  function matches() {
    var q = state.q.toLowerCase();
    return cards.filter(function (c) {
      var okS = state.sektor === "semua" || c.getAttribute("data-sector") === state.sektor;
      var okQ = !q || c.getAttribute("data-search").indexOf(q) > -1;
      return okS && okQ;
    });
  }

  function btn(label, page, o) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "page-btn" + (o.active ? " is-active" : "");
    b.textContent = label;
    if (o.aria) b.setAttribute("aria-label", o.aria);
    if (o.active) b.setAttribute("aria-current", "page");
    if (o.disabled) b.disabled = true;
    else if (!o.active) b.addEventListener("click", function () { state.page = page; render(true); });
    return b;
  }

  function syncUrl() {
    var u = new URL(location.href);
    u.searchParams.delete("sektor"); u.searchParams.delete("q"); u.searchParams.delete("halaman");
    if (state.sektor !== "semua") u.searchParams.set("sektor", state.sektor);
    if (state.q) u.searchParams.set("q", state.q);
    if (state.page > 1) u.searchParams.set("halaman", state.page);
    history.replaceState(null, "", u);
  }

  function render(scroll) {
    var list = matches();
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / perPage));
    state.page = Math.min(Math.max(state.page, 1), pages);
    var start = (state.page - 1) * perPage, end = Math.min(start + perPage, total);

    cards.forEach(function (c) { c.hidden = true; });
    list.slice(start, end).forEach(function (c) { c.hidden = false; });

    chips.forEach(function (c) {
      var on = c.getAttribute("data-sektor") === state.sektor;
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-pressed", on ? "true" : "false");
    });

    var label = state.sektor === "semua" ? "" : " di sektor " + names[state.sektor];
    var cari = state.q ? " untuk “" + state.q + "”" : "";
    result.textContent = total ? "Menampilkan " + (start + 1) + "–" + end + " dari " + total + " berita" + label + cari : "";
    empty.hidden = total > 0;
    grid.hidden = total === 0;

    btnWrap.innerHTML = "";
    if (pages > 1) {
      btnWrap.appendChild(btn("← Sebelumnya", state.page - 1, { disabled: state.page === 1 }));
      for (var p = 1; p <= pages; p++) btnWrap.appendChild(btn(String(p), p, { active: p === state.page, aria: "Halaman " + p }));
      btnWrap.appendChild(btn("Selanjutnya →", state.page + 1, { disabled: state.page === pages }));
    }
    info.textContent = "";
    nav.hidden = pages <= 1;
    syncUrl();
    if (scroll) grid.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  chips.forEach(function (c) {
    c.addEventListener("click", function () { state.sektor = c.getAttribute("data-sektor"); state.page = 1; render(false); });
  });
  if (input) {
    var t;
    input.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { state.q = input.value.trim(); state.page = 1; render(false); }, 150);
    });
  }
  document.getElementById("news-reset").addEventListener("click", function () {
    state.sektor = "semua"; state.q = ""; state.page = 1; if (input) input.value = ""; render(false);
  });
  render(false);
})();
