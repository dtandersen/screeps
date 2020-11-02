import { log } from "gateway/memory";
import { ScreepsWorld } from "gateway/screeps";
import { ScreepRoleContext as ScreepsRoleContext } from "../role/role";
import { RoleManager } from "../gateway/role.manager";
import { System } from "system/system.runner";

export class RoleRunner implements System {
    world: ScreepsWorld;
    roleManager: RoleManager;

    constructor(world: ScreepsWorld, roleManager: RoleManager) {
        this.world = world;
        this.roleManager = roleManager;
    }

    run() {
        for (let role of this.roleManager.roles()) {
            let creeps = this.world.creeps_with_role(role.name);
            log(`${creeps.length} creeps with role ${role.name}`);
            for (let creepEntity of creeps) {
                role.execute(new ScreepsRoleContext(creepEntity.creep, creepEntity));
            }
        }
    }
}
