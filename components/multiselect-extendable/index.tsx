import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Theme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faClose, faPlus } from '@fortawesome/free-solid-svg-icons';

import Colors from "@/shared-uis/constants/Colors";
import { Text, View } from '../theme/Themed';
import BottomSheetContainer from '../bottom-sheet';

export interface MultiSelectExtendableProps {
  buttonIcon?: React.ReactNode;
  buttonLabel?: string;
  initialItemsList: string[];
  initialMultiselectItemsList: string[];
  onSelectedItemsChange: (items: string[]) => void;
  selectedItems: string[];
  theme: Theme;
}

export const MultiSelectExtendable: React.FC<MultiSelectExtendableProps> = ({
  buttonIcon,
  buttonLabel,
  initialItemsList,
  initialMultiselectItemsList,
  onSelectedItemsChange,
  selectedItems,
  theme,
}) => {
  const [totalMultiselectItems, setTotalMultiselectItems] = useState<string[]>(initialMultiselectItemsList);
  const [selectedMultiselectItems, setSelectedMultiselectItems] = useState<string[]>(selectedItems);
  const [itemsList, setItemsList] = useState<string[]>(initialItemsList);

  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState<string[]>(itemsList);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

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
    if (searchText.trim() === '') {
      return;
    }
    const updatedItems = [...itemsList, searchText];
    setItemsList(updatedItems);
    setTotalMultiselectItems([...totalMultiselectItems, searchText]);
    setSelectedMultiselectItems([...selectedMultiselectItems, searchText]);
    onSelectedItemsChange([...selectedMultiselectItems, searchText]);

    setSearchText('');
  };

  const toggleSelection = (item: string) => {
    if (selectedMultiselectItems.includes(item)) {
      setSelectedMultiselectItems(selectedMultiselectItems.filter(i => i !== item));
      onSelectedItemsChange(selectedMultiselectItems.filter(i => i !== item));
    } else {
      setSelectedMultiselectItems([...selectedMultiselectItems, item]);
      onSelectedItemsChange([...selectedMultiselectItems, item]);
    }
  }

  const handleSelectItem = (item: string) => {
    // Add item to selected items if it's not already selected
    // Remove item from selected items if it's already selected
    // Add item to total items if it's not already in the list
    // Send updated selected items to parent component

    toggleSelection(item);
    if (!totalMultiselectItems.includes(item)) {
      setTotalMultiselectItems([...totalMultiselectItems, item]);
    }

    setSearchText('');
  };

  const openBottomSheet = () => {
    setIsModalVisible(true);
    searchInputRef.current?.focus();
  };

  const isItemNotFound = searchText.trim() !== '' && filteredItems.length === 0;

  const snapPoints = useMemo(() => ["25%", "50%", "75%", "100%"], []);
  const insets = useSafeAreaInsets();

  return (
    <>
      <View style={styles.container}>
        <View style={styles.selectedItemsContainer}>
          <View style={styles.chipContainer}>
            {totalMultiselectItems.map(item => (
              <Pressable
                key={item}
                onPress={() => toggleSelection(item)}
                style={styles.removeButton}
              >
                <View
                  key={item}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selectedMultiselectItems.includes(item) ? Colors(theme).primary : Colors(theme).tag,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color: selectedMultiselectItems.includes(item) ? Colors(theme).white : Colors(theme).text,
                      },
                    ]}
                  >
                    {item}
                  </Text>
                  <FontAwesomeIcon
                    icon={faCheck}
                    color={Colors(theme).white}
                    size={16}
                    style={{
                      display: selectedMultiselectItems.includes(item) ? 'flex' : 'none',
                    }}
                  />
                </View>
              </Pressable>
            ))}
          </View>
          <Pressable
            style={styles.addLanguageButton}
            onPress={openBottomSheet}
          >
            <Text style={styles.addLanguageText}>
              {buttonLabel || 'Add'}
            </Text>
            {
              buttonIcon ? buttonIcon : (
                <FontAwesomeIcon
                  icon={faPlus}
                  color={Colors(theme).primary}
                  size={14}
                />
              )
            }
          </Pressable>
        </View>
      </View>
      {
        isModalVisible && (
          <BottomSheetContainer
            backgroundStyle={{
              backgroundColor: Colors(theme).background,
            }}
            enablePanDownToClose
            handleIndicatorStyle={{
              backgroundColor: Colors(theme).primary,
            }}
            index={2}
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            snapPoints={snapPoints}
            topInset={insets.top}
          >
            <View style={styles.bottomSheetContent}>
              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  setIsModalVisible(false);
                }}
              >
                <FontAwesomeIcon
                  icon={faClose}
                  color={Colors(theme).primary}
                  size={24}
                />
              </Pressable>
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
                      {selectedMultiselectItems.includes(item) && (
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
          </BottomSheetContainer>
        )
      }
    </>
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
    paddingTop: Platform.OS === 'web' ? 30 : 16,
    paddingBottom: 20,
    backgroundColor: Colors(theme).background,
    position: 'relative',
  },
  closeButton: {
    display: Platform.OS === 'web' ? 'flex' : 'none',
    position: 'absolute',
    right: 16,
    top: 0,
    zIndex: Platform.OS === 'web' ? 100 : -10,
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
