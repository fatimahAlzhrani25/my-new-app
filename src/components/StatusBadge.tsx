import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { stageBackgrounds, stageColors } from '../theme/colors';
import { DismissalStage, STAGE_SHORT_LABELS } from '../types';

export function StatusBadge({ stage }: { stage: DismissalStage }) {
  return (
    <View style={[styles.badge, { backgroundColor: stageBackgrounds[stage] }]}>
      <View style={[styles.dot, { backgroundColor: stageColors[stage] }]} />
      <Text style={[styles.text, { color: stageColors[stage] }]}>{STAGE_SHORT_LABELS[stage]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
