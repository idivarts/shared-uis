import { PropsWithChildren } from "react";

import styles from "../../styles/dropdown/Dropdown.styles";
import { View } from "react-native";

interface DropdownOptionsProps extends PropsWithChildren {
  gap?: number;
  visible?: boolean;
}

const DropdownOptions: React.FC<DropdownOptionsProps> = ({
  children,
  gap = 2,
  visible,
}) => {
  if (!visible) return null;

  return (
    <View
      style={[
        styles.dropdownOptions,
        {
          gap,
        }
      ]}
    >
      {children}
    </View>
  )
};

export default DropdownOptions;
