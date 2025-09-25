import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

import images from "@table/images";
import { Alert, Linking } from "react-native";

const grantedPermission = async () => {
  const { accessPrivileges, canAskAgain, granted } = await MediaLibrary.getPermissionsAsync();

  if (!granted) {
    const { granted: newPermission } = await MediaLibrary.requestPermissionsAsync();
    return newPermission;
  }

  if (accessPrivileges === "limited" && canAskAgain) {
    Alert.alert(
      "'모든 사진' 접근 허용이 필요합니다",
      "사진을 모두 보려면 설정에서 '모든 사진'으로 권한을 변경해주세요.",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "설정으로 이동",
          onPress: () => Linking.openSettings(),
        },
      ]
    );
    return false;
  }

  return granted;
};

const selectImage = async () => {
  const isGranted = await grantedPermission();

  if (!isGranted) {
    console.error("Canntot access to mediaLibray");
    return null;
  }

  const selectImg = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: "images",
  });

  if (!selectImg.canceled) return selectImg.assets[0];

  return null;
};

const saveImage = async (img?: ImagePicker.ImagePickerAsset) => {
  let selectImg = img || (await selectImage());
  if (!selectImg) return null;

  try {
    const assetId = selectImg.assetId;

    if (assetId) {
      // 로컬 디비 저장
      await images.create(assetId);
      return assetId;
    }
  } catch (e) {
    console.error("err", e);
    return null;
  }
};

const loadImage = async (assetId: string) => {
  const assetInfo = await MediaLibrary.getAssetInfoAsync(assetId);

  if (assetInfo) {
    return assetInfo.uri;
  } else {
    // 로컬 디비에 저장되어있는 assetId 삭제
    // await images.deleteByAssetId(assetId);
    return null;
  }
};

export { selectImage, saveImage, loadImage };
