import 'react-native-reanimated';  // 반드시 최상단에 위치
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  return (
    <View className="items-center justify-center flex-1 gap-4">
      <Link href="/test" asChild>
        <Pressable>
          <Text className="font-dunggeunmiso text-secondary-dark text-3xl">
            로컬 디비 세팅 보러가기
          </Text>
        </Pressable>
      </Link>
      
      <Link href="/swiper-test" asChild>
        <Pressable>
          <Text className="font-dunggeunmiso text-secondary-dark text-3xl">
            기본 슬라이드
          </Text>
        </Pressable>
      </Link>
      
      <Link href="/drop-test" asChild>
        <Pressable>
          <Text className="font-dunggeunmiso text-secondary-dark text-3xl">
            드롭박스
          </Text>
        </Pressable>
      </Link>
      
      <Link href="/style-guide" asChild>
        <Pressable>
          <Text className="font-dunggeunmiso text-secondary-dark text-3xl">스타일 가이드</Text>
        </Pressable>
      </Link>

      <Link href="/(tabs)/Home" asChild>
        <Pressable>
          <Text className="font-dunggeunmiso text-secondary-dark text-3xl">
            BOTTOM NAVIGATION BAR (TABS) TEST
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
