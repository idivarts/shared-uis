import { useTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { Chip, ChipProps } from "react-native-paper";

import Colors from "@/shared-uis/constants/Colors";

const Tag: React.FC<ChipProps> = ({ children, ...props }) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    return (
        <Chip style={styles.tag} textStyle={styles.tagText} {...props}>
            {children}
        </Chip>
    );
};

const useStyles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        tag: {
            backgroundColor: Colors(theme).tag,
            paddingVertical: 0,
            paddingHorizontal: 0,
            borderRadius: 10,
        },
        tagText: {
            fontSize: 12,
            color: Colors(theme).tagForeground,
        },
    });

export default Tag;
