import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NeubrutColors } from '../constants/Colors';
import { NeubrutTextStyles } from '../constants/Typography';
import { NeubrutButton } from '../components/NeubrutButton';
import { NeubrutCard } from '../components/NeubrutCard';
import { HydrationService } from '../services/HydrationService';
import { DrinkType } from '../types';

interface AddBeverageScreenProps {
  navigation: any;
}

const categories = [
  { key: 'water', name: 'Water', icon: 'water-drop' },
  { key: 'coffee', name: 'Coffee', icon: 'coffee' },
  { key: 'tea', name: 'Tea', icon: 'local-cafe' },
  { key: 'juice', name: 'Juice', icon: 'local-drink' },
  { key: 'soft-drink', name: 'Soft Drinks', icon: 'local-bar' },
  { key: 'sports', name: 'Sports', icon: 'fitness-center' },
  { key: 'milk', name: 'Milk', icon: 'local-cafe' },
  { key: 'other', name: 'Other', icon: 'more-horiz' },
];

export const AddBeverageScreen: React.FC<AddBeverageScreenProps> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('water');
  const [selectedDrink, setSelectedDrink] = useState<DrinkType | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const drinkTypes = HydrationService.getDrinkTypesByCategory(selectedCategory);

  const handleDrinkSelect = (drink: DrinkType) => {
    setSelectedDrink(drink);
    setCustomAmount(drink.milliliters.toString());
  };

  const handleAddBeverage = async () => {
    if (!selectedDrink) {
      Alert.alert('Please select a beverage');
      return;
    }

    const amount = parseInt(customAmount) || selectedDrink.milliliters;
    
    try {
      await HydrationService.addEntry({
        dateTime: new Date(),
        drinkType: selectedDrink.id,
        milliliters: amount,
      });
      
      Alert.alert(
        'Success!',
        `Added ${amount}mL of ${selectedDrink.name}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add beverage');
    }
  };

  const quickAmounts = [250, 500, 750, 1000];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={NeubrutColors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>ADD BEVERAGE</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <Text style={styles.sectionTitle}>CATEGORY</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                selectedCategory === category.key && styles.selectedCategory
              ]}
              onPress={() => {
                setSelectedCategory(category.key);
                setSelectedDrink(null);
                setCustomAmount('');
              }}
            >
              <MaterialIcons 
                name={category.icon as any} 
                size={20} 
                color={selectedCategory === category.key ? NeubrutColors.white : NeubrutColors.black}
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.key && styles.selectedCategoryText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Drink Types */}
        <Text style={styles.sectionTitle}>SELECT BEVERAGE</Text>
        <View style={styles.drinkGrid}>
          {drinkTypes.map((drink) => (
            <TouchableOpacity
              key={drink.id}
              style={[
                styles.drinkCard,
                selectedDrink?.id === drink.id && styles.selectedDrinkCard,
              ]}
              onPress={() => handleDrinkSelect(drink)}
            >
              <View style={[styles.drinkIconContainer, { backgroundColor: drink.color }]}>
                <MaterialIcons 
                  name={drink.icon as any} 
                  size={24} 
                  color={NeubrutColors.white}
                />
              </View>
              <Text style={styles.drinkName}>{drink.name}</Text>
              <Text style={styles.drinkAmount}>{drink.milliliters}mL</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amount Selection */}
        {selectedDrink && (
          <View style={styles.amountSection}>
            <Text style={styles.sectionTitle}>AMOUNT</Text>
            
            <NeubrutCard style={styles.customAmountCard}>
              <Text style={styles.inputLabel}>Custom Amount (mL)</Text>
              <TextInput
                style={styles.textInput}
                value={customAmount}
                onChangeText={setCustomAmount}
                keyboardType="numeric"
                placeholder="Enter amount"
              />
            </NeubrutCard>

            <Text style={styles.orText}>OR</Text>

            <View style={styles.quickAmountGrid}>
              {quickAmounts.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={styles.quickAmountButton}
                  onPress={() => setCustomAmount(amount.toString())}
                >
                  <Text style={styles.quickAmountText}>{amount}mL</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <NeubrutButton
          title="ADD BEVERAGE"
          onPress={handleAddBeverage}
          backgroundColor={NeubrutColors.electricBlue}
          disabled={!selectedDrink}
        />
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    ...NeubrutTextStyles.heading3,
    marginBottom: 16,
    marginTop: 24,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  categoryScroll: {
    marginBottom: 8,
  },
  categoryContainer: {
    paddingRight: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NeubrutColors.white,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  selectedCategory: {
    backgroundColor: NeubrutColors.electricBlue,
  },
  categoryText: {
    ...NeubrutTextStyles.bodyMedium,
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 12,
    color: NeubrutColors.black,
  },
  selectedCategoryText: {
    color: NeubrutColors.white,
  },
  drinkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  drinkCard: {
    width: '48%',
    padding: 16,
    backgroundColor: NeubrutColors.white,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  selectedDrinkCard: {
    backgroundColor: NeubrutColors.limeGreen,
  },
  drinkIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: NeubrutColors.black,
    marginBottom: 8,
  },
  drinkName: {
    ...NeubrutTextStyles.bodyMedium,
    fontWeight: '600',
    marginTop: 8,
  },
  drinkAmount: {
    ...NeubrutTextStyles.bodySmall,
    marginTop: 4,
  },
  amountSection: {
    marginTop: 24,
  },
  customAmountCard: {
    padding: 20,
  },
  inputLabel: {
    ...NeubrutTextStyles.bodyMedium,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: NeubrutColors.black,
    padding: 12,
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: NeubrutColors.white,
  },
  orText: {
    ...NeubrutTextStyles.bodyMedium,
    textAlign: 'center',
    marginVertical: 16,
  },
  quickAmountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    width: '48%',
    padding: 16,
    backgroundColor: NeubrutColors.limeGreen,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  quickAmountText: {
    ...NeubrutTextStyles.bodyLarge,
    fontWeight: '700',
  },
  footer: {
    padding: 20,
  },
});