import { View } from "react-native";
import Typography from "./Typography";
import WiggleBorder from "./WiggleBorder";

const GoodsThumbnail = () => {
  return (
    <View className="flex gap-[10px]">
      <WiggleBorder width={155} height={155}></WiggleBorder>
      <View className="flex gap-1">
        <View className="flex flex-row items-center gap-2">
          {/* <Chip size="sm" label="하이큐" /> */}
          <Typography variant="Body4" color="primary">
            히나타
          </Typography>
        </View>
        <Typography variant="Body4">[하이큐!! 네무라세테]</Typography>
      </View>
    </View>
  );
};

export default GoodsThumbnail;
