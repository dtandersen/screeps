import { ScreepsWorld } from "screeps";
import { ScreepRoleContext as ScreepsRoleContext } from "./role";
import { RoleManager } from "./rolemanager";

export class RoleRunner {
    world: ScreepsWorld;
    roleManager: RoleManager;

    constructor(world: ScreepsWorld, roleManager: RoleManager) {
        this.world = world;
        this.roleManager = roleManager;
    }

    run() {
        for (let role of this.roleManager.roles()) {
            // console.log(`running ${role.name}`);
            let creeps = this.world.creeps_with_role(role.name);
            console.log(`${creeps.length} creeps with role ${role.name}`);
            for (let creepEntity of creeps) {
                role.execute(new ScreepsRoleContext(creepEntity.creep, creepEntity));
            }
        }
    }
}
