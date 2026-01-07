const canvas = document.getElementById("targetCanvas");
const ctx = canvas.getContext("2d");

let img = new Image();
let center = null;
let shots = [];
let mode = null;

document.getElementById("imageInput").onchange = e => {
  const file = e.target.files[0];
  img.src = URL.createObjectURL(file);
};

img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  redraw();
};

function redraw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(img,0,0);

  if (center) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(center.x, center.y, 6, 0, Math.PI*2);
    ctx.fill();
  }

  shots.forEach((s,i)=>{
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(s.x, s.y, 5, 0, Math.PI*2);
    ctx.fill();
    ctx.fillText(i+1, s.x+6, s.y);
  });
}

canvas.onclick = e => {
  const r = canvas.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;

  if (mode === "center") center = {x,y};
  if (mode === "shot") {
    if (!isPro && shots.length >= 10) {
      alert("النسخة المجانية 10 طلقات فقط");
      return;
    }
    shots.push({x,y});
  }
  redraw();
};

function setCenterMode() { mode = "center"; }
function shotMode() { mode = "shot"; }

function analyzeShots() {
  if (!center || shots.length === 0) return;

  let result = {};
  shots.forEach(s=>{
    const dx = s.x - center.x;
    const dy = s.y - center.y;
    let key =
      dy < -20 ? "أعلى" :
      dy > 20 ? "أسفل" :
      dx < -20 ? "يسار" :
      dx > 20 ? "يمين" :
      "مركز";
    result[key] = (result[key]||0)+1;
  });

  let max = Object.keys(result).reduce((a,b)=>result[a]>result[b]?a:b);
  document.getElementById("result").innerText =
    "الخطأ الغالب: " + max +
    (isPro ? "\nالعلاج: راجع قبضة السلاح والتنفس" : "");
}

/* ===== Pro ===== */

function openProModal() {
  document.getElementById("proModal").classList.remove("hidden");
}

function closeProModal() {
  document.getElementById("proModal").classList.add("hidden");
}

function submitLicenseCode() {
  const code = document.getElementById("licenseInput").value;
  if (activateProLicense(code)) {
    alert("تم التفعيل");
    location.reload();
  } else {
    alert("كود غير صحيح");
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  const phone = "201067050007";
  const msg = "طلب تفعيل النسخة الاحترافية\nShehaby Shooting Pro";
  document.getElementById("whatsLink").href =
    "https://wa.me/"+phone+"?text="+encodeURIComponent(msg);
});
