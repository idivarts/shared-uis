import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { Animated, Modal, StyleSheet, Text, View } from "react-native";
import { Subject } from "rxjs";

interface ProgressLoaderProps {
    isProcessing: boolean;
    progress: number;
    subject?: Subject<any>;
}

const ProgressLoader: React.FC<ProgressLoaderProps> = ({ isProcessing, progress: mProgress, subject }) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const [progress, setProgress] = useState(mProgress);
    const styles = useMemo(() => makeStyles(colors, progress), [colors, progress]);
    const animatedWidth = new Animated.Value(progress);

    useEffect(() => {
        Animated.timing(animatedWidth, {
            toValue: progress,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    useEffect(() => {
        subject?.subscribe(({ percentage }) => {
            if (percentage != undefined) setProgress(percentage);
        });
    }, []);

    if (!isProcessing) return null;

    return (
        <Modal transparent animationType="fade" visible={isProcessing}>
            <View style={styles.modalContainer}>
                <View style={styles.loaderBox}>
                    <Text style={styles.loadingText}>Processing... {Math.round(progress)}%</Text>
                    <View style={styles.progressBar}>
                        <Animated.View style={[styles.progressFill]} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

function makeStyles(colors: ReturnType<typeof Colors>, progress: number) {
    return StyleSheet.create({
        modalContainer: {
            flex: 1,
            backgroundColor: colors.backdrop,
            justifyContent: "center",
            alignItems: "center",
        },
        loaderBox: {
            width: 250,
            padding: 20,
            backgroundColor: colors.card,
            borderRadius: 10,
            alignItems: "center",
        },
        loadingText: {
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 10,
            color: colors.text,
        },
        progressBar: {
            width: "100%",
            height: 10,
            backgroundColor: colors.border,
            borderRadius: 5,
            overflow: "hidden",
        },
        progressFill: {
            height: "100%",
            width: `${progress}%`,
            backgroundColor: colors.primary,
        },
    });
}

export default ProgressLoader;
