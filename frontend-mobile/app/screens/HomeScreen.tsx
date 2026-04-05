import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { BillCard } from '../components/BillCard';
import { billsApi } from '../api/bills';
import { Bill, RootStackParamList } from '../types';
import { colors, spacing, fontSize } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { demoBills } from '../data/demoBills';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();

  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBills = async () => {
    try {
      const response = await billsApi.getFeed({
        state: user?.state,
        district: user?.district,
        page: 1,
        limit: 20,
      });

      const liveBills = response.data?.bills ?? [];
      setBills(liveBills);
      console.log('Loaded live bills from API');
    } catch (error) {
      console.error('Failed to fetch bills (using demo data):', error);
      setBills(demoBills as Bill[]);
      console.log('Using demo fallback bills');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBills();
  };

  const handleBillPress = (bill: Bill) => {
    navigation.navigate('BillDetail', {
      billId: bill.id,
      bill,
    } as never);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Bills Feed 📜</Text>
        {user?.state && (
          <Text style={styles.headerSubtitle}>
            {user.state} {user.district ? `District ${user.district}` : ''}
          </Text>
        )}
      </View>

      <FlatList
        data={bills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BillCard bill={item} onPress={() => handleBillPress(item)} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bills found</Text>
            <Text style={styles.emptySubtext}>Pull to refresh</Text>
          </View>
        }
      />
    </View>
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
  header: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  listContent: {
    padding: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});