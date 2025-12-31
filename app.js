/* Akshat Network Hub SPA
   - Predefined databases are frozen (not expandable during runtime)
   - Session conversation is separate and ephemeral
   - No external APIs
*/

// ---------- Predefined Databases (Immutable) ----------
const PROJECTS = Object.freeze([
  {
    id: 'p1',
    title: 'Akshat Portfolio',
    description: 'A personalized Portfolio showcasing projects and skills.',
    tags: ['portfolio', 'akshat prasad', 'about me', 'about akshat'],
    image: 'http://student.mdu.ac.in/Student_Biometrics/881238_Snap_10-4-2024_305%20AKSHAT%20P.jpg',
    url: 'https://akshat-881236.github.io/Portfolio-881236/',
    details: 'This project is a personal portfolio website built using HTML, CSS, and JavaScript to showcase skills, projects, and contact information.'
  },
  {
    id: 'p2',
    title: 'My Profile Dashboard',
    description: 'A dashboard displaying my profile information and activities.',
    tags: ['profile', 'dashboard', 'akshat info'],
    image: 'http://student.mdu.ac.in/Student_Biometrics/881238_Snap_10-4-2024_305%20AKSHAT%20P.jpg',
    url: 'https://akshat-881236.github.io/LocalRepo/',
    details: 'This dashboard provides an overview of my profile, including recent activities, statistics, and personal information.'
  },
  {
    id: 'p3',
    title: 'Key of Success',
    description: 'Key of Success is a platform use for managing Student Records.',
    tags: ['student records','management system','akshat prasad', 'KOS', 'key of success'],
    image: 'https://akshat-881236.github.io/TrackerJS/Assets/KOSLogo.png',
    url: 'https://akshat-881236.github.io/Key-of-Success/',
    details: 'Key of Success is a Student Record Management System that helps in organizing and managing student data efficiently.'
  },
  {
    id: 'p4',
    title: 'Sitemap Generator XML',
    description: 'A tool to generate sitemap XML files for websites to improve SEO that is created by Akshat Prasad.',
    tags: ['sitemap', 'SEO', 'xml', 'akshat prasad'],
    image: 'https://akshat-881236.github.io/TrackerJS/Assets/icon-128.png',
    url: 'https://akshat-881236.github.io/SitemapGeneratorXML/',
    details: 'This project is a Sitemap Generator that creates XML files to help search engines index websites more effectively. It is built using JavaScript and provides an easy-to-use interface for generating sitemaps.'
  },
  {
    id: 'p5',
    title: 'TrackerJS',
    description: 'TrackerJS is a web analytics tool that tracks user interactions on websites.',
    tags: ['analytics', 'tracker', 'web tracking', 'akshat prasad'],
    image: 'http://student.mdu.ac.in/Student_Biometrics/881238_Snap_10-4-2024_305%20AKSHAT%20P.jpg',
    url: 'https://akshat-881236.github.io/TrackerJS/',
    details: 'TrackerJS is a lightweight web analytics tool that helps website owners track user interactions, page views, and other important metrics to improve website performance and user experience.'
  },
  {
    id: 'p6',
    title: 'Akshat Journal Blog',
    description: 'My personal blog where I share thoughts on technology, programming, and life experiences.',
    tags: ['blog', 'personal', 'akshat prasad', 'akshat journal', 'thoughts'],
    image: 'https://akshat-881236.github.io/TrackerJS/Assets/AKNH/icon-192.png',
    url: 'https://akshat-881236.github.io/sitemapjs/',
    details: 'Akshat Journal is a personal blog platform where I share my insights on various topics including technology trends, programming tutorials, and life experiences. Built with simplicity and readability in mind.'
  }
]);
Object.freeze(PROJECTS);

// Predefined Link Sections (for AJAX-like load)
const LINK_SECTIONS = Object.freeze([
  { id: 'ls1', title: 'Docs', links: [
    { title: 'README File', href: '#readme' },
    { title: 'CONTRIBUTING', href: '#contrib' }
  ]},
  { id: 'ls2', title: 'Community', links: [
    { title: 'Discussions', href: '#discuss' },
    { title: 'Issues', href: '#issues' }
  ]},
  { id: 'ls3', title: 'Resources', links: [
    { title: 'Portfolio', href: 'https://akshat-881236.github.io/Portfolio-881236/' },
    { title: 'HtmlZone', href: 'https://akshat-881236.github.io/HtmlZone/' }
  ]}
]);
Object.freeze(LINK_SECTIONS);

