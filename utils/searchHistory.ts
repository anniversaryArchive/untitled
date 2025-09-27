import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/utils/supabase";

const MAX_RECENT_SEARCHES = 10;
const MAX_RECENT_GOODS = 10;

const SEARCH_STORAGE_KEY = "@recent_searches";
const GOODS_STORAGE_KEY = "@recent_goods";

export interface IGoodsItem {
  id: string;
  title: string;
  subtitle: string;
}

/**
 * 최근 검색어 저장
 */
export const addRecentSearch = async (searchItem: string) => {
  try {
    // 1. 기존 검색어 목록 불러오기
    let searches = await getRecentSearches();

    // 2. 중복된 검색어 제거 (기존에 있었다면 추가하지않고 맨 위로 올리기 위함)
    searches = searches.filter((item: string) => item !== searchItem);

    // 3. 새로운 검색어를 배열 맨 앞에 추가
    searches.unshift(searchItem);

    // 4. 최대 10개까지만 유지
    const newSearches = searches.slice(0, MAX_RECENT_SEARCHES);
    await AsyncStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(newSearches));
  } catch (e) {
    console.error("로컬 최근 검색어 저장 실패", e);
  }
};

/**
 * 최근 검색어 불러오기
 */
export const getRecentSearches = async (): Promise<string[]> => {
  try {
    const searchesJSON = await AsyncStorage.getItem(SEARCH_STORAGE_KEY);
    return searchesJSON ? JSON.parse(searchesJSON) : [];
  } catch (e) {
    console.error("로컬 최근 검색어 불러오기 실패", e);
    return [];
  }
};

/**
 * 특정 검색어 삭제
 */
export const removeRecentSearch = async (removeItem: string) => {
  try {
    const searches = await getRecentSearches();
    const newSearches = searches.filter((item: string) => item !== removeItem);
    await AsyncStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(newSearches));
  } catch (e) {
    console.error("로컬 최근 검색어 삭제 실패", e);
  }
};

/**
 * 전체 최근 검색어 삭제
 */
export const clearRecentSearches = async () => {
  try {
    await AsyncStorage.removeItem(SEARCH_STORAGE_KEY);
  } catch (e) {
    console.error("로컬 최근 검색어 전체 삭제 실패", e);
  }
};

/**
 * 최근 본 굿즈 추가
 */
export const addRecentGood = async (item: IGoodsItem) => {
  try {
    let goods: IGoodsItem[] = await getRecentGoods();

    goods = goods.filter(good => good.id !== item.id);
    goods.unshift(item);

    const newGoods = goods.slice(0, MAX_RECENT_GOODS);
    await AsyncStorage.setItem(GOODS_STORAGE_KEY, JSON.stringify(newGoods));
  } catch (e) {
    console.error("로컬 최근 본 굿즈 저장 실패", e);
  }
};

/**
 * 최근 본 굿즈 불러오기
 */
export const getRecentGoods = async (): Promise<IGoodsItem[]> => {
  try {
    const goodsJSON = await AsyncStorage.getItem(GOODS_STORAGE_KEY);
    return goodsJSON ? JSON.parse(goodsJSON) : [];
  } catch (e) {
    console.error("로컬 최근 본 굿즈 불러오기 실패", e);
    return [];
  }
};

/**
 * 전체 최근 본 굿즈 삭제
 */
export const clearRecentGoods = async () => {
  try {
    await AsyncStorage.removeItem(GOODS_STORAGE_KEY);
  } catch (e) {
    console.error("로컬 최근 본 굿즈 전체 삭제 실패", e);
  }
};

/**
 * 인기 굿즈 불러오기
 */
export const getPopularGoods = async (
  limit: number = 10
): Promise<IGoodsItem[]> => {
  try {
    const { data, error } = await supabase
      .from("popular_goods")
      .select(`
        *,
        gacha (
          id,
          name,
          name_kr,
          image_link,
          anime_id,
          price
        )
      `)
      .order("viewed_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase popular goods load error", error);
      return [];
    }

    return (
      data?.map((item) => ({
        id: item.gacha.id,
        title: item.gacha.name_kr,
        subtitle: item.gacha.name,
        imageLink: item.gacha.image_link,
        animeId: item.gacha.anime_id,
        price: item.gacha.price,
        viewedAt: item.viewed_at,
      })) || []
    );
  } catch (e) {
    console.error("Error loading popular goods", e);
    return [];
  }
};

// gacha + anime 조인 결과 아이템 타입 정의
export interface IGachaItem {
  id: number;
  name_kr: string;
  name: string;
  image_link: string;
  anime_kr_title: string | null;
}

/**
 * gacha 테이블에서 name_kr과 일치하는 데이터 검색 (offset + limit 지원)
 */
export const searchGachaAndAnimeByName = async (
  keyword: string,
  limit = 10,
  offset = 0
): Promise<{ items: IGachaItem[]; totalCount: number }> => {
  try {
    // 데이터 조회
    const { data, error } = await supabase.rpc("search_gacha_with_anime", {
      keyword,
      limit_count: limit,
      offset_count: offset,
    });

    if (error) {
      console.error("Supabase RPC search error:", error);
      return { items: [], totalCount: 0 };
    }

    const items = (data as IGachaItem[]) || [];

    // 총 개수는 별도 RPC 함수나 전체 카운트 쿼리 필요
    // 여기선 간단히 전체 개수를 구하는 예시 (비효율적일 수 있으니 별도 함수 권장)
    const { count, error: countError } = await supabase
      .from("gacha")
      .select("id", { count: "exact", head: true })
      .ilike("name_kr", `%${keyword}%`);

    if (countError) {
      console.error("Supabase count error:", countError);
      return { items, totalCount: items.length };
    }

    return {
      items,
      totalCount: count || items.length,
    };
  } catch (e) {
    console.error("Unexpected error in searchGachaAndAnimeByName:", e);
    return { items: [], totalCount: 0 };
  }
};
