import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, stageColors } from '../theme/colors';
import { Child, STAGE_LABELS, STAGE_ORDER } from '../types';
import { formatTime, stageIndex } from '../utils/dismissalUtils';

export function Timeline({ child }: { child: Child }) {
  const currentIndex = stageIndex(child.stage);

  return (
    <View>
      {STAGE_ORDER.map((stage, idx) => {
        const logEntry = child.stageLog.find((entry) => entry.stage === stage);
        const isDone = idx < currentIndex || (idx === currentIndex && !!logEntry);
        const isCurrent = idx === currentIndex;
        const isLast = idx === STAGE_ORDER.length - 1;
        const dotColor = isDone || isCurrent ? stageColors[stage] : colors.border;

        return (
          <View key={stage} style={styles.row}>
            <View style={styles.rail}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: dotColor },
                  isCurrent && styles.dotCurrent,
                ]}
              />
              {!isLast && (
                <View
                  style={[styles.line, { backgroundColor: idx < currentIndex ? stageColors[stage] : colors.border }]}
                />
              )}
            </View>
            <View style={styles.textBlock}>
              <Text style={[styles.label, isCurrent && styles.labelCurrent]}>{STAGE_LABELS[stage]}</Text>
              <Text style={styles.time}>{logEntry ? formatTime(logEntry.at) : '—'}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    minHeight: 56,
  },
  rail: {
    alignItems: 'center',
    width: 28,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dotCurrent: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  line: {
    flex: 1,
    width: 2,
    marginVertical: 2,
  },
  textBlock: {
    flex: 1,
    paddingRight: 12,
    paddingBottom: 12,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  labelCurrent: {
    fontWeight: '800',
  },
  time: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
