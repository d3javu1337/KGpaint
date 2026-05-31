import {DrawContext, DrawMode, Point} from "../model/PaintModel";
import {ChangeEvent} from "react";
import ImageService from "../service/ImageService";

export interface ILogic {
    drawDot(point: Point): void;

    drawLine(start: Point, end: Point): void;

    drawCircle(center: Point, radius: Point): void;

    drawRectangle(diagStart: Point, diagEnd: Point): void;

    drawPolygon(points: Array<Point>): void;

    drawText(at: Point): void;

    fill(startPoint: Point): void;

    setColor(color: string): void;

    clear(): void;

    setThickness(thickness: number): void;

    save(): void;

    saveByPresigned(): Promise<void>

    load(e: ChangeEvent<HTMLInputElement>): void;

    loadBlob(blob: Blob): void

    getDrawContext(): DrawContext;

    setDrawContext(drawContext: DrawContext): void;

    setDrawMode(mode: DrawMode): void;

    validatePointsForDrawMode(points: Array<Point>): boolean;

    draw(points: Array<Point>): void;
}

class Logic implements ILogic {
    private drawContext: DrawContext;

    public constructor(
        private readonly canvas: HTMLCanvasElement,
    ) {
        this.drawContext = new DrawContext("#000000", 1);
    }

    private transformCoords(points: Array<Point>): Array<Point> {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return points.map((point) => new Point(
            Math.floor((point.x - rect.left) * scaleX),
            Math.floor((point.y - rect.top) * scaleY)
        ))
    }

    drawDot(point: Point): void {
        const context = this.canvas.getContext('2d')
        point = this.transformCoords([point]).shift()!

        context!.fillStyle = this.drawContext.color;
        context?.fillRect(point.x, point.y, this.drawContext.thickness, this.drawContext.thickness);
    }

    clear(): void {
        const context = this.canvas.getContext('2d')
        context!.fillStyle = "#FFF";
        context?.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawCircle(center: Point, radius: Point): void {
        // xc = Math.floor(xc); yc = Math.floor(yc); r = Math.floor(r);
        let r = Math.floor(Math.sqrt(Math.pow(center.x - radius.x, 2) + Math.pow(center.y - radius.y, 2)));
        let x = 0;
        let y = r;
        let d = 3 - 2 * r;

        while (x <= y) {
            this.drawDot(new Point(center.x + x, center.y + y));
            this.drawDot(new Point(center.x - x, center.y + y));
            this.drawDot(new Point(center.x + x, center.y - y));
            this.drawDot(new Point(center.x - x, center.y - y));
            this.drawDot(new Point(center.x + y, center.y + x));
            this.drawDot(new Point(center.x - y, center.y + x));
            this.drawDot(new Point(center.x + y, center.y - x));
            this.drawDot(new Point(center.x - y, center.y - x));

            if (d < 0) {
                d = d + 4 * x + 6;
            } else {
                d = d + 4 * (x - y) + 10;
                y--;
            }
            x++;
        }
    }

    drawLine(start: Point, end: Point): void {

        let x1 = Math.floor(start.x);
        let y1 = Math.floor(start.y);
        let x2 = Math.floor(end.x);
        let y2 = Math.floor(end.y);

        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);
        let sx = x1 < x2 ? 1 : -1;
        let sy = y1 < y2 ? 1 : -1;
        let err = dx - dy;

        while (true) {
            this.drawDot(new Point(x1, y1));
            if (x1 === x2 && y1 === y2) break;
            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
        }
    }

    drawPolygon(points: Array<Point>): void {
        points.push(points[0])
        for (let i = 0; i < points.length - 1; i++) {
            this.drawLine(points[i], points[i + 1]);
        }
    }

    drawRectangle(diagStart: Point, diagEnd: Point): void {
        const antiDiagStart = new Point(diagStart.x, diagEnd.y);
        const antiDiagEnd = new Point(diagEnd.x, diagStart.y);
        this.drawLine(diagStart, antiDiagEnd);
        this.drawLine(diagStart, antiDiagStart);
        this.drawLine(diagEnd, antiDiagEnd);
        this.drawLine(diagEnd, antiDiagStart);
    }

