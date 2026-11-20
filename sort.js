document.querySelectorAll("table.sortable th").forEach((th,i)=>{th.onclick=()=>{
const tb=th.closest("table").tBodies[0],asc=th.dataset.asc!=="1";
th.parentNode.querySelectorAll("th").forEach(x=>delete x.dataset.asc);th.dataset.asc=asc?"1":"0";
const val=td=>{const v=td.dataset.v??td.textContent.trim().replace("%","").replace("+","");const n=parseFloat(v);
return isNaN(n)?(v==="—"?-1e9:v.toLowerCase()):n};
[...tb.rows].sort((a,b)=>{const x=val(a.cells[i]),y=val(b.cells[i]);return (x>y?1:x<y?-1:0)*(asc?-1:1)})
.forEach(r=>tb.appendChild(r))}});
document.querySelectorAll(".tab-btn").forEach(btn=>{btn.onclick=()=>{
const wrap=btn.closest(".sec");
wrap.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("on"));
wrap.querySelectorAll(".tab-pane").forEach(p=>p.classList.remove("on"));
btn.classList.add("on");
const target=document.getElementById(btn.dataset.tab);
if(target)target.classList.add("on");
}});