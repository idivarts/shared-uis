import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useMemo } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

import Colors from "@/shared-uis/constants/Colors";

interface SearchInputProps extends TextInputProps {
    placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
    placeholder,
    style,
    ...props
}) => {
    const theme = useTheme();
    const styles = useMemo(() => useStyles(theme), [theme]);

    return (
        <View style={[styles.container, style]}>
            <Ionicons
                name="search"
                size={24}
                color={Colors(theme).textSecondary}
                style={styles.icon}
            />
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={Colors(theme).textSecondary}
                style={styles.input}
                {...props}
            />
        </View>
    );
};

const useStyles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Colors(theme).card,
            borderRadius: 10,
            padding: 8,
            borderWidth: 1,
            borderColor: Colors(theme).border,
        },
        icon: {
            marginRight: 10,
        },
        input: {
            width: "100%",
            color: Colors(theme).text,
            fontSize: 16,
        },
    });

export default SearchInput;
