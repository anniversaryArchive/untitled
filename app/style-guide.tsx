import { ScrollView, View } from "react-native";
import { Typography, Button, InputBox, TextBox } from "@/components";

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
        <View className="flex gap-4">
          <Typography
            variant="Header2"
            color="primary"
            className="bg-primary-light border-primary-light p-1 border"
          >
            Button
          </Typography>
          <View className="flex w-full gap-4">
            <View className="flex flex-row gap-5">
              <Typography variant="Header3" color="secondary" className="w-[100px]">
                size
              </Typography>
              <View className=" flex flex-row gap-2">
                <Button onPress={() => {}}>sm</Button>
                <Button size="md" onPress={() => {}}>
                  md
                </Button>
                <Button size="lg" onPress={() => {}}>
                  lg
                </Button>
              </View>
            </View>
            <View className="flex flex-row gap-5">
              <Typography variant="Header3" color="secondary" className="w-[100px]">
                variant / disabled
              </Typography>
              <View className="flex gap-2">
                <View className=" flex gap-2">
                  <Button onPress={() => {}}>primary</Button>
                  <Button variant="outlined" onPress={() => {}}>
                    primary outlined
                  </Button>
                  <Button variant="text" onPress={() => {}}>
                    primary text
                  </Button>
                  <Button onPress={() => {}} disabled>
                    primary disabled
                  </Button>
                  <Button color="secondary" onPress={() => {}}>
                    secondary
                  </Button>
                  <Button variant="outlined" color="secondary" onPress={() => {}}>
                    secondary outlined
                  </Button>
                  <Button variant="text" color="secondary" onPress={() => {}}>
                    secondary text
                  </Button>
                  <Button color="secondary" onPress={() => {}} disabled>
                    secondary disabled
                  </Button>
                  <Button color="secondary-dark" onPress={() => {}}>
                    secondary-dark
                  </Button>
                  <Button variant="outlined" color="secondary-dark" onPress={() => {}}>
                    secondary-dark outlined
                  </Button>
                  <Button variant="text" color="secondary-dark" onPress={() => {}}>
                    secondary-dark text
                  </Button>
                  <Button color="secondary-dark" onPress={() => {}} disabled>
                    secondary-dark disabled
                  </Button>
                </View>
              </View>
            </View>
            <View className="flex flex-row gap-5">
              <Typography variant="Header3" color="secondary" className="w-[100px]">
                rounded
              </Typography>
              <View className=" flex flex-row gap-2">
                <Button onPress={() => {}}>default</Button>
                <Button rounded onPress={() => {}}>
                  rounded
                </Button>
              </View>
            </View>
            <View className="flex flex-row gap-5">
              <Typography variant="Header3" color="secondary" className="w-[100px]">
                width
              </Typography>
              <View className="grow flex flex-row gap-2">
                <Button onPress={() => {}}>fit(default)</Button>
                <Button width="full" onPress={() => {}}>
                  full
                </Button>
              </View>
            </View>
          </View>
        </View>
        <View className="flex gap-4">
          <Typography
            variant="Header2"
            color="primary"
            className="bg-primary-light border-primary-light p-1 border"
          >
            InputBox
          </Typography>
          <View className="flex flex-row gap-5">
            <Typography variant="Header3" color="secondary" className="w-[100px]">
              size
            </Typography>
            <View className="grow flex gap-2">
              <InputBox size="sm" placeholder="sm (default)" />
              <InputBox size="md" placeholder="md" />
              <InputBox size="lg" placeholder="lg" />
            </View>
          </View>
          <View className="flex flex-row gap-5">
            <Typography variant="Header3" color="secondary" className="w-[100px]">
              variant
            </Typography>
            <View className="grow flex gap-2">
              <InputBox color="primary" placeholder="primary" />
              <InputBox color="secondary" placeholder="secondary" />
              <InputBox color="secondary-dark" placeholder="secondary-dark (default) " />
            </View>
          </View>
          <View className="flex flex-row gap-5">
            <Typography variant="Header3" color="secondary" className="w-[100px]">
              optional
            </Typography>
            <View className="grow flex gap-2">
              <InputBox placeholder="readOnly" readOnly />
            </View>
          </View>
        </View>
        <View className="flex gap-4">
          <Typography
            variant="Header2"
            color="primary"
            className="bg-primary-light border-primary-light p-1 border"
          >
            TextBox
          </Typography>
          <View className="flex flex-row gap-5">
            <Typography variant="Header3" color="secondary" className="w-[100px]">
              variant
            </Typography>
            <View className="grow flex gap-2">
              <TextBox color="primary" placeholder="primary" />
              <TextBox color="secondary" placeholder="secondary" />
              <TextBox color="secondary-dark" placeholder="secondary-dark (default)" />
            </View>
          </View>
          <View className="flex flex-row gap-5">
            <Typography variant="Header3" color="secondary" className="w-[100px]">
              optional
            </Typography>
            <View className="grow flex gap-2">
              <TextBox bold placeholder="bold=true" />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
