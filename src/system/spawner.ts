import { RoleManager } from "gateway/role.manager";
import { IdGenerator, ScreepsWorld, SpawnRequest } from "gateway/screeps";
import { System } from "system/system.runner";

export class CreepSpawner implements System {
    roleManager: RoleManager;
    world: ScreepsWorld;
    idGenerator: IdGenerator;

    constructor(roleManager: RoleManager, screepsWorld: ScreepsWorld, idGenerator: IdGenerator) {
        this.roleManager = roleManager;
        this.world = screepsWorld;
        this.idGenerator = idGenerator;
    }

    run() {
        let requests: SpawnRequest[] = this.world.memory('requests');

        if (requests != undefined && requests.length > 0) {
            let request = requests[0];
            for (let req of requests) {
                if (req.priority > request.priority) {
                    request = req;
                }
            }
            this.world.spawn(
                request.name,
                request.body,
                request.memory);

            this.world.memory('requests', []);
        }
    }
}
