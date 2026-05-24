/* =========================================
   PARAM ENGINE
========================================= */

const params =
new URLSearchParams(
  window.location.search
);

function safeParam(key){

  try{

    return params.get(key);

  }catch(error){

    console.log(error);

    return null;
  }
}

const pdfURL =
safeParam("pdf");

const title =
safeParam("title");

const category =
safeParam("category");

const discipline =
safeParam("discipline");

const uploader =
safeParam("uploader");

const docid =
safeParam("docid");

const initialPage =
parseInt(
  safeParam("page")
) || 1;

const initialZoom =
parseInt(
  safeParam("zoom")
) || 100;

/* =========================================
   DETAILS
========================================= */

document.getElementById(
  "detailTitle"
).textContent =
title || "-";

document.getElementById(
  "detailCategory"
).textContent =
category || "-";

document.getElementById(
  "detailDiscipline"
).textContent =
discipline || "-";

document.getElementById(
  "detailUploader"
).textContent =
uploader || "-";

document.getElementById(
  "detailDocId"
).textContent =
docid || "-";

/* =========================================
   PDF STATE
========================================= */

let pdfDoc = null;

let currentPage =
initialPage;

/* FIXED BOOK ALIGNMENT */

let currentBookPage =

initialPage % 2 === 0
? initialPage - 1
: initialPage;

let scale =
initialZoom / 100;

let renderTask = null;

const canvas =
document.getElementById(
  "pdfCanvas"
);

const context =
canvas.getContext("2d");

/* =========================================
   LOAD PDF
========================================= */

async function loadPDF(){

  try{

    /* LOADER */

    document.getElementById(
      "pageInfo"
    ).textContent =

    "Loading PDF...";

    const loadingTask =

    pdfjsLib.getDocument({

      url: pdfURL,

      /* ENABLE PROGRESSIVE LOADING */

      disableAutoFetch:false,

      disableStream:false,

      disableRange:false,

      enableXfa:false,

      useWorkerFetch:true,

      isEvalSupported:true,

      cMapPacked:true
    });

    /* PROGRESS */

    loadingTask.onProgress =

    function(progress){

      if(progress.total){

        const percent = Math.round(

          (progress.loaded /
          progress.total) * 100
        );

        document.getElementById(
          "pageInfo"
        ).textContent =

        `Loading ${percent}%`;

        /* IMPORTANT */

        if(

          percent >= 15

          &&

          !pdfDoc

        ){

          console.log(
            "Preparing first render..."
          );
        }
      }
    };

    /* PDF READY */

    pdfDoc =
    await loadingTask.promise;

    /* RENDER IMMEDIATELY */

    renderPage();

    document.getElementById(
      "pageInfo"
    ).textContent =

    `Page ${currentPage}
     of
     ${pdfDoc.numPages}`;

  }catch(error){

    console.error(

      "PDF LOAD ERROR:",

      error
    );

    alert(

      "Failed to load PDF.\n\n" +

      "Possible reasons:\n" +

      "- CORS blocked\n" +

      "- Broken PDF\n" +

      "- Invalid PDF URL\n" +

      "- Large PDF issue"
    );
     window.location.href =

   "https://dpgnotes.web.app/" +
   
   "?utm_source=pdfviewer" +
   
   "&utm_medium=cors_referral" +
   
   "&utm_campaign=pdfviewer_redirect" +
   
   "&error=wrong_pdf_url";
  }
}

/* =========================================
   RENDER NORMAL PAGE
========================================= */

async function renderPage(){

  if(!pdfDoc){

    return;
  }

  try{

    if(renderTask){

      try{

        renderTask.cancel();

      }catch(error){

        console.log(error);
      }
    }

    const page =
    await pdfDoc.getPage(
      currentPage
    );

    const viewport =
    page.getViewport({

      scale:
      scale *
      window.devicePixelRatio
    });

    canvas.width =
    viewport.width;

    canvas.height =
    viewport.height;

    canvas.style.width =
    `${viewport.width / window.devicePixelRatio}px`;

    canvas.style.height =
    `${viewport.height / window.devicePixelRatio}px`;

    renderTask =
    page.render({

      canvasContext:context,

      viewport
    });

    await renderTask.promise;

    document.getElementById(
      "pageInfo"
    ).textContent =

    `Page ${currentPage}
     of
     ${pdfDoc.numPages}`;

    localStorage.setItem(

      "dpgnotes_pdf_state",

      JSON.stringify({

        page:
        currentPage,

        scale
      })
    );

    /* ONLY RENDER BOOK MODE IF ACTIVE */

    if(

      document
      .getElementById(
        "bookPage"
      )
      .classList.contains(
        "active"
      )

    ){

      renderBookMode();
    }

  }catch(error){

    console.log(
      "Render error:",
      error
    );
  }
}

