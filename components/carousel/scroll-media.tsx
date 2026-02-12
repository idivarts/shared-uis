import { Theme } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import React from "react";
import { Dimensions, FlatList, Image, Platform, StyleSheet, View } from "react-native";
import { MediaItem } from "./render-media-item";


const { width } = Dimensions.get("window");
interface IProps {
    media: MediaItem[];
    xl: any;
    MAX_WIDTH_WEB: any;
    theme?: Theme
    padding?: number,
    mediaRes?: { width: number, height: number }
}

const ScrollMedia = ({ media, xl, MAX_WIDTH_WEB, padding, mediaRes }: IProps) => {
    const styles = stylesWrapper("100%", padding);
    return (
        <View style={styles.container}>
            <FlatList
                data={media}
                horizontal
                showsHorizontalScrollIndicator={true}
                keyExtractor={(item, index) => `${item.url}-${index}`}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => <MediaRenderer media={item} mediaRes={mediaRes} />}
                scrollEnabled={true}
            />
        </View>
    );
};

const MediaRenderer = ({ media, mediaRes }: { media: MediaItem, mediaRes?: { width: number, height: number } }) => {
    // const [thumbnail, setThumbnail] = useState(media.url);
    const styles = stylesWrapper(width, undefined, mediaRes);
    const isImage = media.type.includes("image") || media.type.includes("reel");
    const imageUrl = media.imageUrl || media.url;

    return (
        <View style={styles.mediaWrapper}>
            {isImage ? (
                <Image source={{ uri: imageUrl }} style={styles.media} />
            ) : (
                Platform.OS === "web" ? (
                    <View style={styles.media}>
                        <video
                            src={media.url}
                            style={{ width: "100%", height: "100%" }}
                            autoPlay={false}
                            controls={true}
                        // resizeMode="cover"
                        // paused={true}
                        // poster={media.url}
                        // onLoad={() => setThumbnail(media.url)}
                        />
                    </View>
                ) : (
                    <Video
                        source={{ uri: media.url }}
                        style={styles.media}
                        resizeMode={ResizeMode.COVER}
                        shouldPlay={false}
                        useNativeControls={true}
                        usePoster={true}
                        posterSource={{ uri: media.url }}
                        posterStyle={styles.media}
                    />)
            )}
        </View>
    );
};

const stylesWrapper = (width: any, padding = 16, mediaRes: any = undefined) => StyleSheet.create({
    container: {
        width: width, // Fixed width container
        alignSelf: Platform.OS == "web" ? "flex-start" : "center",
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
    media: mediaRes ? {
        ...mediaRes,
        borderRadius: 8,
    } : {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
});

export default ScrollMedia;
