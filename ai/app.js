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
   SEND MESSAGE
========================================================= */

async function sendMessage(){

  const prompt =
    promptInput.value.trim();

  if(!prompt) return;

  removeWelcome();

  /* USER MESSAGE */

  addMessage(prompt, "user");

  /* MEMORY */

  messages.push({
    role: "user",
    content: prompt
  });

  /* MAGIC COMMANDS */

  if(await handleMagicCommands(prompt)){

    promptInput.value = "";

    return;

  }

  /* LOADER */

  const loader =
    addLoader();

  try{

    /* API REQUEST */

    const response =
      await fetch(API_URL, {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          /* IMPORTANT */
          message: prompt,

          messages: messages,

          stream: false,

          model:
            "meta/llama-3.1-70b-instruct",

          temperature: 0.7,

          max_tokens: 2048,

          top_p: 0.9

        })

      });

    /* DEBUG */

    console.log(
      "RAW RESPONSE:",
      response
    );

    /* PARSE JSON */

    const data =
      await response.json();

    console.log(
      "AI JSON:",
      data
    );

    /* REMOVE LOADER */

    loader.remove();

    /* HANDLE HTTP ERRORS */

    if(!response.ok){

      throw new Error(

        data.error ||

        data.details ||

        JSON.stringify(data) ||

        "Worker Error"

      );

    }

    /* EXTRACT AI RESPONSE */

    let aiMessage =
      extractAIResponse(data);

    /* FALLBACK */

    if(!aiMessage){

      aiMessage =
`⚠️ AI response unavailable.

Possible Issues:

• NVIDIA API Key
• Worker Error
• CORS
• API Timeout`;

    }

    /* SAVE MEMORY */

    messages.push({
      role: "assistant",
      content: aiMessage
    });

    /* RENDER */

    addMessage(
      aiMessage,
      "ai"
    );

    /* SAVE */

    saveChatHistory();

    storeOfflineMessage(
      prompt,
      aiMessage
    );

  }

  catch(error){

    console.error(
      "SEND ERROR:",
      error
    );

    loader.remove();

    /* OFFLINE CACHE */

    const offline =
      await searchOfflineDB(
        prompt
      );

    if(offline){

      addMessage(
`📦 Offline Cached Result

${offline}`,
        "ai"
      );

    }

    else{

      addMessage(
`❌ AI Error

${error.message}

Backend failed to generate AI response.

Check:

• NVIDIA API Key
• Cloudflare Worker Logs
• Worker Route
• CORS Origin
• Request JSON`,
        "ai"
      );

    }

  }

  /* RESET */

  promptInput.value = "";

  promptInput.style.height =
    "60px";

  uploadedFiles = [];

  filePreviewContainer.innerHTML =
    "";

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
    lower.includes("open portfolio")
  ){

    window.open(
      "https://akshat-881236.github.io/Portfolio-881236/",
      "_blank"
    );

    return true;

  }

  /* FEEDBACK */

  if(
    lower.includes("feedback")
  ){

    window.open(
      "https://akshat-881236.github.io/Portfolio-881236/feedback.htm",
      "_blank"
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