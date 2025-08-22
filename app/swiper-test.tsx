import React from 'react';
import { View, StyleSheet } from 'react-native';
import BasicSwiper from '../components/BasicSwiper';
import FeaturedSwiper from '@components/FeaturedSwiper';

const sampleData = [
  {
    id: '1',
    imageUrl: '',
  },
  {
    id: '2',
    imageUrl: '',
  },
  {
    id: '3',
  },
];

export default function TestScreen() {
  return (
    <View style={styles.container}>
      <BasicSwiper />
      <FeaturedSwiper title="새로 나왔어요!" data={sampleData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
