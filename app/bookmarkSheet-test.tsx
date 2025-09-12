import { SafeAreaView } from "react-native-safe-area-context";
import { BookmarkSheet, Button } from "@components/index";
import { activeBottomSheet } from "@/stores/activeBottomSheet";

export default function BottomTest() {
  const openSheet = activeBottomSheet((state) => state.openSheet);

  return (
    <SafeAreaView className="items-center justify-center flex-1 gap-20">
      <Button
        bold
        size="xl"
        onPress={() => {
          openSheet("BOOKMARK");
        }}
      >
        북마크 BottomSheet
      </Button>
      <BookmarkSheet />
    </SafeAreaView>
  );
}
