import { ColorsStatic } from "@/shared-uis/constants/Colors";
import React, { useEffect, useState } from "react";
import { Animated, Modal, StyleSheet, Text, View } from "react-native";
import { Subject } from "rxjs";

interface ProgressLoaderProps {
    isProcessing: boolean;
    progress: number; // Progress percentage (0 to 100)
    subject?: Subject<any>
}

const ProgressLoader: React.FC<ProgressLoaderProps> = ({ isProcessing, progress: mProgress, subject }) => {
    const [progress, setProgress] = useState(mProgress)
    const animatedWidth = new Animated.Value(progress);

    useEffect(() => {
        Animated.timing(animatedWidth, {
            toValue: progress,
            duration: 500, // Smooth transition
            useNativeDriver: false,
        }).start();
    }, [progress]);

    useEffect(() => {
        subject?.subscribe(({ percentage }) => {
            if (percentage != undefined)
                setProgress(percentage)
            // setProgress(progress + increment)
        })
    }, [])

    if (!isProcessing) return null;

    return (
        <Modal transparent={true} animationType="fade" visible={isProcessing}>
            <View style={styles.modalContainer}>
                <View style={styles.loaderBox}>
                    <Text style={styles.loadingText}>Processing... {Math.round(progress)}%</Text>
                    <View style={styles.progressBar}>
                        <Animated.View
                            style={[
                                styles.progressFill,
                                { width: `${progress}%` }, // Animated width based on progress
                            ]}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    loaderBox: {
        width: 250,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    loadingText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    progressBar: {
        width: "100%",
        height: 10,
        backgroundColor: ColorsStatic.progressBarTrack,
        borderRadius: 5,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: ColorsStatic.progressBarFill,
    },
});

export default ProgressLoader;