import { get_creep_memory } from "memory";
import { OperationCanceledException } from "typescript";

export interface CreepEntity {
    readonly name: string;
    readonly creep: Creep;

    memory(key: string): any;

    moveTo(x: number, y: number): void;
}

export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class MockCreepEntity implements CreepEntity {
    name: string;
    creep: Creep;
    readonly _memory?: { [key: string]: any } = {};

    movedTo?: Position = undefined;

    constructor(name: string, creep: any, memory: { [key: string]: any }) {
        this.name = name;
        this.creep = creep;
        this._memory = memory;
    }

    memory(key: string) {
        if (this._memory == undefined) {
            throw new OperationCanceledException();
        }

        return this._memory[key];
    }

    moveTo(x: number, y: number): void {
        this.movedTo = new Position(x, y);
    }
}

export class ScreepsCreepEntity implements CreepEntity {
    name: string;
    creep: Creep;

    constructor(name: string, creep: Creep) {
        this.name = name;
        this.creep = creep;
    }

    memory(key: string) {
        return get_creep_memory(this.creep, key);
    }

    moveTo(x: number, y: number): void {
        this.creep.moveTo(x, y);
    }
}
