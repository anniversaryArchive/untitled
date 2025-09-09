import React from "react";
import { View, ScrollView, Image, Pressable } from "react-native";
import { useLocalSearchParams, Stack, useNavigation } from "expo-router";

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
  const { id } = useLocalSearchParams<{ id: string }>();

  const [gachaData, setGachaData] = React.useState<IGacha | null>(null);
  const [list, setList] = React.useState<IGachaItem[]>([]);

  React.useEffect(() => {
    const fetchGachaData = async () => {
      try {
        // anime_id가 있으면 anime 테이블을 join해서 가져오기
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

  return (
    <View className="relative flex-1">
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShown: true,
          headerBackVisible: true,
          headerShadowVisible: false,
        }}
      />
      <ScrollView className="bg-white px-3 py-2">
        <WiggleBorder height={350} backgroundColor="#fff" borderZIndex={2}>
          <View className="p-2 w-full h-full">
            <Image source={{ uri: gachaData?.image_link }} className="w-full h-full" />
          </View>
        </WiggleBorder>

        {gachaData?.anime?.kr_title && (
          <View className="py-2">
            <Chip label={gachaData.anime.kr_title} />
          </View>
        )}

        <Typography variant="Header2" twotone="primary">
          {gachaData?.name_kr}
        </Typography>

        <View className="py-2">
          <WiggleDivider strokeWidth={2} strokeColor="secondary.dark" />
        </View>

        {list.map((item) => (
          <WiggleBorder key={`gacha-item-${item.id}`} strokeColor="secondary.dark">
            <View className="flex flex-row gap-2 m-2">
              <View className="w-11 h-11 rounded">
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
                className={`rounded my-auto w-14 bg-${item.type === "wish" ? "primary" : "secondary"}`}
              >
                <Typography
                  variant="Tag"
                  color="secondary-light"
                  className="h-full text-center py-1.5"
                >
                  {item.type.toUpperCase()}
                </Typography>
              </View>
            </View>
          </WiggleBorder>
        ))}
      </ScrollView>

      <Pressable
        className="absolute bg-primary rounded-full p-2 bottom-2 right-2 shadow"
        onPress={handleAddGacha}
      >
        <Icon name="plus" size={36} fill="#fff" />
      </Pressable>
    </View>
  );
}
