import AsyncStorage from "@react-native-async-storage/async-storage";

const MAX_RECENT_SEARCHES = 10;
const STORAGE_KEY = "@recent_searches";

// 새로운 검색어를 저장하는 함수
export const addRecentSearch = async (searchItem: string) => {
  try {
    // 1. 기존 검색어 목록 불러오기
    const existingSearchesJSON = await AsyncStorage.getItem(STORAGE_KEY);
    let searches = existingSearchesJSON ? JSON.parse(existingSearchesJSON) : [];

    // 2. 중복된 검색어 제거 (기존에 있었다면 추가하지않고 맨 위로 올리기 위함)
    searches = searches.filter((item: string) => item !== searchItem);

    // 3. 새로운 검색어를 배열 맨 앞에 추가
    searches.unshift(searchItem);

    // 4. 최대 10개까지만 유지
    const newSearches = searches.slice(0, MAX_RECENT_SEARCHES);

    // 5. 다시 JSON 문자열로 변환하여 저장
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSearches));
  } catch (e) {
    console.error("최근 검색어 저장에 실패했습니다.", e);
  }
};

// 저장된 최근 검색어 목록을 불러오는 함수
export const getRecentSearches = async () => {
  try {
    const searchesJSON = await AsyncStorage.getItem(STORAGE_KEY);
    return searchesJSON ? JSON.parse(searchesJSON) : [];
  } catch (e) {
    console.error("최근 검색어 불러오기에 실패했습니다.", e);
    return [];
  }
};

// 최근 검색어 전체 삭제 함수
export const clearRecentSearches = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("최근 검색어 전체 삭제에 실패했습니다.", e);
  }
};

export const removeRecentSearch = async (removeItem: string) => {
  try {
    // 1. 기존 검색어 목록 불러오기
    const existingSearchesJSON = await AsyncStorage.getItem(STORAGE_KEY);
    if (!existingSearchesJSON) return;

    let searches = JSON.parse(existingSearchesJSON);

    // 2. 삭제할 검색어를 제외한 새 배열 생성
    const newSearches = searches.filter((item: string) => item !== removeItem);

    // 3. 변경된 목록을 다시 저장
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSearches));
  } catch (e) {
    console.error("최근 검색어 삭제에 실패했습니다.", e);
  }
};
