import { useState } from "react";
import { View, Button } from "react-native";
import BottomSheet from "../components/BottomSheet";

export default function BottomTest() {
  const [open, setOpen] = useState(false);

  return (
    <View className="flex-1 items-center justify-center">
      <Button className="font-dunggeunmiso text-secondary-dark text-3xl" title="Open BottomSheet" onPress={() => setOpen(true)} />
      <BottomSheet open={open} onClose={() => setOpen(false)} />
    </View>
  );
}
