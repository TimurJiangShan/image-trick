import { IoTriangle } from "react-icons/io5";
import { FaDiamond } from "react-icons/fa6";
import { FaCircle, FaSquare, FaSquareFull } from "react-icons/fa";

import { ActiveTool, Editor } from "@/features/editor/types";
import { ShapeTool } from "@/features/editor/components/shape-tool";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ShapeSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ShapeSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ShapeSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <div>
      <aside
        className={cn(
          "bg-white border-r z-[40] h-full flex flex-col overflow-hidden",
          "transition-all duration-300 ease-in-out",
          activeTool === "shapes" ? "w-[360px]" : "w-0"
        )}
      >
        <div className="w-[360px]">
          <ToolSidebarHeader
            title="Shapes"
            description="Add shapes to your canvas"
          />
          <ScrollArea>
            <div className="grid grid-cols-3 gap-4 p-4">
              <ShapeTool onClick={() => editor?.addCircle()} icon={FaCircle} />
              <ShapeTool onClick={() => editor?.addSquare()} icon={FaSquare} />
              <ShapeTool onClick={() => editor?.addSquareFull()} icon={FaSquareFull} />
              <ShapeTool onClick={() => editor?.addTriangle()} icon={IoTriangle} />
              <ShapeTool
                onClick={() => editor?.addReverseTriangle()}
                icon={IoTriangle}
                iconClassName="rotate-180"
              />
              <ShapeTool onClick={() => {}} icon={FaDiamond} />
            </div>
          </ScrollArea>
        </div>
      </aside>
      <ToolSidebarClose activeTool={activeTool} onClick={onClose} />

    </div>
  );
};