/* =========================================
   PAGE NAVIGATION
========================================= */

function nextPage(){

  if(

    currentPage <
    pdfDoc.numPages

  ){

    currentPage++;

    renderPage();
  }
}

function prevPage(){

  if(currentPage > 1){

    currentPage--;

    renderPage();
  }
}

/* =========================================
   ZOOM
========================================= */

function zoomIn(){

  scale += .1;

  renderPage();
}

function zoomOut(){

  if(scale > .5){

    scale -= .1;

    renderPage();
  }
}

/* =========================================
   BOOK PAGE RENDER
========================================= */

async function renderBookPage(

  pageNum,
  canvasId

){

  const canvas =
  document.getElementById(
    canvasId
  );

  const ctx =
  canvas.getContext("2d");

  /* EMPTY PAGE */

  if(

    pageNum >
    pdfDoc.numPages

  ){

    ctx.clearRect(

      0,
      0,
      canvas.width,
      canvas.height
    );

    return;
  }

  try{

    const page =
    await pdfDoc.getPage(
      pageNum
    );

    const viewport =
    page.getViewport({

      scale:
      scale *
      window.devicePixelRatio
    });

    canvas.width =
    viewport.width;

    canvas.height =
    viewport.height;

    canvas.style.width =
    `${viewport.width / window.devicePixelRatio}px`;

    canvas.style.height =
    `${viewport.height / window.devicePixelRatio}px`;

    await page.render({

      canvasContext:ctx,

      viewport

    }).promise;

  }catch(error){

    console.log(

      "Book render error:",

      error
    );
  }
}

/* =========================================
   BOOK MODE
========================================= */

async function renderBookMode(){

  if(!pdfDoc){

    return;
  }

  await renderBookPage(

    currentBookPage,

    "leftBookCanvas"
  );

  await renderBookPage(

    currentBookPage + 1,

    "rightBookCanvas"
  );

  document.getElementById(
  "bookPageInfo"
).textContent =

`Pages ${currentBookPage}
 -
 ${Math.min(

    currentBookPage + 1,

    pdfDoc.numPages
 )}

 of

 ${pdfDoc.numPages}`;
}

/* =========================================
   BOOK NAVIGATION
========================================= */

function nextBookSpread(){

  if(

    currentBookPage + 2
    <=
    pdfDoc.numPages

  ){

    currentBookPage += 2;

    renderBookMode();
  }
}

function prevBookSpread(){

  if(currentBookPage > 1){

    currentBookPage -= 2;

    if(currentBookPage < 1){

      currentBookPage = 1;
    }

    renderBookMode();
  }
}

/* =========================================
   DOWNLOAD
========================================= */

function downloadPDF(){

  window.open(

    pdfURL,

    "_blank"
  );
}

/* =========================================
   SHARE
========================================= */

async function sharePDF(){

  try{

    if(navigator.share){

      await navigator.share({

        title:
        title ||
        "DPGNotes PDF",

        url:
        window.location.href
      });

    }else{

      await navigator.clipboard
      .writeText(

        window.location.href
      );

      alert(
        "Link Copied"
      );
    }

  }catch(error){

    console.log(error);
  }
}

/* =========================================
   TAB ENGINE
========================================= */

const tabButtons =
document.querySelectorAll(
  ".tab-btn"
);

const pages =
document.querySelectorAll(
  ".page"
);

tabButtons.forEach((button)=>{

  button.addEventListener(
    "click",
    ()=>{

      tabButtons.forEach((btn)=>{

        btn.classList.remove(
          "active"
        );
      });

      pages.forEach((page)=>{

        page.classList.remove(
          "active"
        );
      });

      button.classList.add(
        "active"
      );

      const targetPage =

      document.getElementById(

        button.dataset.page
      );

      targetPage.classList.add(
        "active"
      );

      /* AUTO LOAD BOOK MODE */

      if(

        button.dataset.page ===
        "bookPage"

      ){

        renderBookMode();
      }
    }
  );
});

