import { Renderer } from "./renderer";
import { Physics } from "./physics";
import { Cloth } from "./cloth/cloth";
import { Controller } from "./controller";

export class App {
    private readonly renderer: Renderer;
    private readonly physics: Physics;
    private readonly controller: Controller;
    private readonly cloth: Cloth;
    
    private lastUpdate: number;
    private remainingElapsedTime: number;

    constructor(view: Window, canvas: HTMLCanvasElement) {
        this.lastUpdate = new Date().getTime();
        this.remainingElapsedTime = 0;
        
        this.renderer = new Renderer(view, canvas);
        this.physics = new Physics;
        
        this.cloth = new Cloth(30, 25, 3);
        this.renderer.addRenderable(this.cloth);
        this.physics.addUpdatable(this.cloth);

        this.controller = new Controller(view, this.renderer, this.cloth);
    }

    private update(timeStep: number): void {
        this.physics.onUpdate(timeStep);
    }

    private render(): void {
        this.renderer.onRender();
        requestAnimationFrame(() => this.render());
    }

    public run(): void {
        const timeStep = 1.0 / 60.0;

        setInterval(() => {
            const now = new Date().getTime();
            let elapsedTime = (now - this.lastUpdate) / 1000.0 + this.remainingElapsedTime;
            this.lastUpdate = now;

            while(elapsedTime >= timeStep) {
                this.update(timeStep);
                elapsedTime -= timeStep;
            }
            this.remainingElapsedTime = elapsedTime;
        }, timeStep * 1000);

        requestAnimationFrame(() => this.render());
    }
}

