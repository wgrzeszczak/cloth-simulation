import { Vector2D } from "../math/vector";
import { IPhysicsProperties } from "../physics";
import { IRenderProperties } from "../renderer";

export class ClothPoint {  
    private dynamic: boolean;
    private selected: boolean;
    private position: Vector2D;
    private previousPosition: Vector2D;
    
    constructor(position: Vector2D, dynamic: boolean = true) {
        this.position = position;
        this.previousPosition = position;
        this.dynamic = dynamic;
        this.selected = false;
    }

    onUpdate(timeStep: number, properties: IPhysicsProperties): void {
        if(!this.dynamic || this.selected) {
            return;
        }
        const displacement = this.position.subtract(this.previousPosition).multiply(1 - properties.friction);
        let currentPosition = this.position.add(displacement).add(new Vector2D(0, properties.g * 100 * timeStep * timeStep));

        this.previousPosition = this.position;
        this.position = currentPosition;
    }
    
    onRender(context: CanvasRenderingContext2D, properties: IRenderProperties): void {
        if(this.position.x + properties.offset.x < 0 || this.position.x + properties.offset.x > properties.viewWidth 
           && this.position.y + properties.offset.y < 0 ||  this.position.y + properties.offset.y > properties.viewHeight) {
            return;
        }

        let radius = 3;
        if(!this.dynamic) {
            radius = 4;
        }

        context.moveTo(this.position.x + properties.offset.x, this.position.y + properties.offset.y);
        context.arc(this.position.x + properties.offset.x, this.position.y + properties.offset.y, radius, 0, 2 * Math.PI);
    }

    getPosition(): Vector2D {
        return this.position;
    }

    setPosition(position: Vector2D): void {
        if(!this.dynamic && !this.selected) {
            return;
        }

        this.position = position;
        if(this.selected) {
            this.previousPosition = this.position;
        }
    }

    getDynamic(): boolean {
        return this.dynamic;
    }

    setDynamic(dynamic: boolean): void {
        this.dynamic = dynamic;
    }

    getSelected(): boolean {
        return this.selected;
    }

    setSelected(selected: boolean): void {
        this.selected = selected;
    }
}