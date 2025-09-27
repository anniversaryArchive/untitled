import { defaultFolderState } from "@/stores/defaultFolderState";
import { TFolder } from "@/types/folder";

export default function useDefaultFolder() {
  return defaultFolderState((state) => state.folder) as TFolder;
}
