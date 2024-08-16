import { fabric } from "fabric";
import { useCallback, useMemo, useState } from "react";
import { useAutoResize } from "@/features/editor/hooks/use-auto-resize";
import { CIRCLE_OPTIONS, DIAMOND_OPTIONS, RECTANGLE_OPTIONS, TRIANGLE_OPTIONS } from "@/features/editor/types";

export const useEditor = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  const getCurrentWorkspace = () => {
    return canvas?.getObjects().find((object) => object.name === 'clip')
  }

  const center = (object: fabric.Object) => {
    const workspace = getCurrentWorkspace();
    const center = workspace?.getCenterPoint();

    // @ts-ignore
    canvas._centerObject(object, center)
  }

  const addToCanvas = (object: fabric.Object) => {
    center(object)
    canvas?.add(object)
    canvas?.setActiveObject(object)
  }

  useAutoResize({ canvas, container})

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
          blur: 5
        })
      })

      initialCanvas.setWidth(initialContainer.offsetWidth)
      initialCanvas.setHeight(initialContainer.offsetHeight)

      initialCanvas.add(initialWorkspace)
      initialCanvas.centerObject(initialWorkspace)
      initialCanvas.clipPath = initialWorkspace

      setCanvas(initialCanvas)
      setContainer(initialContainer)

    },
    []
  );

  const buildEditor = () => {
    return {
      addCircle: () => {
        const object = new fabric.Circle({
          ...CIRCLE_OPTIONS
        })

        addToCanvas(object)
      },
      addSquare: () => {
        const object = new fabric.Rect({
          ...RECTANGLE_OPTIONS,
          rx: 50,
          ry: 50  
        })

        addToCanvas(object)
      },
      addSquareFull: () => {
        const object = new fabric.Rect({
          ...RECTANGLE_OPTIONS,
        })

        addToCanvas(object)
      },
      addTriangle: () => {
        const object = new fabric.Triangle({
          ...TRIANGLE_OPTIONS
        })

        addToCanvas(object)
      },
      addReverseTriangle: () => {
        const HEIGHT = 400
        const WIDTH = 400

        const object = new fabric.Polygon([
          { x: 0, y: 0 },
          { x: WIDTH , y: 0 },
          { x: WIDTH / 2, y: HEIGHT }
        ], {
          ...TRIANGLE_OPTIONS
        })

        addToCanvas(object)
      },
      addDiamond: () => {
        const HEIGHT = DIAMOND_OPTIONS.height
        const WIDTH = DIAMOND_OPTIONS.width

        const object = new fabric.Polygon([
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },
          { x: 0, y: HEIGHT / 2 }
        ], {
          ...DIAMOND_OPTIONS
        })

        addToCanvas(object)
      }
    }
  }

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor()
    }
  }, [canvas])

  return { init, editor };
};
