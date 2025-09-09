import { Stack } from "expo-router";
import { useFonts } from "expo-font";

import "@styles/global.css";

export default function RootLayout() {
  const [fontLoaded] = useFonts({
    "Dunggeunmiso": require("../assets/fonts/Hakgyoansim-Dunggeunmiso-OTF-R.otf"),
    "DunggeunmisoB": require("../assets/fonts/Hakgyoansim-Dunggeunmiso-OTF-B.otf"),
  });

  if (!fontLoaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "HOME" }} />
      <Stack.Screen name="test" options={{ title: "LOCAL DB TEST" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="detail/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
