import { useEffect, useState } from "react";
import { FlatList, Pressable, View, Text, Alert } from "react-native";
import * as searchHistory from "@utils/searchHistory";
import { Button, Typography, SearchBox } from "@components/index";
import GoodsThumbnail from "@components/GoodsThumbnail";
import Icon from "@components/Icon";

export default function Search() {
  const [recentSearches, setRecentSearches] = useState([]);

  const loadSearches = async () => {
    const searches = await searchHistory.getRecentSearches();
    setRecentSearches(searches);
  };

  const handleSearch = async (value: string) => {
    await searchHistory.addRecentSearch(value);
    loadSearches();
  };

  const handleRemoveSearches = async (value: string) => {
    await searchHistory.removeRecentSearch(value);
    loadSearches();
  };

  useEffect(() => {
    loadSearches();
  }, []);

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
          <FlatList
            horizontal
            data={recentSearches}
            contentContainerClassName="gap-2"
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              // TODO: Chip으로수정
              <View
                className={`p-2 rounded-full w-fit flex justify-center items-center bg-secondary-light text-secondary-dark flex-row gap-2`}
              >
                <Pressable onPress={() => {}}>
                  <Text className={`text-[14px] font-Dunggeunmiso`}>{item}</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    handleRemoveSearches(item);
                  }}
                >
                  <Icon name="close" fill="#AAAAAA" stroke="#AAAAAA" size={14} />
                </Pressable>
              </View>
            )}
          />
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
