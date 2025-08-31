import { useState } from "react";
import { TextInput, View } from "react-native";
import { useNavigation } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

import WiggleBorder from "@components/WiggleBorder";
import { colors } from "@utils/tailwind-colors";

export interface ISearchBoxProps {
  placeholder?: string;
  className?: string;
  color?: keyof typeof searchBoxTheme;
  onSubmit: (value: string) => void;
  [options: string]: any;
}

export const searchBoxTheme = {
  primary: colors.primary.DEFAULT,
  secondary: colors.secondary.DEFAULT,
  "secondary-dark": colors.secondary.dark,
};

const SearchBox = (props: ISearchBoxProps) => {
  const { placeholder, onSubmit, className, color = "primary", ...options } = props;
  const [value, setValue] = useState("");
  const navigation = useNavigation();

  const defaultProps = `h-10 p-3 w-full text-[16px] text-secondary-dark font-Dunggeunmiso`;

  return (
    <View className={`flex flex-row w-full items-center gap-3`}>
      <Icon
        name="chevron-left"
        size={24}
        color={searchBoxTheme[color]}
        onPress={() => {
          navigation.canGoBack() && navigation.goBack();
        }}
      />
      <View className={`grow`}>
        <WiggleBorder strokeWidth={1.5} strokeColor={searchBoxTheme[color]}>
          <TextInput
            onSubmitEditing={() => onSubmit(value)}
            value={value}
            onChangeText={setValue}
            clearButtonMode="while-editing"
            placeholder={placeholder || "검색어를 입력하세요."}
            placeholderTextColor={colors.secondary["dark-80"]}
            className={`${defaultProps} ${className}`}
            {...options}
          />
        </WiggleBorder>
      </View>
      <Icon name="search" size={24} color={searchBoxTheme[color]} onPress={() => onSubmit(value)} />
    </View>
  );
};

export default SearchBox;
