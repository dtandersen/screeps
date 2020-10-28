export interface SourceEntity {
    x: number;
    y: number;
}


export class MockSourceEntity implements SourceEntity {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class ScreepsSourceEntity implements SourceEntity {
    x: number;
    y: number;

    constructor(source: Source) {
        this.x = source.pos.x;
        this.y = source.pos.y;
    }
}
