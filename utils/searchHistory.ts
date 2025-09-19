import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/utils/supabase";
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
    let searches = await getRecentSearches();

    searches = searches.filter((item: string) => item !== searchItem);
    searches.unshift(searchItem);

    const newSearches = searches.slice(0, MAX_RECENT_SEARCHES);
    await AsyncStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(newSearches));
    await AsyncStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(newSearches));
  } catch (e) {
    console.error("로컬 최근 검색어 저장 실패", e);
    console.error("로컬 최근 검색어 저장 실패", e);
  }
};

/**
 * 최근 검색어 불러오기
 */
export const getRecentSearches = async (): Promise<string[]> => {
/**
 * 최근 검색어 불러오기
 */
export const getRecentSearches = async (): Promise<string[]> => {
  try {
    const searchesJSON = await AsyncStorage.getItem(SEARCH_STORAGE_KEY);
    return searchesJSON ? JSON.parse(searchesJSON) : [];
    const searchesJSON = await AsyncStorage.getItem(SEARCH_STORAGE_KEY);
    return searchesJSON ? JSON.parse(searchesJSON) : [];
  } catch (e) {
    console.error("로컬 최근 검색어 불러오기 실패", e);
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

/**
 * gacha 테이블에서 name_kr과 일치하는 데이터 검색, offset 지원
 */
export const searchGachaByNameKr = async (
  keyword: string,
  limit = 10,
  offset = 0
): Promise<{ items: IGoodsItem[]; totalCount: number }> => {
  try {
    // 데이터 쿼리
    const { data, error } = await supabase
      .from("gacha")
      .select("id, name_kr, name, image_link")
      .ilike("name_kr", `%${keyword}%`)
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Supabase gacha search error", error);
      return { items: [], totalCount: 0 };
    }

    // 전체 개수 쿼리 (count)
    const { count, error: countError } = await supabase
      .from("gacha")
      .select("id", { count: 'exact', head: true })
      .ilike("name_kr", `%${keyword}%`);

    if (countError) {
      console.error("Supabase gacha count error", countError);
      return { items: data || [], totalCount: 0 };
    }

    return {
      items: data?.map((item) => ({
        id: item.id,
        title: item.name_kr,
        subtitle: item.name,
        imageLink: item.image_link,
      })) || [],
      totalCount: count || 0,
    };
  } catch (e) {
    console.error("Error searching gacha by name_kr", e);
    return { items: [], totalCount: 0 };
  }
};
