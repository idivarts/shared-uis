import Colors from "@/shared-uis/constants/Colors";
import { Theme, useTheme } from "@react-navigation/native";
import React, { createContext, useContext, useState } from "react";
import { Modal, Platform, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { Text, View } from "./theme/Themed";

interface FirstMessageThreadModalProps {
    animationType?: "none" | "slide" | "fade";
    onClose: () => void;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    visible: boolean;
}

const FirstMessageThreadModalContext = createContext<{
    openModal: (props?: Partial<FirstMessageThreadModalProps>) => void
}>({
    openModal: () => { },
});

export const useFirstMessageThreadModal = () => useContext(FirstMessageThreadModalContext);

export const FirstMessageThreadModalProvider = ({ children }: { children: any }) => {
    const [props, setProps] = useState<FirstMessageThreadModalProps>({
        animationType: "fade",
        onClose: () => { setProps((prev) => ({ ...prev, visible: false })) },
        setVisible: () => { },
        visible: false,
    });

    const openModal = (mprops?: Partial<FirstMessageThreadModalProps>) => {
        setProps({
            ...props,
            ...mprops,
            visible: true
        });
    }

    return (
        <FirstMessageThreadModalContext.Provider value={{ openModal }}>
            {children}
            <FirstMessageThreadModal
                {...props}
                setVisible={() => setProps((prev) => ({ ...prev, visible: false }))}
            />
        </FirstMessageThreadModalContext.Provider>
    )
}

const FirstMessageThreadModal: React.FC<FirstMessageThreadModalProps> = ({
    animationType = "fade",
    onClose,
    setVisible,
    visible,
}) => {
    const theme = useTheme();
    const styles = stylesFn(theme);

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
        setVisible(false);
    }

    return (
        <Modal
            animationType={animationType}
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                handleClose();
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {/* Close Button (X) */}
                    <Button
                        icon="close"
                        onPress={handleClose}
                        style={styles.closeButton}
                        labelStyle={styles.closeButtonLabel}
                    />

                    {/* Congratulations Title */}
                    <Text style={styles.modalTitle}>Congratulations!</Text>

                    {/* Message */}
                    <Text style={styles.modalText}>
                        You are now connected with the influencer. Chat with them before you start the contract with them
                    </Text>

                    {/* Understood Button */}
                    <Button
                        mode="contained"
                        onPress={handleClose}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                    >
                        Understood
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

const stylesFn = (theme: Theme) => StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors(theme).backdrop,
    },
    modalView: {
        margin: 20,
        backgroundColor: Colors(theme).background,
        borderRadius: 16,
        padding: 25,
        shadowColor: Colors(theme).backdrop,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        ...(Platform.OS === "web" && { maxWidth: 500 }),
        position: "relative",
    },
    closeButton: {
        position: "absolute",
        top: 16,
        right: 8,
        zIndex: 10,
    },
    closeButtonLabel: {
        fontSize: 24,
    },
    modalTitle: {
        marginTop: 20,
        marginBottom: 16,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 24,
        textAlign: "center",
        lineHeight: 24,
        fontSize: 14,
    },
    button: {
        backgroundColor: Colors(theme).primary,
        marginTop: 16,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: "600",
    },
});

export default FirstMessageThreadModal;
