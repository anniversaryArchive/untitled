import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Text, View, Image, Alert, Pressable } from "react-native";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

import images from "@/services/table/images";

export default function Index() {
  const [image, setImage] = useState<string>();
  const [prevImg, setPrevImg] = useState<string>();

  const pickImage = async () => {
    // 앨범 접근 권한 요청
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("권한 필요", "사진 앨범 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
    });

    if (!result.canceled) {
      const img = result.assets[0];

      // 리사이징
      const context = ImageManipulator.manipulate(img.uri);
      const imgg = await context.renderAsync();
      const res = await imgg.saveAsync({ compress: 0.7, format: SaveFormat.PNG });

      try {
        // FileSystem.documentDirectory을 사용한 경로를 따라야 기기 내 경로로 연결되어 재기동시에도 호출 가능
        const fileName = img.uri.split("/").pop();
        const newPath = `${FileSystem.documentDirectory}${fileName}`;
        setImage(newPath);

        // 이미지 파일 복사
        await FileSystem.copyAsync({
          from: res.uri,
          to: newPath,
        });
        // 로컬 디비 저장
        await images.create(newPath);
      } catch (e) {
        console.log("err", e);
      }
    }
  };

  const loadPrevImage = async () => {
    const firstRow = await images.getLastest();

    if (firstRow?.path) {
      setPrevImg(firstRow.path);
    } else {
      console.log("이미지 URI 불러오기 실패");
    }
  };

  useEffect(() => {
    if (images) {
      loadPrevImage();
    }
  }, []);

  return (
    <View className="flex-col items-center justify-center flex-1 gap-5">
      <Pressable onPress={pickImage}>
        <Text className="font-dunggeunmisoB text-primary text-3xl">사진첩 열기</Text>
      </Pressable>
      {image && (
        <View className="flex items-center justify-center">
          <Text className="font-dunggeunmiso text-secondary-dark text-2xl">선택된 사진</Text>
          <Image source={{ uri: image }} className="w-[200px] h-[200px]" />
        </View>
      )}
      {prevImg && (
        <View className="flex items-center justify-center">
          <Text className="font-dunggeunmiso text-secondary-dark text-2xl">최근 사진</Text>
          <Image source={{ uri: prevImg }} className="w-[200px] h-[200px]" />
        </View>
      )}
    </View>
  );
}
