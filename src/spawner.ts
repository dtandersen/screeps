import { RoleManager } from "role/rolemanager";
import { IdGenerator, ScreepsWorld, SpawnRequest } from "screeps";

export class CreepSpawner {
    roleManager: RoleManager;
    world: ScreepsWorld;
    idGenerator: IdGenerator;

    constructor(roleManager: RoleManager, screepsWorld: ScreepsWorld, idGenerator: IdGenerator) {
        this.roleManager = roleManager;
        this.world = screepsWorld;
        this.idGenerator = idGenerator;
    }

    spawn() {
        let harvesters = this.world.count_role('harvester');
        let upgraders = this.world.count_role('upgrader');

        this.world.limit('harvester', 2);
        this.world.limit('upgrader', 4);
        let spawn = this.world.findSpawn('Spawn1');

        let requests: SpawnRequest[] = this.world.memory('requests');

        if (requests != undefined && requests.length > 0) {
            let request = requests[0];
            this.world.spawn(
                request.name,
                request.body,
                request.memory);

            this.world.memory('requests', []);
        } else if (harvesters < 1) {
            this.world.spawn(
                'harvester-' + this.idGenerator.next_id(),
                ['work', 'carry', 'move'],
                {
                    role: 'harvester',
                    working: true,
                    room: spawn.room
                })
        } else if (upgraders < 10) {
            this.world.spawn(
                'upgrader-' + this.idGenerator.next_id(),
                ['work', 'carry', 'move'],
                {
                    role: 'upgrader',
                    working: true,
                    room: spawn.room
                })
        }
    }
}
