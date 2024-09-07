import { ActiveTool, Editor, FILL_COLOR } from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorPicker } from "./color-picker";

interface FillColorSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const FillColorSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FillColorSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChange = (value: string) => {
    editor?.changeFillColor(value);
  };

  const value = editor?.getActiveFillColor() || FILL_COLOR;

  return (
      <aside
        className={cn(
          "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
          activeTool === "fill" ? "visible" : "hidden"
        )}
      >
        <ToolSidebarHeader
          title="Fill color"
          description="Add fill color to your shapes"
        />
        <ScrollArea>
          <div className="p-4 space-y-6">
            <ColorPicker value={value} onChange={onChange} />
          </div>
        </ScrollArea>
        <ToolSidebarClose activeTool={activeTool} onClick={onClose} />

      </aside>
  );
};
