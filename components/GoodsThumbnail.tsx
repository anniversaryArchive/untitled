import { View, Image } from "react-native";
import Typography from "./Typography";
import WiggleBorder from "./WiggleBorder";

interface GoodsThumbnailProps {
  title: string;
  subtitle: string;
  imgUrl?: string;
}

const GoodsThumbnail = ({ title, subtitle, imgUrl }: GoodsThumbnailProps) => {
  return (
    <View className="flex gap-[10px]" style={{ position: "relative" }}>
      <View style={{ width: 155, height: 155 }}>
        <WiggleBorder width={155} height={155} />
        {imgUrl && (
          <Image
            source={{ uri: imgUrl }}
            style={{
              width: 145,
              height: 145,
              position: "absolute",
              top: 5,
              left: 5,
              borderRadius: 10,
            }}
            resizeMode="cover"
          />
        )}
      </View>
      {/* 텍스트 영역 */}
      <View style={{ maxWidth: 150, overflow: "hidden" }} className="flex gap-1">
        <View className="flex flex-row items-center gap-2">
          <Typography
            variant="Body4"
            color="primary"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Typography>
        </View>
        <View style={{ maxWidth: 150, overflow: "hidden" }}>
          <Typography variant="Body4" numberOfLines={1} ellipsizeMode="tail">
            {subtitle}
          </Typography>
        </View>
      </View>
    </View>
  );
};

export default GoodsThumbnail;
