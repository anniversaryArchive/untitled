import { useState } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import BottomSheet from "../components/BottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Segment from "@components/Segment";

export default function BottomTest() {
  const [open, setOpen] = useState(false);

  // 세그먼트 항목 데이터
  const segmentItems = [
    { key: "WISH", label: "WISH" },
    { key: "GET", label: "GET" },
    { key: "ETC", label: "ETC" },
  ];

  // 세그먼트 상태 (WISH, GET, ETC)
  const [selectedKey, setSelectedKey] = useState("WISH");

  return (
    <GestureHandlerRootView style={styles.container}>
      <View className="flex-1 items-center justify-center">
        <Button
          className="font-dunggeunmiso text-secondary-dark text-3xl"
          title="Open BottomSheet"
          onPress={() => setOpen(true)}
        />
        <BottomSheet open={open} onClose={() => setOpen(false)}>
          <Segment
            segments={segmentItems}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
          />

          <View className="mt-4">
            {selectedKey === "WISH" && <Text className="text-gray-700">WISH 내용</Text>}
            {selectedKey === "GET" && <Text className="text-gray-700">GET 내용</Text>}
            {selectedKey === "ETC" && <Text className="text-gray-700">ETC 내용</Text>}
          </View>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
