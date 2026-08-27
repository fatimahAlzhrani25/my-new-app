/* منطق العرض المشترك بين الصفحة الرئيسية ونسخة الإشراف التربوي. */

async function loadSiteData() {
  const res = await fetch("assets/data.json", { cache: "no-store" });
  if (!res.ok) throw new Error("تعذّر تحميل بيانات الموقع");
  return res.json();
}

function renderBasicInfo(container, basicInfo) {
  container.innerHTML = `
    <h2>البيانات الأساسية</h2>
    <dl>
      <dt>الاسم</dt><dd>${basicInfo.name}</dd>
      <dt>الرقم الوظيفي</dt><dd>${basicInfo.employeeId}</dd>
      <dt>التخصص</dt><dd>${basicInfo.specialization}</dd>
      <dt>المؤهل</dt><dd>${basicInfo.qualification}</dd>
      <dt>المدرسة</dt><dd>${basicInfo.school}</dd>
      <dt>سنوات الخبرة</dt><dd>${basicInfo.yearsOfExperience}</dd>
    </dl>
  `;
}

function renderNav(container, criteria, activeId) {
  container.innerHTML = criteria.map((c) => {
    const classes = ["nav-item"];
    if (c.id === activeId) classes.push("active");
    if (c.pending) classes.push("pending");
    const label = c.pending ? "بانتظار الإضافة" : c.title;
    return `<a href="#criterion-${c.id}" class="${classes.join(" ")}">
      <span class="crit-num">${c.id}</span>
      <span>${label}</span>
    </a>`;
  }).join("");
}

function renderOverview(container, criteria) {
  container.innerHTML = `
    <h2>نظرة عامة على المعايير</h2>
    <div class="overview-grid">
      ${criteria.map((c) => {
        if (c.pending) {
          return `<div class="overview-card pending">
            <span class="crit-num">${c.id}</span>
            <div><strong>معيار رقم ${c.id}</strong><p>بانتظار الإضافة</p></div>
          </div>`;
        }
        return `<a class="overview-card" href="#criterion-${c.id}">
          <span class="crit-num">${c.id}</span>
          <div><strong>${c.title}</strong><p>${c.evidence.length} شاهد مُضاف</p></div>
        </a>`;
      }).join("")}
    </div>
  `;
}

function renderCriterion(container, criteria, id) {
  const c = criteria.find((x) => x.id === id);
  if (!c || c.pending) {
    container.innerHTML = `<div class="empty-state">هذا المعيار بانتظار الإضافة لاحقًا.</div>`;
    return;
  }

  const evidenceHtml = c.evidence.length
    ? `<div class="evidence-grid">${c.evidence
        .map(
          (e) => `<div class="evidence-card">
            <strong>${e.title || "شاهد"}</strong>
            ${e.note ? `<p>${e.note}</p>` : ""}
          </div>`
        )
        .join("")}</div>`
    : `<div class="empty-state">لا توجد شواهد مُضافة لهذا المعيار بعد.</div>`;

  container.innerHTML = `
    <div class="criterion-header">
      <span class="crit-num-large">${c.id}</span>
      <h2>${c.title}</h2>
    </div>
    ${c.description ? `<p>${c.description}</p>` : ""}
    ${evidenceHtml}
  `;
}

async function initPage({ basicInfoEl, navEl, contentEl }) {
  let data;
  try {
    data = await loadSiteData();
  } catch (err) {
    contentEl.innerHTML = `<div class="empty-state">تعذّر تحميل بيانات الموقع. حاولي تحديث الصفحة.</div>`;
    return;
  }

  renderBasicInfo(basicInfoEl, data.basicInfo);

  function route() {
    const hash = window.location.hash.replace("#criterion-", "");
    const id = parseInt(hash, 10);
    renderNav(navEl, data.criteria, id || null);
    if (id) {
      renderCriterion(contentEl, data.criteria, id);
    } else {
      renderOverview(contentEl, data.criteria);
    }
  }

  window.addEventListener("hashchange", route);
  route();
}
