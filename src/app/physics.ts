import { Vector2D } from "./math/vector";

export interface IPhysicsProperties {
    g: number;
    friction: number;
}

export interface IUpdatable {
    update(timeStep: number, properties: IPhysicsProperties): void;
    beginMove(position: Vector2D): void;
    move(movement: Vector2D): void
    endMove(position: Vector2D): void;
}

export class Physics {
    private updatables: Array<IUpdatable>;
    private g: number;
    private friction: number;

    private lastUpdate: number;
    private remainingElapsedTime: number;
    
    constructor() {
        this.g = 9.81;
        this.friction = 0.015;
        this.updatables = [];

        this.lastUpdate = new Date().getTime();
        this.remainingElapsedTime = 0;
    }

    addUpdatable(updatable: IUpdatable) {
        this.updatables.push(updatable);
    }

    update() {
        const properties = {
            g: this.g,
            friction: this.friction
        }

        const now = new Date().getTime();
        const timeStep = 1.0 / 60.0;
        let elapsedTime = (now - this.lastUpdate) / 1000.0 + this.remainingElapsedTime;
        this.lastUpdate = now;

        while(elapsedTime >= timeStep) {
            this.updatables.forEach((updatable) => {
                updatable.update(timeStep, properties);
            })
            elapsedTime -= timeStep;
        }
        this.remainingElapsedTime = elapsedTime;
    }

    reset(): void {
        this.lastUpdate = new Date().getTime();
    }
}