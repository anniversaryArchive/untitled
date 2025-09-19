import { SearchBox, Typography } from "@/components";
import GoodsThumbnail from "@/components/GoodsThumbnail"; // 경로 맞게 조정
import * as searchHistory from "@utils/searchHistory";
import { useCallback, useState, useEffect } from "react";
import { View, FlatList, Alert } from "react-native";
import { Button } from "@/components";
import { useLocalSearchParams } from "expo-router";

interface IGoodsItem {
  id: string;
  title: string;
  subtitle: string;
  imageLink: string; // 이미지 URL 필드 추가
}

export default function SearchResults() {
  const { searchTerm } = useLocalSearchParams<{ searchTerm?: string }>();
  const [isLoggedIn] = useState(true);
  const userId = "550e8400-e29b-41d4-a716-446655440000";
  const [searchValue, setSearchValue] = useState(searchTerm ?? "");
  const [data, setData] = useState<IGoodsItem[]>([]);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 더보기 버튼 노출 여부
  const [totalCount, setTotalCount] = useState(0); // 전체 결과 수 상태 추가

  const loadSearches = useCallback(async () => {
    const searches = await searchHistory.getRecentSearches(
      isLoggedIn,
      isLoggedIn ? userId : undefined
    );
    // 필요 시 recent searches 상태에 저장 가능
  }, [isLoggedIn, userId]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const result = await searchHistory.searchGachaByNameKr(String(searchValue), limit, offset);
    setLoadingMore(false);
    // result가 { items, totalCount } 형태인 경우
    const newItems = result.items || [];
    if (newItems.length === 0) {
      Alert.alert("더 이상 데이터가 없습니다.");
      setHasMore(false); // 더 이상 데이터 없음
      return;
    }
    setData((prev) => {
      // 기존 데이터 ID 집합 생성
      const prevIds = new Set(prev.map(item => item.id));
      // 중복 제거
      const filteredNewItems = newItems.filter(item => !prevIds.has(item.id));
      return [...prev, ...filteredNewItems];
    });
    setOffset((prev) => prev + newItems.length);
    setTotalCount(result.totalCount ?? 0); // 전체 개수 업데이트
    if (result.totalCount !== undefined) {
      if (offset + newItems.length >= result.totalCount) {
        setHasMore(false);
      }
    } else {
      if (newItems.length < limit) {
        setHasMore(false);
      }
    }
  };

  const handleSearch = async (value: string) => {
    setSearchValue(value);
    setOffset(0);
    const result = (await searchHistory.searchGachaByNameKr(value, limit, 0)) as {
      items: IGoodsItem[];
      totalCount: number;
    };
    setData(result.items);
    setOffset(result.items.length);
    setTotalCount(result.totalCount); // 전체 결과 수 저장
    setHasMore(result.totalCount > limit); // 더보기 버튼 노출 여부
    await searchHistory.addRecentSearch(
      value,
      isLoggedIn,
      isLoggedIn ? userId : undefined
    );
    await loadSearches();
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
    }
  }, [searchTerm]);

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

      <FlatList
        key={`numColumns-2`} // numColumns 변경 시 강제 리렌더링용
        numColumns={2}
        data={data}
        keyExtractor={(item, index) => item.id.toString() + "_" + index}
        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 16, marginTop: 10, marginBottom: 10 }}
        renderItem={({ item }) => (
          <GoodsThumbnail
            title={item.title}
            subtitle={item.subtitle}
            imgUrl={item.imageLink}
          />
        )}
        ListHeaderComponent={
          <View>
            <View className="ml-4 mt-2 mb-1 flex-row items-center">
              <Typography variant="Header4" color="secondary-dark" className="mr-1">검색 결과</Typography>
              <Typography variant="Header4" color="primary">{totalCount}</Typography>
              <Typography variant="Header4" color="secondary-dark" className="ml-1">개</Typography>
            </View>
            <View className="border-t border-[#D2D2D2] mt-2 mx-5" />
          </View>
        }
        ListFooterComponent={
          hasMore ? (
            <View className="items-center py-4 px-5">
              <Button rounded className="w-full" onPress={loadMore} disabled={loadingMore}>
                더보기
              </Button>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loadingMore && (
            <View className="items-center justify-center h-11 ml-4 mr-4">
              <Typography variant="Body2" color="secondary-dark">
                검색 결과가 없습니다.
              </Typography>
            </View>
          )
        }
      />
    </View>
  );
}
