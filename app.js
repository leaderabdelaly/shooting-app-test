const canvas = document.getElementById("targetCanvas");
const ctx = canvas.getContext("2d");

let img = new Image();
let center = null;
let shots = [];
let mode = null;

/* ===== Image Upload ===== */
document.getElementById("imageInput").onchange = e => {
  img.src = URL.createObjectURL(e.target.files[0]);
};

img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  draw();
};

/* ===== Drawing ===== */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  if (center) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(center.x, center.y, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  shots.forEach((s, i) => {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(s.x, s.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(i + 1, s.x + 6, s.y);
  });
}

/* ===== Canvas Click ===== */
canvas.onclick = e => {
  if (!img.src) return;

  const r = canvas.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;

  // تحديد مركز الهدف
  if (mode === "center") {
    center = { x, y };
    mode = "shot"; // ← التحويل التلقائي لتوقيع الطلقات
    draw();
    return;
  }

  // توقيع الطلقات
  if (mode === "shot") {
    if (!canAddShot(shots.length)) {
      alert("النسخة المجانية تسمح بـ 10 طلقات فقط");
      return;
    }
    shots.push({ x, y });
    draw();
  }
};

/* ===== Modes ===== */
function setCenterMode() {
  mode = "center";
}

function shotMode() {
  if (!center) {
    alert("حدد مركز الهدف أولًا");
    return;
  }
  mode = "shot";
}

/* ===== Analysis ===== */
function analyzeShots() {
  if (!center || shots.length === 0) return;

  let errors = {};

  shots.forEach(s => {
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

  const mainError = Object.keys(errors)
    .reduce((a, b) => errors[a] > errors[b] ? a : b);

  document.getElementById("result").innerText =
    "الخطأ الغالب: " + mainError +
    (canShowTreatment()
      ? "\nالعلاج: راجع القبضة والتنفس وتوازن الوقفة"
      : "");
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
    alert("تم تفعيل النسخة الاحترافية بنجاح");
    location.reload();
  } else {
    alert("كود التفعيل غير صحيح");
  }
}

/* ===== WhatsApp Link ===== */
document.addEventListener("DOMContentLoaded", () => {
  const phone = "201067050007";
  const msg = "طلب تفعيل النسخة الاحترافية\nShehaby Shooting Pro";
  document.getElementById("whatsLink").href =
    "https://wa.me/" + phone + "?text=" + encodeURIComponent(msg);
});
