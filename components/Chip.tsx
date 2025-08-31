import { View, Text, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface IChip {
  label: string;
  color?: keyof typeof chipTheme.color;
  size?: keyof typeof chipTheme.size;
  value?: string;
  onClick?: (value?: string) => void;
  onDelete?: (value?: string) => void;
}

const chipTheme = {
  color: {
    primary: { bg: "bg-primary", text: "text-secondary-light" },
    "secondary-light": { bg: "bg-secondary-light", text: "text-secondary-dark" },
  },
  size: {
    sm: { bg: "h-[21px] px-1 py-[5px] rounded-xl", text: "text-[10px] font-DunggeunmisoB" },
    md: { bg: "h-[27px] px-2 py-[6px] rounded-xl", text: "text-[14px] font-DunggeunmisoB" },
    lg: { bg: "h-[30px] px-3 py-2 rounded-full", text: "text-[14px] font-Dunggeunmiso" },
  },
};

const Chip = (props: IChip) => {
  const { label, size = "md", color = "secondary-light", value, onClick, onDelete } = props;

  const Container = ({ children }: { children: React.ReactNode }) => {
    if (onClick) {
      return <Pressable onPress={() => onClick(value || label)}>{children}</Pressable>;
    }
    return <>{children}</>;
  };

  return (
    <View
      className={`w-fit ${chipTheme.color[color].bg} ${chipTheme.size[size].bg} flex justify-center items-center ${onDelete && "flex-row gap-2"}`}
    >
      <Container>
        <Text className={`${chipTheme.size[size].text} ${chipTheme.color[color].text}`}>
          {label}
        </Text>
      </Container>
      {onDelete && (
        <Pressable onPress={() => onDelete(value || label)}>
          <Icon name="close" color={"#AAAAAA"} size={size === "sm" ? 10 : 14} />
        </Pressable>
      )}
    </View>
  );
};

export default Chip;
