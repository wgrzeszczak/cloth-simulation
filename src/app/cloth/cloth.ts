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
    private drawForces: boolean;

    private selectedClothPoint: ClothPoint;
    private readonly pointDynamicColor: string;
    private readonly pointStaticColor: string;
    private readonly linkFromColor: string;
    private readonly linkToColor: string;
    private readonly linkColorsLength: number;
    private readonly linkColors: Array<string>;
    private readonly maxPointMouseDistance: number;

    constructor(clothWidth: number, clothHeight: number, iterations: number) {
        this.clothWidth = clothWidth;
        this.clothHeight = clothHeight;
        this.iterations = iterations;
        
        this.clothPoints = [];
        this.clothLinks = [];
        this.drawForces = false;

        this.pointDynamicColor = "#000000";
        this.pointStaticColor = "#FF0000";
        this.linkFromColor = "00FF00";
        this.linkToColor = "FF0000";
        this.linkColorsLength = 10;
        this.linkColors = [];

        this.maxPointMouseDistance = 15;

        for(let color = 1; color <= this.linkColorsLength; color++) {
            this.linkColors.push(`#${this.interpolateColor(color / this.linkColorsLength)}`);
        }

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

    update(timeStep: number, properties: IPhysicsProperties): void {
        for(let iteration = 0; iteration < this.iterations; iteration++) {
            this.clothLinks.forEach((clothLink) => clothLink.onUpdate());
        }
        
        this.clothLinks = this.clothLinks.filter((clothLink) => !clothLink.isBroken());

        this.clothPoints.forEach((clothPoint) => clothPoint.onUpdate(timeStep, properties));
    }

    beginMove(position: Vector2D): void {
        this.selectedClothPoint = this.findClosestClothPoint(position);

        if(this.selectedClothPoint) {
            this.selectedClothPoint.setSelected(true);
        }
    }

    move(movement: Vector2D): void {
        if(this.selectedClothPoint) {
            this.selectedClothPoint.setPosition(this.selectedClothPoint.getPosition().add(movement));
        }
    }

    endMove(position: Vector2D): void {
        if(this.selectedClothPoint) {
            this.selectedClothPoint.setSelected(false);
            this.selectedClothPoint = null;
        }
    }

    pin(position: Vector2D): void {
        const clothPoint = this.findClosestClothPoint(position);

        if(clothPoint) {
            clothPoint.setDynamic(!clothPoint.getDynamic());
        }
    }

    render(context: CanvasRenderingContext2D, properties: IRenderProperties): void {
        this.renderStaticPoints(context, properties);
        this.renderDynamicPoints(context, properties);
        this.renderLinks(context, properties);
    }

    private renderStaticPoints(context: CanvasRenderingContext2D, properties: IRenderProperties): void {
        context.beginPath();
        context.fillStyle = this.pointStaticColor;
        context.strokeStyle = this.pointStaticColor;
        this.clothPoints.forEach((clothPoint) => {
            if(!clothPoint.getDynamic()) { 
                clothPoint.onRender(context, properties); 
            } 
        });
        context.stroke();
        context.fill();
    }

    private renderDynamicPoints(context: CanvasRenderingContext2D, properties: IRenderProperties): void {
        context.beginPath();
        context.fillStyle = this.pointDynamicColor;
        context.strokeStyle = this.pointDynamicColor;
        this.clothPoints.forEach((clothPoint) => {
            if(clothPoint.getDynamic()) { 
                clothPoint.onRender(context, properties); 
            } 
        });
        context.stroke();
    }

    private renderLinks(context: CanvasRenderingContext2D, properties: IRenderProperties): void {
        if(this.drawForces) {
            for(let color = 1; color <= this.linkColors.length; color += 1) {
                context.beginPath();
                context.strokeStyle = this.linkColors[color];
                const to = 1 / this.linkColors.length * color;
                const from = to - 1 / this.linkColors.length;
        
                this.clothLinks.forEach((clothLink) => {
                    const ratio = clothLink.getLinkRatio()
                    if(ratio >= from && ratio <= to) {
                        clothLink.onRender(context, properties);
                    }
                });
                context.stroke();
            }
        }
        else {
            context.beginPath();
            this.clothLinks.forEach((clothLink) => {
                clothLink.onRender(context, properties);
            });
            context.stroke();
        }
    }

    private findClosestClothPoint(position: Vector2D): ClothPoint {
        let distance = -1;
        let selectedClothPoint = null;

        this.clothPoints.forEach((clothPoint) => {
            const currentDistance = clothPoint.getPosition().subtract(position).length();
            if((distance == -1 || distance > currentDistance) && currentDistance < this.maxPointMouseDistance) {
                distance = currentDistance;
                selectedClothPoint = clothPoint;
            }
        });

        return selectedClothPoint;
    }

    private interpolateColor(ratio: number): string {      
        const red = Math.ceil(parseInt(this.linkFromColor.substring(0, 2), 16) * ratio + parseInt(this.linkToColor.substring(0, 2), 16) * (1 - ratio));
        const green = Math.ceil(parseInt(this.linkFromColor.substring(2, 4), 16) * ratio + parseInt(this.linkToColor.substring(2, 4), 16) * (1 - ratio));
        const blue = Math.ceil(parseInt(this.linkFromColor.substring(4, 6), 16) * ratio + parseInt(this.linkToColor.substring(4, 6), 16) * (1 - ratio));
        
        return this.toHex(red) + this.toHex(green) + this.toHex(blue);
    }

    private toHex(value: number): string {
        const result = value.toString(16);
        if(result.length == 1) {
            return `0${result}`;
        }
        return result;
    };

    toggleForces(): void {
        this.drawForces = !this.drawForces;
    }
}