import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import DropDown from '@components/DropDown'; // DropDown.tsx 파일 경로에 맞게 수정하세요

const sampleOptions = [
  { id: '1', name: '옵션 1' },
  { id: '2', name: '옵션 2' },
  { id: '3', name: '옵션 3' },
];

export default function DropTest() {
  const [selectedOption, setSelectedOption] = useState<{ id: string; name: string } | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>활성화된 드롭박스</Text>
      <DropDown<{ id: string; name: string }>
        data={sampleOptions}
        selectedValue={selectedOption}
        onValueChange={setSelectedOption}
        labelExtractor={(item) => item.name}
        placeholder="옵션을 선택하세요"
      />

      <Text style={[styles.label, { marginTop: 40 }]}>비활성화된 드롭박스 (disabled)</Text>
      <DropDown<{ id: string; name: string }>
        data={sampleOptions}
        selectedValue={null}
        onValueChange={() => {}}
        labelExtractor={(item) => item.name}
        placeholder="선택 불가"
        disabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#998372',
    fontFamily: 'DunggeunmisoB',
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    color: '#444',
  },
});
