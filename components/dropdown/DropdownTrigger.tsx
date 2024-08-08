
import { PropsWithChildren } from "react";
import { Pressable } from "react-native";

import styles from "../../styles/dropdown/Dropdown.styles";

interface DropdownTriggerProps extends PropsWithChildren {
  onPress?: () => void;
}

const DropdownTrigger: React.FC<DropdownTriggerProps> = ({
  children,
  onPress,
}) => (
  <Pressable onPress={onPress} style={styles.dropdownTrigger}>
    {children}
  </Pressable>
);

export default DropdownTrigger;
