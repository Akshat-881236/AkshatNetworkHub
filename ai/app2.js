/* =========================================================
   AKSHAT NETWORK HUB AI
   ULTIMATE ADVANCED APP.JS
   VERSION : FIREFOX OPTIMIZED + STREAMING + SEO META
========================================================= */

/* =========================================================
   CONFIG
========================================================= */

const API_URL =
  "https://akshatai-backend.akshatpsd2005.workers.dev/api/chat";

const MAX_RESPONSE_CHARS = 10000;

const STREAM_MODEL =
  "meta/llama-3.1-8b-instruct";

/* =========================================================
   DOM
========================================================= */

const chatContainer =
  document.getElementById("chatContainer");

const promptInput =
  document.getElementById("promptInput");

const sendBtn =
  document.getElementById("sendBtn");

const historyList =
  document.getElementById("historyList");

const toast =
  document.getElementById("toast");

const sidebar =
  document.getElementById("sidebar");

const overlay =
  document.getElementById("overlay");

const menuBtn =
  document.getElementById("menuBtn");

const closeSidebarBtn =
  document.getElementById(
    "closeSidebarBtn"
  );

const previewModal =
  document.getElementById(
    "previewModal"
  );

const previewFrame =
  document.getElementById(
    "previewFrame"
  );

const closePreviewBtn =
  document.getElementById(
    "closePreviewBtn"
  );

const imageModal =
  document.getElementById(
    "imageModal"
  );

const modalImage =
  document.getElementById(
    "modalImage"
  );

const historySearch =
  document.getElementById(
    "historySearch"
  );

/* =========================================================
   GLOBALS
========================================================= */

let messages = [];

let db;

let isGenerating = false;

/* =========================================================
   INIT
========================================================= */

window.addEventListener(
  "DOMContentLoaded",
  async () => {

    initIndexedDB();

    loadChatHistory();

    initEvents();

    initQuickButtons();

    initSwipe();

    detectOnlineStatus();

    injectRuntimeMeta(
      "Akshat Network Hub AI",
      "AI Assistant powered by NVIDIA NIM"
    );

  }
);

/* =========================================================
   EVENTS
========================================================= */

function initEvents(){

  sendBtn?.addEventListener(
    "click",
    sendMessage
  );

  promptInput?.addEventListener(
    "keydown",
    handleEnterSend
  );

  promptInput?.addEventListener(
    "input",
    autoResize
  );

  menuBtn?.addEventListener(
    "click",
    openSidebar
  );

  closeSidebarBtn?.addEventListener(
    "click",
    closeSidebar
  );

  overlay?.addEventListener(
    "click",
    closeSidebar
  );

  closePreviewBtn?.addEventListener(
    "click",
    closePreview
  );

  historySearch?.addEventListener(
    "input",
    searchHistory
  );

  imageModal?.addEventListener(
    "click",
    () => {

      imageModal.classList.remove(
        "active"
      );

    }
  );

}

/* =========================================================
   AUTO RESIZE
========================================================= */

function autoResize(){

  promptInput.style.height =
    "auto";

  promptInput.style.height =
    promptInput.scrollHeight +
    "px";

}

/* =========================================================
   ENTER SEND
========================================================= */

function handleEnterSend(e){

  if(
    e.key === "Enter" &&
    !e.shiftKey
  ){

    e.preventDefault();

    sendMessage();

  }

}

/* =========================================================
   QUICK BUTTONS
========================================================= */

function initQuickButtons(){

  document.addEventListener(
    "click",
    async (e) => {

      const btn =
        e.target.closest(
          ".quick-btn"
        );

      if(!btn) return;

      const prompt =

        btn.dataset.prompt ||

        btn.dataset.message ||

        btn.innerText ||

        "";

      if(!prompt.trim()) return;

      promptInput.value =
        prompt.trim();

      autoResize();

      await delay(50);

      sendMessage();

    }
  );

}

/* =========================================================
   MAIN SEND MESSAGE
========================================================= */

