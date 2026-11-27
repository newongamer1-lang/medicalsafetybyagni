(function () {
  const R = window.RIDER || {};
  const $ = (id) => document.getElementById(id);
  const clean = (n) => String(n || "").replace(/[^\d+]/g, "");
  const tel = (n) => "tel:" + clean(n);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // ---------- Age ----------
  function calcAge(dob) {
    const d = new Date(dob);
    if (isNaN(d)) return "";
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age + " years";
  }
  function fmtDate(dob) {
    const d = new Date(dob);
    return isNaN(d) ? dob : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  // ---------- Toast popup ----------
  let toastTimer;
  function toast(msg, ms = 2500) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), ms);
  }

  // ---------- Location ----------
  function getLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (p) => resolve(`https://maps.google.com/?q=${p.coords.latitude.toFixed(6)},${p.coords.longitude.toFixed(6)}`),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  }

  // ---------- SMS ----------
  async function sendSms(numbers) {
    numbers = numbers.map(clean).filter(Boolean);
    if (!numbers.length) return toast("No emergency contact set");
    toast("📍 Getting location for the message…", 8000);
    const loc = await getLocation();
    const body = (R.smsMessage || "EMERGENCY: {name} needs help. Location: {location}")
      .replace("{name}", R.name || "The rider")
      .replace("{location}", loc || "unknown (location not shared)");
    toast(loc ? "Opening SMS with location ✅" : "Opening SMS (no location) ⚠️");
    // iOS uses "&body=", Android "?body=". "?&body=" works on both.
    const recipients = numbers.join(isIOS ? "," : ";");
    window.location.href = `sms:${recipients}?&body=${encodeURIComponent(body)}`;
  }
  const allContacts = () => (R.emergencyContacts || []).map((c) => c.phone);

  // ---------- Render ----------
  document.title = (R.name ? R.name + " – " : "") + "Emergency Info";
  $("name").textContent = R.name || "Unknown rider";
  $("blood").textContent = $("modalBlood").textContent = R.bloodGroup || "?";
  if (R.photo) { $("photo").src = R.photo; $("photo").hidden = false; }

  $("infoName").textContent = R.name || "—";
  $("infoDob").textContent = R.dob ? fmtDate(R.dob) : "—";
  $("infoAge").textContent = R.dob ? calcAge(R.dob) : "—";
  $("infoBlood").textContent = R.bloodGroup || "—";
  if (R.bikeNumber) $("infoBike").textContent = R.bikeNumber; else $("rowBike").remove();
  $("infoPhone").textContent = R.personalPhone || "—";
  if (R.personalPhone) $("infoPhone").href = tel(R.personalPhone);

  // Emergency services
  const S = R.services || {};
  const setCall = (id, num, label) => {
    const el = $(id);
    if (!el) return;
    if (!num) { el.remove(); return; }
    el.href = tel(num);
    el.addEventListener("click", () => toast(`📞 Calling ${label} (${num})…`));
  };
  setCall("callAmbulance", S.ambulance, "Ambulance"); $("ambNum").textContent = S.ambulance || "";
  setCall("callPolice", S.police, "Police");          $("polNum").textContent = S.police || "";
  setCall("callTraffic", S.traffic, "Traffic Police"); $("trfNum").textContent = S.traffic || "";
  setCall("callFire", S.fire, "Fire");                $("fireNum").textContent = S.fire || "";
  setCall("modalAmbulance", S.ambulance, "Ambulance");
  setCall("modalPolice", S.police, "Police");

  // Medical
  const med = [["Allergies", R.allergies], ["Conditions", R.conditions], ["Medications", R.medications], ["Notes", R.notes]]
    .filter(([, v]) => v && String(v).trim());
  if (med.length) {
    $("medicalList").innerHTML = med.map(([k]) => `<div><dt>${k}</dt><dd></dd></div>`).join("");
    $("medicalList").querySelectorAll("dd").forEach((dd, i) => (dd.textContent = med[i][1]));
  } else {
    $("medicalCard").remove();
  }

  // Contacts
  const box = $("contacts");
  (R.emergencyContacts || []).forEach((c) => {
    const row = document.createElement("div");
    row.className = "contact";
    row.innerHTML = `
      <div class="who"><b></b><small></small></div>
      <a class="icon-btn call" aria-label="Call">📞</a>
      <button class="icon-btn sms" aria-label="Send SMS">💬</button>`;
    row.querySelector("b").textContent = c.name || "Contact";
    row.querySelector("small").textContent = [c.relation, c.phone].filter(Boolean).join(" · ");
    const call = row.querySelector(".call");
    call.href = tel(c.phone);
    call.addEventListener("click", () => toast(`📞 Calling ${c.name}…`));
    row.querySelector(".sms").addEventListener("click", () => sendSms([c.phone]));
    box.appendChild(row);
  });
  if (!(R.emergencyContacts || []).length) box.innerHTML = '<p class="hint">No contacts added.</p>';

  $("smsAll").addEventListener("click", () => sendSms(allContacts()));
  $("modalSms").addEventListener("click", () => sendSms(allContacts()));

  // Modal
  const modal = $("sosModal");
  $("closeModal").addEventListener("click", () => modal.classList.remove("show"));
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("show"); });

  // Vibrate to draw attention (Android)
  if (navigator.vibrate) navigator.vibrate([300, 150, 300]);
})();
