import { useEffect, useState } from "react";
import { Text, View, Image, Pressable } from "react-native";

import images from "@table/images";
import uploadImage from "@utils/saveImage";

export default function Index() {
  const [image, setImage] = useState<string>();
  const [prevImg, setPrevImg] = useState<string>();

  const pickImage = async () => {
    const uploadImg = await uploadImage();
    if (uploadImg) {
      setPrevImg(image);
      setImage(uploadImg.path);
    }
  };

  const loadPrevImage = async () => {
    const img = await images.getLastest();

    if (img?.path) {
      setPrevImg(img.path);
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
