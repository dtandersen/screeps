import { EntityNotFound, MemoryUndefined } from "exception";
import { get_creep_memory } from "memory";

export interface CreepEntity {
    readonly name: string;
    readonly creep: Creep;

    energyCarried(): number;

    harvest(sourceId: string): void;

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
    private _energyCarried?: number = 0;

    constructor(name: string, creep: any, memory: { [key: string]: any }) {
        this.name = name;
        this.creep = creep;
        this._memory = memory;
    }

    energyCarried() {
        return this._energyCarried!;
    }

    harvest(sourceId: string): void {
        this._energyCarried = this._energyCarried! + 2;
    }

    memory(key: string) {
        if (this._memory == undefined) {
            throw new MemoryUndefined();
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

    energyCarried() {
        return this.creep.store[RESOURCE_ENERGY];
    }

    harvest(sourceId: string): void {
        let source = this.creep.pos.findClosestByRange(FIND_SOURCES);
        if (source == null) {
            throw new EntityNotFound();
        }

        this.creep.harvest(source);

    }

    memory(key: string) {
        return get_creep_memory(this.creep, key);
    }

    moveTo(x: number, y: number): void {
        this.creep.moveTo(x, y);
    }
}
