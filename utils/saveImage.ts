import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

import images from "@table/images";

// 앨범 접근 권한
const grantedMediaLibraryPermission = async () => {
  const mediaLibraryPermission = await ImagePicker.getMediaLibraryPermissionsAsync(true);

  if (!mediaLibraryPermission.granted) {
    await ImagePicker.requestMediaLibraryPermissionsAsync(true);
    await grantedMediaLibraryPermission();
  }

  return true;
};

const selectImage = async () => {
  const isGranted = await grantedMediaLibraryPermission();
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

  // 리사이징
  const context = ImageManipulator.manipulate(selectImg.uri);
  const renderImg = await context.renderAsync();
  const resizingImg = await renderImg.saveAsync({ compress: 0.7, format: SaveFormat.PNG });

  try {
    // FileSystem.documentDirectory을 사용한 경로를 따라야 기기 내 경로로 연결되어 재기동시에도 호출 가능
    const newPath = `${FileSystem.documentDirectory}${selectImg.fileName}`;

    // 이미지 파일 복사
    await FileSystem.copyAsync({
      from: resizingImg.uri,
      to: newPath,
    });

    // 로컬 디비 저장
    const saveImg = await images.create(newPath);
    return saveImg;
  } catch (e) {
    console.error("err", e);
    return null;
  }
};

export { selectImage, saveImage };
