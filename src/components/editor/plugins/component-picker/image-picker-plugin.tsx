import { useMemo } from "react";

import { PhotoIcon } from "@heroicons/react/16/solid";

import { useImageFilePicker } from "@/components/editor/plugins/block-insert/insert-image-plugin";
import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/editor/plugins/component-picker/component-picker-plugin";

export function ImagePickerPlugin() {
  const { pick, input } = useImageFilePicker();

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "image",
        label: "Insert image",
        group: "Media",
        description: "Upload an image from your device.",
        icon: <PhotoIcon className="text-muted-fg" />,
        keywords: ["image", "photo", "picture", "file", "img"],
        onSelect: pick,
      },
    ],
    [pick],
  );

  useComponentPickerItems(items);

  return input;
}
