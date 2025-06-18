import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NeubrutColors } from '../constants/Colors';
import { NeubrutTextStyles } from '../constants/Typography';
import { HydrationService } from '../services/HydrationService';
import { HydrationEntry, DrinkType } from '../types';

interface TodaysRecordsProps {
  selectedDate: Date;
  onDataChanged: () => void;
}

export const TodaysRecords: React.FC<TodaysRecordsProps> = ({
  selectedDate,
  onDataChanged,
}) => {
  const [entries, setEntries] = useState<HydrationEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEntries();
  }, [selectedDate]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const dayEntries = await HydrationService.getEntriesForDate(selectedDate);
      // Sort by time, most recent first
      dayEntries.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
      setEntries(dayEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = (entryId: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this drink entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await HydrationService.deleteEntry(entryId);
              await loadEntries();
              onDataChanged();
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
        },
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getDrinkInfo = (drinkTypeId: string) => {
    const drinkType = HydrationService.getDrinkTypeById(drinkTypeId);
    return drinkType || {
      id: drinkTypeId,
      name: 'Unknown',
      icon: 'local-drink',
      color: NeubrutColors.black,
      category: 'other',
      milliliters: 0,
    };
  };

  const renderEntry = ({ item }: { item: HydrationEntry }) => {
    const drinkInfo = getDrinkInfo(item.drinkType);
    const time = formatTime(new Date(item.dateTime));

    return (
      <View style={styles.entryContainer}>
        <View style={styles.entryLeft}>
          <View style={[styles.drinkIcon, { backgroundColor: drinkInfo.color }]}>
            <MaterialIcons 
              name={drinkInfo.icon as any} 
              size={24} 
              color={NeubrutColors.white} 
            />
          </View>
          
          <View style={styles.entryInfo}>
            <Text style={styles.drinkName}>{drinkInfo.name}</Text>
            <Text style={styles.entryTime}>{time}</Text>
          </View>
        </View>

        <View style={styles.entryRight}>
          <Text style={styles.entryAmount}>{item.milliliters} mL</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteEntry(item.id)}
          >
            <MaterialIcons name="delete" size={20} color={NeubrutColors.hotPink} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const isToday = HydrationService.isSameDay(selectedDate, new Date());
  const titleText = isToday ? "Today's Records" : "Day's Records";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{titleText}</Text>
      
      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="water-drop" size={48} color={NeubrutColors.electricBlue} />
          <Text style={styles.emptyText}>
            {isToday ? "No drinks logged today" : "No drinks logged this day"}
          </Text>
          <Text style={styles.emptySubtext}>
            {isToday ? "Add your first drink to get started!" : ""}
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          renderItem={renderEntry}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: NeubrutColors.white,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    padding: 16,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    maxHeight: 300,
  },
  title: {
    ...NeubrutTextStyles.heading3,
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    ...NeubrutTextStyles.bodyLarge,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
    color: NeubrutColors.black,
  },
  emptySubtext: {
    ...NeubrutTextStyles.bodyMedium,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    color: NeubrutColors.black,
  },
  list: {
    maxHeight: 200,
  },
  listContent: {
    paddingBottom: 8,
  },
  entryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: NeubrutColors.background,
  },
  entryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  drinkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: NeubrutColors.black,
  },
  entryInfo: {
    flex: 1,
  },
  drinkName: {
    ...NeubrutTextStyles.bodyLarge,
    fontSize: 14,
    fontWeight: '600',
    color: NeubrutColors.black,
  },
  entryTime: {
    ...NeubrutTextStyles.bodyMedium,
    fontSize: 12,
    color: NeubrutColors.black,
    marginTop: 2,
  },
  entryRight: {
    alignItems: 'flex-end',
  },
  entryAmount: {
    ...NeubrutTextStyles.bodyLarge,
    fontSize: 14,
    fontWeight: '700',
    color: NeubrutColors.black,
  },
  deleteButton: {
    marginTop: 4,
    padding: 4,
  },
});