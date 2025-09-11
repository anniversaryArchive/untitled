import React from "react";
import { Pressable, Text } from "react-native";

type TButtonBaseProps = {
  children?: React.ReactNode;
  color?: keyof typeof buttonTheme.color;
  size?: keyof typeof buttonTheme.size;
  variant?: "contained" | "outlined" | "text";
  rounded?: boolean;
  disabled?: boolean;
  bold?: boolean;
  layout?: "flex" | "block";
  className?: string;
  contentClassName?: string;
  [props: string]: any;
};

type TButtonWidthProps =
  | {
      width: "full";
      textAlign?: "left" | "center" | "right";
    }
  | {
      width?: "auto";
      textAlign?: never;
    };

type TButtonProps = TButtonBaseProps & TButtonWidthProps;

const buttonTheme = {
  color: {
    primary: {
      contained: {
        DEFAULT: "bg-primary border-primary text-secondary-light border",
        bold: "bg-primary border-primary text-secondary-light border-2",
      },
      outlined: {
        DEFAULT: "border-primary text-primary border",
        bold: "border-primary text-primary border-2",
      },
      text: "text-primary border-0",
      disabled: "bg-gray-300 border-gray-300 text-primary-light-80 border",
    },
    secondary: {
      contained: {
        DEFAULT: "bg-secondary border-secondary text-secondary-light border",
        bold: "bg-secondary border-secondary text-secondary-light border-2",
      },
      outlined: {
        DEFAULT: "border-secondary text-secondary border",
        bold: "border-secondary text-secondary border-2",
      },
      text: "text-secondary border-0",
      disabled: "bg-gray-300 border-gray-300 text-secondary-light-80 border",
    },
    "secondary-dark": {
      contained: {
        DEFAULT: "bg-secondary-light border-secondary-light text-secondary-dark border",
        bold: "bg-secondary-light border-secondary-light text-secondary-dark border-2",
      },
      outlined: {
        DEFAULT: "border-secondary-dark text-secondary-dark border",
        bold: "border-secondary-dark text-secondary-dark border-2",
      },
      text: "text-secondary-dark border-0",
      disabled: "bg-gray-300 border-gray-300 text-secondary-dark-80 border",
    },
  },
  size: {
    sm: "text-[14px] py-1.5 px-3",
    md: "text-[15px] py-2 px-4",
    lg: "text-[16px] py-2.5 px-5",
    xl: "text-[17px] py-3 px-6",
  },
  align: {
    left: "text-left justify-start !pl-3",
    center: "text-center justify-center",
    right: "text-right justify-end !pr-3",
  },
};

const Button = (props: TButtonProps) => {
  const {
    color = "primary",
    width = "auto",
    size = "sm",
    variant = "contained",
    layout = "block",
    rounded,
    disabled,
    bold = false,
    children,
    className,
    contentClassName,
    textAlign = "center",
    ...options
  } = props;

  const getButtonClasses = () => {
    const defaultClass = "flex items-center whitespace-nowrap select-none";
    const colorSet = buttonTheme.color[color];
    let colorClass = "";

    if (disabled) {
      colorClass = colorSet.disabled;
    } else {
      const variantSet = colorSet[variant];

      if (typeof variantSet === "object") {
        if (bold && variantSet.bold) {
          colorClass = variantSet.bold;
        } else {
          colorClass = variantSet.DEFAULT;
        }
      } else {
        colorClass = variantSet;
      }
    }

    const roundedClass = rounded ? "rounded-full" : "rounded-[4px]";
    const fontWeightClass = bold ? "font-DunggeunmisoB" : "font-Dunggeunmiso";

    return [
      defaultClass,
      colorClass,
      buttonTheme.size[size],
      buttonTheme.align[textAlign],
      roundedClass,
      fontWeightClass,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const fullWidthProps = layout === "block" ? "w-full" : "grow";
  const fitWidthProps = layout === "block" ? "w-fit" : "self-start";

  return (
    <Pressable
      className={`${width === "full" ? fullWidthProps : fitWidthProps} ${className}`}
      {...options}
    >
      {children && <Text className={`${getButtonClasses()} ${contentClassName}`}>{children}</Text>}
    </Pressable>
  );
};
export default Button;
