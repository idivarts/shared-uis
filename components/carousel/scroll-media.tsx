import { ResizeMode, Video } from "expo-av";
import React, { useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
import { MediaItem } from "./render-media-item";


const { width } = Dimensions.get("window");

const ScrollMedia = ({ media, xl, MAX_WIDTH_WEB }: { media: MediaItem[], xl: any, MAX_WIDTH_WEB: number }) => {
    const styles = stylesWrapper(xl ? MAX_WIDTH_WEB : width);
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

const stylesWrapper = (width: number) => StyleSheet.create({
    container: {
        width: width, // Fixed width container
        alignSelf: "center",
        padding: 10,
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