import React, { PropsWithChildren, ReactElement, ReactNode, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import DropdownOptions from "./DropdownOptions";
import DropdownTrigger from "./DropdownTrigger";
import getDropdownStyles from "../../styles/dropdown/Dropdown.styles";

interface DropdownProps extends PropsWithChildren<Record<string, unknown>> { }

const Dropdown: React.FC<DropdownProps> = ({ children }: DropdownProps) => {
    const theme = useTheme();
    const styles = useMemo(() => getDropdownStyles(theme), [theme]);
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const isReactElement = (node: ReactNode): node is ReactElement => {
        return typeof node === 'object' && node !== null && 'props' in node;
    };

    const modifiedChildren = React.Children.map(children, (child) => {
        if (isReactElement(child)) {
            if (child.type === DropdownTrigger) {
                return React.cloneElement(child, {
                    onPress: toggleDropdown,
                });
            }
            if (child.type === DropdownOptions) {
                return React.cloneElement(child, {
                    visible: showDropdown,
                });
            }
        }
        return child;
    });

    return (
        <>
            <View style={styles.dropdownContainer}>
                {modifiedChildren}
                <Pressable
                    onPress={() => setShowDropdown(false)}
                    style={[
                        styles.dropdownOverlay,
                        showDropdown ? styles.dropdownOverlayVisible : styles.dropdownOverlayHidden,
                    ]}
                />
            </View>
        </>
    );
};

export default Dropdown;
