import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from '../../src/components/ProgressBar';
import { useDismissal } from '../../src/store/dismissalStore';
import { colors } from '../../src/theme/colors';
import { groupProgress } from '../../src/utils/dismissalUtils';

export default function GroupsScreen() {
  const { children, groups } = useDismissal();
  const router = useRouter();

  const sortedGroups = groups.slice().sort((a, b) => a.order - b.order);

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={sortedGroups}
      keyExtractor={(item) => item.id}
      renderItem={({ item: group }) => {
        const progress = groupProgress(group, children);
        const allDelivered = progress.total > 0 && progress.delivered === progress.total;
        return (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => router.push(`/group/${group.id}`)}
          >
            <View style={styles.header}>
              <View style={[styles.orderBadge, allDelivered && styles.orderBadgeDone]}>
                <Text style={[styles.orderText, allDelivered && styles.orderTextDone]}>{group.order}</Text>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.name}>{group.name}</Text>
                <Text style={styles.gate}>{group.gate}</Text>
              </View>
            </View>
            <ProgressBar ratio={progress.ratio} />
            <View style={styles.statsRow}>
              <Text style={styles.statText}>بالانتظار: {progress.notStarted}</Text>
              <Text style={styles.statText}>جاري التفويج: {progress.inProgress}</Text>
              <Text style={styles.statText}>تم التسليم: {progress.delivered}</Text>
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  orderBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderBadgeDone: {
    backgroundColor: colors.primary,
  },
  orderText: {
    fontWeight: '800',
    color: colors.primaryDark,
  },
  orderTextDone: {
    color: '#FFFFFF',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'right',
  },
  gate: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  statText: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
