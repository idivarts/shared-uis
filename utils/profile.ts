import { NativeAssetItem } from "../types/Asset";
import { processRawAttachment } from "./attachments";

export const generateEmptyAssets = (
  attachments: any[],
  items: NativeAssetItem[]
) => {
  if (!attachments) {
    return items;
  }

  const assetsLength = attachments.length;

  let assets =
    attachments.map((attachment, index) => {
      return {
        ...processRawAttachment(attachment),
      };
    }) || items;

  for (let i = assetsLength; i < 6; i++) {
    assets.push({
      url: "",
      type: "",
    });
  }

  return assets;
};
