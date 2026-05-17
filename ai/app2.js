/* =========================================================
   AKSHAT NETWORK HUB AI
   ADVANCED APP.JS
========================================================= */

/* =========================================================
   CONFIG
========================================================= */

const API_URL =
  "https://akshatai-backend.akshatpsd2005.workers.dev/api/chat";

/* =========================================================
   DOM
========================================================= */

const chatContainer =
  document.getElementById("chatContainer");

const promptInput =
  document.getElementById("promptInput");

const sendBtn =
  document.getElementById("sendBtn");

const fileInput =
  document.getElementById("fileInput");

const filePreviewContainer =
  document.getElementById(
    "filePreviewContainer"
  );

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

let uploadedFiles = [];

let db;

/* =========================================================
   INIT
========================================================= */

window.addEventListener(
  "DOMContentLoaded",
  async () => {

    initIndexedDB();

    loadChatHistory();

    initEvents();

    initSwipe();

    initQuickButtons();

    detectOnlineStatus();

  }
);

/* =========================================================
   EVENTS
========================================================= */

function initEvents(){

  sendBtn.addEventListener(
    "click",
    sendMessage
  );

  promptInput.addEventListener(
    "keydown",
    handleEnterSend
  );

  promptInput.addEventListener(
    "input",
    autoResize
  );

  fileInput.addEventListener(
    "change",
    handleFiles
  );

  menuBtn.addEventListener(
    "click",
    openSidebar
  );

  closeSidebarBtn.addEventListener(
    "click",
    closeSidebar
  );

  overlay.addEventListener(
    "click",
    closeSidebar
  );

  closePreviewBtn.addEventListener(
    "click",
    closePreview
  );

  imageModal.addEventListener(
    "click",
    () => {
      imageModal.classList.remove(
        "active"
      );
    }
  );

  historySearch.addEventListener(
    "input",
    searchHistory
  );

}

/* =========================================================
   SIDEBAR TOGGLE + HAND GESTURE SUPPORT
   ADD BELOW YOUR EXISTING JS
========================================================= */

/* =========================================================
   SIDEBAR STATE
========================================================= */

let sidebarOpen = false;

/* =========================================================
   SAFE OPEN SIDEBAR
========================================================= */

function openSidebar(){

  if(!sidebar) return;

  sidebar.classList.add("active");

  if(overlay){
    overlay.classList.add("active");
  }

  document.body.style.overflow = "hidden";

  sidebarOpen = true;

}

/* =========================================================
   SAFE CLOSE SIDEBAR
========================================================= */

function closeSidebar(){

  if(!sidebar) return;

  sidebar.classList.remove("active");

  if(overlay){
    overlay.classList.remove("active");
  }

  document.body.style.overflow = "";

  sidebarOpen = false;

}

/* =========================================================
   MENU BUTTON TOGGLE
========================================================= */

function initSidebarToggle(){

  /* MENU BUTTON */

  if(menuBtn){

    menuBtn.addEventListener(
      "click",
      (e) => {

        e.preventDefault();

        e.stopPropagation();

        if(sidebarOpen){

          closeSidebar();

        }else{

          openSidebar();

        }

      }
    );

  }

  /* CLOSE BUTTON */

  if(closeSidebarBtn){

    closeSidebarBtn.addEventListener(
      "click",
      closeSidebar
    );

  }

  /* OVERLAY */

  if(overlay){

    overlay.addEventListener(
      "click",
      closeSidebar
    );

  }

}

/* =========================================================
   ADVANCED HAND GESTURE SWIPE
========================================================= */

