import { SearchBox, Typography } from "@/components";
import GoodsThumbnail from "@/components/GoodsThumbnail";
import * as searchHistory from "@utils/searchHistory";
import { useCallback, useState, useEffect } from "react";
import { View, FlatList, Alert } from "react-native";
import { Button } from "@/components";
import { useLocalSearchParams } from "expo-router";
import React from "react";

// 상품 아이템 인터페이스
interface IGoodsItem {
  id: string;
  name_kr: string;
  name: string;
  image_link: string; // 이미지 URL 필드 추가
  animeName: string
}

// searchGachaAndAnimeByName의 반환 타입 정의
interface SearchResult {
  items: IGoodsItem[];
  totalCount: number;
}

export default function SearchResults() {
  const { searchTerm } = useLocalSearchParams<{ searchTerm?: string }>();
  const [searchValue, setSearchValue] = useState(searchTerm ?? "");
  const [data, setData] = useState<IGoodsItem[]>([]);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const loadSearches = useCallback(async () => {
    const searches = await searchHistory.getRecentSearches();
    // 필요 시 recent searches 상태에 저장 가능
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const result = (await searchHistory.searchGachaAndAnimeByName(
      String(searchValue),
      limit,
      offset
    )) as SearchResult;
    setLoadingMore(false);
    const newItems = result.items || [];
    if (newItems.length === 0 && offset > 0) {
      Alert.alert("알림", "더 이상 데이터가 없습니다.");
      setHasMore(false);
      return;
    }
    setData((prev) => {
      const prevIds = new Set(prev.map((item) => item.id));
      const filteredNewItems = newItems.filter(
        (item) => !prevIds.has(item.id)
      );
      return [...prev, ...filteredNewItems];
    });
    setOffset((prev) => prev + newItems.length);
    setTotalCount(result.totalCount ?? 0);

    const isEnd = result.totalCount != null && offset + newItems.length >= result.totalCount;
    if (isEnd || newItems.length < limit) setHasMore(false);
  };

  const handleSearch = async (value: string) => {
    setSearchValue(value);
    setOffset(0);

    const result = (await searchHistory.searchGachaAndAnimeByName(
      value,
      limit,
      0
    )) as SearchResult;

    setData(result.items);
    setOffset(result.items.length);
    setTotalCount(result.totalCount);
    setHasMore(result.totalCount > limit);
    await searchHistory.addRecentSearch(value);
    await loadSearches();
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
    }
  }, [searchTerm]);

  // renderItem
  const renderItem: ({item}: { item: any }) => JSX.Element = ({ item }) => {
    return (
      <GoodsThumbnail
        title={item.title}
        subtitle={item.subtitle}
        imgUrl={item.imageLink}
      />
    );
  };

  return (
    <View className="flex-1 bg-white">
      <View className="ml-2 mr-2">
        <SearchBox
          className="h-16"
          onSubmit={handleSearch}
          value={searchValue}
          onChangeText={setSearchValue}
        />
      </View>

      <FlatList<IGoodsItem>
        key={`numColumns-2`}
        numColumns={2}
        data={data}
        keyExtractor={(item, index) => item.id.toString() + "_" + index}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 16,
          marginTop: 10,
          marginBottom: 10,
        }}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <View>
            <View className="ml-4 mt-2 mb-1 flex-row items-center">
              <Typography
                variant="Header4"
                color="secondary-dark"
                className="mr-1"
              >
                검색 결과
              </Typography>
              <Typography variant="Header4" color="primary">
                {totalCount}
              </Typography>
              <Typography
                variant="Header4"
                color="secondary-dark"
                className="ml-1"
              >
                개
              </Typography>
            </View>
            <View className="border-t border-[#D2D2D2] mt-2 mx-5" />
          </View>
        )}
        ListFooterComponent={() =>
          hasMore ? (
            <View className="items-center py-4 px-5">
              <Button
                rounded
                className="w-full"
                onPress={loadMore}
                disabled={loadingMore}
              >
                더보기
              </Button>
            </View>
          ) : null
        }
        ListEmptyComponent={() =>
          !loadingMore ? (
            <View className="items-center justify-center h-11 ml-4 mr-4">
              <Typography variant="Body2" color="secondary-dark">
                검색 결과가 없습니다.
              </Typography>
            </View>
          ) : null
        }
      />
    </View>
  );
}