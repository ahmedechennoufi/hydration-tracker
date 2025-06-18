import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { format, isToday, isYesterday } from 'date-fns';
import { NeubrutColors } from '../constants/Colors';
import { NeubrutTextStyles } from '../constants/Typography';
import { NeubrutCard } from '../components/NeubrutCard';
import { HydrationService } from '../services/HydrationService';
import { HydrationEntry } from '../types';

interface HistoryScreenProps {
  navigation: any;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const [entries, setEntries] = useState<HydrationEntry[]>([]);
  const [weeklyData, setWeeklyData] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'history' | 'stats'>('history');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allEntries = await HydrationService.getEntries();
      const weekly = await HydrationService.getWeeklyData();
      
      // Sort entries by date (newest first)
      const sortedEntries = allEntries.sort(
        (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
      );
      
      setEntries(sortedEntries);
      setWeeklyData(weekly);
    } catch (error) {
      console.error('Error loading history data:', error);
    }
  };

  const groupEntriesByDate = () => {
    const grouped: Record<string, HydrationEntry[]> = {};
    
    entries.forEach(entry => {
      const dateKey = format(new Date(entry.dateTime), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(entry);
    });
    
    return grouped;
  };

  const calculateDayTotal = (dayEntries: HydrationEntry[]) => {
    let total = 0;
    for (const entry of dayEntries) {
      total += entry.milliliters;
    }
    return total;
  };

  const calculateStats = () => {
    if (entries.length === 0) {
      return { totalDays: 0, totalIntake: 0, averageDaily: 0 };
    }

    const groupedEntries = groupEntriesByDate();
    const totalDays = Object.keys(groupedEntries).length;
    
    let totalIntake = 0;
    for (const entry of entries) {
      totalIntake += entry.milliliters;
    }
    
    const averageDaily = totalDays > 0 ? Math.round(totalIntake / totalDays) : 0;
    
    return { totalDays, totalIntake, averageDaily };
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'EEEE, MMM d');
    }
  };

  const renderHistoryTab = () => {
    const groupedEntries = groupEntriesByDate();
    const dateKeys = Object.keys(groupedEntries).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );

    if (dateKeys.length === 0) {
      return (
        <NeubrutCard style={styles.emptyCard}>
          <MaterialIcons name="water-drop" size={48} color={NeubrutColors.black} />
          <Text style={styles.emptyText}>No hydration data yet</Text>
          <Text style={styles.emptySubtext}>Start tracking your water intake!</Text>
        </NeubrutCard>
      );
    }

    return (
      <FlatList
        data={dateKeys}
        keyExtractor={(item) => item}
        renderItem={({ item: dateKey }) => {
          const dayEntries = groupedEntries[dateKey];
          const dayTotal = calculateDayTotal(dayEntries);
          
          return (
            <NeubrutCard style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{formatDateHeader(dateKey)}</Text>
                <Text style={styles.dayTotal}>{dayTotal} mL</Text>
              </View>
              
              {dayEntries.map((entry) => {
                const drinkInfo = HydrationService.getDrinkTypeById(entry.drinkType) || {
                  id: entry.drinkType,
                  name: 'Unknown',
                  icon: 'local-drink',
                  color: NeubrutColors.black,
                  category: 'other',
                  milliliters: 0,
                };
                
                return (
                  <View key={entry.id} style={styles.entryRow}>
                    <View
                      style={[
                        styles.entryIcon,
                        { backgroundColor: drinkInfo.color === '#FFFFFF' 
                            ? NeubrutColors.background 
                            : drinkInfo.color 
                        }
                      ]}
                    >
                      <MaterialIcons
                        name={drinkInfo.icon as any}
                        size={20}
                        color={NeubrutColors.white}
                      />
                    </View>
                    <View style={styles.entryInfo}>
                      <Text style={styles.entryName}>{drinkInfo.name}</Text>
                      <Text style={styles.entryDetails}>
                        {entry.milliliters} mL • {format(new Date(entry.dateTime), 'HH:mm')}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </NeubrutCard>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderStatsTab = () => {
    const stats = calculateStats();
    
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <NeubrutCard style={styles.statsCard}>
          <Text style={styles.statsTitle}>OVERVIEW</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalDays}</Text>
              <Text style={styles.statLabel}>Days Tracked</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalIntake.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total mL</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.averageDaily}</Text>
              <Text style={styles.statLabel}>Daily Average</Text>
            </View>
          </View>
        </NeubrutCard>

        <NeubrutCard style={styles.statsCard}>
          <Text style={styles.statsTitle}>WEEKLY BREAKDOWN</Text>
          {Object.entries(weeklyData).map(([date, amount]) => (
            <View key={date} style={styles.weeklyRow}>
              <Text style={styles.weeklyDate}>
                {format(new Date(date), 'EEE, MMM d')}
              </Text>
              <Text style={styles.weeklyAmount}>{amount} mL</Text>
            </View>
          ))}
        </NeubrutCard>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={NeubrutColors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>HISTORY</Text>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            HISTORY
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
          onPress={() => setActiveTab('stats')}
        >
          <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
            STATS
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'history' ? renderHistoryTab() : renderStatsTab()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NeubrutColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
    backgroundColor: NeubrutColors.white,
    borderWidth: 2,
    borderColor: NeubrutColors.black,
    marginRight: 16,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  title: {
    ...NeubrutTextStyles.heading2,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 16,
    backgroundColor: NeubrutColors.white,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    alignItems: 'center',
    marginRight: 12,
  },
  activeTab: {
    backgroundColor: NeubrutColors.electricBlue,
  },
  tabText: {
    ...NeubrutTextStyles.bodyMedium,
    fontWeight: '600',
  },
  activeTabText: {
    color: NeubrutColors.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    ...NeubrutTextStyles.heading3,
    marginTop: 16,
  },
  emptySubtext: {
    ...NeubrutTextStyles.bodyMedium,
    opacity: 0.7,
    marginTop: 8,
  },
  dayCard: {
    marginBottom: 16,
    padding: 16,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: NeubrutColors.black,
  },
  dayTitle: {
    ...NeubrutTextStyles.heading3,
  },
  dayTotal: {
    ...NeubrutTextStyles.bodyLarge,
    fontWeight: '600',
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: NeubrutColors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryName: {
    ...NeubrutTextStyles.bodyLarge,
    fontWeight: '600',
  },
  entryDetails: {
    ...NeubrutTextStyles.bodyMedium,
    opacity: 0.7,
    marginTop: 2,
  },
  statsCard: {
    marginBottom: 16,
    padding: 20,
  },
  statsTitle: {
    ...NeubrutTextStyles.heading3,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...NeubrutTextStyles.heading2,
    color: NeubrutColors.electricBlue,
  },
  statLabel: {
    ...NeubrutTextStyles.bodyMedium,
    marginTop: 4,
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: NeubrutColors.black,
  },
  weeklyDate: {
    ...NeubrutTextStyles.bodyMedium,
  },
  weeklyAmount: {
    ...NeubrutTextStyles.bodyMedium,
    fontWeight: '600',
  },
});