import { View, Image } from "react-native";
import Typography from "./Typography";
import WiggleBorder from "./WiggleBorder";
import {Button} from "@components/index";

const GoodsThumbnail = ({ name_kr, anime_kr_title, image_link }) => {
  return (
    <View className="flex gap-[10px] relative">
      <View className="w-[155px] h-[155px]">
        <WiggleBorder width={155} height={155} />
        {image_link && (
          <Image
            source={{ uri: image_link }}
            className="w-[145px] h-[145px] absolute top-[5px] left-[5px] rounded-[10px]"
            resizeMode="cover"
          />
        )}
      </View>
      {/* 텍스트 영역 */}
      <View className="max-w-[150px] overflow-hidden flex gap-1 pl-1">
        {anime_kr_title && (
          <Button
            layout="flex"
            rounded
            onPress={() => {}}>
            {anime_kr_title}
          </Button>
        )}
        <View className="flex flex-row items-center gap-2 max-w-[150px] overflow-hidden">
          <Typography
            variant="Body4"
            color="primary"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ flex: 1, minWidth: 0 }} // 핵심: minWidth:0
          >
            {name_kr}
          </Typography>
        </View>
      </View>
    </View>
  );
};

export default GoodsThumbnail;
