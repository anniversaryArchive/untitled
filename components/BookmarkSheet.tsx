import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  BottomSheet,
  Button,
  Icon,
  InputBox,
  Segment,
  TextBox,
  Typography,
  Divider,
  FolderPicker,
} from ".";
import { BottomSheetProps } from "./BottomSheet";
import { TBookmarkType } from "@/types/bookmark";
import { BOOKMARK_TYPE } from "@/constants/global";
import { colors } from "@utils/tailwind-colors";

interface IBookmarkSheetProps extends Omit<BottomSheetProps, "children"> {}

const BookmarkSheet = (props: IBookmarkSheetProps) => {
  const { open, onClose } = props;
  const [type, setType] = useState<TBookmarkType>("WISH");
  const [folderPickerOpen, setFolderPickerOpen] = useState(false);

  return (
    <>
      <BottomSheet open={open} onClose={onClose}>
        <SafeAreaView edges={["bottom"]} className="flex justify-center gap-3">
          <Typography variant="Header3" className="text-center">
            추가
          </Typography>
          <Segment segments={BOOKMARK_TYPE} selectedKey={type} onSelect={setType} />
          <View className="w-[150px] h-[150px] bg-secondary-light self-center" />
          <InputBox size="lg" placeholder="이름을 입력해주세요" />
          <Divider />
          <Button
            bold
            size="lg"
            width="full"
            variant="text"
            color="secondary-dark"
            textAlign="left"
            contentClassName="gap-2"
            startIcon={
              <Icon
                name="folder"
                size={24}
                fill={colors.secondary.dark}
                stroke={colors.secondary.dark}
              />
            }
            endIcon={
              <Icon
                name="chevronRight"
                size={24}
                fill={colors.secondary.dark}
                stroke={colors.secondary.dark}
              />
            }
            onPress={() => {
              setFolderPickerOpen(true);
            }}
          >
            기본폴더
          </Button>
          <Divider />
          <TextBox placeholder="메모" bold className="min-h-28" />
          <Button size="xl" className="mt-20" width="full" rounded bold>
            추가
          </Button>
        </SafeAreaView>
      </BottomSheet>
      <FolderPicker
        open={folderPickerOpen}
        onClose={() => {
          setFolderPickerOpen(true);
        }}
        onSelectFolder={(folder) => {
          console.log(folder);
        }}
      />
    </>
  );
};

export default BookmarkSheet;
