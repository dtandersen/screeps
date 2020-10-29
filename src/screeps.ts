import { CreepEntity, MockCreepEntity, Position, ScreepsCreepEntity } from "entity/creep";
import { MockSourceEntity, ScreepsSourceEntity, SourceEntity } from "entity/source";
import { MockSpawnEntity, ScreepsSpawnEntity, SpawnEntity } from "entity/spawn";
import { EntityNotFound } from "exception";
import { get_creep_memory, get_memory, log, set_memory } from "memory";
import { CreepSpawner } from "spawner";

export interface IdGenerator {
    next_id(): number;
}

export class RandomIdGenerator implements IdGenerator {
    next_id(): number {
        return Math.floor(Math.random() * 10000);
    };
}

export class SequentialIdGenerator implements IdGenerator {
    i: number = 1;

    next_id(): number {
        return this.i++;
    }
}

export interface ScreepsWorld {
    findCreep(name: string): CreepEntity | null;
    creeps_with_role(name: string): CreepEntity[];
    sources(): { [name: string]: SourceEntity };
    limit(key: string, value: number): void;
    limit(key: string): number;

    spawn(name: string, body: BodyPartConstant[], memory: { [name: string]: any }): number;
    findSpawn(name: string): SpawnEntity;

    count_role(role: string): number;
    memory(key: string, value: any): void;
    memory(key: string): any;
}

export class MockScreepsWorld implements ScreepsWorld {
    creeps: CreepEntity[] = [];

    limits: { [key: string]: number } = {}

    spawns: { [key: string]: SpawnEntity } = {};

    _sources: { [name: string]: SourceEntity } = {};

    spawned: any = [];

    private _memory: { [key: string]: any } = {};

    limit(key: string, value?: number): number {

        if (value === undefined) {
            return this.limits[key];
        }

        this.limits[key] = value;

        return value;
    };

    add_creep(name: string, memory: any, x: number, y: number): number {
        this.creeps.push(new MockCreepEntity(name, { memory: memory }, memory, new Position(x, y)));

        return 0;
    }

    add_source(sourceId: string, x: number, y: number) {
        this._sources[sourceId] = new MockSourceEntity(x, y);
    }

    add_spawn(name: string, energy: number, room: string, x: number, y: number) {
        this.spawns[name] = new MockSpawnEntity(
            name,
            energy,
            room,
            x,
            y
        );
    }

    findCreep(name: string): CreepEntity {
        for (let creep of this.creeps) {
            let r = creep.name;
            if (r === name) {
                return creep;
            }
        }

        throw new EntityNotFound(`creep ${name} not found`);
    }

    creeps_with_role(name: string): CreepEntity[] {
        let results = [];

        for (let creep of this.creeps) {
            let r = creep.memory('role');
            if (r === name) {
                results.push(creep);
            }
        }

        return results; //.map(creepEntity => creepEntity.creep);
    }

    findSpawn(name: string) {
        return this.spawns[name];
    }

    sources(): { [name: string]: SourceEntity; } {
        return this._sources;
    }

    spawn(name: string, body: BodyPartConstant[], memory: { [name: string]: any }): number {
        this.spawned.push({
            name: name,
            body: body,
            memory: memory
        });

        return 0;
    }

    count_role(role: string): number {
        let results = [];

        for (let creep of this.creeps) {
            let r = creep.memory('role');
            if (r === role) {
                results.push(creep);
            }
        }

        return results.length;
    }

    memory(key: string, value?: any) {
        if (value == undefined) {
            return this._memory[key];
        } else {
            this._memory[key] = value;
        }
    }
}

export class ScreepsScreepsWorld implements ScreepsWorld {
    findCreep(name: string): CreepEntity | null {
        let creep = Game.creeps[name];
        if (creep == null) {
            throw new EntityNotFound(`creep ${name} not found`);
        }

        return new ScreepsCreepEntity(name, Game.creeps[name]);
    }

    creeps_with_role(role: string): CreepEntity[] {
        let results: CreepEntity[] = [];

        for (const name in Memory.creeps) {
            let creepRole = get_creep_memory(Game.creeps[name], 'role');
            if (creepRole == role) {
                let entity = new ScreepsCreepEntity(name, Game.creeps[name]);
                results.push(entity);
            }
        }

        return results;
    }

    sources(): { [name: string]: SourceEntity; } {
        let spawn = Game.spawns['Spawn1'];
        let room = spawn.room;
        let sources: Source[] = <Source[]>room.find(FIND_SOURCES);

        let results: { [name: string]: SourceEntity } = {};

        for (let source of sources) {
            results[source.id] = new ScreepsSourceEntity(source);
        }

        return results;
    }

    limit(key: string, value?: number): number {
        if (value === undefined) {
            return get_memory(key);
        }

        set_memory(key, value);

        return value;
    };

    spawn(name: string, body: BodyPartConstant[], memory: { [name: string]: any }): number {
        log(`spawning ${name} ${memory['role']}`);

        memory['role'] = memory['role'];
        memory['working'] = true;
        memory['room'] = Game.spawns["Spawn1"].room.name;

        let creepMemory = <CreepMemory>memory;
        return Game.spawns["Spawn1"].spawnCreep(body, name, {
            memory: creepMemory,
            dryRun: false
        });
    }

    findSpawn(name: string): SpawnEntity {
        let spawn = Game.spawns[name];
        return new ScreepsSpawnEntity(spawn);
    }

    count_role(role: string): number {
        let results: Creep[] = [];

        for (const name in Memory.creeps) {
            let mem: CreepMemory = Memory.creeps[name];
            let r = mem["role"];
            if (r === role) {
                results.push(Game.creeps[name]);
            }
        }

        return results.length;
    }

    memory(key: string, value?: any) {
        if (value == undefined) {
            return get_memory(key);
        } else {
            set_memory(key, value);
        }
    }
}

export class SpawnRequest {
    name: string;
    body: BodyPartConstant[];
    memory: {};
    priority: number;

    constructor({ name, body, memory, priority }: { name: string, body: BodyPartConstant[], memory: {}, priority: number }) {
        this.name = name;
        this.body = body;
        this.memory = memory;
        this.priority = priority;
    }
}
