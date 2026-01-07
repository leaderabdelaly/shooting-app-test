const LICENSE_KEY = "shehaby_license";
const MASTER_KEY = "SHEHABY-MASTER-2026";

function now() {
  return Date.now();
}

function saveLicense(data) {
  localStorage.setItem(LICENSE_KEY, JSON.stringify(data));
}

function loadLicense() {
  const raw = localStorage.getItem(LICENSE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function isProUser() {
  const lic = loadLicense();
  if (!lic) return false;
  if (now() > lic.expires) {
    localStorage.removeItem(LICENSE_KEY);
    return false;
  }
  return true;
}

function activateLicense(code, days) {
  if (code === MASTER_KEY) {
    saveLicense({ expires: now() + 1000 * 60 * 60 * 24 * 365 * 50 });
    return true;
  }

  if (!code.startsWith("SHP-" + days)) return false;

  saveLicense({
    expires: now() + days * 24 * 60 * 60 * 1000
  });
  return true;
}

function canAddShot(count) {
  return isProUser() || count < 10;
}

function canShowTreatment() {
  return isProUser();
}
