import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient, processLock} from '@supabase/supabase-js';
import {AppState, Platform} from 'react-native';
import 'react-native-url-polyfill/auto';
import {IGachaItem} from '@/types/search';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  }
);

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}

/**
 * 인기 굿즈 불러오기
 */
export const getPopularGoods = async (
  limit: number = 10
): Promise<(IGachaItem & { anime_kr_title?: string })[]> => {
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
          price,
          anime:anime_id (
            kr_title
          )
        )
      `)
      .order("viewed_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase popular goods load error", error);
      return [];
    }

    // nested 구조를 평탄화하여 anime_kr_title 필드로 변환
    return (data ?? []).map(item => ({
      ...item.gacha,
      anime_kr_title: item.gacha?.anime?.kr_title ?? "",
    }));

  } catch (e) {
    console.error("Error loading popular goods", e);
    return [];
  }
};
