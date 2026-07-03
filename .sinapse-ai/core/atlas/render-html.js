/**
 * Atlas → HTML dashboard renderer (visual).
 *
 * Produces a single self-contained HTML file (data embedded) with the same
 * atlas data as the markdown atlas: at-a-glance counts, the operating-model
 * Mermaid diagram, and searchable/filterable tables for workflows, agents,
 * squads, the constitution, and rules. SINAPSE B&W aesthetic. No build step,
 * no server — open the file.
 *
 * @module core/atlas/render-html
 */

'use strict';

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderAtlasHtml(d) {
  const c = d.counts;
  const stamp = d.generatedAt ? `Generated ${esc(d.generatedAt)}` : '';
  const dataJson = JSON.stringify(d).replace(/</g, '\\u003c');

  const stat = (n, label) => `<div class="stat"><b>${n}</b><span>${label}</span></div>`;

  const flowsSection = (d.flows || [])
    .map(
      (f) => `<h3 style="margin:1.6rem 0 .3rem">${esc(f.title)}</h3>
    <p class="lead">${esc(f.purpose)}</p>
    <div class="mermaid">
${esc(f.mermaid)}
    </div>`,
    )
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>SINAPSE · Framework Operating Atlas</title>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<style>
  :root{
    --bg:#0a0a0a; --fg:#f5f5f0; --mut:#8a8a85; --line:#222; --card:#121212; --accent:#f5f5f0;
    --font:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
    --mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--font);line-height:1.5;
    background-image:radial-gradient(rgba(255,255,255,.025) 1px,transparent 1px);background-size:3px 3px}
  .wrap{max-width:min(1400px,94vw);margin:0 auto;padding:clamp(1.5rem,4vw,3rem) 0 5rem}
  h1{font-size:clamp(1.6rem,4vw,2.6rem);font-weight:800;letter-spacing:-.02em;margin:0 0 .25rem}
  .sub{color:var(--mut);font-family:var(--mono);font-size:.8rem;margin-bottom:2rem}
  .stats{display:flex;flex-wrap:wrap;gap:.6rem;margin-bottom:2rem}
  .stat{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:.7rem 1rem;min-width:96px}
  .stat b{display:block;font-size:1.5rem;font-weight:800;font-family:var(--mono)}
  .stat span{color:var(--mut);font-size:.72rem;text-transform:uppercase;letter-spacing:.06em}
  nav{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1.5rem;position:sticky;top:0;
    background:linear-gradient(var(--bg),var(--bg) 70%,transparent);padding:.6rem 0;z-index:5}
  nav button{background:transparent;color:var(--mut);border:1px solid var(--line);border-radius:999px;
    padding:.35rem .9rem;font-family:var(--mono);font-size:.78rem;cursor:pointer;transition:.15s}
  nav button:hover{color:var(--fg);border-color:#444}
  nav button.on{background:var(--fg);color:var(--bg);border-color:var(--fg)}
  section{display:none;animation:fade .2s ease}
  section.on{display:block}
  @keyframes fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
  h2{font-size:1.2rem;font-weight:700;margin:0 0 1rem;letter-spacing:-.01em}
  .mermaid{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem}
  .ctrl{display:flex;gap:.6rem;flex-wrap:wrap;margin-bottom:1rem}
  input,select{background:var(--card);color:var(--fg);border:1px solid var(--line);border-radius:8px;
    padding:.5rem .8rem;font-family:var(--mono);font-size:.82rem}
  input{flex:1;min-width:200px}
  table{width:100%;border-collapse:collapse;font-size:.82rem}
  th,td{text-align:left;padding:.55rem .7rem;border-bottom:1px solid var(--line);vertical-align:top}
  th{color:var(--mut);font-family:var(--mono);font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;
    position:sticky;top:3.4rem;background:var(--bg);cursor:pointer}
  td code{font-family:var(--mono);font-size:.78rem;color:var(--fg);background:#1c1c1c;padding:.1rem .35rem;border-radius:4px}
  .tag{font-family:var(--mono);font-size:.68rem;padding:.1rem .45rem;border-radius:999px;border:1px solid var(--line);color:var(--mut)}
  .nn{color:#fff;border-color:#555}
  .count{color:var(--mut);font-family:var(--mono);font-size:.75rem;margin-bottom:.6rem}
  p.lead{color:var(--mut);max-width:70ch;margin:0 0 1.2rem}
  a{color:var(--fg)}
</style>
</head>
<body>
<div class="wrap">
  <h1>SINAPSE · Framework Operating Atlas</h1>
  <div class="sub">How the framework works — routing, models, constitution, workflows, agents, squads. ${stamp}</div>
  <div class="stats">
    ${stat(c.squads, 'squads')}
    ${stat(c.agentsTotal, 'agents')}
    ${stat(c.orqx, 'orchestrators')}
    ${stat(c.workflowsTotal, 'workflows')}
    ${stat(c.articles, 'articles')}
    ${stat(c.rules, 'rules')}
  </div>

  <nav id="nav"></nav>

  <section id="s-model" class="on">
    <h2>Operating model</h2>
    <p class="lead">Every briefing flows through the same spine: the Imperator routes to a squad orchestrator or framework agent, the doc-first pipeline turns intent into PRD → Epic → Story → Spec, gates block code without docs, then implementation → QA → ship.</p>
    <div class="mermaid">
flowchart TD
    U[User briefing] --> I[Imperator · master orchestrator]
    I -->|classify intent + project type| R{Route}
    R -->|domain work| SQ[Squad orchestrator -orqx]
    R -->|framework dev| FW[Framework agents]
    SQ --> SP[Squad specialist]
    FW --> DOC[Doc-first pipeline]
    SP --> DOC
    DOC -->|PRD - Epic - Story - Spec| GATE{{Gates}}
    GATE -->|pass| EXEC[Implementation]
    GATE -->|fail| BLOCK[Blocked: produce docs first]
    EXEC --> QA[Quality gate] --> SHIP[Push / PR]
    </div>
  </section>

  <section id="s-flows">
    <h2>Framework flows</h2>
    <p class="lead">How each mechanism of the framework runs — routing, models, doc-first enforcement, gates, project classification. The meta-workflows behind the machine.</p>
    ${flowsSection}
  </section>

  <section id="s-constitution"><h2>Constitution · ${c.articles} articles</h2><div id="t-constitution"></div></section>
  <section id="s-workflows"><h2>Workflows · ${c.workflowsTotal}</h2>
    <div class="ctrl"><input id="q-workflows" placeholder="search workflows…"><select id="f-workflows-src"><option value="">all sources</option><option value="framework">framework</option><option value="squad">squad</option></select></div>
    <div class="count" id="c-workflows"></div><div id="t-workflows"></div></section>
  <section id="s-agents"><h2>Agents · ${c.agentsTotal}</h2>
    <div class="ctrl"><input id="q-agents" placeholder="search agents…"><select id="f-agents-squad"></select><label style="color:var(--mut);font-family:var(--mono);font-size:.78rem;display:flex;align-items:center;gap:.4rem"><input type="checkbox" id="f-agents-orqx" style="flex:none">orchestrators only</label></div>
    <div class="count" id="c-agents"></div><div id="t-agents"></div></section>
  <section id="s-squads"><h2>Squads · ${c.squads}</h2><div id="t-squads"></div></section>
  <section id="s-rules"><h2>Rules · ${c.rules}</h2><div id="t-rules"></div></section>
</div>

<script id="atlas-data" type="application/json">${dataJson}</script>
<script>
const D = JSON.parse(document.getElementById('atlas-data').textContent);
// startOnLoad:false — Mermaid renders diagrams in display:none sections at zero
// width. We render each section's diagrams the first time its tab is shown.
try{ mermaid.initialize({startOnLoad:false,theme:'dark',themeVariables:{background:'#121212',primaryColor:'#1c1c1c',primaryTextColor:'#f5f5f0',lineColor:'#555'}}); }catch(e){}
function renderDiagrams(sectionId){
  try{
    const nodes=[...document.querySelectorAll('#'+sectionId+' .mermaid:not([data-processed])')];
    if(nodes.length&&window.mermaid&&mermaid.run) mermaid.run({nodes});
  }catch(e){}
}

const TABS=[['s-model','Operating model'],['s-flows','Flows'],['s-constitution','Constitution'],['s-workflows','Workflows'],['s-agents','Agents'],['s-squads','Squads'],['s-rules','Rules']];
const nav=document.getElementById('nav');
TABS.forEach(([id,label],i)=>{const b=document.createElement('button');b.textContent=label;if(i===0)b.className='on';
  b.onclick=()=>{document.querySelectorAll('nav button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
    document.querySelectorAll('section').forEach(s=>s.classList.remove('on'));document.getElementById(id).classList.add('on');
    renderDiagrams(id);};
  nav.appendChild(b);});
renderDiagrams('s-model'); // initial visible tab

function tbl(cols,rows){return '<table><thead><tr>'+cols.map(c=>'<th>'+c+'</th>').join('')+'</tr></thead><tbody>'+
  rows.map(r=>'<tr>'+r.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</tbody></table>';}
// Data cells come from atlas-data.json (framework registry, mutable via PR) — escape before innerHTML.
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const code=s=>'<code>'+esc(s||'')+'</code>';
const sev=s=>'<span class="tag'+(/NON-NEGOTIABLE/.test(s)?' nn':'')+'">'+esc(s)+'</span>';

document.getElementById('t-constitution').innerHTML=tbl(['Art.','Principle','Severity'],
  D.articles.map(a=>[esc(a.number),esc(a.title),sev(a.severity)]));

document.getElementById('t-squads').innerHTML=tbl(['Squad','Name','Agents','Workflows','Orchestrators'],
  D.squads.map(s=>[code(s.id),esc(s.name),esc(s.agents),esc(s.workflows),(s.orqx||[]).map(code).join(' ')||'—']));

document.getElementById('t-rules').innerHTML=tbl(['Rule','Governs'],
  D.rules.map(r=>[code(r.id),esc(r.title)]));

// Workflows (search + source filter)
function renderWorkflows(){
  const q=(document.getElementById('q-workflows').value||'').toLowerCase();
  const src=document.getElementById('f-workflows-src').value;
  const rows=D.workflows.filter(w=>{
    const isFw=w.source==='framework';
    if(src==='framework'&&!isFw)return false; if(src==='squad'&&isFw)return false;
    return !q||(w.id+' '+w.name+' '+(w.description||'')+' '+(w.squad||'')).toLowerCase().includes(q);
  });
  document.getElementById('c-workflows').textContent=rows.length+' of '+D.workflows.length;
  document.getElementById('t-workflows').innerHTML=tbl(['Workflow','Source','Type','Description'],
    rows.map(w=>[code(w.id),w.squad?code(w.squad):'<span class="tag">framework</span>',esc(w.type||'—'),esc(w.description||'—')]));
}
['q-workflows','f-workflows-src'].forEach(id=>document.getElementById(id).addEventListener('input',renderWorkflows));

// Agents (search + squad filter + orqx toggle)
const squads=[...new Set(D.agents.map(a=>a.squad))].sort();
const sel=document.getElementById('f-agents-squad');
sel.innerHTML='<option value="">all squads</option>'+squads.map(s=>'<option>'+esc(s)+'</option>').join('');
function renderAgents(){
  const q=(document.getElementById('q-agents').value||'').toLowerCase();
  const sq=sel.value; const onlyOrqx=document.getElementById('f-agents-orqx').checked;
  const rows=D.agents.filter(a=>{
    if(sq&&a.squad!==sq)return false; if(onlyOrqx&&!a.isOrqx)return false;
    return !q||(a.id+' '+(a.persona||'')+' '+(a.role||a.title||'')+' '+a.squad).toLowerCase().includes(q);
  });
  document.getElementById('c-agents').textContent=rows.length+' of '+D.agents.length;
  document.getElementById('t-agents').innerHTML=tbl(['Agent','Persona','Squad','Role',''],
    rows.map(a=>[code(a.id),esc(a.persona||'—'),code(a.squad),esc(a.role||a.title||'—'),a.isOrqx?'<span class="tag nn">orqx</span>':'']));
}
['q-agents','f-agents-orqx'].forEach(id=>document.getElementById(id).addEventListener('input',renderAgents));
sel.addEventListener('change',renderAgents);

renderWorkflows();renderAgents();
</script>
</body>
</html>`;
}

module.exports = { renderAtlasHtml };
