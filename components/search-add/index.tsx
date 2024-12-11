import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Theme } from '@react-navigation/native';
import Colors from "@/shared-uis/constants/Colors";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, View } from '../theme/Themed';

export interface SearchAddProps {
  buttonLabel?: string;
  initialItemsList: string[];
  onSelectedItemsChange: (items: string[]) => void;
  selectedItems: string[];
  theme: Theme;
}

export const SearchAdd: React.FC<SearchAddProps> = ({
  buttonLabel,
  initialItemsList,
  onSelectedItemsChange,
  selectedItems,
  theme,
}) => {
  const [itemsList, setItemsList] = useState<string[]>(initialItemsList);
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState<string[]>(itemsList);
  const searchInputRef = useRef<TextInput>(null);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const styles = stylesFn(theme);

  useEffect(() => {
    if (searchText) {
      const filtered = itemsList.filter(item =>
        item.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(itemsList);
    }
  }, [searchText, itemsList]);

  const handleAddItem = () => {
    if (searchText.trim() && !itemsList.includes(searchText.trim()) && !selectedItems.includes(searchText.trim())) {
      const newItem = searchText.trim();
      setItemsList(prevItems => [...prevItems, newItem]);
      onSelectedItemsChange([...selectedItems, newItem]);
      setSearchText('');
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    const updatedItems = selectedItems.filter(item => item !== itemToRemove);
    onSelectedItemsChange(updatedItems);
  };

  const handleSelectItem = (item: string) => {
    if (!selectedItems.includes(item)) {
      onSelectedItemsChange([...selectedItems, item]);
    }
    setSearchText('');
  };

  const openBottomSheet = () => {
    bottomSheetModalRef.current?.present();
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const isItemNotFound = searchText.trim() !== '' && filteredItems.length === 0;

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
  const insets = useSafeAreaInsets();

  const renderBackdrop = (props: any) => {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectedItemsContainer}>
        <View style={styles.chipContainer}>
          {selectedItems.map(item => (
            <View key={item} style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
              <Pressable
                onPress={() => handleRemoveItem(item)}
                style={styles.removeButton}
              >
                <FontAwesomeIcon
                  icon={faClose}
                  color={Colors(theme).white}
                  size={16}
                />
              </Pressable>
            </View>
          ))}
        </View>
        <Pressable
          style={styles.addLanguageButton}
          onPress={openBottomSheet}
        >
          <Text style={styles.addLanguageText}>
            {buttonLabel || 'Add'}
          </Text>
          <FontAwesomeIcon
            icon={faPlus}
            color={Colors(theme).primary}
            size={14}
          />
        </Pressable>
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={2}
        backgroundStyle={{
          backgroundColor: Colors(theme).background,
        }}
        handleIndicatorStyle={{
          backgroundColor: Colors(theme).primary,
        }}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        topInset={insets.top}
      >
        <View style={styles.bottomSheetContent}>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search"
            autoCapitalize="none"
            placeholderTextColor={Colors(theme).gray300}
          />
          <ScrollView style={styles.itemsList}>
            {isItemNotFound ? (
              <Pressable
                style={styles.addButton}
                onPress={handleAddItem}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  color={Colors(theme).white}
                  size={14}
                />
                <Text style={styles.addButtonText}>Add {searchText}</Text>
              </Pressable>
            ) : (
              filteredItems.map(item => (
                <Pressable
                  key={item}
                  style={styles.item}
                  onPress={() => handleSelectItem(item)}
                >
                  <Text style={styles.itemText}>{item}</Text>
                  {selectedItems.includes(item) && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      color={Colors(theme).primary}
                      size={16}
                    />
                  )}
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>
      </BottomSheetModal>
    </View>
  );
};

const stylesFn = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  selectedItemsContainer: {
    gap: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors(theme).primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 14,
    marginRight: 4,
    color: Colors(theme).white,
  },
  addLanguageButton: {
    backgroundColor: Colors(theme).background,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors(theme).primary,
    padding: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  addLanguageText: {
    fontSize: 14,
    color: Colors(theme).primary,
  },
  removeButton: {
    marginLeft: 8,
  },
  bottomSheetContent: {
    padding: 16,
    paddingBottom: 20,
    backgroundColor: Colors(theme).background,
  },
  searchInput: {
    borderWidth: 1,
    color: Colors(theme).text,
    borderColor: Colors(theme).primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  itemsList: {
    maxHeight: 320,
    borderRadius: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors(theme).platinum,
    backgroundColor: theme.dark ? Colors(theme).card : Colors(theme).gray200,
  },
  itemText: {
    fontSize: 16,
    color: Colors(theme).text,
  },
  addButton: {
    backgroundColor: Colors(theme).primary,
    borderRadius: 100,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: Colors(theme).white,
    fontSize: 16,
    fontWeight: '600',
  },
});
