import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { theme } from '../theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card, StatCard } from '../components/Card';
import { MetricCard, GuidelineCountCard, TrustCard } from '../components/MetricCard';
import { GuidelineCard } from '../components/GuidelineCard';
import { guidelinesApi } from '../services/api';
import { Guideline, GuidelineFilters, PaginationParams } from '../types';

interface GuidelinesScreenProps {
  onGuidelinePress: (guideline: Guideline) => void;
  onShowAdminDashboard?: () => void;
}

export const GuidelinesScreen: React.FC<GuidelinesScreenProps> = ({
  onGuidelinePress,
  onShowAdminDashboard,
}) => {
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<GuidelineFilters>({});
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 20 });
  const [hasMore, setHasMore] = useState(true);

  const fetchGuidelines = useCallback(async (
    isRefresh = false,
    searchTerm = searchQuery,
    currentFilters = filters
  ) => {
    if (loading && !isRefresh) return;
    
    setLoading(true);
    if (isRefresh) {
      setRefreshing(true);
      setPagination({ page: 1, limit: 20 });
    }

    try {
      const currentPage = isRefresh ? 1 : pagination.page;
      const searchFilters = searchTerm ? { ...currentFilters, search: searchTerm } : currentFilters;
      
      const response = await guidelinesApi.getGuidelines(
        searchFilters,
        { page: currentPage, limit: pagination.limit }
      );

      if (response.success && response.data) {
        const newGuidelines = response.data.data;
        
        if (isRefresh) {
          setGuidelines(newGuidelines);
        } else {
          setGuidelines(prev => [...prev, ...newGuidelines]);
        }
        
        setHasMore(response.data.pagination.hasNext);
        setPagination(prev => ({ ...prev, page: currentPage + 1 }));
      } else {
        Alert.alert('Error', response.error || 'Failed to load guidelines');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while loading guidelines');
      console.error('Fetch guidelines error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading, searchQuery, filters, pagination]);

  useEffect(() => {
    fetchGuidelines(true);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchGuidelines(true, query, filters);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters, fetchGuidelines]);

  const handleRefresh = () => {
    fetchGuidelines(true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchGuidelines(false);
    }
  };

  const renderGuideline = ({ item }: { item: Guideline }) => (
    <GuidelineCard
      guideline={item}
      onPress={onGuidelinePress}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Guidelines Found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? 'Try adjusting your search terms or filters'
          : 'Guidelines will appear here once they are added'
        }
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading || refreshing) return null;
    
    return (
      <View style={styles.footerLoader}>
        <Text style={styles.loadingText}>Loading more guidelines...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Clinical Guidelines</Text>
          {onShowAdminDashboard && (
            <Button
              title="Admin"
              onPress={onShowAdminDashboard}
              variant="outline"
              size="small"
              style={styles.adminButton}
            />
          )}
        </View>
        
        {/* Search Input */}
        <Input
          placeholder="Search guidelines, trusts, specialties..."
          value={searchQuery}
          onChangeText={handleSearch}
          containerStyle={styles.searchContainer}
        />
      </View>

      {/* Stats Cards Section */}
      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <GuidelineCountCard count={guidelines.length} />
          <TrustCard 
            trustName="Active Trusts" 
            guidelineCount={new Set(guidelines.map(g => g.trustName)).size}
            color={theme.colors.info}
          />
        </View>
      </View>

      <FlashList
        data={guidelines}
        renderItem={renderGuideline}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        estimatedItemSize={200}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  header: {
    padding: theme.spacing.screenPadding,
    backgroundColor: theme.colors.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  
  adminButton: {
    marginLeft: theme.spacing.md,
  },
  
  searchContainer: {
    marginBottom: 0,
  },
  
  statsSection: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: theme.spacing.md,
  },
  
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  
  listContent: {
    padding: theme.spacing.lg,
  },
  
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  
  emptyTitle: {
    ...theme.textPresets.h3,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  
  emptySubtitle: {
    ...theme.textPresets.body,
    color: theme.colors.textLight,
    textAlign: 'center',
    maxWidth: 280,
  },
  
  footerLoader: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  
  loadingText: {
    ...theme.textPresets.bodySmall,
    color: theme.colors.textSecondary,
  },
});
