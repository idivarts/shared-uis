import { useTheme } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { Pressable, Text } from "react-native";
import getDropdownStyles from "../../styles/dropdown/Dropdown.styles";

interface DropdownButtonProps {
    hoverInColor?: string;
    onPress?: () => void;
    title: string;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
    hoverInColor,
    onPress,
    title,
}) => {
    const theme = useTheme();
    const styles = useMemo(() => getDropdownStyles(theme), [theme]);
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
                isHovered && styles.dropdownButtonHover,
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
