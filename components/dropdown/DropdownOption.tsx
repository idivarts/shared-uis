import { useTheme } from "@react-navigation/native";
import { PropsWithChildren, useMemo } from "react";
import { Pressable } from "react-native";
import getDropdownStyles from "../../styles/dropdown/Dropdown.styles";

interface DropdownOptionProps extends PropsWithChildren {
    onSelect?: () => void;
}

const DropdownOption: React.FC<DropdownOptionProps> = ({
    children,
    onSelect,
}) => {
    const theme = useTheme();
    const styles = useMemo(() => getDropdownStyles(theme), [theme]);
    return (
        <Pressable onPress={onSelect} style={styles.dropdownOption}>
            {children}
        </Pressable>
    );
};

export default DropdownOption;
