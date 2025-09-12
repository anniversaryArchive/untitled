import { useCallback, useState } from "react";
import { Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImagePickerAsset } from "expo-image-picker";

import { colors } from "@utils/tailwind-colors";
import { selectImage } from "@utils/saveImage";
import { activeBottomSheet } from "@/stores/activeBottomSheet";
import { useDefaultFolder } from "@/stores/useDefaultFolder";
import { BOOKMARK_TYPE } from "@/constants/global";

import Icon from "./Icon";
import Button from "./Button";
import BottomSheet from "./BottomSheet";
import Divider from "./Divider";
import FolderPicker from "./FolderPicker";
import { InputBox, TextBox } from "./Input";
import Segment from "./Segment";
import Typography from "./Typography";

import { TBookmarkType } from "@/types/bookmark";
import { TFolder } from "@/types/folder";

interface IBookmarkSheetProps {}

const SHEET_NAME = "BOOKMARK";

const BookmarkSheet = (props: IBookmarkSheetProps) => {
  const defaultFolder = useDefaultFolder(({ folder }) => folder) as TFolder;

  const [type, setType] = useState<TBookmarkType>("WISH");
  const [image, setImage] = useState<ImagePickerAsset | null>(null);
  const [itemName, setItemName] = useState("");
  const [selectedFolder, setSelectFolder] = useState<TFolder>(defaultFolder);
  const [memo, setMemo] = useState("");

  const { sheetStack, openSheet, closeSheet } = activeBottomSheet();
  const isOpen = sheetStack[sheetStack.length - 1] === SHEET_NAME;

  const pickImage = async () => {
    const uploadImg = await selectImage();
    if (uploadImg) setImage(uploadImg);
  };

  const handleClose = useCallback(() => {
    setImage(null);
    setItemName("");
    setSelectFolder(defaultFolder);
    setMemo("");
    closeSheet();
  }, []);

  return (
    <>
      <BottomSheet open={isOpen} onClose={handleClose}>
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
          <InputBox
            value={itemName}
            onChangeText={setItemName}
            size="lg"
            placeholder="이름을 입력해주세요"
          />
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
              openSheet("FOLDER");
            }}
          >
            {selectedFolder.name}
          </Button>
          <Divider />
          <TextBox
            value={memo}
            onChangeText={setMemo}
            bold
            placeholder="메모"
            className="min-h-28"
          />
          <Button size="xl" className="mt-20" width="full" rounded bold>
            추가
          </Button>
        </SafeAreaView>
      </BottomSheet>
      <FolderPicker onSelectFolder={setSelectFolder} />
    </>
  );
};

export default BookmarkSheet;
