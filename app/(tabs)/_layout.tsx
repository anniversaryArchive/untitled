import { Tabs } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/utils/tailwind-colors";

const TABS = [
  { name: "MyBookmark", title: "내 굿즈", icon: "folder" },
  { name: "Search", title: "검색", icon: "search" },
  { name: "Home", title: "홈", icon: "star" },
  { name: "Alarm", title: "알림", icon: "bell" },
  { name: "Mypage", title: "MY", icon: "user" },
];

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarLabelStyle: { fontFamily: "DunggeunmisoB" },
        tabBarActiveTintColor: colors.primary.DEFAULT,
        tabBarStyle: {
          height: 55 + insets.bottom,
          paddingTop: 5,
          paddingBottom: insets.bottom,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => <Icon name={tab.icon} color={color} size={20.0} />,
            tabBarIconStyle: { marginBottom: 4 },
          }}
        />
      ))}
    </Tabs>
  );
}
