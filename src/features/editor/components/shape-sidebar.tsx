import { IoTriangle } from "react-icons/io5";
import { FaDiamond } from "react-icons/fa6";
import { FaCircle, FaSquare, FaSquareFull } from "react-icons/fa";

import { ActiveTool } from "@/features/editor/types";
import { ShapeTool } from "@/features/editor/components/shape-tool";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ShapeSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ShapeSidebar = ({
  activeTool,
  onChangeActiveTool,
}: ShapeSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white border-r z-[40] h-full flex flex-col overflow-hidden",
        "transition-[width] duration-300 ease-in-out",
        activeTool === "shapes" ? "w-[360px]" : "w-0"
      )}
    >
      <div className={cn(
        "w-[360px] transition-transform duration-300 ease-in-out",
        activeTool === "shapes" ? "translate-x-0" : "-translate-x-full"
      )}>
        <ToolSidebarHeader
          title="Shapes"
          description="Add shapes to your canvas"
        />
        <ScrollArea>
          <div className="grid grid-cols-3 gap-4 p-4">
            <ShapeTool onClick={() => {}} icon={FaCircle} />
            <ShapeTool onClick={() => {}} icon={FaSquare} />
            <ShapeTool onClick={() => {}} icon={FaSquareFull} />
            <ShapeTool onClick={() => {}} icon={IoTriangle} />
            <ShapeTool
              onClick={() => {}}
              icon={IoTriangle}
              iconClassName="rotate-180"
            />
            <ShapeTool onClick={() => {}} icon={FaDiamond} />
          </div>
        </ScrollArea>
        {/* TODO: Fix the close button as */}
        <ToolSidebarClose onClick={onClose} />
      </div>
    </aside>
  );
};