// Predefined DBs for AI
const CONVERSATION_DB = Object.freeze([
  {id:'c1',user:'How to use AkshatAI?', assistant:'You can ask about projects, get help with navigation, or open project views.'}
]);
const COMMAND_DB = Object.freeze([
  {cmd:'open project', desc:'Opens a project in the viewer (iframe)'},
  {cmd:'show links', desc:'Displays the link section and scrolls to a category'}
]);
const NAVIGATION_DB = Object.freeze([
  {route:'home', label:'Home'},
  {route:'readme', label:'License / README.md'},
  {route:'links', label:'Links'},
  {route:'daily', label:'Daily Thoughts'}
]);
const HELP_DB = Object.freeze([
  {topic:'search', info:'Use the search input to find projects by title or description.'},
  {topic:'filter', info:'Click tags to filter projects by topic.'}
]);
const KNOWLEDGE_DB = Object.freeze([
  {topic:'multilingual', info:'We produce 4 language versions for user queries: en, es, fr, de.'}
]);

Object.freeze(CONVERSATION_DB);
Object.freeze(COMMAND_DB);
Object.freeze(NAVIGATION_DB);
Object.freeze(HELP_DB);
Object.freeze(KNOWLEDGE_DB);

// Predefined README (Markdown)
const README_MD = `
# Akshat Network Hub

A centralized hub for projects and collections.

## Goals

- Collect and present projects
- Provide a local AI helper (AkshatAI)
- Showcase daily thoughts

### MIT  Licens

Copyright (c) 2025 Akshat Prasad

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

// Predefined daily thoughts (for streaming)
const DAILY_THOUGHTS = Object.freeze([
  "Today I will refine the AkshatAI responses and make quick flows.",
  "Focus on mobile-first UX and small performance wins.",
  "Iterate on link accessibility and search heuristics."
]);

// ---------- Session structures (mutable, ephemeral) ----------
let sessionConversation = []; // stores user session messages + generated multilingual entries

// ---------- Utilities ----------
const $ = (sel, ctx=document)=>ctx.querySelector(sel);
const $$ = (sel, ctx=document)=>Array.from(ctx.querySelectorAll(sel));

function mkSVG(icon){
  // small set of icons as inline svg strings (by name)
  const icons = {
    eye:`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z"/></svg>`,
    info:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M11 9h2V7h-2v2zm0 8h2v-6h-2v6zM12 2a10 10 0 100 20 10 10 0 000-20z"/></svg>`,
    link:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M3.9 12a5 5 0 017.1-7.1l1.4 1.4-1.4 1.4-1.4-1.4A3 3 0 004.6 12 3 3 0 007 15.4l1.4-1.4 1.4 1.4L8.3 16.8A5 5 0 013.9 12zM20.1 12a5 5 0 01-7.1 7.1l-1.4-1.4 1.4-1.4 1.4 1.4a3 3 0 004.5-4.5l-1.4-1.4-1.4 1.4-1.4-1.4 1.4-1.4A5 5 0 0120.1 12z"/></svg>`,
    search:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M15.5 14h-.8l-.3-.3A6.5 6.5 0 0016 9.5 6.5 6.5 0 109.5 16c1.4 0 2.7-.5 3.7-1.4l.3.3v.8l4.3 4.2 1.5-1.5L15.5 14zM9.5 14A4.5 4.5 0 119.5 5a4.5 4.5 0 010 9z"/></svg>`,
    filter:`<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M10 18h4v-2h-4v2zm-7-8v2h18v-2H3zm3-6v2h12V4H6z"/></svg>`
  };
  return icons[icon] || '';
}

