import { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";

import { supabase } from "@/utils/supabase";

import { Button, Typography, FeaturedSwiper } from "@/components";

const LIMIT_COUNT = 5;

interface PreviewGacha {
  id: number;
  image_link: string;
  anime_id: number;
}

export default function Home() {
  const [newGachaList, setNewGachaList] = useState<PreviewGacha[]>([]);
  const [popularGachaList, setPopularGachaList] = useState<PreviewGacha[]>([]);

  useEffect(() => {
    const fetchNewGachaData = async () => {
      try {
        // 새로 나왔어요!
        const { data } = await supabase
          .from("gacha")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(LIMIT_COUNT);
        if (!data?.length) throw new Error("No data");
        setNewGachaList(data);
      } catch (error) {
        console.error("❌ 새로 나왔어요! 가챠 데이터 조회 실패 : ", error);
      }
    };

    // 최근 10일 동안 많이 본 가챠 상위 5개 조회
    const fetchPopularGachaData = async () => {
      try {
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

        const { data } = await supabase
          .from("gacha_view_log")
          .select(
            `
            gacha_id,
            gacha!inner (
              id,
              image_link,
              anime_id
            )
          `
          )
          .gte("created_at", tenDaysAgo.toISOString())
          .order("created_at", { ascending: false });

        if (!data?.length) return;

        const gachaData = data.reduce(
          (acc: Record<number, { count: number; gacha: PreviewGacha }>, item: any) => {
            const { gacha_id, gacha } = item;
            if (!acc[gacha_id]) acc[gacha_id] = { count: 0, gacha: gacha as PreviewGacha };
            acc[gacha_id].count += 1;
            return acc;
          },
          {}
        );
        const list = Object.values(gachaData)
          .sort((a, b) => b.count - a.count)
          .map((item) => item.gacha)
          .slice(0, LIMIT_COUNT);
        setPopularGachaList(list);
      } catch (error) {
        console.error("❌ 인기 가챠 데이터 조회 실패:", error);
      }
    };

    fetchNewGachaData();
    fetchPopularGachaData();
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

        <FeaturedSwiper
          title="지금 이게 인기에요!"
          data={popularGachaList.map((gacha) => ({ ...gacha, imageUrl: gacha.image_link }))}
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
