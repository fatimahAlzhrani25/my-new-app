/*
  روادع للنسخة المخصصة للإشراف التربوي فقط (عرض بدون تعديل).
  تنبيه: هذه روادع وليست منعًا تقنيًا كاملاً — لا توجد طريقة برمجية تمنع
  التقاط الشاشة من نظام التشغيل أو جهاز آخر. الهدف هو الحد من النسخ
  العرضي وتوثيق هوية المُطّلِع عبر العلامة المائية.
*/

(function () {
  document.body.classList.add("protected");

  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("copy", (e) => e.preventDefault());
  document.addEventListener("cut", (e) => e.preventDefault());
  document.addEventListener("selectstart", (e) => e.preventDefault());
  document.addEventListener("dragstart", (e) => e.preventDefault());

  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    const blockedCombo = (e.ctrlKey || e.metaKey) && ["p", "s", "c", "u"].includes(key);
    if (blockedCombo || key === "printscreen") {
      e.preventDefault();
    }
  });

  function buildWatermark(viewerName) {
    const layer = document.createElement("div");
    layer.className = "watermark-layer";
    const stamp = `${viewerName} — ${new Date().toLocaleString("ar-SA")}`;
    for (let i = 0; i < 40; i++) {
      const span = document.createElement("span");
      span.textContent = stamp;
      layer.appendChild(span);
    }
    document.body.appendChild(layer);
  }

  function showGate() {
    const saved = sessionStorage.getItem("viewerName");
    if (saved) {
      buildWatermark(saved);
      return;
    }

    const gate = document.createElement("div");
    gate.className = "viewer-gate";
    gate.innerHTML = `
      <div class="gate-box">
        <h2>ملف الأداء الوظيفي — نسخة الاطلاع</h2>
        <p>يُرجى إدخال الاسم قبل المتابعة. هذا الملف للاطلاع فقط، ولا يجوز نسخه أو تعديله أو نشره.</p>
        <input type="text" id="viewerNameInput" placeholder="الاسم" autofocus />
        <br />
        <button id="viewerGateBtn">دخول</button>
      </div>
    `;
    document.body.appendChild(gate);

    document.getElementById("viewerGateBtn").addEventListener("click", () => {
      const input = document.getElementById("viewerNameInput");
      const name = input.value.trim() || "مُطّلِع غير معروف";
      sessionStorage.setItem("viewerName", name);
      gate.remove();
      buildWatermark(name);
    });
  }

  document.addEventListener("DOMContentLoaded", showGate);
})();
