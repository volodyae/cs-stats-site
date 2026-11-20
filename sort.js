// 1. Безотказная сортировка таблиц (использует th.cellIndex конкретной таблицы + перенумерацию рангов)
document.querySelectorAll("table.sortable thead th").forEach(th => {
  if (th.dataset.nosort) return;
  th.addEventListener("click", () => {
    const tbl = th.closest("table");
    const tb = tbl.tBodies[0];
    const col = th.cellIndex;
    const isLeft = th.classList.contains("l");
    const cur = th.dataset.dir;
    const dir = cur ? (cur === "desc" ? "asc" : "desc") : (isLeft ? "asc" : "desc");

    tbl.querySelectorAll("thead th").forEach(x => delete x.dataset.dir);
    th.dataset.dir = dir;

    const getVal = tr => {
      const td = tr.cells[col];
      if (!td) return -1e12;
      const raw = td.dataset.v !== undefined ? td.dataset.v : td.textContent.trim();
      const cleaned = raw.replace(/[%+]/g, "").trim();
      if (raw === "—" || cleaned === "") return dir === "desc" ? -1e12 : 1e12;
      const num = Number(cleaned);
      if (!Number.isNaN(num) && cleaned !== "") return num;
      return raw.toLowerCase();
    };

    const rows = Array.from(tb.rows);
    rows.sort((a, b) => {
      const va = getVal(a), vb = getVal(b);
      let cmp = 0;
      if (typeof va === "number" && typeof vb === "number") cmp = va - vb;
      else cmp = String(va).localeCompare(String(vb), "ru");
      return dir === "asc" ? cmp : -cmp;
    });

    const wrap = tbl.closest(".tw");
    const moreBtn = wrap ? wrap.querySelector(".more-btn") : null;
    const isCollapsed = moreBtn && moreBtn.style.display !== "none";
    const pageLimit = isCollapsed ? rows.filter(r => !r.classList.contains("collapsed-row")).length : 0;

    rows.forEach((r, idx) => {
      tb.appendChild(r);
      if (tbl.dataset.rank === "1" && r.cells[0]) r.cells[0].textContent = idx + 1;
      if (pageLimit > 0) r.classList.toggle("collapsed-row", idx >= pageLimit);
    });
  });
});

// 2. Раскрытие компактных таблиц ("Показать все строки")
document.querySelectorAll(".more-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const tw = btn.closest(".tw");
    tw.querySelectorAll("tr.collapsed-row").forEach(r => r.classList.remove("collapsed-row"));
    btn.style.display = "none";
  });
});

// 3. Переключение витрины карт (Map Pool Tiles)
document.querySelectorAll(".map-tile").forEach(tile => {
  tile.addEventListener("click", () => {
    document.querySelectorAll(".map-tile").forEach(b => b.classList.remove("on"));
    document.querySelectorAll(".map-panes .tab-pane").forEach(p => p.classList.remove("on"));
    tile.classList.add("on");
    const pane = document.getElementById(tile.dataset.tab);
    if (pane) pane.classList.add("on");
  });
});

// 4. Универсальные переключатели Segmented Controls
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

// 6. Живой поиск по игроку (в лидерборде и связках)
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
