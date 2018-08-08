import { Vector2D } from "./math/vector";

export interface IPhysicsProperties {
    g: number;
    friction: number;
}

export interface IUpdatable {
    onUpdate(timeStep: number, properties: IPhysicsProperties): void;
    onBeginMove(position: Vector2D): void;
    onMove(movement: Vector2D): void
    onEndMove(position: Vector2D): void;
}

export class Physics {
    private updatables: Array<IUpdatable>;
    private g: number;
    private friction: number;
    
    constructor() {
        this.g = 9.81;
        this.friction = 0.015;
        this.updatables = [];
    }

    addUpdatable(updatable: IUpdatable) {
        this.updatables.push(updatable);
    }

    onUpdate(timeStep: number) {
        const properties = {
            g: this.g,
            friction: this.friction
        }
        this.updatables.forEach((updatable) => {
            updatable.onUpdate(timeStep, properties);
        })
    }
}