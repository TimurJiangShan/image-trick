"use client"

import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

import { useEditor } from "@/features/editor/hooks/use-editor"
import { Navbar } from "@/features/editor/components/navbar";
import { Sidebar } from "@/features/editor/components/sidebar";
import { Toolbar } from "@/features/editor/components/toolbar";
import { Footer } from "@/features/editor/components/footer";
import { ActiveTool } from "../types";
import { ShapeSidebar } from "./shape-sidebar";

export const Editor = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");
  const { init, editor } = useEditor();

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const onChangeActiveTool = (tool: ActiveTool) => {
    if (tool === activeTool) {
      return setActiveTool("select");
    }

    setActiveTool(tool);
    //TODO: Implement other tool changes
    
  }

  useEffect(() => {
    const canvas = new fabric.Canvas(
      canvasRef.current,
      {
        controlsAboveOverlay: true,
        preserveObjectStacking: true,
      }
    )

    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    })

    return () => {
      canvas.dispose()
    }
  }, [init])

  return (
    <div className="h-full flex flex-col">
      <Navbar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool}/>
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool}/>
        <ShapeSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool}/>
        <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
          <Toolbar />
          <div className="flex-1 h-[calc(100%-124px)] bg-muted" ref={containerRef}>
            <canvas ref={canvasRef} />
          </div>
          <Footer />
        </main>
      </div>
    </div>
    
  )
}
