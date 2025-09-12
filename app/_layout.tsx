import "@styles/global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDefaultFolder } from "@/stores/useDefaultFolder";
import folder from "@table/folder";
import { TFolder } from "@/types/folder";

export default function RootLayout() {
  const [fontLoaded] = useFonts({
    "Dunggeunmiso": require("../assets/fonts/Hakgyoansim-Dunggeunmiso-OTF-R.otf"),
    "DunggeunmisoB": require("../assets/fonts/Hakgyoansim-Dunggeunmiso-OTF-B.otf"),
  });
  const initializeFolder = useDefaultFolder((state) => state.initializeFolder);

  useEffect(() => {
    const loadFolder = async () => {
      const defaultFolder = (await folder.getFolderById(1)) as TFolder;
      initializeFolder(defaultFolder);
    };

    loadFolder();
  }, [initializeFolder]);

  if (!fontLoaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "HOME" }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
