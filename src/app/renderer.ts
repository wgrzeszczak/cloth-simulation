import { Vector2D } from "./math/vector";

export interface IRenderProperties {
    viewWidth: number;
    viewHeight: number;
    offset: Vector2D;
}

export interface IRenderable {
    render(context: CanvasRenderingContext2D, properties: IRenderProperties): void;
}

export class Renderer {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;

    private viewWidth: number;
    private viewHeight: number;
    private offset: Vector2D;
    private renderables: Array<IRenderable>;

    constructor(view: Window, canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.renderables = [];

        this.viewWidth = view.innerWidth;
        this.viewHeight = view.innerHeight;
        this.offset = new Vector2D(this.viewWidth / 2, this.viewHeight / 2);
    }

    addRenderable(renderable: IRenderable): void {
        this.renderables.push(renderable);
    }

    render() {
        const properties = {
            viewWidth: this.viewWidth,
            viewHeight: this.viewHeight,
            offset: this.offset
        }

        this.context.clearRect(0, 0, this.viewWidth, this.viewHeight);
        this.renderables.forEach((renderable) => {
            renderable.render(this.context, properties);
        })
    }

    resize(viewWidth: number, viewHeight: number) {
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
        this.canvas.width = this.viewWidth;
        this.canvas.height = this.viewHeight;
    }

    move(movement: Vector2D): void {
        this.offset = this.offset.add(movement);
    }

    getOffset(): Vector2D {
        return this.offset;
    }
}