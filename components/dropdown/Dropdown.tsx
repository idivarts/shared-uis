import { Pressable, Text, View } from "react-native";
import React, { PropsWithChildren, useState, ReactElement, ReactNode } from "react";
import DropdownTrigger from "./DropdownTrigger";
import DropdownOptions from "./DropdownOptions";

import styles from "../../styles/dropdown/Dropdown.styles";

interface DropdownProps extends PropsWithChildren<Record<string, unknown>> {}

const Dropdown: React.FC<DropdownProps> = ({ children }: DropdownProps) => {
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
      </View>
      <Pressable onPress={() => setShowDropdown(false)}>
        <View style={styles.dropdownOverlay}><Text>Overlay</Text></View>
      </Pressable>
    </>
  );
};

export default Dropdown;
