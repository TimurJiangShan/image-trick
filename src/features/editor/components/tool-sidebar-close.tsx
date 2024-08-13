import { ChevronsLeft } from "lucide-react";
import { ActiveTool } from "@/features/editor/types";
import { cn } from "@/lib/utils";

interface ToolSidebarCloseProps {
  activeTool: ActiveTool;
  onClick: () => void;
}

export const ToolSidebarClose = ({ onClick, activeTool }: ToolSidebarCloseProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute z-[60] h-[70px] bg-white top-1/2 flex items-center justify-center rounded-r-xl px-1 pr-2 border-r border-y group",
        "transition-all duration-300 ease-in-out",
        activeTool === "shapes" 
          ? "opacity-100  pointer-events-auto -translate-x-full" 
          : "opacity-0  pointer-events-none translate-x-0 ",
        activeTool === "shapes" ?  "left-[30.5rem]" : "left-0"
      )}
    >
      <ChevronsLeft className="size-4 text-black group-hover:opacity-75 transition" />
    </button>
  );
};
