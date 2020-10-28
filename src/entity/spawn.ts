export interface SpawnEntity {
    name: string;
    energy: number;
    room: string;
    x: number;
    y: number;
}

export class MockSpawnEntity implements SpawnEntity {
    name: string;
    energy: number;
    room: string;
    x: number;
    y: number;

    constructor(name: string, energy: number, room: string, x: number, y: number) {
        this.name = name;
        this.energy = energy;
        this.room = room;
        this.x = x;
        this.y = y;
    }
}

export class ScreepsSpawnEntity implements SpawnEntity {
    name: string;
    energy: number;
    room: string;
    x: number;
    y: number;

    constructor(spawn: StructureSpawn) {
        this.name = spawn.name;
        this.energy = spawn.energy;
        this.room = spawn.room.name;
        this.x = spawn.pos.x;
        this.y = spawn.pos.y;
    }
}
