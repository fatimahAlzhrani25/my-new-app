import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../src/components/Avatar';
import { StatusBadge } from '../../src/components/StatusBadge';
import { Timeline } from '../../src/components/Timeline';
import { useDismissal } from '../../src/store/dismissalStore';
import { colors } from '../../src/theme/colors';
import { PICKUP_METHOD_LABELS, STAGE_LABELS, STAGE_ORDER } from '../../src/types';
import { classroomName } from '../../src/utils/dismissalUtils';

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { children, classrooms, groups, advanceChild } = useDismissal();

  const child = children.find((c) => c.id === id);
  if (!child) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>لم يتم العثور على بيانات الطالب</Text>
      </View>
    );
  }

  const group = groups.find((g) => g.id === child.groupId);
  const idx = STAGE_ORDER.indexOf(child.stage);
  const isFinal = idx === STAGE_ORDER.length - 1;
  const nextLabel = isFinal ? null : STAGE_LABELS[STAGE_ORDER[idx + 1]];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: child.name }} />

      <View style={styles.profileCard}>
        <Avatar name={child.name} color={child.avatarColor} size={64} />
        <View style={styles.profileText}>
          <Text style={styles.name}>{child.name}</Text>
          <Text style={styles.classroom}>
            {classroomName(child.classroomId, classrooms)} · {group?.name}
          </Text>
        </View>
        <StatusBadge stage={child.stage} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>بيانات ولي الأمر</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoValue}>{child.guardianName}</Text>
          <Text style={styles.infoLabel}>{child.guardianRelation}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoValue}>{child.guardianPhone}</Text>
          <Text style={styles.infoLabel}>رقم الجوال</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoValue}>{PICKUP_METHOD_LABELS[child.pickupMethod]}</Text>
          <Text style={styles.infoLabel}>طريقة الاستلام</Text>
        </View>
        <Pressable
          style={styles.callButton}
          onPress={() => Linking.openURL(`tel:${child.guardianPhone}`)}
        >
          <Ionicons name="call" size={16} color={colors.primary} />
          <Text style={styles.callButtonText}>الاتصال بولي الأمر</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>خط سير الانصراف</Text>
        <Timeline child={child} />
      </View>

      {!isFinal && (
        <Pressable style={styles.advanceButton} onPress={() => advanceChild(child.id)}>
          <Text style={styles.advanceButtonText}>{`تحديث الحالة إلى: ${nextLabel}`}</Text>
        </Pressable>
      )}
    </ScrollView>
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
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileText: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'right',
  },
  classroom: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'right',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  callButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 6,
  },
  callButtonText: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 13,
  },
  advanceButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  advanceButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
