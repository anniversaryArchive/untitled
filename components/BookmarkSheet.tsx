import { useEffect, useState } from "react";
import { Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImagePickerAsset } from "expo-image-picker";

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
import { colors } from "@utils/tailwind-colors";
import { selectImage } from "@utils/saveImage";
import { BOOKMARK_TYPE } from "@/constants/global";
import { TBookmarkType } from "@/types/bookmark";

interface IBookmarkSheetProps extends Omit<BottomSheetProps, "children"> {}

const BookmarkSheet = (props: IBookmarkSheetProps) => {
  const { open, onClose } = props;
  const [type, setType] = useState<TBookmarkType>("WISH");
  const [folderPickerOpen, setFolderPickerOpen] = useState(false);
  const [image, setImage] = useState<ImagePickerAsset | null>(null);

  const pickImage = async () => {
    const uploadImg = await selectImage();
    if (uploadImg) setImage(uploadImg);
  };

  useEffect(() => {
    open && setImage(null);
  }, [open]);

  return (
    <>
      <BottomSheet open={open} onClose={onClose}>
        <SafeAreaView edges={["bottom"]} className="flex justify-center gap-3">
          <Typography variant="Header3" className="text-center">
            추가
          </Typography>
          <Segment segments={BOOKMARK_TYPE} selectedKey={type} onSelect={setType} />
          <Pressable
            onPress={pickImage}
            className={`w-[150px] h-[150px] self-center flex items-center justify-center rounded bg-secondary-light `}
          >
            {image ? (
              <Image source={{ uri: image.uri }} className="w-[150px] h-[150px] rounded" />
            ) : (
              <Icon
                name="plus"
                size={44}
                fill={colors.secondary.dark}
                stroke={colors.secondary.dark}
              />
            )}
          </Pressable>
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
                name="folderFill"
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
