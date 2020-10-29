import { EntityNotFound, MemoryUndefined, OutOfRange } from "exception";
import { get_creep_memory } from "memory";
import { ScreepsSourceEntity, SourceEntity } from "./source";

export interface CreepEntity {
    readonly name: string;
    readonly creep: Creep;
    readonly position: Position;

    energyCarried(): number;

    harvest(source: SourceEntity): void;

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
    position: Position;

    movedTo?: Position = undefined;
    private _energyCarried?: number = 0;

    constructor(name: string, creep: any, memory: { [key: string]: any }, position: Position) {
        this.name = name;
        this.creep = creep;
        this._memory = memory;
        this.position = position;
    }

    energyCarried() {
        return this._energyCarried!;
    }

    harvest(source: SourceEntity): void {
        let dist = Math.hypot(this.position.x - source.x, this.position.y - source.y);

        if (dist < 2) {
            this._energyCarried = this._energyCarried! + 2;
        } else {
            throw new OutOfRange(`source too far from creep to harvest`);
        }
    }

    memory(key: string) {
        if (this._memory == undefined) {
            throw new MemoryUndefined(`memory ${key} not defined`);
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
    get position(): Position {
        return new Position(this.creep.pos.x, this.creep.pos.y);
    }

    constructor(name: string, creep: Creep) {
        this.name = name;
        this.creep = creep;
    }

    energyCarried() {
        return this.creep.store[RESOURCE_ENERGY];
    }

    harvest(source: ScreepsSourceEntity): void {
        let result = this.creep.harvest(source.source);
        if (result != OK) {
            throw new OutOfRange('source out of range');
        }
    }

    memory(key: string) {
        return get_creep_memory(this.creep, key);
    }

    moveTo(x: number, y: number): void {
        this.creep.moveTo(x, y);
    }
}