async function sendMessage(){

  if(isGenerating) return;

  const prompt =
    promptInput.value.trim();

  if(!prompt) return;

  isGenerating = true;

  removeWelcome();

  /* USER MESSAGE */

  addMessage(
    prompt,
    "user"
  );

  messages.push({

    role:"user",

    content:prompt

  });

  /* META */

  injectRuntimeMeta(
    prompt,
    "Akshat Network Hub AI Chat"
  );

  injectBreadcrumbs(prompt);

  /* MAGIC COMMANDS */

  if(
    await handleMagicCommands(
      prompt
    )
  ){

    promptInput.value = "";

    isGenerating = false;

    return;

  }

  /* RESET INPUT */

  promptInput.value = "";

  promptInput.style.height =
    "60px";

  /* AI CONTAINER */

  const aiDiv =
    document.createElement("div");

  aiDiv.className =
    "message ai";

  const streamText =
    document.createElement("div");

  streamText.className =
    "streaming-text";

  aiDiv.appendChild(
    streamText
  );

  chatContainer.appendChild(
    aiDiv
  );

  scrollBottom();

  let fullResponse = "";

  let pendingChunk = "";

  try{

    const response =
      await fetch(API_URL, {

        method:"POST",

        headers:{
          "Content-Type":
            "application/json"
        },

        body:JSON.stringify({

          message:prompt,

          messages:messages,

          stream:true,

          model:
            "meta/llama-3.1-8b-instruct",

          temperature:0.7,

          max_tokens:1024,

          top_p:0.9

        })

      });

    if(!response.ok){

      const errText =
        await response.text();

      throw new Error(
        errText ||
        "Streaming Failed"
      );

    }

    const reader =
      response.body.getReader();

    const decoder =
      new TextDecoder();

    while(true){

      const {
        value,
        done
      } = await reader.read();

      if(done) break;

      pendingChunk +=
        decoder.decode(
          value,
          {
            stream:true
          }
        );

      const lines =
        pendingChunk.split("\n");

      pendingChunk =
        lines.pop() || "";

      for(const line of lines){

        if(
          !line.startsWith("data:")
        ) continue;

        const jsonStr =
          line.replace(
            "data:",
            ""
          ).trim();

        if(
          jsonStr === "[DONE]"
        ){

          continue;

        }

        try{

          const json =
            JSON.parse(jsonStr);

          const token =

            json
            ?.choices?.[0]
            ?.delta
            ?.content ||

            "";

          if(token){

  fullResponse += token;

  if(
    fullResponse.length > 10000
  ){

    fullResponse =
      fullResponse.slice(
        0,
        10000
      );

  }

  streamText.append(
    document.createTextNode(token)
  );

  if(
    fullResponse.length % 300 === 0
  ){

    requestAnimationFrame(
      scrollBottom
    );

  }

}

        }

        catch(err){

          console.warn(
            "Chunk Error:",
            err
          );

        }

      }

    }

    /* FINAL FORMAT */

    fullResponse =
      normalizeMarkdown(
        fullResponse
      );

    const renderedHTML =
  renderMarkdown(fullResponse);

requestIdleCallback(() => {

  streamText.innerHTML =
    renderedHTML;

  Prism.highlightAllUnder(
    aiDiv
  );

  enhanceCodeBlocks(
    aiDiv
  );

});

    requestIdleCallback(() => {

  Prism.highlightAllUnder(
    aiDiv
  );

});

    enhanceCodeBlocks(
      aiDiv
    );

    messages.push({

      role:"assistant",

      content:fullResponse

    });

    saveChatHistory();

    storeOfflineMessage(
      prompt,
      fullResponse
    );

    injectRuntimeMeta(
      prompt,
      fullResponse.slice(0,150)
    );

  }

  catch(error){

    console.error(
      "STREAM ERROR:",
      error
    );

    const offline =
      await searchOfflineDB(
        prompt
      );

    if(offline){

      streamText.innerHTML =
`
<div class="offline-result">

📦 Offline Cached Result

</div>

${renderMarkdown(offline)}
`;

    }

    else{

      streamText.innerHTML =
`
<div class="error-box">

<h3>
❌ AI Streaming Error
</h3>

<p>
${error.message}
</p>

<ul>
<li>Check NVIDIA API Key</li>
<li>Check Cloudflare Logs</li>
<li>Check CORS</li>
<li>Check SSE Streaming</li>
<li>Verify Backend Route</li>
</ul>

</div>
`;

    }

  }

  isGenerating = false;

}