/* =========================================
   BOOK SHORTCUTS
========================================= */

document.addEventListener(

  "keydown",

  (e)=>{

    const bookActive =

    document
    .getElementById(
      "bookPage"
    )
    .classList.contains(
      "active"
    );

    if(!bookActive){

      return;
    }

    if(e.key === "ArrowRight"){

      nextBookSpread();
    }

    if(e.key === "ArrowLeft"){

      prevBookSpread();
    }
  }
);

/* =========================================
   MOBILE SWIPE
========================================= */

let touchStartX = 0;

let touchEndX = 0;

const bookPage =
document.getElementById(
  "bookPage"
);

bookPage.addEventListener(

  "touchstart",

  (e)=>{

    touchStartX =
    e.changedTouches[0].screenX;
  }
);

bookPage.addEventListener(

  "touchend",

  (e)=>{

    touchEndX =
    e.changedTouches[0].screenX;

    handleBookSwipe();
  }
);

function handleBookSwipe(){

  const diff =

  touchStartX -
  touchEndX;

  /* LEFT SWIPE */

  if(diff > 50){

    nextBookSpread();
  }

  /* RIGHT SWIPE */

  if(diff < -50){

    prevBookSpread();
  }
}

/* =========================================
   PDF VIEW POINTER SWIPE
========================================= */

let pointerStartX = 0;

let pointerEndX = 0;

let pointerActive = false;

/* USE CONTAINER NOT CANVAS */

const pdfViewerContainer =

document.querySelector(
  ".canvas-container"
);

/* POINTER DOWN */

pdfViewerContainer.addEventListener(

  "pointerdown",

  (e)=>{

    /* ONLY PDF VIEW */

    const viewerActive =

    document
    .getElementById(
      "viewerPage"
    )
    .classList.contains(
      "active"
    );

    if(!viewerActive){

      return;
    }

    pointerActive = true;

    pointerStartX = e.clientX;
    pointerEndX = e.clientX;
  }
);

/* POINTER MOVE */

pdfViewerContainer.addEventListener(

  "pointermove",

  (e)=>{

    if(!pointerActive){

      return;
    }

    pointerEndX = e.clientX;
  }
);

/* POINTER UP */

pdfViewerContainer.addEventListener(

  "pointerup",

  (e)=>{

    if(!pointerActive){

      return;
    }

    pointerActive = false;

    /* IMPORTANT */

    pointerEndX = e.clientX;

    const diff =

    pointerStartX -
    pointerEndX;

    /* IGNORE SMALL SWIPES */

    if(Math.abs(diff) < 80){

      return;
    }

    /* NEXT PAGE */

    if(diff > 0){

      nextPage();

    }

    /* PREV PAGE */

    else{

      prevPage();
    }
  }
);

/* POINTER CANCEL */

pdfViewerContainer.addEventListener(

  "pointercancel",

  ()=>{

    pointerActive = false;
  }
);

/* =========================================
   RESTORE STATE
========================================= */

try{

  const savedState =

  JSON.parse(

    localStorage.getItem(

      "dpgnotes_pdf_state"
    )
  );

  if(savedState){

    currentPage =
    savedState.page
    || currentPage;

    scale =
    savedState.scale
    || scale;
  }

}catch(error){

  console.log(error);
}

/* =========================================
   RESIZE
========================================= */

let resizeTimer;

window.addEventListener(

  "resize",

  ()=>{

    clearTimeout(
      resizeTimer
    );

    resizeTimer =

    setTimeout(()=>{

      renderPage();

    },300);
  }
);

/* =========================================
   INIT
========================================= */

if(pdfURL){

  loadPDF();

}else{

  alert("Missing PDF URL. Redirecting to homepage.");
  window.location.href =

"https://dpgnotes.web.app/" +

"?utm_source=pdfviewer" +

"&utm_medium=referral" +

"&utm_campaign=pdfviewer_redirect" +

"&error=missing_pdf";
}
