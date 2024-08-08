import { PropsWithChildren } from "react";
import { Pressable } from "react-native";

import styles from "../../styles/dropdown/Dropdown.styles";

interface DropdownOptionProps extends PropsWithChildren {
  onSelect: () => void;
}

const DropdownOption: React.FC<DropdownOptionProps> = ({
  children,
  onSelect,
}) => (
  <Pressable onPress={onSelect} style={styles.dropdownOption}>
    {children}
  </Pressable>
);

export default DropdownOption;
