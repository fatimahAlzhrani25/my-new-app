import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChildRow } from '../../src/components/ChildRow';
import { ProgressBar } from '../../src/components/ProgressBar';
import { useDismissal } from '../../src/store/dismissalStore';
import { colors } from '../../src/theme/colors';
import { STAGE_LABELS, STAGE_ORDER } from '../../src/types';
import { childrenInGroup, groupProgress } from '../../src/utils/dismissalUtils';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { children, groups, callGroup, advanceChild } = useDismissal();
  const router = useRouter();

  const group = groups.find((g) => g.id === id);
  if (!group) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>لم يتم العثور على الدفعة</Text>
      </View>
    );
  }

  const members = childrenInGroup(group, children);
  const progress = groupProgress(group, children);
  const waitingCount = members.filter((c) => c.stage === 'in_class').length;

  function handleCallGroup() {
    Alert.alert('نداء الدفعة', `سيتم نداء جميع طلاب "${group!.name}" من الفصل إلى نقطة الانصراف.`, [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'نداء الآن', onPress: () => callGroup(group!.id) },
    ]);
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: group.name }} />
      <View style={styles.header}>
        <Text style={styles.gate}>{group.gate}</Text>
        <ProgressBar ratio={progress.ratio} />
        <Text style={styles.progressText}>
          {progress.delivered} من {progress.total} تم تسليمهم لأولياء الأمور
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.callButton,
            waitingCount === 0 && styles.callButtonDisabled,
            pressed && waitingCount > 0 && styles.callButtonPressed,
          ]}
          disabled={waitingCount === 0}
          onPress={handleCallGroup}
        >
          <Text style={styles.callButtonText}>
            {waitingCount === 0 ? 'تم نداء جميع الطلاب' : `نداء الدفعة (${waitingCount} بالانتظار)`}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item: child }) => {
          const idx = STAGE_ORDER.indexOf(child.stage);
          const isFinal = idx === STAGE_ORDER.length - 1;
          const nextLabel = isFinal ? null : STAGE_LABELS[STAGE_ORDER[idx + 1]];
          return (
            <ChildRow
              child={child}
              onPress={() => router.push(`/student/${child.id}`)}
              rightAction={
                !isFinal ? (
                  <Pressable style={styles.advanceButton} onPress={() => advanceChild(child.id)}>
                    <Text style={styles.advanceButtonText}>{`إلى: ${nextLabel}`}</Text>
                  </Pressable>
                ) : undefined
              }
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFound: {
    color: colors.textMuted,
  },
  header: {
    padding: 16,
    gap: 10,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  gate: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'right',
  },
  progressText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
  },
  callButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
  },
  callButtonDisabled: {
    backgroundColor: colors.border,
  },
  callButtonPressed: {
    opacity: 0.85,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  list: {
    padding: 16,
  },
  advanceButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  advanceButtonText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '700',
  },
});
