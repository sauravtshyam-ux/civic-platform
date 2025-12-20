import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { billsApi } from '../api/bills';
import { Bill, Amendment, RootStackParamList } from '../types';
import { colors, spacing, borderRadius, fontSize } from '../theme/colors';

type BillDetailRouteProp = RouteProp<RootStackParamList, 'BillDetail'>;
type BillDetailNavigationProp = StackNavigationProp<RootStackParamList, 'BillDetail'>;

export const BillDetailScreen: React.FC = () => {
  const route = useRoute<BillDetailRouteProp>();
  const navigation = useNavigation<BillDetailNavigationProp>();
  const { billId } = route.params;

  const [bill, setBill] = useState<(Bill & { amendments: Amendment[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);

  useEffect(() => {
    fetchBillDetail();
  }, [billId]);

  const fetchBillDetail = async () => {
    try {
      const response = await billsApi.getBillById(billId);
      setBill(response.data.bill);
    } catch (error) {
      console.error('Failed to fetch bill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    try {
      await billsApi.voteBill(billId, voteType);
      setUserVote(userVote === voteType ? null : voteType);
      await fetchBillDetail();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleAmendPress = () => {
    navigation.navigate('AmendBill', { billId });
  };

  if (loading || !bill) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: bill.level === 'federal' ? colors.primary : colors.secondary }]}>
            <Text style={styles.badgeText}>{bill.level === 'federal' ? '🏛️ Federal' : `📍 ${bill.state}`}</Text>
          </View>
          <Text style={styles.billNumber}>{bill.billNumber}</Text>
        </View>

        <Text style={styles.title}>{bill.title}</Text>
        
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>Sponsor: {bill.sponsor || 'Unknown'}</Text>
          <Text style={styles.metaText}>Status: {bill.status}</Text>
          {bill.introducedDate && (
            <Text style={styles.metaText}>Introduced: {new Date(bill.introducedDate).toLocaleDateString()}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary 📝</Text>
          <Text style={styles.summary}>{bill.aiSummary || bill.summary}</Text>
        </View>

        <View style={styles.voteSection}>
          <TouchableOpacity
            style={[styles.voteButton, userVote === 'upvote' && styles.voteButtonActive]}
            onPress={() => handleVote('upvote')}
          >
            <Text style={styles.voteButtonText}>👍 {bill.upvotes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.voteButton, userVote === 'downvote' && styles.voteButtonActive]}
            onPress={() => handleVote('downvote')}
          >
            <Text style={styles.voteButtonText}>👎 {bill.downvotes}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.amendButton} onPress={handleAmendPress}>
          <Text style={styles.amendButtonText}>✏️ Propose Amendment</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Amendments ({bill.amendments.length})</Text>
          {bill.amendments.length === 0 ? (
            <Text style={styles.emptyText}>No amendments yet. Be the first!</Text>
          ) : (
            bill.amendments.map((amendment) => (
              <View key={amendment.id} style={styles.amendmentCard}>
                <Text style={styles.amendmentAuthor}>
                  {amendment.user.firstName || 'Anonymous'} {amendment.user.lastName || ''}
                </Text>
                <Text style={styles.amendmentContent}>
                  {amendment.cleanedContent || amendment.content}
                </Text>
                <View style={styles.amendmentVotes}>
                  <Text style={styles.voteText}>👍 {amendment.upvotes}</Text>
                  <Text style={styles.voteText}>👎 {amendment.downvotes}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
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
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  metaContainer: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  metaText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  summary: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 24,
  },
  voteSection: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  voteButton: {
    flex: 1,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  voteButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
  },
  voteButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  amendButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  amendButtonText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.card,
  },
  amendmentCard: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  amendmentAuthor: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  amendmentContent: {
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  amendmentVotes: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  voteText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
