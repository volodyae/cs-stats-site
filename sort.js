// 1. Умная сортировка: номер # остаётся привязан к игроку! Прочерки (__NA__) всегда строго внизу!
document.querySelectorAll("table.sortable thead th").forEach(th => {
  th.addEventListener("click", () => {
    const tbl = th.closest("table");
    const tb = tbl.tBodies[0];
    const col = th.cellIndex;
    const preferAsc = th.classList.contains("l") || th.dataset.ascDefault === "1";
    const cur = th.dataset.dir;
    const dir = cur ? (cur === "desc" ? "asc" : "desc") : (preferAsc ? "asc" : "desc");

    tbl.querySelectorAll("thead th").forEach(x => delete x.dataset.dir);
    th.dataset.dir = dir;

    const parseCell = tr => {
      const td = tr.cells[col];
      if (!td) return { na: true, v: 0 };
      const raw = td.dataset.v !== undefined ? td.dataset.v : td.textContent.trim();
      if (raw === "__NA__" || raw === "—" || raw === "") return { na: true, v: 0 };
      const cleaned = raw.replace(/[%+]/g, "").trim();
      const num = Number(cleaned);
      if (!Number.isNaN(num) && cleaned !== "") return { na: false, num: true, v: num };
      return { na: false, num: false, v: raw.toLowerCase() };
    };

    const rows = Array.from(tb.rows);
    rows.sort((a, b) => {
      const pa = parseCell(a), pb = parseCell(b);
      if (pa.na && pb.na) return 0;
      if (pa.na) return 1;   // строки без данных всегда уходят в конец!
      if (pb.na) return -1;
      let cmp = 0;
      if (pa.num && pb.num) cmp = pa.v - pb.v;
      else cmp = String(pa.v).localeCompare(String(pb.v), "ru");
      return dir === "asc" ? cmp : -cmp;
    });

    const wrap = tbl.closest(".tw");
    const moreBtn = wrap ? wrap.querySelector(".more-btn") : null;
    const isCollapsed = moreBtn && moreBtn.style.display !== "none";
    const pageLimit = isCollapsed ? rows.filter(r => !r.classList.contains("collapsed-row")).length : 0;

    rows.forEach((r, idx) => {
      tb.appendChild(r);
      // Никакой перезаписи r.cells[0]! Ранг # путешествует вместе со своим игроком.
      if (pageLimit > 0) r.classList.toggle("collapsed-row", idx >= pageLimit);
    });
  });
});

// 2. Раскрытие компактных таблиц
document.querySelectorAll(".more-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const tw = btn.closest(".tw");
    tw.querySelectorAll("tr.collapsed-row").forEach(r => r.classList.remove("collapsed-row"));
    btn.style.display = "none";
  });
});

// 3. Переключение витрины карт
document.querySelectorAll(".map-tile").forEach(tile => {
  tile.addEventListener("click", () => {
    document.querySelectorAll(".map-tile").forEach(b => b.classList.remove("on"));
    document.querySelectorAll(".map-panes .tab-pane").forEach(p => p.classList.remove("on"));
    tile.classList.add("on");
    const pane = document.getElementById(tile.dataset.tab);
    if (pane) pane.classList.add("on");
  });
});

// 4. Segmented Controls
document.querySelectorAll(".seg[data-seg]").forEach(seg => {
  const cls = seg.dataset.seg;
  seg.querySelectorAll(".seg-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      seg.querySelectorAll(".seg-btn").forEach(b => b.classList.remove("on"));
      document.querySelectorAll("." + cls).forEach(p => p.classList.remove("on"));
      btn.classList.add("on");
      const target = document.getElementById(btn.dataset.pane);
      if (target) target.classList.add("on");
    });
  });
});

// 5. Фильтр архива матчей по месяцам
document.querySelectorAll("[data-mfilter]").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.parentElement.querySelectorAll(".seg-btn").forEach(b => b.classList.remove("on"));
    btn.classList.add("on");
    const key = btn.dataset.mfilter;
    document.querySelectorAll(".mgroup").forEach(sec => {
      sec.style.display = (key === "all" || sec.dataset.mgroup === key) ? "" : "none";
    });
  });
});

// 6. Живой поиск по игроку
document.querySelectorAll(".search-inp").forEach(inp => {
  inp.addEventListener("input", () => {
    const q = inp.value.trim().toLowerCase();
    const area = document.getElementById(inp.dataset.target);
    if (!area) return;
    area.querySelectorAll("tbody tr").forEach(tr => {
      const hay = (tr.dataset.q || tr.textContent).toLowerCase();
      tr.classList.toggle("filtered-out", q.length > 0 && !hay.includes(q));
      if (q.length > 0) tr.classList.remove("collapsed-row");
    });
    const more = area.querySelector(".more-btn");
    if (more && q.length > 0) more.style.display = "none";
  });
});
