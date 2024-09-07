import { fabric } from "fabric";
import { useCallback, useMemo, useState } from "react";
import { useAutoResize } from "@/features/editor/hooks/use-auto-resize";
import {
  BuildEditorProps,
  CIRCLE_OPTIONS,
  DIAMOND_OPTIONS,
  Editor,
  FILL_COLOR,
  RECTANGLE_OPTIONS,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  TRIANGLE_OPTIONS,
} from "@/features/editor/types";
import { useCanvasEvents } from "@/features/editor/hooks/use-canvas-events";
import { isTextType } from "@/features/editor/utils";

type EditorHookProps = {
  clearSelectionCallback?: () => void;
}

export const useEditor = ({
  clearSelectionCallback,
}: EditorHookProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

  const [fillColor, setFillColor] = useState<string>(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState<string>(FILL_COLOR);
  const [strokeWidth, setStrokeWidth] = useState<number>(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] = useState<number[]>(STROKE_DASH_ARRAY);
  const [opacity, setOpacity] = useState<number>(1);

  useAutoResize({ canvas, container });
  useCanvasEvents({
    canvas,
    container,
    setSelectedObjects,
    clearSelectionCallback,
  });

  const getCurrentWorkspace = () => {
    return canvas?.getObjects().find((object) => object.name === "clip");
  };

  const center = (object: fabric.Object) => {
    const workspace = getCurrentWorkspace();
    const center = workspace?.getCenterPoint();

    // @ts-ignore
    canvas._centerObject(object, center);
  };

  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas?.add(object);
    canvas?.setActiveObject(object);
  };

  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      fabric.Object.prototype.set({
        cornerColor: "#FFF",
        cornerStyle: "circle",
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      });

      const initialWorkspace = new fabric.Rect({
        width: 900,
        height: 1200,
        name: "clip",
        fill: "white",
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: "rgba(0, 0, 0, 0.8)",
          blur: 5,
        }),
      });

      initialCanvas.setWidth(initialContainer.offsetWidth);
      initialCanvas.setHeight(initialContainer.offsetHeight);

      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);
    },
    []
  );

  const buildEditor = ({
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    setFillColor,
    setStrokeColor,
    setStrokeWidth,
    selectedObjects,
  }: BuildEditorProps): Editor => {
    return {
      addCircle: () => {
        const object = new fabric.Circle({
          ...CIRCLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        });

        addToCanvas(object);
      },
      addSquare: () => {
        const object = new fabric.Rect({
          ...RECTANGLE_OPTIONS,
          rx: 50,
          ry: 50,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        });

        addToCanvas(object);
      },
      addSquareFull: () => {
        const object = new fabric.Rect({
          ...RECTANGLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        });

        addToCanvas(object);
      },
      addTriangle: () => {
        const object = new fabric.Triangle({
          ...TRIANGLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        });

        addToCanvas(object);
      },
      addReverseTriangle: () => {
        const HEIGHT = 400;
        const WIDTH = 400;

        const object = new fabric.Polygon(
          [
            { x: 0, y: 0 },
            { x: WIDTH, y: 0 },
            { x: WIDTH / 2, y: HEIGHT },
          ],
          {
            ...TRIANGLE_OPTIONS,
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth: strokeWidth,
          }
        );

        addToCanvas(object);
      },
      addDiamond: () => {
        const HEIGHT = DIAMOND_OPTIONS.height;
        const WIDTH = DIAMOND_OPTIONS.width;

        const object = new fabric.Polygon(
          [
            { x: WIDTH / 2, y: 0 },
            { x: WIDTH, y: HEIGHT / 2 },
            { x: WIDTH / 2, y: HEIGHT },
            { x: 0, y: HEIGHT / 2 },
          ],
          {
            ...DIAMOND_OPTIONS,
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth: strokeWidth,
          }
        );

        addToCanvas(object);
      },
      changeFillColor: (value: string) => {
        setFillColor(value);
        canvas.getActiveObjects().forEach((object) => {
          object.set({ fill: value });
        })
        canvas.renderAll();
      },
      changeStrokeColor: (value: string) => {
        setStrokeColor(value);
        canvas.getActiveObjects().forEach((object) => {
          // Note: Text objects don't have a stroke property
          if(isTextType(object.type)) {
            object.set({ fill: value });
            return;
          }
          object.set({ stroke: value });
        })
        canvas.renderAll();
      },
      changeStrokeWidth: (value: number) => {
        setStrokeWidth(value);
        canvas.getActiveObjects().forEach((object) => {
          object.set({ strokeWidth: value });
        })
        canvas.renderAll();
      },
      changeStrokeDashArray: (value: number[]) => {
        setStrokeDashArray(value);
        canvas.getActiveObjects().forEach((object) => {
          object.set({ strokeDashArray: value });
        })
        canvas.renderAll();
      },
      changeOpacity: (value: number) => {
        setOpacity(value);
        canvas.getActiveObjects().forEach((object) => {
          object.set({ opacity: value });
        })
        canvas.renderAll();
      },
      fillColor,
      getActiveFillColor: () => {
        const selectedObject = selectedObjects[0];
        if (!selectedObject) {
          return fillColor;
        }

        const value = selectedObject.get('fill') || fillColor;

        // TODO: Support Fabirc Gradient
        return value as string;
      },
      getActiveStrokeColor: () => {
        const selectedObject = selectedObjects[0];
        if (!selectedObject) {
          return strokeColor;
        }

        const value = selectedObject.get('stroke') || strokeColor;
        return value as string;
      },
      getOpacity: () => {
        const selectedObject = selectedObjects[0];
        if (!selectedObject) {
          return opacity;
        }

        const value = selectedObject.get('opacity') || opacity;
        return value as number;
      },
      getActiveStrokeWidth: () => {
        const selectedObject = selectedObjects[0];
        if (!selectedObject) {
          return strokeWidth;
        }

        const value = selectedObject.get('strokeWidth') || strokeWidth;
        return value as number;
      },
      getActiveStrokeDashArray: () => {
        const selectedObject = selectedObjects[0];
        if (!selectedObject) {
          return [];
        }

        const value = selectedObject.get('strokeDashArray') || [];
        return value as number[];
      },
      sendForwards: () => {
        canvas.getActiveObjects().forEach((object) => {
          canvas.bringForward(object);
        });
  
        canvas.renderAll();
        
        const workspace = getCurrentWorkspace();
        workspace?.sendToBack();
      },
      sendToBack: () => {
        canvas.getActiveObjects().forEach((object) => {
          canvas.sendBackwards(object);
        });
  
        canvas.renderAll();
        const workspace = getCurrentWorkspace();
        workspace?.sendToBack();
      },
      strokeWidth,
      canvas,
      selectedObjects,
    };
  };

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        canvas,
        fillColor,
        strokeColor,
        strokeWidth,
        strokeDashArray,
        setFillColor,
        setStrokeColor,
        setStrokeWidth,
        setStrokeDashArray,
        selectedObjects,
      });
    }

    return undefined;
  }, [
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    setFillColor,
    setStrokeColor,
    setStrokeWidth,
    selectedObjects,
  ]);

  return { init, editor };
};
