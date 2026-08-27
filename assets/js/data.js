/*
  بيانات ملف الأداء الوظيفي.
  عدّلي القيم هنا لإضافة المحتوى والشواهد لاحقًا — كل الصفحات (الرئيسية ونسخة الإشراف) تقرأ من هذا الملف نفسه.
*/

const BASIC_INFO = {
  name: "---",
  employeeId: "---",
  specialization: "---",
  qualification: "---",
  school: "---",
  yearsOfExperience: "---",
};

/*
  كل معيار: id (رقم المعيار كما ورد من الإدارة)، title (نص المعيار)،
  description: نص تعريفي اختياري، evidence: مصفوفة الشواهد (فارغة الآن).
  عنصر الشاهد الواحد بالشكل:
  { type: "image" | "pdf" | "link" | "text", title: "...", src: "...", note: "..." }
*/

const CRITERIA = [
  { id: 1, title: "أداء الواجبات الوظيفية", description: "", evidence: [] },
  { id: 2, title: "التفاعل مع المجتمع المهني", description: "", evidence: [] },
  { id: 3, title: "التفاعل مع أولياء الأمور", description: "", evidence: [] },
  { id: 4, title: "تحسين نتائج المتعلمين", description: "", evidence: [] },
  { id: 5, title: "", description: "", evidence: [], pending: true },
  { id: 6, title: "إعداد خطة تفصيلية وشاملة للأنشطة", description: "", evidence: [] },
  { id: 7, title: "تصميم خبرات تعلم مرنة ومبتكرة", description: "", evidence: [] },
  { id: 8, title: "توظيف تقنيات ووسائل التعلم المناسبة", description: "", evidence: [] },
  { id: 9, title: "التمكن من المادة العلمية", description: "", evidence: [] },
  { id: 10, title: "استخدام استراتيجيات تدريس فاعلة ومنوعة", description: "", evidence: [] },
  { id: 11, title: "إشراك الأسرة في خطط النمو والتعلم", description: "", evidence: [] },
  { id: 12, title: "تهيئة بيئة تعليمية آمنة ومعززة للتطور والنمو والتعلم", description: "", evidence: [] },
  { id: 13, title: "توفير فرص متنوعة لدعم التفاعلات في بيئة التعلم", description: "", evidence: [] },
  { id: 14, title: "تقوّم تعلم المتعلمين وتتابع تقدمهم بانتظام", description: "", evidence: [] },
  { id: 15, title: "تستثمر نتائج التقويم في تعزيز النمو والتعلم", description: "", evidence: [] },
  { id: 16, title: "تُشرك الأسرة في نتائج التقويم", description: "", evidence: [] },
  { id: 17, title: "تدعم تحقيق مستويات الأداء المستهدفة لكل متعلم", description: "", evidence: [] },
  { id: 18, title: "تدعم مهارات المستقبل لدى المتعلمين", description: "", evidence: [] },
  { id: 19, title: "تدعم اكتساب المتعلمين القيم والمبادئ والاتجاهات", description: "", evidence: [] },
];
