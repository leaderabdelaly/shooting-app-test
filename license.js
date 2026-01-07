/* ==================================================
   Shehaby Shooting Pro
   Professional License System
   Month / Year – Time Based
   ================================================== */

/*
  FREE:
   - 10 shots max
   - Error analysis only

  PRO:
   - Unlimited shots
   - Error + Treatment
   - Valid for period (30 / 365 days)
*/

/* ===== Storage Keys ===== */
const LICENSE_KEY = "shehaby_license_data";

/* ===== Master Key (YOU ONLY) ===== */
const MASTER_KEY = "SHEHABY-MASTER-2026";

/* ===== License Structure =====
{
  type: "PRO",
  expiresAt: timestamp
}
================================ */

/* ===== Helpers ===== */

function getNow() {
  return new Date().getTime();
}

function saveLicense(data) {
  localStorage.setItem(LICENSE_KEY, JSON.stringify(data));
}

function loadLicense() {
  const raw = localStorage.getItem(LICENSE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearLicense() {
  localStorage.removeItem(LICENSE_KEY);
}

/* ===== License Checks ===== */

function isProUser() {
  const lic = loadLicense();
  if (!lic) return false;
  if (lic.type !== "PRO") return false;

  if (getNow() > lic.expiresAt) {
    clearLicense();
    return false;
  }
  return true;
}

function getRemainingDays() {
  const lic = loadLicense();
  if (!lic) return 0;
  return Math.ceil((lic.expiresAt - getNow()) / (1000 * 60 * 60 * 24));
}

/* ===== Activation ===== */

function activateLicense(code) {
  // MASTER KEY – lifetime (for you only)
  if (code === MASTER_KEY) {
    saveLicense({
      type: "PRO",
      expiresAt: getNow() + 1000 * 60 * 60 * 24 * 365 * 50
    });
    return { success: true, message: "تم تفعيل النسخة الاحترافية (ماستر)" };
  }

  /*
    Expected Code Format:
    SHP-30-XXXXXXXX
    SHP-365-XXXXXXXX
  */

  if (!code.startsWith("SHP-")) {
    return { success: false, message: "كود غير صالح" };
  }

  const parts = code.split("-");
  if (parts.length !== 3) {
    return { success: false, message: "كود غير صالح" };
  }

  const days = parseInt(parts[1]);
  if (![30, 365].includes(days)) {
    return { success: false, message: "مدة غير مدعومة" };
  }

  // simple validity check
  const token = parts[2];
  if (token.length !== 8) {
    return { success: false, message: "كود غير صحيح" };
  }

  saveLicense({
    type: "PRO",
    expiresAt: getNow() + days * 24 * 60 * 60 * 1000
  });

  return {
    success: true,
    message: `تم تفعيل النسخة الاحترافية لمدة ${days} يوم`
  };
}

/* ===== Restrictions ===== */

function canAddShot(currentShots) {
  if (isProUser()) return true;
  return currentShots < 10;
}

function canShowTreatment() {
  return isProUser();
}
