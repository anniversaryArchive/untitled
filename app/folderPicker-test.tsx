import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, FolderPicker } from "@components/index";
import folder from "@table/folders";
import { activeBottomSheet } from "@/stores/activeBottomSheet";

export default function BottomTest() {
  const openSheet = activeBottomSheet((state) => state.openSheet);

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="items-center justify-center flex-1 gap-20">
        <Button
          bold
          size="xl"
          onPress={() => {
            openSheet("FOLDER");
          }}
        >
          폴더 선택 BottomSheet
        </Button>
        <Button
          size="sm"
          color="secondary-dark"
          variant="outlined"
          onPress={async () => {
            await folder.clear();
          }}
        >
          {`DB 초기화 (reload 필수!!)`}
        </Button>
        <FolderPicker onSelectFolder={(folder) => {}} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
