import { CreepEntity, MockCreepEntity, ScreepsCreepEntity } from "entity/creep";
import { EntityNotFound } from "exception";
import { get_memory, set_memory } from "memory";
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
    sources(): { [name: string]: any };
    limit(key: string, value: number): void;
    limit(key: string): number;

    spawn(name: string, roleName: string): number;

    count_role(role: string): number;
}

export class MockScreepsWorld implements ScreepsWorld {
    creeps: CreepEntity[] = [];

    limits: { [key: string]: number } = {}

    spawns: { [key: string]: any } = {};

    _sources: { [name: string]: any } = {};

    spawned: any = [];

    limit(key: string, value?: number): number {

        if (value === undefined) {
            return this.limits[key];
        }

        this.limits[key] = value;

        return value;
    };

    add_creep(name: string, roleName: string, memory?: any): number {
        if (memory == undefined) {
            this.creeps.push(new MockCreepEntity(name, { memory: { role: roleName } }, { role: roleName }));
        } else {
            this.creeps.push(new MockCreepEntity(name, { memory: memory }, memory));
        }

        return 0;
    }

    add_source(sourceId: string, x?: number, y?: number) {
        this._sources[sourceId] = { x: x, y: y };
    }

    add_spawn(name: string, energy: number) {
        this.spawns[name] = {
            name: name,
            energy: energy
        };
    }

    findCreep(name: string): CreepEntity {
        for (let creep of this.creeps) {
            let r = creep.name;
            if (r === name) {
                return creep;
            }
        }
        console.log(`${name} not found`);
        throw new EntityNotFound();
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

    sources(): { [name: string]: any; } {
        return this._sources;
    }

    spawn(xname: string, roleName: string): number {
        this.spawned.push({
            name: xname,
            role: roleName
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
    creeps_with_role(name: string): CreepEntity[] {
        let results: CreepEntity[] = [];

        for (const name in Memory.creeps) {
            let mem: CreepMemory = Memory.creeps[name];
            let r = mem["role"];
            if (r === name) {
                let entity = new ScreepsCreepEntity(name, Game.creeps[name]);
                results.push(entity);
            }
        }

        return results;
    }

    sources(): { [name: string]: any; } {
        let spawn = Game.spawns['Spawn1'];
        let room = spawn.room;
        let sources = room.find(FIND_SOURCES);
        return sources;
    }
    limit(key: string, value?: number): number {
        if (value === undefined) {
            return get_memory(key);
        }

        set_memory(key, value);

        return value;
    };

    spawn(name: string, roleName: string): number {
        console.log(`spawning ${name} ${roleName}`);

        return Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], name, {
            memory: { role: roleName, working: true, room: Game.spawns["Spawn1"].room.name },
            dryRun: false
        });
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