/* =========================================================
   MARKDOWN NORMALIZER
========================================================= */

function normalizeMarkdown(text){

  if(!text) return "";

  /* AUTO CODE BLOCK */

  if(
    text.includes("function ") &&
    !text.includes("```")
  ){

    text =
`
\`\`\`javascript
${text}
\`\`\`
`;

  }

  return text;

}

/* =========================================================
   ADD MESSAGE
========================================================= */

function addMessage(content,type){

  const div =
    document.createElement("div");

  div.className =
    `message ${type}`;

  if(type === "ai"){

    div.innerHTML =
      renderMarkdown(content);

    enhanceCodeBlocks(div);

    Prism.highlightAllUnder(
      div
    );

  }

  else{

    div.innerHTML =
`
<div class="user-text">
${escapeHTML(content)}
</div>
`;

  }

  chatContainer.appendChild(div);

 if(
  fullResponse.length % 300 === 0
){
  scrollBottom();
}

  return div;

}

/* =========================================================
   MARKDOWN RENDER
========================================================= */

function renderMarkdown(text){

  marked.setOptions({

    breaks:true,

    gfm:true

  });

  return marked.parse(text || "");

}

/* =========================================================
   CODE BLOCKS
========================================================= */

function enhanceCodeBlocks(container){

  const blocks =
    container.querySelectorAll(
      "pre"
    );

  blocks.forEach(pre => {

    if(
      pre.dataset.enhanced
    ) return;

    pre.dataset.enhanced =
      "true";

    const toolbar =
      document.createElement("div");

    toolbar.className =
      "code-toolbar";

    /* COPY */

    const copyBtn =
      document.createElement(
        "button"
      );

    copyBtn.innerHTML =
      `
<i class="fa-solid fa-copy"></i>
Copy
`;

    copyBtn.onclick = () => {

      navigator.clipboard.writeText(
        pre.innerText
      );

      showToast(
        "Code copied"
      );

    };

    toolbar.appendChild(
      copyBtn
    );

    /* PREVIEW */

    if(
      pre.innerText.includes(
        "<html"
      )
    ){

      const previewBtn =
        document.createElement(
          "button"
        );

      previewBtn.innerHTML =
`
<i class="fa-solid fa-eye"></i>
Preview
`;

      previewBtn.onclick = () => {

        openPreview(
          pre.innerText
        );

      };

      toolbar.appendChild(
        previewBtn
      );

    }

    pre.parentNode.insertBefore(
      toolbar,
      pre
    );

  });

}

/* =========================================================
   MAGIC COMMANDS
========================================================= */

async function handleMagicCommands(prompt){

  const lower =
    prompt.toLowerCase();

  /* GOOGLE */

  if(
    lower.startsWith(
      "google "
    )
  ){

    const query =
      prompt.replace(
        /google/gi,
        ""
      );

    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      "_blank"
    );

    return true;

  }

  /* YOUTUBE */

  if(
    lower.startsWith(
      "youtube "
    )
  ){

    const query =
      prompt.replace(
        /youtube/gi,
        ""
      );

    window.open(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      "_blank"
    );

    return true;

  }

  /* PORTFOLIO */

  if(
    lower.includes(
      "portfolio"
    )
  ){

    window.open(
      "https://akshat-145609.github.io/MyPortfolioSite/",
      "_blank"
    );

    return true;

  }

  /* FEEDBACK */

  if(
    lower.includes(
      "feedback"
    )
  ){

    window.open(
      "https://akshat-881236.github.io/Portfolio-881236/feedback.htm?title=Akshat%20Network%20Hub%20AI%20Assistant%20|%20NVIDIA%20NIM%20AI&description=Official%20AI%20Assistant%20of%20Akshat%20Network%20Hub%20powered%20by%20NVIDIA%20NIM%20API%20and%20Cloudflare%20Workers.&url=https://akshat-881236.github.io/AkshatNetworkHub/ai/index.htm",
      "_blank"
    );

    return true;

  }

  /* CLEAR */

  if(
    lower === "clear history" ||
    lower === "new chat"
  ){

    clearChat();

    return true;

  }

  return false;

}