    fill(startPoint: Point): void {
        startPoint = this.transformCoords([startPoint]).shift()!;
        const canvas = this.canvas;
        const context = this.canvas.getContext('2d')!
        const imageData = context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        const r = parseInt(this.drawContext.color.slice(1, 3), 16);
        const g = parseInt(this.drawContext.color.slice(3, 5), 16);
        const b = parseInt(this.drawContext.color.slice(5, 7), 16);

        function getIndex(x: number, y: number): number {
            return (y * canvas.width + x) * 4;
        }

        const startIdx = getIndex(startPoint.x, startPoint.y);
        const targetR = data[startIdx];
        const targetG = data[startIdx + 1];
        const targetB = data[startIdx + 2];
        const targetA = data[startIdx + 3];

        if (targetR === r && targetG === g && targetB === b && targetA === 255) return;

        const stack = [[startPoint.x, startPoint.y]];

        while (stack.length) {
            const [x, y] = stack.pop()!;
            if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;

            const idx = getIndex(x, y);
            if (data[idx] === targetR && data[idx + 1] === targetG && data[idx + 2] === targetB && data[idx + 3] === targetA) {
                data[idx] = r;
                data[idx + 1] = g;
                data[idx + 2] = b;
                data[idx + 3] = 255;

                stack.push([x + 1, y]);
                stack.push([x - 1, y]);
                stack.push([x, y + 1]);
                stack.push([x, y - 1]);
            }
        }

        context.putImageData(imageData, 0, 0);
    }

    drawText(at: Point): void {
        at = this.transformCoords([at]).shift()!
        const text = prompt("Введите текст") || ""
        const context = this.canvas.getContext('2d')!
        context.font = `${this.drawContext.thickness * 4}px 'Segoe UI', 'Arial', sans-serif`
        context.fillStyle = this.drawContext.color
        context.fillText(text, at.x, at.y)
    }

    validatePointsForDrawMode(points: Array<Point>): boolean {
        switch (this.drawContext.mode) {
            case DrawMode.Empty: {
                return false
            }
            case DrawMode.Circle: {
                return points.length === 2;
            }
            case DrawMode.Rectangle: {
                return points.length === 2;
            }
            case DrawMode.Dot: {
                return points.length === 1;
            }
            case DrawMode.Line: {
                return points.length === 2;
            }
            case DrawMode.Polygon: {
                return points.length > 10;
            }
            case DrawMode.Fill: {
                return points.length === 1;
            }
            case DrawMode.Text: {
                return points.length === 1;
            }
            default: {
                return false
            }
        }
    }

    draw(points: Array<Point>): void {
        switch (this.drawContext.mode) {
            case DrawMode.Circle: {
                return this.drawCircle(points[0], points[1]);
            }
            case DrawMode.Rectangle: {
                return this.drawRectangle(points[0], points[1]);
            }
            case DrawMode.Dot: {
                return this.drawDot(points[0]);
            }
            case DrawMode.Line: {
                return this.drawLine(points[0], points[1]);
            }
            case DrawMode.Polygon: {
                return this.drawPolygon(points);
            }
            case DrawMode.Fill: {
                return this.fill(points[0]);
            }
            case DrawMode.Text: {
                return this.drawText(points[0]);
            }
            default: {
                return
            }

        }
    }

    setColor(color: string): void {
        this.drawContext.color = color;
    }

    setThickness(thickness: number): void {
        this.drawContext.thickness = thickness;
    }

    getDrawContext(): DrawContext {
        return this.drawContext;
    }

    setDrawContext(drawContext: DrawContext): void {
        this.drawContext = drawContext;
    }

    setDrawMode(mode: DrawMode): void {
        this.drawContext.mode = mode;
        console.log(this.drawContext);
    }

    load(e: ChangeEvent<HTMLInputElement>): void {
        const file = e.target.files![0]!;
        if (!file) return;

        const img = new Image();

        img.onload = () => {
            const ctx = this.canvas?.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
            ctx.drawImage(img, 0, 0, this.canvas!.width, this.canvas!.height);
        };

        img.src = URL.createObjectURL(file);
        e.target.value = '';
    }

    loadBlob(blob: Blob): void {
        const objectUrl = URL.createObjectURL(blob);
        const img = new Image();

        img.crossOrigin = 'anonymous';

        img.onload = () => {
            const ctx = this.canvas?.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
            ctx.drawImage(img, 0, 0, this.canvas!.width, this.canvas!.height);
            URL.revokeObjectURL(objectUrl);
        };

        img.src = objectUrl
    }

    save(): void {
        const link = document.createElement('a');
        link.download = 'image.png';
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }

    async saveByPresigned(): Promise<void> {
        const pres = await ImageService
            .saveImage()
        const blob = await new Promise<Blob>((resolve, reject) => {
            this.canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Canvas toBlob failed'));
            }, 'image/png');
        });
        await ImageService.putImage(pres.data.presigned, blob)
    }

}

export const instance: (canvas: HTMLCanvasElement,) => ILogic =
    (canvas: HTMLCanvasElement) => {
        return new Logic(canvas)
    }
