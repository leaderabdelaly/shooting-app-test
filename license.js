let isPro = localStorage.getItem("shehaby_pro") === "true";

function activateProLicense(code) {
  const MASTER = "SHEHABY-PRO-999";

  if (code === MASTER) {
    localStorage.setItem("shehaby_pro", "true");
    return true;
  }

  return false;
}
