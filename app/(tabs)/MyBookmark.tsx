import { useEffect, useState } from "react";
import { FlatList, Pressable, ScrollView, View } from "react-native";

import { Button, GoodsThumbnail, Icon, InputBox, Segment, Typography } from "@components/index";
import { colors } from "@utils/tailwind-colors";
import { BOOKMARK_TYPE } from "@/constants/global";
import folder from "@table/folder";

import { TFolder } from "@/types/folder";
import { TBookmarkType } from "@/types/bookmark";

export default function MyBookmark() {
  const [mode, setMode] = useState<TBookmarkType>("WISH");
  const [viewMode, setViewMode] = useState<"folder" | "item">("item");
  const [folderList, setFolderList] = useState<TFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadFolderList = async () => {
      const folderList = await folder.getAll();
      setFolderList([{ id: 0, name: "전체", created_at: new Date() }, ...folderList]);
    };

    loadFolderList();
  }, []);

  useEffect(() => {
    setSearchTerm("");
    setViewMode("item");
    setSelectedFolder(0);
  }, [mode]);

  return (
    <View className="flex-1 gap-4 px-6 pt-1">
      {/* Header */}
      <View className="flex flex-row items-center justify-between">
        <Typography variant="Header1" color="primary">
          LOGO
        </Typography>
        <Pressable>
          <Icon name="search" size={32} fill={colors.primary.DEFAULT} />
        </Pressable>
      </View>

      <Segment segments={BOOKMARK_TYPE} selectedKey={mode} onSelect={setMode} />
      <View className="flex-1 gap-4">
        {/* 폴더 리스트 */}
        <ScrollView
          horizontal
          className="min-h-8 flex-none -mx-6"
          contentContainerClassName="flex gap-3 flex-row pl-6"
          showsHorizontalScrollIndicator={false}
        >
          {folderList.map(({ id, name }) => {
            const isSelected = id === selectedFolder;

            return (
              <Button
                key={id}
                bold
                variant={isSelected ? "contained" : "outlined"}
                onPress={() => {
                  setSelectedFolder(id);
                }}
              >
                {name}
              </Button>
            );
          })}
        </ScrollView>
        <InputBox size="md" color="secondary" value={searchTerm} onChangeText={setSearchTerm} />

        {/* WISH | GET */}
        <View className="flex-1 gap-1">
          <View className="flex-row items-center justify-end gap-1">
            <Button
              bold
              variant="text"
              color={viewMode === "folder" ? "primary" : "secondary-dark"}
              contentClassName={viewMode === "folder" ? "" : "text-secondary-dark-80"}
              onPress={() => {
                setViewMode("folder");
              }}
            >
              폴더 보기
            </Button>
            <Button
              variant="text"
              bold
              color={viewMode === "item" ? "primary" : "secondary-dark"}
              contentClassName={viewMode === "item" ? "" : "text-secondary-dark-80"}
              onPress={() => {
                setViewMode("item");
              }}
            >
              아이템 보기
            </Button>
          </View>
          <FlatList
            data={[1, 2, 3, 4, 5, 6, 7, 8]}
            contentContainerClassName="pb-4"
            columnWrapperClassName="flex flex-row justify-between"
            numColumns={2}
            keyExtractor={(_, index) => `${index}`}
            showsVerticalScrollIndicator={false}
            renderItem={() => {
              return (
                <View className="p-2">
                  <GoodsThumbnail />
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}
