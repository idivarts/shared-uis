import { Theme } from "@react-navigation/native";
import React from "react";
// import { Controlled as Zoom } from 'react-medium-image-zoom';
import Zoom from 'react-medium-image-zoom';
// import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import 'react-medium-image-zoom/dist/styles.css';
import { Modal } from "react-native";


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

  return (previewImage && (
    <Modal visible={true} animationType="fade">
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.6)',
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
        <span style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>✕</span>
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
