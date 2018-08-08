export class Vector2D {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    add(vector: Vector2D): Vector2D {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector: Vector2D): Vector2D {
        return new Vector2D(this.x - vector.x, this.y - vector.y);
    }

    multiply(constant: number): Vector2D {
        return new Vector2D(this.x * constant, this.y * constant);
    }

    divide(constant: number): Vector2D {
        return new Vector2D(this.x / constant, this.y / constant);
    }

    length(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    normalize(): Vector2D {
        const length = this.length();
        return new Vector2D(this.x /= length, this.y /= length);
    }
}