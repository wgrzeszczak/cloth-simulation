import { Vector2D } from "../math/vector";
import { ClothPoint } from "./clothPoint";
import { IRenderProperties } from "../renderer";

export class ClothLink {
    private readonly pointA: ClothPoint;
    private readonly pointB: ClothPoint;

    private readonly restingDistance: number;
    private readonly tearDistance: number;
    private broken: boolean;

    constructor(pointA: ClothPoint, pointB: ClothPoint) {
        this.pointA = pointA;
        this.pointB = pointB;

        this.restingDistance = 20;
        this.tearDistance = 180;
        this.broken = false;
    }

    onUpdate(): void {
        const displacement = this.pointA.getPosition().subtract(this.pointB.getPosition());
        const distance = displacement.length();

        if(distance > this.tearDistance) {
            this.broken = true;
            return;
        }

        const difference = (this.restingDistance - distance) / distance;        
        const translation = new Vector2D(displacement.x * 0.5 * difference, displacement.y * 0.5 * difference);

        if(!this.pointA.getSelected()) {
            this.pointA.setPosition(this.pointA.getPosition().add(translation));
        }

        if(!this.pointB.getSelected()) {
            this.pointB.setPosition(this.pointB.getPosition().add(translation.multiply(-1)));
        }
    }

    onRender(context: CanvasRenderingContext2D, properties: IRenderProperties): void {
        const from = this.pointA.getPosition().add(properties.offset);
        const to = this.pointB.getPosition().add(properties.offset);

        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
    }

    isBroken(): boolean {
        return this.broken;
    }
}
