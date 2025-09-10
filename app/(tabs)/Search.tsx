import { useCallback, useEffect, useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import { Button, Typography, SearchBox, Chip, GoodsThumbnail } from "@components/index";
import * as searchHistory from "@utils/searchHistory";

export default function Search() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleAddSearch = useCallback(async (value: string) => {
    if (!value.trim()) return;

    setRecentSearches((prev) => {
      const prevSearches = prev.filter((item) => item !== value);
      return [value, ...prevSearches].slice(0, 10);
    });
    await searchHistory.addRecentSearch(value);
  }, []);

  const handleRemoveSearch = useCallback(async (value: string) => {
    setRecentSearches((prev) => prev.filter((item) => item !== value));
    await searchHistory.removeRecentSearch(value);
  }, []);

  const handleClearAllSearches = useCallback(() => {
    Alert.alert("최근 검색어를 전체 삭제하시겠습니까?", undefined, [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          setRecentSearches([]);
          await searchHistory.clearRecentSearches();
        },
      },
    ]);
  }, []);

  useEffect(() => {
    const loadInitialSearches = async () => {
      const searches = await searchHistory.getRecentSearches();
      setRecentSearches(searches);
    };
    loadInitialSearches();
  }, []);

  return (
    <View className=" flex gap-12 px-6">
      <SearchBox
        onSubmit={(value) => {
          handleAddSearch(value);
        }}
      />
      {recentSearches.length > 0 && (
        <View className="flex gap-1">
          <View className="flex flex-row items-center justify-between">
            <Typography variant="Header4">최근 검색어</Typography>
            <Button
              variant="text"
              size="md"
              color="secondary-dark"
              onPress={handleClearAllSearches}
            >
              전체 삭제
            </Button>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="min-h-11 -mx-6"
            contentContainerClassName="gap-2 pl-4"
          >
            {recentSearches.map((term, index) => (
              <Chip
                key={`${term}_${index}`}
                size="lg"
                color="secondary-light"
                label={term}
                onClick={() => {
                  // TODO: 검색 기능 생기면 연결하기
                  handleAddSearch(term);
                }}
                onDelete={() => {
                  handleRemoveSearch(term);
                }}
              />
            ))}
          </ScrollView>
        </View>
      )}
      <View className="flex gap-2">
        <Typography variant="Header4">최근 본 굿즈</Typography>
        <GoodsThumbnail />
      </View>
      <View className="flex gap-2">
        <Typography variant="Header4">인기 굿즈</Typography>
        <GoodsThumbnail />
      </View>
    </View>
  );
}
