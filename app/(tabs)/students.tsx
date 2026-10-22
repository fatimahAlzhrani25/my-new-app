import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ChildRow } from '../../src/components/ChildRow';
import { useDismissal } from '../../src/store/dismissalStore';
import { colors } from '../../src/theme/colors';
import { DismissalStage, STAGE_ORDER, STAGE_SHORT_LABELS } from '../../src/types';
import { classroomName } from '../../src/utils/dismissalUtils';

export default function StudentsScreen() {
  const { children, classrooms } = useDismissal();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<DismissalStage | 'all'>('all');

  const filtered = useMemo(() => {
    return children
      .filter((c) => (stageFilter === 'all' ? true : c.stage === stageFilter))
      .filter((c) => {
        if (!query.trim()) return true;
        const q = query.trim();
        return c.name.includes(q) || c.guardianName.includes(q);
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  }, [children, query, stageFilter]);

  return (
    <View style={styles.screen}>
      <View style={styles.searchBar}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="ابحث عن طالب أو ولي أمر"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
        contentContainerStyle={styles.filtersContent}
        data={['all', ...STAGE_ORDER] as (DismissalStage | 'all')[]}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const active = stageFilter === item;
          return (
            <Pressable
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setStageFilter(item)}
            >
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                {item === 'all' ? 'الكل' : STAGE_SHORT_LABELS[item]}
              </Text>
            </Pressable>
          );
        }}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <Text style={styles.empty}>لا يوجد طلاب مطابقين للبحث</Text>
        }
        renderItem={({ item: child }) => (
          <ChildRow
            child={child}
            subtitle={classroomName(child.classroomId, classrooms)}
            onPress={() => router.push(`/student/${child.id}`)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    textAlign: 'right',
    color: colors.text,
  },
  filters: {
    marginTop: 12,
    flexGrow: 0,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row-reverse',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  list: {
    padding: 16,
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 30,
  },
});
