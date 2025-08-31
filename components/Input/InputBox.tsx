import { TextInput } from "react-native";
import { colors } from "@utils/tailwind-colors";

export interface IInputBoxProps {
  placeholder?: string;
  className?: string;
  onSubmit?: (value: string) => void;
  type?: string;
  size?: keyof typeof inputTheme.size;
  color?: keyof typeof inputTheme.color;
  readOnly?: boolean;
  [options: string]: any;
}

export const inputTheme = {
  color: {
    primary: "border-primary",
    secondary: "border-secondary",
    "secondary-dark": "border-secondary-dark",
  },
  size: {
    sm: "h-[36px] font-Dunggeunmiso",
    md: "h-[40px] text-[15px] font-Dunggeunmiso",
    lg: "h-[44px] text-[16px] font-DunggeunmisoB",
  },
};

const InputBox = (props: IInputBoxProps) => {
  const {
    placeholder,
    onSubmit,
    className,
    color = "secondary-dark",
    type = "text",
    size = "sm",
    readOnly,
    ...options
  } = props;

  const defaultProps = `border p-3 rounded text-secondary-dark ${inputTheme.color[color]} ${inputTheme.size[size]} ${className}`;
  const readOnlyProps = `bg-gray-200`;

  return (
    <TextInput
      onSubmitEditing={(e) => {
        const value = e.nativeEvent.text;
        onSubmit && onSubmit(value);
      }}
      clearButtonMode="while-editing"
      readOnly={readOnly}
      placeholder={placeholder || "검색어를 입력하세요."}
      placeholderTextColor={colors.secondary["dark-80"]}
      className={`${defaultProps} ${readOnly && readOnlyProps}`}
      {...options}
    />
  );
};

export default InputBox;
