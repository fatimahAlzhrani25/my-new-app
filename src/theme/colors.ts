import { DismissalStage } from '../types';

export const colors = {
  background: '#F5F7F2',
  card: '#FFFFFF',
  primary: '#2F8F5B',
  primaryDark: '#1F6B41',
  primaryLight: '#E3F2E8',
  text: '#1F2A24',
  textMuted: '#6B776F',
  border: '#E3E8E2',
  danger: '#D65D5D',
  warning: '#E8A33D',
};

export const stageColors: Record<DismissalStage, string> = {
  in_class: '#9AA5A0',
  called: '#E8A33D',
  hallway: '#5AA9E6',
  yard: '#9B87C4',
  with_guardian: '#E67E9B',
  delivered: '#2F8F5B',
};

export const stageBackgrounds: Record<DismissalStage, string> = {
  in_class: '#EEF0EE',
  called: '#FBF0DC',
  hallway: '#E4F0FB',
  yard: '#EFEBF7',
  with_guardian: '#FBEAEF',
  delivered: '#E3F2E8',
};
