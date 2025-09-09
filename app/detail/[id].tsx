import React from "react";
import { View, ScrollView, Image, Pressable } from "react-native";
import { useLocalSearchParams, Stack, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { supabase } from "@/utils/supabase";

import { WiggleBorder, WiggleDivider, Chip, Typography, Icon } from "@/components";

const MOCKUP_LIST = [{ id: 1, name: "히나타", type: "wish" }] as const;

interface IAnime {
  id: number;
  kr_title: string;
}

interface IGacha {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  name_kr: string;
  image_link: string;
  anime_id?: number;
  price: number;
  anime?: IAnime;
}

interface IGachaItem {
  id: number;
  name: string;
  type: "wish" | "get";
  image_link?: string;
}

export default function DetailPagef() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [gachaData, setGachaData] = React.useState<IGacha | null>(null);
  const [list, setList] = React.useState<IGachaItem[]>([]);

  React.useEffect(() => {
    const fetchGachaData = async () => {
      try {
        // id로 가챠 데이터 조회, anime_id가 있으면 anime 테이블을 join해서 가져오기
        const { data, error } = await supabase
          .from("gacha")
          .select(
            `
            *,
            anime:anime_id (
              id,
              kr_title
            )
          `
          )
          .eq("id", id)
          .single();

        if (error || !data) throw error;
        setGachaData(data);
        // TODO: 가챠 내 아이템 목록은 임시로 mockup 데이터, 추후에 치환
        setList([...MOCKUP_LIST]);
      } catch (err) {
        console.error("🚨 Catch block error:", err);
        navigation.goBack();
      }
    };

    fetchGachaData();
  }, [navigation, id]);

  const handleAddGacha = () => {
    // TODO:
    console.log("🚀 추가 Bottom Sheet 열기");
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View className="relative flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex flex-row items-center justify-between px-3" style={{ height: 52 }}>
        <Pressable onPress={handleBack}>
          <Icon name="back" size={24} fill="secondary.dark" stroke="secondary.dark" />
        </Pressable>
      </View>

      <ScrollView className="px-3 py-2">
        {/* 가챠 이미지 */}
        <WiggleBorder height={350} backgroundColor="#fff" borderZIndex={2}>
          <View className="p-2 w-full h-full">
            <Image source={{ uri: gachaData?.image_link }} className="w-full h-full" />
          </View>
        </WiggleBorder>

        {/* 가챠 에니메이션 제목 (없는 경우, 기타) */}
        <View className="py-2 flex items-start">
          <Chip label={gachaData?.anime?.kr_title || "기타"} />
        </View>

        {/* 가챠 이름 */}
        <Typography variant="Header2" twotone="primary">
          {gachaData?.name_kr}
        </Typography>

        <View className="py-2">
          <WiggleDivider strokeWidth={2} strokeColor="secondary.dark" />
        </View>

        {/* 가챠의 내 아이템 목록 (Wish, Get) */}
        {list.map((item) => (
          <WiggleBorder key={`gacha-item-${item.id}`} strokeColor="secondary.dark">
            <View className="flex flex-row gap-2 p-2">
              <View className="rounded" style={{ width: 44, height: 44 }}>
                <Image
                  source={{ uri: item.image_link || gachaData?.image_link }}
                  className="w-full h-full"
                />
              </View>
              <View className="my-auto flex-1">
                <Typography variant="Header5" color="secondary.dark">
                  {item.name}
                </Typography>
              </View>

              <View
                className={`rounded my-auto bg-${item.type === "wish" ? "primary" : "secondary"} flex items-center justify-center`}
                style={{ width: 56, height: 28 }}
              >
                <Typography variant="Tag" color="secondary-light">
                  {item.type.toUpperCase()}
                </Typography>
              </View>
            </View>
          </WiggleBorder>
        ))}
      </ScrollView>

      {/* Add Gacha Floating Button */}
      <Pressable
        className="bg-primary rounded-full p-2 absolute"
        style={{ bottom: 8 + insets.bottom, right: 12 }}
        onPress={handleAddGacha}
      >
        <Icon name="plus" size={36} fill="#fff" />
      </Pressable>
    </View>
  );
}
