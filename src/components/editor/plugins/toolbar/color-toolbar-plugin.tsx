import { useMemo } from "react";

import { $getRoot, $getSelection } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { $patchStyleText } from "@lexical/selection";

import { PaintBrushIcon, SwatchIcon } from "@heroicons/react/16/solid";
import { type Color, parseColor } from "@react-stately/color";

import { useFormatStateValue } from "@/components/editor/extensions/format-state-extension";
import { Button } from "@/components/ui/button";
import { ColorArea } from "@/components/ui/color-area";
import { ColorField } from "@/components/ui/color-field";
import { ColorPicker, EyeDropper } from "@/components/ui/color-picker";
import { ColorSlider, ColorSliderTrack } from "@/components/ui/color-slider";
import { ColorSwatch } from "@/components/ui/color-swatch";
import { ColorThumb } from "@/components/ui/color-thumb";
import { Input } from "@/components/ui/input";
import { DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverBody } from "@/components/ui/popover";
import { ToolbarGroup } from "@/components/ui/toolbar";
import { TooltipTrigger, Tooltip } from "@/components/ui/tooltip";

function toColor(value: string, fallback: string): Color {
  try {
    return parseColor(value);
  } catch {
    return parseColor(fallback);
  }
}

function EditorColorPicker({
  property,
  label,
  icon: Icon,
  fallback,
}: {
  property: "color" | "background-color";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  fallback: string;
}) {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const current = useFormatStateValue(property === "color" ? "color" : "backgroundColor");
  const value = useMemo(() => toColor(current, fallback), [current, fallback]);

  return (
    <ColorPicker
      value={value}
      onChange={(color) => {
        const css = color.toString("hex");
        editor.update(() => {
          const selection = $getSelection() ?? $getRoot().selectEnd();
          $patchStyleText(selection, { [property]: css });
        });
      }}
    >
      <DialogTrigger>
        <TooltipTrigger>
          <Button intent="outline" size="sq-xs" aria-label={label} isDisabled={!isEditable}>
            <span className="flex flex-col items-center gap-0.5 *:[svg]:text-(--btn-icon)">
              <Icon />
              <ColorSwatch className="h-0.5 w-3.5 rounded-full" />
            </span>
          </Button>
          <Tooltip>{label}</Tooltip>
        </TooltipTrigger>
        <Popover className="[--gutter:--spacing(1)]" placement="bottom start">
          <PopoverBody>
            <div className="space-y-(--gutter)">
              <ColorArea
                colorSpace="hsb"
                xChannel="saturation"
                yChannel="brightness"
                aria-label={`${label} saturation and brightness`}
              />
              <ColorSlider colorSpace="hsb" channel="hue" aria-label={`${label} hue`}>
                <ColorSliderTrack>
                  <ColorThumb />
                </ColorSliderTrack>
              </ColorSlider>
              <div className="flex items-center gap-(--gutter)">
                <ColorField aria-label={`${label} hex`} className="min-w-0 flex-1">
                  <Input />
                </ColorField>
                {typeof window !== "undefined" && window.EyeDropper && <EyeDropper />}
              </div>
            </div>
          </PopoverBody>
        </Popover>
      </DialogTrigger>
    </ColorPicker>
  );
}

export function ColorToolbarPlugin() {
  return (
    <ToolbarGroup aria-label="Color">
      <EditorColorPicker property="color" label="Text color" icon={SwatchIcon} fallback="#000000" />
      <EditorColorPicker
        property="background-color"
        label="Background color"
        icon={PaintBrushIcon}
        fallback="#ffffff"
      />
    </ToolbarGroup>
  );
}
