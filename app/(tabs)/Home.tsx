import { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";

import { supabase } from "@/utils/supabase";

import { Button, Typography, FeaturedSwiper } from "@/components";
import { TGacha } from "@/types/gacha";

export default function Home() {
  const [newGachaList, setNewGachaList] = useState<TGacha[]>([]);

  useEffect(() => {
    const fetchGachaData = async () => {
      try {
        const { data } = await supabase
          .from("gacha")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);
        if (!data?.length) throw new Error("No data");
        setNewGachaList(data);
        console.log("heidi test -- ", data);
      } catch (error) {
        console.error("🚨 Catch block error:", error);
      }
    };
    fetchGachaData();
  }, []);

  const handleNavigateToDetail = (id: number) => {
    router.push(`/detail/${id}`);
  };

  return (
    <View>
      <Typography variant="Header1" color="secondary-dark">
        홈
      </Typography>

      <View>
        <FeaturedSwiper
          title="새로 나왔어요!"
          data={newGachaList.map((gacha) => ({ ...gacha, imageUrl: gacha.image_link }))}
          onSlidePress={(item) => handleNavigateToDetail(item.id)}
          loop={true}
        />

        <Button onPress={() => handleNavigateToDetail(67)}>
          <Typography variant="Body1" color="white">
            상세페이지로 이동 (ID: 67)
          </Typography>
        </Button>
      </View>
    </View>
  );
}
