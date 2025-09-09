import { useCallback, useEffect, useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import { Button, Typography, SearchBox, Chip } from "@components/index";
import * as searchHistory from "@utils/searchHistory";
import SimpleSwiper from "@components/SimpleSwiper";

interface GoodsItem {
  id: string;
  title: string;
  subtitle: string;
}

export default function Search() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recentGoods, setRecentGoods] = useState<GoodsItem[]>([
    { id: "1", title: "히나타", subtitle: "[하이큐!! 네무라세테]" },
    { id: "2", title: "카게야마", subtitle: "[하이큐!! 극장판]" },
    { id: "3", title: "츠키시마", subtitle: "[하이큐!! 특별판]" },
    { id: "4", title: "나루토", subtitle: "[나루토 극장판]" },
  ]);

  const loadSearches = useCallback(async () => {
    const searches = await searchHistory.getRecentSearches();
    setRecentSearches(searches);
  }, []);

  const handleSearch = async (value: string) => {
    await searchHistory.addRecentSearch(value);
    await loadSearches();
  };

  const handleRemoveSearches = async (value: string) => {
    await searchHistory.removeRecentSearch(value);
    await loadSearches();
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

  useEffect(() => {
    loadSearches();
  }, [loadSearches]);

  return (
    <View className="flex-1">
      {/* 상단 고정 SearchBox */}
      <View>
        <SearchBox className="h-16" onSubmit={handleSearch} />
      </View>

      {/* 아래 스크롤 영역 */}
      <ScrollView
        contentContainerClassName="pb-4"
        showsVerticalScrollIndicator={false}
      >
        {/* 최근 검색어 */}
        <View className="mt-4 mb-4">
          <View className="flex flex-row justify-between items-center mb-2">
            <Typography variant="Header4">최근 검색어</Typography>
            {recentSearches.length > 0 && (
              <Button
                variant="text"
                size="md"
                color="secondary-dark"
                onPress={() => {
                  Alert.alert("최근 검색어를 전체 삭제하시겠습니까?", undefined, [
                    { text: "취소", style: "cancel" },
                    {
                      text: "삭제",
                      onPress: async () => {
                        await searchHistory.clearRecentSearches();
                        setRecentSearches([]);
                      },
                    },
                  ]);
                }}
              >
                전체 삭제
              </Button>
            )}
          </View>

          {recentSearches.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2 items-center min-h-11"
            >
              {recentSearches.map((term, index) => (
                <Chip
                  key={`${term}_${index}`}
                  size="lg"
                  color="secondary-light"
                  label={term}
                  onClick={() => handleSearch(term)}
                  onDelete={() => handleRemoveSearches(term)}
                />
              ))}
            </ScrollView>
          ) : (
            <View className="items-center justify-center h-11">
              <Typography variant="Body2" color="secondary-dark">
                최근 검색어가 없습니다.
              </Typography>
            </View>
          )}
        </View>

        {/* 최근 본 굿즈 */}
        <View className="mt-4 mb-4">
          <View className="flex flex-row justify-between items-center mb-2">
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
            <View className="items-center justify-center h-11">
              <Typography variant="Body2" color="secondary-dark">
                최근 본 굿즈가 없습니다.
              </Typography>
            </View>
          )}
        </View>

        {/* 인기 굿즈 */}
        <View className="mt-4 mb-4">
          <Typography variant="Header4" className="mb-2">
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