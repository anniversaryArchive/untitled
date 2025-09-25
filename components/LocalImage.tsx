import React, { useState, useEffect } from "react";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import images from "@table/images";

interface ILocalImageProps {
  assetId: string;
  width?: number;
  height?: number;
}

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const LocalImage = (props: ILocalImageProps) => {
  const { assetId, width = 155, height = 155 } = props;
  const [imageUri, setImageUri] = useState<string>();

  useEffect(() => {
    const loadImage = async () => {
      try {
        const assetInfo = await MediaLibrary.getAssetInfoAsync(assetId);

        if (assetInfo) {
          setImageUri(assetInfo.localUri);
        } else {
          // 로컬 디비에 저장되어있는 assetId 삭제
          //   await images.deleteByAssetId(assetId);
        }
      } catch (error) {
        console.error("미디어 라이브러리에서 에러 발생:", error);
        setImageUri(undefined);
      }
    };

    loadImage();
  }, [assetId]);

  return <Image source={{ uri: imageUri }} style={{ width, height }} placeholder={{ blurhash }} />;
};

export default LocalImage;
