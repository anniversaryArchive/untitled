import React from "react";
import { Pressable, Text } from "react-native";

interface IButtonProps {
  children?: React.ReactNode;
  color?: "primary" | "secondary" | "secondary-dark";
  width?: "auto" | "full";
  size?: "sm" | "md" | "lg";
  variant?: "contained" | "outlined" | "text";
  rounded?: boolean;
  disabled?: boolean;
  [props: string]: any;
}

const buttonTheme = {
  primary: {
    contained: "bg-primary border-primary text-secondary-light border",
    outlined: "border-primary text-primary border-2",
    text: "text-primary",
    disabled: "bg-gray-300 border-gray-300 text-[#fff8f9] border",
  },
  secondary: {
    contained: "bg-secondary border-secondary text-secondary-dark border",
    outlined: "border-secondary text-secondary border-2",
    text: "text-secondary",
    disabled: "bg-gray-300 border-gray-300 text-[#fffbf0] border",
  },
  "secondary-dark": {
    contained: "bg-secondary-light border-secondary-light text-secondary-dark border",
    outlined: "border-secondary-dark text-secondary-dark border-2",
    text: "text-secondary-dark",
    disabled: "bg-gray-300 border-gray-300 text-[#ad9b8e] border",
  },
  sm: "h-[28px] font-DunggeunmisoB text-[14px] py-[6.5px] px-[7.5px]",
  md: "h-[30px] font-Dunggeunmiso text-[14px] py-2 px-3",
  lg: "h-[44px] font-DunggeunmisoB text-[17px] py-[14px] px-[15px]",
};

const Button = (props: IButtonProps) => {
  const {
    color = "primary",
    width = "auto",
    size = "sm",
    variant = "contained",
    rounded,
    disabled,
    children,
    ...options
  } = props;

  const defaultStyle = `flex items-center justify-center whitespace-nowrap leading-none select-none`;
  const borderRadiusProps = rounded ? "rounded-full" : "rounded-[4px]";
  const widthProps = width === "auto" ? "w-fit" : "w-full";

  return (
    <Pressable className={`${width == "full" && "grow"}`} {...options}>
      {children && (
        <Text
          className={`${defaultStyle} ${widthProps} ${borderRadiusProps} ${disabled ? buttonTheme[color].disabled : buttonTheme[color][variant]} ${buttonTheme[size]}`}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
};

export default Button;
