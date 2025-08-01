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

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
}
