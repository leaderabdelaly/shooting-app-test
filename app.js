const targetInput = document.getElementById("targetInput");
const targetImg = document.getElementById("targetImg");
const targetContainer = document.getElementById("targetContainer");
const analyzeBtn = document.getElementById("analyzeBtn");
const setCenterBtn = document.getElementById("setCenterBtn");
const resultBox = document.getElementById("result");
const langBtn = document.getElementById("langBtn");
const licenseStatus = document.getElementById("licenseStatus");
const activateBtn = document.getElementById("activateBtn");
const licenseInput = document.getElementById("licenseInput");

let shots = [];
let center = null;
let currentLang = "ar";
let langData = {};

fetch("lang.json").then(r => r.json()).then(d => {
  langData = d;
  applyLang();
});

function applyLang() {
  document.getElementById("appTitle").innerText = langData[currentLang].title;
  analyzeBtn.innerText = langData[currentLang].analyze;
  setCenterBtn.innerText = langData[currentLang].setCenter;
  activateBtn.innerText = langData[currentLang].activate;
  licenseStatus.innerText = isProUser() ? langData[currentLang].pro : langData[currentLang].free;
  langBtn.innerText = currentLang === "ar" ? "EN" : "AR";
}

langBtn.onclick = () => {
  currentLang = currentLang === "ar" ? "en" : "ar";
  applyLang();
};

targetInput.onchange = e => {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    targetImg.src = r.result;
    resetAll();
  };
  r.readAsDataURL(f);
};

function resetAll() {
  shots = [];
  center = null;
  resultBox.innerHTML = "";
  document.querySelectorAll(".shot,.center").forEach(e => e.remove());
}

setCenterBtn.onclick = () => {
  targetImg.onclick = e => {
    const rect = targetImg.getBoundingClientRect();
    center = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    document.querySelectorAll(".center").forEach(e => e.remove());
    drawDot(center.x, center.y, "center");
    targetImg.onclick = addShot;
  };
};

function addShot(e) {
  if (!center) return;
  if (!canAddShot(shots.length)) {
    alert(langData[currentLang].free);
    return;
  }
  const rect = targetImg.getBoundingClientRect();
  const p = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  shots.push(p);
  drawDot(p.x, p.y, "shot");
}

function drawDot(x, y, cls) {
  const d = document.createElement("div");
  d.className = cls;
  d.style.left = x + "px";
  d.style.top = y + "px";
  targetContainer.appendChild(d);
}

analyzeBtn.onclick = () => {
  if (!center || shots.length === 0) {
    resultBox.innerText = langData[currentLang].noData;
    return;
  }
  let dx = 0, dy = 0;
  shots.forEach(s => {
    dx += s.x - center.x;
    dy += s.y - center.y;
  });
  dx /= shots.length;
  dy /= shots.length;

  let error = "OK";
  if (dx > 15) error = "Right pressure";
  if (dx < -15) error = "Left grip";
  if (dy > 15) error = "Wrist down";
  if (dy < -15) error = "Wrist up";

  resultBox.innerHTML = `
    <p>Shots: ${shots.length}</p>
    <p>Error: ${error}</p>
    ${canShowTreatment() ? "<p>Treatment: Grip & trigger control</p>" : `<p>${langData[currentLang].upgrade}</p>`}
  `;
};

activateBtn.onclick = () => {
  if (activatePro(licenseInput.value.trim())) {
    applyLang();
    alert("Pro Activated");
  } else {
    alert("Invalid Key");
  }
};
