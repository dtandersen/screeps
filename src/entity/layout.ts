export class RoomElement {
    x: number;
    y: number;
    structure: string;

    constructor(x: number, y: number, structure: string) {
        this.x = x;
        this.y = y;
        this.structure = structure;
    }
}

export class RoomLayout {
    _elements: { [key: string]: RoomElement } = {}

    constructor(
        {
            elements = {}
        }: {
            elements: {}
        }) {
        this._elements = elements;
    }

    add(x: number, y: number, structure: string) {
        this._elements[this.key(x, y)] = new RoomElement(x, y, structure);
    }

    get(x: number, y: number): RoomElement | null {
        return this._elements[this.key(x, y)];
    }

    key(x: number, y: number): string {
        return x + "," + y;
    }
}
