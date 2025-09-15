// Search.tsx
import { useCallback, useEffect, useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import { Button, Typography, SearchBox, Chip } from "@components/index";
import * as searchHistory from "@utils/searchHistory";
import { supabase } from "@/utils/supabase";
import SimpleSwiper from "@components/SimpleSwiper";

interface IGoodsItem {
  id: string;
  title: string;
  subtitle: string;
}

export default function Search() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recentGoods, setRecentGoods] = useState<IGoodsItem[]>([
    { id: "1", title: "히나타", subtitle: "[하이큐!! 네무라세테]" },
    { id: "2", title: "카게야마", subtitle: "[하이큐!! 극장판]" },
    { id: "3", title: "츠키시마", subtitle: "[하이큐!! 특별판]" },
    { id: "4", title: "나루토", subtitle: "[나루토 극장판]" },
  ]);

  const [isLoggedIn] = useState(true);

  const user = { id: "550e8400-e29b-41d4-a716-446655440000" };

  const loadSearches = useCallback(async () => {
    if (isLoggedIn) {
      if (!user) {
        setRecentSearches([]);
        return;
      }
      const { data, error } = await supabase
        .from("recent_search")
        .select("keyword")
        .eq("user_id", user.id)
        .order("searched_at", { ascending: false })
        .limit(10);
      if (error) {
        console.error("Supabase recent search load error", error);
        setRecentSearches([]);
      } else {
        setRecentSearches(data?.map((item) => item.keyword) || []);
      }
    } else {
      const searches = await searchHistory.getRecentSearches();
      setRecentSearches(searches);
    }
  }, [isLoggedIn, user]);

  const handleSearch = async (value: string) => {
    if (isLoggedIn) {
      if (!user) return;
      const { error } = await supabase.from("recent_search").insert({
        user_id: user.id,
        keyword: value,
      });
      if (error) {
        console.error("Supabase recent search insert error", error);
      }
      await loadSearches();
    } else {
      await searchHistory.addRecentSearch(value);
      await loadSearches();
    }
  };

  const handleRemoveSearches = async (value: string) => {
    if (isLoggedIn) {
      if (!user) return;
      const { error } = await supabase
        .from("recent_search")
        .delete()
        .eq("user_id", user.id)
        .eq("keyword", value);
      if (error) {
        console.error("Supabase recent search delete error", error);
      }
      await loadSearches();
    } else {
      await searchHistory.removeRecentSearch(value);
      await loadSearches();
    }
  };

  const handleClearRecentGoods = () => {
    Alert.alert("최근 본 굿즈를 전체 삭제하시겠습니까?", undefined, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        onPress: () => setRecentGoods([]),
      },
    ]);
  };

  const handleClearRecentSearches = () => {
    Alert.alert("최근 검색어를 전체 삭제하시겠습니까?", undefined, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        onPress: async () => {
          try {
            if (isLoggedIn && user) {
              const { error } = await supabase
                .from("recent_search")
                .delete()
                .eq("user_id", user.id);
              if (error) {
                console.error("Supabase recent search clear error", error);
                return;
              }
            } else {
              await searchHistory.clearRecentSearches();
            }
            setRecentSearches([]);
          } catch (error) {
            console.error("Error clearing recent searches", error);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    loadSearches();
  }, [loadSearches]);

  return (
    <View className="flex-1">
      <View className="ml-2 mr-2">
        <SearchBox className="h-16" onSubmit={handleSearch} />
      </View>
      <ScrollView
        contentContainerClassName="pb-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-4 mb-4">
          <View className="flex flex-row justify-between items-center mb-2 ml-4 mr-4">
            <Typography variant="Header4">최근 검색어</Typography>
            {recentSearches.length > 0 && (
              <Button
                variant="text"
                size="md"
                color="secondary-dark"
                onPress={handleClearRecentSearches}
              >
                전체 삭제
              </Button>
            )}
          </View>
          {recentSearches.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2 items-center min-h-11 ml-4"
            >
              {recentSearches.map((term, index) => {
                const isLast = index === recentSearches.length - 1;
                return (
                  <Chip
                    key={`${term}_${index}`}
                    size="lg"
                    color="secondary-light"
                    label={term}
                    onClick={() => handleSearch(term)}
                    onDelete={() => handleRemoveSearches(term)}
                    className={isLast ? "mr-4" : ""}
                  />
                );
              })}
            </ScrollView>
          ) : (
            <View className="items-center justify-center h-11">
              <Typography variant="Body2" color="secondary-dark">
                최근 검색어가 없습니다.
              </Typography>
            </View>
          )}
        </View>
        <View className="mt-4 mb-4">
          <View className="flex flex-row justify-between items-center mb-2 ml-4 mr-4">
            <Typography variant="Header4">최근 본 굿즈</Typography>
            {recentGoods.length > 0 && (
              <Button
                variant="text"
                size="md"
                color="secondary-dark"
                onPress={handleClearRecentGoods}
              >
                전체 삭제
              </Button>
            )}
          </View>
          {recentGoods.length > 0 ? (
            <SimpleSwiper
              data={recentGoods}
              slidesPerView={2.5}
              itemSpacing={12}
              onSlidePress={(item) => console.log("선택한 굿즈:", item)}
            />
          ) : (
            <View className="items-center justify-center h-11 ml-4 mr-4">
              <Typography variant="Body2" color="secondary-dark">
                최근 본 굿즈가 없습니다.
              </Typography>
            </View>
          )}
        </View>
        <View className="mt-4 mb-4">
          <Typography variant="Header4" className="mb-2 ml-4 mr-4">
            인기 굿즈
          </Typography>
          <SimpleSwiper
            data={[
              { id: "1", title: "히나타", subtitle: "[하이큐!! 네무라세테]" },
              { id: "2", title: "카게야마", subtitle: "[하이큐!! 극장판]" },
              { id: "3", title: "츠키시마", subtitle: "[하이큐!! 특별판]" },
              { id: "4", title: "나루토", subtitle: "[나루토 극장판]" },
            ]}
            slidesPerView={2.5}
            itemSpacing={12}
            onSlidePress={(item) => console.log("선택한 굿즈:", item)}
          />
        </View>
      </ScrollView>
    </View>
  );
}
