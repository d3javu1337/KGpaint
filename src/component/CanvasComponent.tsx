import React, {FC, RefObject, useEffect, useRef} from "react";
import {DrawMode, Point} from "../model/Model";
import {ILogic} from "../logic/Logic";

interface CanvasComponentProps {
    onReady: (canvas: HTMLCanvasElement) => void;
    logic: RefObject<ILogic | null>;
}

const CanvasComponent: FC<CanvasComponentProps> = ({onReady, logic}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        if (canvasRef.current) {
            onReady(canvasRef.current)
        }
    }, []);
    console.log("render")

    const points = useRef<Point[]>([]);
    const lastDrawMode = useRef<DrawMode>(DrawMode.Empty);

    const handler: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        console.log("canvas event", event);
        const currDrawMode = logic.current!.getDrawContext().mode!
        console.log(points.current);
        if (currDrawMode !== undefined && (currDrawMode === lastDrawMode.current)) {
            points.current.push(new Point(event.clientX, event.clientY))
            lastDrawMode.current = currDrawMode;
            if (logic.current!.validatePointsForDrawMode(points.current)){
                console.log("current point", points.current);
                logic.current!.draw(points.current)
                points.current = []
            }
        } else {
            lastDrawMode.current = currDrawMode
            points.current = []
        }
    }

    return (
        <div id="canvas-wrapper">
            <canvas id="canvas" width={1600} height={800}
                    ref={canvasRef}
                    onClick={(event) => handler(event)}
            />
        </div>
    )
}

export default CanvasComponent;