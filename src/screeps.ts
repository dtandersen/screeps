import { CreepEntity, MockCreepEntity, Position, ScreepsCreepEntity } from "entity/creep";
import { MockSourceEntity, ScreepsSourceEntity, SourceEntity } from "entity/source";
import { MockSpawnEntity, ScreepsSpawnEntity, SpawnEntity } from "entity/spawn";
import { EntityNotFound } from "exception";
import { get_creep_memory, get_memory, set_memory } from "memory";
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
    creeps_with_role(name: string): CreepEntity[];
    sources(): { [name: string]: SourceEntity };
    limit(key: string, value: number): void;
    limit(key: string): number;

    spawn(name: string, memory: { [name: string]: any }): number;
    findSpawn(name: string): SpawnEntity;

    count_role(role: string): number;
}

export class MockScreepsWorld implements ScreepsWorld {
    creeps: CreepEntity[] = [];

    limits: { [key: string]: number } = {}

    spawns: { [key: string]: SpawnEntity } = {};

    _sources: { [name: string]: SourceEntity } = {};

    spawned: any = [];

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
        console.log(`${name} not found`);
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

    spawn(xname: string, memory: { [name: string]: any }): number {
        this.spawned.push({
            name: xname,
            role: memory['role'],
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
}

export class ScreepsScreepsWorld implements ScreepsWorld {
    creeps_with_role(roleName: string): CreepEntity[] {
        let results: CreepEntity[] = [];

        for (const name in Memory.creeps) {
            // let mem: CreepMemory = Memory.creeps[name];
            // let r = mem["role"];
            let r = get_creep_memory(Game.creeps[name], 'role');
            // console.log(`${roleName} ${name}==${r}?`);
            if (r == roleName) {
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
            // console.log(`sources ${source.id}`);
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

    spawn(name: string, memory: { [name: string]: any }): number {
        console.log(`spawning ${name} ${memory['role']}`);

        memory['role'] = memory['role'];
        memory['working'] = true;
        memory['room'] = Game.spawns["Spawn1"].room.name;

        let creepMemory = <CreepMemory>memory;
        return Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], name, {
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
}
