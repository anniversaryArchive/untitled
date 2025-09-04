import React from 'react';
import { View, StyleSheet } from 'react-native';
import BasicSwiper from '@components/BasicSwiper';
import FeaturedSwiper from '@components/FeaturedSwiper';

const sampleData = [
  { id: '1', imageUrl: '' },
  { id: '2', imageUrl: '' },
  { id: '3' },
];

const sampleNumbers = [1, 2, 3];

export default function SwiperTest() {
  return (
    <View style={styles.container}>
      <BasicSwiper data={sampleNumbers}
                   onSlidePress={(index, item) => {
                     // console.log(`Clicked slide at index ${index} with item:`, item);
                   }}
      />

      <FeaturedSwiper title="새로 나왔어요!" data={sampleData}
                      onSlidePress={(item, index) => {
                        // console.log('슬라이드 클릭됨:', index, item);
                      }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
