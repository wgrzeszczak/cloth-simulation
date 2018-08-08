import { Vector2D } from "./math/vector";
import { Cloth } from "./cloth/cloth";
import { Renderer } from "./renderer";

export class Controller {
    private readonly view: Window;
    private readonly renderer: Renderer;
    private readonly cloth: Cloth;

    private leftMouseButtonDown: boolean;
    private rightMouseButtonDown: boolean;

    constructor(view: Window, renderer: Renderer, cloth: Cloth) {
        this.view = view;
        this.renderer = renderer;
        this.cloth = cloth;

        this.view.addEventListener("resize", () => this.resize());
        this.view.addEventListener('contextmenu', (event) => event.preventDefault());
        this.view.addEventListener('mousedown', (event) => this.mouseDown(event));
        this.view.addEventListener('mousemove', (event) => this.mouseMove(event));
        this.view.addEventListener('mouseup', (event) => this.mouseUp(event));
        this.view.addEventListener('mouseout', () => this.mouseOut());
        this.resize();   
    }

    private resize(): void {
        this.renderer.onResize(this.view.innerWidth, this.view.innerHeight);
    }

    private mouseDown(event: MouseEvent): void {
        this.mouseOut();
        const position = new Vector2D(event.x, event.y).subtract(this.renderer.getOffset());

        switch(event.button) {
        case 0:
            this.leftMouseButtonDown = true;
            this.cloth.onBeginMove(position);
            break;
        case 2:
            this.rightMouseButtonDown = true;
            this.cloth.onPin(position);
            break;
        default:
        }
    }

    private mouseMove(event: MouseEvent): void {
        const movement = new Vector2D(event.movementX, event.movementY);

        if(this.leftMouseButtonDown) {
            this.cloth.onMove(movement);
        }

        if(this.rightMouseButtonDown) {
            this.renderer.onMove(movement);
        }
    }

    private mouseUp(event: MouseEvent): void {
        const position = new Vector2D(event.x, event.y);
        switch(event.button) {
        case 0:
            this.leftMouseButtonDown = true;
            this.cloth.onEndMove(position);
            break;
        case 2:
            this.rightMouseButtonDown = false;
            break;
        default:
        }
    }

    private mouseOut(): void {
        this.leftMouseButtonDown = false;
        this.leftMouseButtonDown = false;
    }
}