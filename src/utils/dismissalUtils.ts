import { Child, DismissalGroup, DismissalStage, STAGE_ORDER } from '../types';

export function stageIndex(stage: DismissalStage): number {
  return STAGE_ORDER.indexOf(stage);
}

export function childrenInGroup(group: DismissalGroup, allChildren: Child[]): Child[] {
  return allChildren.filter((c) => group.childIds.includes(c.id));
}

export function groupProgress(group: DismissalGroup, allChildren: Child[]) {
  const members = childrenInGroup(group, allChildren);
  const delivered = members.filter((c) => c.stage === 'delivered').length;
  const notStarted = members.filter((c) => c.stage === 'in_class').length;
  return {
    total: members.length,
    delivered,
    notStarted,
    inProgress: members.length - delivered - notStarted,
    ratio: members.length === 0 ? 0 : delivered / members.length,
  };
}

export function overallStageCounts(allChildren: Child[]): Record<DismissalStage, number> {
  const counts = {} as Record<DismissalStage, number>;
  for (const stage of STAGE_ORDER) counts[stage] = 0;
  for (const child of allChildren) counts[child.stage] += 1;
  return counts;
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
}

export function classroomName(classroomId: string, classrooms: { id: string; name: string }[]): string {
  return classrooms.find((c) => c.id === classroomId)?.name ?? '';
}
