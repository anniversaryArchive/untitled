import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Icon from "@/components/Icon";

import { colors } from "@/utils/tailwind-colors";

const TABS = [
  { name: "Home", title: "홈", icon: "star" },
  { name: "MyBookmark", title: "내 굿즈", icon: "folder" },
  { name: "Search", title: "검색", icon: "search" },
];

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  let paddingBottom = insets.bottom;
  if (!paddingBottom) paddingBottom = 10;

  return (
    <Tabs
      screenOptions={{
        tabBarLabelStyle: { fontFamily: "DunggeunmisoB", fontSize: 12 },
        tabBarActiveTintColor: colors.primary.DEFAULT,
        tabBarStyle: {
          height: 60 + paddingBottom,
          paddingTop: 5,
          paddingBottom: paddingBottom,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            headerShown: false,
            title: tab.title,
            tabBarIcon: ({ color }) => (
              <Icon name={tab.icon} size={28.0} fill={color} stroke={color} />
            ),
            tabBarIconStyle: { marginBottom: 4 },
            sceneStyle: { paddingTop: insets.top },
          }}
        />
      ))}
    </Tabs>
  );
}
