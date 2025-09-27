import { SearchBox, Typography } from "@/components";
import GoodsThumbnail from "@/components/GoodsThumbnail";
import * as searchHistory from "@utils/searchHistory";
import { useCallback, useState, useEffect } from "react";
import { View, FlatList, Alert } from "react-native";
import { Button } from "@/components";
import { useLocalSearchParams } from "expo-router";
import React from "react";

// 상품 아이템 인터페이스 (Supabase RPC 반환에 맞춤)
export interface IGachaItem {
  id: string;
  name_kr: string;
  name: string;
  image_link: string;
  anime_kr_title: string | null;
}

// searchGachaAndAnimeByName의 반환 타입 정의
interface SearchResult {
  items: IGachaItem[];
  totalCount: number;
}

export default function SearchResults() {
  const { searchTerm } = useLocalSearchParams<{ searchTerm?: string }>();
  const [searchValue, setSearchValue] = useState(searchTerm ?? "");
  const [data, setData] = useState<IGachaItem[]>([]);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const loadSearches = useCallback(async () => {
    const searches = await searchHistory.getRecentSearches();
    // 필요 시 상태 저장 가능
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const result = await searchHistory.searchGachaAndAnimeByName(
        String(searchValue),
        limit,
        offset
      );

      const newItems = result?.items ?? [];

      if (newItems.length === 0 && offset > 0) {
        Alert.alert("알림", "더 이상 데이터가 없습니다.");
        setHasMore(false);
        return;
      }

      setData((prev) => {
        const prevIds = new Set(prev?.map((item) => item.id) ?? []);
        const filteredNewItems = newItems.filter((item) => !prevIds.has(item.id));
        const updatedData = [...(prev ?? []), ...filteredNewItems];

        const currentTotal = updatedData.length;
        const isEnd = result?.totalCount != null && currentTotal >= result.totalCount;
        if (isEnd || filteredNewItems.length < limit) setHasMore(false);

        return updatedData;
      });

      setOffset((prev) => prev + newItems.length);
      setTotalCount(result?.totalCount ?? 0);
    } catch (e) {
      console.error("Load more error:", e);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = async (value: string) => {
    console.log("value : ", value);
    setSearchValue(value);
    setOffset(0);

    try {
      const result = await searchHistory.searchGachaAndAnimeByName(value, limit, 0);

      console.log("result : ", result);

      const items = result?.items ?? [];
      setData(items);
      setOffset(items.length);
      setTotalCount(result?.totalCount ?? 0);
      setHasMore((result?.totalCount ?? 0) > limit);

      await searchHistory.addRecentSearch(value);
      await loadSearches();
    } catch (e) {
      console.error("Search error:", e);
      setData([]);
      setOffset(0);
      setHasMore(false);
      setTotalCount(0);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
    }
  }, [searchTerm]);

  const renderItem = ({ item }: { item: IGachaItem }) => (
    <GoodsThumbnail
      title={item.name_kr}
      subtitle={item.name}
      imgUrl={item.image_link}
    />
  );

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

      <FlatList<IGachaItem>
        key={`numColumns-2`}
        numColumns={2}
        data={data}
        keyExtractor={(item) => item.id.toString()}
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