function initSidebarGestures(){

  let startX = 0;

  let startY = 0;

  let currentX = 0;

  let isDragging = false;

  const EDGE_AREA = 35;

  const OPEN_THRESHOLD = 90;

  const CLOSE_THRESHOLD = 70;

  /* TOUCH START */

  document.addEventListener(
    "touchstart",
    (e) => {

      const touch =
        e.touches[0];

      startX =
        touch.clientX;

      startY =
        touch.clientY;

      currentX =
        startX;

      /* OPEN FROM LEFT EDGE */

      if(
        startX <= EDGE_AREA ||
        sidebarOpen
      ){

        isDragging = true;

      }

    },
    { passive:true }
  );

  /* TOUCH MOVE */

  document.addEventListener(
    "touchmove",
    (e) => {

      if(!isDragging) return;

      const touch =
        e.touches[0];

      currentX =
        touch.clientX;

      const deltaX =
        currentX - startX;

      const deltaY =
        touch.clientY - startY;

      /* IGNORE VERTICAL SCROLL */

      if(
        Math.abs(deltaY) >
        Math.abs(deltaX)
      ){

        return;

      }

      /* SWIPE OPEN */

      if(
        !sidebarOpen &&
        startX <= EDGE_AREA &&
        deltaX > OPEN_THRESHOLD
      ){

        openSidebar();

        isDragging = false;

      }

      /* SWIPE CLOSE */

      if(
        sidebarOpen &&
        deltaX < -CLOSE_THRESHOLD
      ){

        closeSidebar();

        isDragging = false;

      }

    },
    { passive:true }
  );

  /* TOUCH END */

  document.addEventListener(
    "touchend",
    () => {

      isDragging = false;

    },
    { passive:true }
  );

}

/* =========================================================
   ESC KEY CLOSE
========================================================= */

document.addEventListener(
  "keydown",
  (e) => {

    if(
      e.key === "Escape" &&
      sidebarOpen
    ){

      closeSidebar();

    }

  }
);

/* =========================================================
   CLICK OUTSIDE CLOSE
========================================================= */

document.addEventListener(
  "click",
  (e) => {

    if(
      sidebarOpen &&
      !sidebar.contains(e.target) &&
      !menuBtn.contains(e.target)
    ){

      closeSidebar();

    }

  }
);

/* =========================================================
   AUTO INIT
========================================================= */

window.addEventListener(
  "DOMContentLoaded",
  () => {

    initSidebarToggle();

    initSidebarGestures();

  }
);

/* =========================================================
   OPTIONAL: PREVENT DOUBLE FUNCTIONS
========================================================= */

/*
REMOVE OLD FUNCTIONS:

- openSidebar()
- closeSidebar()
- initSwipe()

FROM YOUR OLD FILE

SO THEY DON'T CONFLICT
*/

/* =========================================================
   AUTO RESIZE
========================================================= */

function autoResize(){

  promptInput.style.height = "auto";

  promptInput.style.height =
    promptInput.scrollHeight + "px";

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

  /* EVENT DELEGATION */

  document.addEventListener(
    "click",
    async (e) => {

      const btn =
        e.target.closest(".quick-btn");

      if(!btn) return;

      /* GET PROMPT */

      const prompt =

        btn.dataset.prompt ||

        btn.getAttribute(
          "data-message"
        ) ||

        btn.innerText ||

        "";

      if(!prompt.trim()) return;

      /* SET INPUT */

      promptInput.value =
        prompt.trim();

      /* AUTO HEIGHT */

      promptInput.style.height =
        "auto";

      promptInput.style.height =
        promptInput.scrollHeight +
        "px";

      /* SMALL DELAY */

      await new Promise(resolve =>
        setTimeout(resolve, 50)
      );

      /* SEND */

      sendMessage();

    }
  );

}

/* =========================================================
   ULTRA FAST STREAMING SEND MESSAGE
========================================================= */

