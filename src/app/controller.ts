import { Vector2D } from "./math/vector";
import { Cloth } from "./cloth/cloth";
import { Renderer } from "./renderer";
import { Physics } from "./physics";

export class Controller {
    private readonly view: Window;
    private readonly physics: Physics;
    private readonly renderer: Renderer;
    private readonly cloth: Cloth;

    private leftMouseButtonDown: boolean;
    private rightMouseButtonDown: boolean;

    constructor(view: Window, physics: Physics, renderer: Renderer, cloth: Cloth) {
        this.view = view;
        this.physics = physics;
        this.renderer = renderer;
        this.cloth = cloth;

        this.view.addEventListener("focus", () => this.focus());
        this.view.addEventListener("resize", () => this.resize());
        this.view.addEventListener('contextmenu', (event) => event.preventDefault());
        this.view.addEventListener('mousedown', (event) => this.mouseDown(event));
        this.view.addEventListener('mousemove', (event) => this.mouseMove(event));
        this.view.addEventListener('mouseup', (event) => this.mouseUp(event));
        this.view.addEventListener('mouseout', () => this.mouseOut());
        this.view.addEventListener('keydown', (event) => this.keyDown(event));
        this.resize();   
    }

    private focus() {
        this.physics.reset();
    }

    private resize(): void {
        this.renderer.resize(this.view.innerWidth, this.view.innerHeight);
    }

    private mouseDown(event: MouseEvent): void {
        this.mouseOut();
        const position = new Vector2D(event.x, event.y).subtract(this.renderer.getOffset());

        switch(event.button) {
        case 0:
            this.leftMouseButtonDown = true;
            this.cloth.beginMove(position);
            break;
        case 2:
            this.rightMouseButtonDown = true;
            this.cloth.pin(position);
            break;
        default:
        }
    }

    private mouseMove(event: MouseEvent): void {
        const movement = new Vector2D(event.movementX, event.movementY);

        if(this.leftMouseButtonDown) {
            this.cloth.move(movement);
        }

        if(this.rightMouseButtonDown) {
            this.renderer.move(movement);
        }
    }

    private mouseUp(event: MouseEvent): void {
        const position = new Vector2D(event.x, event.y);
        switch(event.button) {
        case 0:
            this.leftMouseButtonDown = true;
            this.cloth.endMove(position);
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

    private keyDown(event: KeyboardEvent): void {
        switch(event.key) {
            case 'g':
            this.cloth.toggleForces();
        }
    }
}