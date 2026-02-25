import { Theme } from "@react-navigation/native";
import React from "react";
//  import { Controlled as Zoom } from 'react-medium-image-zoom';
import Zoom from 'react-medium-image-zoom';
//  import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import 'react-medium-image-zoom/dist/styles.css';
import { Modal } from "react-native";
import Colors from "@/shared-uis/constants/Colors";


interface AssetPreviewModalProps {
    previewImage: boolean;
    previewImageUrl: string | null;
    setPreviewImage: React.Dispatch<React.SetStateAction<boolean>>;
    theme: Theme;
}


const AssetPreviewModal: React.FC<AssetPreviewModalProps> = ({
    previewImage,
    previewImageUrl,
    setPreviewImage,
    theme,
}) => {
    const colors = Colors(theme);

    return (previewImage && (
        <Modal visible={true} animationType="fade">
            <div style={{
                position: 'absolute',
                top: 20,
                right: 20,
                zIndex: 1000,
                backgroundColor: colors.backdrop,
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
            }}
                onClick={() => setPreviewImage(false)}
            >
                <span style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>✕</span>
            </div>
            <Zoom>
                <img
                    src={previewImageUrl || ""}
                    alt="Zoomable"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
            </Zoom>
        </Modal>
    )
    );
};

export default AssetPreviewModal;
