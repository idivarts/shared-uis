import { Theme } from "@react-navigation/native";
import ImageViewing from 'react-native-image-viewing';


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
  return (
    <ImageViewing
      images={[{ uri: previewImageUrl || "" }]}
      imageIndex={0}
      visible={previewImage}
      onRequestClose={() => setPreviewImage(false)}
    />
  );
};

export default AssetPreviewModal;
