import React from "react";

import * as Icons from "@/assets/icons";

import { getColor } from "@/utils/color";

interface IIconProps {
  name: string;
  size: number;
  fill?: string;
  stroke?: string;
}

const iconMap: { [key: string]: React.FC<any> } = {
  folder: Icons.Folder,
  search: Icons.Search,
  star: Icons.Star,
  bell: Icons.Bell,
  user: Icons.User,
  close: Icons.Close,
  chevronLeft: Icons.ChevronLeft,
};

export default function Icon(props: IIconProps) {
  const { name, size, fill = "currentColor", stroke = "currentColor" } = props;

  const IconComponent = iconMap[name];

  if (!IconComponent) return <></>;

  return (
    <IconComponent width={size} height={size} fill={getColor(fill)} stroke={getColor(stroke)} />
  );
}
