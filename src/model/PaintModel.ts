

export class Point {
    public constructor(
        public x:number,
        public y:number
    ) {}
}

export class DrawContext {
    public constructor(
        public color: string,
        public thickness: number,
        public mode: DrawMode = DrawMode.Empty,
    ) {}
}

export enum DrawMode {
    Dot = 'dot',
    Line = 'line',
    Circle = 'circle',
    Rectangle = 'rectangle',
    Polygon = 'polygon',
    Fill = 'fill',
    Text = 'text',
    Empty = 'empty',
}
