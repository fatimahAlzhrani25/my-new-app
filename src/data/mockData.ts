import { Child, Classroom, DismissalGroup } from '../types';

export const classrooms: Classroom[] = [
  { id: 'c1', name: 'فصل البراعم', teacherName: 'أ. سارة العتيبي' },
  { id: 'c2', name: 'فصل الفراشات', teacherName: 'أ. منى القحطاني' },
];

export const dismissalGroups: DismissalGroup[] = [
  {
    id: 'g1',
    name: 'الدفعة الأولى',
    gate: 'بوابة أ - الحافلات',
    order: 1,
    childIds: ['ch1', 'ch2', 'ch3', 'ch4', 'ch5'],
  },
  {
    id: 'g2',
    name: 'الدفعة الثانية',
    gate: 'بوابة ب - الاستلام المباشر',
    order: 2,
    childIds: ['ch6', 'ch7', 'ch8', 'ch9', 'ch10', 'ch11'],
  },
  {
    id: 'g3',
    name: 'الدفعة الثالثة',
    gate: 'بوابة ج - المشاة',
    order: 3,
    childIds: ['ch12', 'ch13', 'ch14', 'ch15'],
  },
];

const avatarColors = ['#F2A65A', '#5AA9E6', '#7FB77E', '#E67E9B', '#9B87C4', '#F4C95D'];

function baseChild(
  id: string,
  name: string,
  classroomId: string,
  groupId: string,
  guardianName: string,
  guardianRelation: string,
  guardianPhone: string,
  pickupMethod: Child['pickupMethod'],
  colorIndex: number,
): Child {
  return {
    id,
    name,
    classroomId,
    groupId,
    guardianName,
    guardianRelation,
    guardianPhone,
    pickupMethod,
    avatarColor: avatarColors[colorIndex % avatarColors.length],
    stage: 'in_class',
    stageLog: [{ stage: 'in_class', at: Date.now() }],
  };
}

export const initialChildren: Child[] = [
  baseChild('ch1', 'عبدالله ناصر الشهري', 'c1', 'g1', 'ناصر الشهري', 'الأب', '0501234567', 'bus', 0),
  baseChild('ch2', 'لمى فهد الدوسري', 'c1', 'g1', 'فهد الدوسري', 'الأب', '0502345678', 'bus', 1),
  baseChild('ch3', 'سلطان خالد المطيري', 'c1', 'g1', 'خالد المطيري', 'الأب', '0503456789', 'bus', 2),
  baseChild('ch4', 'جواهر سعد العنزي', 'c2', 'g1', 'سعد العنزي', 'الأب', '0504567890', 'bus', 3),
  baseChild('ch5', 'يوسف ماجد الحربي', 'c2', 'g1', 'ماجد الحربي', 'الأب', '0505678901', 'bus', 4),

  baseChild('ch6', 'ريان بندر القرني', 'c1', 'g2', 'هند القرني', 'الأم', '0506789012', 'guardian', 5),
  baseChild('ch7', 'نورة تركي الغامدي', 'c1', 'g2', 'أمل الغامدي', 'الأم', '0507890123', 'guardian', 0),
  baseChild('ch8', 'فيصل عمر الزهراني', 'c1', 'g2', 'عمر الزهراني', 'الأب', '0508901234', 'guardian', 1),
  baseChild('ch9', 'الجوهرة عادل السبيعي', 'c2', 'g2', 'منيرة السبيعي', 'الأم', '0509012345', 'guardian', 2),
  baseChild('ch10', 'حمد سلمان العصيمي', 'c2', 'g2', 'سلمان العصيمي', 'الأب', '0500123456', 'guardian', 3),
  baseChild('ch11', 'دانة وليد آل مبارك', 'c2', 'g2', 'العنود آل مبارك', 'الجدة', '0501122334', 'guardian', 4),

  baseChild('ch12', 'مشعل إبراهيم البقمي', 'c1', 'g3', 'إبراهيم البقمي', 'الأب', '0502233445', 'walk', 5),
  baseChild('ch13', 'شهد عبدالعزيز آل سعيد', 'c1', 'g3', 'ريم آل سعيد', 'الأم', '0503344556', 'walk', 0),
  baseChild('ch14', 'زياد فهد الشمري', 'c2', 'g3', 'فهد الشمري', 'الأب', '0504455667', 'walk', 1),
  baseChild('ch15', 'غلا ياسر الجهني', 'c2', 'g3', 'وفاء الجهني', 'الأم', '0505566778', 'walk', 2),
];