async function sendMessage(){

  const prompt =
    promptInput.value.trim();

  if(
  !prompt ||
  prompt.length < 1
){
  return;
}

  removeWelcome();

  /* =====================================================
     USER MESSAGE
  ===================================================== */

  addMessage(
    prompt,
    "user"
  );

  messages.push({

    role:"user",

    content:prompt

  });

  /* =====================================================
     MAGIC COMMANDS
  ===================================================== */

  if(
    await handleMagicCommands(prompt)
  ){

    promptInput.value = "";

    return;

  }

  /* =====================================================
     RESET INPUT
  ===================================================== */

  promptInput.value = "";

  promptInput.style.height =
    "60px";

  /* =====================================================
     AI CONTAINER
  ===================================================== */

  const aiDiv =
    document.createElement("div");

  aiDiv.className =
    "message ai";

  /* RAW STREAM CONTAINER */

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

  /* =====================================================
     RESPONSE BUFFER
  ===================================================== */

  let fullResponse = "";

  /* STREAM BUFFER */

  let pendingChunk = "";

  try{

    /* ===================================================
       API REQUEST
    =================================================== */

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

    /* ===================================================
       RESPONSE ERROR
    =================================================== */

    if(!response.ok){

      const errText =
        await response.text();

      throw new Error(
        errText ||
        "Streaming failed"
      );

    }

    /* ===================================================
       STREAM READER
    =================================================== */

    const reader =
      response.body.getReader();

    const decoder =
      new TextDecoder();

    /* ===================================================
       STREAM LOOP
    =================================================== */

    while(true){

      const {
        value,
        done
      } = await reader.read();

      if(done) break;

      /* FAST DECODE */

      pendingChunk +=
        decoder.decode(
          value,
          {
            stream:true
          }
        );

      /* SPLIT SSE */

      const lines =
        pendingChunk.split("\n");

      /* KEEP LAST INCOMPLETE */

      pendingChunk =
        lines.pop() || "";

      for(const line of lines){

        /* ONLY SSE DATA */

        if(
          !line.startsWith("data:")
        ) continue;

        const jsonStr =
          line.replace(
            "data:",
            ""
          ).trim();

        /* END STREAM */

        if(
          jsonStr === "[DONE]"
        ){

          continue;

        }

        try{

          const json =
            JSON.parse(jsonStr);

          /* TOKEN */

          const token =

            json
            ?.choices?.[0]
            ?.delta
            ?.content ||

            "";

          if(token){

            fullResponse += token;

            /* ===========================================
               ULTRA FAST RAW APPEND
            =========================================== */

            streamText.textContent =
              fullResponse;

            scrollBottom();

          }

        }

        catch(err){

          console.warn(
            "Chunk Parse Error:",
            err
          );

        }

      }

    }

    /* ===================================================
       FINAL MARKDOWN RENDER
    =================================================== */

    streamText.innerHTML =
      marked.parse(
        fullResponse
      );

    /* ===================================================
       CODE HIGHLIGHT
    =================================================== */

    Prism.highlightAllUnder(
      aiDiv
    );

    /* ===================================================
       CODE BLOCK FEATURES
    =================================================== */

    enhanceCodeBlocks(
      aiDiv
    );

    /* ===================================================
       SAVE MEMORY
    =================================================== */

    messages.push({

      role:"assistant",

      content:fullResponse

    });

    saveChatHistory();

    storeOfflineMessage(
      prompt,
      fullResponse
    );

  }

  /* =====================================================
     ERROR
  ===================================================== */

  catch(error){

    console.error(
      "STREAM ERROR:",
      error
    );

    /* OFFLINE CACHE */

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

${marked.parse(offline)}
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
<li>Check Worker Logs</li>
<li>Verify NVIDIA API Key</li>
<li>Check CORS Origin</li>
<li>Verify SSE Streaming</li>
<li>Check Internet Connection</li>
</ul>

</div>
`;

    }

  }

}

/* =========================================================
   AI RESPONSE PARSER
========================================================= */

function extractAIResponse(data){

  console.log(
    "FULL AI RESPONSE:",
    data
  );

  /* DIRECT STRING */

  if(typeof data === "string"){

    return data;

  }

  /* YOUR WORKER FORMAT */

  if(

    data.response &&

    data.response.choices &&

    data.response.choices[0] &&

    data.response.choices[0].message

  ){

    return data
      .response
      .choices[0]
      .message
      .content;

  }

  /* DIRECT NVIDIA FORMAT */

  if(

    data.choices &&

    data.choices[0] &&

    data.choices[0].message

  ){

    return data
      .choices[0]
      .message
      .content;

  }

  /* SIMPLE FORMAT */

  if(data.reply){

    return data.reply;

  }

  if(data.message){

    return data.message;

  }

  return null;

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

    Prism.highlightAll();

  }else{

    div.textContent = content;

  }

  chatContainer.appendChild(div);

  scrollBottom();

  return div;

}

/* =========================================================
   MARKDOWN
========================================================= */

function renderMarkdown(text){

  return marked.parse(text || "");

}

/* =========================================================
   CODE BLOCK ENHANCER
========================================================= */

function enhanceCodeBlocks(container){

  const blocks =
    container.querySelectorAll("pre");

  blocks.forEach(pre => {

    const wrapper =
      document.createElement("div");

    wrapper.className =
      "code-toolbar";

    /* COPY */

    const copyBtn =
      document.createElement("button");

    copyBtn.innerHTML =
      '<i class="fa-solid fa-copy"></i> Copy';

    copyBtn.onclick = () => {

      navigator.clipboard.writeText(
        pre.innerText
      );

      showToast(
        "Code copied"
      );

    };

    wrapper.appendChild(copyBtn);

    /* HTML PREVIEW */

    if(
      pre.innerText.includes("<html")
    ){

      const previewBtn =
        document.createElement("button");

      previewBtn.innerHTML =
        '<i class="fa-solid fa-eye"></i> Preview';

      previewBtn.onclick = () => {

        openPreview(
          pre.innerText
        );

      };

      wrapper.appendChild(
        previewBtn
      );

    }

    pre.parentNode.insertBefore(
      wrapper,
      pre.nextSibling
    );

  });

}

/* =========================================================
   PREVIEW
========================================================= */

function openPreview(html){

  previewModal.classList.add(
    "active"
  );

  previewFrame.srcdoc = html;

}

function closePreview(){

  previewModal.classList.remove(
    "active"
  );

  previewFrame.srcdoc = "";

}

/* =========================================================
   LOADER
========================================================= */

function addLoader(){

  const div =
    document.createElement("div");

  div.className =
    "message ai";

  div.innerHTML =
`
<div class="typing">
  <span></span>
  <span></span>
  <span></span>
</div>
`;

  chatContainer.appendChild(div);

  scrollBottom();

  return div;

}

/* =========================================================
   FILE HANDLER
========================================================= */

function handleFiles(e){

  const files =
    Array.from(e.target.files);

  uploadedFiles =
    [...uploadedFiles,...files];

  renderFilePreview();

}

/* =========================================================
   FILE PREVIEW
========================================================= */

function renderFilePreview(){

  filePreviewContainer.innerHTML = "";

  uploadedFiles.forEach(file => {

    const div =
      document.createElement("div");

    div.className =
      "file-preview";

    div.innerHTML =
`
<i class="fa-solid fa-file"></i>

<div class="file-preview-name">
  ${file.name}
</div>
`;

    filePreviewContainer.appendChild(
      div
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
    lower.startsWith("google ") ||
    lower.startsWith("search google ")
  ){

    const query =
      prompt.replace(
        /google|search google/gi,
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
    lower.startsWith("youtube ") ||
    lower.startsWith("search youtube ")
  ){

    const query =
      prompt.replace(
        /youtube|search youtube/gi,
        ""
      );

    window.open(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      "_blank"
    );

    return true;

  }

  /* BING */

  if(
    lower.startsWith("bing ")
  ){

    const query =
      prompt.replace(
        /bing/gi,
        ""
      );

    window.open(
      `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
      "_blank"
    );

    return true;

  }

  /* OPEN PORTFOLIO */

  if(
    lower.includes("open portfolio") || lower.includes("my portfolio") || lower.includes("show portfolio") || lower.includes("Akshat portfolio") || lower.includes("Akshat Prasad portfolio")
  ){

    window.open(
      "https://akshat-145609.github.io/MyPortfolioSite/",
      "_blank"
    );

    return true;

  }

  /* FEEDBACK */

  if(
    lower.includes("feedback") || lower.includes("report issue") || lower.includes("suggestion") || lower.includes("contact support") || lower.includes("contact us") || lower.includes("contact me") || lower.includes("support") || lower.includes("help") || lower.includes("bug") || lower.includes("issue") || lower.includes("problem") || lower.includes("error") || lower.includes("fix") || lower.includes("improve") || lower.includes("feature request") || lower.includes("request feature") || lower.includes("I want to provide feedback") || lower.includes("I want to report an issue") || lower.includes("I have a suggestion") || lower.includes("I need help") || lower.includes("I found a bug") || lower.includes("I want to request a feature")
  ){

    window.open(
      "https://akshat-881236.github.io/Portfolio-881236/feedback.htm?title=Akshat%20Network%20Hub%20AI%20Assistant%20|%20NVIDIA%20NIM%20AI&description=Official%20AI%20Assistant%20of%20Akshat%20Network%20Hub%20powered%20by%20NVIDIA%20NIM%20API%20and%20Cloudflare%20Workers.&url=https://akshat-881236.github.io/AkshatNetworkHub/ai/index.htm",
      "_blank"
    );

    return true;

  }

  /* Commands related to the app itself can be handled here */

  if(

    lower === "clear history" ||
    lower === "delete history" ||
    lower === "reset chat" ||
    lower === "new chat"

  ){

    clearChat();

    return true;

  }

    if(

      lower === "help" ||
      lower === "commands" ||
      lower === "magic commands"
    ){

      addMessage(
`✨ Magic Commands:
• google [query] - Search Google
• youtube [query] - Search YouTube
• bing [query] - Search Bing
• open portfolio - Open my portfolio website
• feedback - Provide feedback or report an issue
• clear history - Clear chat history
• help - Show this message`,
        "ai"
      );
      return true;

    }

    if ( lower.includes("who are you") || lower.includes("what can you do") || lower.includes("introduce yourself") || lower.includes("your capabilities") || lower.includes("help me") || lower.includes("how can you assist me") ) {

      addMessage(
        `Hello! I am the Akshat Network Hub AI Assistant, powered by NVIDIA's NIM API and Cloudflare Workers. I can assist you with a variety of tasks including answering questions, providing information, performing calculations, searching the web, and more. Just type your request and I'll do my best to help!`,
        "ai"
      );

     return true;

  }
  return false;

}

