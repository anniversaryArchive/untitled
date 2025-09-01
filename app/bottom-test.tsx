import { useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import BottomSheet from "../components/BottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function BottomTest() {
  const [open, setOpen] = useState(false);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View className="flex-1 items-center justify-center">
        <Button
          className="font-dunggeunmiso text-secondary-dark text-3xl"
          title="Open BottomSheet"
          onPress={() => setOpen(true)}
        />
        <BottomSheet open={open} onClose={() => setOpen(false)} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
