import { useTheme } from "@react-navigation/native";
import { PropsWithChildren, useMemo } from "react";
import { Pressable } from "react-native";
import getDropdownStyles from "../../styles/dropdown/Dropdown.styles";

interface DropdownTriggerProps extends PropsWithChildren {
    onPress?: () => void;
}

const DropdownTrigger: React.FC<DropdownTriggerProps> = ({
    children,
    onPress,
}) => {
    const theme = useTheme();
    const styles = useMemo(() => getDropdownStyles(theme), [theme]);
    return (
        <Pressable onPress={onPress} style={styles.dropdownTrigger}>
            {children}
        </Pressable>
    );
};

export default DropdownTrigger;
