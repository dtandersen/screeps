import { RoleManager } from "role/rolemanager";
import { IdGenerator, ScreepsWorld } from "screeps";

export class CreepSpawner {
    roleManager: RoleManager;
    screepsWorld: ScreepsWorld;
    idGenerator: IdGenerator;

    constructor(roleManager: RoleManager, screepsWorld: ScreepsWorld, idGenerator: IdGenerator) {
        this.roleManager = roleManager;
        this.screepsWorld = screepsWorld;
        this.idGenerator = idGenerator;
    }

    spawn() {
        let harvesters = this.screepsWorld.count_role('harvester');
        let upgraders = this.screepsWorld.count_role('upgrader');

        this.screepsWorld.limit('harvester', 2);
        this.screepsWorld.limit('upgrader', 4);
        let spawn = this.screepsWorld.findSpawn('Spawn1');

        if (harvesters < 1) {
            this.screepsWorld.spawn('harvester-' + this.idGenerator.next_id(), {
                role: 'harvester',
                working: true,
                room: spawn.room
            })
        } else if (upgraders < 4) {
            this.screepsWorld.spawn('upgrader-' + this.idGenerator.next_id(), {
                role: 'upgrader',
                working: true,
                room: spawn.room
            })
        }
    }
}
