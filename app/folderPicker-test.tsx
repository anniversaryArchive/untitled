import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, FolderPicker } from "@components/index";
import folder from "@table/folders";

export default function BottomTest() {
  const [open, setOpen] = useState(false);

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="items-center justify-center flex-1 gap-20">
        <Button
          bold
          size="xl"
          onPress={() => {
            setOpen(true);
          }}
        >
          폴더 선택
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
        <FolderPicker
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          onSelectFolder={(folder) => {
            setOpen(false);
          }}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
