import Colors from '@/shared-uis/constants/Colors';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
//  import LottieView from 'lottie-react-native';

const MyMessage = [
    "Loading your Preferences...",
    "Looking for matching items...",
    "Getting everything ready...",
    "Finalizing...",
    "Just a moment...",
];

const SlowLoader: React.FC<{ messages?: string[] }> = ({ messages = MyMessage }) => {
    const theme = useTheme();
    const styles = useMemo(() => useStyles(theme), [theme]);
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % messages.length);
        }, 4000); // Change text every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/loader-gif1.gif')}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.message}>
                {messages[messageIndex]}
            </Text>
            <ActivityIndicator size="large" color={Colors(theme).text} style={styles.spinner} />
        </View>
    );
}

function useStyles(theme: ReturnType<typeof useTheme>) {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backgroundColor: Colors(theme).background,
            padding: 20,
        },
        image: { width: 300, height: 300 },
        message: {
            color: Colors(theme).text,
            fontSize: 16,
            marginTop: 20,
            textAlign: "center",
        },
        spinner: { marginTop: 20 },
    });
}

export default SlowLoader;