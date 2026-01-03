/* ==============================
   Shehaby Shooting Pro
   app.js – Stable Version
   ============================== */

const targetInput = document.getElementById("targetInput");
const targetImg = document.getElementById("targetImg");
const targetContainer = document.getElementById("targetContainer");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultBox = document.getElementById("result");

let shots = [];
let centerPoint = null;

/* ==============================
   Utils
   ============================== */

function getEventPosition(event) {
  const rect = targetImg.getBoundingClientRect();

  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;

  const x = clientX - rect.left;
  const y = clientY - rect.top;

  return { x, y };
}

function drawDot(x, y, className) {
  const dot = document.createElement("div");
  dot.className = className;
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;
  targetContainer.appendChild(dot);
}

/* ==============================
   Load Target Image
   ============================== */

targetInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    targetImg.src = reader.result;
    targetImg.style.display = "block";
    clearShotsOnly();
  };
  reader.readAsDataURL(file);
});

function clearShotsOnly() {
  shots = [];
  centerPoint = null;
  resultBox.innerHTML = "";
  document.querySelectorAll(".shot, .center").forEach(el => el.remove());
}

/* ==============================
   Set Center
   ============================== */

targetImg.addEventListener("dblclick", setCenter);
targetImg.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) setCenter(e);
});

function setCenter(event) {
  event.preventDefault();
  if (!targetImg.src) return;

  document.querySelectorAll(".center").forEach(el => el.remove());

  const pos = getEventPosition(event);
  centerPoint = { x: pos.x, y: pos.y };

  drawDot(pos.x, pos.y, "center");
}

/* ==============================
   Add Shot
   ============================== */

targetImg.addEventListener("click", addShot);
targetImg.addEventListener("touchend", addShot);

function addShot(event) {
  if (!targetImg.src || !centerPoint) return;

  const pos = getEventPosition(event);
  shots.push({ x: pos.x, y: pos.y });

  drawDot(pos.x, pos.y, "shot");
}

/* ==============================
   Analysis
   ============================== */

analyzeBtn.addEventListener("click", analyzeShots);

function analyzeShots() {
  if (!centerPoint || shots.length === 0) {
    resultBox.innerHTML = "❌ حدد مركز الهدف والطلقات أولاً";
    return;
  }

  let dx = 0;
  let dy = 0;

  shots.forEach(s => {
    dx += s.x - centerPoint.x;
    dy += s.y - centerPoint.y;
  });

  dx /= shots.length;
  dy /= shots.length;

 let direction = "";

  if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
    direction = "تجميع ممتاز في المركز";
  } else if (dx > 0 && dy < 0) {
    direction = " يمين أعلى – شد زائد بصباع التريجر مع زق بالمعصم";
  } else if (dx < 0 && dy < 0) {
    direction = "يسار أعلى – زق بالمعصم مع نتش التريجر ";
  } else if (dx > 0 && dy > 0) {
    direction = "يمين أسفل – سقوط السن مع تدخل الأصابع اثناء السحب مع شد التريجر بدخول زائد للسبابة";
  } else if (dx < 0 && dy > 0) {
    direction = "يسار أسفل – نتش التريجر بطرف السبابة مع عدم تثبيت المعصم ";
  } else if (dx > 0) {
    direction = "يمين – تدخل الأصابع اثناء السحب مع شد التريجر بدخول زائد للسبابة ";
  } else if (dx < 0) {
    direction = "يسار – ضغط بأطراف الأصابع على القبضة أو سحب بطرف السبابة ";
  } else if (dy < 0) {
    direction = "أعلى – دفع بالمعصم لأعلى أو سقوط الرأس لأسفل";
  } else if (dy > 0) {
    direction = "أسفل – دفع بالمعصم لأسفل أو رفع الرأس لأعلى";
  }

  resultBox.innerHTML = `
    <h3>نتيجة التحليل</h3>
    <p>عدد الطلقات: ${shots.length}</p>
    <p><strong>الخطأ الغالب:</strong> ${result}</p>
  `;
}