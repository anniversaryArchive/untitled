import { Text, View } from "react-native";
import Svg, { Text as SvgText } from "react-native-svg";

import { colors } from "@utils/tailwind-colors";

interface ITypography {
  variant?: keyof typeof typographyTheme.variant;
  // color 제한하지 않고 String 받도록 수정
  // 내부에서 매핑 실패 시 fallback 주도록 처리
  color?: string;
  twotone?: never;
  className?: string;
  children: React.ReactNode;
}

interface ITwoToneTypography {
  variant?: keyof typeof typographyTheme.variant;
  color?: never;
  twotone?: keyof typeof twotoneColorMap;
  className?: never;
  children: React.ReactNode;
}

const typographyTheme = {
  variant: {
    Header1: "text-[36px] font-DunggeunmisoB",
    Header2: "text-[24px] font-DunggeunmisoB",
    Header3: "text-[20px] font-DunggeunmisoB",
    Header4: "text-[20px] font-Dunggeunmiso",
    Header5: "text-[16px] font-DunggeunmisoB",
    Title1: "text-[17px] font-Dunggeunmiso",
    Body1: "text-[16px] font-Dunggeunmiso",
    Body2: "text-[15px] font-Dunggeunmiso",
    Body3: "text-[14px] font-Dunggeunmiso",
    Footnote: "text-[13px] font-Dunggeunmiso",
    Caption: "text-[12px] font-Dunggeunmiso",
    Tag: "text-[14px] font-DunggeunmisoB",
  },
  color: {
    primary: "text-primary",
    "primary-light": "text-primary-light",
    secondary: "text-secondary",
    "secondary-light": "text-secondary-light",
    "secondary-dark": "text-secondary-dark",
    black: "text-black",
  },
};

const twotoneColorMap = {
  primary: {
    fill: colors.primary.light,
    stroke: colors.primary.DEFAULT,
  },
};

const Typography = (props: ITypography | ITwoToneTypography) => {
  const { variant = "Body1", color = "secondary-dark", twotone, children, className = "" } = props;

  const getTwotoneTypography = (twotone: keyof typeof twotoneColorMap) => {
    const _variant = typographyTheme.variant[variant];
    const sizeRegex = /text-\[(\d+)px\]/;
    const sizeMatch = _variant.match(sizeRegex);

    const fontSize = parseInt(sizeMatch?.[1] ?? "0");
    const strokeWidth: number = variant === "Header1" ? 2 : 1.5;

    return (
      <Svg height={fontSize + strokeWidth} width="100%">
        <SvgText
          fill={twotoneColorMap[twotone].fill} // 텍스트 내부 색상
          stroke={twotoneColorMap[twotone].stroke} // 외곽선 색상
          strokeWidth={strokeWidth} // 외곽선 두께
          fontSize={fontSize} // 폰트 크기
          x={0}
          y={fontSize / 2 + strokeWidth}
          fontFamily={"DunggeunmisoB"}
          alignmentBaseline="middle"
        >
          {children}
        </SvgText>
      </Svg>
    );
  };

  return (
    <View>
      {twotone ? (
        <>{getTwotoneTypography(twotone)}</>
      ) : (
        <Text
          // color theme 없으면 그대로 className 붙이지 않고 fallback 적용
          className={`${typographyTheme.variant[variant]} ${
            typographyTheme.color[color as keyof typeof typographyTheme.color] ??
            typographyTheme.color["secondary-dark"]
          } ${className}`}
        >
          {children}
        </Text>
      )}
    </View>
  );
};

export default Typography;
