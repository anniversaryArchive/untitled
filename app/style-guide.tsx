import { ScrollView, View } from "react-native";
import { Typography } from "@/components";

export default function StyleGuide() {
  return (
    <ScrollView className="p-4">
      <View className=" flex h-full gap-6">
        <View className="flex gap-4">
          <Typography
            variant="Header2"
            color="primary"
            className="bg-primary-light border-primary-light p-1 border"
          >
            Typography
          </Typography>
          <View className="flex flex-row gap-5">
            <Typography variant="Header3" color="secondary" className="w-[100px]">
              variant
            </Typography>
            <View className=" flex gap-2">
              <Typography variant="Header1">Header1 </Typography>
              <Typography variant="Header2">Header2</Typography>
              <Typography variant="Header3">Header3</Typography>
              <Typography variant="Header4">Header4</Typography>
              <Typography variant="Title1">Title1</Typography>
              <Typography variant="Body1">Body1</Typography>
              <Typography variant="Body2">Body2</Typography>
              <Typography variant="Body3">Body3</Typography>
              <Typography variant="Footnote">Footnote</Typography>
              <Typography variant="Caption">Caption</Typography>
            </View>
          </View>
          <View className="flex flex-row gap-5">
            <Typography variant="Header3" color="secondary" className="w-[100px]">
              color
            </Typography>
            <View className="flex gap-2 p-1 bg-black">
              <Typography variant="Header4" color="primary">
                primary
              </Typography>
              <Typography variant="Header4" color="primary-light">
                primary-light
              </Typography>
              <Typography variant="Header4" color="secondary">
                secondary
              </Typography>
              <Typography variant="Header4" color="secondary-light">
                secondary-light
              </Typography>
              <Typography variant="Header4" color="secondary-dark">
                secondary-dark (default)
              </Typography>
            </View>
          </View>
          <View className="flex flex-row gap-5">
            <Typography variant="Header3" color="secondary" className="w-[100px]">
              twotone
            </Typography>
            <View className="flex w-full gap-2">
              <Typography variant="Header1" twotone="primary">
                H1) 하이큐!!
              </Typography>
              <Typography variant="Header1" twotone="primary">
                H1) Haikyu!!
              </Typography>
              <Typography variant="Header2" twotone="primary">
                H2) 하이큐!! Haikyu!!
              </Typography>
              <Typography variant="Header3" twotone="primary">
                H3) 하이큐!! Haikyu!!
              </Typography>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
