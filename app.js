const canvas = document.getElementById("targetCanvas");
const ctx = canvas.getContext("2d");

let img = new Image();
let center = null;
let shots = [];
let mode = null;

document.getElementById("imageInput").onchange = e => {
  img.src = URL.createObjectURL(e.target.files[0]);
};

img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  draw();
};

function draw() {
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
    if (!canAddShot(shots.length)) {
      alert("النسخة المجانية 10 طلقات فقط");
      return;
    }
    shots.push({x,y});
  }
  draw();
};

function setCenterMode() { mode = "center"; }
function shotMode() { mode = "shot"; }

function analyzeShots() {
  if (!center || shots.length === 0) return;

  let errors = {};
  shots.forEach(s=>{
    const dx = s.x - center.x;
    const dy = s.y - center.y;
    let key =
      dy < -20 ? "أعلى" :
      dy > 20 ? "أسفل" :
      dx < -20 ? "يسار" :
      dx > 20 ? "يمين" :
      "مركز";
    errors[key] = (errors[key] || 0) + 1;
  });

  const main = Object.keys(errors).reduce((a,b)=>errors[a]>errors[b]?a:b);
  document.getElementById("result").innerText =
    "الخطأ الغالب: " + main +
    (canShowTreatment() ? "\nالعلاج: راجع القبضة والتنفس" : "");
}

/* ===== Pro UI ===== */

function openProModal() {
  document.getElementById("proModal").classList.remove("hidden");
}

function closeProModal() {
  document.getElementById("proModal").classList.add("hidden");
}

function submitLicense() {
  const code = document.getElementById("licenseInput").value;
  const days = parseInt(document.getElementById("planSelect").value);

  if (activateLicense(code, days)) {
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
