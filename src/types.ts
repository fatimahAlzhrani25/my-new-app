export type DismissalStage =
  | 'in_class'
  | 'called'
  | 'hallway'
  | 'yard'
  | 'with_guardian'
  | 'delivered';

export const STAGE_ORDER: DismissalStage[] = [
  'in_class',
  'called',
  'hallway',
  'yard',
  'with_guardian',
  'delivered',
];

export const STAGE_LABELS: Record<DismissalStage, string> = {
  in_class: 'في الفصل',
  called: 'تم النداء',
  hallway: 'في الممر',
  yard: 'في ساحة الانصراف',
  with_guardian: 'مع ولي الأمر',
  delivered: 'تم التسليم',
};

export const STAGE_SHORT_LABELS: Record<DismissalStage, string> = {
  in_class: 'بالفصل',
  called: 'تم النداء',
  hallway: 'بالممر',
  yard: 'بالساحة',
  with_guardian: 'مع الولي',
  delivered: 'تم التسليم',
};

export type PickupMethod = 'guardian' | 'bus' | 'walk';

export const PICKUP_METHOD_LABELS: Record<PickupMethod, string> = {
  guardian: 'استلام مباشر',
  bus: 'حافلة مدرسية',
  walk: 'مشاة',
};

export interface Classroom {
  id: string;
  name: string;
  teacherName: string;
}

export interface StageLogEntry {
  stage: DismissalStage;
  at: number;
}

export interface Child {
  id: string;
  name: string;
  classroomId: string;
  groupId: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  pickupMethod: PickupMethod;
  avatarColor: string;
  stage: DismissalStage;
  stageLog: StageLogEntry[];
  notes?: string;
}

export interface DismissalGroup {
  id: string;
  name: string;
  gate: string;
  order: number;
  childIds: string[];
}
