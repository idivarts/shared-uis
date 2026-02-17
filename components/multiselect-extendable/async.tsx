import Colors from "@/shared-uis/constants/Colors";
import { faCheck, faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Theme } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    TextInput
} from 'react-native';
import BottomSheetScrollContainer from '../bottom-sheet/scroll-view';
import { Text, View } from '../theme/Themed';

export interface MultiSelectExtendableAsyncProps {
    buttonIcon?: React.ReactNode;
    buttonLabel?: string;
    initialItemsList: string[];
    initialMultiselectItemsList: string[];
    onSelectedItemsChange: (items: string[]) => void;
    selectedItems: string[];
    theme: Theme;
    closeOnSelect?: boolean;
    onSearch?: (query: string) => Promise<string[]>;
}

export const MultiSelectExtendableAsync: React.FC<MultiSelectExtendableAsyncProps> = ({
    buttonIcon,
    buttonLabel,
    initialItemsList,
    initialMultiselectItemsList,
    onSelectedItemsChange,
    selectedItems,
    theme,
    closeOnSelect = false,
    onSearch,
}) => {
    const [totalMultiselectItems, setTotalMultiselectItems] = useState<string[]>(initialMultiselectItemsList);
    const [selectedMultiselectItems, setSelectedMultiselectItems] = useState<string[]>(selectedItems);
    const [itemsList, setItemsList] = useState<string[]>(initialItemsList);

    const [searchText, setSearchText] = useState('');
    const [filteredItems, setFilteredItems] = useState<string[]>(initialItemsList);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const searchInputRef = useRef<TextInput>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const onSearchRef = useRef(onSearch);
    const isSearchActiveRef = useRef(false); // Track if user is actively searching

    const styles = stylesFn(theme);

    // Keep onSearch ref up to date
    useEffect(() => {
        onSearchRef.current = onSearch;
    }, [onSearch]);

    useEffect(() => {
        // Clear any existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = null;
        }

        if (onSearchRef.current && searchText && searchText.trim() !== '') {
            // User is actively searching
            isSearchActiveRef.current = true;
            setIsSearching(true);

            searchTimeoutRef.current = setTimeout(async () => {
                try {
                    const results = await onSearchRef.current!(searchText);
                    // Only update if we're still in search mode
                    if (isSearchActiveRef.current) {
                        setFilteredItems(results);
                        setItemsList(results);
                    }
                } catch (error) {
                    console.error('Error searching:', error);
                    setFilteredItems([]);
                } finally {
                    setIsSearching(false);
                }
            }, 300); // 300ms debounce
        } else if (searchText && searchText.trim() !== '') {
            // Local filtering fallback
            isSearchActiveRef.current = true;
            setIsSearching(false);
            const filtered = itemsList.filter(item =>
                item.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredItems(filtered);
        } else {
            // No search text, reset to initial items
            isSearchActiveRef.current = false;
            setIsSearching(false);
            if (!searchText) {
                setFilteredItems(itemsList);
            }
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
                searchTimeoutRef.current = null;
                setIsSearching(false);
            }
        };
    }, [searchText]); // Only depend on searchText

    useEffect(() => {
        // Only update if not actively searching
        if (!isSearchActiveRef.current && !searchText) {
            setItemsList(initialItemsList);
            setFilteredItems(initialItemsList);
        }
    }, [initialItemsList, searchText]);

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
        if (closeOnSelect) {
            setIsModalVisible(false);
        }
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
        const wasSelected = selectedMultiselectItems.includes(item);
        toggleSelection(item);
        if (!totalMultiselectItems.includes(item)) {
            setTotalMultiselectItems([...totalMultiselectItems, item]);
        }

        setSearchText('');
        if (closeOnSelect && !wasSelected) {
            setIsModalVisible(false);
        }
    };

    const handleRemoveItem = (item: string) => {
        setSelectedMultiselectItems(selectedMultiselectItems.filter(i => i !== item));
        onSelectedItemsChange(selectedMultiselectItems.filter(i => i !== item));
    };

    const canAddNewItem = useMemo(() => {
        return searchText.trim() !== '' && !filteredItems.some(item => item.toLowerCase() === searchText.toLowerCase());
    }, [searchText, filteredItems]);

    return (
        <View style={styles.container}>
            {selectedMultiselectItems.length > 0 && (
                <View style={styles.selectedItemsContainer}>
                    {selectedMultiselectItems.map((item, index) => (
                        <View key={index} style={styles.selectedItem}>
                            <Text style={styles.selectedItemText}>{item}</Text>
                            <Pressable onPress={() => handleRemoveItem(item)}>
                                <FontAwesomeIcon icon={faClose} size={14} color={Colors(theme).primary} />
                            </Pressable>
                        </View>
                    ))}
                </View>
            )}
            {buttonLabel && (
                <Pressable
                    style={styles.button}
                    onPress={() => setIsModalVisible(true)}
                >
                    {buttonIcon}
                    <Text style={styles.buttonText}>{buttonLabel}</Text>
                </Pressable>
            )}

            <BottomSheetScrollContainer
                isVisible={isModalVisible}
                snapPointsRange={['90%', '90%']}
                onClose={() => {
                    setIsModalVisible(false);
                    setSearchText('');
                    isSearchActiveRef.current = false;
                    setIsSearching(false);
                    // Reset to initial items
                    setFilteredItems(initialItemsList);
                    setItemsList(initialItemsList);
                }}
            >
                <View style={styles.scrollContent}>
                    <View style={styles.searchContainer}>
                        <TextInput
                            ref={searchInputRef}
                            style={styles.searchInput}
                            placeholder="Search or add new..."
                            value={searchText}
                            onChangeText={setSearchText}
                            autoFocus
                        />
                        {isSearching && (
                            <ActivityIndicator size="small" color={Colors(theme).primary} />
                        )}
                    </View>

                    {canAddNewItem && (
                        <Pressable style={styles.addButton} onPress={handleAddItem}>
                            <FontAwesomeIcon icon={faPlus} size={16} color={Colors(theme).primary} />
                            <Text style={styles.addButtonText}>Add "{searchText}"</Text>
                        </Pressable>
                    )}

                    {filteredItems.map((item, index) => {
                        const isSelected = selectedMultiselectItems.includes(item);
                        return (
                            <Pressable
                                key={index}
                                style={[styles.item, isSelected && styles.selectedItemInList]}
                                onPress={() => handleSelectItem(item)}
                            >
                                <Text style={styles.itemText}>{item}</Text>
                                {isSelected && (
                                    <FontAwesomeIcon icon={faCheck} size={16} color={Colors(theme).primary} />
                                )}
                            </Pressable>
                        );
                    })}
                    {filteredItems.length === 0 && !isSearching && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>No items found</Text>
                        </View>
                    )}
                </View>
            </BottomSheetScrollContainer>
        </View>
    );
};

const stylesFn = (theme: Theme) => StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    selectedItemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    selectedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors(theme).primaryLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    selectedItemText: {
        fontSize: 14,
        color: Colors(theme).primary,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
    },
    buttonText: {
        fontSize: 14,
        color: Colors(theme).primary,
        fontWeight: '500',
    },
    scrollContent: {
        padding: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors(theme).border,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        backgroundColor: Colors(theme).background,
        color: Colors(theme).text,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        backgroundColor: Colors(theme).primaryLight,
        borderRadius: 8,
        marginBottom: 16,
    },
    addButtonText: {
        fontSize: 14,
        color: Colors(theme).primary,
        fontWeight: '500',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors(theme).border,
    },
    selectedItemInList: {
        backgroundColor: Colors(theme).primaryLight,
    },
    itemText: {
        fontSize: 16,
        color: Colors(theme).text,
    },
    emptyState: {
        padding: 32,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: Colors(theme).textSecondary,
    },
});
