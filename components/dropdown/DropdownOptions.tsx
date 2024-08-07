import { PropsWithChildren } from "react";

import styles from "../../styles/dropdown/Dropdown.styles";
import { DimensionValue, View } from "react-native";

type Position = {
  top?: DimensionValue;
  bottom?: DimensionValue;
  left?: DimensionValue;
  right?: DimensionValue;
};

interface DropdownOptionsProps extends PropsWithChildren {
  gap?: number;
  visible?: boolean;
  position?: Position,
  transform?: {
    translateX?: number;
    translateY?: number;
  },
}

const DropdownOptions: React.FC<DropdownOptionsProps> = ({
  children,
  gap = 2,
  visible,
  position = {
    top: '100%',
    right: 0,
  },
  transform,
}) => {
  if (!visible) return null;

  return (
    <View
      style={[
        styles.dropdownOptions,
        {
          gap,
          top: position?.top ?? undefined,
          bottom: position?.bottom ?? undefined,
          right: position?.right ?? undefined,
          left: position?.left ?? undefined,
          transform: [
            { translateX: transform?.translateX ?? 0 },
            { translateY: transform?.translateY ?? 0 },
          ]
        }
      ]}
    >
      {children}
    </View>
  )
};

export default DropdownOptions;
