import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
import Icon from '@components/Icon'; // 경로 맞게 수정
import { colors } from '@utils/tailwind-colors'; // 경로 맞게 수정

type DropDownProps<T> = {
  data: T[];
  selectedValue: T | null;
  onValueChange: (value: T) => void;
  labelExtractor: (item: T) => string; // 데이터 항목에서 보여줄 텍스트를 추출
  placeholder?: string;
  disabled?: boolean; // 비활성화 여부
  color?: keyof typeof searchBoxTheme;
};

const searchBoxTheme = {
  primary: colors.primary.DEFAULT,
  secondary: colors.secondary.DEFAULT,
  "secondary-dark": colors.secondary.dark,
};

function DropDown<T>({
                       data,
                       selectedValue,
                       onValueChange,
                       labelExtractor,
                       placeholder = "Select",
                       disabled = false,
                       color = "primary",
                     }: DropDownProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);

  const iconColor = searchBoxTheme[color];

  const handleSelect = (item: T) => {
    onValueChange(item);
    setIsOpen(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <View style={styles.buttonContent}>
          <Text style={[styles.buttonText, disabled && styles.textDisabled]}>
            {selectedValue ? labelExtractor(selectedValue) : placeholder}
          </Text>
          <Icon
            name="chevronDown" // 필요 시 "chevronLeft" 등 아이콘명 변경 가능
            size={24}
            fill={iconColor}
            stroke={iconColor}
          />
        </View>
      </TouchableOpacity>
      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View style={styles.dropdown}>
            <FlatList
              data={data}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
                  <Text style={styles.itemText}>{labelExtractor(item)}</Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 250 }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16, // 좌우 여백 추가
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFBBC1',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: '#998372',
    fontFamily: 'DunggeunmisoB',
    flex: 1,
  },
  textDisabled: {
    color: '#ccc',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 4,
    maxHeight: 250,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  itemText: {
    fontSize: 14,
    color: '#998372',
    textAlign: 'center',
    fontFamily: 'DunggeunmisoB',
  },
});

export default DropDown;
