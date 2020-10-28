import { RoleManager } from "role/rolemanager";
import { ScreepsWorld } from "screeps";

export abstract class Role {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  abstract execute(params: Creep): void;
}

export class RoleRunner {
  world: ScreepsWorld;
  roleManager: RoleManager;

  constructor(world: ScreepsWorld, roleManager: RoleManager) {
    this.world = world;
    this.roleManager = roleManager;
  }

  run() {
    for (let role of this.roleManager.roles()) {
      let creeps = this.world.creeps_with_role(role.name);
      for (let creep of creeps) {
        role.execute(creep);
      }
    }
  }
}
