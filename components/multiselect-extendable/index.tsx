import React, { useState, useRef, useEffect } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { Theme } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faClose, faPlus } from '@fortawesome/free-solid-svg-icons';

import Colors from "@/shared-uis/constants/Colors";
import { Text, View } from '../theme/Themed';

export interface MultiSelectExtendableProps {
  buttonLabel?: string;
  initialItemsList: string[];
  initialMultiselectItemsList: string[];
  onSelectedItemsChange: (items: string[]) => void;
  selectedItems: string[];
  theme: Theme;
}

export const MultiSelectExtendable: React.FC<MultiSelectExtendableProps> = ({
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
  const searchInputRef = useRef<TextInput>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  // const handleRemoveItem = (itemToRemove: string) => {
  //   const updatedItems = selectedItems.filter(item => item !== itemToRemove);
  //   onSelectedItemsChange(updatedItems);
  // };

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
    if (!selectedMultiselectItems.includes(item)) {
      onSelectedItemsChange([...selectedMultiselectItems, item]);
      setTotalMultiselectItems([...totalMultiselectItems, item]);
      setSelectedMultiselectItems([...selectedMultiselectItems, item]);
    } else {
      onSelectedItemsChange(selectedMultiselectItems.filter(i => i !== item));
      setTotalMultiselectItems(totalMultiselectItems.filter(i => i !== item));
      setSelectedMultiselectItems(selectedMultiselectItems.filter(i => i !== item));
    }
    setSearchText('');
  };

  const openBottomSheet = () => {
    setIsVisible(true);
  };

  const isItemNotFound = searchText.trim() !== '' && filteredItems.length === 0;

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
                      backgroundColor: selectedMultiselectItems.includes(item) ? Colors(theme).primary : Colors(theme).platinum,
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
            <FontAwesomeIcon
              icon={faPlus}
              color={Colors(theme).primary}
              size={14}
            />
          </Pressable>
        </View>
      </View>
      {/* <Portal> */}
      <Modal
        contentContainerStyle={styles.modalContainer}
        onDismiss={() => {
          setIsVisible(false);
        }}
        visible={isVisible}
      >
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: 16,
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              color: Colors(theme).text,
              fontSize: 16,
              fontWeight: '500',
            }}
          >
            Search and add items
          </Text>
          <Pressable
            style={styles.closeButton}
            onPress={() => {
              setIsVisible(false);
            }}
          >
            <FontAwesomeIcon
              icon={faClose}
              color={Colors(theme).primary}
              size={24}
            />
          </Pressable>
        </View>
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
      </Modal>
      {/* </Portal> */}
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
  modalContainer: {
    backgroundColor: Colors(theme).background,
    borderRadius: 8,
    gap: 16,
    marginBottom: -160,
    padding: 20,
    paddingBottom: 240,
    zIndex: 10000,
  },
  closeButton: {
    // zIndex: Platform.OS === 'web' ? 100 : -10,
  },
  searchInput: {
    borderWidth: 1,
    color: Colors(theme).text,
    borderColor: Colors(theme).primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
