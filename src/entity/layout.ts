export class RoomElement {
    structure: string;

    constructor(structure: string) {
        this.structure = structure;
    }
}

export class RoomLayout {
    _elements: { [key: string]: RoomElement } = {}

    add(x: number, y: number, structure: string) {
        console.log(`${this.key(x, y)} => ${structure}`);
        this._elements[this.key(x, y)] = new RoomElement(structure);
    }

    get(x: number, y: number): RoomElement | null {
        console.log(`get ${this.key(x, y)}`);
        return this._elements[this.key(x, y)];
    }

    key(x: number, y: number): string {
        return x + "," + y;
    }
}
