import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Child, PICKUP_METHOD_LABELS } from '../types';
import { colors } from '../theme/colors';
import { Avatar } from './Avatar';
import { StatusBadge } from './StatusBadge';

export function ChildRow({
  child,
  subtitle,
  onPress,
  rightAction,
}: {
  child: Child;
  subtitle?: string;
  onPress?: () => void;
  rightAction?: React.ReactNode;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <Avatar name={child.name} color={child.avatarColor} />
      <View style={styles.info}>
        <Text style={styles.name}>{child.name}</Text>
        <Text style={styles.subtitle}>
          {subtitle ?? `${child.guardianRelation} ${child.guardianName} · ${PICKUP_METHOD_LABELS[child.pickupMethod]}`}
        </Text>
      </View>
      <View style={styles.right}>
        <StatusBadge stage={child.stage} />
        {rightAction}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowPressed: {
    opacity: 0.7,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
  },
  right: {
    alignItems: 'flex-end',
    gap: 8,
  },
});
