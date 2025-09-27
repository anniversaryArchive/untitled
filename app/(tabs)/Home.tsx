import { View } from "react-native";
import { router } from "expo-router";
import { Button, Typography } from "@/components";

export default function Home() {
  const handleNavigateToDetail = (id: string) => {
    router.push(`/detail/${id}`);
  };

  return (
    <View>
      <Typography variant="Header1" color="secondary-dark">
        홈
      </Typography>

      <View>
        <Button onPress={() => handleNavigateToDetail("67")}>
          <Typography variant="Body1" color="white">
            상세페이지로 이동 (ID: 67)
          </Typography>
        </Button>
      </View>
    </View>
  );
}
