/* =========================================================
   AKSHAT NETWORK HUB AI FRONTEND
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

/* =========================================================
   CHAT MEMORY
========================================================= */

let messages = [];

/* =========================================================
   AUTO RESIZE
========================================================= */

promptInput.addEventListener("input", () => {

  promptInput.style.height = "auto";

  promptInput.style.height =
    promptInput.scrollHeight + "px";

});

/* =========================================================
   ENTER SEND
========================================================= */

promptInput.addEventListener("keydown", (e) => {

  if (
    e.key === "Enter" &&
    !e.shiftKey
  ) {

    e.preventDefault();

    sendMessage();
  }

});

/* =========================================================
   BUTTON
========================================================= */

sendBtn.addEventListener(
  "click",
  sendMessage
);

/* =========================================================
   SEND MESSAGE
========================================================= */

async function sendMessage() {

  const prompt =
    promptInput.value.trim();

  if (!prompt) return;

  /* USER MESSAGE */

  addMessage(prompt, "user");

  messages.push({
    role: "user",
    content: prompt
  });

  promptInput.value = "";

  promptInput.style.height = "60px";

  /* LOADING */

  const loadingElement =
    addLoadingMessage();

  try {

    /* FETCH */

    const response = await fetch(
      API_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          message: prompt,

          messages,

          stream: false,

          model:
            "meta/llama-3.1-70b-instruct",

          temperature: 0.7,

          max_tokens: 2048
        })
      }
    );

    /* RAW RESPONSE */

    const data =
      await response.json();

    console.log("AI RESPONSE:", data);

    /* REMOVE LOADER */

    loadingElement.remove();

    /* ERROR CHECK */

    if (!response.ok) {

      throw new Error(
        data.error ||
        "AI Request Failed"
      );
    }

    /* FIXED MESSAGE EXTRACTION */

    let aiMessage = "";

    if (typeof data.message === "string") {

      aiMessage = data.message;

    } else if (
      data.response &&
      data.response.choices &&
      data.response.choices[0]
    ) {

      aiMessage =
        data.response
        .choices[0]
        .message
        .content;

    } else {

      aiMessage =
        "No AI response received.";
    }

    /* SAVE */

    messages.push({
      role: "assistant",
      content: aiMessage
    });

    /* RENDER */

    addMessage(aiMessage, "ai");

    updateDynamicSEO(prompt);

  } catch (error) {

    loadingElement.remove();

    console.error(error);

    addMessage(
      `
❌ AI Error

${error.message}

Check:
- Cloudflare Worker
- NVIDIA API Key
- CORS
- Console Logs
      `,
      "ai"
    );
  }
}

/* =========================================================
   ADD MESSAGE
========================================================= */

function addMessage(content, type) {

  removeWelcome();

  const messageDiv =
    document.createElement("div");

  messageDiv.className =
    `message ${type}`;

  /* ------------------------------------------------------
     MARKDOWN RENDER
  ------------------------------------------------------ */

  if (type === "ai") {

    messageDiv.innerHTML =
      marked.parse(content || "");

    Prism.highlightAll();

  } else {

    messageDiv.textContent =
      content;
  }

  chatContainer.appendChild(
    messageDiv
  );

  scrollToBottom();

  return messageDiv;
}

/* =========================================================
   LOADING MESSAGE
========================================================= */

function addLoadingMessage() {

  removeWelcome();

  const loading =
    document.createElement("div");

  loading.className =
    "message ai";

  loading.innerHTML =
    `
    <div class="typing">
      Thinking<span>.</span><span>.</span><span>.</span>
    </div>
    `;

  chatContainer.appendChild(
    loading
  );

  scrollToBottom();

  return loading;
}

/* =========================================================
   REMOVE WELCOME
========================================================= */

function removeWelcome() {

  const welcome =
    document.querySelector(".welcome");

  if (welcome) {
    welcome.remove();
  }
}

/* =========================================================
   SCROLL
========================================================= */

function scrollToBottom() {

  chatContainer.scrollTop =
    chatContainer.scrollHeight;
}

/* =========================================================
   DYNAMIC SEO
========================================================= */

function updateDynamicSEO(prompt) {

  /* ------------------------------------------------------
     TITLE
  ------------------------------------------------------ */

  document.title =
    `${prompt.slice(0, 60)} | ANH AI Assistant`;

  /* ------------------------------------------------------
     META DESCRIPTION
  ------------------------------------------------------ */

  let metaDescription =
    document.querySelector(
      'meta[name="description"]'
    );

  if (metaDescription) {

    metaDescription.setAttribute(
      "content",
      `AI discussion about ${prompt}`
    );
  }
}

/* =========================================================
   LOCAL STORAGE CHAT SAVE
========================================================= */

function saveChatHistory() {

  localStorage.setItem(
    "anh_ai_chat_history",
    JSON.stringify(messages)
  );
}

/* =========================================================
   LOAD CHAT HISTORY
========================================================= */

function loadChatHistory() {

  const saved =
    localStorage.getItem(
      "anh_ai_chat_history"
    );

  if (!saved) return;

  try {

    messages =
      JSON.parse(saved);

    for (const msg of messages) {

      addMessage(
        msg.content,
        msg.role === "user"
          ? "user"
          : "ai"
      );
    }

  } catch (error) {

    console.error(error);
  }
}

/* =========================================================
   AUTO SAVE
========================================================= */

setInterval(
  saveChatHistory,
  3000
);

/* =========================================================
   SERVICE WORKER
========================================================= */

if ("serviceWorker" in navigator) {

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
   INIT
========================================================= */

loadChatHistory();

console.log(
  "Akshat Network Hub AI Initialized"
);