function escapedHtml(s){ return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

// Simple markdown -> semantic HTML (supports #, ##, ###, lists, paragraphs)
function renderMarkdown(md){
  const lines = md.trim().split('\n');
  let html = '', inList = false;
  for(let raw of lines){
    const line = raw.trim();
    if(!line){ if(inList){ html += '</ul>'; inList=false;} html += '<p></p>'; continue; }
    if(line.startsWith('### ')){ if(inList){ html += '</ul>'; inList=false;} html += `<h3>${escapedHtml(line.slice(4))}</h3>`; continue; }
    if(line.startsWith('## ')){ if(inList){ html += '</ul>'; inList=false;} html += `<h2>${escapedHtml(line.slice(3))}</h2>`; continue; }
    if(line.startsWith('# ')){ if(inList){ html += '</ul>'; inList=false;} html += `<h1>${escapedHtml(line.slice(2))}</h1>`; continue; }
    if(line.startsWith('- ')){ if(!inList){ html += '<ul>'; inList=true;} html += `<li>${escapedHtml(line.slice(2))}</li>`; continue; }
    // fallback paragraph
    if(inList){ html += '</ul>'; inList=false; }
    html += `<p>${escapedHtml(line)}</p>`;
  }
  if(inList) html += '</ul>';
  return html;
}

// ---------- Renderers ----------
function renderTagControls() {
  const container = $('#tag-container');
  const allTags = Array.from(new Set(PROJECTS.flatMap(p=>p.tags)));
  container.innerHTML = allTags.map(t=>`<button class="tag" data-tag="${t}">${t}</button>`).join('');
  container.addEventListener('click', (e)=>{
    const btn = e.target.closest('.tag');
    if(!btn) return;
    btn.classList.toggle('active');
    applyFilters();
  });
}

function renderProjects(list){
  const grid = $('#projects');
  if(list.length === 0) { grid.innerHTML = '<p class="muted">No projects found.</p>'; return; }
  grid.innerHTML = list.map(p=>projectCardHtml(p)).join('');
  // Attach card button listeners
  grid.querySelectorAll('.card').forEach(card=>{
    card.querySelectorAll('.action-btn').forEach(btn=>{
      btn.addEventListener('click', onCardAction);
    });
  });
}

function projectCardHtml(p){
  const img = p.image ? `<img src="${p.image}" alt="${escapedHtml(p.title)}">` : `<div class="img-placeholder" style="width:72px;height:72px;border-radius:8px;background:linear-gradient(180deg,#0b6efd,#0635a6);display:flex;align-items:center;justify-content:center;color:white;font-weight:600">${p.title[0]}</div>`;
  return `
  <article class="card" data-id="${p.id}">
    <div class="meta">
      ${img}
      <div style="flex:1">
        <h4>${escapedHtml(p.title)}</h4>
        <p>${escapedHtml(p.description)}</p>
        <div style="margin-top:6px;color:var(--muted);font-size:.85rem">${p.tags.map(t=>`<span class="tag-mini" style="margin-right:6px">${t}</span>`).join('')}</div>
      </div>
    </div>
    <div class="card-actions" role="toolbar" aria-label="Project actions">
      <button class="action-btn" data-action="filter" title="Filter by project tag">${mkSVG('filter')}</button>
      <button class="action-btn" data-action="search" title="Search within project">${mkSVG('search')}</button>
      <button class="action-btn" data-action="view" title="View project">${mkSVG('eye')}</button>
      <button class="action-btn" data-action="info" title="Info">${mkSVG('info')}</button>
      <button class="action-btn" data-action="visit" title="Visit project">${mkSVG('link')}</button>
    </div>
  </article>
  `;
}

// ---------- Actions ----------
function onCardAction(e){
  const btn = e.currentTarget;
  const card = btn.closest('.card');
  const id = card.dataset.id;
  const action = btn.dataset.action;
  const project = PROJECTS.find(p=>p.id===id);
  if(!project) return;
  switch(action){
    case 'filter':
      // toggle first tag filter from the card
      const tag = project.tags[0];
      const tagBtns = Array.from($$('#tag-container .tag'));
      const match = tagBtns.find(tb=>tb.dataset.tag === tag);
      if(match) { match.classList.toggle('active'); applyFilters(); }
      break;
    case 'search':
      $('#global-search').value = project.title;
      applyFilters();
      break;
    case 'view':
      openViewer(project);
      break;
    case 'info':
      openInfoModal(project);
      break;
    case 'visit':
      window.open(project.url,'_blank','noopener');
      break;
  }
}

// Filter logic: selected tags are ANDed; search by title/description
function applyFilters(){
  const activeTags = $$('#tag-container .tag.active').map(b=>b.dataset.tag);
  const q = ($('#global-search').value || '').trim().toLowerCase();
  let list = PROJECTS.filter(p=>{
    let ok=true;
    if(activeTags.length){
      ok = activeTags.every(t=>p.tags.includes(t));
    }
    if(ok && q){
      ok = (p.title + ' ' + p.description + ' ' + p.tags.join(' ')).toLowerCase().includes(q);
    }
    return ok;
  });
  renderProjects(list);
}

// Viewer modal
function openViewer(project){
  const mr = $('#modal-root');
  mr.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3>${escapedHtml(project.title)}</h3>
          <button id="close-modal" class="btn icon">&times;</button>
        </div>
        <div style="margin-top:12px">
          <iframe src="${project.url}" style="width:100%;height:420px;border-radius:8px;border:0"></iframe>
        </div>
      </div>
    </div>
  `;
  $('#close-modal').addEventListener('click', ()=>{ mr.innerHTML=''; });
}

// Info modal (semantic HTML)
function openInfoModal(project){
  const mr = $('#modal-root');
  mr.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title-${project.id}">
      <div class="modal-card">
        <h3 id="modal-title-${project.id}">${escapedHtml(project.title)}</h3>
        <section>
          <h4>Description</h4>
          <p>${escapedHtml(project.description)}</p>
        </section>
        <section>
          <h4>Details</h4>
          <p>${escapedHtml(project.details)}</p>
        </section>
        <section>
          <h4>Tags</h4>
          <p>${project.tags.map(t=>`<span class="tag" style="display:inline-block;margin-right:6px">${t}</span>`).join('')}</p>
        </section>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
          <a class="btn primary" href="${project.url}" target="_blank" rel="noopener">Visit</a>
          <button id="close-modal-2" class="btn">Close</button>
        </div>
      </div>
    </div>
  `;
  $('#close-modal-2').addEventListener('click', ()=>{ mr.innerHTML=''; });
}

// ---------- Link carousel (AJAX-like load) ----------
function renderLinkCarousel(){
  const track = $('#carousel-track');
  track.innerHTML = '';
  LINK_SECTIONS.forEach(section=>{
    const div = document.createElement('div');
    div.className='carousel-item';
    div.innerHTML = `<strong>${escapedHtml(section.title)}</strong><ul>${section.links.map(l=>`<li><a href="${l.href}" data-link="${l.title}">${escapedHtml(l.title)}</a></li>`).join('')}</ul>`;
    track.appendChild(div);
  });

  const leftBtn = document.querySelector('.carousel-btn.left');
  const rightBtn = document.querySelector('.carousel-btn.right');
  leftBtn.addEventListener('click', ()=>{ track.scrollBy({left:-260,behavior:'smooth'}); });
  rightBtn.addEventListener('click', ()=>{ track.scrollBy({left:260,behavior:'smooth'}); });

  track.addEventListener('click', (e)=>{
    const a = e.target.closest('a[data-link]');
    if(!a) return;
    e.preventDefault();
    const details = $('#link-details');
    details.innerHTML = `<h4>${escapedHtml(a.dataset.link)}</h4><p>Links inside this category are displayed here. (AJAX-like behavior simulated)</p>`;
  });
}

// ---------- README renderer ----------
function showReadme(){
  const area = $('#readme-area');
  area.innerHTML = renderMarkdown(README_MD);
  area.hidden = false;
  // hide other sections
  hideSectionsExcept(area);
}

// Hide others
function hideSectionsExcept(el){
  ['#readme-area','#daily-area'].forEach(sel=>{
    const s = $(sel);
    if(!s) return;
    s.hidden = (s !== el);
  });
}

// ---------- Daily thoughts streaming into iframe ----------
function startDailyStream(){
  const area = $('#daily-area');
  area.hidden = false;
  hideSectionsExcept(area);
  const iframe = $('#daily-iframe');
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(`<html><head><style>body{font-family:Inter,Arial;color:#061426;padding:12px;background:#fff}</style></head><body><div id="stream"></div></body></html>`);
  iframeDoc.close();
  const streamEl = iframeDoc.getElementById('stream');

  // stream each thought with typing effect
  let idx=0;
  function typeNext(){
    if(idx >= DAILY_THOUGHTS.length) return;
    const text = DAILY_THOUGHTS[idx++];
    const p = iframeDoc.createElement('p');
    streamEl.appendChild(p);
    let i=0;
    const t = setInterval(()=>{
      p.textContent = text.slice(0, ++i);
      iframe.scrollTo(0, iframe.scrollHeight);
      if(i >= text.length){ clearInterval(t); setTimeout(typeNext, 800); }
    }, 28);
  }
  typeNext();
}

// ---------- AkshatAI (local) ----------
function openAI(panelFromSidebar=false){
  const panel = $('#ai-panel');
  panel.hidden = false;
  panelFromSidebar && panel.scrollIntoView({behavior:'smooth', block:'end'});
  $('#ai-input').focus();
  renderAIHistory();
}

function closeAI(){
  $('#ai-panel').hidden = true;
}

function renderAIHistory(){
  const body = $('#ai-body');
  body.innerHTML = '';
  // show session conversation
  sessionConversation.forEach(msg=>{
    const div = document.createElement('div');
    div.className = 'msg ' + (msg.role==='user' ? 'user' : 'assistant');
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = `<small style="display:block;color:var(--muted);font-size:.75rem">${msg.lang.toUpperCase()}</small>${escapedHtml(msg.text)}`;
    div.appendChild(bubble);
    body.appendChild(div);
  });
  body.scrollTop = body.scrollHeight;
}

// Simple translator (simulation) producing four variants (not real translation)
function simulateTranslations(text){
  // This intentionally does not call external APIs. We create language variants by tagging and simple word maps.
  const map = {
    es: {'help':'ayuda','project':'proyecto','open':'abrir','view':'ver'},
    fr: {'help':'aide','project':'projet','open':'ouvrir','view':'voir'},
    de: {'help':'Hilfe','project':'Projekt','open':'öffnen','view':'ansehen'}
  };
  const base = text;
  return {
    en: base,
    es: replaceWords(base,map.es),
    fr: replaceWords(base,map.fr),
    de: replaceWords(base,map.de)
  };
}
function replaceWords(s,map){
  let out = s;
  for(const k in map){
    const re = new RegExp('\\b'+k+'\\b','ig');
    out = out.replace(re, map[k]);
  }
  return out;
}

// Compose an assistant reply using simple DB lookup heuristics (no API)
function generateAssistantReply(userText){
  const lt = userText.toLowerCase();
  if(lt.includes('search') || lt.includes('find')) return "Use the search field at the top to filter projects. Try keywords like 'chat' or 'iframe'.";
  if(lt.includes('open') && lt.includes('project')) return "Use the View (eye) action on a project card to open it in a viewer.";
  if(lt.includes('help') || lt.includes('assist')) return HELP_DB[0].info;
  // fallback choose a knowledge DB item
  return KNOWLEDGE_DB[0].info;
}

// When user sends a message to AI: store multilingual variants to session (not changing frozen DBs)
function handleAISend(text){
  // create translations
  const trans = simulateTranslations(text);
  // create session entries: user message as 4 languages, assistant response as 4 languages
  const userEntries = Object.entries(trans).map(([lang,txt])=>({role:'user',lang,text:txt,timestamp:Date.now()}));
  const replyText = generateAssistantReply(text);
  const replyTrans = simulateTranslations(replyText);
  const assistantEntries = Object.entries(replyTrans).map(([lang,txt])=>({role:'assistant',lang,text:txt,timestamp:Date.now()}));

  // add to session conversation (this array is mutable and session-scoped)
  sessionConversation.push(...userEntries);
  sessionConversation.push(...assistantEntries);
  renderAIHistory();
}

// ---------- Routing / SPA behavior ----------
function activateRoute(route){
  // simple switch to show sections
  $$('.nav-link').forEach(a=>a.classList.toggle('active', a.dataset.route===route));
  if(route==='home'){
    $('#readme-area').hidden = true;
    $('#daily-area').hidden = true;
    $('#projects').scrollIntoView({behavior:'smooth'});
  } else if(route==='readme'){
    showReadme();
  } else if(route==='links'){
    // show link section (it's always present)
    $('#link-section').scrollIntoView({behavior:'smooth'});
  } else if(route==='daily'){
    startDailyStream();
  }
}

// ---------- Init ----------
function init(){
  renderTagControls();
  renderProjects(PROJECTS);
  renderLinkCarousel();

  // global search handler
  $('#global-search').addEventListener('input', ()=>{ applyFilters(); });

  // nav links
  $$('.nav-link').forEach(a=>{
    a.addEventListener('click', (ev)=>{
      ev.preventDefault();
      activateRoute(a.dataset.route);
    });
  });

  // AI open/close
  $('#open-ai').addEventListener('click', ()=>openAI());
  $('#open-ai-sidebar').addEventListener('click', ()=>openAI(true));
  $('#close-ai').addEventListener('click', ()=>closeAI());
  $('#open-ai-sidebar').addEventListener('keydown', (e)=>{ if(e.key==='Enter') openAI(true); });

  // AI form submit
  $('#ai-form').addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const txt = $('#ai-input').value.trim();
    if(!txt) return;
    $('#ai-input').value='';
    handleAISend(txt);
  });

  // Filter toggle button toggles tag area
  $('#filter-toggle').addEventListener('click', (e)=>{
    const pressed = e.currentTarget.getAttribute('aria-pressed') === 'true';
    e.currentTarget.setAttribute('aria-pressed', (!pressed).toString());
    document.getElementById('tag-container').style.display = pressed ? 'flex' : 'none';
  });

  // initial UI state
  document.getElementById('tag-container').style.display = 'flex';
  // show home
  activateRoute('home');
}

document.addEventListener('DOMContentLoaded', init);