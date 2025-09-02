import { useState } from "react";
import { Pressable, View } from "react-native";
import { useNavigation } from "expo-router";

import { colors } from "@utils/tailwind-colors";
import Icon from "@components/Icon";
import InputBox from "./InputBox";

interface ISearchBoxProps {
  placeholder?: string;
  className?: string;
  color?: keyof typeof searchBoxTheme;
  onSubmit: (value: string) => void;
  [options: string]: any;
}

const searchBoxTheme = {
  primary: colors.primary.DEFAULT,
  secondary: colors.secondary.DEFAULT,
  "secondary-dark": colors.secondary.dark,
};

const SearchBox = (props: ISearchBoxProps) => {
  const { placeholder, onSubmit, className, color = "primary", ...options } = props;
  const [value, setValue] = useState("");
  const navigation = useNavigation();

  const handleSubmit = (text: string) => {
    onSubmit(text);
    setValue("");
  };

  return (
    <View className={`flex flex-row w-full items-center gap-3`}>
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
        disabled={!navigation.canGoBack()}
      >
        <Icon
          name="chevronLeft"
          size={24}
          fill={searchBoxTheme[color]}
          stroke={searchBoxTheme[color]}
        />
      </Pressable>
      <View className={`grow`}>
        <InputBox
          wiggleBorder
          value={value}
          onChangeText={setValue}
          onSubmit={handleSubmit}
          className={`text-[16px] ${className}`}
          color={color}
          {...options}
        />
      </View>
      <Pressable
        onPress={() => {
          handleSubmit(value);
        }}
      >
        <Icon name="search" size={24} fill={searchBoxTheme[color]} stroke={searchBoxTheme[color]} />
      </Pressable>
    </View>
  );
};

export default SearchBox;
