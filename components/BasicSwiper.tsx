import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, ScaledSize } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

const DATA = [1, 2, 3];

export default function BasicSwiper() {
  // Carousel 제어용 ref
  const carouselRef = useRef<ICarouselInstance>(null);
  // 현재 보여지는 슬라이드 인덱스
  const [currentIndex, setCurrentIndex] = useState(0);

  // 화면 크기 상태 (초기값 : 현재 윈도우 크기)
  const [windowSize, setWindowSize] = useState<ScaledSize>(Dimensions.get('window'));

  useEffect(() => {
    // 화면 크기 변경 이벤트 핸들러
    const onChange = ({ window }: { window: ScaledSize }) => {
      // 변경된 화면 크기를 state에 저장 → 리렌더링 트리거
      setWindowSize(window);
    };

    // 화면 크기 변경 이벤트 등록
    const subscription = Dimensions.addEventListener('change', onChange);

    // 컴포넌트 unmount 시 이벤트 해제
    return () => {
      subscription.remove();
    };
  }, []);

  // 슬라이드 진행 상황 변경 시 호출 → 슬라이드 현재 위치를 소수점 포함)
  const onProgressChange = (_: number, absoluteProgress: number) => {
    // 가장 가까운 슬라이드 인덱스로 상태 변경
    setCurrentIndex(Math.round(absoluteProgress));
  };

  // 페이지 점(dot) 클릭 시 해당 인덱스로 슬라이더 이동 함수
  const goToIndex = (index: number) => {
    carouselRef.current?.scrollTo({ index, animated: true });
    setCurrentIndex(index);
  };

  // 슬라이더 높이를 화면 높이의 40%로 동적 설정
  const carouselHeight = windowSize.height * 0.4;

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}                 // Carousel ref 연결
        width={windowSize.width}          // 현재 화면 너비에 맞춤
        height={carouselHeight}           // 동적으로 계산된 높이 적용
        data={DATA}                      // 슬라이드 데이터 (숫자 배열)
        loop={true}                     // 무한 루프 활성화
        onProgressChange={onProgressChange} // 슬라이드 변화 콜백
        renderItem={({ index }) => (
          <View style={[styles.card, { height: carouselHeight }]}>
            <Text className="font-dunggeunmiso text-secondary-dark text-3xl">
              {`Slide ${DATA[index]}`}
            </Text>
          </View>
        )}
      />

      {/* 페이지네이션: 점들을 가로로 나열 */}
      <View style={styles.paginationContainer}>
        {DATA.map((_, index) => {
          // 현재 활성화된 점 여부 판단
          const isActive = currentIndex === index;
          return (
            <TouchableOpacity
              key={index}
              className="rounded-full w-2.5 h-2.5"
              style={{
                // 활성 점은 분홍색, 아니면 회색
                backgroundColor: isActive ? '#FFBBC1' : '#D9D9D9',
                // 마지막 점 제외 오른쪽 간격 부여
                marginRight: index !== DATA.length - 1 ? 10 : 0,
              }}
              onPress={() => goToIndex(index)} // 해당 인덱스 이동
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                        // 화면 전체를 채우도록 설정
    backgroundColor: 'transparent', // 배경색 투명으로 명시적 설정
  },
  card: {
    flex: 1,
    backgroundColor: '#FFBBC1',     // 슬라이드 배경색
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',           // 점을 가로 방향으로 배열
    justifyContent: 'center',       // 중앙 정렬
    marginTop: 10,                  // 슬라이더와의 간격
  },
});
