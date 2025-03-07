import { Theme } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import React, { useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
import { MediaItem } from "./render-media-item";


const { width } = Dimensions.get("window");
interface IProps {
    media: MediaItem[];
    xl: any;
    MAX_WIDTH_WEB: number;
    theme?: Theme
    padding?: number
}

const ScrollMedia = ({ media, xl, MAX_WIDTH_WEB, padding }: IProps) => {
    const styles = stylesWrapper(xl ? MAX_WIDTH_WEB : "100%", padding);
    return (
        <View style={styles.container}>
            <FlatList
                data={media}
                horizontal
                showsHorizontalScrollIndicator={true}
                keyExtractor={(item, index) => `${item.url}-${index}`}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => <MediaRenderer media={item} />}
                scrollEnabled={true}
            />
        </View>
    );
};

const MediaRenderer = ({ media }: { media: MediaItem }) => {
    const [thumbnail, setThumbnail] = useState(media.url);
    const styles = stylesWrapper(width);

    return (
        <View style={styles.mediaWrapper}>
            {media.type === "image" ? (
                <Image source={{ uri: media.url }} style={styles.media} />
            ) : (
                <Video
                    source={{ uri: media.url }}
                    style={styles.media}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={false}
                    usePoster={true}
                    posterSource={{ uri: thumbnail }}
                    posterStyle={styles.media}
                />
            )}
        </View>
    );
};

const stylesWrapper = (width: any, padding = 16) => StyleSheet.create({
    container: {
        width: width, // Fixed width container
        alignSelf: "center",
        padding: padding,
    },
    listContainer: {
        flexDirection: "row",
    },
    mediaWrapper: {
        marginRight: 10,
        borderRadius: 8,
        overflow: "hidden",
    },
    media: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
});

export default ScrollMedia;