/* =========================================================
   QUICK BUTTONS
========================================================= */

function initQuickButtons(){

  document
    .querySelectorAll(".quick-btn")
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          promptInput.value =
            btn.innerText;

          sendMessage();

        }
      );

    });

}

/* =========================================================
   SIDEBAR
========================================================= */

function openSidebar(){

  sidebar.classList.add(
    "active"
  );

  overlay.classList.add(
    "active"
  );

}

function closeSidebar(){

  sidebar.classList.remove(
    "active"
  );

  overlay.classList.remove(
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
    e => {

      startX =
        e.touches[0].clientX;

    }
  );

  document.addEventListener(
    "touchmove",
    e => {

      const currentX =
        e.touches[0].clientX;

      if(
        startX < 40 &&
        currentX > 120
      ){

        openSidebar();

      }

      if(
        currentX < 40
      ){

        closeSidebar();

      }

    }
  );

}

/* =========================================================
   SCROLL
========================================================= */

function scrollBottom(){

  chatContainer.scrollTop =
    chatContainer.scrollHeight;

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
   TOAST
========================================================= */

function showToast(message){

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
   LOCAL STORAGE
========================================================= */

function saveChatHistory(){

  localStorage.setItem(
    "anh_ai_history",
    JSON.stringify(messages)
  );

  renderHistorySidebar();

}

/* =========================================================
   LOAD HISTORY
========================================================= */

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
   SIDEBAR HISTORY
========================================================= */

function renderHistorySidebar(){

  historyList.innerHTML = "";

  const reversed =
    [...messages].reverse();

  reversed.forEach(msg => {

    if(msg.role !== "user") return;

    const div =
      document.createElement("div");

    div.className =
      "history-item";

    div.innerHTML =
`
<div class="history-item-title">
  ${msg.content.slice(0,80)}
</div>

<div class="history-item-date">
  ${new Date().toLocaleString()}
</div>
`;

    historyList.appendChild(div);

  });

}

/* =========================================================
   SEARCH HISTORY
========================================================= */

function searchHistory(){

  const query =
    historySearch.value
    .toLowerCase();

  const items =
    document.querySelectorAll(
      ".history-item"
    );

  items.forEach(item => {

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
    e => {

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
    e => {

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

  const store =
    tx.objectStore(
      "responses"
    );

  store.add({
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

        const data =
          request.result;

        const found =
          data.find(item =>
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
  e => {

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
  .getElementById("newChatBtn")
  .addEventListener(
    "click",
    () => {

      messages = [];

      localStorage.removeItem(
        "anh_ai_history"
      );

      location.reload();

    }
  );

/* =========================================================
   INIT COMPLETE
========================================================= */

console.log(
  "Akshat Network Hub AI Loaded"
);