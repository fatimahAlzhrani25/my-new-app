/* لوحة الإدارة: تسمح بتعديل assets/data.json وحفظه مباشرة على GitHub. */

let currentSha = null;

function evidenceItemHtml(ev = {}) {
  const type = ev.type || "text";
  return `
    <div class="evidence-item">
      <div class="admin-field full">
        <label>عنوان الشاهد</label>
        <input type="text" class="ev-title" value="${(ev.title || "").replace(/"/g, "&quot;")}" />
      </div>
      <div class="admin-field">
        <label>النوع</label>
        <select class="ev-type">
          <option value="text" ${type === "text" ? "selected" : ""}>نص</option>
          <option value="image" ${type === "image" ? "selected" : ""}>صورة</option>
          <option value="pdf" ${type === "pdf" ? "selected" : ""}>PDF</option>
          <option value="link" ${type === "link" ? "selected" : ""}>رابط</option>
        </select>
      </div>
      <div class="admin-field">
        <label>المسار / الرابط (اختياري)</label>
        <input type="text" class="ev-src" value="${(ev.src || "").replace(/"/g, "&quot;")}" />
      </div>
      <div class="admin-field full">
        <label>ملاحظة (اختياري)</label>
        <textarea class="ev-note">${ev.note || ""}</textarea>
      </div>
      <button type="button" class="btn btn-danger remove-evidence">حذف هذا الشاهد</button>
    </div>
  `;
}

function criterionCardHtml(c) {
  const title = c.pending ? "" : c.title;
  const label = c.pending ? `معيار رقم ${c.id} — بانتظار الإضافة` : `${c.id}. ${c.title}`;
  return `
    <details class="admin-card" data-crit-id="${c.id}" ${c.pending ? "" : "open"}>
      <summary>${label}</summary>
      <div class="admin-card-body">
        <div class="admin-field">
          <label>نص المعيار</label>
          <input type="text" class="crit-title-input" value="${title.replace(/"/g, "&quot;")}" placeholder="أدخلي نص المعيار عند توفره" />
        </div>
        <div class="admin-field">
          <label>وصف عام (اختياري)</label>
          <textarea class="crit-desc-input">${c.description || ""}</textarea>
        </div>
        <label>الشواهد</label>
        <div class="evidence-list">
          ${(c.evidence || []).map(evidenceItemHtml).join("")}
        </div>
        <button type="button" class="btn btn-secondary add-evidence">+ إضافة شاهد</button>
      </div>
    </details>
  `;
}

function renderAdmin(data) {
  const basic = data.basicInfo;
  document.getElementById("adminBasicInfo").innerHTML = `
    <div class="admin-basic-grid">
      <div class="admin-field"><label>الاسم</label><input id="bi-name" value="${basic.name || ""}" /></div>
      <div class="admin-field"><label>الرقم الوظيفي</label><input id="bi-employeeId" value="${basic.employeeId || ""}" /></div>
      <div class="admin-field"><label>التخصص</label><input id="bi-specialization" value="${basic.specialization || ""}" /></div>
      <div class="admin-field"><label>المؤهل</label><input id="bi-qualification" value="${basic.qualification || ""}" /></div>
      <div class="admin-field"><label>المدرسة</label><input id="bi-school" value="${basic.school || ""}" /></div>
      <div class="admin-field"><label>سنوات الخبرة</label><input id="bi-yearsOfExperience" value="${basic.yearsOfExperience || ""}" /></div>
    </div>
  `;

  document.getElementById("adminCriteria").innerHTML = data.criteria.map(criterionCardHtml).join("");
}

function collectFormData() {
  const basicInfo = {
    name: document.getElementById("bi-name").value.trim(),
    employeeId: document.getElementById("bi-employeeId").value.trim(),
    specialization: document.getElementById("bi-specialization").value.trim(),
    qualification: document.getElementById("bi-qualification").value.trim(),
    school: document.getElementById("bi-school").value.trim(),
    yearsOfExperience: document.getElementById("bi-yearsOfExperience").value.trim(),
  };

  const criteria = Array.from(document.querySelectorAll("[data-crit-id]")).map((card) => {
    const id = parseInt(card.dataset.critId, 10);
    const title = card.querySelector(".crit-title-input").value.trim();
    const description = card.querySelector(".crit-desc-input").value.trim();
    const evidence = Array.from(card.querySelectorAll(".evidence-item"))
      .map((item) => ({
        title: item.querySelector(".ev-title").value.trim(),
        type: item.querySelector(".ev-type").value,
        src: item.querySelector(".ev-src").value.trim(),
        note: item.querySelector(".ev-note").value.trim(),
      }))
      .filter((e) => e.title || e.note || e.src);

    const entry = { id, title, description, evidence };
    if (!title) entry.pending = true;
    return entry;
  });

  return { basicInfo, criteria };
}

function setStatus(msg, isError) {
  const el = document.getElementById("statusMsg");
  el.textContent = msg;
  el.className = "status-msg " + (isError ? "error" : "success");
}

function attachDelegatedEvents() {
  document.getElementById("adminCriteria").addEventListener("click", (e) => {
    if (e.target.classList.contains("add-evidence")) {
      const list = e.target.previousElementSibling;
      list.insertAdjacentHTML("beforeend", evidenceItemHtml());
    }
    if (e.target.classList.contains("remove-evidence")) {
      e.target.closest(".evidence-item").remove();
    }
  });

  document.getElementById("saveBtn").addEventListener("click", async () => {
    setStatus("جارٍ الحفظ...", false);
    try {
      const newData = collectFormData();
      currentSha = await saveDataFile(newData, currentSha);
      setStatus("تم الحفظ بنجاح ✓", false);
    } catch (err) {
      setStatus("تعذّر الحفظ: " + err.message, true);
    }
  });

  document.getElementById("reloadBtn").addEventListener("click", loadAdmin);

  document.getElementById("signOutBtn").addEventListener("click", () => {
    clearToken();
    window.location.reload();
  });
}

async function loadAdmin() {
  setStatus("جارٍ التحميل...", false);
  try {
    const { data, sha } = await fetchDataFile();
    currentSha = sha;
    renderAdmin(data);
    setStatus("تم التحميل. عدّلي الحقول ثم اضغطي حفظ.", false);
  } catch (err) {
    setStatus("تعذّر تحميل البيانات: " + err.message, true);
  }
}

async function showGateOrAdmin() {
  const gate = document.getElementById("tokenGate");
  const main = document.getElementById("adminMain");

  if (!getToken()) {
    gate.style.display = "flex";
    main.style.display = "none";
    return;
  }

  try {
    await verifyToken();
    gate.style.display = "none";
    main.style.display = "block";
    attachDelegatedEvents();
    await loadAdmin();
  } catch (err) {
    clearToken();
    gate.style.display = "flex";
    main.style.display = "none";
    document.getElementById("gateError").textContent = "الرمز غير صالح أو منتهي. أدخلي رمزًا جديدًا.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  showGateOrAdmin();

  document.getElementById("tokenGateBtn").addEventListener("click", () => {
    const input = document.getElementById("tokenInput");
    const token = input.value.trim();
    if (!token) return;
    setToken(token);
    showGateOrAdmin();
  });
});
