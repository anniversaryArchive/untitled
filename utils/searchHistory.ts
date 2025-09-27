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

/**
 * gacha 테이블에서 name_kr과 일치하는 데이터 검색, offset 지원
 */
export const searchGachaAndAnimeByName = async (
  keyword: string,
  limit = 10,
  offset = 0
): Promise<{ items: IGoodsItem[]; totalCount: number }> => {
  try {
    // 가차명 또는 한글명 검색 OR
    // 또는 애니메이션명으로 검색(조인)
    const { data, error } = await supabase
      .from("gacha")
      .select(`
        id, name_kr, name, image_link,
        anime:anime_id (
          id, name_kr
        )
      `)
      .or(`name.ilike.%${keyword}%,name_kr.ilike.%${keyword}%,anime.name_kr.ilike.%${keyword}%`)
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Supabase gacha search error", error);
      return { items: [], totalCount: 0 };
    }

    // 전체 개수 쿼리
    const { count, error: countError } = await supabase
      .from("gacha")
      .select("id", { count: "exact", head: true })
      .or(`name.ilike.%${keyword}%,name_kr.ilike.%${keyword}%,anime.name_kr.ilike.%${keyword}%`);

    if (countError) {
      console.error("Supabase gacha count error", countError);
      return { items: data || [], totalCount: 0 };
    }

    return {
      items:
        data?.map((item) => ({
          id: item.id,
          title: item.name_kr,
          subtitle: item.name,
          imageLink: item.image_link,
          animeName: item.anime?.name_kr ?? null,
        })) || [],
      totalCount: count || 0,
    };
  } catch (e) {
    console.error("Error searching gacha by name_kr and anime name", e);
    return { items: [], totalCount: 0 };
  }
};