import { useCallback, useEffect, useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import { Button, Typography, SearchBox, Chip, GoodsThumbnail } from "@components/index";
import * as searchHistory from "@utils/searchHistory";

export default function Search() {
  const [recentSearches, setRecentSearches] = useState([]);

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

  useEffect(() => {
    loadSearches();
  }, [loadSearches]);

  return (
    <View className="flex gap-12">
      <SearchBox
        onSubmit={(value) => {
          handleSearch(value);
        }}
      />
      {recentSearches.length > 0 && (
        <View className="flex gap-1">
          <View className="flex flex-row items-baseline justify-between">
            <Typography variant="Header4">최근 검색어</Typography>
            <Button
              variant="text"
              size="md"
              color="secondary-dark"
              onPress={() => {
                Alert.alert("최근 검색어를 전체 삭제하시겠습니까?", undefined, [
                  {
                    text: "취소",
                    style: "cancel",
                  },
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
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="min-h-11"
            contentContainerClassName="gap-2"
          >
            {recentSearches.map((term, index) => (
              <Chip
                key={`${term}_${index}`}
                size="lg"
                color="secondary-light"
                label={term}
                onClick={() => {
                  // TODO: 검색 기능 생기면 연결하기
                  handleSearch(term);
                }}
                onDelete={() => {
                  handleRemoveSearches(term);
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
