import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import GoodsThumbnail from "./GoodsThumbnail";

interface SlideItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
}

interface SimpleSwiperProps {
  data: SlideItem[];
  onSlidePress?: (item: SlideItem, index: number) => void;
  slidesPerView?: number; // 한 화면에 보여질 아이템 수
  itemSpacing?: number; // 카드 간 간격
}

export default function SimpleSwiper({
                                       data,
                                       onSlidePress,
                                       slidesPerView = 2.5,
                                       itemSpacing = 10,
                                     }: SimpleSwiperProps) {
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const flatListRef = useRef<FlatList>(null);

  // 화면 사이즈 변경 대응
  useEffect(() => {
    const onChange = ({ window }: { window: { width: number } }) => {
      setScreenWidth(window.width);
    };
    const subscription = Dimensions.addEventListener("change", onChange);
    return () => {
      subscription.remove();
    };
  }, []);

  const itemWidth = screenWidth / slidesPerView;

  const renderItem = ({ item, index }: ListRenderItemInfo<SlideItem>) => {
    // 첫 아이템은 marginLeft 0, 마지막 아이템은 marginRight 0
    const isFirst = index === 0;
    const isLast = index === data.length - 1;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onSlidePress?.(item, index)}
        style={[
          styles.slide,
          {
            width: itemWidth,
            marginLeft: isFirst ? 0 : itemSpacing / 2,
            marginRight: isLast ? 0 : itemSpacing / 2,
          },
        ]}
      >
        <GoodsThumbnail title={item.title} subtitle={item.subtitle} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth + itemSpacing / 2} // 스냅 효과
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 0 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  slide: {},
});