/* =========================================================
   CLEAR CHAT
========================================================= */

function clearChat(){

  messages = [];

  localStorage.removeItem(
    "anh_ai_history"
  );

  chatContainer.innerHTML = "";

  location.reload();

}

/* =========================================================
   META TAGS
========================================================= */

function injectRuntimeMeta(
  title,
  description
){

  document.title =
    title;

  setMeta(
    "description",
    description
  );

  setMeta(
    "keywords",
    `
Akshat Network Hub,
AI Assistant,
NVIDIA NIM,
Cloudflare Worker,
JavaScript AI Chatbot
`
  );

}

/* =========================================================
   META HELPER
========================================================= */

function setMeta(name,content){

  let tag =
    document.querySelector(
      `meta[name="${name}"]`
    );

  if(!tag){

    tag =
      document.createElement(
        "meta"
      );

    tag.setAttribute(
      "name",
      name
    );

    document.head.appendChild(
      tag
    );

  }

  tag.setAttribute(
    "content",
    content
  );

}

/* =========================================================
   BREADCRUMBS
========================================================= */

function injectBreadcrumbs(prompt){

  let script =
    document.getElementById(
      "dynamic-breadcrumbs"
    );

  if(script){

    script.remove();

  }

  script =
    document.createElement(
      "script"
    );

  script.id =
    "dynamic-breadcrumbs";

  script.type =
    "application/ld+json";

  script.textContent =
    JSON.stringify({

      "@context":
        "https://schema.org",

      "@type":
        "BreadcrumbList",

      itemListElement:[

        {

          "@type":
            "ListItem",

          position:1,

          name:
            "Home",

          item:
            location.origin

        },

        {

          "@type":
            "ListItem",

          position:2,

          name:
            prompt

        }

      ]

    });

  document.head.appendChild(
    script
  );

}

/* =========================================================
   PREVIEW
========================================================= */

function openPreview(html){

  previewModal.classList.add(
    "active"
  );

  previewFrame.srcdoc =
    html;

}

function closePreview(){

  previewModal.classList.remove(
    "active"
  );

  previewFrame.srcdoc = "";

}

/* =========================================================
   STORAGE
========================================================= */

function saveChatHistory(){

  localStorage.setItem(

    "anh_ai_history",

    JSON.stringify(messages)

  );

  renderHistorySidebar();

}

function loadChatHistory(){

  const saved =
    localStorage.getItem(
      "anh_ai_history"
    );

  if(!saved) return;

  try{

    messages =
      JSON.parse(saved);

    messages.forEach(msg => {

      addMessage(

        msg.content,

        msg.role === "user"
          ? "user"
          : "ai"

      );

    });

    renderHistorySidebar();

  }

  catch(error){

    console.error(error);

  }

}

/* =========================================================
   HISTORY
========================================================= */

function renderHistorySidebar(){

  if(!historyList) return;

  historyList.innerHTML =
    "";

  [...messages]
  .reverse()
  .forEach(msg => {

    if(
      msg.role !== "user"
    ) return;

    const div =
      document.createElement(
        "div"
      );

    div.className =
      "history-item";

    div.innerHTML =
`
<div class="history-item-title">
${escapeHTML(msg.content.slice(0,80))}
</div>

<div class="history-item-date">
${new Date().toLocaleString()}
</div>
`;

    historyList.appendChild(
      div
    );

  });

}

/* =========================================================
   SEARCH HISTORY
========================================================= */

function searchHistory(){

  const query =
    historySearch.value
    .toLowerCase();

  document
  .querySelectorAll(
    ".history-item"
  )
  .forEach(item => {

    item.style.display =

      item.innerText
      .toLowerCase()
      .includes(query)

      ? "block"

      : "none";

  });

}

/* =========================================================
   INDEXED DB
========================================================= */

