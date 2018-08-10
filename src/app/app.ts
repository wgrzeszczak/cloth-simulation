import { Renderer } from "./renderer";
import { Physics } from "./physics";
import { Cloth } from "./cloth/cloth";
import { Controller } from "./controller";

export class App {
    private readonly renderer: Renderer;
    private readonly physics: Physics;
    private readonly controller: Controller;
    private readonly cloth: Cloth;

    constructor(view: Window, canvas: HTMLCanvasElement) {       
        this.renderer = new Renderer(view, canvas);
        this.physics = new Physics;
        
        this.cloth = new Cloth(30, 25, 3);
        this.renderer.addRenderable(this.cloth);
        this.physics.addUpdatable(this.cloth);

        this.controller = new Controller(view, this.physics, this.renderer, this.cloth);
    }

    private update(): void {
        this.physics.update();
    }

    private render(): void {
        this.renderer.render();
        requestAnimationFrame(() => this.render());
    }

    public run(): void {
        setInterval(() => {
            this.update();
        }, 1 / 60 * 1000);

        requestAnimationFrame(() => this.render());
    }
}

