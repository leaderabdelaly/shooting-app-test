const LICENSE_KEY = "shehaby_license";
const MASTER_KEY = "SHEHABY-PRO-2026";

function isProUser() {
  return localStorage.getItem(LICENSE_KEY) === "PRO";
}

function activatePro(key) {
  if (key === MASTER_KEY) {
    localStorage.setItem(LICENSE_KEY, "PRO");
    return true;
  }
  return false;
}

function canAddShot(count) {
  return isProUser() || count < 10;
}

function canShowTreatment() {
  return isProUser();
}
