import React from "react";
import { View, Pressable } from "react-native";
import Typography from "@components/Typography";

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
    <View className="flex-row mt-2 h-12 rounded-[4px] border-2 border-primary overflow-hidden">
      {segments.map(({ key, label }, index) => {
        const isSelected = key === selectedKey;
        const isLast = index === segments.length - 1;

        return (
          <Pressable
            key={key}
            onPress={() => onSelect(key)}
            className={`flex-1 items-center justify-center ${
              isSelected
                ? "bg-primary"
                : "bg-primary-light"
            } ${!isLast ? "border-r-2 border-r-primary" : ""}`}
          >
            <Typography
              variant="Header3"
              color={isSelected ? "primary-light" : "primary"}
            >
              {label}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}
