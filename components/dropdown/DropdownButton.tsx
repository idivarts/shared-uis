import { useState } from "react";
import { Pressable, Text } from "react-native";

import styles from "../../styles/dropdown/Dropdown.styles";

interface DropdownButtonProps {
  onPress: () => void;
  title: string;
  hoverInColor?: string;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  onPress,
  title,
  hoverInColor,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleHoverIn = () => {
    setIsHovered(true);
  }

  const handleHoverOut = () => {
    setIsHovered(false);
  }

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={[
        styles.dropdownButton,
        {
          backgroundColor: isHovered ? (hoverInColor ?? 'lightgray') : 'white',
        }
      ]}
    >
      <Text
        style={styles.dropdownButtonText}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default DropdownButton;
