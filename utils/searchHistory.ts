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
export const addRecentSearch = async (
  searchItem: string,
  isLoggedIn: boolean,
  userId?: string
) => {
  if (isLoggedIn && userId) {
    const { error } = await supabase.from("recent_search").upsert(
      {
        user_id: userId,
        keyword: searchItem,
        searched_at: new Date().toISOString(),
      },
      { onConflict: ["user_id", "keyword"] }
    );
    if (error) {
      console.error("Supabase recent search add error", error);
    }
  } else {
    try {
      let searches = await getRecentSearches(false);

      searches = searches.filter((item: string) => item !== searchItem);
      searches.unshift(searchItem);

      const newSearches = searches.slice(0, MAX_RECENT_SEARCHES);
      await AsyncStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(newSearches));
    } catch (e) {
      console.error("로컬 최근 검색어 저장 실패", e);
    }
  }
};

/**
 * 최근 검색어 불러오기
 */
export const getRecentSearches = async (
  isLoggedIn: boolean,
  userId?: string
): Promise<string[]> => {
  if (isLoggedIn && userId) {
    const { data, error } = await supabase
      .from("recent_search")
      .select("keyword")
      .eq("user_id", userId)
      .order("searched_at", { ascending: false })
      .limit(MAX_RECENT_SEARCHES);

    if (error) {
      console.error("Supabase recent search load error", error);
      return [];
    }
    return data?.map(item => item.keyword) ?? [];
  } else {
    try {
      const searchesJSON = await AsyncStorage.getItem(SEARCH_STORAGE_KEY);
      return searchesJSON ? JSON.parse(searchesJSON) : [];
    } catch (e) {
      console.error("로컬 최근 검색어 불러오기 실패", e);
      return [];
    }
  }
};

/**
 * 특정 검색어 삭제
 */
export const removeRecentSearch = async (
  removeItem: string,
  isLoggedIn: boolean,
  userId?: string
) => {
  if (isLoggedIn && userId) {
    const { error } = await supabase
      .from("recent_search")
      .delete()
      .eq("user_id", userId)
      .eq("keyword", removeItem);
    if (error) {
      console.error("Supabase recent search delete error", error);
    }
  } else {
    try {
      const searches = await getRecentSearches(false);
      const newSearches = searches.filter((item: string) => item !== removeItem);
      await AsyncStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(newSearches));
    } catch (e) {
      console.error("로컬 최근 검색어 삭제 실패", e);
    }
  }
};

/**
 * 전체 최근 검색어 삭제
 */
export const clearRecentSearches = async (isLoggedIn: boolean, userId?: string) => {
  if (isLoggedIn && userId) {
    const { error } = await supabase.from("recent_search").delete().eq("user_id", userId);
    if (error) {
      console.error("Supabase recent searches clear error", error);
    }
  } else {
    try {
      await AsyncStorage.removeItem(SEARCH_STORAGE_KEY);
    } catch (e) {
      console.error("로컬 최근 검색어 전체 삭제 실패", e);
    }
  }
};

/**
 * 최근 본 굿즈 추가
 */
export const addRecentGood = async (
  item: IGoodsItem,
  isLoggedIn: boolean,
  userId?: string
) => {
  if (isLoggedIn && userId) {
    const { error } = await supabase.from("recent_goods").upsert(
      {
        user_id: userId,
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        viewed_at: new Date().toISOString(),
      },
      { onConflict: ["user_id", "id"] }
    );
    if (error) {
      console.error("Supabase recent goods add error", error);
    }
  } else {
    try {
      let goods: IGoodsItem[] = await getRecentGoods(false);

      goods = goods.filter(good => good.id !== item.id);
      goods.unshift(item);

      const newGoods = goods.slice(0, MAX_RECENT_GOODS);
      await AsyncStorage.setItem(GOODS_STORAGE_KEY, JSON.stringify(newGoods));
    } catch (e) {
      console.error("로컬 최근 본 굿즈 저장 실패", e);
    }
  }
};

/**
 * 최근 본 굿즈 불러오기
 */
export const getRecentGoods = async (
  isLoggedIn: boolean,
  userId?: string
): Promise<IGoodsItem[]> => {
  if (isLoggedIn && userId) {
    const { data, error } = await supabase
      .from("recent_viewed")
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
      .eq("user_id", userId)
      .order("viewed_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Supabase recent goods load error", error);
      return [];
    }

    // gacha 테이블에서 상세정보 매핑
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
  } else {
    try {
      const goodsJSON = await AsyncStorage.getItem(GOODS_STORAGE_KEY);
      return goodsJSON ? JSON.parse(goodsJSON) : [];
    } catch (e) {
      console.error("로컬 최근 본 굿즈 불러오기 실패", e);
      return [];
    }
  }
};

/**
 * 전체 최근 본 굿즈 삭제
 */
export const clearRecentGoods = async (isLoggedIn: boolean, userId?: string) => {
  if (isLoggedIn && userId) {
    const { error } = await supabase.from("recent_viewed").delete().eq("user_id", userId);
    if (error) {
      console.error("Supabase recent goods clear error", error);
    }
  } else {
    try {
      await AsyncStorage.removeItem(GOODS_STORAGE_KEY);
    } catch (e) {
      console.error("로컬 최근 본 굿즈 전체 삭제 실패", e);
    }
  }
};
