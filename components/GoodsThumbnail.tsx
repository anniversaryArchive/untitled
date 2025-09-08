import { View } from "react-native";
import Typography from "./Typography";
import WiggleBorder from "./WiggleBorder";

// GoodsThumbnail.tsx
interface GoodsThumbnailProps {
  title: string;
  subtitle: string;
  // imgUrl?: string; // 나중에 이미지 들어가면
}

const GoodsThumbnail = ({ title, subtitle }: GoodsThumbnailProps) => {
  return (
    <View className="flex gap-[10px]">
      <WiggleBorder width={155} height={155} />
      <View className="flex gap-1">
        <View className="flex flex-row items-center gap-2">
          <Typography variant="Body4" color="primary">
            {title}
          </Typography>
        </View>
        <Typography variant="Body4">{subtitle}</Typography>
      </View>
    </View>
  );
};


export default GoodsThumbnail;
