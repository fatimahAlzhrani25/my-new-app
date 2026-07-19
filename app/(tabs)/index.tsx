import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from '../../src/components/ProgressBar';
import { colors, stageColors } from '../../src/theme/colors';
import { useDismissal } from '../../src/store/dismissalStore';
import { DismissalStage, STAGE_LABELS, STAGE_ORDER } from '../../src/types';
import { groupProgress, overallStageCounts } from '../../src/utils/dismissalUtils';

const today = new Date().toLocaleDateString('ar-SA', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export default function DashboardScreen() {
  const { children, groups, resetDay } = useDismissal();
  const router = useRouter();

  const counts = overallStageCounts(children);
  const total = children.length;
  const delivered = counts.delivered;

  function handleReset() {
    Alert.alert('بدء يوم انصراف جديد', 'سيتم إعادة جميع الطلاب إلى حالة "في الفصل". هل تريد المتابعة؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'تأكيد', style: 'destructive', onPress: resetDay },
    ]);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View>
        <Text style={styles.date}>{today}</Text>
        <Text style={styles.title}>متابعة الانصراف اليومي</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryCount}>
            {delivered} / {total}
          </Text>
          <Text style={styles.summaryLabel}>تم تسليمهم لأولياء الأمور</Text>
        </View>
        <ProgressBar ratio={total === 0 ? 0 : delivered / total} />
      </View>

      <Text style={styles.sectionTitle}>حالة الطلاب حسب المرحلة</Text>
      <View style={styles.stageGrid}>
        {STAGE_ORDER.map((stage: DismissalStage) => (
          <View key={stage} style={styles.stageTile}>
            <View style={[styles.stageDot, { backgroundColor: stageColors[stage] }]} />
            <Text style={styles.stageCount}>{counts[stage]}</Text>
            <Text style={styles.stageLabel}>{STAGE_LABELS[stage]}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>دفعات التفويج</Text>
      <View style={styles.groupsList}>
        {groups
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((group) => {
            const progress = groupProgress(group, children);
            return (
              <Pressable
                key={group.id}
                style={({ pressed }) => [styles.groupCard, pressed && styles.groupCardPressed]}
                onPress={() => router.push(`/group/${group.id}`)}
              >
                <View style={styles.groupCardHeader}>
                  <Text style={styles.groupOrder}>{group.order}</Text>
                  <View style={styles.groupCardText}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.groupGate}>{group.gate}</Text>
                  </View>
                </View>
                <ProgressBar ratio={progress.ratio} />
                <Text style={styles.groupProgressText}>
                  {progress.delivered} من {progress.total} تم تسليمهم
                </Text>
              </Pressable>
            );
          })}
      </View>

      <Pressable style={({ pressed }) => [styles.resetButton, pressed && styles.resetButtonPressed]} onPress={handleReset}>
        <Text style={styles.resetButtonText}>بدء يوم انصراف جديد</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 20,
    paddingBottom: 40,
  },
  date: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'right',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'right',
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryHeader: {
    alignItems: 'flex-end',
  },
  summaryCount: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'right',
  },
  stageGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 10,
  },
  stageTile: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    width: '31%',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stageCount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  stageLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
  groupsList: {
    gap: 12,
  },
  groupCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  groupCardPressed: {
    opacity: 0.7,
  },
  groupCardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  groupOrder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    color: colors.primaryDark,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '800',
    overflow: 'hidden',
  },
  groupCardText: {
    flex: 1,
  },
  groupName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'right',
  },
  groupGate: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
  },
  groupProgressText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
  },
  resetButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.danger,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonPressed: {
    opacity: 0.6,
  },
  resetButtonText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 14,
  },
});
