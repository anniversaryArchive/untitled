import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, ScaledSize } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

interface BasicSwiperProps {
  data: any[];
  onSlidePress?: (index: number, item: any) => void;
}

export default function BasicSwiper({ data, onSlidePress }: BasicSwiperProps) {
  const carouselRef = useRef<ICarouselInstance>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowSize, setWindowSize] = useState<ScaledSize>(Dimensions.get('window'));

  useEffect(() => {
    const onChange = ({ window }: { window: ScaledSize }) => {
      setWindowSize(window);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription.remove();
  }, []);

  const onProgressChange = (_: number, absoluteProgress: number) => {
    setCurrentIndex(Math.round(absoluteProgress));
  };

  const goToIndex = (index: number) => {
    carouselRef.current?.scrollTo({ index, animated: true });
    setCurrentIndex(index);
  };

  const carouselHeight = windowSize.height * 0.4;

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        width={windowSize.width}
        height={carouselHeight}
        data={data}
        loop={true}
        onProgressChange={onProgressChange}
        renderItem={({ index }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (onSlidePress) {
                onSlidePress(index, data[index]);
              }
            }}
            style={[styles.card, { height: carouselHeight }]}
          >
            <Text style={styles.slideText}>
              {`Slide ${data[index]}`}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* 페이지네이션 (Pagination) */}
      <View style={styles.paginationContainer}>
        {data.map((_, index) => {
          const isActive = currentIndex === index;
          return (
            <TouchableOpacity
              key={index}
              style={{
                borderRadius: 100,
                width: 10,
                height: 10,
                backgroundColor: isActive ? '#FFBBC1' : '#D9D9D9',
                marginRight: index !== data.length - 1 ? 10 : 0,
              }}
              onPress={() => goToIndex(index)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  card: {
    flex: 1,
    backgroundColor: '#FFBBC1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideText: {
    fontSize: 24,
    color: '#998372',
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
});
