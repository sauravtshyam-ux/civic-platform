import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bill } from '../types';
import { colors, spacing, borderRadius, fontSize } from '../theme/colors';

interface BillCardProps {
  bill: Bill;
  onPress: () => void;
}

export const BillCard: React.FC<BillCardProps> = ({ bill, onPress }) => {
  const displaySummary = bill.aiSummary || bill.summary;
  const truncatedSummary = displaySummary.length > 150 
    ? displaySummary.substring(0, 150) + '...' 
    : displaySummary;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: bill.level === 'federal' ? colors.primary : colors.secondary }]}>
          <Text style={styles.badgeText}>{bill.level === 'federal' ? '🏛️ Federal' : `📍 ${bill.state}`}</Text>
        </View>
        <Text style={styles.billNumber}>{bill.billNumber}</Text>
      </View>
      
      <Text style={styles.title}>{bill.title}</Text>
      <Text style={styles.summary}>{truncatedSummary}</Text>
      
      <View style={styles.footer}>
        <View style={styles.voteContainer}>
          <Text style={styles.voteText}>👍 {bill.upvotes}</Text>
          <Text style={styles.voteText}>👎 {bill.downvotes}</Text>
        </View>
        <Text style={styles.status}>{bill.status}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    color: colors.card,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  billNumber: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  summary: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voteContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  voteText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: '600',
  },
  status: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
