import Colors from "@/shared-uis/constants/Colors";
import { Theme } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "react-native";

interface AssetPreviewModalProps {
    previewImage: boolean;
    previewImageUrl: string | null;
    /** When set, the modal shows a full-screen video player instead of the image lightbox. */
    previewVideoUrl?: string | null;
    setPreviewImage: React.Dispatch<React.SetStateAction<boolean>>;
    theme: Theme;
}

/**
 * Web lightbox for a single image.
 *
 * Replaces the old `react-medium-image-zoom` setup, which was built for inline
 * thumbnails and misbehaved inside a fullscreen modal (opened pre-zoomed, close
 * button only showed in the zoomed layer, Escape did nothing). This is a plain
 * overlay that:
 *  - fits the image to the screen by default (object-fit: contain),
 *  - always shows the close button,
 *  - closes on Escape or a click on the backdrop,
 *  - toggles a real zoom (natural size, scrollable) when the image is clicked.
 */
const AssetPreviewModal: React.FC<AssetPreviewModalProps> = ({
    previewImage,
    previewImageUrl,
    previewVideoUrl,
    setPreviewImage,
    theme,
}) => {
    const colors = Colors(theme);
    const [zoomed, setZoomed] = useState(false);
    const isVideo = !!previewVideoUrl;

    const close = useCallback(() => {
        setZoomed(false);
        setPreviewImage(false);
    }, [setPreviewImage]);

    // Reset zoom on each open + wire Escape to close.
    useEffect(() => {
        if (!previewImage) return;
        setZoomed(false);
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [previewImage, close]);

    if (!previewImage) return null;

    return (
        <Modal visible transparent animationType="fade" onRequestClose={close}>
            {/* Backdrop — clicking anywhere outside the image closes. */}
            <div
                onClick={close}
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: colors.backdropStrong,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: zoomed && !isVideo ? "auto" : "hidden",
                    padding: zoomed && !isVideo ? 0 : 24,
                    boxSizing: "border-box",
                }}
            >
                {/* Close — always visible, fixed to the viewport corner. */}
                <button
                    type="button"
                    aria-label="Close preview"
                    onClick={(e) => {
                        e.stopPropagation();
                        close();
                    }}
                    style={{
                        position: "fixed",
                        top: 20,
                        right: 20,
                        zIndex: 10,
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: colors.backdrop,
                        color: colors.white,
                        fontSize: 20,
                        fontWeight: "bold",
                        lineHeight: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    ✕
                </button>

                {isVideo ? (
                    <video
                        src={previewVideoUrl || ""}
                        controls
                        autoPlay
                        playsInline
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                        }}
                    />
                ) : (
                    <img
                        src={previewImageUrl || ""}
                        alt="Preview"
                        onClick={(e) => {
                            e.stopPropagation();
                            setZoomed((z) => !z);
                        }}
                        style={
                            zoomed
                                ? {
                                      maxWidth: "none",
                                      maxHeight: "none",
                                      width: "auto",
                                      height: "auto",
                                      cursor: "zoom-out",
                                  }
                                : {
                                      maxWidth: "100%",
                                      maxHeight: "100%",
                                      objectFit: "contain",
                                      cursor: "zoom-in",
                                  }
                        }
                    />
                )}
            </div>
        </Modal>
    );
};

export default AssetPreviewModal;
