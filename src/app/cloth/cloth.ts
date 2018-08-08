import { IRenderable, IRenderProperties } from "../renderer";
import { IUpdatable, IPhysicsProperties } from "../physics";
import { Vector2D } from "../math/vector";
import { ClothPoint } from "./clothPoint";
import { ClothLink } from "./clothLink";

export class Cloth implements IRenderable, IUpdatable {
    private readonly clothWidth: number;
    private readonly clothHeight: number;
    private readonly iterations: number;
    private clothPoints: Array<ClothPoint>;
    private clothLinks: Array<ClothLink>;

    private selectedClothPoint: ClothPoint;

    constructor(clothWidth: number, clothHeight: number, iterations: number) {
        this.clothWidth = clothWidth;
        this.clothHeight = clothHeight;
        this.iterations = iterations;

        this.clothPoints = [];
        this.clothLinks = [];

        this.selectedClothPoint = null;

        this.createCloth();
    }

    private createCloth(): void {
        for(let y = 0; y < this.clothHeight; y++) {
            for(let x = 0; x < this.clothWidth; x++) {              
                let dynamic = true; 

                if(y == 0 && (x == 0 || x == this.clothWidth - 1)) {
                    dynamic = false;
                }

                const clothPoint = new ClothPoint(new Vector2D((-this.clothWidth / 2 + x) * 15, (-this.clothHeight + y) * 15), dynamic);
                this.clothPoints.push(clothPoint);

                if(x > 0) {
                    this.clothLinks.push(new ClothLink(this.clothPoints[y * this.clothWidth + x - 1], clothPoint));
                }

                if(y > 0) {
                    this.clothLinks.push(new ClothLink(this.clothPoints[(y - 1) * this.clothWidth + x], clothPoint));
                }
            }
        }
    }

    onUpdate(timeStep: number, properties: IPhysicsProperties): void {
        for(let iteration = 0; iteration < this.iterations; iteration++) {
            this.clothLinks.forEach((clothLink) => clothLink.onUpdate());
        }
        
        this.clothLinks = this.clothLinks.filter((clothLink) => !clothLink.isBroken());

        this.clothPoints.forEach((clothPoint) => clothPoint.onUpdate(timeStep, properties));
    }

    onBeginMove(position: Vector2D): void {
        this.selectedClothPoint = this.findClosestClothPoint(position);

        if(this.selectedClothPoint) {
            this.selectedClothPoint.setSelected(true);
        }
    }

    onMove(movement: Vector2D): void {
        if(this.selectedClothPoint) {
            this.selectedClothPoint.setPosition(this.selectedClothPoint.getPosition().add(movement));
        }
    }

    onEndMove(position: Vector2D): void {
        if(this.selectedClothPoint) {
            this.selectedClothPoint.setSelected(false);
            this.selectedClothPoint = null;
        }
    }

    onPin(position: Vector2D): void {
        const clothPoint = this.findClosestClothPoint(position);

        if(clothPoint) {
            clothPoint.setDynamic(!clothPoint.getDynamic());
        }
    }

    onRender(context: CanvasRenderingContext2D, properties: IRenderProperties): void {
        this.clothPoints.forEach((clothPoint) => clothPoint.onRender(context, properties));

        context.beginPath();
        context.strokeStyle = "#000000";
        this.clothLinks.forEach((clothLink) => clothLink.onRender(context, properties));
        context.stroke();
    }

    private findClosestClothPoint(position: Vector2D): ClothPoint {
        let distance = -1;
        let selectedClothPoint = null;

        this.clothPoints.forEach((clothPoint) => {
            const currentDistance = clothPoint.getPosition().subtract(position).length();
            if((distance == -1 || distance > currentDistance) && currentDistance < 10) {
                distance = currentDistance;
                selectedClothPoint = clothPoint;
            }
        });

        return selectedClothPoint;
    }
}