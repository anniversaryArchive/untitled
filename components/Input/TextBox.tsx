import { TextInput } from "react-native";
import { colors } from "@utils/tailwind-colors";
import { inputTheme } from "./InputBox";

export interface ITextBoxProps {
  placeholder?: string;
  className?: string;
  onSubmit?: (value: string) => void;
  color?: keyof typeof inputTheme.color;
  value?: string;
  bold?: boolean;
  [options: string]: any;
}

const TextBox = (props: ITextBoxProps) => {
  const {
    placeholder,
    onSubmit,
    className,
    value,
    color = "secondary-dark",
    bold = false,
    ...options
  } = props;

  const defaultProps = `${bold ? "font-DunggeunmisoB" : "font-Dunggeunmiso"} border p-2 rounded-[4px] text-[15px] text-secondary-dark ${inputTheme.color[color]} min-h-[60px]`;

  return (
    <TextInput
      multiline
      numberOfLines={6}
      onSubmitEditing={(e) => {
        const value = e.nativeEvent.text;
        onSubmit && onSubmit(value);
      }}
      clearButtonMode="while-editing"
      placeholder={placeholder}
      placeholderTextColor={colors.secondary["dark-80"]}
      className={`${defaultProps}`}
      {...options}
    />
  );
};

export default TextBox;
