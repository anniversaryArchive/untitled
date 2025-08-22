import React, { useState, useEffect } from 'react';
import { Dimensions, View, Text, Image, StyleSheet, Platform } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

interface SlideItem {
  id: string;
  imageUrl?: string;
}

interface FeaturedSwiperProps {
  data: SlideItem[];
  title: string;
}

export default function FeaturedSwiper({ data, title }: FeaturedSwiperProps) {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const onChange = ({ window }: { window: { width: number } }) => {
      setScreenWidth(window.width);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => {
      subscription.remove();
    };
  }, []);

  let slideWidth = screenWidth * 0.45;
  let parallaxOffset = 90;

  if (screenWidth <= 810) {
    slideWidth = screenWidth * 0.7;
    parallaxOffset = 60;
  }
  if (screenWidth <= 480) {
    slideWidth = screenWidth * 0.85;
    parallaxOffset = 40;
  }

  const slideHeight = 200;
  const progress = useSharedValue<number>(0);

  const renderItem = ({ item }: { item: SlideItem }) => (
    <View style={[styles.slide, { width: slideWidth, height: slideHeight }]}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.empty} />
      )}
    </View>
  );

  return (
    <View style={[styles.container, { overflow: 'visible' }]}>
      <Text style={styles.headerTitle}>{title}</Text>
      <Carousel
        loop={false}
        width={slideWidth}
        height={slideHeight}
        autoPlay={false}
        data={data}
        scrollAnimationDuration={500}
        renderItem={renderItem}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: parallaxOffset,
        }}
        onProgressChange={progress}
        pagingEnabled={true}
        snapEnabled={true}
        style={[
          Platform.OS === 'web'
            ? { alignSelf: 'center', marginHorizontal: 0, overflow: 'visible' }
            : { marginHorizontal: 0, overflow: 'visible' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    margin: 0,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#998372',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 15,
    fontFamily: 'DunggeunmisoB',
  },
  slide: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: '#FFBBC1',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  empty: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
