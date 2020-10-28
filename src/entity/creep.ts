import { timeStamp } from "console";

export abstract class CreepEntity {
    abstract memory(key: string): any;
    name: string;
    roleName: string;
    creep: Creep;
    _memory: { [key: string]: any } = {};

    constructor(name: string, roleName: string, creep: Creep) {
        this.name = name;
        this.roleName = roleName;
        this.creep = creep;
    }

    abstract moveTo(x: number, y: number): void;
}

export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class MockCreepEntity extends CreepEntity {
    movedTo?: Position = undefined;

    constructor(name: string, roleName: string, creep: any, memory: { [key: string]: any }) {
        super(name, roleName, creep);
        this._memory = memory;
    }

    memory(key: string) {
        return this._memory[key];
    }

    moveTo(x: number, y: number): void {
        this.movedTo = new Position(x, y);
    }
}

export class ScreepsCreepEntity extends CreepEntity {
    constructor(name: string, roleName: string, creep: Creep) {
        super(name, roleName, creep);
    }

    memory(key: string) {
        throw new Error("Method not implemented.");
    }

    moveTo(x: number, y: number): void {
        this.creep.moveTo(x, y);
    }
}
