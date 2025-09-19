import React from "react";
import { Pressable, Text } from "react-native";

interface IButtonProps {
  children?: React.ReactNode;
  color?: keyof typeof buttonTheme.color;
  width?: "auto" | "full";
  size?: keyof typeof buttonTheme.size;
  variant?: "contained" | "outlined" | "text";
  rounded?: boolean;
  disabled?: boolean;
  [props: string]: any;
}

const buttonTheme = {
  color: {
    primary: {
      contained: "bg-primary border-primary text-secondary-light border",
      outlined: "border-primary text-primary border-2",
      text: "text-primary",
      disabled: "bg-gray-300 border-gray-300 text-primary-light-80 border",
    },
    secondary: {
      contained: "bg-secondary border-secondary text-secondary-light border",
      outlined: "border-secondary text-secondary border-2",
      text: "text-secondary",
      disabled: "bg-gray-300 border-gray-300 text-secondary-light-80 border",
    },
    "secondary-dark": {
      contained: "bg-secondary-light border-secondary-light text-secondary-dark border",
      outlined: "border-secondary-dark text-secondary-dark border-2",
      text: "text-secondary-dark",
      disabled: "bg-gray-300 border-gray-300 text-secondary-dark-80 border",
    },
  },
  size: {
    sm: "h-[28px] font-DunggeunmisoB text-[14px] py-1.5 px-2",
    md: "h-[30px] font-Dunggeunmiso text-[14px] py-2 px-3",
    lg: "h-[44px] font-DunggeunmisoB text-[17px] py-3 px-4",
  },
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

  const defaultStyle = `flex justify-center items-center text-center whitespace-nowrap leading-none select-none`;
  const borderRadiusProps = rounded ? "rounded-full" : "rounded-[4px]";

  return (
    <Pressable className={`${width === "full" ? "grow" : "self-start"} `} {...options}>
      {children && (
        <Text
          className={`${defaultStyle} ${borderRadiusProps} ${disabled ? buttonTheme.color[color].disabled : buttonTheme.color[color][variant]} ${buttonTheme.size[size]}`}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
};

export default Button;
