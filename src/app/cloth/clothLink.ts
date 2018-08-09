import { Vector2D } from "../math/vector";
import { ClothPoint } from "./clothPoint";
import { IRenderProperties } from "../renderer";

export class ClothLink {
    private readonly pointA: ClothPoint;
    private readonly pointB: ClothPoint;

    private readonly restingDistance: number;
    private readonly tearDistance: number;
    private broken: boolean;
    private readonly fromColor: string;
    private readonly toColor: string;

    constructor(pointA: ClothPoint, pointB: ClothPoint) {
        this.pointA = pointA;
        this.pointB = pointB;

        this.restingDistance = 20;
        this.tearDistance = 150;
        this.broken = false;
        this.fromColor = "00FF00";
        this.toColor = "FF0000";
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

    onRender(context: CanvasRenderingContext2D, properties: IRenderProperties, drawForces: boolean): void {
        const from = this.pointA.getPosition().add(properties.offset);
        const to = this.pointB.getPosition().add(properties.offset);

        const displacement = this.pointA.getPosition().subtract(this.pointB.getPosition());
        const distance = displacement.length();
        const ratio = Math.min(this.restingDistance / distance, 1);

        context.beginPath();
        if(drawForces) {
            context.strokeStyle = `#${this.interpolateColor(ratio)}`;
        }
        else {
            context.strokeStyle = '#000000';
        }
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();
    }

    isBroken(): boolean {
        return this.broken;
    }

    private interpolateColor(ratio: number): string {      
        const red = Math.ceil(parseInt(this.fromColor.substring(0, 2), 16) * ratio + parseInt(this.toColor.substring(0, 2), 16) * (1 - ratio));
        const green = Math.ceil(parseInt(this.fromColor.substring(2, 4), 16) * ratio + parseInt(this.toColor.substring(2, 4), 16) * (1 - ratio));
        const blue = Math.ceil(parseInt(this.fromColor.substring(4, 6), 16) * ratio + parseInt(this.toColor.substring(4, 6), 16) * (1 - ratio));
        
        return this.toHex(red) + this.toHex(green) + this.toHex(blue);
    }

    private toHex(value: number): string {
        const result = value.toString(16);
        if(result.length == 1) {
            return `0${result}`;
        }
        return result;
    };
    
}
