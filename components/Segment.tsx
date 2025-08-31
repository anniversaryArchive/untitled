import React from "react";
import { View, Pressable, Text } from "react-native";

type SegmentItem = {
  key: string;
  label: string;
};

type Props = {
  segments: SegmentItem[];
  selectedKey: string;
  onSelect: (key: string) => void;
};

export default function Segment({ segments, selectedKey, onSelect }: Props) {
  return (
    <View className="flex-row mt-2" style={{ height: 48 }}>
      {segments.map(({ key, label }, index) => {
        const isSelected = key === selectedKey;

        const borderRadiusStyle =
          index === 0
            ? { borderTopLeftRadius: 4, borderBottomLeftRadius: 4, borderTopRightRadius: 0, borderBottomRightRadius: 0 }
            : { borderTopRightRadius: 4, borderBottomRightRadius: 4, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 };

        return (
          <Pressable
            key={key}
            onPress={() => onSelect(key)}
            className={`flex-1 items-center justify-center ${
              isSelected ? "bg-primary" : "bg-primary-light"
            }`}
            style={{
              ...borderRadiusStyle,
              borderWidth: isSelected ? 0 : 2,
              borderColor: isSelected ? "transparent" : "#FFBBC1",
            }}
          >
            <Text className="font-dunggeunmiso"
              style={{
                fontWeight: "600",
                fontSize: 24,
                lineHeight: 25,
                color: isSelected ? "#FFF2F4" : "#FFBBC1",
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