function initIndexedDB(){

  const request =
    indexedDB.open(
      "ANH_AI_DB",
      1
    );

  request.onupgradeneeded =
    (e) => {

      db =
        e.target.result;

      db.createObjectStore(
        "responses",
        {

          keyPath:"id",

          autoIncrement:true

        }
      );

    };

  request.onsuccess =
    (e) => {

      db =
        e.target.result;

    };

}

/* =========================================================
   STORE OFFLINE
========================================================= */

function storeOfflineMessage(
  prompt,
  response
){

  if(!db) return;

  const tx =
    db.transaction(
      ["responses"],
      "readwrite"
    );

  tx.objectStore(
    "responses"
  ).add({

    prompt,

    response,

    date:Date.now()

  });

}

/* =========================================================
   SEARCH OFFLINE
========================================================= */

function searchOfflineDB(prompt){

  return new Promise(resolve => {

    if(!db){

      resolve(null);

      return;

    }

    const tx =
      db.transaction(
        ["responses"],
        "readonly"
      );

    const store =
      tx.objectStore(
        "responses"
      );

    const request =
      store.getAll();

    request.onsuccess =
      () => {

        const found =
          request.result.find(
            item =>

              item.prompt
              .toLowerCase()
              .includes(
                prompt.toLowerCase()
              )
          );

        resolve(
          found
            ? found.response
            : null
        );

      };

  });

}

/* =========================================================
   SIDEBAR
========================================================= */

function openSidebar(){

  sidebar?.classList.add(
    "active"
  );

  overlay?.classList.add(
    "active"
  );

}

function closeSidebar(){

  sidebar?.classList.remove(
    "active"
  );

  overlay?.classList.remove(
    "active"
  );

}

/* =========================================================
   SWIPE
========================================================= */

function initSwipe(){

  let startX = 0;

  document.addEventListener(
    "touchstart",
    (e) => {

      startX =
        e.touches[0].clientX;

    }
  );

  document.addEventListener(
    "touchmove",
    (e) => {

      const currentX =
        e.touches[0].clientX;

      if(
        startX < 40 &&
        currentX > 120
      ){

        openSidebar();

      }

      if(currentX < 40){

        closeSidebar();

      }

    }
  );

}

/* =========================================================
   ONLINE STATUS
========================================================= */

function detectOnlineStatus(){

  window.addEventListener(
    "offline",
    () => {

      showToast(
        "Offline Mode"
      );

    }
  );

  window.addEventListener(
    "online",
    () => {

      showToast(
        "Back Online"
      );

    }
  );

}

/* =========================================================
   TOAST
========================================================= */

function showToast(message){

  if(!toast) return;

  toast.innerText =
    message;

  toast.classList.add(
    "active"
  );

  setTimeout(() => {

    toast.classList.remove(
      "active"
    );

  },2500);

}

/* =========================================================
   WELCOME
========================================================= */

function removeWelcome(){

  const welcome =
    document.getElementById(
      "welcomeScreen"
    );

  if(welcome){

    welcome.remove();

  }

}

/* =========================================================
   SCROLL
========================================================= */

function scrollBottom(){

  chatContainer.scrollTop =
    chatContainer.scrollHeight;

}

/* =========================================================
   UTILITIES
========================================================= */

function delay(ms){

  return new Promise(resolve =>
    setTimeout(resolve,ms)
  );

}

function escapeHTML(text){

  return text
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");

}

/* =========================================================
   SERVICE WORKER
========================================================= */

if(
  "serviceWorker" in navigator
){

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register("./sw.js")
        .catch(console.error);

    }
  );

}

/* =========================================================
   IMAGE PREVIEW
========================================================= */

document.addEventListener(
  "click",
  (e) => {

    if(
      e.target.tagName === "IMG"
    ){

      modalImage.src =
        e.target.src;

      imageModal.classList.add(
        "active"
      );

    }

  }
);

/* =========================================================
   NEW CHAT
========================================================= */

document
?.getElementById(
  "newChatBtn"
)
?.addEventListener(
  "click",
  clearChat
);

/* =========================================================
   INIT COMPLETE
========================================================= */

console.log(
  "Akshat Network Hub AI Loaded"
);